import { createResponse } from '../../../lib/api-helpers';

export async function onRequest(context: any): Promise<Response> {
  return createResponse(
    `Inscription content endpoint: ${context.request.url} ${context.params.id}`
  );
}
