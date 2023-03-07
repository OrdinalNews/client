import { createResponse } from '../../../lib/api-helpers';

export async function onRequest(): Promise<Response> {
  return createResponse(`Inscription content endpoint: requires inscription ID after the URL.`);
}
