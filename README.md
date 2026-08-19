# Factory Direct Homes Center

Marketing + catalog website for **Factory Direct Homes Center**, an authorized Champion Homes
dealer in Auburn, Indiana. Built with **Next.js (App Router)** and deployed on **Vercel**.

Live site: <https://factorydirecthomescenter.com>

> **[AGENTS.md](./AGENTS.md) is the source of truth** for how this repo is operated — deployment,
> environment variables, tracking setup, and coordination notes. Read it before making changes.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

Useful scripts:

- `npm run build` — production build
- `npm start` — serve the production build
- `npx tsc --noEmit` — type-check

Environment variables are managed **on Vercel** — never commit a `.env.local`. See
AGENTS.md → "Deployment & env vars" for the wired tracking IDs and how to add new ones.

## Deployment

- **Production is Vercel only.** Auto-deploys on push to `main` (Vercel project
  `factorydirecthomescenter`, which holds the custom domains).
- **Netlify is disabled.** The root `netlify.toml` sets `ignore = "exit 0"`, which cancels every
  Netlify build so no Netlify deploys or PR previews are produced. Do not deploy to Netlify.

## Where images are stored

Production images come from **two** places:

1. **In this repo, under `public/`** — committed to git, deployed with the Vercel build, and
   served from Vercel's CDN. Referenced by root-relative paths like
   `/images/paramount/brighton-living.webp` and rendered through `next/image`. Main folders:
   - `public/images/paramount/` — Paramount-series photos & renderings
   - `public/images/prime/` — Prime-series photos
   - `public/images/floor-plans/` — floor-plan renderings & spec/sales PDFs
   - `public/images/homepage/`, `public/images/options/` — site/homepage art
   - `public/brochures/`, plus top-level hero and logo images
   This is where curated, static imagery lives. To add one, drop the file in the appropriate
   `public/images/**` folder and reference it by its `/images/...` path (there is **no**
   `public/floorplans/` folder — use `public/images/...`).

2. **AWS S3 — `factory-direct-homescenter.s3.us-east-1.amazonaws.com`** — the DealerTide/CMS
   catalog photos and some banner renderings/brochures. These are referenced by full
   `https://…s3…amazonaws.com/…` URLs and are allowed through `next/image` via `remotePatterns`
   in [`next.config.ts`](./next.config.ts). They're consumed mainly by `src/lib/api-content.ts`
   (the CMS feed) and the catalog data files (`src/lib/*-floor-plans.ts`).

**Rule of thumb:** static site imagery (heroes, homepage, curated model photos) lives in
`public/`; dynamic catalog/inventory photos come from the S3 bucket through the CMS feed.

## Analytics & tracking

Google Analytics 4, Google Tag Manager, Meta Pixel, and Microsoft Clarity are wired in
`src/lib/analytics.tsx` and mounted via `AnalyticsProvider`. IDs are configured through Vercel
environment variables — see AGENTS.md.
