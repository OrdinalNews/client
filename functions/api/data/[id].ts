import { EventContext } from '@cloudflare/workers-types';
import { createResponse, getInscription } from '../../../lib/api-helpers';
import { Env, InscriptionMeta, OrdinalNews } from '../../../lib/api-types';

export async function onRequest(context: EventContext<Env, any, any>): Promise<Response> {
  try {
    // setup and config
    const { env } = context;
    const id = String(context.params.id);
    const inscriptionData = await getInscription(env, id).catch(() => undefined);
    if (inscriptionData === undefined || inscriptionData.content.body === null) {
      return createResponse(`Inscription data not found for ${id}`, 404);
    }
    let news: OrdinalNews;
    try {
      const content = await inscriptionData.content.text();
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
      return createResponse(`Unable to parse news inscription for ${id}\n${String(err)}`, 404);
    }
    const meta = (({ content, ...inscriptionData }) => inscriptionData)(
      inscriptionData
    ) as InscriptionMeta;
    return createResponse({ ...meta, ...news });
  } catch (err) {
    return createResponse(String(err), 500);
  }
}
