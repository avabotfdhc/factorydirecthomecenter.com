// Which of our county pages border each other, so every county page links to
// its neighbours. Added 2026-10-31: the crawl found 20 location pages with only
// one or two internal links pointing at them (the /locations index and little
// else), and 11 county pages sitting in Search Console as "Discovered –
// currently not indexed". Links between real neighbours give Google a path to
// each page and give a shopper on a county line the page next door.
//
// Adjacency is Indiana's county map, limited to counties we have a page for
// (a border with a county we do not serve is simply not listed). Keep it
// symmetric — tests/county-neighbors.test.ts fails if A lists B but B does not
// list A, or if a slug has no page.

export const COUNTY_NEIGHBORS: Record<string, readonly string[]> = {
  "adams-county": ["allen-county", "wells-county", "jay-county"],
  "allen-county": ["dekalb-county", "noble-county", "whitley-county", "huntington-county", "wells-county", "adams-county"],
  "blackford-county": ["wells-county", "jay-county", "delaware-county", "grant-county"],
  "cass-county": ["fulton-county", "miami-county", "howard-county"],
  "dekalb-county": ["steuben-county", "noble-county", "allen-county"],
  "delaware-county": ["grant-county", "blackford-county", "jay-county", "randolph-county"],
  "elkhart-county": ["st-joseph-county", "lagrange-county", "noble-county", "kosciusko-county", "marshall-county"],
  "fulton-county": ["marshall-county", "kosciusko-county", "wabash-county", "miami-county", "cass-county"],
  "grant-county": ["wabash-county", "huntington-county", "wells-county", "blackford-county", "delaware-county", "howard-county", "miami-county"],
  "howard-county": ["miami-county", "grant-county", "cass-county"],
  "huntington-county": ["whitley-county", "allen-county", "wells-county", "grant-county", "wabash-county"],
  "jay-county": ["adams-county", "wells-county", "blackford-county", "delaware-county", "randolph-county"],
  "kosciusko-county": ["elkhart-county", "noble-county", "whitley-county", "wabash-county", "fulton-county", "marshall-county"],
  "lagrange-county": ["elkhart-county", "noble-county", "steuben-county"],
  "marshall-county": ["st-joseph-county", "elkhart-county", "kosciusko-county", "fulton-county"],
  "miami-county": ["fulton-county", "wabash-county", "grant-county", "howard-county", "cass-county"],
  "noble-county": ["lagrange-county", "steuben-county", "dekalb-county", "allen-county", "whitley-county", "kosciusko-county", "elkhart-county"],
  "randolph-county": ["jay-county", "delaware-county"],
  "st-joseph-county": ["elkhart-county", "marshall-county"],
  "steuben-county": ["lagrange-county", "noble-county", "dekalb-county"],
  "wabash-county": ["kosciusko-county", "whitley-county", "huntington-county", "grant-county", "miami-county", "fulton-county"],
  "wells-county": ["allen-county", "adams-county", "jay-county", "blackford-county", "grant-county", "huntington-county"],
  "whitley-county": ["noble-county", "allen-county", "huntington-county", "wabash-county", "kosciusko-county"],
};

/** "st-joseph-county" → "St. Joseph County"; "dekalb-county" → "DeKalb County". */
export function countyLabel(slug: string): string {
  const special: Record<string, string> = {
    "dekalb-county": "DeKalb County",
    "lagrange-county": "LaGrange County",
    "st-joseph-county": "St. Joseph County",
  };
  if (special[slug]) return special[slug];
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function neighborCounties(slug: string): { href: string; label: string }[] {
  return (COUNTY_NEIGHBORS[slug] ?? []).map((s) => ({ href: `/locations/${s}`, label: countyLabel(s) }));
}
