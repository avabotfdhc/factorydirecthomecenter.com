<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Deployment & env vars

**Hosting:** PRODUCTION is Vercel project `factorydirecthomescenter` (team `kyle-dudgeons-projects`) — it holds the custom domains. Live at https://factorydirecthomescenter.com (primary; www 308s to apex — verified 2026-08-12). A second Vercel project `factorydirecthomescenter-com` (team `avabotfdhcs-projects`) also builds every push but serves no custom domain; its checks occasionally fail transiently — that does not block the public site. Auto-deploys on push to `main`. Netlify is DISABLED (2026-08-18, at Kyle's request — Vercel + GitHub only): `netlify.toml` at the repo root sets `ignore = "exit 0"`, which cancels every Netlify build so the `fdhc-ava` site produces no deploys or PR previews. Do not re-enable it or deploy to Netlify. (A full disconnect also requires unlinking the repo in the Netlify dashboard.)

**Env vars are managed only on Vercel** — never write `.env.local` in this repo. `.vercelignore` excludes all `.env*` files from Vercel uploads, so a local `.env.local` with stale or placeholder values will NOT reach production, but it WILL break `npm run dev` if you put empty/placeholder values in it. If you need production env vars locally for debugging, use `vercel env pull .vercel/.env.production.local --environment=production --yes` (writes outside the project root) or `vercel env run -- npm run dev` (no file written).

**Tracking: what is actually running** (verified against production 2026-09-28 —
the previous version of this list said all four were "set via `vercel env add`",
and none of the four env vars is set):
- **Google Analytics 4 — working**, from the ID committed as the default in
  `src/lib/analytics.tsx` (`G-6PMB9SZX4H`). `NEXT_PUBLIC_GA_MEASUREMENT_ID` overrides it.
- **Microsoft Clarity — working**, same way (`tjh2nfoq85`).
  `NEXT_PUBLIC_CLARITY_PROJECT_ID` overrides it.
- **Google Tag Manager — NOT running.** `NEXT_PUBLIC_GTM_ID` is unset and defaults
  to `""`, so the script never loads. GA4 runs directly, so GTM is optional.
- **Meta Pixel — NOT running.** `NEXT_PUBLIC_FB_PIXEL_ID` is unset, same as above.

A GA4 or Clarity ID is a PUBLIC value that ships in the page source, which is why
those two are deliberately committed rather than left to env vars; keys and
secrets never are. `docs/vercel-env-setup.md` lists every variable, what is
missing, and how to add it.

**Do not conclude tracking is broken by reading the HTML.** `AnalyticsProvider`
returns `null` until BOTH gates pass — the visitor has accepted cookies
(`useTrackingAllowed`) and has interacted with the page (`useDeferUntilInteraction`,
which defers the scripts for speed). A `curl` or a view-source before accepting
the banner shows zero tracking scripts on a perfectly healthy site. That inference
was made and reported as an outage on 2026-09-28; the actual check is a browser —
accept the banner, click and scroll, then confirm requests to
`googletagmanager.com/gtag/js` and `clarity.ms/tag/…`. `GET /api/health` reports
only whether the *env vars* are set, which for these two is `false` by design.

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

- **Plant size:** do not call Topeka "the largest Champion plant/factory in the country". The site said so in eighteen places with nothing to back it; Kyle had it removed on 2026-09-30 and the homepage "100% Factory Direct" stat replaced with "Line-Item / Quotes on Every Home". Say "Champion's Topeka, IN plant". Company-level lines ("Champion is one of the largest factory-built home producers in North America") are a different claim and stay. `tests/disclaimers.test.ts` fails on "largest" within 40 characters of plant/factory/facility.
- **Champion's rank and market share:** `/about` called Champion "America's #2 manufactured home builder" with a "20% market share", unsourced. Kyle had both softened on 2026-09-30 to "one of the largest producers of factory-built housing in North America" (the `/champion-homes` wording), and the two stat tiles now read "1953 / Building Since" and "2 / Indiana Plants". A rank or share figure changes yearly and needs a citation; `tests/disclaimers.test.ts` fails on a new one.
- **Distance:** Champion's Topeka plant is **30 miles** from the Auburn showroom (Kyle, 2026-09-16). The site had said 20 in 48 places and 30 in others; every Auburn-showroom-to-Topeka claim now says 30. City-to-city distances are a different measurement and were deliberately left alone — Auburn→Kendallville (20 miles), Auburn→Huntertown (20) and the Indianapolis distance table. Garrett→Topeka is 30 (Kyle, 2026-09-18) — note Garrett is only 5 miles from Auburn, so if that ever needs revisiting it should differ from the Auburn figure by roughly that much. If the factory figure ever changes again, grep for `30[ -]?mile` and check each hit's subject before editing; the Kendallville copy was a false positive on the first pass precisely because it reads "…from our Auburn showroom". That grep also missed the abbreviated forms: the homepage's "20mi / From the Factory" stat, its "20 Mile Delivery" badge and `/about`'s "20 mi / From Our Lot" stayed live until 2026-09-29. `tests/disclaimers.test.ts` now fails on any `20 mi`/`20mi`/`20 miles` within a line of "factory", "plant", "Topeka", "our lot" or "delivery", unless the line names the showroom (city distances).
- **Social profiles:** `BUSINESS.sameAs` carries the five links Kyle publishes on the Google Business Profile itself, supplied from the listing on 2026-09-23: the Google listing, Facebook (`/FactoryDirectHomesCenter`), Instagram (`/factory_direct_homes_center/` — note the underscores), X (`/fd_homes_center`) and YouTube (`/@factorydirecthomescenter`). These replace the two recovered from the previous build's `utils/seo.js`, which had the Instagram handle wrong; a `sameAs` pointing at somebody else's profile asks Google to merge a stranger into our entity, so take these from the listing and nowhere else. There is no LinkedIn page. The Google listing has its own named export, `GOOGLE_LISTING_URL` — `reviews.ts` reads that rather than `sameAs[0]`, so the list can be reordered safely. `tests/structured-data.test.ts` holds the shape (absolute https, no duplicates, the listing present and equal to the review link).

