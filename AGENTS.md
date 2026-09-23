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
- `GET /api/health` reports (booleans only) which of the vars below are set and the Supabase host with a live `floor_plans` probe. Env var changes on Vercel only reach deployments created after the change — redeploy, then read `/api/health`.
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

# Admin sign-in (Supabase Auth)

`/admin` signs in with Supabase Auth email + password on the catalogue project; the GoTrue REST endpoints are called directly from `src/lib/admin-auth.ts` (no client library). Only users whose `app_metadata.role` is `"admin"` are accepted — set it in SQL (`update auth.users set raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}' where email = …`), never from the client. The access token (1 h) and refresh token (30 d) live in httpOnly cookies; `src/proxy.ts` sends an expired session through `/api/admin/refresh`, which mints new cookies and returns to the page. Dashboard and Leads read the `leads` and `floor_plans` tables with the service role (`src/lib/admin-data.ts`). Adding an admin: create the user in the Supabase dashboard (Authentication → Users, "auto confirm"), then set the role as above.

# AWS is retired

As of 2026-09-11 nothing on the site depends on AWS. The Express/MySQL CMS on EC2 (`api.factorydirecthomescenter.com`, repo `kmdudgeon/fdhc-next-backend`) and the S3 bucket `factory-direct-homescenter` are no longer called: admin login is Supabase Auth, leads go to the `leads` table (plus Resend / DealerTide / Sheets when configured), the blog is repo-authored (`src/lib/local-posts.ts`), and the floor-plan catalogue is Supabase + the repo data files. `scripts/migrate-legacy-media.mjs` (postbuild, idempotent) copied every S3 photo into the `floor-plans` bucket under `legacy/` as WebP and recorded the map in `public.media_migrations`; rows and repo data files point at the copies. Do not add `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_S3_URL` or an S3 `remotePatterns` entry back.

# SEO: one business entity, per-plan content, honest sitemap dates

- `src/lib/business.ts` is the single source of the dealership's identity for structured data (name, address, phone, `sales@` email, map pin, hours). Both JSON-LD generators (`LocalBusinessSchema` in `src/components/JsonLd.tsx`, used by the root layout, and `structuredData.localBusiness()` in `src/lib/seo.ts`, spread by the location pages) read it, so every page describes the same `#business` node. Change the pin or hours there only. Location pages may narrow `areaServed`/`serviceArea`; they must not override identity fields (a per-city `hasMap` used to give Google three different maps for one business).
- Floor-plan detail pages generate their editorial body from `src/lib/plan-content.ts` (`buildPlanNarrative`): plan-specific sections (size, HUD vs IRC construction and what it means for the site, plant and delivery, series, options), the HUD/modular twin and same-box-other-series callouts, four comparable homes, guide and delivery-area links, and six plan-specific FAQs (which feed the FAQPage schema). This exists because all 400 CMS plans had empty `description`/`floor_plan_html` on 2026-09-11, so every page was one templated sentence plus the six homepage FAQs. Hand-written copy entered in `/admin` renders above the generated narrative — write it for the featured sale homes first. Keep the no-dollar-figure rule in that file.
- `<title>` on plan pages is `{name} — {beds} Bed {baths} Bath Champion {Single Wide|Double Wide|Multi-Section|Modular} Home, Auburn IN`.
- `sitemap.xml` only sends `lastmod` when the date is real: a guide's `updated`, a post's date, or the CMS row's `updated_at` (`ApiFloorPlan.updatedAt`). Do not put `new Date()` back.
- Known catalogue shape: 240 of the 400 active plans have a HUD/modular twin (same box, `H`/`M` model letter) and 328 share a model number with another series (Aspire ⇄ Paramount), so up to four pages describe one physical plan. The narrative cross-links them; consolidating or canonicalising variants is a product decision, not a code one.

# Supabase reads retry, and never fake a 404

Vercel's functions intermittently fail to reach Supabase — production logs for 2026-09-10/11 show `ETIMEDOUT`, `ECONNRESET` and `UND_ERR_SOCKET` against the catalogue host every 20–60 minutes while Supabase's own edge logs show only 200s. Untreated, each failure was visible to buyers: the nine Prime plans that exist only in the CMS dropped out of the catalogue and 404'd, the other 33 fell back to the thinner repo copy (galleries down to one rendering), and the degraded render was then cached for the route's five-minute window. Kyle reported it as "Prime unit floor plans and photos just disappeared" (2026-09-11).

