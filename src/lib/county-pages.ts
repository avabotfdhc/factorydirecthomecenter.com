// Programmatic county pages (/locations/[slug]). Each entry renders the same
// template; add a county here and it is live, in the sitemap and in the
// locations index. Static folders under src/app/locations/ take precedence
// over this route for the same slug.

export interface CountyPage {
  slug: string;
  county: string;          // "Allen County"
  state: "Indiana";
  eyebrow: string;         // hero kicker
  intro: string;
  towns: string[];         // communities we deliver to
  milesFromAuburn: string; // "about 25 miles"
  driveNote: string;
  points: string[];        // why-this-county bullets
  zoningNote: string;      // honest, non-legal guidance
}

export const countyPages: CountyPage[] = [
  {
    slug: "allen-county",
    county: "Allen County",
    state: "Indiana",
    eyebrow: "Fort Wayne Metro",
    intro:
      "Allen County is Indiana's second-largest county and our busiest delivery area outside DeKalb. From rural acreage north of Fort Wayne to lots in New Haven, Huntertown and Leo-Cedarville, we deliver Champion homes with factory-direct pricing and line-item transparency.",
    towns: ["Fort Wayne", "New Haven", "Huntertown", "Leo-Cedarville", "Woodburn", "Monroeville", "Grabill", "Harlan"],
    milesFromAuburn: "about 25 miles",
    driveNote: "Our Auburn lot is a 25-minute drive up I-69 from Fort Wayne, and the Champion plant in Topeka is under an hour from most Allen County sites.",
    points: [
      "Rural and suburban lots across the county's unincorporated areas",
      "Short freight run from the Topeka factory keeps delivery costs down",
      "Chattel, land-home and FHA Title I lenders active throughout the Fort Wayne market",
      "Modular (IRC) homes available where a site calls for a stick-built appraisal",
    ],
    zoningNote:
      "Allen County's Department of Planning Services handles zoning and building permits for unincorporated areas; Fort Wayne, New Haven and the towns have their own offices. Manufactured homes are allowed on many residential and agricultural lots outside city limits, often with foundation and skirting standards. We'll check your parcel's zoning before you commit to a home.",
  },
  {
    slug: "dekalb-county",
    county: "DeKalb County",
    state: "Indiana",
    eyebrow: "Our Home County",
    intro:
      "DeKalb County is home. Our lot sits on State Road 8 in Auburn, so every home we deliver in the county is a short local run: Garrett, Butler, Waterloo, St. Joe and the rural townships between them.",
    towns: ["Auburn", "Garrett", "Butler", "Waterloo", "St. Joe", "Ashley", "Corunna", "Spencerville"],
    milesFromAuburn: "0 to 12 miles",
    driveNote: "Stop by the Auburn lot any weekday, walk the homes, and we can be at your parcel the same afternoon.",
    points: [
      "Local delivery: the lowest freight and set-up cost of any county we serve",
      "We know the county's permit office, inspectors and site contractors by name",
      "Rural lots with wells and septic are the norm, and our referral list covers both",
      "Same factory-direct pricing whether the home goes on a farm or a town lot",
    ],
    zoningNote:
      "DeKalb County Planning & Building in Auburn issues permits for the unincorporated county; Auburn, Garrett and Butler permit within their city limits. Most residential and agricultural districts allow HUD-code manufactured homes on a permanent foundation. Bring us the parcel number and we'll confirm before you order.",
  },
  {
    slug: "noble-county",
    county: "Noble County",
    state: "Indiana",
    eyebrow: "Rural Indiana",
    intro:
      "Noble County welcomes manufactured homes. From Kendallville to Ligonier, rural lots to small-town settings, we deliver Champion homes with factory-direct pricing and line-item transparency.",
    towns: ["Kendallville", "Ligonier", "Albion", "Rome City", "Avilla", "Cromwell", "Wolcottville"],
    milesFromAuburn: "about 20 to 35 miles",
    driveNote: "Noble County sits between our Auburn lot and the Champion plant in Topeka, so your home travels one of the shortest routes we run.",
    points: [
      "Manufactured homes permitted on most rural residential lots",
      "Lake-area and farm parcels alike: we've set homes on both",
      "Closest county to the Topeka factory after LaGrange",
      "Affordable land compared with the Fort Wayne metro",
    ],
    zoningNote:
      "The Noble County Plan Commission in Albion issues permits for unincorporated areas; Kendallville and Ligonier permit within their limits. Most agricultural and residential districts allow manufactured homes on a permanent foundation. We'll pull your parcel's zoning before you order.",
  },
];

export function getCountyPage(slug: string): CountyPage | undefined {
  return countyPages.find((c) => c.slug === slug);
}
