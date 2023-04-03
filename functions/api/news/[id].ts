import MarkdownIt from 'markdown-it';
import { EventContext } from '@cloudflare/workers-types';
import { createResponse, getInscription } from '../../../lib/api-helpers';
import { Env, OrdinalNews } from '../../../lib/api-types';

export async function onRequest(context: EventContext<Env, any, any>): Promise<Response> {
  try {
    const { env } = context;
    const id = String(context.params.id);
    // get the inscription data
    const inscriptionData = await getInscription(env, id);
    // verify content body exists
    if (inscriptionData.content.body === null) {
      throw new Error(`Inscription content not found for ${id}`);
    }
    // get the content
    const content = await inscriptionData.content.text();
    // try to parse it as a news ordinal
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
      if (!news.body) {
        throw new Error(`No body found for ${id}`);
      }
      const md = new MarkdownIt();
      return new Response(md.render(news.body), {
        status: 200,
        headers: { 'Content-Type': 'text/html' },
      });
    } catch (err) {
      throw err;
    }
  } catch (err) {
    // return the error
    return createResponse(String(err), 404);
  }
}
