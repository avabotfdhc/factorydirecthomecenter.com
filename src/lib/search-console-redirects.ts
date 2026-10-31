// 301s for URLs Google Search Console reported as "Not found (404)" on
// 2026-10-12 (Page indexing report, 66 URLs, plus the dead URLs listed under
// "Crawled - currently not indexed"). Every source below answered 404 on the
// live site that day, or 301'd through an older pattern rule into a 404.
//
// next.config.ts spreads this list FIRST: Next.js uses the first matching
// redirect, and several sources here would otherwise be caught by the older
// `/brands/.../Sectionals/:slug` and `/special-plans/details/:slug` patterns,
// which send them to a URL that does not exist.
//
// tests/search-console-redirects.test.ts holds the shape: unique sources, no
// chains, no destination that is itself retired or redirected.

type Redirect = { source: string; destination: string; permanent: boolean };
const to = (source: string, destination: string): Redirect => ({ source, destination, permanent: true });

// Retired repo-published "dutch-aspire-*" plan pages. The CMS publishes the
// same Champion model number under an "aspire-*" slug; each pair below was
// matched on the model code and the destination read from the live sitemap —
// never built by swapping the prefix, because the CMS drops the family name on
// some models (see "Slugs are not a prefix swap" in AGENTS.md).
export const DEAD_DUTCH_ASPIRE: ReadonlyArray<readonly [string, string]> = [
  ["dutch-aspire-1432h11214", "aspire-1432h11214"],
  ["dutch-aspire-1440h11065", "aspire-1440h11065"],
  ["dutch-aspire-1452h21023", "aspire-1452h21023"],
  ["dutch-aspire-1452h21081", "aspire-1452h21081"],
  ["dutch-aspire-1456h21023", "aspire-1456h21023"],
  ["dutch-aspire-1456h21030", "aspire-1456h21030"],
  ["dutch-aspire-1460h21216", "aspire-1460h21216"],
  ["dutch-aspire-1460h22215", "aspire-1460h22215"],
  ["dutch-aspire-1466h32082", "aspire-1466h32082"],
  ["dutch-aspire-1470h32082", "aspire-1470h32082"],
  ["dutch-aspire-1472h32082", "aspire-1472h32082"],
  ["dutch-aspire-1476h32082", "aspire-1476h32082"],
  ["dutch-aspire-1652h21083", "aspire-1652h21083"],
  ["dutch-aspire-1652h21151", "aspire-1652h21151"],
  ["dutch-aspire-1656h22208", "aspire-1656h22208"],
  ["dutch-aspire-1664h32212", "aspire-1664h32212"],
  ["dutch-aspire-1666h32085", "aspire-1666h32085"],
  ["dutch-aspire-1666h32212", "aspire-1666h32212"],
  ["dutch-aspire-1666h32217", "aspire-1666h32217"],
  ["dutch-aspire-1668h32085", "aspire-1668h32085"],
  ["dutch-aspire-1668h32087", "aspire-1668h32087"],
  ["dutch-aspire-1668h32220", "aspire-1668h32220"],
  ["dutch-aspire-1676h32089", "aspire-1676h32089"],
  ["dutch-aspire-1676h32090", "aspire-1676h32090"],
  ["dutch-aspire-1676h32091", "aspire-1676h32091"],
  ["dutch-aspire-1676h32212", "aspire-1676h32212"],
  ["dutch-aspire-1676h32221", "aspire-1676h32221"],
  ["dutch-aspire-1676h32222", "aspire-1676h32222"],
  ["dutch-aspire-1676h32259", "aspire-1676h32259"],
  ["dutch-aspire-bay-port-2860h32168", "aspire-bay-port-2860h32168"],
  ["dutch-aspire-bayport-2856h32168", "aspire-bay-port-2856h32168"],
  ["dutch-aspire-easton-2856h32301", "aspire-easton-2856h32301"],
  ["dutch-aspire-henderson-3264h32396", "aspire-henderson-3264h32396"],
  ["dutch-aspire-henderson-3268h32396", "aspire-henderson-3268h32396"],
  ["dutch-aspire-henderson-3276h42396", "aspire-henderson-3276h42396"],
  ["dutch-aspire-lincoln-2848h32171", "aspire-lincoln-2848h32171"],
  ["dutch-aspire-lincoln-2852h32171", "aspire-lincoln-2852h32171"],
  ["dutch-aspire-lincoln-2856h32171", "aspire-lincoln-2856h32171"],
  ["dutch-aspire-monroe-2840h32024", "aspire-monroe-2840h32024"],
  ["dutch-aspire-odyssey-2860h32394", "aspire-odyssey-2860h32394"],
  ["dutch-aspire-pierre-2852h32393", "aspire-pierre-2852h32393"],
  ["dutch-aspire-shelby-3260h32181", "aspire-shelby-3260h32181"],
  ["dutch-aspire-shelby-3264h32181", "aspire-shelby-3264h32181"],
  ["dutch-aspire-shelby-3268h32181", "aspire-shelby-3268h32181"],
  ["dutch-aspire-silverton-2860h32174", "aspire-silverton-2860h32174"],
  ["dutch-aspire-summit-2864h42a1c", "aspire-summit-2864h42a1c"],
  ["dutch-aspire-summit-2868h52a1c", "aspire-summit-2868h52a1c"],
  ["dutch-aspire-thornton-3252h32377", "aspire-thornton-3252h32377"],
  ["dutch-aspire-thornton-3256h32377", "aspire-thornton-3256h32377"],
  ["dutch-aspire-timberlake-3260h32207", "aspire-timberlake-3260h32207"],
  ["dutch-aspire-ventura-2856h32034", "aspire-ventura-2856h32034"],
  ["dutch-aspire-verona-3276h42179", "aspire-verona-3276h42179"],
  ["dutch-aspire-warren-2860h32172", "aspire-warren-2860h32172"],
  ["dutch-aspire-winston-3272h32186", "aspire-winston-3272h32186"],
  ["dutch-aspire-woodward-2864h32047", "aspire-woodward-2864h32047"],
  ["dutch-aspire1666h32217", "aspire-1666h32217"],
  ["dutch-aspire1666h32219", "aspire-1666h32219"],
  ["dutch-aspire1668h32087", "aspire-1668h32087"],
  ["dutch-aspire1668h32220", "aspire-1668h32220"],
  ["dutch-aspire1676h32089", "aspire-1676h32089"],
  ["dutch-aspire1676h32090", "aspire-1676h32090"],
  ["dutch-aspire1676h32091", "aspire-1676h32091"],
  ["dutch-aspire1676h32212", "aspire-1676h32212"],
  ["dutch-aspire1676h32221", "aspire-1676h32221"],
  ["dutch-aspire1676h32222", "aspire-1676h32222"],
  ["dutch-aspire1676h32259", "aspire-1676h32259"],
];

