import MarkdownIt from 'markdown-it';
import { EventContext } from '@cloudflare/workers-types';
import { createResponse, getInscription } from '../../../lib/api-helpers';
import { Env, OrdinalNews } from '../../../lib/api-types';

export async function onRequest(context: EventContext<Env, any, any>): Promise<Response> {
  const { env } = context;
  const id = String(context.params.id);
  const inscriptionData = await getInscription(env, id);
  if (inscriptionData === undefined || inscriptionData.content.body === null) {
    return createResponse(`Inscription content not found for ${id}`, 404);
  }
  const content = await inscriptionData.content.text();
  let news: OrdinalNews;
  try {
    const contentObj = JSON.parse(content);
    news = {
      p: contentObj.p,
      op: contentObj.op,
      title: contentObj.title,
      url: contentObj.url,
      body: contentObj.body,
      author: contentObj.author,
      authorAddress: contentObj.authorAddress,
      signature: contentObj.signature,
    };
  } catch (err) {
    return createResponse(`Unable to parse news inscription for ${id}`, 404);
  }

  const md = new MarkdownIt();
  if (!news.body) {
    return createResponse(`No body found for ${id}`, 404);
  }
  return new Response(md.render(news.body), {
    status: 200,
    headers: { 'Content-Type': 'text/html' },
  });
}

/*
OLD CODE RETURNING HTML PAGE

const htmlStart = `<html><head><title>${news.title} - Ordinal News Standard</title><style>body { background-color: #000; color: #fff; font-weight: 350; line-height: 1.6; font-size: 1.5em; } a, a:active, a:visited { color: #1eaab4 } a:hover { color: #2ad0db }</style></head><body>`;
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

*/
