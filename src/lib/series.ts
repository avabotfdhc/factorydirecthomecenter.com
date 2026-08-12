// Champion series detection, shared by the CMS mapping (api-content.ts) and
// the DealerTide feed adapter (dealertide-feed.ts). The feed has no series
// field and CMS rows only sometimes carry seriesDetails, so we derive the
// series from whatever text we have: title, model number, description.
//
// FDHC's lineup out of the Topeka plant: Aspire, Prime, Paramount, Redman,
// and Dutch-branded variants. "Dutch Aspire" titles are brand Dutch + series
// Aspire — keyword order below makes Aspire win over Dutch on those.

const SERIES_KEYWORDS: Array<[RegExp, string]> = [
  [/\bprime\b/i, "Prime"],
  [/\bparamount\b/i, "Paramount"],
  [/\bredman\b/i, "Redman"],
  [/\baspire\b/i, "Aspire"],
  [/\bdutch\b/i, "Dutch"],
];

// Prime model numbers embed a P in the section/plan code (e.g. 2856H42P01-043),
// unlike Aspire's plain numeric codes (e.g. 2856H32168).
const PRIME_MODEL_RE = /\b\d{3,4}h\d{2}p\d{2}/i;

/** Best-effort series name from any identifying text; "" when unknown. */
export function deriveSeries(...texts: Array<string | undefined | null>): string {
  const hay = texts.filter(Boolean).join(" ");
  if (!hay) return "";
  for (const [re, name] of SERIES_KEYWORDS) {
    if (re.test(hay)) return name;
  }
  if (PRIME_MODEL_RE.test(hay)) return "Prime";
  return "";
}

/** Canonicalize a CMS-provided series label so brand-variant labels collapse
 * into one filter pill — per Kyle, "Dutch Aspire" IS the Aspire series.
 * Labels we don't recognize pass through unchanged. */
export function canonicalSeries(label: string | undefined | null): string {
  const raw = String(label || "").trim();
  if (!raw) return "";
  return deriveSeries(raw) || raw;
}