// The other 44 dutch-aspire-* pages still rendered (from the repo data files)
// but were duplicates of the CMS page for the same model: absent from the
// sitemap and every listing, yet still crawled through old links, so Google
// saw two pages per home. Kyle had them consolidated on 2026-10-13. Same
// matching rule as above.
export const LIVE_DUTCH_ASPIRE: ReadonlyArray<readonly [string, string]> = [
  ["dutch-aspire-1444h11023", "aspire-1444h11023"],
  ["dutch-aspire-1648h21016", "aspire-1648h21016"],
  ["dutch-aspire-1660h22212", "aspire-1660h22212"],
  ["dutch-aspire-1660h32206", "aspire-1660h32206"],
  ["dutch-aspire-1666h22091", "aspire-1666h22091"],
  ["dutch-aspire-1666h22232", "aspire-1666h22232"],
  ["dutch-aspire-1668h22259", "aspire-1668h22259"],
  ["dutch-aspire-1672h32087", "aspire-1672h32087"],
  ["dutch-aspire-1672h32090", "aspire-1672h32090"],
  ["dutch-aspire-1676h32085", "aspire-1676h32085"],
  ["dutch-aspire-1676h32087", "aspire-1676h32087"],
  ["dutch-aspire-bayfield-2844h32169", "aspire-bayfield-2844h32169"],
  ["dutch-aspire-bayfield-2848h32169", "aspire-bayfield-2848h32169"],
  ["dutch-aspire-berkley-2856h32449", "aspire-berkley-2856h32449"],
  ["dutch-aspire-brighton-2848h32170", "aspire-brighton-2848h32170"],
  ["dutch-aspire-brooklyn-2456h32168", "aspire-brooklyn-2456h32168"],
  ["dutch-aspire-broomfield-2452h32160", "aspire-broomfield-2452h32160"],
  ["dutch-aspire-broomfield-2456h32160", "aspire-broomfield-2456h32160"],
  ["dutch-aspire-casper-2432h21166", "aspire-casper-2432h21166"],
  ["dutch-aspire-casper-2436h21166", "aspire-casper-2436h21166"],
  ["dutch-aspire-easton-2860h32301", "aspire-easton-2860h32301"],
  ["dutch-aspire-fairplay-2448h32384", "aspire-fairplay-2448h32384"],
  ["dutch-aspire-glenrock-2460h42096", "aspire-glenrock-2460h42096"],
  ["dutch-aspire-jackson-2852h32173", "aspire-jackson-2852h32173"],
  ["dutch-aspire-jackson-2856h32173", "aspire-jackson-2856h32173"],
  ["dutch-aspire-lancaster-2848h32160", "aspire-lancaster-2848h32160"],
  ["dutch-aspire-lancaster-2852h32160", "aspire-lancaster-2852h32160"],
  ["dutch-aspire-monroe-2844h32024", "aspire-monroe-2844h32024"],
  ["dutch-aspire-monroe-2848h32024", "aspire-monroe-2848h32024"],
  ["dutch-aspire-odyssey-2868h32394", "aspire-odyssey-2868h32394"],
  ["dutch-aspire-odyssey-3260h32394", "aspire-odyssey-3260h32394"],
  ["dutch-aspire-pontiac-2856h32103", "aspire-pontiac-2856h32103"],
  ["dutch-aspire-sheridan-2440h32382", "aspire-sheridan-2440h32382"],
  ["dutch-aspire-sheridan-2444h32382", "aspire-sheridan-2444h32382"],
  ["dutch-aspire-sheridan-2448h32382", "aspire-sheridan-2448h32382"],
  ["dutch-aspire-summit-2852h32a1c", "aspire-summit-2852h32a1c"],
  ["dutch-aspire-summit-2856h32a1c", "aspire-summit-2856h32a1c"],
  ["dutch-aspire-sundance-2444h32167", "aspire-sundance-2444h32167"],
  ["dutch-aspire-sundance-2448h32167", "aspire-sundance-2448h32167"],
  ["dutch-aspire-sundance-2452h32167", "aspire-sundance-2452h32167"],
  ["dutch-aspire-warren-2852h32172", "aspire-warren-2852h32172"],
  ["dutch-aspire-westbrook-1676h32107", "aspire-1676h32107"],
  ["dutch-aspire-woodward-2860h32047", "aspire-woodward-2860h32047"],
  ["dutch-aspire-woodward-2868h32047", "aspire-woodward-2868h32047"],
];

