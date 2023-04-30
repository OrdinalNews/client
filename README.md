# Ordinal News Standard

This repository contains a simple web interface and API for creating, viewing, and interpreting inscriptions that follow the [Ordinal News Standard](https://docs.inscribe.news/).

Visit [inscribe.news](https://inscribe.news) to see it in action!

Visit the [inscribe.news documentation](https://docs.inscribe.news) to learn more about the standard!

## API

The API fetches info, content, or news from an inscription ID or inscription number, and will:

- first try to return the data from Cloudflare KV, if indexed
- fetch and store the data from the [Hiro Ordinals API](https://github.com/hirosystems/ordinals-api) for future reads

The available endpoints are [listed in the documentation](https://docs.inscribe.news/api).

## Development

This repository can be cloned and hosted with an active Cloudflare account using [Cloudflare Pages](https://pages.cloudflare.com/).

To develop the site locally, run:

```
npm i
npm run build
npx wrangler pages dev dist/
```

To develop the site locally with KV enabled:

```
npx wrangler pages dev --kv ORD_LIST_V2 --kv ORD_NEWS_V2 --local ./public ./dist
```

### Cloudflare Configuration

In order to setup the same environment, a few Cloudflare settings need to be enabled on the dashboard for this Pages project.

#### Link to GitHub

Clone this repository and set it up within the Cloudflare Dashboard using Cloudflare Pages.

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

- ord-list-v2
- ord-news-v2
- ord-list-preview-v2
- ord-news-preview-v2

#### Functions

Usage model: Unbound

KV namespace bindings:

- Production:
  - ORD_LIST_V2 = ord-list-v2
  - ORD_NEWS_V2 = ord-news-v2
- Preview:
  - ORD_LIST_V2 = ord-list-preview-v2
  - ORD_NEWS_V2 = ord-news-preview-v2