- `src/lib/resilient-fetch.ts` holds the policy: `withRetry` retries only transient network failures and 408/425/429/5xx (a 4xx is the database answering — never retried), and `rememberGood`/`recallGood` keep the last successful response per query in module memory (6 h max age, 500 entries, per function instance).
- `rest()` in `src/lib/supabase-content.ts` is the only caller: it retries at 200 ms and 600 ms, remembers each success, and on total failure serves the remembered response rather than letting the caller degrade. Both fallbacks log (`[supabase] retry N…`, `[supabase] SERVING LAST GOOD…`).
- `/floor-plans/[slug]` no longer catches every error into `notFound()`. `getApiFloorPlanBySlug` returns null only when the slug genuinely is not in the catalogue and throws when it could not find out; the page 404s on the first and lets the second surface. A transient failure must never be cached as "this home does not exist".
- `tests/resilient-fetch.test.ts` covers the real socket error codes, the retry bounds, the 404-is-not-retried rule, and the stale-copy age-out.

# Reviews are real or they are absent, and the owner is a named person

- `src/lib/reviews.ts` is the only place customer reviews may live. It is empty on purpose: the three homepage testimonials ("David B.", "Sarah M.", "James T.") and the "4.8 Star rating from verified customers" badge were placeholder copy from the original build, confirmed by Kyle on 2026-09-14 and removed. Invented reviews breach Google's fake-engagement policy and the FTC endorsement rule. Add a row only by copying a real review verbatim, with the reviewer's own name, the date and a link. `reviewStats()` computes the rating from those rows and returns null when there are none — no `AggregateRating` is published unless real reviews back it, and a hand-typed rating never goes in.
- With no reviews, the homepage shows what a buyer can verify instead (Champion dealer status, line-item pricing, the showroom) and links to the Google listing. Real rows switch that section back to quotes automatically.
- `src/app/design-system/page.tsx` keeps a testimonial card as a layout specimen; it is labelled "not a real customer". Never copy it onto a public page.
- The owner lives in `BUSINESS.owner` (`src/lib/business.ts`) and is published as a `Person` node by `ownerJsonLd()` — cited as the business `founder`, rendered by `src/components/OwnerIntro.tsx` on `/` and `/about`, and defined once on `/about` under the `OWNER_ID` `@id`. `BUSINESS.foundingDate` ("2024-11") is the one answer for how long the dealership has traded. Kyle's bio in `OwnerIntro.tsx` is a draft written from claims the site already made — he should rewrite it in his own words. Setting `BUSINESS.owner.image` to a real photograph makes both the section and the schema use it.
- Post bylines: a post whose `author` equals `BUSINESS.owner.name` publishes the owner `Person` as its schema author; anything else stays an Organization byline (`structuredData.article({ authorIsOwner })`). Never attribute a post to a person who did not write it.

# The page registry is built FROM the blog route's own source

`buildAllPages()` in `src/lib/pages.ts` feeds the "Related Resources" cards in `PageFooter`, the breadcrumb labels, and the static half of `sitemap.xml`. Getting its blog entries from the wrong place has now gone wrong twice, in opposite directions:

- It used to inject every post `blog.ts` marks published, but `/blog/[slug]` reads `local-posts.ts` alone — so twelve posts that exist only in the old editorial calendar were linked sitewide and listed in the sitemap while answering 404 in production (2026-09-14).
- The fix for that intersected the two lists, and **the intersection is empty** — `blog.ts` and `local-posts.ts` describe two disjoint sets. From 2026-09-14 to 2026-09-20 not one of the thirty live posts was registered. `getRelatedPages` returns `[]` for a URL it cannot find, so no post rendered a Related Resources section and no page anywhere could link to one; breadcrumbs fell back to title-casing the slug ("Champion Vs Clayton Homes"). The sitemap was unaffected — it reads `getApiBlogPosts()` directly.

The registry is now derived from `localBlogPosts`, so "advertised" and "renders" are the same set by construction. `blog.ts` is still read, but only to borrow curated `topics`; a post it does not know gets topics derived from its slug (`topicsForPost`), which only ever affects Related Resources ranking. `SitePage.shortTitle` carries the breadcrumb label — a post headline is "Subject: promise" and only the subject belongs in a crumb.