const dutchAspire: Redirect[] = [...DEAD_DUTCH_ASPIRE, ...LIVE_DUTCH_ASPIRE].map(([from, dest]) =>
  to(`/floor-plans/${from}`, `/floor-plans/${dest}`),
);

// Pre-CMS pages named after the family alone. A family sold in several lengths
// lands on its shortest current plan; the page cross-links the others.
const FAMILY_PAGES: ReadonlyArray<readonly [string, string]> = [
  ["appleton", "aspire-appleton-2842h32388"],
  ["baldwin", "aspire-baldwin-2876h42180"],
  ["bay-port", "aspire-bay-port-2856h32168"],
  ["belvidere", "aspire-belvidere-2856h32392"],
  ["fillmore", "aspire-fillmore-2864h32060"],
  ["georgetown", "aspire-georgetown-2864h32101"],
  ["pontiac", "aspire-pontiac-2852h32103"],
  ["the-brighton", "aspire-brighton-2852h32170"],
  ["warren", "aspire-warren-2852h32172"],
];

const BRAND_PREFIXES = [
  "/brands/champion/series/aspire/floor-plans/Sectionals",
  "/brands/champion-home-builders/series/aspire/floor-plans/Sectionals",
];

const familyPages: Redirect[] = FAMILY_PAGES.flatMap(([family, dest]) => [
  to(`/floor-plans/${family}`, `/floor-plans/${dest}`),
  // One hop: without these the brand pattern rule 301s to /floor-plans/<family>
  // first, and Google records a redirect chain.
  ...BRAND_PREFIXES.map((prefix) => to(`${prefix}/${family}`, `/floor-plans/${dest}`)),
]);

