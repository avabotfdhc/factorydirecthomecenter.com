# Local citations / business registries

Working list for building local authority for **Factory Direct Homes Center**,
1211 State Road 8, Auburn IN 46706.

**Run `npm run citation-nap` and paste from its output.** Every field it prints
comes from `src/lib/business.ts`. Do not retype from memory and do not copy from
an existing listing — see "The only rule that really matters" below.

---

## The only rule that really matters

Citation building fails on **inconsistency**, not on volume. Thirty listings
that agree beat sixty that don't. Google reconciles name/address/phone across
the web into one entity; three spellings of the same address read as three
businesses with similar names, and that is worse than two fewer listings.

Three specific traps for this business:

1. **Two phone numbers.** `(260) 308-1457` is the **voice** line and is the main
   number on every listing. `(260) 750-1828` is the **texting** line and goes in
   a listing *only* where the form has a separate SMS/text field. Putting the
   texting line in the main phone field is the exact defect that cost real leads
   on the website in September — a buyer calls a line that doesn't answer them.
2. **The address is `1211 State Road 8`.** Not `1211 IN SR-8`, not
   `1211 IN-8`, not `1211 State Rd 8`. One spelling, everywhere.
3. **The opening date is November 2024.** The Google Business Profile said
   21 September 2024 and is being corrected. Never "fix" a new listing to match
   the old listing — the facts flow from Kyle.

Claim rules apply to directory descriptions exactly as they do to the site
(`AGENTS.md`): we are the dealer, so never "buy direct from the factory" or "no
dealer markup"; we do not offer, arrange or broker financing and we rank no
lender; we do not perform site work, setup, foundations or zoning verification;
no home dollar figures. The descriptions `citation-nap` prints are already
written to those rules — prefer them over writing fresh copy.

---

## What I could and could not do

I **cannot** create these accounts. Every one needs an email, phone or postcard
verification in Kyle's name, several are paid, and the sandbox this repo is
worked in has no outbound network access to any of these hosts. Creating public
records in the business's name is also Kyle's call, not an agent's.

What this file is: the prioritised list, the exact data to paste, and a place to
record each profile URL as it goes live. Send me the URLs and I add the real ones
to `BUSINESS.sameAs` so the site's structured data claims them.

---

## Tier 1 — do these first (they feed everything else)

The aggregators syndicate to hundreds of smaller directories. Fixing data here
prevents downstream sites from re-importing a wrong version later. **Unverified:
the partner lists these services advertise are their own marketing claims, and
I could not confirm them from primary sources — treat the "feeds" column as
indicative.**

| # | Registry | Why it matters | Cost | Verification |
|---|---|---|---|---|
| 1 | **Google Business Profile** | Already live. The single highest-value listing. | Free | Done |
| 2 | **Bing Places** | Kyle reported claiming this on 2026-10-09 — confirm it is verified, not just submitted | Free | Phone/postcard |
| 3 | **Apple Business Connect** | Apple Maps + Siri; nothing else feeds it | Free | Phone/email |
| 4 | **Foursquare / Places** | Said to feed Apple, Uber, Snap, TomTom | Free tier | Email |
| 5 | **Data Axle** (formerly Infogroup) | Said to feed Yahoo, Bing and many secondaries | Reported ~$30/loc | Phone |
| 6 | **TransUnion Digital Business Profile** (formerly Neustar Localeze) | Said to feed Bing, Yahoo, MapQuest, Garmin | Paid | Phone |

## Tier 2 — the majors buyers actually use

| # | Registry | Notes |
|---|---|---|
| 7 | **Yelp** | Semrush's scan already found it present and clean |
| 8 | **Facebook Page** | Live; Kyle added the phone number on 2026-10-09 |
| 9 | **Better Business Bureau** | Accredited costs money; the free profile still carries weight locally |
| 10 | **Nextdoor Business** | Genuinely strong for a local home dealer — neighbourhood-level reach |
| 11 | **MapQuest** | Usually inherited from an aggregator; check rather than duplicate |
| 12 | **Yellow Pages (YP.com)** | Free basic listing |
| 13 | **Manta** | Free |
| 14 | **Hotfrog / Cylex / Where To?** | Semrush already shows Cylex and Where To? as clean |

## Tier 3 — industry-specific (the highest-value ones after Google)

A relevant industry directory beats ten generic ones. These are where a buyer
shopping for a manufactured home actually looks.

