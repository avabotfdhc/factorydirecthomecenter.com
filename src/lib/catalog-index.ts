// Which series each priced model belongs to, and where its page lives.
//
// The master price sheet groups its 147 models into just two families, "Dutch
// Aspire" and "Prime", and this index maps each model to the one page that
// sells it.
//
// It used to split "Dutch Aspire" across two series: 61 of those models as
// Paramount and 42 as Aspire — a split neither the price sheet nor the repo's
// own catalogue files could settle, because the Aspire and Paramount data files
// both claimed 41 of the same model numbers. That is exactly why Paramount was
// retired (src/lib/retired-series.ts): the two labels described one set of
// homes. All 61 now name the Aspire page for the same Champion model number,
// which is the page that is still for sale. None of the 61 is one of the 22
// homes that only ever came as Paramount, so no home left the sale.
//
// The other 42 named a "dutch-aspire-*" slug, and those pages are published by
// the repo data files, not the CMS. mergePlans() drops a repo plan whose CMS
// twin carries the same series and model code, so none of the 42 was ever in
// /floor-plans, the sitemap, the featured set or Ava's catalogue — measured
// 2026-09-28: 0 of 42 in sitemap.xml against 172 for the CMS Aspire pages. The
// detail route resolves them anyway (getApiFloorPlanBySlug falls back to the
// repo list), so they rendered, and /homes-on-sale sent every buyer to the one
// page Google cannot see — a duplicate of the CMS page for the same home.
//
// All 42 now name the CMS page. That was only safe once the photography moved:
// 14 of the CMS records held just the banner and the option drawing while the
// repo twin showed Champion's photo set (the Woodward pair 13 vs 2, the 1672
// 15 vs 3). supabase/migrations/20260928_catalogue_photo_parity.sql carries the
// 34 professional shots across, so the three big gaps close completely.
//
// It deliberately does NOT reproduce the repo galleries exactly. Those also
// carried 14 rows of legacy S3 banner art, and a canonical page is the wrong
// home for it: ~600x400 against the photos' 1800x1200, shot of a DIFFERENT
// model number (the 2856/2860 Warren banners sat on the 2852 Warren's page),
// no room in the filename so describeImageFile() yields the generic alt, and
// one that is a sales sheet rather than a photograph. sitemap.ts feeds
// plan.gallery into <image:loc>, so each would have gone to Google Images.
// Eleven homes therefore show one or two fewer images than their repo twin did;
// what they lost was a blurry thumbnail of another length of the same home.
// Kyle made that call on 2026-09-28. Every surviving addition is 1800px and
// carries room-specific alt text.
//
// Slugs are NOT a prefix swap — the CMS drops the family name on some models
// ("dutch-aspire-westbrook-1676h32107" → "aspire-1676h32107"). Take each slug
// from the CMS row for that model number, never by rewriting the old one.
//
// Regenerate by reading /floor-plans and recording each card's slug and its
// "<Series> Series" badge.

export interface CatalogEntry {
  /** Path segment under /floor-plans. */
  slug: string;
  /** Series as the published catalogue labels it. */
  series: "Aspire" | "Prime";
}

