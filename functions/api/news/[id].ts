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
  const htmlStart = `<html><head><title>${news.title} - Ordinal News Standard</title><style>body { background-color: #000; color: #fff; font-weight: 350; line-height: 1.6; font-size: 1.5em; } body img { filter: brightness(.8) contrast(1.2); } a, a:active, a:visited { color: #1eaab4 } a:hover { color: #2ad0db }</style></head><body>`;
  let formattedNews = `<h1>${news.title}</h1>`;
  if (news.author) formattedNews += `<span style="font-style:italic">Author: ${news.author}</span>`;
  if (news.url) formattedNews += `<br /><a href="${news.url}">${news.url}</a>`;
  if (news.body) formattedNews += `<hr />\n${md.render(news.body)}`;
  const htmlEnd = `</body></html>`;
  // TODO: return just md.render(news.body) -> then render on another page?
  return new Response(htmlStart + formattedNews + htmlEnd, {
    status: 200,
    headers: { 'Content-Type': 'text/html' },
  });
}
