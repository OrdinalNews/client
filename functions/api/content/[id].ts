import { createResponse, fetchUrl, ordinalsUrlBase } from '../../../lib/api-helpers';

export async function onRequest(context: any): Promise<Response> {
  const url = new URL(`/content/${context.params.id}`, ordinalsUrlBase);
  const content = await fetchUrl(url.toString()).catch(() => undefined);
  if (content === undefined || Object.keys(content).length === 0)
    return createResponse(`Content for ID ${context.params.id} not found.`, 404);
  return createResponse(content);
}
