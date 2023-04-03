import { EventContext } from '@cloudflare/workers-types';
import { createResponse, getInscription } from '../../../lib/api-helpers';
import { Env, InscriptionMeta } from '../../../lib/api-types';

export async function onRequest(context: EventContext<Env, any, any>): Promise<Response> {
  try {
    // setup and config
    const { env } = context;
    const id = String(context.params.id);
    console.log(`id: ${id}`);
    const inscriptionData = await getInscription(env, id).catch(err => {
      console.log(String(err));
      return undefined;
    });
    console.log(`inscriptionData: ${JSON.stringify(inscriptionData)}`);
    if (inscriptionData === undefined) {
      return createResponse(`Inscription info not found for ${id}`, 404);
    }
    const meta = (({ content, ...inscriptionData }) => inscriptionData)(
      inscriptionData
    ) as InscriptionMeta;
    return createResponse(meta);
  } catch (err) {
    return createResponse(String(err), 500);
  }
}
