import throttledQueue from 'throttled-queue';
import {
  Env,
  HiroApiInscription,
  InscriptionContent,
  InscriptionMeta,
  OrdinalNews,
} from './api-types';

/////////////////////////
// GENERAL
/////////////////////////

// 2 requests per second
const throttle = throttledQueue(1, 500, true);

export async function fetchUrl(url: string) {
  const response = await throttle(() => fetch(url));
  if (response.status === 200) {
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }
  throw new Error(`fetchUrl: ${url} ${response.status} ${response.statusText}`);
}

// base API definition
export const hiroApiUrl = new URL('https://api.hiro.so/');

// takes data and status code and returns a Response object
export function createResponse(data: unknown, status = 200) {
  return new Response(typeof data === 'string' ? data : JSON.stringify(data, null, 2), {
    status: status,
  });
}

/////////////////////////
// GETTERS
/////////////////////////

// used by API with KV support through Env
export async function getInscription(
  env: Env,
  id: string
): Promise<InscriptionMeta & InscriptionContent> {
  // try to get from V2 KV key
  try {
    const kvData = await env.ORD_LIST_V2.getWithMetadata(id, { type: 'arrayBuffer' });
    if (kvData.metadata !== null && kvData.value !== null) {
      const metadata = kvData.metadata as InscriptionMeta;
      const content = kvData.value as ArrayBuffer;
      return {
        content: new Response(content),
        ...metadata,
      };
    }
  } catch (err) {
    console.log(`getInscription: unable to retrieve from V2 KV key\n${err}`);
  }
  // try to get from V1 KV key
  let metadata: InscriptionMeta | undefined;
  let content: Response | undefined;
  try {
    const kvData = await env.ORD_LIST.getWithMetadata(id, { type: 'arrayBuffer' });
    if (kvData.metadata !== null && kvData.value !== null) {
      metadata = kvData.metadata as InscriptionMeta;
      content = new Response(kvData.value as ArrayBuffer);
    }
  } catch {
    console.log(`getInscription: unable to retrieve from V1 KV key`);
    // fetch metadata and content from Hiro API
    // works with inscription ID or inscription number
    metadata = await fetchMetaFromHiro(id).catch(() => undefined);
    content = await fetchContentFromHiro(id).catch(() => undefined);
  }
  // check that data was actually returned
  if (metadata === undefined || Object.keys(metadata).length === 0) {
    throw new Error(`getInscription: metadata not found for ${id}`);
  }
  if (content === undefined) {
    throw new Error(`getInscription: content not found for ${id}`);
  }
  // test if valid by Ordinals News Standard
  const newsContent = content.clone();
  const contentString = new TextDecoder().decode(await newsContent.arrayBuffer());
  let news: OrdinalNews;
  try {
    // parse data from content
    const contentObj = JSON.parse(contentString);
    news = {
      p: contentObj.p,
      op: contentObj.op,
      title: contentObj.title,
      url: contentObj.url,
      body: contentObj.body,
      author: contentObj.author,
      authorAddress: contentObj.authorAddress,
      signature: contentObj.signature,
    };
    // check that it's a valid news inscription
    if (news.p === 'ons' && news.title) {
      // if yes, store in V2 KV key for news only
      const kvNewsContent = content.clone();
      await env.ORD_NEWS_V2.put(
        `inscription-${metadata.number}`,
        await kvNewsContent.arrayBuffer(),
        { metadata }
      );
    }
  } catch (err) {
    console.log(`Not a valid news inscription: ${id}\n${err}`);
  }
  // store in general V2 KV key for inscriptions
  const kvContent = content.clone();
  await env.ORD_LIST_V2.put(`inscription-${metadata.number}`, await kvContent.arrayBuffer(), {
    metadata,
  });
  // return data
  return {
    content,
    ...metadata,
  };
}

/////////////////////////
// FETCH INFO
/////////////////////////

// fetch inscription data from Hiro
// returns metadata for KV key
export async function fetchMetaFromHiro(id: string): Promise<InscriptionMeta> {
  const url = new URL(`/ordinals/v1/inscriptions/${id}`, hiroApiUrl);
  const data = await fetchUrl(url.toString()).catch(() => {});
  if (data === undefined || Object.keys(data).length === 0) {
    throw new Error(`fetchMetaFromHiro: returned no data: ${url}`);
  }
  const apiData = data as HiroApiInscription;
  const metadata: InscriptionMeta = {
    id: apiData.id,
    number: apiData.number,
    address: apiData.address,
    content_type: apiData.content_type,
    content_length: apiData.content_length,
    genesis_block_height: apiData.genesis_block_height,
    genesis_tx_id: apiData.genesis_tx_id,
    timestamp: new Date(apiData.timestamp).toISOString(),
    last_updated: new Date().toISOString(),
  };
  return metadata;
}

/////////////////////////
// FETCH CONTENT
/////////////////////////

// fetchs hiro api content results
export async function fetchContentFromHiro(id: string): Promise<Response> {
  const url = new URL(`/ordinals/v1/inscriptions/${id}/content`, hiroApiUrl);
  const response = await fetch(url.toString()).catch(() => undefined);
  if (response === undefined) {
    throw new Error(`fetchContentFromHiro: returned no data: ${url}`);
  }
  return response;
}
