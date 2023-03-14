import { KVNamespace } from '@cloudflare/workers-types';

// KV binding
export interface Env {
  ORD_DATA: KVNamespace;
  ORD_LIST: KVNamespace;
  ORD_NEWS: KVNamespace;
  ORD_NEWS_INDEX: KVNamespace;
  PREVIEW: string;
  CF_PAGES_BRANCH: string;
}

// returned from ordapi.xyz
// TODO: changed since last look?
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
export type HiroApiResponse = {
  limit: number;
  offset: number;
  total: number;
  results: HiroApiInscription[];
};

export type HiroApiInscription = {
  id: string;
  number: number;
  address: string;
  genesis_address: string;
  genesis_block_height: number;
  genesis_block_hash: string;
  genesis_tx_id: string;
  genesis_fee: string;
  genesis_timestamp: number;
  tx_id: string;
  location: string;
  output: string;
  value: string;
  offset: string;
  sat_ordinal: string;
  sat_rarity: string;
  sat_coinbase_height: number;
  mime_type: string;
  content_type: string;
  content_length: number;
  timestamp: number;
};

// defining the news standard in TS
export type OrdinalNews = {
  p: string;
  op: string;
  title: string;
  url?: string;
  body?: string;
  author?: string;
  authorAddress?: string;
  signature?: string;
};

// metadata for inscription stored in KV
export type InscriptionMeta = {
  // inscription
  id: string;
  number: number;
  address: string;
  content_type: string;
  content_length: number;
  genesis_block_height: number; // "genesis height" | genesis_block_height
  genesis_tx_id: string; // 'genesis transaction' | genesis_tx_id
  timestamp: string; // timestamp in both, but string vs date
  // news standard
  last_updated: string;
  news_number?: number;
  news_author?: string;
};

export type InscriptionContent = {
  content: Response;
};
