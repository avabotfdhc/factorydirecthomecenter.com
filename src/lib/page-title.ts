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

/** A Champion model code used as a name ("1676H32107", "2856H32174"). */
const MODEL_CODE = /^\d{4}[A-Z]\d{2}[A-Z]?\d{2,3}$/i;

/**
 * True when the plan has no family name and is known only by its model code.
 * 42 of the 172 active Aspire plans are (measured 2026-10-16), and Champion's
 * own sales sheets give them no name either — see AGENTS.md, "Code-named
 * singles stay code-named".
 */
export function isCodeNamed(name: string, modelNumber?: string): boolean {
  const n = name.trim();
  if (!n) return false;
  if (modelNumber && n.toUpperCase() === modelNumber.trim().toUpperCase()) return true;
  return MODEL_CODE.test(n);
}

export interface PlanTitleOptions {
  modelNumber?: string;
  widthFt?: number;
  lengthFt?: number;
}

/**
 * A floor-plan title: "Thornton — 3 Bed 2 Bath Champion Double Wide Home,
 * Auburn IN" when it fits, then without the place, then without the brand,
 * then without the home type.
 *
 * A plan whose name is only its model code leads with what a buyer would
 * search for instead, and ends with the code: "3 Bed 2 Bath 16×76 Champion
 * Single Wide Home, Model 1676H32107" — same drop order (place, brand, then
 * the box size, then the type), and the code is never dropped.
 */
export function planTitle(
  name: string,
  beds: number | string,
  baths: number | string,
  typeLabel: string,
  opts: PlanTitleOptions = {},
): string {
  const layout = `${beds} Bed ${baths} Bath`;
  if (isCodeNamed(name, opts.modelNumber)) {
    const code = `Model ${(opts.modelNumber || name).trim().toUpperCase()}`;
    const size = opts.widthFt && opts.lengthFt ? `${opts.widthFt}\u00d7${opts.lengthFt} ` : "";
    return fitTitle([
      `${layout} ${size}Champion ${typeLabel}, ${code}, Auburn IN`,
      `${layout} ${size}Champion ${typeLabel}, ${code}`,
      `${layout} ${size}${typeLabel}, ${code}`,
      `${layout} ${typeLabel}, ${code}`,
      `${layout}, ${code}`,
    ]);
  }
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

// Google shows roughly 150–160 characters of a meta description. 62 of 75 post
// excerpts ran 161–236 (measured 2026-10-08), so the snippet ended mid-sentence.
// The excerpt still feeds the blog cards and the Article schema in full; only
// the meta / og / twitter description is fitted.
export const DESCRIPTION_MAX = 160;

/**
 * The whole excerpt when it fits. Otherwise whole sentences, if they fill most
 * of the snippet; if not (a short opening line followed by the specific one),
 * as many words as fit, closed with an ellipsis, so the specific part is kept.
 */
export function fitDescription(text: string, max = DESCRIPTION_MAX): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  let whole = "";
  for (const sentence of clean.split(/(?<=[.!?])\s+/)) {
    const next = whole ? `${whole} ${sentence}` : sentence;
    if (next.length > max) break;
    whole = next;
  }
  if (whole.length >= max * 0.75) return whole;
  const cut = clean.slice(0, max - 1);
  const space = cut.lastIndexOf(" ");
  return `${(space > max / 2 ? cut.slice(0, space) : cut).replace(/[\s,;:.\u2014\u2013-]+$/, "")}\u2026`;
}
