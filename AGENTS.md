<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Deployment & env vars

**Hosting:** PRODUCTION is Vercel project `factorydirecthomescenter` (team `kyle-dudgeons-projects`) — it holds the custom domains. Live at https://factorydirecthomescenter.com (primary; www 308s to apex — verified 2026-08-12). A second Vercel project `factorydirecthomescenter-com` (team `avabotfdhcs-projects`) also builds every push but serves no custom domain; its checks occasionally fail transiently — that does not block the public site. Auto-deploys on push to `main`. Netlify is DISABLED (2026-08-18, at Kyle's request — Vercel + GitHub only): `netlify.toml` at the repo root sets `ignore = "exit 0"`, which cancels every Netlify build so the `fdhc-ava` site produces no deploys or PR previews. Do not re-enable it or deploy to Netlify. (A full disconnect also requires unlinking the repo in the Netlify dashboard.)

**Env vars are managed only on Vercel** — never write `.env.local` in this repo. `.vercelignore` excludes all `.env*` files from Vercel uploads, so a local `.env.local` with stale or placeholder values will NOT reach production, but it WILL break `npm run dev` if you put empty/placeholder values in it. If you need production env vars locally for debugging, use `vercel env pull .vercel/.env.production.local --environment=production --yes` (writes outside the project root) or `vercel env run -- npm run dev` (no file written).

**Currently wired tracking** (all set via `vercel env add` on Vercel side, shadowed if a local `.env.local` exists):
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` — Google Analytics 4
- `NEXT_PUBLIC_GTM_ID` — Google Tag Manager
- `NEXT_PUBLIC_FB_PIXEL_ID` — Meta/Facebook Pixel
- `NEXT_PUBLIC_CLARITY_PROJECT_ID` — Microsoft Clarity

**Feature env vars** (also Vercel-only):
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` — the "FDHC Site" Supabase project: catalogue, `/admin`, the `leads` table and `/api/search`. Without the URL + anon key the site serves the repo-published catalogue and search falls back to it.
- `LEAD_WEBHOOK_SECRET` (+ optional `LEAD_ALERT_EMAIL_TO`, default sales@) — Supabase Database Webhook on `leads` INSERT posts to `/api/webhooks/new-lead` with header `x-webhook-secret`; the route emails the lead via Resend.
- `OPENAI_API_KEY` (optional `OPENAI_CHAT_MODEL`, default `gpt-4o-mini`) — powers Ava (`/api/chat`). Unset → the chat widget uses its scripted replies.
- `RESEND_API_KEY`, `LEAD_EMAIL_TO`, `GOOGLE_SHEETS_ID`, `GOOGLE_SERVICE_ACCOUNT_KEY`, DealerTide keys — lead fan-out channels in `/api/leads`; each is skipped when unset.

Adding a new tracking platform: scaffold the component in `src/lib/analytics.tsx`, reference it from `AnalyticsProvider`, then `vercel env add NEW_VAR production` and redeploy. Do NOT commit IDs into source.

# Coordinating with other Ava sessions

Multiple Ava sessions can run in parallel (Telegram-triggered, cron jobs, manual). They share this working tree. If you're about to do something race-prone (edit `.env.local`, run `npm run build`, modify `src/lib/pages.ts` while another session is adding pages), check `ps aux | grep claude` first. A prior session wrote a partial `.env.local` on 2026-04-11 and silently broke tracking on production for an hour — that's the kind of thing `.vercelignore` now prevents but coordination would prevent sooner.
