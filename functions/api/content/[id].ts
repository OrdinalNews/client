import { EventContext } from '@cloudflare/workers-types';
import { createResponse, getInscription } from '../../../lib/api-helpers';
import { Env } from '../../../lib/api-types';

export async function onRequest(context: EventContext<Env, any, any>): Promise<Response> {
  try {
    // setup and config
    const { env } = context;
    const id = String(context.params.id);
    const inscriptionData = await getInscription(env, id);
    if (
      inscriptionData === undefined ||
      Object.keys(inscriptionData).length === 0 ||
      inscriptionData.content.body === null
    ) {
      return createResponse(`Inscription content not found for ${id}`, 404);
    }
    let { readable, writable } = new TransformStream();
    inscriptionData.content.body.pipeTo(writable);
    return new Response(readable, {
      headers: {
        'Content-Type': inscriptionData.content_type,
      },
    });
  } catch (err) {
    console.log(`500 err: ${err}`);
    return createResponse(err, 500);
  }
}
