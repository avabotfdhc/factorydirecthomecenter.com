// The Paramount line is retired from the catalogue (Kyle, 2026-09-26: "remove
// Paramount Series and the floor plans associated with it"), and none of its
// traffic is thrown away.
//
// Paramount is not a line that stands apart from Redman — Champion's own
// literature calls it the "Redman Paramount" range (see the standards-sheet
// citation at the top of paramount-content.ts). So Redman is where a buyer who
// wants one of these homes belongs, and /series/redman is the destination for
// anything that cannot be matched to a surviving home.
//
// 186 Paramount plans were active and indexed when the line was retired. They
// split cleanly in two, measured against the catalogue on 2026-09-26:
//
//   164  are the SAME PHYSICAL HOME as an Aspire plan — identical Champion
//        model number, and in every one of the 164 cases the surviving plan's
//        slug is this slug with "paramount-" swapped for "aspire-". These were
//        duplicate pages for one home (catalog-index.ts records that the
//        Aspire/Paramount split could never be settled from Champion's own
//        price sheet); retiring Paramount consolidates each pair into the page
//        that is still for sale, which is what the 301 tells Google to do.
//     22 exist only as Paramount — the big Alberta / Apollo / Fenton / Myrtle /
//        Red Cedar / Stafford sectionals. These are genuinely retired from the
//        catalogue and land on the Redman hub, which quotes plans to spec.
//
// Verified in SQL before this file was written: 164 follow the slug rule, 0
// break it, 0 destinations are missing or inactive. Regenerate by re-running
// that comparison against floor_plans; the query is in the PR that added this
// file. Safe to edit by hand.

/** Catalogue series labels that are no longer published. */
export const RETIRED_SERIES: readonly string[] = ["Paramount"];

/** Where a retired home goes when no surviving plan matches it. */
export const RETIRED_SERIES_HUB = "/series/redman";

/** True for a catalogue series label that is no longer published. Matches the
 *  bare name and any label carrying it ("Paramount", "Paramount Series"), so a
 *  CMS row spelled loosely is still caught. */
export function isRetiredSeries(series: string | undefined | null): boolean {
  const s = String(series || "").toLowerCase();
  if (!s) return false;
  return RETIRED_SERIES.some((r) => new RegExp(`\\b${r.toLowerCase()}\\b`).test(s));
}

/** The part of a retired Paramount slug after "paramount-". */
export const RETIRED_PARAMOUNT_TAILS: readonly string[] = [
  "1432h11214",
  "1440h11065",
  "1444h11023",
  "1452h21023",
  "1452h21081",
  "1456h21023",
  "1456h21030",
  "1460h21216",
  "1460h22215",
  "1466h32082",
  "1470h32082",
  "1472h32082",
  "1476h32082",
  "1648h21016",
  "1652h21083",
  "1652h21151",
  "1656h22208",
  "1660h22212",
  "1660h32206",
  "1664h32212",
  "1666h22091",
  "1666h22232",
  "1666h32085",
  "1666h32212",
  "1666h32217",
  "1666h32219",
  "1668h22259",
  "1668h32085",
  "1668h32087",
  "1668h32220",
  "1672h32087",
  "1672h32090",
  "1676h32085",
  "1676h32087",
  "1676h32089",
  "1676h32090",
  "1676h32091",
  "1676h32107",
  "1676h32212",
  "1676h32221",
  "1676h32222",
  "1676h32259",
  "alberta-2864h42177",
  "alberta-2864m42177",
  "apollo-3272h42185",
  "apollo-3272m42185",
  "apollo-3276h42185",
  "apollo-3276m42185",
  "appleton-2842h32388",
  "appleton-2842m32388",
  "baldwin-2876h42180",
  "baldwin-2876m42180",
  "bay-port-2856h32168",
  "bay-port-2856m32168",
  "bay-port-2860h32168",
  "bay-port-2860m32168",
  "bayfield-2844h32169",
  "bayfield-2844m32169",
  "bayfield-2848h32169",
  "bayfield-2848m32169",
  "bayfield-2852h32169",
  "bayfield-2852m32169",
  "belvidere-2856h32392",
  "belvidere-2856m32392",
  "berkley-2856h32449",
  "berkley-2856m32449",
  "brighton-2848h32170",
  "brighton-2848m32170",
  "brighton-2852h32170",
  "brighton-2852m32170",
  "brooklyn-2456h32168",
  "broomfield-2452h32160",
  "broomfield-2456h32160",
  "casper-2432h21166",
  "casper-2436h21166",
  "easton-2856h32301",
  "easton-2856m32301",
  "easton-2860h32301",
  "easton-2860m32301",
  "fairplay-2448h32384",
  "fenton-3260h32182",
  "fenton-3260m32182",
  "fenton-3264h32182",
  "fenton-3264m32182",
  "fenton-3268h32182",
  "fenton-3268m32182",
  "fillmore-2864h32060",
  "fillmore-2864m32060",
  "georgetown-2864h32101",
  "georgetown-2864m32101",
  "glenrock-2460h42096",
  "henderson-3264m32396",
  "henderson-3268m32396",
  "henderson-3276m42396",
  "jackson-2852h32173",
  "jackson-2852m32173",
  "jackson-2856h32173",
  "jackson-2856m32173",
  "lancaster-2848h32160",
  "lancaster-2848m32160",
  "lancaster-2852h32160",
  "lancaster-2852m32160",
  "lincoln-2848h32171",
  "lincoln-2848m32171",
  "lincoln-2852h32171",
  "lincoln-2852m32171",
  "lincoln-2856h32171",
  "lincoln-2856m32171",
  "livingston-2852h42096",
  "livingston-2852m42096",
  "madison-3268m32052",
  "monroe-2840h32024",
  "monroe-2840m32024",
  "monroe-2844h32024",
  "monroe-2844m32024",
  "monroe-2848h32024",
  "monroe-2848m32024",
  "myrtle-2860h32308",
  "myrtle-2860m32308",
  "odyssey-2860h32394",
  "odyssey-2860m32394",
  "odyssey-2868h32394",
  "odyssey-2868m32394",
  "odyssey-3260h32394",
  "odyssey-3260m32394",
  "odyssey-3268m32394",
  "pierre-2852h32393",
  "pierre-2852m32393",
  "pontiac-2852h32103",
  "pontiac-2852m32103",
  "pontiac-2856h32103",
  "pontiac-2856m32103",
  "red-cedar-3276h43187",
  "red-cedar-3276m43187",
  "shelby-3260h32181",
  "shelby-3260m32181",
  "shelby-3264h32181",
  "shelby-3264m32181",
  "shelby-3268h32181",
  "shelby-3268m32181",
  "sheridan-2440h32382",
  "sheridan-2444h32382",
  "sheridan-2448h32382",
  "silverton-2856h32174",
  "silverton-2856m32174",
  "silverton-2860h32174",
  "silverton-2860m32174",
  "stafford-2868h32179",
  "stafford-2868m32179",
  "stafford-2872h42179",
  "stafford-2872m42179",
  "stafford-2876h43179",
  "stafford-2876m43179",
  "summit-2852h32a1c",
  "summit-2852m32a1c",
  "summit-2856h32a1c",
  "summit-2856m32a1c",
  "summit-2864h42a1c",
  "summit-2864m42a1c",
  "summit-2868h52a1c",
  "summit-2868m52a1c",
  "sundance-2444h32167",
  "sundance-2448h32167",
  "sundance-2452h32167",
  "thornton-3252h32377",
  "thornton-3252m32377",
  "thornton-3256h32377",
  "thornton-3256m32377",
  "timberlake-3260h32207",
  "timberlake-3260m32207",
  "ventura-2852h32034",
  "ventura-2852m32034",
  "ventura-2856h32034",
  "ventura-2856m32034",
  "verona-3276m42179",
  "warren-2852h32172",
  "warren-2852m32172",
  "warren-2856h32172",
  "warren-2856m32172",
  "warren-2860h32172",
  "warren-2860m32172",
  "winston-3272h32186",
  "winston-3272m32186",
  "woodward-2860m32047",
  "woodward-2864m32047",
  "woodward-2868m32047",
];

