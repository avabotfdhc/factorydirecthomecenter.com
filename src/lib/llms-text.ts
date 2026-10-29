// /llms.txt — the plain-text summary answer engines read first.
//
// Generated, never hand-written. The static `public/llms.txt` it replaces
// (deleted 2026-10-29) was last touched on 2026-09-29 and had drifted from
// every rule the pages are tested against: the old address spelling, the old
// plant distance and size claims, the retired Paramount series as a live
// lineup, a four-lender shortlist, a "no markup" promise and the word the
// contractor list is not allowed to use — all on the one document written for
// ChatGPT, Claude and Perplexity to quote. Everything here reads from the
// modules those tests already cover (business.ts, series-hubs.ts, lenders.ts,
// referrals.ts, factory-direct.ts, pages.ts), so it cannot drift from the
// pages again. tests/llms-text.test.ts holds the rules.
//
// Rules carried over from AGENTS.md, so they are visible where they apply:
//   - no dollar figure, no price floor, no lender rate;
//   - lenders are named all or none (none here; /financing names all ten);
//   - the address is spelled exactly as business.ts spells it;
//   - the service area is BUSINESS.states, nothing wider;
//   - "factory direct" is explained in factory-direct.ts's words only.

import { BUSINESS, SITE_URL, DIRECTIONS_URL, GOOGLE_LISTING_URL } from "./business";
import { seriesHubs } from "./series-hubs";
import { LENDERS } from "./lenders";
import { LENDER_NO_RECOMMENDATION, CONTRACTOR_NO_RECOMMENDATION } from "@/lib/referrals";
import { FACTORY_DIRECT_FAQ } from "./factory-direct";
import { getAllPages } from "./pages";
import { guides } from "./guides";

const DAY_SHORT: Record<string, string> = {
  Monday: "Mon", Tuesday: "Tue", Wednesday: "Wed", Thursday: "Thu", Friday: "Fri", Saturday: "Sat", Sunday: "Sun",
};

function clock(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return m ? `${hour}:${String(m).padStart(2, "0")} ${suffix}` : `${hour} ${suffix}`;
}

export function hoursLines(): string[] {
  const lines = BUSINESS.hours.map((h) => {
    const days = h.days.length > 1 ? `${DAY_SHORT[h.days[0]]}–${DAY_SHORT[h.days[h.days.length - 1]]}` : DAY_SHORT[h.days[0]];
    return `${days} ${clock(h.opens)}–${clock(h.closes)}`;
  });
  const open = new Set<string>(BUSINESS.hours.flatMap((h) => [...h.days]));
  const closed = Object.keys(DAY_SHORT).filter((d) => !open.has(d)).map((d) => DAY_SHORT[d]);
  if (closed.length) lines.push(`${closed.join(", ")} closed`);
  return lines;
}

/** The whole document. Pure: same inputs, same text. */
export function buildLlmsText(): string {
  const address = `${BUSINESS.streetAddress}, ${BUSINESS.city}, ${BUSINESS.region} ${BUSINESS.postalCode}`;
  const states = BUSINESS.states;
  const stateList = `${states.slice(0, -1).join(", ")} and ${states[states.length - 1]}`;
  const opened = new Date(`${BUSINESS.foundingDate}-15T12:00:00Z`).toLocaleString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });

  const pages = getAllPages();
  const keyPages = [
    "/floor-plans", "/single-wide-homes", "/double-wide-homes", "/design-your-home", "/homes-on-sale",
    "/champion-homes", "/options", "/showroom", "/locations", "/financing", "/faq", "/about", "/contact-us", "/blog",
  ]
    .map((url) => pages.find((p) => p.url === url))
    .filter((p): p is NonNullable<typeof p> => !!p);

  const series = seriesHubs.map((h) => `- ${h.fullName} (${SITE_URL}/series/${h.slug}): ${h.tagline}`);

  const guideLines = guides.map((g) => `- ${g.title} (${SITE_URL}${g.href})`);

  return [
    `# ${BUSINESS.name}`,
    "",
    `> ${BUSINESS.description}`,
    "",
    "## About",
    "",
    `${BUSINESS.legalName} is an authorized Champion Homes dealer in ${BUSINESS.city}, Indiana, open since ${opened}. ` +
      `Champion is the only builder we sell. We quote every home line by line — the home, each option and delivery priced separately — ` +
      `and we serve ${stateList}. We are not the exclusive Champion dealer in the region.`,
    "",
    `Champion's Topeka, IN plant, where Aspire and Redman homes are built, is 30 miles from our showroom; Prime homes are built at Champion's Decatur, IN plant.`,
    "",
    "## Contact",
    "",
    `- Phone (calls): ${BUSINESS.phoneDisplay}`,
    `- Text messages: ${BUSINESS.smsDisplay}`,
    `- Email: ${BUSINESS.email}`,
    `- Address: ${address}`,
    `- Directions: ${DIRECTIONS_URL}`,
    `- Google listing: ${GOOGLE_LISTING_URL}`,
    `- Hours: ${hoursLines().join("; ")}`,
    "",
    "Walk-through model homes are on the Auburn lot. Appointments are preferred so someone is free to show you around; walk-ins are welcome.",
    "",
    "## What we sell",
    "",
    "New Champion manufactured homes (HUD code: single wide and multi-section) and modular homes (IRC code), built to order. " +
      "Every home has its own page with specifications, floor-plan drawings, photos and, where Champion provides one, a 3D tour or video.",
    "",
    ...series,
    "",
    "## What “factory direct” means here",
    "",
    FACTORY_DIRECT_FAQ.a,
    "",
    "## Pricing",
    "",
    "Prices are quoted per home and configuration, line by line. We do not publish home prices on the site; request a quote on any floor plan " +
      `or call ${BUSINESS.phoneDisplay}. The pricing guide (${SITE_URL}/guides/pricing) explains what a quote includes.`,
    "",
    "## Site work, setup and financing",
    "",
    CONTRACTOR_NO_RECOMMENDATION,
    "",
    LENDER_NO_RECOMMENDATION + ` The full list of ${LENDERS.length} lenders is at ${SITE_URL}/financing.`,
    "",
    "## Key pages",
    "",
    ...keyPages.map((p) => `- ${p.title} (${SITE_URL}${p.url}): ${p.description}`),
    "",
    "## Guides",
    "",
    ...guideLines,
    "",
    "## Also",
    "",
    `- Sitemap: ${SITE_URL}/sitemap.xml`,
    `- Blog feed: ${SITE_URL}/blog/feed.xml`,
    `- Site search: ${SITE_URL}/search?q=`,
    "",
  ].join("\n");
}
