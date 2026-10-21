// 301s for the 86 "Manufactured Homes in <Town>, Indiana" blog posts (84 live,
// two still scheduled), consolidated on 2026-10-21 into the /locations page for the same town or
// county.
//
// Why: Search Console, 28 days to 2026-10-19, for every /blog/manufactured-homes-*
// URL combined: 2 clicks, 82 impressions, average position 12.6 — and their
// impressions fell to near zero from 2026-10-01, while Google's September 2026
// spam update (2026-09-24 to 2026-10-08) was rolling out. The rest of the site
// was unaffected (907 clicks / 23.1K impressions in the same 28 days, trending
// up over three months). Posts that differ mainly by place name are the
// doorway-page pattern Google's spam policy names; they earned nothing and
// carried the risk, so each now 301s to the one page that should rank for the
// town. A town with its own /locations page goes there; every other post goes
// to the county page it linked.
//
// Rule from here (AGENTS.md, "Town pages"): no new town posts. A town or county
// that deserves coverage gets one /locations page, or a section on the county
// page — never a second URL for the same place.
//
// tests/town-post-redirects.test.ts: unique sources, no live post left behind
// at a redirected slug, every destination a registered page, single hop.

type Redirect = { source: string; destination: string; permanent: boolean };

/** [blog slug, destination path] */
export const TOWN_POST_DESTINATIONS: ReadonlyArray<readonly [string, string]> = [
  ["manufactured-homes-fort-wayne-buyers-guide", "/locations/fort-wayne"],
  ["manufactured-homes-auburn-indiana-guide", "/locations/auburn"],
  ["manufactured-homes-garrett-indiana", "/locations/garrett"],
  ["manufactured-homes-waterloo-indiana", "/locations/waterloo"],
  ["manufactured-homes-butler-indiana", "/locations/butler"],
  ["manufactured-homes-kendallville-indiana", "/locations/kendallville"],
  ["manufactured-homes-albion-indiana", "/locations/albion"],
  ["manufactured-homes-ligonier-indiana", "/locations/ligonier"],
  ["manufactured-homes-angola-indiana", "/locations/angola"],
  ["manufactured-homes-huntertown-indiana", "/locations/huntertown"],
  ["manufactured-homes-new-haven-indiana", "/locations/new-haven"],
  ["manufactured-homes-columbia-city-indiana", "/locations/columbia-city"],
  ["manufactured-homes-churubusco-indiana", "/locations/churubusco"],
  ["manufactured-homes-indianapolis-guide", "/locations/indianapolis"],
  ["manufactured-homes-corunna-indiana", "/locations/dekalb-county"],
  ["manufactured-homes-st-joe-indiana", "/locations/dekalb-county"],
  ["manufactured-homes-spencerville-indiana", "/locations/dekalb-county"],
  ["manufactured-homes-ashley-indiana", "/locations/steuben-county"],
  ["manufactured-homes-avilla-indiana", "/locations/noble-county"],
  ["manufactured-homes-rome-city-indiana", "/locations/noble-county"],
  ["manufactured-homes-hamilton-indiana", "/locations/steuben-county"],
  ["manufactured-homes-fremont-indiana", "/locations/steuben-county"],
  ["manufactured-homes-leo-cedarville-indiana", "/locations/allen-county"],
  ["manufactured-homes-grabill-indiana", "/locations/allen-county"],
  ["manufactured-homes-harlan-indiana", "/locations/allen-county"],
  ["manufactured-homes-wolcottville-indiana", "/locations/noble-county"],
  ["manufactured-homes-woodburn-indiana", "/locations/allen-county"],
  ["manufactured-homes-pleasant-lake-indiana", "/locations/steuben-county"],
  ["manufactured-homes-orland-indiana", "/locations/steuben-county"],
  ["manufactured-homes-laotto-indiana", "/locations/noble-county"],
  ["manufactured-homes-topeka-indiana", "/locations/lagrange-county"],
  ["manufactured-homes-monroeville-indiana", "/locations/allen-county"],
  ["manufactured-homes-cromwell-indiana", "/locations/noble-county"],
  ["manufactured-homes-hudson-indiana", "/locations/steuben-county"],
  ["manufactured-homes-lagrange-indiana", "/locations/lagrange-county"],
  ["manufactured-homes-howe-indiana", "/locations/lagrange-county"],
  ["manufactured-homes-decatur-indiana", "/locations/adams-county"],
  ["manufactured-homes-ossian-indiana", "/locations/wells-county"],
  ["manufactured-homes-south-whitley-indiana", "/locations/whitley-county"],
  ["manufactured-homes-kimmell-indiana", "/locations/noble-county"],
  ["manufactured-homes-shipshewana-indiana", "/locations/lagrange-county"],
  ["manufactured-homes-bluffton-indiana", "/locations/wells-county"],
  ["manufactured-homes-berne-indiana", "/locations/adams-county"],
  ["manufactured-homes-larwill-indiana", "/locations/whitley-county"],
  ["manufactured-homes-wawaka-indiana", "/locations/noble-county"],
  ["manufactured-homes-stroh-indiana", "/locations/lagrange-county"],
  ["manufactured-homes-warsaw-indiana", "/locations/kosciusko-county"],
  ["manufactured-homes-huntington-indiana", "/locations/huntington-county"],
  ["manufactured-homes-goshen-indiana", "/locations/elkhart-county"],
  ["manufactured-homes-wabash-indiana", "/locations/wabash-county"],
  ["manufactured-homes-portland-indiana", "/locations/jay-county"],
  ["manufactured-homes-marion-indiana", "/locations/grant-county"],
  ["manufactured-homes-hartford-city-indiana", "/locations/blackford-county"],
  ["manufactured-homes-peru-indiana", "/locations/miami-county"],
  ["manufactured-homes-plymouth-indiana", "/locations/marshall-county"],
  ["manufactured-homes-rochester-indiana", "/locations/fulton-county"],
  ["manufactured-homes-roanoke-indiana", "/locations/huntington-county"],
  ["manufactured-homes-north-manchester-indiana", "/locations/wabash-county"],
  ["manufactured-homes-syracuse-indiana", "/locations/kosciusko-county"],
  ["manufactured-homes-nappanee-indiana", "/locations/elkhart-county"],
  ["manufactured-homes-geneva-indiana", "/locations/adams-county"],
  ["manufactured-homes-bremen-indiana", "/locations/marshall-county"],
  ["manufactured-homes-gas-city-indiana", "/locations/grant-county"],
  ["manufactured-homes-middlebury-indiana", "/locations/elkhart-county"],
  ["manufactured-homes-montpelier-indiana", "/locations/blackford-county"],
  ["manufactured-homes-akron-indiana", "/locations/fulton-county"],
  ["manufactured-homes-milford-indiana", "/locations/kosciusko-county"],
  ["manufactured-homes-warren-indiana", "/locations/huntington-county"],
  ["manufactured-homes-dunkirk-indiana", "/locations/jay-county"],
  ["manufactured-homes-bristol-indiana", "/locations/elkhart-county"],
  ["manufactured-homes-hoagland-indiana", "/locations/allen-county"],
  ["manufactured-homes-andrews-indiana", "/locations/huntington-county"],
  ["manufactured-homes-redkey-indiana", "/locations/jay-county"],
  ["manufactured-homes-mentone-indiana", "/locations/kosciusko-county"],
  ["manufactured-homes-argos-indiana", "/locations/marshall-county"],
  ["manufactured-homes-upland-indiana", "/locations/grant-county"],
  ["manufactured-homes-kokomo-indiana", "/locations/howard-county"],
  ["manufactured-homes-logansport-indiana", "/locations/cass-county"],
  ["manufactured-homes-mishawaka-indiana", "/locations/st-joseph-county"],
  ["manufactured-homes-muncie-indiana", "/locations/delaware-county"],
  ["manufactured-homes-winchester-indiana", "/locations/randolph-county"],
  ["manufactured-homes-millersburg-indiana", "/locations/elkhart-county"],
  ["manufactured-homes-winona-lake-indiana", "/locations/kosciusko-county"],
  ["manufactured-homes-wakarusa-indiana", "/locations/elkhart-county"],
  ["manufactured-homes-altona-indiana", "/locations/dekalb-county"],
  ["manufactured-homes-pierceton-indiana", "/locations/kosciusko-county"],
];

/** Matches the retired town-post slugs: "manufactured-homes-<town>-indiana" and the "-guide" posts. */
export const TOWN_POST_SLUG = /^manufactured-homes-.+-(indiana|guide)$/;

export const townPostRedirects: Redirect[] = TOWN_POST_DESTINATIONS.map(([slug, destination]) => ({
  source: `/blog/${slug}`,
  destination,
  permanent: true,
}));
