// Which series each priced model belongs to, and where its page lives.
//
// The master price sheet groups its 147 models into just two families, "Dutch
// Aspire" and "Prime". The catalogue the site publishes splits the first of
// those across two series: 61 of those models are listed as Paramount and 42 as
// Aspire. Neither the price sheet nor the repo's own catalogue files can settle
// which is which — src/lib/aspire-floor-plans.ts and paramount-floor-plans.ts
// both claim 41 of the same model numbers — so this index was taken from the
// published catalogue on factorydirecthomescenter.com, which assigns exactly
// one series and one page to each home.
//
// Regenerate by reading /floor-plans and recording each card's slug and its
// "<Series> Series" badge.

export interface CatalogEntry {
  /** Path segment under /floor-plans. */
  slug: string;
  /** Series as the published catalogue labels it. */
  series: "Aspire" | "Paramount" | "Prime";
}

export const CATALOG_INDEX: Record<string, CatalogEntry> = {
  "1432H11214": { slug: "paramount-1432h11214", series: "Paramount" },
  "1440H11065": { slug: "paramount-1440h11065", series: "Paramount" },
  "1444H11023": { slug: "dutch-aspire-1444h11023", series: "Aspire" },
  "1452H21023": { slug: "paramount-1452h21023", series: "Paramount" },
  "1452H21081": { slug: "paramount-1452h21081", series: "Paramount" },
  "1456H21023": { slug: "paramount-1456h21023", series: "Paramount" },
  "1456H21030": { slug: "paramount-1456h21030", series: "Paramount" },
  "1456H22P01": { slug: "prime-peak", series: "Prime" },
  "1456H22P02": { slug: "prime-peak-reverse-aisle", series: "Prime" },
  "1460H21216": { slug: "paramount-1460h21216", series: "Paramount" },
  "1460H22215": { slug: "paramount-1460h22215", series: "Paramount" },
  "1460H22P01": { slug: "prime-crest", series: "Prime" },
  "1460H22P02": { slug: "prime-crest-reverse-aisle", series: "Prime" },
  "1466H32082": { slug: "paramount-1466h32082", series: "Paramount" },
  "1466H32P01": { slug: "prime-zenith", series: "Prime" },
  "1466H32P02": { slug: "prime-zenith-reverse-aisle", series: "Prime" },
  "1470H32082": { slug: "paramount-1470h32082", series: "Paramount" },
  "1476H32082": { slug: "paramount-1476h32082", series: "Paramount" },
  "1636H11P01": { slug: "prime-pike", series: "Prime" },
  "1652H21083": { slug: "paramount-1652h21083", series: "Paramount" },
  "1652H21151": { slug: "paramount-1652h21151", series: "Paramount" },
  "1656H22208": { slug: "paramount-1656h22208", series: "Paramount" },
  "1656H22P01": { slug: "prime-barkley", series: "Prime" },
  "1656H22P02": { slug: "prime-barkley-reverse-aisle", series: "Prime" },
  "1660H22212": { slug: "dutch-aspire-1660h22212", series: "Aspire" },
  "1660H22P01": { slug: "prime-spire", series: "Prime" },
  "1660H22P02": { slug: "prime-spire-reverse-aisle", series: "Prime" },
  "1660H32206": { slug: "dutch-aspire-1660h32206", series: "Aspire" },
  "1664H32212": { slug: "paramount-1664h32212", series: "Paramount" },
  "1666H22091": { slug: "dutch-aspire-1666h22091", series: "Aspire" },
  "1666H22232": { slug: "dutch-aspire-1666h22232", series: "Aspire" },
  "1666H32085": { slug: "paramount-1666h32085", series: "Paramount" },
  "1666H32212": { slug: "paramount-1666h32212", series: "Paramount" },
  "1666H32217": { slug: "paramount-1666h32217", series: "Paramount" },
  "1666H32219": { slug: "paramount-1666h32219", series: "Paramount" },
  "1666H32P01": { slug: "prime-vertex", series: "Prime" },
  "1666H32P02": { slug: "prime-vertex-reverse-aisle", series: "Prime" },
  "1666H32P07": { slug: "prime-hickman", series: "Prime" },
  "1666H32P09": { slug: "prime-pendleton", series: "Prime" },
  "1668H22259": { slug: "dutch-aspire-1668h22259", series: "Aspire" },
  "1668H32085": { slug: "paramount-1668h32085", series: "Paramount" },
  "1668H32087": { slug: "paramount-1668h32087", series: "Paramount" },
  "1668H32220": { slug: "paramount-1668h32220", series: "Paramount" },
  "1672H32087": { slug: "dutch-aspire-1672h32087", series: "Aspire" },
  "1672H32090": { slug: "dutch-aspire-1672h32090", series: "Aspire" },
  "1672H32P09": { slug: "prime-powell", series: "Prime" },
  "1676H32085": { slug: "dutch-aspire-1676h32085", series: "Aspire" },
  "1676H32087": { slug: "dutch-aspire-1676h32087", series: "Aspire" },
  "1676H32089": { slug: "paramount-1676h32089", series: "Paramount" },
  "1676H32090": { slug: "paramount-1676h32090", series: "Paramount" },
  "1676H32091": { slug: "paramount-1676h32091", series: "Paramount" },
  "1676H32107": { slug: "dutch-aspire-westbrook-1676h32107", series: "Aspire" },
  "1676H32212": { slug: "paramount-1676h32212", series: "Paramount" },
  "1676H32222": { slug: "paramount-1676h32222", series: "Paramount" },
  "1676H32259": { slug: "paramount-1676h32259", series: "Paramount" },
  "1676H32P01": { slug: "prime-ridge", series: "Prime" },
  "1676H32P02": { slug: "prime-ridge-reverse-aisle", series: "Prime" },
  "1676H32P06": { slug: "prime-monte", series: "Prime" },
  "1676H32P09": { slug: "prime-floyd", series: "Prime" },
  "2432H21166": { slug: "dutch-aspire-casper-2432h21166", series: "Aspire" },
  "2436H21166": { slug: "dutch-aspire-casper-2436h21166", series: "Aspire" },
  "2440H32382": { slug: "dutch-aspire-sheridan-2440h32382", series: "Aspire" },
  "2444H32167": { slug: "dutch-aspire-sundance-2444h32167", series: "Aspire" },
  "2444H32382": { slug: "dutch-aspire-sheridan-2444h32382", series: "Aspire" },
  "2448H32167": { slug: "dutch-aspire-sundance-2448h32167", series: "Aspire" },
  "2448H32382": { slug: "dutch-aspire-sheridan-2448h32382", series: "Aspire" },
  "2448H32384": { slug: "dutch-aspire-fairplay-2448h32384", series: "Aspire" },
  "2448H32P02": { slug: "prime-plateau", series: "Prime" },
  "2452H32160": { slug: "dutch-aspire-broomfield-2452h32160", series: "Aspire" },
  "2452H32167": { slug: "dutch-aspire-sundance-2452h32167", series: "Aspire" },
  "2456H32160": { slug: "dutch-aspire-broomfield-2456h32160", series: "Aspire" },
  "2456H32168": { slug: "dutch-aspire-brooklyn-2456h32168", series: "Aspire" },
  "2456H32P02": { slug: "prime-horizon", series: "Prime" },
  "2460H42096": { slug: "dutch-aspire-glenrock-2460h42096", series: "Aspire" },
  "2840H32024": { slug: "paramount-monroe-2840h32024", series: "Paramount" },
  "2842H32388": { slug: "paramount-appleton-2842h32388", series: "Paramount" },
  "2844H32024": { slug: "dutch-aspire-monroe-2844h32024", series: "Aspire" },
  "2844H32169": { slug: "dutch-aspire-bayfield-2844h32169", series: "Aspire" },
  "2844H32P01": { slug: "prime-estill", series: "Prime" },
  "2848H32024": { slug: "dutch-aspire-monroe-2848h32024", series: "Aspire" },
  "2848H32160": { slug: "dutch-aspire-lancaster-2848h32160", series: "Aspire" },
  "2848H32169": { slug: "dutch-aspire-bayfield-2848h32169", series: "Aspire" },
  "2848H32170": { slug: "dutch-aspire-brighton-2848h32170", series: "Aspire" },
  "2848H32171": { slug: "paramount-lincoln-2848h32171", series: "Paramount" },
  "2848H32P06": { slug: "prime-churchill", series: "Prime" },
  "2852H32034": { slug: "paramount-ventura-2852h32034", series: "Paramount" },
  "2852H32103": { slug: "paramount-pontiac-2852h32103", series: "Paramount" },
  "2852H32160": { slug: "dutch-aspire-lancaster-2852h32160", series: "Aspire" },
  "2852H32169": { slug: "paramount-bayfield-2852h32169", series: "Paramount" },
  "2852H32170": { slug: "paramount-brighton-2852h32170", series: "Paramount" },
  "2852H32171": { slug: "paramount-lincoln-2852h32171", series: "Paramount" },
  "2852H32172": { slug: "dutch-aspire-warren-2852h32172", series: "Aspire" },
  "2852H32173": { slug: "dutch-aspire-jackson-2852h32173", series: "Aspire" },
  "2852H32393": { slug: "paramount-pierre-2852h32393", series: "Paramount" },
  "2852H32A1C": { slug: "dutch-aspire-summit-2852h32a1c", series: "Aspire" },
  "2852H32P01": { slug: "prime-mercer", series: "Prime" },
  "2852H42096": { slug: "paramount-livingston-2852h42096", series: "Paramount" },
  "2856H32034": { slug: "paramount-ventura-2856h32034", series: "Paramount" },
  "2856H32103": { slug: "dutch-aspire-pontiac-2856h32103", series: "Aspire" },
  "2856H32168": { slug: "paramount-bay-port-2856h32168", series: "Paramount" },
  "2856H32171": { slug: "paramount-lincoln-2856h32171", series: "Paramount" },
  "2856H32172": { slug: "paramount-warren-2856h32172", series: "Paramount" },
  "2856H32173": { slug: "dutch-aspire-jackson-2856h32173", series: "Aspire" },
  "2856H32174": { slug: "paramount-silverton-2856h32174", series: "Paramount" },
  "2856H32301": { slug: "paramount-easton-2856h32301", series: "Paramount" },
  "2856H32392": { slug: "paramount-belvidere-2856h32392", series: "Paramount" },
  "2856H32A1C": { slug: "dutch-aspire-summit-2856h32a1c", series: "Aspire" },
  "2856H32P01": { slug: "prime-apex", series: "Prime" },
  "2860H32047": { slug: "dutch-aspire-woodward-2860h32047", series: "Aspire" },
  "2860H32168": { slug: "paramount-bay-port-2860h32168", series: "Paramount" },
  "2860H32172": { slug: "paramount-warren-2860h32172", series: "Paramount" },
  "2860H32174": { slug: "paramount-silverton-2860h32174", series: "Paramount" },
  "2860H32301": { slug: "dutch-aspire-easton-2860h32301", series: "Aspire" },
  "2860H32394": { slug: "paramount-odyssey-2860h32394", series: "Paramount" },
  "2864H32060": { slug: "paramount-fillmore-2864h32060", series: "Paramount" },
  "2864H32101": { slug: "paramount-georgetown-2864h32101", series: "Paramount" },
  "2864H42A1C": { slug: "paramount-summit-2864h42a1c", series: "Paramount" },
  "2868H32047": { slug: "dutch-aspire-woodward-2868h32047", series: "Aspire" },
  "2868H32394": { slug: "dutch-aspire-odyssey-2868h32394", series: "Aspire" },
  "2868H42P01": { slug: "prime-the-grand", series: "Prime" },
  "2868H52A1C": { slug: "paramount-summit-2868h52a1c", series: "Paramount" },
  "2876H42180": { slug: "paramount-baldwin-2876h42180", series: "Paramount" },
  "2876H53P01": { slug: "prime-pinnacle", series: "Prime" },
  "3252H32377": { slug: "paramount-thornton-3252h32377", series: "Paramount" },
  "3256H32377": { slug: "paramount-thornton-3256h32377", series: "Paramount" },
  "3260H32181": { slug: "paramount-shelby-3260h32181", series: "Paramount" },
  "3260H32207": { slug: "paramount-timberlake-3260h32207", series: "Paramount" },
  "3260H32394": { slug: "dutch-aspire-odyssey-3260h32394", series: "Aspire" },
  "3264H32181": { slug: "paramount-shelby-3264h32181", series: "Paramount" },
  "3268H32181": { slug: "paramount-shelby-3268h32181", series: "Paramount" },
  "3272H32186": { slug: "paramount-winston-3272h32186", series: "Paramount" },
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
