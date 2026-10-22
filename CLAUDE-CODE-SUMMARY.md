# Traffic-drop remediation — summary for Kyle

**Date:** 2026-10-17 · **Branch:** `fix/ga4-measurement-and-sitemap-guard` (PR, not pushed to main)
**Input:** `TRAFFIC-DROP-HANDOFF.md` (Ava's investigation)

## The short version

The site is healthy. What "tanked" in mid-August was GA4's ability to count visitors,
not the visitors. I measured the old behaviour in a real browser before changing it,
fixed the undercount while leaving the consent banner and Global Privacy Control exactly
as they were, hardened the sitemap against a CMS outage, and confirmed the Aug 4 hero
CTA bug is long gone.

**Expect GA4 users, sessions and page views to step UP after this deploys.** That is
not new traffic; it is traffic that was always there and was not being counted.

## What I measured (Chromium, mobile viewport, against the running site code)

| Scenario | Before | After |
|---|---|---|
| Visitor lands, never scrolls or taps | gtag.js first requested at **6.3 s**; visits shorter than that were never counted | gtag.js at **0.1–0.3 s**, one page_view |
| Visitor scrolls after 1 s | gtag.js at 1.2 s | 0.1–0.3 s |
| Browser sends Global Privacy Control | no tags, no banner | **unchanged** — no tags, no banner |
| Clicks Decline after GA loaded | every tag kept running until the next page | **zero further hits** on that page; nothing loads on later pages |
| Client-side navigation to another page | one page_view | one page_view (consent state `G111` on the hit) |

The old script called `gtag('config')` twice; I checked and it sent one page_view, so
consolidating it does not change your numbers.

## What changed

1. **GA4 loads immediately for allowed visitors** (`src/lib/analytics.tsx`,
   `src/lib/ga-consent.ts`). It is no longer behind the 6-second first-interaction gate or
   next/script's `lazyOnload`. Microsoft Clarity, GTM and the Meta Pixel still wait for the
   first interaction, because a lost session recording is not a lost visit.
2. **Google Consent Mode v2 is declared.** Defaults are "granted", which is honestly what the
   opt-out model already does. A mid-visit Decline now sends a consent update to "denied",
   flips Google's documented `ga-disable` switch, and tells Clarity to stop.
3. **The sitemap refuses the degraded catalogue** (`src/app/sitemap.ts`,
   `src/lib/sitemap-catalogue.ts`). If Supabase cannot be read, or returns far too few rows,
   the sitemap keeps serving its last good copy (runtime) or omits the floor-plan section
   (build time) instead of publishing the repo fallback, which is 77 plans of which 44 are
   URLs that redirect. Blog posts come from the repo and were never at risk.
4. **Tests**: `tests/analytics-gates.test.ts` and `tests/sitemap-guard.test.ts` (14 new tests,
   220 total, all passing). Typecheck, lint (zero warnings) and `next build` pass.
5. **Docs**: a new section at the end of `AGENTS.md` records the diagnosis, the measurements and
   the rules so the gate is not reintroduced to win a Lighthouse score.

## What I deliberately left alone

- **The consent banner, its wording, the Decline/Accept buttons, GPC handling, the
  pre-paint script and `resolveConsent()`.** Not a character changed. Indiana notice-and-opt-out
  compliance is intact.
- **The privacy policy.** Legal verbiage; untouched.
- **The hero CTA.** The Aug 4 audit's `http://3.216.190.16` link came from the retired AWS CMS
  `content` table. The hero is now static in `src/app/page.tsx` and points at `/floor-plans`;
  production HTML has no bare IP anywhere. Nothing to fix.
- **The 6-second interaction defer for Clarity/GTM/Pixel.** Kept as-is; only GA4 moved out.
- **GA4's cookies for a decliner.** gtag does not delete `_ga` cookies already written;
  after a Decline nothing reads or sends them again. Removing them client-side is possible but
  is a behaviour change to the consent model I did not want to make unilaterally.
- A stale `.env.local` (June 23, `G-PLACEHOLDER`) in this working tree was moved to
  `/tmp/fdhc-stale-env-local.bak`. It never reached production.

## Two things only you can check (needs your Google login)

1. **Search Console → Performance → Clicks**, July through October. GSC counts Google-referred
   visits independently of any tag or consent choice. If clicks are steady or rising while
   GA4 fell from mid-August, the undercount diagnosis is proven.
2. **Search Console → Pages → indexed count**, to rule out a September indexing regression
   after the CMS migration. (The live sitemap today lists 370 URLs: 214 floor plans, 84 posts.)

## One recommendation

**Vercel Web Analytics is not enabled** on the production project (I checked: the API
returns "Web Analytics not found"). It is cookieless, first-party and would count every
visit regardless of consent, giving you a second number to compare against GA4 forever.
It needs a dashboard toggle plus one sentence in the privacy policy naming it, so I did
not add it; say the word and it is a ten-minute change.

Semrush could not help this time: the account has no API units left.
