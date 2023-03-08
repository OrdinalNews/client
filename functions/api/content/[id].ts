import { EventContext } from '@cloudflare/workers-types';
import {
  createResponse,
  Env,
  fetchUrl,
  InscriptionInfo,
  InscriptionMeta,
  OrdApiInscription,
  ordinalsUrlBase,
} from '../../../lib/api-helpers';

export async function onRequest(context: EventContext<Env, any, any>): Promise<Response> {
  try {
    // try to fetch the key from KV
    const { env } = context;
    const id = context.params.id;
    const keyName = `inscription-${id}-info`;
    const KVContent = await env.ORD_NEWS_INDEX.getWithMetadata(keyName, { type: 'json' });
    // return if the key is found
    console.log(KVContent);
    if (KVContent.metadata !== null && KVContent.value !== null) {
      const metadata = KVContent.metadata as InscriptionMeta;
      const content = KVContent.value as any;
      return createResponse({
        ...content,
        ...metadata,
      });
    }
    // look up info if not found
    const url = new URL(`/content/${id}`, ordinalsUrlBase);
    const content = await fetchUrl(url.toString()).catch(() => undefined);
    if (content === undefined || Object.keys(content).length === 0) {
      return createResponse(`Content not found for ID: ${id}`, 404);
    }
    const apiContent = content as OrdApiInscription;
    // TODO: NEED TO QUERY INSCRIPTION DATA HERE TOO
    // WOULD BE GREAT TO CALL INSCRIPTION FUNCTION
    // NEED TO SEPARATE AS HELPERS TO ONREQUEST
    // AND TRY EXPORTING FOR USE ELSEWHERE
    console.log(`apiContent: ${JSON.stringify(apiContent, null, 2)}`);
    // make sure IDs match
    if (apiContent.id !== id) {
      return createResponse(`Content ID mismatch: ${content.id} !== ${id}`, 500);
    }
    // build data based on api types
    const metadata: InscriptionMeta = {
      id: apiContent.id,
      number: apiContent.inscription_number,
      content_type: apiContent['content type'],
      content_length: Number(apiContent['content length']),
      last_updated: new Date().toISOString(),
    };
    const txid = apiContent['genesis transaction'].split('/').pop();
    const value: InscriptionInfo = {
      id: apiContent.id,
      number: apiContent.inscription_number,
      address: apiContent.address,
      content_type: apiContent['content type'],
      content_length: Number(apiContent['content length']),
      genesis_block_height: Number(apiContent['genesis height']),
      genesis_tx_id: txid ? txid : apiContent['genesis transaction'],
      timestamp: new Date(apiContent.timestamp).toISOString(),
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