export const CATALOG_INDEX: Record<string, CatalogEntry> = {
  "1432H11214": { slug: "aspire-1432h11214", series: "Aspire" },
  "1440H11065": { slug: "aspire-1440h11065", series: "Aspire" },
  "1444H11023": { slug: "aspire-1444h11023", series: "Aspire" },
  "1452H21023": { slug: "aspire-1452h21023", series: "Aspire" },
  "1452H21081": { slug: "aspire-1452h21081", series: "Aspire" },
  "1456H21023": { slug: "aspire-1456h21023", series: "Aspire" },
  "1456H21030": { slug: "aspire-1456h21030", series: "Aspire" },
  "1456H22P01": { slug: "prime-peak", series: "Prime" },
  "1456H22P02": { slug: "prime-peak-reverse-aisle", series: "Prime" },
  "1460H21216": { slug: "aspire-1460h21216", series: "Aspire" },
  "1460H22215": { slug: "aspire-1460h22215", series: "Aspire" },
  "1460H22P01": { slug: "prime-crest", series: "Prime" },
  "1460H22P02": { slug: "prime-crest-reverse-aisle", series: "Prime" },
  "1466H32082": { slug: "aspire-1466h32082", series: "Aspire" },
  "1466H32P01": { slug: "prime-zenith", series: "Prime" },
  "1466H32P02": { slug: "prime-zenith-reverse-aisle", series: "Prime" },
  "1470H32082": { slug: "aspire-1470h32082", series: "Aspire" },
  "1476H32082": { slug: "aspire-1476h32082", series: "Aspire" },
  "1636H11P01": { slug: "prime-pike", series: "Prime" },
  "1652H21083": { slug: "aspire-1652h21083", series: "Aspire" },
  "1652H21151": { slug: "aspire-1652h21151", series: "Aspire" },
  "1656H22208": { slug: "aspire-1656h22208", series: "Aspire" },
  "1656H22P01": { slug: "prime-barkley", series: "Prime" },
  "1656H22P02": { slug: "prime-barkley-reverse-aisle", series: "Prime" },
  "1660H22212": { slug: "aspire-1660h22212", series: "Aspire" },
  "1660H22P01": { slug: "prime-spire", series: "Prime" },
  "1660H22P02": { slug: "prime-spire-reverse-aisle", series: "Prime" },
  "1660H32206": { slug: "aspire-1660h32206", series: "Aspire" },
  "1664H32212": { slug: "aspire-1664h32212", series: "Aspire" },
  "1666H22091": { slug: "aspire-1666h22091", series: "Aspire" },
  "1666H22232": { slug: "aspire-1666h22232", series: "Aspire" },
  "1666H32085": { slug: "aspire-1666h32085", series: "Aspire" },
  "1666H32212": { slug: "aspire-1666h32212", series: "Aspire" },
  "1666H32217": { slug: "aspire-1666h32217", series: "Aspire" },
  "1666H32219": { slug: "aspire-1666h32219", series: "Aspire" },
  "1666H32P01": { slug: "prime-vertex", series: "Prime" },
  "1666H32P02": { slug: "prime-vertex-reverse-aisle", series: "Prime" },
  "1666H32P07": { slug: "prime-hickman", series: "Prime" },
  "1666H32P09": { slug: "prime-pendleton", series: "Prime" },
  "1668H22259": { slug: "aspire-1668h22259", series: "Aspire" },
  "1668H32085": { slug: "aspire-1668h32085", series: "Aspire" },
  "1668H32087": { slug: "aspire-1668h32087", series: "Aspire" },
  "1668H32220": { slug: "aspire-1668h32220", series: "Aspire" },
  "1672H32087": { slug: "aspire-1672h32087", series: "Aspire" },
  "1672H32090": { slug: "aspire-1672h32090", series: "Aspire" },
  "1672H32P09": { slug: "prime-powell", series: "Prime" },
  "1676H32085": { slug: "aspire-1676h32085", series: "Aspire" },
  "1676H32087": { slug: "aspire-1676h32087", series: "Aspire" },
  "1676H32089": { slug: "aspire-1676h32089", series: "Aspire" },
  "1676H32090": { slug: "aspire-1676h32090", series: "Aspire" },
  "1676H32091": { slug: "aspire-1676h32091", series: "Aspire" },
  "1676H32107": { slug: "aspire-1676h32107", series: "Aspire" },
  "1676H32212": { slug: "aspire-1676h32212", series: "Aspire" },
  "1676H32222": { slug: "aspire-1676h32222", series: "Aspire" },
  "1676H32259": { slug: "aspire-1676h32259", series: "Aspire" },
  "1676H32P01": { slug: "prime-ridge", series: "Prime" },
  "1676H32P02": { slug: "prime-ridge-reverse-aisle", series: "Prime" },
  "1676H32P06": { slug: "prime-monte", series: "Prime" },
  "1676H32P09": { slug: "prime-floyd", series: "Prime" },
  "2432H21166": { slug: "aspire-casper-2432h21166", series: "Aspire" },
  "2436H21166": { slug: "aspire-casper-2436h21166", series: "Aspire" },
  "2440H32382": { slug: "aspire-sheridan-2440h32382", series: "Aspire" },
  "2444H32167": { slug: "aspire-sundance-2444h32167", series: "Aspire" },
  "2444H32382": { slug: "aspire-sheridan-2444h32382", series: "Aspire" },
  "2448H32167": { slug: "aspire-sundance-2448h32167", series: "Aspire" },
  "2448H32382": { slug: "aspire-sheridan-2448h32382", series: "Aspire" },
  "2448H32384": { slug: "aspire-fairplay-2448h32384", series: "Aspire" },
  "2448H32P02": { slug: "prime-plateau", series: "Prime" },
  "2452H32160": { slug: "aspire-broomfield-2452h32160", series: "Aspire" },
  "2452H32167": { slug: "aspire-sundance-2452h32167", series: "Aspire" },
  "2456H32160": { slug: "aspire-broomfield-2456h32160", series: "Aspire" },
  "2456H32168": { slug: "aspire-brooklyn-2456h32168", series: "Aspire" },
  "2456H32P02": { slug: "prime-horizon", series: "Prime" },
  "2460H42096": { slug: "aspire-glenrock-2460h42096", series: "Aspire" },
  "2840H32024": { slug: "aspire-monroe-2840h32024", series: "Aspire" },
  "2842H32388": { slug: "aspire-appleton-2842h32388", series: "Aspire" },
  "2844H32024": { slug: "aspire-monroe-2844h32024", series: "Aspire" },
  "2844H32169": { slug: "aspire-bayfield-2844h32169", series: "Aspire" },
  "2844H32P01": { slug: "prime-estill", series: "Prime" },
  "2848H32024": { slug: "aspire-monroe-2848h32024", series: "Aspire" },
  "2848H32160": { slug: "aspire-lancaster-2848h32160", series: "Aspire" },
  "2848H32169": { slug: "aspire-bayfield-2848h32169", series: "Aspire" },
  "2848H32170": { slug: "aspire-brighton-2848h32170", series: "Aspire" },
  "2848H32171": { slug: "aspire-lincoln-2848h32171", series: "Aspire" },
  "2848H32P06": { slug: "prime-churchill", series: "Prime" },
  "2852H32034": { slug: "aspire-ventura-2852h32034", series: "Aspire" },
  "2852H32103": { slug: "aspire-pontiac-2852h32103", series: "Aspire" },
  "2852H32160": { slug: "aspire-lancaster-2852h32160", series: "Aspire" },
  "2852H32169": { slug: "aspire-bayfield-2852h32169", series: "Aspire" },
  "2852H32170": { slug: "aspire-brighton-2852h32170", series: "Aspire" },
  "2852H32171": { slug: "aspire-lincoln-2852h32171", series: "Aspire" },
  "2852H32172": { slug: "aspire-warren-2852h32172", series: "Aspire" },
  "2852H32173": { slug: "aspire-jackson-2852h32173", series: "Aspire" },
  "2852H32393": { slug: "aspire-pierre-2852h32393", series: "Aspire" },
  "2852H32A1C": { slug: "aspire-summit-2852h32a1c", series: "Aspire" },
  "2852H32P01": { slug: "prime-mercer", series: "Prime" },
  "2852H42096": { slug: "aspire-livingston-2852h42096", series: "Aspire" },
  "2856H32034": { slug: "aspire-ventura-2856h32034", series: "Aspire" },
  "2856H32103": { slug: "aspire-pontiac-2856h32103", series: "Aspire" },
  "2856H32168": { slug: "aspire-bay-port-2856h32168", series: "Aspire" },
  "2856H32171": { slug: "aspire-lincoln-2856h32171", series: "Aspire" },
  "2856H32172": { slug: "aspire-warren-2856h32172", series: "Aspire" },
  "2856H32173": { slug: "aspire-jackson-2856h32173", series: "Aspire" },
  "2856H32174": { slug: "aspire-silverton-2856h32174", series: "Aspire" },
  "2856H32301": { slug: "aspire-easton-2856h32301", series: "Aspire" },
  "2856H32392": { slug: "aspire-belvidere-2856h32392", series: "Aspire" },
  "2856H32A1C": { slug: "aspire-summit-2856h32a1c", series: "Aspire" },
  "2856H32P01": { slug: "prime-apex", series: "Prime" },
  "2860H32047": { slug: "aspire-woodward-2860h32047", series: "Aspire" },
  "2860H32168": { slug: "aspire-bay-port-2860h32168", series: "Aspire" },
  "2860H32172": { slug: "aspire-warren-2860h32172", series: "Aspire" },
  "2860H32174": { slug: "aspire-silverton-2860h32174", series: "Aspire" },
  "2860H32301": { slug: "aspire-easton-2860h32301", series: "Aspire" },
  "2860H32394": { slug: "aspire-odyssey-2860h32394", series: "Aspire" },
  "2864H32060": { slug: "aspire-fillmore-2864h32060", series: "Aspire" },
  "2864H32101": { slug: "aspire-georgetown-2864h32101", series: "Aspire" },
  "2864H42A1C": { slug: "aspire-summit-2864h42a1c", series: "Aspire" },
  "2868H32047": { slug: "aspire-woodward-2868h32047", series: "Aspire" },
  "2868H32394": { slug: "aspire-odyssey-2868h32394", series: "Aspire" },
  "2868H42P01": { slug: "prime-the-grand", series: "Prime" },
  "2868H52A1C": { slug: "aspire-summit-2868h52a1c", series: "Aspire" },
  "2876H42180": { slug: "aspire-baldwin-2876h42180", series: "Aspire" },
  "2876H53P01": { slug: "prime-pinnacle", series: "Prime" },
  "3252H32377": { slug: "aspire-thornton-3252h32377", series: "Aspire" },
  "3256H32377": { slug: "aspire-thornton-3256h32377", series: "Aspire" },
  "3260H32181": { slug: "aspire-shelby-3260h32181", series: "Aspire" },
  "3260H32207": { slug: "aspire-timberlake-3260h32207", series: "Aspire" },
  "3260H32394": { slug: "aspire-odyssey-3260h32394", series: "Aspire" },
  "3264H32181": { slug: "aspire-shelby-3264h32181", series: "Aspire" },
  "3268H32181": { slug: "aspire-shelby-3268h32181", series: "Aspire" },
  "3272H32186": { slug: "aspire-winston-3272h32186", series: "Aspire" },
};

/**
 * Series for a model the published catalogue doesn't carry. The price sheet's
 * own family is the only evidence left, and "Dutch Aspire" is the Aspire series
 * (see canonicalSeries in src/lib/series.ts).
 */
export function fallbackSeries(family: string): "Aspire" | "Prime" {
  return family.startsWith("Prime") ? "Prime" : "Aspire";
}

export function catalogEntryFor(model: string): CatalogEntry | undefined {
  return CATALOG_INDEX[model.trim().toUpperCase()];
}
