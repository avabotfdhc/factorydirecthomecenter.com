# Traffic Drop Investigation — Handoff to Claude Code
**Date:** 2026-10-17 · Prepared by: Ava · For: autonomous remediation by Claude Code
**Authority granted by Kyle (owner):** "handoff all findings to claude code and allow claude code to do what it feels is best"

---

## The problem Kyle reported
> "Traffic tanked all of a sudden and it should be going up not down."

## Executive summary of my findings
The **site itself is healthy**. The reported "traffic drop" is almost certainly a **GA4 measurement artifact**, not a real loss of visitors. Two August changes throttle what Analytics counts. Your job: confirm the diagnosis where you can, and fix the undercounting without breaking legal consent compliance or page performance.

---

## ✅ What I verified is HEALTHY (don't waste time re-fixing these)
- **HTTP 200**, 0.24s response, Vercel-served, `x-vercel-cache: HIT`
- **SSL valid**, HSTS present (`max-age=63072000; includeSubDomains; preload`)
- **NOT on Google Safe Browsing / malware blocklist** — domain is clean
- **Indexing directives correct:** homepage has `<meta name="robots" content="index, follow">`, googlebot meta correct, clean `<link rel="canonical">`, **no** `X-Robots-Tag` header
- **robots.txt healthy:** allows all, disallows only `/admin`, `/design-system`, `/api/`; explicitly allows GPTBot/ClaudeBot/PerplexityBot/GoogleOther; points to sitemap
- **Sitemap strong:** 370 URLs — 317 floor-plans, 85 blog, 41 locations, 9 guides, 4 series, plus static pages. (Big improvement over the 15-URL sitemap flagged in the Aug 4 audit.)
- **Pages render real content & return 200:** homepage ~9,400 visible words, floor-plan detail ~4,350 words. Googlebot user-agent also gets HTTP 200.
- **GA4 endpoint responds:** `https://www.googletagmanager.com/gtag/js?id=G-6PMB9SZX4H` → 200

So: **not a hack, not a penalty, not a blocklist, not a broken deploy, not a crawl block.**

---

## 🔴 PRIMARY SUSPECT — GA4 undercounting (the real story)