| # | Registry | Notes |
|---|---|---|
| 15 | **MHVillage** | The dominant manufactured-housing marketplace. It carries a dealer directory (`mhvillage.com/dealers/in` lists Indiana dealers) and state-association pages. Listing inventory here is a lead channel, not just a citation. **Highest priority in this tier.** |
| 16 | **Champion Homes dealer locator** | Kyle is an authorized dealer; being on the manufacturer's own locator is a strong, highly relevant citation. Request via the Champion rep. |
| 17 | **IMHA-RVIC** — Indiana Manufactured Housing Association / Recreation Vehicle Indiana Council | Active trade association, ~400 members, Exec. Dir. Ron Breymier, 3210 Rand Rd, Indianapolis IN 46241, **(317) 247-6258**. Member listing + the MH FacTOURy Summit. **See the warning below about `indianamha.org`.** |
| 18 | **Manufactured Housing Institute (MHI)** | National association; retailer membership |
| 19 | **MHBay / Mobile Home Party / MHDealers** | Secondary marketplaces; low effort |
| 20 | **Angi / Houzz / Porch** | Home-improvement directories. Only list services we actually perform — **we sell and deliver homes; we do not do site work, foundations or setup.** Choosing the wrong category here creates a claim we have spent weeks removing from the site. |

## Tier 4 — local Auburn / DeKalb County (small lists, outsized local weight)

| # | Registry | Notes |
|---|---|---|
| 21 | **DeKalb Chamber Partnership** | 208 S Jackson St, Auburn IN 46706. The local chamber — partners with the Downtown Auburn Business Association and the Auburn Cord Duesenberg Festival. Member directory at `members.dekalb.org`. **Best single local citation available.** Call or visit; no online join form found. |
| 22 | **City of Auburn / DeKalb County business listings** | Check the city and county economic-development sites |
| 23 | **Visit DeKalb County / NE Indiana tourism & business guides** | |
| 24 | **Fort Wayne–area chambers** (Greater Fort Wayne Inc.) | We serve Allen County heavily; worth the membership question |
| 25 | **Indiana Economic Development / state business directory** | |
| 26 | **Local news business directories** (KPC Media — *The Star*, Auburn) | |

## Also worth doing, not a directory

- **Indiana Secretary of State — Auto Dealer Services Division** handles
  manufactured-home dealer *licensing* (317-234-7190, Dealers@sos.in.gov).
  This is a legal requirement, not an SEO citation — listed here only so the two
  don't get confused.

---

## Warning: `indianamha.org` may be dead

The site cites `https://www.indianamha.org/` on 22 pages
(`src/lib/citations.ts`), and it is one of the two candidates for the broken
external link Semrush reported on exactly 22 pages (see AGENTS.md, "Semrush
2026-10-09"). Two searches for the association, including a quoted search for
the domain itself, returned **no page on that domain**, while the association is
plainly still active under the name **IMHA-RVIC**. That is suggestive, not
proof — DNS is unavailable in the agent sandbox, so the domain could not be
resolved either way, and a dead-looking search result is not a dead site.

**Do not swap the URL on a guess.** Confirm the association's current web
address — the phone number above is the quickest route — then fix it once in
`src/lib/citations.ts`.

---

## Tracking

Fill in as each goes live. Send the URLs over and they go into `BUSINESS.sameAs`.

| Registry | Status | Profile URL | Date |
|---|---|---|---|
| Google Business Profile | live | (in `BUSINESS.sameAs`) | — |
| Facebook | live | https://www.facebook.com/FactoryDirectHomesCenter | — |
| Instagram | live | https://www.instagram.com/factory_direct_homes_center/ | — |
| X | live | https://x.com/fd_homes_center | — |
| YouTube | live | https://youtube.com/@factorydirecthomescenter | — |
| Bing Places | claimed 2026-10-09 — confirm verified | | |
| Apple Business Connect | | | |
| MHVillage | | | |
| Champion dealer locator | | | |
| DeKalb Chamber Partnership | | | |
| IMHA-RVIC | | | |
| Yelp | present per Semrush | | |
| BBB | | | |
| Nextdoor | | | |

**Re-run the Semrush Local scan** after a batch. Its last run showed 29 of 37
listings needing work and ~25 "not present", which is the real scoreboard here —
I cannot reach semrush.com from the sandbox, so that run is Kyle's to trigger.