# Calls and texts go to two different lines

The Google Business Profile advertises a **texting number that is not the voice
line** (Kyle, 2026-09-23, when he also made the voice number public on the
listing). The site's mobile "Text" button had always composed its message to the
voice line, so every text a buyer sent from their phone landed somewhere that
does not answer them — a lead lost silently, with the buyer believing they had
made contact.

- `BUSINESS.telephone` / `phoneDisplay` — the line that is **dialled**. This is
  the number on the listing, and the site publishes it in ~120 places.
- `BUSINESS.smsNumber` / `smsDisplay` — the line that receives **texts**. Only
  `MobileActionBar`'s Text button uses it today; anything else that opens a
  messaging app must read it too.
- `dialable()` turns either display form into the `+1…` digits an href wants.
  Never hand-write a number into an `sms:` href —
  `tests/contact-details.test.ts` scans `src/` and fails on `sms:` followed by a
  digit (an `sms:?&body=…` with no recipient, as in `ShareListing`'s
  share-with-a-friend link, is the one legitimate shape).

**Opening date:** the dealership opened **November 2024**, which is what
`BUSINESS.foundingDate` says and what `/`, `/about` and Ava tell visitors.
The Google listing said 21 September 2024; Kyle confirmed November is correct
and is fixing the listing (2026-09-23). Do not "correct" the site to match a
listing.

**The listing's own description is not a source.** It still says the Topeka
plant is "about 20 miles" away, which the site corrected to 30 a week earlier.
Facts flow from Kyle to this repo, not from the listing copy.

# City blog posts: cover a town once, and make each post genuinely different

The blog carries one post per nearby town, focused on **HUD-code manufactured homes** (Kyle, 2026-09-18 — not modular; modular is covered by the guides and the series pages). The 13 August posts were written before that rule and carried 29 `modular` mentions between them — "a new Champion manufactured or modular home" in the opening, and a boilerplate "modular homes on permanent foundations extend your options" clause in the placement paragraph of eleven of them, which gave modular equal billing in posts that are supposed to be about HUD-code homes. Swept on 2026-09-25. Where a buyer genuinely needs the alternative named — the three FAQs asking whether a home can go inside town limits — the answer now points at `/guides/manufactured-vs-modular` instead of selling modular inline. 55 cities are now covered: 13 written in August 2026 (Auburn, Garrett, Waterloo, Butler, Huntertown, Kendallville, Churubusco, Angola, Albion, New Haven, Columbia City, Fort Wayne, Ligonier) and 12 added 2026-09-18 for the closest towns that had none (Corunna, St. Joe, Spencerville, Ashley, Avilla, Rome City, Wolcottville, Hamilton, Fremont, Leo-Cedarville, Grabill, Harlan), 5 added 2026-09-28 (Woodburn, Pleasant Lake, Orland, Laotto, Topeka), 5 more the same day (Monroeville, Cromwell, Hudson, LaGrange, Howe), 5 on 2026-09-30 (Decatur, Ossian, South Whitley, Kimmell, Shipshewana), 5 on 2026-10-01 (Bluffton, Berne, Larwill, Wawaka, Stroh), and 5 on 2026-10-06 in counties with no location page at all (Warsaw/Kosciusko, Huntington, Goshen/Elkhart, Wabash, Portland/Jay), and 5 more on 2026-10-06 the same way (Marion/Grant, Hartford City/Blackford, Peru/Miami, Plymouth/Marshall, Rochester/Fulton).

Rules for adding another:

