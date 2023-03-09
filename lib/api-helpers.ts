import throttledQueue from 'throttled-queue';
import { InscriptionInfo, OrdApiInscription } from './api-types';

// throttle to 1 request per second
const throttle = throttledQueue(1, 1000, true);

export async function fetchUrl(url: string) {
  const response = await throttle(() => fetch(url));
  if (response.status === 200) {
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }
  throw new Error(`fetchUrl: ${url} ${response.status} ${response.statusText}`);
}

// fetches ordapi.xyz inscription results
// and formats/returns them as InscriptionInfo
export async function fetchInfoFromOrdApi(id: string): Promise<InscriptionInfo> {
  const url = new URL(`/inscription/${id}`, ordApiUrlBase);
  const data = await fetchUrl(url.toString()).catch(() => {});
  if (data === undefined || Object.keys(data).length === 0) {
    throw new Error(`fetchInfoFromOrdApi: ${url} returned no data`);
  }
  const apiData = data as OrdApiInscription;
  const txid = apiData['genesis transaction'].split('/').pop();
  const contentLength = apiData['content length'].replace(' bytes', '');
  const genesisBlock = apiData['genesis height'].replace('/block/', '');
  const info: InscriptionInfo = {
    id: apiData.id,
    number: apiData.inscription_number,
    address: apiData.address,
    content_type: apiData['content type'],
    content_length: Number(contentLength),
    genesis_block_height: Number(genesisBlock),
    genesis_tx_id: txid ? txid : apiData['genesis transaction'],
    timestamp: new Date(apiData.timestamp).toISOString(),
  };
  return info;
}

// fetches ordinals.com/content results
// and not sure what to do with types here
export async function fetchContentFromOrdinals(id: string): Promise<Response> {
  const url = new URL(`/content/${id}`, ordinalsUrlBase);
  const response = await throttle(() => fetch(url.toString()).catch(() => {}));
  // const data = await fetchUrl(url.toString()).catch(() => {});
  if (response === undefined) {
    throw new Error(`fetchContentFromOrdinals: ${url} returned no data`);
  }
  return response;
}

// both support /inscription and /content paths
export const ordinalsUrlBase = new URL('https://ordinals.com/');
export const ordApiUrlBase = new URL('https://ordapi.xyz/');

// takes data and status code and returns a Response object
export function createResponse(data: unknown, status = 200) {
  return new Response(typeof data === 'string' ? data : JSON.stringify(data, null, 2), {
    status: status,
  });
}

// distinguish content-type vs mime-type

// inscription-NUMBER-info = InscriptionInfo
//   metadata: id, number, content-type, content-length, lastUpdated
//   value: InscriptionInfo type
// inscription-NUMBER-content
//   metadata: id, number, content-type, content-length, lastUpdated
//   value: copy of data from ordinals.com/content
// inscription-NUMBER-details
//   metadata: id, number, content-type, content-length, lastUpdated
//   value: tags, categories, quality, etc (anything used client-side or opinionated)
