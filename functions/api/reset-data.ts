import { EventContext } from '@cloudflare/workers-types';
import { createResponse } from '../../lib/api-helpers';
import { Env } from '../../lib/api-types';

export async function onRequest(context: EventContext<Env, any, any>): Promise<Response> {
  /*
  try {
    const { env } = context;
    if (!env.PREVIEW) {
      return createResponse('Feature not available in production.', 403);
    }
    const kvKeyList = await env.ORD_NEWS_INDEX.list();
    for (const key of kvKeyList.keys) {
      await env.ORD_NEWS_INDEX.delete(key.name);
    }
    return createResponse('All KV keys deleted, enjoy the fresh start!');
  } catch (err) {
    return createResponse(err, 500);
  }
  */
  return createResponse('Feature not available.', 403);
}
