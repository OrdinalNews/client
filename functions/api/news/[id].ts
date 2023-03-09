import { createResponse, fetchUrl, ordinalsUrlBase } from '../../../lib/api-helpers';
import { OrdinalNews } from '../../../lib/api-types';
import MarkdownIt from 'markdown-it';

export async function onRequest({ params }): Promise<Response> {
  const url = new URL(`/content/${params.id}`, ordinalsUrlBase);
  const content = await fetchUrl(url.toString()).catch(() => undefined);
  if (content === undefined || Object.keys(content).length === 0)
    return createResponse(`Content for ID ${params.id} not found.`, 404);
  const md = new MarkdownIt();
  const news: OrdinalNews = {
    p: content.p,
    op: content.op,
    title: content.title,
    url: content.url,
    body: content.body,
    author: content.author,
  };
  let formattedNews = `<h1>${news.title}</h1>`;
  if (news.url) formattedNews += `\nURL: <a href="${news.url}">${news.url}</a>`;
  if (news.author)
    formattedNews += `\n<span style="font-style:italic">Author: ${news.author}</span>`;
  if (news.body) formattedNews += `<hr />\n${md.render(news.body)}`;
  // TODO: return just md.render(news.body) -> then render on another page?
  return new Response(formattedNews, {
    status: 200,
    headers: { 'Content-Type': 'text/html' },
  });
}
