import { createResponse } from '../../lib/api-helpers';

export async function onRequest(): Promise<Response> {
  return createResponse(
    `Welcome to the Ordinal News Indexer! Page not found. Docs coming soon.`,
    404
  );
}
