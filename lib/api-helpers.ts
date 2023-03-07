// returned from ordapi.xyz
export type OrdApiInscription = {
  address: string;
  content: string;
  'content length': string;
  'content type': string;
  'genesis fee': string;
  'genesis height': string;
  'genesis transaction': string;
  id: string;
  inscription_number: number;
  location: string;
  offset: string;
  output: string;
  'output value': string;
  preview: string;
  sat: string;
  timestamp: Date;
  title: string;
};

// returned from api.hiro.so
export type HiroApiInscription = {
  id: string;
  number: number;
  address: string;
  genesis_address: string;
  genesis_block_height: number;
  genesis_block_hash: string;
  genesis_tx_id: string;
  genesis_fee: string; // number?
  genesis_timestamp: number;
  location: string;
  output: string;
  value: string; // is this the content?
  offset: string; // number?
  sat_ordinal: string; // number?
  sat_rarity: string;
  sat_coinbase_height: number;
  mime_type: string;
  content_type: string;
  content_length: 59;
  timestamp: number;
};

// for storage in Cloudflare KV
// can be populated by either API
// used to link different key types
export type InscriptionMeta = {
  id: string;
  number: number;
  content_type: string;
  content_length: number;
  lastUpdated: Date;
};

// for storage in Cloudflare KV
// can be populated by either API
export type InscriptionInfo = {
  id: string; // same in both
  number: number; // inscrpition_number | number
  address: string; // same in both
  content_type: string; // same in both? or "content type" | mime_type
  content_length: number; // "content length" | content_length
  genesis_block_height: number; // "genesis height" | genesis_block_height
  genesis_tx_id: string; // 'genesis transaction' | genesis_tx_id
  timestamp: Date; // timestamp in both, but string vs date
};

// distinguish content-type vs mime-type

// inscription-NUMBER = InscriptionInfo
//   metadata: id, number, content-type, content-length, lastUpdated
//   value: InscriptionInfo type
// inscription-NUMBER-content
//   metadata: id, number, content-type, content-length, lastUpdated
//   value: copy of data from ordinals.com/content
// inscription-NUMBER-details
//   metadata: id, number, content-type, content-length, lastUpdated
//   value: tags, categories, quality, etc (anything used client-side or opinionated)

// takes data and status code and returns a Response object
export function createResponse(data: unknown, status = 200) {
  return new Response(typeof data === 'string' ? data : JSON.stringify(data), { status: status });
}