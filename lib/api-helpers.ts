import throttledQueue from 'throttled-queue';

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
