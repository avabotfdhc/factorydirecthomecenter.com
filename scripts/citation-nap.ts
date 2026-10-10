/**
 * Prints the canonical NAP block to paste into a directory listing.
 *
 *   npm run citation-nap
 *
 * Every field comes from `src/lib/business.ts`, which is the one source of the
 * dealership's identity. Citation building fails on inconsistency, not on
 * volume: a directory that says "1211 IN SR-8" while another says "1211 State
 * Road 8" and a third carries the texting line as the main number gives Google
 * three slightly different businesses to reconcile, which is worse than having
 * two fewer listings. So nothing here is retyped — regenerate instead.
 *
 * The descriptions are pre-trimmed to the length caps directories actually
 * enforce (80 / 160 / 250 / 750) and are written to respect the claim rules in
 * AGENTS.md: we are the dealer (never "buy from the factory", never "no dealer
 * markup"), we do not do financing or rank lenders, and we do not perform site
 * work, setup, foundations or zoning verification.
 */
import { BUSINESS, SITE_URL, GOOGLE_LISTING_URL, dialable } from "../src/lib/business";

const DAY_ABBR: Record<string, string> = {
  Monday: "Mon", Tuesday: "Tue", Wednesday: "Wed", Thursday: "Thu",
  Friday: "Fri", Saturday: "Sat", Sunday: "Sun",
};

/** "Mon–Fri 9:00 AM – 5:00 PM", the shape a listing form expects. */
function hoursLines(): string[] {
  const twelve = (hhmm: string) => {
    const [h, m] = hhmm.split(":").map(Number);
    const period = h < 12 ? "AM" : "PM";
    const hour = h % 12 === 0 ? 12 : h % 12;
    return `${hour}:${String(m).padStart(2, "0")} ${period}`;
  };
  return BUSINESS.hours.map((h) => {
    const first = DAY_ABBR[h.days[0]] ?? h.days[0];
    const last = DAY_ABBR[h.days[h.days.length - 1]] ?? h.days[h.days.length - 1];
    const span = h.days.length > 1 ? `${first}–${last}` : first;
    return `${span}  ${twelve(h.opens)} – ${twelve(h.closes)}`;
  }).concat("Sun  Closed");
}

/** "November 2024" from "2024-11", for a form that asks when we opened. */
function openedLong(): string {
  const [y, m] = BUSINESS.foundingDate.split("-").map(Number);
  const month = new Date(Date.UTC(y, m - 1, 1)).toLocaleString("en-US", { month: "long", timeZone: "UTC" });
  return `${month} ${y}`;
}

const DESCRIPTIONS: Array<{ cap: number; text: string }> = [
  {
    cap: 80,
    text: "Champion manufactured and modular home dealer in Auburn, Indiana.",
  },
  {
    cap: 160,
    text: BUSINESS.description,
  },
  {
    cap: 250,
    text:
      "Factory Direct Homes Center is an authorized Champion Homes dealer in Auburn, Indiana. " +
      "We order each home from Champion's Topeka, IN plant, quote it line by line, and arrange delivery " +
      "across northeast Indiana, northwest Ohio and southern Michigan.",
  },
  {
    cap: 750,
    text:
      "An authorized Champion Homes dealer with a showroom at " +
      `${BUSINESS.streetAddress} in ${BUSINESS.city}, ${BUSINESS.region}. We sell new HUD-code manufactured ` +
      "homes and IRC modular homes in single- and multi-section layouts from the Aspire, Dutch, Prime and " +
      "Redman series. Every quote is itemised: the home, the options and the freight as separate lines " +
      "rather than one number. We order the home from Champion's Topeka, Indiana plant and arrange " +
      "delivery. Buyers hire and pay their own licensed contractors for site work, foundation and setup, " +
      "and choose their own lender; we hand over a list of lenders our customers have used and recommend " +
      "none in particular. " +
      `Owner-operated by ${BUSINESS.owner.name}; open since ${openedLong()}. ` +
      `Call ${BUSINESS.phoneDisplay} or text ${BUSINESS.smsDisplay}.`,
  },
];

const rows: Array<[string, string]> = [
  ["Business name", BUSINESS.name],
  ["Legal name", BUSINESS.legalName],
  ["Street", BUSINESS.streetAddress],
  ["City / State / ZIP", `${BUSINESS.city}, ${BUSINESS.region} ${BUSINESS.postalCode}`],
  ["Country", "United States"],
  ["Phone (voice — THIS is the main number)", `${BUSINESS.phoneDisplay}   ${dialable(BUSINESS.telephone)}`],
  ["Phone (text/SMS — only where a form has a separate SMS field)", `${BUSINESS.smsDisplay}   ${dialable(BUSINESS.smsNumber)}`],
  ["Email", BUSINESS.email],
  ["Website", SITE_URL],
  ["Latitude, Longitude", `${BUSINESS.latitude}, ${BUSINESS.longitude}`],
  ["Opened", openedLong()],
  ["Owner", `${BUSINESS.owner.name}, ${BUSINESS.owner.jobTitle}`],
  ["Service area", BUSINESS.states.join(", ")],
  ["Primary category", "Mobile home dealer"],
  ["Secondary categories", "Manufactured home dealer; Modular home dealer; Home builder"],
];

const width = Math.max(...rows.map(([k]) => k.length));
console.log("\n=== CANONICAL NAP — paste exactly, change nothing ===\n");
for (const [k, v] of rows) console.log(`${k.padEnd(width)}  ${v}`);
console.log(`\n${"Hours".padEnd(width)}  ${hoursLines().join(`\n${" ".repeat(width + 2)}`)}`);

console.log("\n\n=== DESCRIPTIONS (pick the longest that fits the field) ===");
for (const { cap, text } of DESCRIPTIONS) {
  const flag = text.length > cap ? `  *** OVER by ${text.length - cap} ***` : "";
  console.log(`\n--- ${cap}-char field (actual ${text.length})${flag}\n${text}`);
}

console.log("\n\n=== PROFILES ALREADY PUBLISHED (link these as the business's other profiles) ===\n");
console.log(`Google listing  ${GOOGLE_LISTING_URL}`);
for (const url of BUSINESS.sameAs.filter((u) => u !== GOOGLE_LISTING_URL)) console.log(`                ${url}`);
console.log(
  "\nAfter a new profile goes live, send its URL to be added to BUSINESS.sameAs in" +
  "\nsrc/lib/business.ts. Take the URL from the live profile itself, never from a" +
  "\nguess at the handle — a sameAs pointing at somebody else asks Google to merge" +
  "\na stranger into our entity.\n",
);

const over = DESCRIPTIONS.filter((d) => d.text.length > d.cap);
if (over.length) {
  console.error(`\n${over.length} description(s) exceed their cap — trim them in scripts/citation-nap.ts`);
  process.exit(1);
}
