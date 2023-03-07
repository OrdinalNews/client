import { createResponse } from '../../../lib/api-helpers';

export async function onRequest(context: any): Promise<Response> {
  return createResponse(`Looking up INFO for ${context.params.id}`);
}