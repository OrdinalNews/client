import { EventContext } from '@cloudflare/workers-types';
import { createResponse } from '../../../lib/api-helpers';
import { Env } from '../../../lib/api-types';

export async function onRequest(context: EventContext<Env, any, any>): Promise<Response> {
  try {
    const { env } = context;
    const kvKeyList = await env.ORD_NEWS.list();
    return createResponse(kvKeyList);
  } catch (err) {
    return createResponse(err, 500);
  }
}