/** The 22 whose home has no equivalent in another series — nothing survives to
 *  redirect them to, so they go to the Redman hub. */
export const PARAMOUNT_WITHOUT_SUCCESSOR: ReadonlySet<string> = new Set([
  "alberta-2864h42177",
  "alberta-2864m42177",
  "apollo-3272h42185",
  "apollo-3272m42185",
  "apollo-3276h42185",
  "apollo-3276m42185",
  "fenton-3260h32182",
  "fenton-3260m32182",
  "fenton-3264h32182",
  "fenton-3264m32182",
  "fenton-3268h32182",
  "fenton-3268m32182",
  "myrtle-2860h32308",
  "myrtle-2860m32308",
  "red-cedar-3276h43187",
  "red-cedar-3276m43187",
  "stafford-2868h32179",
  "stafford-2868m32179",
  "stafford-2872h42179",
  "stafford-2872m42179",
  "stafford-2876h43179",
  "stafford-2876m43179",
]);

/** Full slug of a retired Paramount plan. */
export function paramountSlug(tail: string): string {
  return `paramount-${tail}`;
}

/** Where a retired Paramount plan's URL should send a visitor: the surviving
 *  Aspire page for the same home, or the Redman hub when there is none. */
export function paramountDestination(tail: string): string {
  return PARAMOUNT_WITHOUT_SUCCESSOR.has(tail)
    ? RETIRED_SERIES_HUB
    : `/floor-plans/aspire-${tail}`;
}

/** True when this slug belonged to a retired plan, whatever series a stale
 *  catalogue row claims for it. */
export function isRetiredPlanSlug(slug: string): boolean {
  return RETIRED_PARAMOUNT_TAILS.includes(String(slug).replace(/^paramount-/, "")) &&
    String(slug).startsWith("paramount-");
}

/** 301s for every retired Paramount URL, plus the series hub itself. Consumed
 *  by next.config.ts alongside legacyFloorPlanRedirects. */
export const retiredSeriesRedirects: Array<{ source: string; destination: string; permanent: boolean }> = [
  ...RETIRED_PARAMOUNT_TAILS.map((tail) => ({
    source: `/floor-plans/${paramountSlug(tail)}`,
    destination: paramountDestination(tail),
    permanent: true,
  })),
  { source: "/series/paramount", destination: RETIRED_SERIES_HUB, permanent: true },
];
