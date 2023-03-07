import { createResponse } from '../../../lib/api-helpers';

export async function onRequest(): Promise<Response> {
  return createResponse(`Test route`);
}
