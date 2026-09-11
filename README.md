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

Production images come from **two** places, neither on AWS:

1. **In this repo, under `public/`** — committed to git, deployed with the Vercel build and
   served from Vercel's CDN through `next/image` (`/images/paramount/…`, `/images/prime/…`,
   `/images/options/…`, `/images/homepage/…`).
2. **Supabase Storage, bucket `floor-plans`** (project `mvetqzhjszlullttfkwa`) — the CMS
   catalogue: Champion sales sheets (`<series>/<MODEL>/plans/`), photo sets (`…/photos/`),
   rendered card previews (`…/previews/`), literature PDFs (`literature/`) and the photos
   migrated off the retired S3 bucket (`legacy/`). Paths are stored as bucket keys in
   `floor_plans.banner_image`, `floor_plan_images.path`, `floor_plan_documents.path` and
   `literature.path`; `imgUrl()` in `src/lib/supabase-content.ts` turns a key into the public URL.

The legacy S3 bucket and the Express/MySQL CMS on EC2 were retired on 2026-09-11 — see
AGENTS.md → "AWS is retired".
## Analytics & tracking

Google Analytics 4, Google Tag Manager, Meta Pixel, and Microsoft Clarity are wired in
`src/lib/analytics.tsx` and mounted via `AnalyticsProvider`. IDs are configured through Vercel
environment variables — see AGENTS.md.
