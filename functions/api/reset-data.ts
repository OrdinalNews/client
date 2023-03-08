import { EventContext } from '@cloudflare/workers-types';
import { createResponse } from '../../lib/api-helpers';
import { Env } from '../../lib/api-types';

export async function onRequest(context: EventContext<Env, any, any>): Promise<Response> {
  try {
    const { env } = context;
    const kvKeyList = await env.ORD_NEWS_INDEX.list();
    for (const key of kvKeyList.keys) {
      await env.ORD_NEWS_INDEX.delete(key.name);
    }
    return createResponse('all KV keys deleted');
  } catch (err) {
    return createResponse(err, 500);
  }
}
