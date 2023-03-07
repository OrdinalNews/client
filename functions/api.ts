import { createResponse } from '../../lib/api-helpers';

export async function onRequest(): Promise<Response> {
  return createResponse(`Welcome to the Ordinal News Indexer API instance!`);
}

/* ORD API RESPONSE, type in helper file
{
  "address": "bc1phjn9z9ds2kasfach6eye9pv0u6weer0csjnce8hz63l2ge20wxsskurvc5",
  "content": "/content/7641ef7165bc59c40b269d4b2f6741ca3f34334b8c758fbba155bd0e29b4011bi0",
  "content_length": "103516 bytes",
  "content_type": "image/webp",
  "genesis_fee": "26163",
  "genesis_height": "/block/772642",
  "genesis_transaction": "/tx/7641ef7165bc59c40b269d4b2f6741ca3f34334b8c758fbba155bd0e29b4011b",
  "id": "7641ef7165bc59c40b269d4b2f6741ca3f34334b8c758fbba155bd0e29b4011bi0",
  "inscription_number": 10,
  "location": "7641ef7165bc59c40b269d4b2f6741ca3f34334b8c758fbba155bd0e29b4011b:0:0",
  "offset": "0",
  "output": "/output/7641ef7165bc59c40b269d4b2f6741ca3f34334b8c758fbba155bd0e29b4011b:0",
  "output_value": "10000",
  "preview": "/preview/7641ef7165bc59c40b269d4b2f6741ca3f34334b8c758fbba155bd0e29b4011bi0",
  "sat": "/sat/765825157958301",
  "timestamp": "2023-01-19 07:30:44 UTC",
  "title": "Inscription 10"
}
*/
