# Puppeteer + TypeScript

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/deploy/puppeteer-ts?referralCode=dPr4mc)

A minimal [Puppeteer](https://pptr.dev) starter for Railway, written in TypeScript. It opens a page in headless Chrome, logs the title and main heading, and closes the browser. Put your own scraping logic in `scrapeWebsite()` in `src/index.ts`.

After the scrape the service keeps running with a small health endpoint, so Railway sees a healthy deployment. Set `SCRAPE_INTERVAL_MINUTES` to repeat the scrape on a schedule.

Railway builds it with [Railpack](https://railpack.com): it runs `npm run build` (`tsc`) and starts it with `node dist/index.js` (set in `railway.toml`, so it shuts down cleanly). Railpack installs Chrome's system libraries when it detects Puppeteer, and Puppeteer downloads its own Chrome during `npm ci` (`yauzl` is a dependency so it can unzip Chrome without a system `unzip`).

## Environment variables

| Variable | Default | Description |
| --- | --- | --- |
| `PORT` | `3000` | Port for the health endpoint (Railway sets this) |
| `SCRAPE_INTERVAL_MINUTES` | not set | Repeat the scrape every N minutes. If not set, it runs once at startup. |

## Run locally

Requires Node.js 22.18 or newer (for `npm run dev`, which runs the `.ts` file directly; Puppeteer 25 itself needs 22.12+). Railway runs the Node version from `engines` in `package.json` (26.x, the current LTS).

```bash
npm install
npm run build && npm start   # or: npm run dev to run src/index.ts with --watch
```
