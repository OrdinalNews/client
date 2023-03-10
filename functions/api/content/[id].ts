import { EventContext } from '@cloudflare/workers-types';
import {
  createResponse,
  fetchContentFromHiro,
  fetchContentFromOrdinals,
} from '../../../lib/api-helpers';
import { Env, InscriptionContent, InscriptionMeta } from '../../../lib/api-types';
import { getOrFetchInscriptionInfo } from '../info/[id]';

export async function onRequest(context: EventContext<Env, any, any>): Promise<Response> {
  try {
    // setup and config
    const { env } = context;
    const id = String(context.params.id);
    const contentData = await getOrFetchInscriptionContent(env, id).catch(err => {
      console.log(`getOrFetchInscriptionContent err: ${err}`);
      return undefined;
    });
    if (
      contentData === undefined ||
      Object.keys(contentData).length === 0 ||
      contentData.content.body === null
    ) {
      return createResponse(`Inscription content not found for ${id}`, 404);
    }
    let { readable, writable } = new TransformStream();
    contentData.content.body.pipeTo(writable);
    return new Response(readable, {
      headers: {
        'Content-Type': contentData.content_type,
      },
    });
  } catch (err) {
    console.log(`500 err: ${err}`);
    return createResponse(err, 500);
  }
}

export async function fetchContentFromKV(
  env: Env,
  id: string
): Promise<(InscriptionMeta & InscriptionContent) | undefined> {
  try {
    // try to fetch the key from KV
    const contentKey = `inscription-${id}-content`;
    const kvContent = await env.ORD_NEWS_INDEX.getWithMetadata(contentKey, { type: 'arrayBuffer' });
    // return if the key is found
    if (kvContent.metadata !== null && kvContent.value !== null) {
      const metadata = kvContent.metadata as InscriptionMeta;
      const contentData = kvContent.value as ArrayBuffer;
      return {
        content: new Response(contentData),
        ...metadata,
      };
    }
  } catch (err) {
    console.log(`fetchContentFromKV err: ${err}`);
    return undefined;
  }
}

export async function getOrFetchInscriptionContent(env: Env, id: string) {
  // try to fetch the key from KV
  const kvContent = await fetchContentFromKV(env, id);
  if (kvContent !== undefined) {
    return kvContent;
  }
  // look up info
  const info = await getOrFetchInscriptionInfo(env, id).catch(() => undefined);
  if (info === undefined || Object.keys(info).length === 0) {
    throw new Error(`Inscription info not found for ${id}`);
  }
  // look up content if not found
  let content = await fetchContentFromHiro(id).catch(() => {
    () => undefined;
  });
  if (content === undefined) {
    content = await fetchContentFromOrdinals(id).catch(() => undefined);
  }
  if (content === undefined || content.body === null) {
    throw new Error(`Inscription content not found for ID: ${id}`);
  }
  // build metadata based on info
  const metadata: InscriptionMeta = {
    id: info.id,
    number: info.number,
    content_type: info.content_type,
    content_length: info.content_length,
    last_updated: new Date().toISOString(),
  };
  // store data in KV for next query
  const contentKey = `inscription-${id}-content`;
  const contentResponse = content.clone();
  await env.ORD_NEWS_INDEX.put(contentKey, await content.arrayBuffer(), { metadata });
  // return data
  return {
    content: contentResponse,
    ...metadata,
  };
}
