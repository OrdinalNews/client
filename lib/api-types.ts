import { KVNamespace } from '@cloudflare/workers-types';

// KV binding
export interface Env {
  ORD_LIST: KVNamespace;
  ORD_NEWS: KVNamespace;
  ORD_LIST_V2: KVNamespace;
  ORD_NEWS_V2: KVNamespace;
}

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

// metadata for inscription stored in KV
export type InscriptionMeta = {
  // inscription details
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
