import { EventContext, KVNamespace, PagesFunction } from '@cloudflare/workers-types';
import { createResponse, Env } from '../../lib/api-helpers';

/*
export const onRequest: PagesFunction<{ ORD_NEWS_INDEX: KVNamespace }> = async ({ env }) => {
  const kvKeyList = await env.ORD_NEWS_INDEX.list();
  return new Response(JSON.stringify(kvKeyList, null, 2));
};
*/

export async function onRequest(context: EventContext<Env, any, any>): Promise<Response> {
  const { env } = context;
  console.log(`env: ${JSON.stringify(env)}`);
  const kvKeyList = await env.ord_news_index.list();
  return createResponse(kvKeyList);
}
