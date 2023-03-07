import { createResponse, fetchUrl, ordApiUrlBase } from '../../../lib/api-helpers';

export async function onRequest(context: any): Promise<Response> {
  const url = new URL(`/inscription/${context.params.id}`, ordApiUrlBase);
  const info = await fetchUrl(url.toString()).catch(() => undefined);
  if (info === undefined || Object.keys(info).length === 0)
    return createResponse(`Inscription for ID ${context.params.id} not found.`, 404);
  return createResponse(info);
}
