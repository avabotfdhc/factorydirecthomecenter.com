<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Deployment & env vars

**Hosting:** Vercel project `factorydirecthomescenter-com` (team `avabotfdhcs-projects`). Live at https://factorydirecthomescenter-com.vercel.app. Auto-deploys on push to `main`. Migrated from Netlify 2026-04-11 — Netlify site `fdhc-ava.netlify.app` is dead, do not try to deploy there.

**Env vars are managed only on Vercel** — never write `.env.local` in this repo. `.vercelignore` excludes all `.env*` files from Vercel uploads, so a local `.env.local` with stale or placeholder values will NOT reach production, but it WILL break `npm run dev` if you put empty/placeholder values in it. If you need production env vars locally for debugging, use `vercel env pull .vercel/.env.production.local --environment=production --yes` (writes outside the project root) or `vercel env run -- npm run dev` (no file written).

**Currently wired tracking** (all set via `vercel env add` on Vercel side, shadowed if a local `.env.local` exists):
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` — Google Analytics 4
- `NEXT_PUBLIC_GTM_ID` — Google Tag Manager
- `NEXT_PUBLIC_FB_PIXEL_ID` — Meta/Facebook Pixel
- `NEXT_PUBLIC_CLARITY_PROJECT_ID` — Microsoft Clarity

Adding a new tracking platform: scaffold the component in `src/lib/analytics.tsx`, reference it from `AnalyticsProvider`, then `vercel env add NEW_VAR production` and redeploy. Do NOT commit IDs into source.

# Coordinating with other Ava sessions

Multiple Ava sessions can run in parallel (Telegram-triggered, cron jobs, manual). They share this working tree. If you're about to do something race-prone (edit `.env.local`, run `npm run build`, modify `src/lib/pages.ts` while another session is adding pages), check `ps aux | grep claude` first. A prior session wrote a partial `.env.local` on 2026-04-11 and silently broke tracking on production for an hour — that's the kind of thing `.vercelignore` now prevents but coordination would prevent sooner.
