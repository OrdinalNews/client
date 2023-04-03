import { EventContext, KVNamespaceListOptions } from '@cloudflare/workers-types';
import { createResponse } from '../../../lib/api-helpers';
import { Env } from '../../../lib/api-types';

export async function onRequest(context: EventContext<Env, any, any>): Promise<Response> {
  try {
    const { env } = context;
    const { searchParams } = new URL(context.request.url);
    const cursor = searchParams.get('cursor');
    const prefix = searchParams.get('prefix');
    const limit = searchParams.get('limit');
    const options: KVNamespaceListOptions = {
      cursor: cursor ?? undefined,
      prefix: prefix ?? undefined,
      limit: limit ? parseInt(limit) : undefined,
    };
    const kvKeyList = await env.ORD_LIST_V2.list({ ...options });
    return createResponse(kvKeyList);
  } catch (err) {
    return createResponse(err, 500);
  }
}
