import { EventContext } from '@cloudflare/workers-types';
import { createResponse, getInscription } from '../../../lib/api-helpers';
import { Env, InscriptionMeta, OrdinalNews } from '../../../lib/api-types';

export async function onRequest(context: EventContext<Env, any, any>): Promise<Response> {
  try {
    // setup and config
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
    } catch (err) {
      throw new Error(`Unable to parse news inscription for ${id}`);
    }
    // get the metadata from inscription
    const meta = (({ content, ...inscriptionData }) => inscriptionData)(
      inscriptionData
    ) as InscriptionMeta;
    // return the metadata and news data
    return createResponse({ ...meta, ...news });
  } catch (err) {
    // return the error
    return createResponse(String(err), 404);
  }
}
