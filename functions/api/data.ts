import { EventContext } from '@cloudflare/workers-types';
import { createResponse, Env } from '../../lib/api-helpers';

export async function onRequest(context: EventContext<Env, any, any>): Promise<Response> {
  try {
    const { env } = context;
    const kvKeyList = await env.ORD_NEWS_INDEX.list();
    return createResponse(kvKeyList);
  } catch (err) {
    return createResponse(err, 500);
  }
}
