import { createResponse, fetchUrl, OrdinalNews, ordinalsUrlBase } from '../../../lib/api-helpers';

export async function onRequest(context: any): Promise<Response> {
  const url = new URL(`/content/${context.params.id}`, ordinalsUrlBase);
  const content = await fetchUrl(url.toString()).catch(() => undefined);
  if (content === undefined || Object.keys(content).length === 0)
    return createResponse(`Content for ID ${context.params.id} not found.`, 404);
  const news: OrdinalNews = {
    p: content.p,
    op: content.op,
    title: content.title,
    url: content.url,
    body: content.body,
    author: content.author,
  };
  return new Response(JSON.stringify(news, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
