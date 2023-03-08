import { createResponse } from '../../lib/api-helpers';

export async function onRequest({ request }): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;
  return createResponse(
    `Welcome to the Ordinal News Indexer and API! Supported routes below:\n\n
  /api/inscription/INSCRIPTION_ID - returns inscription data\n
  /api/content/INSCRIPTION_ID - returns inscription content\n
  /api/news/INSCRIPTION_ID - returns html from news inscription\n\n
current path: ${path}`
  );
}
