# Competitor research — 2026-10-13

Five competitors, researched from search results (Semrush had no API units; the
sandbox cannot fetch competitor sites directly, so page details come from
search snippets and are marked unverified where they could not be checked).
Rankings are from a search tool, not confirmed Google positions or the map pack.

## Who shows up, and where we don't

Across 14 core searches (Fort Wayne, Auburn, Warsaw, Kendallville, single/double
wide, modular, "Champion dealer", "factory direct mobile homes"):

| Competitor | Appearances | How it wins |
|---|---|---|
| **Fahl Homes**, Warsaw (fahl-homes.com) | 9 of 14 | A city page for nearly every NE Indiana town — **including Auburn** (`/auburn-manufactured-homes`), Fort Wayne, Kendallville, Warsaw. Sells Champion Aspire too, and is on Champion's and Dutch Housing's dealer locators. |
| **Home Nation** (homenation.com, Brazil IN) | 6 | Templated "N mobile homes for sale in {City}, Indiana" pages; cost guides with dollar ranges; 442 Trustpilot reviews. |
| **Champion Homes Center**, Topeka (factorydirectmobilehomes.com) | 4 | "Mobile homes" wording, single-wide / double-wide / clearance pages, prices shown. No city pages, no blog. |
| **Factory Expo**, Nappanee (expohomes.com) | 2 | Prices and countdown sales; sells Cavco, not Champion; no city pages. |
| **Clayton of Garrett** (claytonhomes.com) | 2 | Corporate location page; 3.5★ from 51 reviews; three different phone numbers across listings. Same highway as us (1850 SR 8). |
| **Us** | 4 | Absent from every Fort Wayne, Warsaw, Kendallville, modular and single/double-wide search. |

Directories that rank on almost every query: **manufacturedhomes.com** (and its
sister sites modularhomes.com / yourindianahomes.com), **MHVillage**,
mobilehome.net, Yelp. Every competitor is listed on them; we are not.

## What changed on the site (this PR)

- **Internal links to the town pages.** Nothing outside `/locations` linked a
  single town page. The footer (every page) and the homepage now link Auburn,
  Fort Wayne, Kendallville, Garrett, Angola, Columbia City, Warsaw/Kosciusko and
  Goshen/Elkhart (`src/lib/service-area-links.ts`).
- **"Mobile homes" wording.** Buyers and every competitor say "mobile homes";
  our titles only said "manufactured". Fort Wayne, Auburn, Kendallville,
  single-wide and double-wide titles now carry both, and the homepage title now
  says "Manufactured Homes in Auburn, IN". New homepage FAQ: "Is a manufactured
  home the same as a mobile home?"
- **Champion vs. Clayton** rewritten from ~600 to ~1,000 words: a side-by-side
  checklist for comparing two homes, how each purchase is structured, and the
  questions that make two quotes comparable. Claims that broke our own rules
  were removed ("save real money" on site work, a characterisation of the other
  side's lending, "family-run").
- **Accuracy fixes found on the way:** the footer and `/about` called us the
  "exclusive" Champion dealer (Fahl sells the same Aspire line), `/about` claimed
  "better pricing than dealers who split focus", and a homepage FAQ said our
  price included setup and site work.

## What only Kyle can do — in order of impact

1. **Google Business Profile** (the map pack is where local buyers click):
   - Ask every buyer you've delivered to for a Google review. Clayton Garrett
     has 51 (3.5★) and Factory Expo ~131 — a dozen genuine 5★ reviews
     changes the local pack. Never offer anything in exchange.
   - Primary category **Mobile home dealer**; add **Manufactured home dealer**
     and **Modular home dealer** as secondary.
   - Post weekly (a home on the lot, a delivery photo), add 20+ photos of the
     showroom and homes, and answer the Q&A yourself.
   - Service areas: Auburn, Fort Wayne, Kendallville, Garrett, Angola,
     Columbia City, Warsaw, Goshen.
2. **Directories** — see `docs/local-citations.md`, Tier 3. Start with
   **manufacturedhomes.com** (one sign-up feeds three sites), **MHVillage**,
   (Correction 2026-10-14: we **are** already on the Champion and Dutch Housing
   dealer locators; just check they show the right address and phone.) Paste the NAP from `npm run citation-nap` exactly.
3. **Search Console** — after this deploys, use URL Inspection → Request
   indexing on `/locations/fort-wayne`, `/locations/auburn`,
   `/locations/kendallville`, `/double-wide-homes`, `/single-wide-homes`.

## Deliberately not done

- **No new batch of town pages.** Fahl and Home Nation win with them, but our
  site just added ~75 town posts and county pages, and Google's September 2026
  spam update (from 2026-09-24) targets exactly that pattern. Strengthen and
  link the pages we have first; reassess with Search Console data.
- **No prices.** Champion Homes Center, Factory Expo and Home Nation lead with
  them; `SHOW_PRICES` stays off until Kyle decides otherwise.
- **No claims about competitors' service or reviews** on the site.
