# Ordinal News Standard

This repository contains a simple web interface and API for creating, viewing, and interpreting inscriptions that follow the [Ordinal News Standard](https://docs.inscribe.news/).

Visit [inscribe.news](https://inscribe.news) to see it in action!

## API Endpoints

The API fetches info, content, or news from an inscription ID, grabbing the data from either ordapi.xyz or ordinals.com, then saving it in KV for future requests.

- `/api/info/INSCRIPTION_ID` - returns inscription data (all)
- `/api/content/INSCRIPTION_ID` - returns inscription content (all)
- `/api/news/INSCRIPTION_ID` - returns html from news inscription body (news only)
- `/api/data/INSCRIPTION_ID` - returns inscription data and content (news only)
- `/api/data/ord-news` - returns all known news inscriptions in KV
- `/api/data/ord-list` - returns all known inscriptions in KV

## Development

This repository can be cloned and hosted with an active Cloudflare account, using [Cloudflare Pages](https://pages.cloudflare.com/).

To develop the site locally, run:

```
npm i
npm run build
npx wrangler pages dev dist/
```

To develop the site locally with KV enabled:

```
npx wrangler pages dev --kv ORD_LIST --kv ORD_NEWS --kv ORD_DATA --local ./public ./dist
```

### Cloudflare Configuration

In order to setup the same environment, a few Cloudflare settings need to be enabled on the dashboard for this Pages project.

#### Builds & Deployments

- Build command: npm run build
- Build output directory: /dist
- Root directory: /

#### Environment Variables

Production:

- NODE_VERSION 17

Preview:

- NODE_VERSION 17

#### KV

Create KV namespaces:

- ord-list
- ord-news
- ord-data
- ord-list-preview
- ord-news-preview
- ord-data-preview

#### Functions

Usage model: Unbound

KV namespace bindings:

- Production:
  - ORD_LIST = ord-list
  - ORD_NEWS = ord-news
  - ORD_DATA = ord-data
- Preview:
  - ORD_LIST = ord-list-preview
  - ORD_NEWS = ord-news-preview
  - ORD_DATA = ord-data-preview
