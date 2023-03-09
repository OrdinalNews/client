import { EventContext } from '@cloudflare/workers-types';
import { createResponse, fetchInfoFromOrdApi } from '../../../lib/api-helpers';
import { Env, InscriptionInfo, InscriptionMeta } from '../../../lib/api-types';

export async function onRequest(context: EventContext<Env, any, any>): Promise<Response> {
  try {
    // setup and config
    const { env } = context;
    const id = String(context.params.id);
    return createResponse(await getOrFetchInscriptionInfo(env, id));
  } catch (err) {
    return createResponse(err, 500);
  }
}

export async function fetchInfoFromKV(
  env: Env,
  id: string
): Promise<(InscriptionMeta & InscriptionInfo) | undefined> {
  try {
    // try to fetch the key from KV
    const infoKey = `inscription-${id}-info`;
    const kvInfo = await env.ORD_NEWS_INDEX.getWithMetadata(infoKey, { type: 'json' });
    // return if the key is found
    if (kvInfo.metadata !== null && kvInfo.value !== null) {
      const metadata = kvInfo.metadata as InscriptionMeta;
      const info = kvInfo.value as InscriptionInfo;
      return {
        ...info,
        ...metadata,
      };
    }
  } catch (err) {
    return undefined;
  }
}

export async function getOrFetchInscriptionInfo(env: Env, id: string) {
  // try to fetch the key from KV
  const kvInfo = await fetchInfoFromKV(env, id);
  if (kvInfo !== undefined) {
    return kvInfo;
  }
  // look up info if not found
  const info = await fetchInfoFromOrdApi(id).catch(() => undefined);
  if (info === undefined || Object.keys(info).length === 0) {
    throw new Error(`Inscription info not found for ${id}`);
  }
  // build metadata based info
  const metadata: InscriptionMeta = {
    id: info.id,
    number: info.number,
    content_type: info.content_type,
    content_length: info.content_length,
    last_updated: new Date().toISOString(),
  };
  // store data in KV for next query
  const infoKey = `inscription-${id}-info`;
  await env.ORD_NEWS_INDEX.put(infoKey, JSON.stringify(info), { metadata });
  // return data
  return {
    ...info,
    ...metadata,
  };
}
