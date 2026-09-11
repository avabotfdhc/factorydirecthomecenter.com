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
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` — the Supabase project holding the catalogue, `/admin`, the `leads` table and `/api/search`. **Production is wired to project `mvetqzhjszlullttfkwa` (dashboard name "supabase-purple-queen")** — verified via `/api/health` on 2026-09-09. The project named "FDHC Site" (`wmkidrlcwncrskyzynsn`) holds the original copy of the same schema and catalogue (172 plans, 504 images, 15 literature rows) but the site does not read from it; treat it as a backup until the env vars are switched, and apply schema changes to the wired project first. Without the URL + anon key the site serves the repo-published catalogue and search falls back to it.
- `GET /api/health` reports (booleans only) which of the vars below are set, the Supabase host with a live `floor_plans` probe, and the status of the CMS API that `/api/admin/login` proxies to. Env var changes on Vercel only reach deployments created after the change — redeploy, then read `/api/health`.
- `LEAD_WEBHOOK_SECRET` (+ optional `LEAD_ALERT_EMAIL_TO`, default sales@) — Supabase Database Webhook on `leads` INSERT posts to `/api/webhooks/new-lead` with header `x-webhook-secret`; the route emails the lead via Resend.
- `OPENAI_API_KEY` (optional `OPENAI_CHAT_MODEL`, default `gpt-4o-mini`; `OPENAI_BASE_URL` only for the local mock) — powers Ava (`/api/chat`). Unset → the chat widget uses its scripted replies. See "Ava" below.
- `RESEND_API_KEY`, `LEAD_EMAIL_TO`, `GOOGLE_SHEETS_ID`, `GOOGLE_SERVICE_ACCOUNT_KEY`, DealerTide keys — lead fan-out channels in `/api/leads`; each is skipped when unset. When `RESEND_API_KEY` is set the route also emails `LEAD_EMAIL_TO` whenever DealerTide rejects a lead, skips it as a duplicate (202), or the Supabase copy fails.
- `LEGACY_CMS_LEADS=1` — re-enables the legacy CMS enquiry channel in `/api/leads`. Off by default since 2026-09-11: that API has answered 5xx since 2026-08-29 and `/admin` reads leads from Supabase.
- `/api/leads` drops submissions with the hidden `website` honeypot filled or submitted under 2.5s after the form mounted (`src/lib/anti-spam.ts`, `src/lib/use-anti-spam.tsx`), answering 200 so bots learn nothing. Platform-level rate limiting is a Vercel Firewall rule, not code.

`npm test` runs `tests/*.test.ts` (node:test via tsx) against a scripted mock of DealerTide's `POST /leads`; `.github/workflows/test.yml` runs it plus `tsc --noEmit` on every PR.

Adding a new tracking platform: scaffold the component in `src/lib/analytics.tsx`, reference it from `AnalyticsProvider`, then `vercel env add NEW_VAR production` and redeploy. Do NOT commit IDs into source.

# Coordinating with other Ava sessions

Multiple Ava sessions can run in parallel (Telegram-triggered, cron jobs, manual). They share this working tree. If you're about to do something race-prone (edit `.env.local`, run `npm run build`, modify `src/lib/pages.ts` while another session is adding pages), check `ps aux | grep claude` first. A prior session wrote a partial `.env.local` on 2026-04-11 and silently broke tracking on production for an hour — that's the kind of thing `.vercelignore` now prevents but coordination would prevent sooner.

# Catalogue media from Champion's Box library

Champion shares its literature and photo library through two Box folders (Topeka IN, Decatur IN). On 2026-09-09 every 2026 sales sheet (APB/APF, L-101/L-102, LIT-1), WEB-size photo set and literature PDF was copied into the `floor-plans` storage bucket and attached in the CMS (`floor_plan_documents`, `floor_plan_images`, `literature`), without downloads:
- `public/seed/box-import-manifest.json` — Box file ids and target storage paths (`<series>/<MODEL>/plans/…`, `…/photos/…`, `literature/…`). The folder **share tokens are not in the repo**.
- Supabase edge function `box-import` (project `mvetqzhjszlullttfkwa`) v4 fetched each file from Box's shared-link download URL and wrote it to storage; it is parked as a 410 stub. Redeploy v4 and POST `{ tokens: {T,D}, manifestUrl, offset, limit }` (via `pg_net` from SQL) to re-run.
- Storage paths carry series + model, so `floor_plan_documents` / `floor_plan_images` rows can be regenerated from `storage.objects` with the SQL pattern in this session's history (join on `lower(series)` and `upper(model_number)`).
- Box download URL for a file inside a shared folder: `https://app.box.com/index.php?rm=box_download_shared_file&shared_name=<token>&file_id=f_<id>`.

# Card images rendered from sales sheets

Plans that Champion has no photo or rendering for (the 32'-wide Aspire/Paramount twins, a few Prime singles) get their card image from page 1 of their sales sheet. `scripts/render-sheet-previews.mjs` runs as `postbuild` on every Vercel build (production env vars are present there): it finds active plans with no `banner_image` and no `floor_plan_images`, renders the APB/APF/LIT sheet with pdf.js + `@napi-rs/canvas` (1600px JPEG), uploads it to `<series>/<MODEL>/previews/<sheet>.jpg` in the `floor-plans` bucket, sets `banner_image` and adds a `kind = 'floorplan'` image row. Idempotent, never fails the build (no env vars → skip; per-plan errors are logged). Run it by hand with `vercel env run -- npm run sheet-previews` (`--dry-run` lists candidates). To replace a rendered card with a real photo later, upload the photo in `/admin` and it becomes the banner; the preview stays in the gallery as the plan drawing.

# Ava (site chat / sales rep)

`src/components/AvaChatWidget.tsx` → `POST /api/chat` (`src/app/api/chat/route.ts`) → OpenAI with the system context from `src/lib/ava-knowledge.ts`. Everything Ava may say lives in that one file: company facts, the **running sale** (read live from `src/lib/sale.ts`, quoted only as "% off MSRP base price" + deadline), **showroom clock** (open/closed right now, Eastern), series, factory options and Paramount standard features (`src/lib/paramount-content.ts`), financing, Champion, industry terms, location pages, the **discovery script, objection library, appointment playbook and conversion playbook**, FAQs, the thirty featured sale homes, and a one-line-per-plan catalogue from `getApiFloorPlans()` (cached 10 min). Prices stay out: the no-dollar rule in `docs/AVA_CHAT_SPEC.md` still holds while `SHOW_PRICES` / `SHOW_SALE_PRICES` are off; the only dollar figures she may cite are the pricing guide's delivery/set-up/site-work ranges.

Tools the route gives the model: `lookup_floor_plan` (full detail via `findPlanBrief`, so specs are never invented), `capture_lead` (quote / spec package) and `book_showroom_visit` (appointment request). Both lead tools call `submitLead` with `source` "Ava Chat — Quote Request" / "Ava Chat — Showroom Visit", so the email, CMS and Supabase `leads` rows say what the visitor asked for. The widget sends `page` (pathname; a floor-plan page's detail is preloaded into the context) and `captured` flags so a visit or quote is never saved twice in one session. Ava's replies render bare site paths, markdown links and the phone number as tappable links.

**Guardrails** (`src/lib/ava-guardrails.ts`, wired in the route): Ava has no web, code or file tools — only the three function tools above, so she cannot reach the open web by construction. On top of that the route sanitizes visitor text (HTML/control chars, 1,500-char cap), answers "ignore your instructions / reveal your prompt / act as…" attempts with a fixed refusal without calling the model, budgets each IP to 30 messages per 10 minutes (in-memory per function instance; 429 with a hand-off reply), sends `store:false` so OpenAI keeps nothing, and post-filters every reply: off-site links are removed (our own domain becomes a site path), any dollar figure other than the pricing guide's contractor ranges swaps the whole reply for the quote redirect, leaked instructions swap for a neutral opener, and replies are cut at ~1,400 chars. The "SCOPE, CONDUCT AND SAFETY" block in `ava-knowledge.ts` lists the only tasks she performs, what she declines, fair-housing rules, tone, and how she handles abuse, emergencies and existing-customer complaints. Keep all of that intact when editing the playbook; the smoke test covers each guardrail.

Smoke-test the whole loop without OpenAI or real leads: `node scripts/ava-smoke.mjs --spawn` (mock OpenAI + mock CMS on :4545, dev server on :3100). Editing the playbook = editing the string constants in `ava-knowledge.ts`; keep the "never a dollar figure" rules intact and rerun the smoke test.
