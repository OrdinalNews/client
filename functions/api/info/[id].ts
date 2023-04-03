import { EventContext } from '@cloudflare/workers-types';
import { createResponse, getInscription } from '../../../lib/api-helpers';
import { Env, InscriptionMeta } from '../../../lib/api-types';

export async function onRequest(context: EventContext<Env, any, any>): Promise<Response> {
  try {
    // setup and config
    const { env } = context;
    const id = String(context.params.id);
    // get the inscription data
    const inscriptionData = await getInscription(env, id);
    // get the metadata from inscription
    const meta = (({ content, ...inscriptionData }) => inscriptionData)(
      inscriptionData
    ) as InscriptionMeta;
    // return the metadata
    return createResponse(meta);
  } catch (err) {
    // return the error
    return createResponse(String(err), 404);
  }
}
