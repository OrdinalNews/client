import { EventContext } from '@cloudflare/workers-types';
import {
  createResponse,
  Env,
  fetchUrl,
  InscriptionInfo,
  InscriptionMeta,
  OrdApiInscription,
  ordApiUrlBase,
} from '../../../lib/api-helpers';

export async function onRequest(context: EventContext<Env, any, any>): Promise<Response> {
  try {
    // try to fetch the key from KV
    const { env } = context;
    const id = context.params.id;
    const keyName = `inscription-${id}-info`;
    const KVInfo = await env.ORD_NEWS_INDEX.getWithMetadata(keyName, { type: 'json' });
    // return if the key is found
    if (KVInfo.metadata !== null && KVInfo.value !== null) {
      const metadata = KVInfo.metadata as InscriptionMeta;
      const info = KVInfo.value as InscriptionInfo;
      return createResponse({
        ...info,
        ...metadata,
      });
    }
    // look up info if not found
    const url = new URL(`/inscription/${id}`, ordApiUrlBase);
    const info = await fetchUrl(url.toString()).catch(() => undefined);
    if (info === undefined || Object.keys(info).length === 0) {
      return createResponse(`Inscription info not found for ${id}`, 404);
    }
    const apiInfo = info as OrdApiInscription;
    console.log(`apiInfo: ${JSON.stringify(apiInfo, null, 2)}`);
    // make sure IDs match
    if (apiInfo.id !== id) {
      return createResponse(`Inscription ID mismatch: ${apiInfo.id} !== ${id}`, 500);
    }
    // build data based on api types
    const metadata: InscriptionMeta = {
      id: apiInfo.id,
      number: apiInfo.inscription_number,
      content_type: apiInfo['content type'],
      content_length: Number(apiInfo['content length']),
      last_updated: new Date().toISOString(),
    };
    const txid = apiInfo['genesis transaction'].split('/').pop();
    const value: InscriptionInfo = {
      id: apiInfo.id,
      number: apiInfo.inscription_number,
      address: apiInfo.address,
      content_type: apiInfo['content type'],
      content_length: Number(apiInfo['content length'].replace(' bytes', '')),
      genesis_block_height: Number(apiInfo['genesis height']),
      genesis_tx_id: txid ? txid : apiInfo['genesis transaction'],
      timestamp: new Date(apiInfo.timestamp).toISOString(),
    };
    // store data in KV for next query
    await env.ORD_NEWS_INDEX.put(keyName, JSON.stringify(value), { metadata });
    // return data
    return createResponse({
      ...value,
      ...metadata,
    });
  } catch (err) {
    return createResponse(err, 500);
  }
}

export async function onRequest2({ params }): Promise<Response> {
  const url = new URL(`/inscription/${params.id}`, ordApiUrlBase);
  const info = await fetchUrl(url.toString()).catch(() => undefined);
  if (info === undefined || Object.keys(info).length === 0)
    return createResponse(`Inscription for ID ${params.id} not found.`, 404);
  return createResponse(info);
}