const oneOffs: Redirect[] = [
  // Old descriptive slugs; matched on the family and the 28x52 box they name.
  to("/floor-plans/the-bayfield-3-bed-2-bath-manufactured-home-1387-sq-ft-champion-aspire", "/floor-plans/aspire-bayfield-2852h32169"),
  to("/floor-plans/ventura-3-bed-2-bath-manufactured-home-1387-sq-ft-28x52-champion-aspire", "/floor-plans/aspire-ventura-2852h32034"),
  to("/floor-plans/brighton-3-bed-2-bath-manufactured-home-1386-sq-ft-champion-aspire", "/floor-plans/aspire-brighton-2852h32170"),

  // The same homes under three older URL shapes Google still requests.
  to("/floor-plans/details/dutch-aspire-1652h21083", "/floor-plans/aspire-1652h21083"),
  to("/floor-plans/details/dutch-aspire-1656h22208", "/floor-plans/aspire-1656h22208"),
  to("/homes-on-sale/details/dutch-aspire-1656h22208", "/floor-plans/aspire-1656h22208"),
  to("/special-plans/dutch-aspire-1652h21151", "/floor-plans/aspire-1652h21151"),

  // Old sale-detail URLs for homes that are no longer sale entries.
  to("/homes-on-sale/details/brighton-2852", "/floor-plans/aspire-brighton-2852h32170"),
  to("/homes-on-sale/details/fillmore-2864", "/floor-plans/aspire-fillmore-2864h32060"),
  to("/special-plans/details/silverton", "/floor-plans/aspire-silverton-2856h32174"),

  // Still answering 404 on 2026-10-31 (Search Console "Not found" report).
  to("/homes-on-sale/details/bay-port-2860", "/floor-plans/aspire-bay-port-2860h32168"),
  to("/homes-on-sale/details/silverton-2856", "/floor-plans/aspire-silverton-2856h32174"),
  to("/homes-on-sale/details/dutch-aspire-1652h21151", "/floor-plans/aspire-1652h21151"),
  to("/floor-plans/livingston", "/floor-plans/aspire-livingston-2852h42096"),
  to("/floor-plans/3268h32052-dutch-aspire-madison", "/floor-plans/aspire-madison-3268h32052"),
  to("/blog/the-step-by-step-guide-to-buying-your-manufactured-home-from-selection-to-move-in-day", "/guides/buyers-guide"),
  to("/homes-on-sale/details", "/homes-on-sale"),
  to("/special-plans/used", "/homes-on-sale"),

  // Old catalogue filters that were once paths.
  to("/floor-plans/single-wides", "/single-wide-homes"),
  to("/floor-plans/singlewides", "/single-wide-homes"),
  to("/floor-plans/singlewide", "/single-wide-homes"),
  to("/floor-plans/sectionals", "/double-wide-homes"),
  to("/floor-plans/sectional", "/double-wide-homes"),
  to("/floor-plans/modular", "/floor-plans"),
  to("/floor-plans/modulars", "/floor-plans"),

  // Old top-level pages.
  to("/privacy-policy", "/privacy"),
  to("/term-condition", "/terms"),
  to("/loans-lenders", "/financing"),
  to("/brands", "/champion-homes"),
  to("/series", "/floor-plans"),
  to("/gallery", "/floor-plans"),
  // There is no reviews page (src/lib/reviews.ts is empty on purpose).
  to("/review", "/about"),

  // Posts from the old blog that were not carried over.
  to("/blog/understanding-manufactured-home-financing-your-complete-guide-to-chattel-loans-fha-va-and-conventional-options", "/guides/financing"),
  to("/blog/customize-your-dream-home-popular-upgrades-and-personalization-options-for-manufactured-homes", "/options"),
  to("/blog/dreaming-of-your-perfect-home-across-the-heartland-explore-champion-single-wide-and-doublewide-homes-at-factory-direct-homes-center", "/floor-plans"),
  to("/blog/the-rise-of-manufactured-housing-why-its-becoming-the-go-to-choice-for-affordable-living", "/blog"),
  to("/blog/debunking-common-myths-about-manufactured-housing", "/blog"),
];

export const searchConsoleRedirects: Redirect[] = [...dutchAspire, ...familyPages, ...oneOffs];
