import throttledQueue from 'throttled-queue';
import {
  HiroApiInscription,
  HiroApiResponse,
  InscriptionInfo,
  OrdApiInscription,
} from './api-types';

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

// base API definitions
export const ordinalsUrlBase = new URL('https://ordinals.com/');
export const ordApiUrlBase = new URL('https://ordapi.xyz/');
export const hiroUrlBase = new URL('https://api.hiro.so/');

// takes data and status code and returns a Response object
export function createResponse(data: unknown, status = 200) {
  return new Response(typeof data === 'string' ? data : JSON.stringify(data, null, 2), {
    status: status,
  });
}

// fetchs hiro api inscription results
// and formats/returns them as InscriptionInfo
export async function fetchInfoFromHiro(id: string): Promise<InscriptionInfo> {
  const url = new URL(`/inscriptions/${id}`, hiroUrlBase);
  const data = await fetchUrl(url.toString()).catch(() => {});
  if (data === undefined || Object.keys(data).length === 0) {
    throw new Error(`fetchInfoFromHiro: ${url} returned no data`);
  }
  const apiData = data as HiroApiInscription;
  const info: InscriptionInfo = {
    id: apiData.id,
    number: apiData.number,
    address: apiData.address,
    content_type: apiData.content_type,
    content_length: apiData.content_length,
    genesis_block_height: apiData.genesis_block_height,
    genesis_tx_id: apiData.tx_id,
    timestamp: new Date(apiData.timestamp).toISOString(),
  };
  return info;
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

// fetchs hiro api content results
export async function fetchContentFromHiro(id: string): Promise<Response> {
  const url = new URL(`/ordinals/v1/inscriptions/${id}/content`, hiroUrlBase);
  const response = await throttle(() => fetch(url.toString()).catch(() => {}));
  if (response === undefined) {
    throw new Error(`fetchContentFromHiro: ${url} returned no data`);
  }
  return response;
}

// fetches ordinals.com/content results
export async function fetchContentFromOrdinals(id: string): Promise<Response> {
  const url = new URL(`/content/${id}`, ordinalsUrlBase);
  const response = await throttle(() => fetch(url.toString()).catch(() => {}));
  // const data = await fetchUrl(url.toString()).catch(() => {});
  if (response === undefined) {
    throw new Error(`fetchContentFromOrdinals: ${url} returned no data`);
  }
  return response;
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
