import throttledQueue from 'throttled-queue';
import {
  Env,
  HiroApiInscription,
  InscriptionContent,
  InscriptionMeta,
  OrdApiInscription,
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

// base API definitions
export const ordinalsUrl = new URL('https://ordinals.com/');
export const ordApiUrl = new URL('https://ordapi.xyz/');
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
  try {
    // try to get from KV
    const kvData = await env.ORD_LIST.getWithMetadata(id, { type: 'arrayBuffer' });
    if (kvData.metadata !== null && kvData.value !== null) {
      const metadata = kvData.metadata as InscriptionMeta;
      const content = kvData.value as ArrayBuffer;
      return {
        content: new Response(content),
        ...metadata,
      };
    }
  } catch (err) {
    console.log(`getInscription err: ${err}`);
  }
  // if not in KV, fetch metadata:
  let metadata = await fetchMetaFromHiro(id).catch(() => undefined);
  if (metadata === undefined) {
    metadata = await fetchMetaFromOrdApi(id).catch(() => undefined);
  }
  if (metadata === undefined || Object.keys(metadata).length === 0) {
    throw new Error(`getInscription: metadata not found for ${id}`);
  }
  // then fetch content:
  let content = await fetchContentFromHiro(id).catch(() => undefined);
  if (content === undefined) {
    content = await fetchContentFromOrdinals(id).catch(() => undefined);
  }
  if (content === undefined) {
    throw new Error(`getInscription: content not found for ${id}`);
  }
  // test if valid by Ordinals News Standard
  const newsContent = content.clone();
  const contentString = new TextDecoder().decode(await newsContent.arrayBuffer());
  let news: OrdinalNews;
  try {
    // parse data and store in news KV
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
      const kvNewsContent = content.clone();
      await env.ORD_NEWS.put(id, await kvNewsContent.arrayBuffer(), { metadata });
    }
  } catch (err) {
    console.log(`Not a valid news inscription: ${id}\n${err}`);
  }
  // store in KV
  const kvContent = content.clone();
  await env.ORD_LIST.put(id, await kvContent.arrayBuffer(), { metadata });
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

// fetch inscription data from ordapi.xyz
// returns metadata for KV key
export async function fetchMetaFromOrdApi(id: string): Promise<InscriptionMeta> {
  const url = new URL(`/inscription/${id}`, ordApiUrl);
  const data = await fetchUrl(url.toString()).catch(() => {});
  if (data === undefined || Object.keys(data).length === 0) {
    throw new Error(`fetchMetaFromOrdApi: returned no data: ${url}`);
  }
  const apiData = data as OrdApiInscription;
  const txid = apiData['genesis transaction'].split('/').pop();
  const contentLength = apiData['content length'].replace(' bytes', '');
  const genesisBlock = apiData['genesis height'].replace('/block/', '');
  const metadata: InscriptionMeta = {
    id: apiData.id,
    number: apiData.inscription_number,
    address: apiData.address,
    content_type: apiData['content type'],
    content_length: Number(contentLength),
    genesis_block_height: Number(genesisBlock),
    genesis_tx_id: txid ? txid : apiData['genesis transaction'],
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

// fetches ordinals.com/content results
export async function fetchContentFromOrdinals(id: string): Promise<Response> {
  const url = new URL(`/content/${id}`, ordinalsUrl);
  const response = await fetch(url.toString()).catch(() => undefined);
  if (response === undefined) {
    throw new Error(`fetchContentFromOrdinals: returned no data: ${url}`);
  }
  return response;
}