GA4 Measurement ID in use: **`G-6PMB9SZX4H`** (hardcoded default in `src/lib/analytics.tsx`, overridable via `NEXT_PUBLIC_GA_MEASUREMENT_ID`).
Clarity: `tjh2nfoq85`. FB Pixel + GTM IDs are **empty** by default (so FB Pixel and GTM effectively don't load unless env vars are set).

Two gates in `src/lib/analytics.tsx` → `AnalyticsProvider()` both must pass before ANY tag loads:

```ts
const ready = useDeferUntilInteraction();   // gate 1: performance
const allowed = useTrackingAllowed();        // gate 2: consent
if (!ready || !allowed) return null;
```

### Gate 1 — `useDeferUntilInteraction(timeoutMs = 6000)`
Analytics only load after the FIRST user interaction (scroll/keydown/pointerdown/touchstart/mousemove/click) OR a **6-second idle fallback**.
**Impact:** every visitor who leaves in under ~6s *without interacting* is **never counted**. On mobile/paid traffic that's a large share of sessions. Landed in **PR #60/#61 (2026-08-18)**.

### Gate 2 — `useTrackingAllowed()` + consent banner
Notice-and-opt-out model (`src/lib/consent.ts`). Tags are suppressed for:
- anyone who clicks "decline" on the banner, AND
- any browser sending **Global Privacy Control** (`navigator.globalPrivacyControl`) — Firefox, DuckDuckGo, Brave, many privacy extensions. These visitors **never show the banner and are never tracked**.
Consent banner landed in **PR #75 (2026-08-30)**.

### Why this looks like "traffic tanked all of a sudden"
Both changes shipped in **mid/late August 2026**. GA4 "users/sessions" would step down right around then and stay down, while **real** traffic is likely flat or growing. Classic measurement cliff.

### Relevant git history
```
2026-08-30 a63714f #75  Site audit fixes: ... consent ...   <-- consent gating
2026-08-18 469ae1f #61  perf: load analytics after first interaction + slim hero
2026-08-18 180bed9 #60  perf: defer tracking scripts to lazyOnload + LCP hero priority
2026-08-17 981d809 #48  Turn on analytics — GA4 (G-6PMB9SZX4H) + Clarity
2026-09-03 db08af3 #81  New owned CMS (Supabase) — most recent deploy
```

---

## 🟠 SECONDARY — rule out a real Sept indexing loss
Last deploy was the **Sept 3 CMS migration (#81)**. Sitemap is now CMS-driven (`src/app/sitemap.ts` calls `getApiFloorPlans()` / `getApiBlogPosts()`, `revalidate = 3600`).
**Risk:** if the CMS API ever returns empty/errors during sitemap regeneration, floor-plan + blog URLs vanish from the sitemap. Right now it's healthy (317 plans present), but worth a guard so a transient CMS outage can't silently gut the sitemap.

---

## What Kyle can confirm that I/you cannot (needs his Google login)
- **Google Search Console → Performance → total Clicks.** GSC counts real Google-referred visits and is **immune** to the consent banner and interaction gating. If GSC clicks are steady while GA4 is down → undercounting confirmed, full stop.
- **GSC → Pages → indexed count** to rule out a Sept CMS-migration indexing regression.

(Leave a short note in your final summary telling Kyle exactly these two checks.)

---

## Recommended remediation (do what you judge best — this is a starting point)

1. **Stop GA4 undercounting while staying legally compliant.** Options, pick what's cleanest:
   - Load GA4 **immediately** (not interaction-gated) for visitors who are *allowed* (consented / no GPC), keeping the heavier Clarity/FB behind the interaction defer. GA4's `gtag` is light; the perf rationale for deferring it is weak compared to the data loss.
   - OR reduce the idle fallback from 6000ms to something like 2500ms.
   - OR use GA4 **Consent Mode v2** (`gtag('consent', 'default'/'update', ...)`) so you still get cookieless pings/modeled conversions from opted-out users instead of total silence. This is the "best practice" answer if you want to do it properly.
   - **Do NOT** remove the consent banner or ignore GPC — that's an Indiana-law compliance requirement Kyle wants kept.

2. **Harden the sitemap** (`src/app/sitemap.ts`) so a transient empty CMS response can't drop all floor-plan/blog URLs (e.g., keep last-known-good, or skip regeneration when the plan count collapses to ~0).

3. **Verify the broken homepage CTA from the Aug 4 audit is actually fixed.** The audit (`FDHC-LIVE-SITE-AUDIT-AUG4.md`, item #1) found the hero "Schedule a Meeting" button pointed to `http://3.216.190.16` (bare AWS IP → nginx 404, insecure http). Confirm it now points somewhere valid like `/contact-us`; if not, fix it.

4. Anything else you judge high-value for the traffic goal — but **git discipline: ALWAYS pull before push** (hard rule from Kyle), and open a PR rather than force-pushing to main.

## Constraints / house rules
- **ALWAYS `git pull` before `git push`** — 100% of the time (Kyle's rule).
- Prefer a branch + PR; don't rewrite legal/contract verbiage.
- GA4/Clarity IDs are public and intentionally in source — fine to keep. Never commit real secrets.
- Keep the consent banner and GPC honoring intact.

## Key files
- `src/lib/analytics.tsx` — all tag loading + `AnalyticsProvider` (the two gates)
- `src/lib/consent.ts` — consent model, GPC, storage
- `src/components/ConsentBanner.tsx` — the banner UI
- `src/app/layout.tsx` — where providers mount
- `src/app/sitemap.ts` — CMS-driven sitemap
- `FDHC-LIVE-SITE-AUDIT-AUG4.md` — prior full audit (CTA bug is item #1)

---
*End of handoff. You have authority to implement what you judge best toward the goal: real, growing, correctly-measured traffic.*
