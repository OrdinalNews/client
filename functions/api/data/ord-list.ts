import {
  EventContext,
  KVNamespaceListKey,
  KVNamespaceListOptions,
} from '@cloudflare/workers-types';
import { createResponse } from '../../../lib/api-helpers';
import { Env } from '../../../lib/api-types';

export async function onRequest(context: EventContext<Env, any, any>): Promise<Response> {
  try {
    const { env } = context;
    const options: KVNamespaceListOptions = {
      cursor: undefined,
    };
    let complete = false;
    const keys: KVNamespaceListKey<unknown, string>[] = [];
    do {
      const kvKeyList = await env.ORD_LIST.list({ ...options });
      if (kvKeyList.keys.length > 0) {
        keys.push(...kvKeyList.keys);
      }
      if (kvKeyList.list_complete) {
        complete = true;
      }
      if ('cursor' in kvKeyList) {
        options.cursor = kvKeyList.cursor;
      }
    } while (complete === false);

    return createResponse(keys);
  } catch (err) {
    return createResponse(err, 500);
  }
}
