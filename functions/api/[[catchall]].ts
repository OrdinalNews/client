import { createResponse } from '../../lib/api-helpers';

export async function onRequest({ request }): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;
  return createResponse(
    `Welcome to the Ordinal News Indexer and API!\n\n
    More information can be found in the docs: https://docs.inscribe.news/api\n\n
    Supported routes below, where ID = inscription ID or number:\n\n
  /api/info/ID - returns inscription data (all)\n
  /api/content/ID - returns inscription content (all)\n
  /api/news/ID - returns html from news inscription body (news only)\n
  /api/data/ID - returns inscription data and content (news only)\n
  /api/data/ord-news - returns all known news inscriptions in KV\n
  /api/data/ord-list - returns all known inscriptions in KV\n\n
current path: ${path}`
  );
}