- **One post per town.** A town with a post and a `/locations/*` page already has two assets competing for the same query; a third is cannibalisation, not coverage. Check `local-posts.ts` before writing.
- **Each post must teach something the others do not.** Mass-produced pages that differ only by place name are the doorway-page pattern in Google's spam policies, and the risk is a manual action, not just weak ranking. Every post in this set is built around a different subject — county-line jurisdiction (Ashley, Wolcottville), well and septic sequencing (St. Joe, Grabill), delivery access on rural lanes (Spencerville, Harlan), lake-lot constraints (Rome City), pre-1976 trailer vs HUD-code replacement (Hamilton), northern-winter insulation options (Fremont), land-versus-house budget structure (Leo-Cedarville), freight distance (Avilla), single-section fit on small platted lots (Corunna), floodplain elevation (Woodburn), single-level living and entry height (Pleasant Lake), two-generation layouts and bedroom-count septic sizing (Orland), own land versus a land-lease community (Laotto), delivery-day inspection and warranty items (Topeka), working backward from move-in through the seasons (Monroeville), heating fuel on a rural lot (Cromwell), freestanding porches, decks and garages (Hudson), titling and taxes — personal property vs real estate (LaGrange), siting the home on acreage (Howe), wind, tie-downs and where to shelter (Decatur), a second home on the family farm (Ossian), insuring the home (South Whitley), first-year care (Kimmell), options to decide at order vs later (Shipshewana), selling your current house first (Bluffton), well-water testing and room for treatment (Berne), checking internet service before buying land (Larwill), a plan with a real home office (Wawaka), driveway permits, culverts and address assignment (Stroh), new versus used (Warsaw), pets and a busy household (Huntington), HUD-code home vs RV, park model and tiny home (Goshen), making a smaller home feel bigger (Wabash), renting to owning (Portland), making one showroom visit count (Marion), how the process differs from a stick-built house (Hartford City), skirting (Peru), exterior choices and subdivision covenants (Plymouth), checks to finish before closing on land (Rochester).
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
- **Name them all, or name none.** A subset is a recommendation with the verb taken out. Ava's
  four-lender shortlist was fixed on 2026-09-23 on exactly this rule, but the sweep stopped there:
  on 2026-09-25 the same four names (21st Mortgage, Triad, Credit Human, Lake Michigan CU) were
  still typed into the homepage FAQ, `faqs.ts`, `/about`, the financing calculator's disclaimer,
  `blog.ts`, the privacy policy — as "financing **partners**" — and five blog posts. The homepage
  answer also still said we "work with" them and could "arrange land-home packages". All removed.
  `tests/disclaimers.test.ts` now derives the ten names from `LENDERS` and fails any file under
  `src/` that names some but not all of them; `lenders.ts` is the only exemption, and
  `ava-knowledge.ts` passes by naming all ten in full (it used shorthand — "Triad", "Lake Michigan
  CU" — which is why Ava's roster now spells each one exactly as `lenders.ts` does).
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

## Every catalogue image gets checked, and the bar differs by `kind`

Kyle, 2026-09-28, after catching 14 bad rows I had added: *"You should have known
to do this before I said anything. Please make sure you add this step to all
images being used currently and in the future."*

**`npm run image-audit`** (`scripts/audit-image-alt.ts`, run it as
`vercel env run -- npm run image-audit`) reads every `floor_plan_images` row on
an active, non-retired plan and exits non-zero on a real defect. Run it after
anything that adds catalogue imagery. It exists as a *script* rather than a test
because `tests/image-alt.test.ts` pins `public/seed/box-import-manifest.json` — a
committed file, checkable in CI with no network — and therefore cannot see a row
added later by `/admin`, by a migration, or by an agent writing SQL. That blind
spot is exactly how the 14 rows landed.

**The bar is not the same for every image, and conflating them gives a wrong
answer.** Measured 2026-09-28 across 771 rows on 214 published plans:

| `kind` | rows | names a room | what "good" means |
|---|---|---|---|
| `gallery` | 548 | **96.5%** | a photo of *part* of a home — the alt must say which part |
| `banner` | 191 | 21% | a hero shot of the *whole* home; "Woodward multi-section home by Champion Homes" **is** the right alt |
| `floorplan` | 20 | 100% | a drawing |
| `rendering` | 12 | 0% | all Champion's `_LR` suffix — deliberately left alone, see above |

Scoring banners against a room-naming bar produced a misleading "72.9%" and
nearly triggered a pointless rewrite of alt text that was already correct. The
audit keeps the two apart; `tests/image-alt.test.ts` pins the fallback shape a
hero image relies on.

The audit also fails on the two defects that are never a judgement call: a
**document filed as a photo** (a sales sheet is `kind='floorplan'`, never
`kind='gallery'`) and an **absolute URL in `path`** (it bypasses `imgUrl()`).

`rendering`/`render` now maps to "exterior rendering" — eleven files in
`/images/prime/` described nothing before. It is ranked *below* the named rooms,
so `kitchen-rendering.webp` is still "kitchen". Both directions are
injection-tested, and the ordering assertion uses a filename carrying **both**
words: the first version tested it with a filename that had no "rendering" in it
at all and so proved nothing, and passed while the rule was hoisted above every
room.

**The 10 gallery photos that still fall back are correct as they are.** Each is a
plan's own card image reused in its gallery, so the filename is just a model
number (`2460h42096.webp`, `legacy/silverton-2856h32174.webp`) — there is no room
to name because the picture is the whole home. Do not invent "exterior" for them,
for the same reason `_LR` is left alone.

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

# Two lists leave this dealership, and neither one is a recommendation

Kyle, 2026-09-23: *"We do not make decisions for anything not a lender or
contractor — we provide information so the client can choose. No
recommendations disclaimers are important and should be present every place
that matters."* (Same message: *"We do have lending partners but we don't
personally offer in house financing."*)

The lender sheet had a disclaimer. The contractor referral list had none, on
any of the fifteen pages that offered it — same exposure, opposite treatment.
An unqualified "our referral list of licensed and insured contractors" reads as
a vouch for crews we do not hire, supervise, schedule or warrant.

`src/lib/referrals.ts` is the single source for all three wordings —
`LENDER_NO_RECOMMENDATION`, `CONTRACTOR_NO_RECOMMENDATION` and the one-line
`REFERRAL_NO_RECOMMENDATION`. Nothing retypes them.

- **Sitewide:** `ReferralDisclaimer` is inside `ComplianceDisclaimers`, so the
  one-line version rides the layout → `Footer` chain onto every page, next to
  Reg Z and HUD.
- **Where the claim is:** `NoRecommendationNotice` (`subject="lenders" |
  "contractors" | "both"`) renders on every page that names either list —
  `/financing`, five guides, the homepage sections, both location templates and
  the six standalone location pages. Eight city pages inherit it from
  `CityLocationTemplate`, and the guard follows that one level of delegation.
- Contrast is the same 8.25:1 at 12px as `SpecsDisclaimer`, measured in a
  browser with the alpha composited. `tone="dark"` exists for dark surfaces.

**On the phrase "lending partners":** Kyle is right that these are lenders he
works with, but the phrase stays off public pages, because the buyer's own
signed authorization says *"this selection was not referred or suggested"* and
the page's disclaimer says we recommend nobody — "partner" contradicts both in
the one place a regulator would read them together. The guard enforces that.
It is a wording call, not a fact about the relationships, and Kyle can overrule
it; if he does, the disclaimer has to change with it.

Fixed in the same pass, all three of which had survived the earlier sweeps:
Ava's "help check zoning" (we never verify a parcel), her four-lender shortlist
("name them all or none"), `blog.ts`'s "Our team can walk you through your best
options", and two surviving "we can help you check your parcel" claims in
`plan-content.ts` and the Garrett page.

`tests/disclaimers.test.ts` guards both halves: a page that names either list
must render the notice (injection-tested in both directions, including the
template case), and `ComplianceDisclaimers` must keep `ReferralDisclaimer` with
its wording coming from `referrals.ts`.

# Focus, motion and the ld+json escape: three fixes you can only confirm in a browser

Shipped 2026-09-25, and every one of them was mis-diagnosed at least once from
source alone. The lesson repeats: measure the rendered page, and measure it
**after** transitions settle.

**The focus indicator was orange on orange.** Brand buttons carry a permanent
`box-shadow: 0 0 0 2px var(--color-orange)` ring, and the global
`:focus-visible` rule drew a *second* orange outline 2px outside it. Tabbing
onto a button swapped one orange ring for two, which is not a state change a
keyboard user can rely on — WCAG 2.4.11 wants the indicator to contrast 3:1
against what it touches, and orange against orange is 1:1. Brand buttons now
get their own `:focus-visible`: orange ring, 3px white gap, 3px charcoal halo,
which reads on cream, white and the dark sections alike.

Two traps on the way, both of which produced a *wrong* diagnosis first:

- **`button { transition: all 0.3s }` animates box-shadow.** Every measurement
  taken at the moment of focus caught the ring mid-interpolation — layers
  reported as `rgba(0,0,0,0) 0px` and screenshots showed a thinner ring than
  the resting state, which is how "the focus ring is invisible" and "focus
  makes it weaker" both got written down. At t=400ms the real value was there
  all along. The new rule sets `transition: none`, because focus is a state,
  not an animation.
- `getComputedStyle` and the CSSOM disagreed with the served stylesheet often
  enough to be useless on their own. CDP's `CSS.getMatchedStylesForNode` with
  `forcePseudoState` is the tool that actually answers "which rule wins".

**Reduced motion is now honoured.** `@media (prefers-reduced-motion: reduce)`
collapses animation and transition durations and forces `scroll-behavior: auto`
(a zero duration does not stop smooth scrolling — it needs the explicit
override). This is safe *here* specifically because `FadeIn` reveals content by
flipping an inline `opacity` from an IntersectionObserver, not with a CSS
animation: collapsing the duration makes the reveal instant. Verified in
Chromium with reduced motion emulated — 0 of 33 fade wrappers stay transparent,
versus a 700ms fade otherwise. If a future reveal is ever driven by a CSS
`animation`, re-check this block before trusting it.

**Every ld+json block escapes `<` now.** Inside a `<script>` the HTML parser
stops at the first `</script` — JSON quoting is irrelevant, because the parser
never looks inside the JSON. Five emitters existed and only `JsonLd.tsx`
escaped. `jsonLdScript()` in `src/lib/json-ld.ts` is the only serialiser now.
Nothing in the catalogue or the repo carries a `<` in a schema field today
(checked before and after), so this is a guard, not a repair. U+2028 and U+2029
are deliberately *not* escaped: an ld+json block is parsed as JSON, never
executed, so the inline-script hazard does not apply.

Also fixed in the pass: the homepage hero `ImageObject` named a hand-written
`Organization` author with our name and no `@id` — a second business node, the
thing `businessRef()` exists to prevent — and the footer's four column headings
and three opening-hours lines sat at **3.07:1** (`--color-gray` is 4.7:1 on
white but only 3.07:1 on the dark footer). Now 5.71:1 at 12px, measured.

`tests/structured-data.test.ts` fails on an ld+json block built with a raw
`JSON.stringify`, and asserts the escaper both closes `</script` and still
round-trips through `JSON.parse`. Injection-tested.

# Paramount is retired, and not one of its URLs was thrown away

Kyle, 2026-09-26: *"remove Paramount Series and the floor plans associated with
it … However I would like to make sure we do everything we can to capture leads
and website traffic for Redman and Paramount Series."* Those two halves only
hold together if nothing 404s, so nothing does.

**Paramount was never a separate range.** Champion's own literature calls it
"Redman Paramount" (see the standards-sheet citation at the top of
`paramount-content.ts`), and `catalog-index.ts` had already recorded that the
Aspire/Paramount split could not be settled from Champion's price sheet —
`aspire-floor-plans.ts` and `paramount-floor-plans.ts` each claimed 41 of the
same model numbers. Measured against the catalogue on 2026-09-26, **164 of the
186 active Paramount plans were the same Champion model number as an Aspire
plan**, and in every one of those 164 cases the surviving slug is the same slug
with `paramount-` swapped for `aspire-` (verified in SQL: 164 follow the rule, 0
break it, 0 destinations missing or inactive). So retiring Paramount mostly
*consolidated duplicate pages for one physical home* — the thing `AGENTS.md`
already flagged as "a product decision, not a code one". Kyle has now made it.

- `src/lib/retired-series.ts` is the whole model: the 186 slugs, the 22 with no
  twin, `paramountDestination()`, and `retiredSeriesRedirects` (186 plan 301s
  plus `/series/paramount`). `next.config.ts` spreads it **before**
  `legacyFloorPlanRedirects`, whose Paramount destinations were repointed at the
  same targets so a pre-CMS URL still resolves in **one** hop, not two.
- **The 22 that only ever came as Paramount** are the big Alberta, Apollo,
  Fenton, Myrtle, Red Cedar and Stafford sectionals. They land on
  `/series/redman`, which now names all six families with their widths and sizes
  and offers a quote — a page that answers the search, not a bare form. None of
  the 22 is on the master price sheet, so no home left the sale.
- **Suppression is in code, not in Supabase.** `published()` in `api-content.ts`
  filters retired homes out of `getApiFloorPlans()` (so: grid, sitemap, featured
  set, configurator, Ava's catalogue, series hubs) and `getApiFloorPlanBySlug()`
  returns null for a retired slug *or* a retired series label. Flipping
  `is_active` in the CMS instead would have skipped review and would not have
  covered the repo-published copies at all.
- `catalog-index.ts`'s 61 Paramount entries now name the Aspire page for the
  same model, so the sale page links to the listing that is still for sale and
  labels it correctly. The featured thirty are now Aspire 20 / Prime 10 (ten
  single and ten multi-section in Aspire, five and five in Prime), and the copy
  on `/homes-on-sale` says that rather than "ten each from three series".
- `/series/paramount` is gone from `seriesHubs` and from the page registry; the
  Redman entry inherited its priority and keeps a `paramount` topic so a page
  about the old range can still surface its replacement.

**`/images/paramount/**` stays.** Those are photo filenames on disk for homes
that still sell as Aspire; 44 of them appear in the sitemap as `<image:loc>`
entries and none is a page URL. Renaming them would churn every location page
hero for nothing. `series.ts` keeps its `paramount` keyword too — the label has
to be *recognised* to be filtered — and `image-alt.ts` keeps stripping the word
out of legacy filenames.

**Known consequence, not fixed here.** The repo-published catalogue has never
carried a plain `aspire-*` slug (it uses `dutch-aspire-*`, `paramount-*`,
`prime-*`), so in the degraded path where `getSupabaseFloorPlans()` returns `[]`
the 164 redirect destinations are not in the fallback list. This does not create
a new failure class — the 172 CMS Aspire plans already behave that way, and
`getSupabaseFloorPlanBySlug` throws rather than faking a 404 at runtime — but it
does move 186 more URLs into it. Closing it properly means re-slugging the repo
data files to match the CMS, which collides with `mergePlans`' local-wins rule
and would let the repo copy override CMS data for 164 live plans. That is its
own change, with its own testing.

`tests/retired-series.test.ts` holds the line: every retired URL has exactly one
301 to a live, non-retired destination; no redirect chains; nothing in `src/`
links a retired URL; no hub or registry entry publishes a retired series; the
Redman hub carries the Paramount term and names all six orphan families; and a
source scan fails any page that reads as an offer to sell a Paramount home
(sentences that explain the retirement are exempt). Four violation shapes were
injected and confirmed caught.


# The sale page links the page Google can see, and the photos moved first

Until 2026-09-28, 42 of the `CATALOG_INDEX` entries that `/homes-on-sale` takes
its links from named a `dutch-aspire-*` slug. Those pages come from the repo
data files, not the CMS, and `mergePlans()` drops a repo plan whose CMS twin
carries the same series and model code — so **not one of the 42 was in
`/floor-plans`, `sitemap.xml`, the featured set or Ava's catalogue** (measured:
0 of 42 in the live sitemap, against 172 for the CMS Aspire pages). They still
*rendered*, because `getApiFloorPlanBySlug` falls back to the repo list, so
nothing 404'd and nothing looked wrong. Every buyer who clicked a sale home just
landed on a duplicate of the CMS page that Google cannot index.

All 42 now point at the CMS page. The ordering mattered:

- **The photography shipped before the links.** 14 of the CMS records carried
  only the banner and the option drawing, while the repo twin showed Champion's
  photo set — the Woodward pair 13 photos vs 2, the 1672 15 vs 3. Switching
  first would have stripped those from the page buyers actually reach.
  `supabase/migrations/20260928_catalogue_photo_parity.sql` carries the **34
  professional shots** across and closes those three gaps completely.
- **Parity was the wrong target, and copying it blindly was a real mistake.**
  The first version of that migration reproduced the repo galleries exactly —
  including 14 rows of legacy S3 *banner* art. On a page Google cannot see that
  art cost nothing; on the canonical page it is a liability, and it took Kyle
  asking "did you verify all images have metadata correctly input for SEO" to
  catch it. Each one was **~600×400** against the photos' 1800×1200, showed a
  **different model number** (the 2856/2860 Warren banners landed on the 2852
  Warren's page), had no room in the filename so `describeImageFile()` returned
  `""` and the alt fell back to the generic form — **13 of 48 additions, i.e.
  72.9% specific against the 95% floor `tests/image-alt.test.ts` holds** — and
  one was a **sales sheet, not a photograph**, filed as `kind='gallery'`.
  `sitemap.ts` feeds `plan.gallery` into `<image:loc>`, so all of it would have
  gone to Google Images. All 14 rows were deleted. Eleven homes now show one or
  two fewer images than their repo twin did; what they lost was a blurry
  thumbnail of another length of the same home. **Check what an image *is*
  before copying a gallery — matching a count is not the goal.**
- **No upload was needed.** `floor_plan_images.path` already holds two forms and
  `imgUrl()` resolves both: `/images/…` for a file served from the repo, and a
  bare storage key (`legacy/…`) for the bucket. **Never an absolute URL** —
  there were 0 in the table and adding one would bypass `imgUrl()`.
- **Every added row is `kind = 'gallery'`, appended after the existing rows.**
  `banner` would compete with the `floor_plans.banner_image` column, and
  `floorplan` would change which image `drawingFrom()` picks as the plan
  drawing. Appending keeps the existing `-opt2` row winning that pick — checked
  for all 14, since `DRAWING_RE` matches `floor-plan` and *every* resolved
  storage URL contains `/floor-plans/`.
- **Slugs are not a prefix swap.** The CMS drops the family name on some models
  (`dutch-aspire-westbrook-1676h32107` → `aspire-1676h32107`). Read each slug
  from the CMS row for that model number; rewriting the old slug invents a URL
  that 404s.

`tests/catalog-index.test.ts` fails if an entry points back at a
`dutch-aspire-*` slug, at a retired series or plan, or at a slug whose prefix
disagrees with its series. Both violation shapes were injected and confirmed
caught.

**Two measurement traps cost a wrong answer here first.** Counting every image
on a rendered plan page includes the four comparable-home cards, so a 9-vs-9
gallery reads as "13 vs 14" — count only the gallery. And reading `mergePlans()`
alone says these URLs cannot resolve; the detail route has its own fallback, so
they do. Fetch the page.

# We are the dealer. Never say the buyer buys "from the factory"

Kyle, 2026-09-28: *"Champion only sells to dealers."* The site had drifted into saying
buyers "buy directly from the factory through us", "skip the traditional dealer markup",
and get "no middlemen". Those claims deny that we are a dealer. They were removed from
`/`, `/about`, the Auburn, Huntertown, Columbia City and New Haven location pages,
`blog.ts` and `local-posts.ts`. At his request the site also no longer discusses Champion's
sales channel at all, so there is no "Champion sells only through dealers" FAQ.

What we may say: "Factory Direct" is the business name; we order each home from
Champion's Topeka plant, quote it line by line and arrange delivery. What we may not say:
that the buyer purchases from the factory or the manufacturer, or that there is no dealer,
dealer markup or middleman in the sale.

Also removed at Kyle's request the same day: any claim of "no dealer markup" or "zero
markup" on contractor or site work (the pricing guide, two city posts, Ava's context).
Say only that the buyer hires and pays their own contractors.

# Lighthouse 2026-09-28: the gray text token failed AA, and pages nested <main>

A mobile Lighthouse run on `/` scored Performance 98 / Accessibility 97 / Best
Practices 100 / SEO 100. Every accessibility failure was one of two things, and an
axe sweep of ~100 pages found the same pairings repeated sitewide:

- **`--color-gray` was slate-500 (#64748b)**: 4.44:1 on cream, 4.03:1 on
  cream-dark — under 4.5:1 on the backgrounds most body copy sits on. It is now
  **#586579** (5.52 / 5.01 / 5.91 on cream / cream-dark / white). Light surfaces
  only; on charcoal use white with alpha.
- Two text tokens exist for the pairings that failed elsewhere:
  `--color-lime-on-dark` (green on charcoal; `--color-lime` is 2.66:1 there) and
  `--color-orange-text` (`--color-orange` is 3.05:1 on white — fine as a fill,
  fails as type). Faded text (`text-white/40`, `/70` on teal, `charcoal/50–60`,
  `text-gray-400`, `--color-gray-light` on white) was raised until it passed.
- Inline links in running text are underlined, not colour-only (axe
  `link-in-text-block`: teal vs charcoal is 2.66:1).
- **Only the root layout renders `<main>`.** Eleven pages opened their own inside
  it. `PageFooter` is an `<aside aria-label="Related resources">` and its crumb
  nav is "Page location" (pages with their own visible breadcrumb had two navs
  named "Breadcrumb"); `AnnouncementBar` is an `<aside>`.

`tests/accessibility.test.ts` holds the token contrasts and the single-`<main>`
rule. Individual element contrast still needs a browser — axe composites alpha
against the real background; source reading cannot.

Performance: hero images use `preload` + `fetchPriority="high"` (Next 16
deprecates `priority`, which preloaded **without** a fetch priority — the one LCP
check that failed). The header logo is `loading="eager"`, not preloaded, so it
does not compete with the hero. `experimental.inlineCss` was A/B-tested and gave
no measurable gain, so it is off. The "Legacy JavaScript" insight (~14 KiB) is
Next's own built-in polyfill module, which Turbopack always bundles; it is
unscored and cannot be removed from config.

Best Practices: `Cross-Origin-Opener-Policy: same-origin` added. An *enforced*
CSP with nonces is the remaining unscored "High" item; nonces force every page to
render dynamically (no static/ISR HTML), which would cost the performance score
it is meant to protect, so it is a deliberate non-goal for now.

# DealerTide review 2026-09-28: titles, page weight, and two checker false positives

DealerTide's automated review scored the site 88/100 with four findings. Two were
real, two were the checker's.

- **Titles over 65 characters — real, and much wider than its sample.** Every
  floor-plan title (~200 pages) and every blog post (~30) ran 70–160 once the
  layout's " | Factory Direct Homes" suffix was added. `src/lib/page-title.ts`
  now builds them: `fitTitle()` takes candidates from most to least descriptive
  and returns the first ≤ 65 as an **absolute** title. Plans: name — beds/baths
  Champion type, Auburn IN → drop the place → drop the brand → drop the type.
  Posts: headline + brand → headline → subject (before the colon) + brand →
  subject; the H1 keeps the full headline. `generateMetadata()` in `seo.ts`
  keeps the brand suffix only when it fits. `tests/page-title.test.ts` runs the
  ladder over the longest CMS names and every published post. When adding a page
  with a hand-written `metadata.title`, keep title + 23-char suffix ≤ 65.
- **HTML over 600 KB — real.** `/floor-plans` was 1.2 MB and `/homes-on-sale`
  800 KB, almost all of it repetition: ~2 KB of utility classes per card (now
  `.fp-card*` / `.fp-compare*` in `globals.css`, same styles), and srcsets that
  repeated the full Supabase URL ten times per image. Catalogue photos now render
  through `/fp/<key>` — a same-origin rewrite to the bucket (`src/lib/image-src.ts`,
  `next.config.ts`) — and `deviceSizes` drops 2048/3840, which no image is shown
  at. Only the *display* src is short: sitemap `<image:loc>`, og:image and JSON-LD
  keep the canonical Supabase URL. The sale table's 64px thumbnails were
  `fill` + `sizes="64px"`; next/image only parses `vw` in `sizes`, so each listed
  every width up to 1920. Fixed-size thumbnails list 1x/2x. The grid's client
  props no longer carry the unused `title` and use short image paths.
  **Measured live after that pass: `/homes-on-sale` 796 → 516 KB, `/floor-plans`
  1,214 → 810 KB — still over.** Two things only production showed: Vercel adds a
  38-character `&dpl=<deployment id>` to every *same-origin* optimiser URL (so
  moving photos to `/fp/` grew each srcset entry back), and next/image always
  emits every configured width. Floor-plan cards now render through
  `CatalogueImage` — a plain `<img>` with a **three-width** srcset (640/828/1080)
  of the same `/_next/image` URLs, no `dpl` tag — and `gridPlan()` in
  `floor-plans/page.tsx` sends the grid only the fields it reads. The page's
  ItemList schema is rendered by `FloorPlansGrid` from its props, because
  anything a *server* component renders is serialised a second time into the
  RSC payload. Verified on production before this pass: `/_next/image?url=/fp/…`
  answers 200 `image/webp`, so the rewrite works through Vercel's optimiser.
- **"No local business markup" — false positive.** The node (address, geo,
  hours, areaServed) was on every page, typed `["MobileHomeDealer",
  "RealEstateAgent", "HomeAndConstructionBusiness"]`, all LocalBusiness
  subtypes. The checker matched the literal string. `BUSINESS_TYPES` now names
  `LocalBusiness` too, which costs nothing.
- **"Render-blocking script" — false positive, not fixable in config.** The only
  head script without async/defer is Next's `<script noModule>` polyfill, emitted
  unconditionally by `app-render.js`. A browser that supports ES modules — every
  browser since 2018 — never downloads a `nomodule` script, so it blocks nothing.

# PageFooter is lazy, because it carries every blog post

PageSpeed on 2026-09-29 scored `/` at 93 (LCP 3.2 s) against 98 the day before.
The largest first-party script on every page was ~235 KB raw / ~67 KB compressed
of **blog post HTML**: `PageFooter` is a client component (it needs
`usePathname`), it imports `sitePages` from `src/lib/pages.ts`, and the registry
is derived from `localBlogPosts` — bodies and all. Every new post made every
page heavier; five were added on each of 2026-09-28 and 2026-09-29.

The root layout now renders `DeferredPageFooter`, which `React.lazy`-loads
`PageFooter`. It is still server-rendered (the cards, crumbs and the
BreadcrumbList schema are in the HTML), but its chunk is requested after
hydration starts instead of before the LCP image. Verified in a browser: footer
present, crumbs correct per page, no hydration errors. `tests/bundle-weight.test.ts`
fails if the layout imports `PageFooter` directly again.

Measurement caveat, learned the hard way: local Lighthouse (simulated, Moto G /
slow 4G) matched PageSpeed's 93 closely, but five runs of *identical* code
spread 80–96, and four variants (baseline, no font preload, lazy footer, the old
`priority` prop) all landed at a median of 91–92. Run-to-run noise is larger
than any of these changes, so do not read one PageSpeed run as a regression or
a win — take the median of three or more. Font `preload: false` measurably
**hurt** FCP (1.22 → 1.54 s) and was not kept.

# The consent banner is in the server HTML, because it was the mobile LCP

PageSpeed mobile on 2026-09-29 scored `/` at 86 with LCP 4.0 s, and the LCP
element was the consent banner's paragraph, not the hero. The banner was absent
from the HTML (server snapshot `false`) and mounted after hydration, so ~all of
its LCP was "element render delay" waiting on the JS. It is now rendered on the
server for everyone (`getServerNeedsPromptSnapshot()` → `true`) and paints in the
first frame. `CONSENT_PREPAINT_SCRIPT` (inline in the root layout's `<head>`)
sets `data-consent-answered` on `<html>` before paint for a visitor who has
answered or sends GPC, and `globals.css` hides `#consent-banner` under it, so a
returning visitor sees no flash; hydration then removes the element.
`subscribeConsent()` keeps the attribute in step afterwards, which is what lets
"Cookie preferences" re-open the banner. Nothing visitor-specific is in the
cached HTML and the homepage stays static. Reading the consent cookie with
`cookies()` in the layout was rejected for the same reason as CSP nonces: it
makes every page dynamic. Analytics gating is unchanged — it still uses
`getServerConsentSnapshot()` (`false`).

Measured locally with Lighthouse mobile using `--throttling-method=devtools` and
the hero image blocked (the one setup that reproduces production's LCP element):
LCP 3.4 s → 1.8 s, score 86 → 92–94, three runs each. The default *simulated*
throttling does not show the gain on localhost: every script finishes before the
first frame there, so Lantern attributes all the JS to LCP whatever paints
first. Check the observed timings (`metrics` audit: observed LCP = observed FCP
after the change) before concluding a render-path change did nothing.
`tests/consent-banner.test.ts` runs the pre-paint script against
`resolveConsent()`'s cases (answered, GPC, expired, wrong version, blocked
storage).

Two other suggestions from the same audit were checked and are already settled
above: `experimental.inlineCss` (A/B-tested, no gain, off) and the "Legacy
JavaScript" polyfills (Next's own built-in module; a `browserslist` entry does
not remove it).

# The business-node guard walked the generators; the violation was in a component

Kyle reported local-markup errors for a missing address on multiple pages
(2026-09-30). Crawling all 168 sitemap routes and parsing every ld+json block
found **no LocalBusiness node missing an address** — that specific error was
not reproducible. What it did find was the same family of defect one level
over: **184 nodes carrying our name with no `@id`**.

- the `WebSite` node from `structuredData.website()`, on all **168** pages
- anonymous `Organization` `author` *and* `publisher` on the **8** guide pages,
  hand-written inside `GuideMeta` rather than taken from a generator
- `HomeVideo`'s `publisher`, found only by the new source scan

`structuredData.article()` had been correct the whole time — it sets the
canonical `@id`. `GuideMeta` never called it; it inlined its own Article
schema. That is why every existing guard missed this: `tests/structured-data.test.ts`
walks the output of `structuredData.*`, and a node typed out in a component is
invisible to that walk. **A guard that only inspects the generators cannot
prove anything about the page.**

Fixed by giving every one of them a helper:

- `publisherRef()` (`src/lib/seo.ts`) — `businessRef()` plus the `logo` Google
  wants on a publisher, so the node merges on `@id` *and* validates standalone
  with an address. Used by `article()`, `videoObject()` and `HomeVideo`.
- `GuideMeta` now calls `structuredData.article()` instead of inlining.
- The `WebSite` node gets its own `@id` (`/#website`) — it is a genuinely
  different entity from the business — and names the business as its
  `publisher` via `businessRef()`, so the two are linked rather than two
  unrelated nodes sharing a name.

Two new guards, both injection-tested by reintroducing the exact bug:

- a **source scan** that fails when any file hand-writes an
  `Organization`/`LocalBusiness` literal carrying the business name without an
  `@id` or a `…Ref()` call. This is the one that would have caught `GuideMeta`,
  and it found `HomeVideo` immediately.
- the `WebSite` node must carry its own `@id` and a publisher ref with an
  address.

**When a crawler reports a structured-data problem, crawl every route and parse
the blocks before believing or dismissing it.** The reported symptom (missing
address) was not present; the underlying disease (unidentified duplicate nodes
carrying our name) was, on every page of the site. Check the compare-audits
file for the real crawl timestamp too — Semrush export dates are not crawl
dates, and a stale export describes a site that no longer exists.
