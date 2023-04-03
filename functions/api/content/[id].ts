import { EventContext } from '@cloudflare/workers-types';
import { createResponse, getInscription } from '../../../lib/api-helpers';
import { Env } from '../../../lib/api-types';

export async function onRequest(context: EventContext<Env, any, any>): Promise<Response> {
  try {
    // setup and config
    const { env } = context;
    const id = String(context.params.id);
    // get the inscription data
    const inscriptionData = await getInscription(env, id);
    // verify content body exists
    if (inscriptionData.content.body === null) {
      throw new Error(`Inscription content not found for ${id}`);
    }
    // return the content
    let { readable, writable } = new TransformStream();
    inscriptionData.content.body.pipeTo(writable);
    return new Response(readable, {
      headers: {
        'Content-Type': inscriptionData.content_type,
      },
    });
  } catch (err) {
    // return the error
    return createResponse(String(err), 404);
  }
}
