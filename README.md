# Ordinal News Standard

This repository contains a simple web interface and API for creating, viewing, and interpreting inscriptions that follow the [Ordinal News Standard](https://docs.inscribe.news/).

Visit [inscribe.news](https://inscribe.news) to see it in action!

## API Endpoints

The API fetches info, content, or news from an inscription ID, grabbing the data from either ordapi.xyz or ordinals.com, then saving it in KV for future requests.

- `/api/info/INSCRIPTION_ID` - returns inscription data
- `/api/content/INSCRIPTION_ID` - returns inscription content
- `/api/news/INSCRIPTION_ID` - returns html from news inscription\*
- `/api/data` - returns all known keys in KV
- `/api/reset-data` - deletes all known keys in KV\*\*

_\* this endpoint returns an HTML page as an example, but will change to return just the HTML parsed from the body of the news in the future_

_\*\* this endpoint only works in the preview build, and may change in the future_

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
npx wrangler pages dev --kv ORD_NEWS_INDEX --local ./public ./dist
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
- PREVIEW false

Preview:

- NODE_VERSION 17
- PREVIEW true

#### KV

- create KV namespace: ordinal-news-index
- create KV namespace: ordinal-news-index-preview

#### Functions

- Usage model: Unbound
- KV namespace binding:
  - Production: ORD_NEWS_INDEX ordinal-news-index
  - Preview: ORD_NEWS_INDEX ordinal-news-index-preview
