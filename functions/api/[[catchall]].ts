import { createResponse } from '../../lib/api-helpers';

export async function onRequest({ request }): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;
  return createResponse(
    `Welcome to the Ordinal News Indexer and API! Supported routes below:\n\n
  /api/info/INSCRIPTION_ID - returns inscription data (all)\n
  /api/content/INSCRIPTION_ID - returns inscription content (all)\n
  /api/news/INSCRIPTION_ID - returns html from news inscription body (news only)\n
  /api/data/INSCRIPTION_ID - returns inscription data and content (news only)\n
  /api/data/ord-news - returns all known news inscriptions in KV\n
  /api/data/ord-list - returns all known inscriptions in KV\n\n
current path: ${path}`
  );
}