`tests/internal-links.test.ts` guards both directions now: no registry URL may 404, **and** every post the route serves must be registered, name itself in its breadcrumb, and be able to surface related pages.

# Never hand-write a business node — use `businessRef()`

A Semrush crawl (08 Sep 2026, exported 16 Sep) reported "Local Business / address / A value for the address field is required" on 15 pages — `/financing` and 14 location pages. The cause was four hand-written stubs of the shape `{ "@type": "LocalBusiness", name: "Factory Direct Homes Center" }` nested as a `provider` (`structuredData.service`), a `seller` (`structuredData.product` and the plan page's own Product node) and an `itemReviewed` (`structuredData.aggregateRating`). Two defects in one: schema.org requires `address` on a LocalBusiness, and a stub with no `@id` publishes a *second* business sharing our name — the duplicate-entity problem `business.ts` exists to prevent.

`businessRef()` in `src/lib/business.ts` is now the only way to nest the dealership inside another schema. It carries the canonical `@id` and `@type` plus name, url, telephone and `businessAddressJsonLd()`, so Google merges it with the full node from the root layout and it still validates standalone. `tests/structured-data.test.ts` walks every generator's output and fails if any business-typed node lacks an address or carries a different `@id`.

Semrush export dates are export dates, not crawl dates — check the compare-audits file for the real crawl timestamps before assuming a finding is current. Two of the six findings in that batch (`Low text to HTML ratio`, 42 pages; `Content not optimized`, 1) are inherent to a React/Next app that ships an RSC payload alongside the markup and are not worth chasing. `Broken external links` (48 across 31 pages) could not be verified from the agent sandbox — the network policy answers 403 for every outbound host — so that one needs Semrush's own drill-down or a check from an unrestricted machine; the external URLs the site cites live in `src/lib/citations.ts` and the guide pages.

# The factory is 30 miles away, and social profiles came from the old build

- **Distance:** Champion's Topeka plant is **30 miles** from the Auburn showroom (Kyle, 2026-09-16). The site had said 20 in 48 places and 30 in others; every Auburn-showroom-to-Topeka claim now says 30. City-to-city distances are a different measurement and were deliberately left alone — Auburn→Kendallville (20 miles), Auburn→Huntertown (20) and the Indianapolis distance table. Garrett→Topeka is 30 (Kyle, 2026-09-18) — note Garrett is only 5 miles from Auburn, so if that ever needs revisiting it should differ from the Auburn figure by roughly that much. If the factory figure ever changes again, grep for `30[ -]?mile` and check each hit's subject before editing; the Kendallville copy was a false positive on the first pass precisely because it reads "…from our Auburn showroom".
- **Social profiles:** `BUSINESS.sameAs` now carries Facebook and Instagram (`/factorydirecthomescenter` on both), recovered from the previous site's own structured data — `utils/seo.js` in `kmdudgeon/fdhc-next-frontend`. They are the handles that site published, not guesses, but they could not be fetched from the agent sandbox (its network policy answers 403 for every outbound host), so Kyle needs to confirm each resolves. The old site also rendered YouTube and LinkedIn icons, but those URLs were served from the retired CMS's `social` table on the terminated EC2 instance and exist in no repo — they are unrecoverable and must be supplied by hand.

# City blog posts: cover a town once, and make each post genuinely different

The blog carries one post per nearby town, focused on **HUD-code manufactured homes** (Kyle, 2026-09-18 — not modular; modular is covered by the guides and the series pages). 25 of the closest cities are now covered: 13 written in August 2026 (Auburn, Garrett, Waterloo, Butler, Huntertown, Kendallville, Churubusco, Angola, Albion, New Haven, Columbia City, Fort Wayne, Ligonier) and 12 added 2026-09-18 for the closest towns that had none (Corunna, St. Joe, Spencerville, Ashley, Avilla, Rome City, Wolcottville, Hamilton, Fremont, Leo-Cedarville, Grabill, Harlan).

Rules for adding another:

- **One post per town.** A town with a post and a `/locations/*` page already has two assets competing for the same query; a third is cannibalisation, not coverage. Check `local-posts.ts` before writing.
- **Each post must teach something the others do not.** Mass-produced pages that differ only by place name are the doorway-page pattern in Google's spam policies, and the risk is a manual action, not just weak ranking. Every post in this set is built around a different subject — county-line jurisdiction (Ashley, Wolcottville), well and septic sequencing (St. Joe, Grabill), delivery access on rural lanes (Spencerville, Harlan), lake-lot constraints (Rome City), pre-1976 trailer vs HUD-code replacement (Hamilton), northern-winter insulation options (Fremont), land-versus-house budget structure (Leo-Cedarville), freight distance (Avilla), single-section fit on small platted lots (Corunna).
- `title` and `excerpt` are rendered as **text, not HTML** — put real Unicode characters in them (’ – —), never `&rsquo;`-style entities, which render literally. Entities are fine inside `html`.
- Distances: county-level figures come from the vetted table in `src/app/locations/page.tsx`. Do not invent a town-to-town mileage that is not already published somewhere in the repo — say "a short drive" instead.
- The usual claim rules apply: no home dollar figures, contractor ranges only from `/guides/pricing`, and never say FDHC performs site work or setup.

# The lender list lives in one file, and the loan officers stay off the public site

`src/lib/lenders.ts` holds the ten lenders from the sheet Kyle hands buyers with a credit
application (transcribed from his Acrobat doc on 2026-09-18). It is the single source for three
outputs that must never disagree: the `/financing#lenders` table, Ava's roster
(`lendersSection()` in `src/lib/ava-knowledge.ts`), and the printed sheet that goes into
DealerTide as the financing attachment (`npm run lender-sheet` →
`docs/lender-list/Factory-Direct-Homes-Center-Lender-List.pdf`, built by
`scripts/build-lender-sheet.ts` via LibreOffice; not a build step, not in `public/`).

- **Two contact lanes.** `phone`/`website` are the lender's public front door and are published.
  `directContact` is a named loan officer's email — printed sheet and CRM only. Those people did
  not agree to appear on a public page and a published address is scraped within days. Never
  render `directContact` in a page, a feed, a sitemap or an Ava reply.
- **Never rank them.** The sheet's own disclaimer ("does not recommend any specific lender") and
  the authorization the buyer signs ("this selection was not referred or suggested") are what keep
  the referral question clean. No "our lender", no default, no sort by preference. Ava's block
  spells this out; keep it intact.
- **No lender rates or payments anywhere** — same no-dollar-figure rule as the rest of Ava and
  `plan-content.ts`.
- The DealerTide side (attachment upload + lender records) is UI configuration Kyle runs himself:
  the partner API has no lender or attachment endpoint, there is no DealerTide app on Zapier, and
  the agent sandbox cannot reach `renterinsight-api-prod.onrender.com` at all. Steps and the
  paste-ready table are in `docs/dealertide-lender-setup.md`.

# Every lead carries where it came from, and the cookie is the only source

Until 2026-09-20 no lead recorded any acquisition data — no `utm_*`, no `gclid`, no
referrer, no landing page — so a lead from a paid Google click and one from an organic blog
post were indistinguishable in DealerTide and in Supabase.

`src/lib/attribution.ts` is the whole model. Capture happens **once**, on the client,
into the first-party cookie `fdhc_attr` (90 days, `SameSite=Lax`, written by
`src/components/AttributionTracker.tsx` inside `TrackingProvider`). It is read on the
**server** at submit time — never from the form body.

- **One cookie, not nine form fields.** The browser sends it with every POST, so all nine
  lead entry points, and any tenth added later, inherit attribution with no work. A
  scripted POST also cannot forge a campaign into the CRM.
- **First touch AND last touch.** `mergeAttribution()` never overwrites the first touch,
  and only moves the last touch for an arrival that carries a real signal — so a visitor
  who clicks an ad, leaves, and returns by typing the domain still has the ad credited.
  Breaking that rule relabels every lead "direct" at the moment it converts. Tested.
- **Consent-aware.** No cookie while tracking is denied or Global Privacy Control is set,
  and an existing cookie is deleted the moment the visitor opts out.
- Readers: `readAttributionCookie()` (Request header) in `/api/leads`; `cookies()` in
  `src/app/actions/leads.ts`, which also forwards **only** this cookie on its internal
  fan-out — never the visitor's whole `Cookie` header, which would hand an admin session
  to an internal fetch.
- Outputs: `attributionColumns()` → the `leads` table; `attributionSummaryLines()` → the
  DealerTide note, the Resend email and the Sheets row; `/admin` → Leads shows a
  "Came from" column; `public.lead_attribution_report` resolves the channel for reporting.
- Referrals from ChatGPT, Perplexity, Claude, Gemini, Copilot, You.com and Phind are
  classified `medium = 'ai'` and bucketed as `answer engine`. That is the only direct
  measurement of AEO working; do not fold it back into `referral`.
- `click_id` is kept so a closed sale can later be uploaded to Google Ads / Meta as an
  offline conversion. Do not drop it.

**The migration ships before the code.** `supabase/migrations/20260920_lead_attribution.sql`
must be applied to the wired project (`mvetqzhjszlullttfkwa`) first — PostgREST rejects an
insert naming an unknown column with a 400, which takes every website lead down.
`tests/attribution.test.ts` asserts the column set matches the migration exactly.

# Turnstile is wired but inert until the keys exist

`src/lib/turnstile.ts` + `src/components/TurnstileField.tsx` add Cloudflare Turnstile on top
of the honeypot and fill-timer in `anti-spam.ts`. The widget lives inside `useAntiSpam()`,
so all seven form components got it without a line of change — put any future cross-cutting
form concern there too.

- Nothing loads and nothing is enforced until `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (widget) and
  `TURNSTILE_SECRET_KEY` (verification) are both set on Vercel.
- `appearance: "interaction-only"` — real visitors see no widget at all.
- Enforced only when the body carries `hp`, i.e. a real browser form. Ava's chat tools and
  the instant-quote server action post without it, the same exemption the honeypot makes.
- **Fails open.** Cloudflare unreachable → the lead is accepted and the reason logged. A
  few spam leads cost a minute each; a lost real lead costs a sale.

# One BreadcrumbList per page, and it comes from PageFooter

`PageFooter` emits a URL-derived `BreadcrumbList` on every non-home page. Until 2026-09-20
twenty-three pages *also* emitted their own, so each shipped two nodes disagreeing about
the labels for the same URL. Both validate individually — no schema checker catches it; you
only see it by counting nodes in the rendered HTML.

Do not add `structuredData.breadcrumb(...)` to a page. The single exception is
`/floor-plans/[slug]`, whose trail includes the series and cannot be derived from the URL;
`PageFooter` stands down for `/floor-plans/*`. `tests/structured-data.test.ts` scans the
source and fails if a third emitter appears.

The same test now also rejects any node **named** "Factory Direct Homes Center" that lacks
the canonical `@id` — the blog detail page had been publishing a second `Organization` with
our name on every post, which the earlier LocalBusiness-only guard did not see. A genuinely
different author (a guest byline) is still allowed to be its own node.

# /search exists because the schema says it does

`structuredData.website()` publishes a `SearchAction` targeting
`/search?q={search_term_string}`. That URL answered 404 until 2026-09-20 — the site was
advertising a search endpoint it did not have.

`src/app/search/page.tsx` renders results **on the server** from the query string, so it
works with no JavaScript and can be read by a crawler or an answer engine. It is
`noindex, follow` on purpose: an infinite space of `?q=` URLs in the index is the classic
thin-content pattern and competes with the floor-plan pages that should rank.

The query logic lives in `src/lib/site-search.ts`, shared by the page and `GET /api/search`.
`tests/internal-links.test.ts` fails if the SearchAction ever points at a route that does
not exist.

# Lint runs in CI, and the count cannot grow again

`.github/workflows/test.yml` ran `npm test` and `tsc --noEmit` but never ESLint. That is how
the repo accumulated **73 errors and 28 warnings** by 2026-09-20 without anyone noticing —
including a `getImageProps` helper that accepted a `customAlt` and never returned it, so the
first caller would have shipped images with no alt text.

`npm run lint` is now a CI step, and the script passes `--max-warnings 0` so local and CI
agree and a *warning* fails too. Three consequences worth knowing:

- **A new violation of any rule fails the build.** Verified by injecting one of each and
  watching CI's own command reject it.
- **`react-hooks/set-state-in-effect` is at error level with no suppressions left.** Six sites
  were quarantined when lint first went into CI; all six were fixed on 2026-09-20 (see "Browser
  values are snapshotted, never written in from an effect" below). Nothing in the tree suppresses
  this rule any more — keep it that way.
- **Stale suppressions fail too.** An unused `eslint-disable` directive is reported as a
  warning, and warnings fail, so a suppression cannot outlive the problem it was hiding. That is
  how the six above got cleaned up: fixing each one made its own comment fail the build.

Four `<img>` elements are suppressed on purpose: the Meta Pixel `<noscript>` beacon (next/image
renders nothing without JavaScript, which is the only case that element exists for) and two
admin thumbnails behind auth (never indexed, never an LCP element, and routing arbitrary
storage paths through the optimiser bills a transform per thumbnail for nothing).

`.claude/**` is in `globalIgnores` — agent scratch, not application code.

Do not add a blanket rule downgrade or a file-level `/* eslint-disable */` to get a change
through. Suppress the one line, say why, and say what the real fix is.


# Browser values are snapshotted, never written in from an effect

Six components used to render the server's value and then overwrite it from a mount effect —
the query string, `localStorage`, the sale clock, and the financing calculator's own totals.
Every visitor paid two renders, and `react-hooks/set-state-in-effect` flags the pattern because
React has a primitive for it. All six were fixed on 2026-09-20.

`src/lib/use-browser-value.ts` holds the primitive: `useLocationSearch()`,
`useLocalStorageValue(key)` and `useIsHydrated()`, each a `useSyncExternalStore` with a server
snapshot and a client snapshot. React renders the server value, hydrates against it, then swaps
— **without** reporting a mismatch, which is the whole reason the effects existed.

Two rules when reaching for it:

- **Snapshots must be primitives.** React compares them with `Object.is`, so returning a fresh
  object or a `URLSearchParams` is an infinite render loop. Return the raw string and parse it in
  a `useMemo` at the call site.
- **Do not use `useSearchParams` here.** In a prerendered route it pushes the client tree up to
  the nearest Suspense boundary out of the initial HTML. On `/floor-plans` that would have taken
  all 193 floor-plan card links and the `ItemList` schema out of the page — the file's own header
  said so before any of this, and the build output was checked after.

Derived values are computed during render, not stored:

- `PaymentCalculator` no longer keeps `interestRate` or the three totals in state. The rate comes
  from `rateFor()` and the totals from `amortise()`, both in `src/lib/payment-math.ts`, whose
  outputs are pinned by `tests/payment-math.test.ts` against figures captured from the old
  implementation. **That table is the contract — if a change moves those numbers it has changed
  what a buyer is told.** Verified in a real browser too: $738 / $639 / $1,064 for good /
  excellent / poor at the default price and term.
- `getSaleStatus()` now delegates to `saleStatusForDay(today)`, so the sale is a pure function of
  a sortable day string and `AnnouncementBar` can snapshot that day. An ended promo renders
  nothing from the first paint instead of flashing and retracting.
- `loadCampaigns(raw?)` takes the already-snapshotted storage entry, so the admin editor's memo
  depends on something real rather than reading `localStorage` behind React's back.

Editable state seeded from a URL (`FloorPlansGrid`) uses React's adjust-during-render pattern
against the query string it came from — never an effect. Only a parameter that is actually
present overrides the current value, so a filter the shopper has cleared is not re-applied.

# A page tells the layout which home it is about

`MobileActionBar` is in the root layout, so it asks for a quote from every page
on the site. Until 2026-09-21 that quote was always `modelName="Direct Inquiry"` —
including on `/floor-plans/[slug]`, the one page where the buyer's interest is
unambiguous. The floor-plan *cards* already passed `p.name`, so a quote taken
from the grid reached DealerTide, Supabase and the alert email better attributed
than a quote taken from the detail page.

`src/lib/current-home.ts` is the handover. The plan page renders
`<CurrentHome name={plan.name} series={plan.series} />` (renders nothing); the
bar reads it with `useCurrentHome()`.

- **Not React context** — context flows down, and the bar is a sibling of
  `{children}`, not a descendant.
- **Not a route lookup** — the pathname carries the slug, but turning a slug into
  a display name in the browser means shipping the catalogue to it.
- **The snapshot is an encoded string**, for the `Object.is` reason in
  `use-browser-value.ts`. Returning a fresh `{ name, series }` per call is an
  infinite render loop.
- **Registration is an effect, and its cleanup only clears its own value.** React
  does not promise an order between the departing page's cleanup and the arriving
  page's effect; without that guard, a plan→plan navigation silently drops back to
  "Direct Inquiry". Both orders are covered in `tests/current-home.test.ts`.

Anything else in the layout that should know the current home reads the same hook.
Do not add a second channel.

# Disclaimer coverage is three layers, and legibility is part of the disclosure

Three different notices, placed three different ways. Keep them straight.

- **Sitewide, automatic:** the Regulation Z financing disclosure and the HUD notice
  (`ComplianceDisclaimers`) plus the one-line specs summary in the copyright row.
  `Footer` renders them and the root layout renders `Footer`, so every page has
  them. That chain is the whole mechanism — break either link and the site
  silently loses both disclosures everywhere.
- **Per page, where the claims are:** the Champion specifications disclaimer
  (`SpecsDisclaimer`) belongs on a page only when that page shows floor plans,
  renderings or specs. It was on the two `/floor-plans` routes and nowhere else
  until 2026-09-23, so the homepage, the five series pages, both sale routes and
  the configurator all displayed renderings with no "may show optional features
  not included in the base price".
- **Per offer:** `SaleDisclaimer` and `PricingDisclaimer` qualify the promotion
  and the prices, not the renderings. They do not substitute for the specs
  disclaimer and the specs disclaimer does not substitute for them.

`tests/disclaimers.test.ts` guards all of it: the layout → Footer →
`ComplianceDisclaimers` chain, and a source scan that fails when a public page
imports a plan-rendering component (`FeaturedHomes`, `FloorPlanCard`,
`FloorPlansGrid`, `HomeDesigner`, `SaleHomesGrid`, `AllSaleHomesTable`,
`PriceTriple`) without rendering `SpecsDisclaimer`. Add a new plan component to
that list when you write one.

**A notice nobody can read is not a notice.** These were the lowest-contrast
text on the site: `SpecsDisclaimer` at **2.39:1** on cream, the Reg Z and HUD
block at **3.07:1** in the footer, both well under the 4.5:1 AA threshold, and
the compliance pair was set at 11px. Exactly backwards for the two blocks a
regulator would look at. They are now 8.25:1 / 5.71:1 at 12px, measured in a
browser with the alpha composited against the real background, and the test
fails if `--color-gray-light`, `--color-gray` or `text-[11px]` comes back.
`SpecsDisclaimer` takes `tone="dark"` for dark surfaces rather than a competing
text-colour utility in `className`.

One more trap found on the way: an HTML entity inside a JSX **expression** is a
plain string, so React prints it verbatim — `/homes-on-sale` showed every
visitor the heading "Don&rsquo;t Miss Out on These Savings". The same test scans
for that now. Use the real character.

# We sell and deliver the home. The buyer owns everything that touches the land

Kyle, 2026-09-23: *"Clients are responsible for all of their own site work, setup,
and foundation work. Our model has not changed."* The site had drifted from that
in nine places, all removed the same day:

- `/guides/zoning` offered **"free zoning checks"** — a panel promising we would
  contact the local office and verify zoning compliance, permit requirements,
  **setback calculations** and utility availability, with a "Request Zoning
  Check" CTA. Setback calculations are engineering; we do not do them.
- Five pages said some form of **"we verify zoning for your property"**
  (`/`, `/locations/fort-wayne`, `/locations/indianapolis`,
  `/locations/rural-indiana`, `/guides/buyers-guide`), plus Ava's objection
  library and two `county-pages.ts` entries — one of which claimed **"we
  coordinate the pier layout with your foundation contractor"**.

What we may say: we sell factory-direct, we arrange delivery, we hand over the
referral list of licensed and insured contractors, and we can tell a buyer which
office answers for their county. What we may not say: that we verify, check or
evaluate zoning for a parcel, or that we perform site work, foundations or setup.
"We recommend checking with the county" is advice and is fine.

`tests/disclaimers.test.ts` scans every source line for the claim shapes and
fails on a new one. The clause guards in those patterns matter: without them
"We arrange transport; your contractor handles the site" matched, which says
exactly the right thing. Four real violations were injected and confirmed caught.

Also removed that day, at Kyle's request: the **"Counties We Serve in {state}"**
lists on `/guides/zoning` (14 Indiana, 12 Ohio, 12 Michigan counties). The
`/locations/*` pages remain the place the service area is stated.

# Catalogue alt text is generated, and 97% of it is specific

945 photos in Champion's Box manifest are the bulk of the site's imagery, and
their alt text comes from `describeImageFile()` in `src/lib/image-alt.ts`
reading the room out of the filename. The quality of that one function is the
alt quality across ~200 floor-plan pages.

Coverage went 89.4% → **97.4%** on 2026-09-23 by fixing three things:

- **A digit straight after a letter is not a word boundary.** Every `ROOMS`
  pattern ends in `\b`, so `…-bedroom2`, `…-kitchen3` and `…-primary-bedroom2`
  described nothing at all. `describeImageFile` now splits `([a-z])(\d)`.
- `drone` / `aerial` → "aerial exterior view"; `utilities` (the pattern only had
  singular `utility`); `details` → "detail view", ranked last so a named room
  always wins.

The 25 that still fall back are mostly Champion's `_LR` suffix
(`1456H22P01_LR.jpg`). **Do not map it to "living room."** It is the only
two-letter suffix in the whole manifest and 121 other files spell "living" out,
which reads as a resolution marker, not a room code. A wrong alt is worse than a
generic one. One file is Champion's own typo, `famiy-room`; not worth a pattern.

`tests/image-alt.test.ts` pins the floor at 95% against the real manifest and
locks the filename shapes. No image in the repo is missing meaningful alt text:
five `alt=""` are genuinely decorative (a 20%-opacity quote mark, a 7%-opacity
background, two admin thumbnails behind auth, the Meta Pixel noscript beacon).

# We do not do financing. The buyer picks their own lender, and we rank nobody

Kyle, 2026-09-23: *"we don't do financing at all. Clients choose their own
financial lender we provide them a list our clients have done business with in
the past but we make no recommendations and we do not pull credit."* That is
the same shape of drift as the site-work one, and it carries more weight —
offering to arrange credit, or steering a buyer to one lender, is what
separates a dealer from a credit broker.

Removed the same day, across sixteen places:

- `/financing` carried **two** lender presentations. The lower one is the
  neutral table from `lenders.ts` with `LENDER_DISCLAIMER`. The upper one was a
  `lendingPartners` array of five promotional cards — "One of the nation's
  largest manufactured home lenders", "Industry leader" — each with a
  `bestFor:` field rendered under a **"Best for:"** label. A per-lender ranking
  with no verb in it, a few hundred pixels above the table that says we
  recommend nobody. The page contradicted itself; the array and its section are
  gone and the directory now carries the neutrality sentence.
- Its CTA said **"We'll connect you with the right lender for your situation"**,
  the Contact card offered **"personalized financing guidance from our team"**,
  an AEO answer opened **"Our primary lenders include…"**, and "Sources &
  References" cited two of the ten lenders as **"Leading…"** and **"Industry
  leader…"** (now CFPB and HUD, who rank nobody).
- The one nothing could see: a **`Service` node named "Manufactured Home
  Financing" with the dealership as its `provider`**. Invisible to a visitor
  and to a copy guard, and it told Google we are in the lending business. The
  remaining `structuredData.service` nodes are all sales and delivery.
- The rest were sentences in `ava-knowledge.ts`, `faqs.ts`, `about`,
  `HomeSections`, `local-posts`, two guides and three location pages.

What we may say: we hand over a list of lenders our customers have used, we
name no favourite, and a buyer may apply to as many as they like. What we may
not say: that we offer, arrange, broker or help compare financing; that any
lender is ours, primary, preferred or best for anything; or that we pull,
run or check credit.

`tests/disclaimers.test.ts` guards it three ways, because one scan missed each
of the other two shapes:

- **Sentences** — the "we…" claim patterns. Their clause guards stop at `;`,
  and an HTML entity carries one, so `We&apos;ll connect you with the right
  lender` walked straight through the first version. Entities are flattened
  before matching now; four real phrasings were injected and confirmed caught.
- **Data fields** — a recommendation label ("best for", "ideal for", "top
  pick") within eight lines of a named lender. A loan *type* may still be
  "best for buyers without land"; that is product education. Naming a company
  next to it is what makes it a recommendation.
- **Schema** — a `structuredData.service` whose name or description mentions
  financing, a loan, credit, lending or a mortgage.
