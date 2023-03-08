import { createResponse } from '../../lib/api-helpers';

export async function onRequest(): Promise<Response> {
  return createResponse(
    `Welcome to the Ordinal News Indexer! Supported routes below:\n\n
    /api/inscription/INSCRIPTION_ID - returns inscription data\n
    /api/content/INSCRIPTION_ID - returns inscription content\n
    /api/news/INSCRIPTION_ID - returns html from news inscription`
  );
}
