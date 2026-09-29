// Search-result titles that fit.
//
// Google shows roughly 60–65 characters of a <title> and rewrites or truncates
// anything longer; DealerTide's review (2026-09-28) flags titles outside 15–65.
// Every floor-plan title ran to ~90 once the layout's "| Factory Direct Homes"
// suffix was added, so ~200 pages had the tail of their headline cut off.
//
// `fitTitle` takes candidates from most to least descriptive and returns the
// first that fits, as an absolute title (no layout suffix appended).

export const TITLE_MAX = 65;
export const TITLE_MIN = 15;

/** Characters as a search engine counts them: entities decoded. */
export function titleLength(title: string): number {
  return title.replace(/&amp;/g, "&").length;
}

/**
 * The first candidate no longer than `max`. If none fits, the last (shortest)
 * candidate is cut at a word boundary — a fallback that the tests show no
 * catalogue name reaches.
 */
export function fitTitle(candidates: string[], max = TITLE_MAX): string {
  for (const c of candidates) if (titleLength(c) <= max) return c;
  const last = candidates[candidates.length - 1] ?? "";
  const cut = last.slice(0, max);
  const space = cut.lastIndexOf(" ");
  return (space > max / 2 ? cut.slice(0, space) : cut).trim();
}

/**
 * A floor-plan title: "Thornton — 3 Bed 2 Bath Champion Double Wide Home,
 * Auburn IN" when it fits, then without the place, then without the brand,
 * then without the home type.
 */
export function planTitle(name: string, beds: number | string, baths: number | string, typeLabel: string): string {
  const layout = `${beds} Bed ${baths} Bath`;
  return fitTitle([
    `${name} — ${layout} Champion ${typeLabel}, Auburn IN`,
    `${name} — ${layout} Champion ${typeLabel}`,
    `${name} — ${layout} ${typeLabel}`,
    `${name} — ${layout}`,
  ]);
}

export const BRAND_SUFFIX = " | Factory Direct Homes";

/**
 * A post's search title. Headlines are "Subject: promise" and run 70–160
 * characters; the H1 keeps the whole thing, the <title> keeps as much as fits:
 * headline + brand, headline, subject + brand, subject.
 */
export function postTitle(headline: string): string {
  const colon = headline.indexOf(": ");
  const subject = colon > 0 ? headline.slice(0, colon) : headline;
  return fitTitle([
    headline + BRAND_SUFFIX,
    headline,
    subject + BRAND_SUFFIX,
    subject,
  ]);
}
