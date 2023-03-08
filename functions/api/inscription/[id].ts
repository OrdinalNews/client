import { createResponse, fetchUrl, ordApiUrlBase } from '../../../lib/api-helpers';

export async function onRequest({ params }): Promise<Response> {
  const url = new URL(`/inscription/${params.id}`, ordApiUrlBase);
  const info = await fetchUrl(url.toString()).catch(() => undefined);
  if (info === undefined || Object.keys(info).length === 0)
    return createResponse(`Inscription for ID ${params.id} not found.`, 404);
  return createResponse(info);
}
