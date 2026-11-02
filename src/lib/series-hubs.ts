// Series hub pages (/series/[slug]). Each hub explains what the series is for
// and lists the matching homes from the live catalogue.

export interface SeriesHub {
  slug: string;
  name: string;            // "Prime"
  fullName: string;        // "Champion PRIME Series"
  eyebrow: string;
  tagline: string;
  intro: string;
  bestFor: string[];
  highlights: string[];
  /** Catalogue series label(s) this hub lists (matched against ApiFloorPlan.series). */
  catalogSeries: string[];
  /** Extra slug prefix filter (Dutch-branded Aspire homes carry a "dutch-" slug). */
  slugPrefix?: string;
  code: "HUD" | "IRC" | "HUD or IRC";
  /** A range Champion has sold under another name, and where that name's plans
   *  are now. Rendered as a plain note so the buyer who searched the old name
   *  is answered instead of being left on a redirect with no explanation. */
  formerly?: { name: string; note: string };
  /** Plans we order but do not publish a page for. Named so the page says
   *  something specific rather than offering a bare quote form. */
  quoteOnRequest?: Array<{ name: string; detail: string }>;
}

export const seriesHubs: SeriesHub[] = [
  {
    slug: "prime",
    name: "Prime",
    fullName: "Champion PRIME Series",
    eyebrow: "Best value single-wides",
    tagline: "Modern kitchens and efficient layouts at the lowest factory-direct price.",
    intro:
      "Prime is Champion's value line, built in Decatur, Indiana. Every Prime home is a single-section home, 14 or 16 feet wide, with the finishes buyers ask for most. Build time is 8 to 12 weeks. It is the series we suggest first for a first home on a budget, a rental, or a narrow lot.",
    bestFor: ["First-time buyers", "Rental and farm housing", "Narrow or rural lots", "Fast turnaround"],
    highlights: [
      "14' and 16' wide single-section plans from 2 to 4 bedrooms",
      "Full kitchens with modern cabinetry and appliance packages",
      "Energy-efficient windows and insulation as standard",
      "Reverse-aisle variants of the most popular plans",
    ],
    catalogSeries: ["Prime"],
    code: "HUD",
  },
  {
    slug: "aspire",
    name: "Aspire",
    fullName: "Champion Aspire Series (Dutch Aspire)",
    eyebrow: "Mid-range single & multi-section",
    tagline: "Step-up finishes and sectional layouts without a step-up price.",
    intro:
      "Aspire is Champion's mid-range line, built in Topeka, Indiana. Champion's Dutch brand sells it as \"Dutch Aspire\". It covers single-wides and multi-section homes. Most plans add a bigger kitchen, a real primary suite and the option of drywall walls. It is the widest range we sell, and the right fit for most families.",
    bestFor: ["Growing families", "Land-home buyers", "Buyers who want a sectional at a single-wide budget"],
    highlights: [
      "Single-section and 24'–32' wide multi-section plans",
      "Many plans have a kitchen island, a walk-in pantry and a large primary bath",
      "Drywall walls and a steeper roof are options",
      "Some models let you pick the bedroom count",
    ],
    catalogSeries: ["Aspire"],
    code: "HUD",
  },
  {
    slug: "redman",
    name: "Redman",
    fullName: "Champion Redman Series",
    eyebrow: "Expansive sectional homes, built to order",
    tagline: "Kitchen islands, luxury primary suites and wide-open floor plans.",
    intro:
      "Redman is Champion's largest sectional line, built in Topeka. Think big kitchens with islands, luxury primary suites and wide living areas. Champion's own literature calls the range \"Redman Paramount\", so the Paramount plans live here. We order these homes to spec. Tell us the plan, or the width, size and bedroom count you need. You get Champion's spec sheet and a line-item quote.",
    bestFor: ["Buyers who want the most home per dollar", "Entertaining kitchens", "Acreage and land-home packages", "Anyone who was shopping a Paramount plan"],
    highlights: [
      "28' and 32' wide sectionals up to 2,305 sq ft and 4 bedrooms",
      "Kitchen islands and full-size appliance packages",
      "Luxury primary suites with soaking tubs on select plans",
      "HUD-code, or IRC modular on the plans Champion builds both ways",
      "Built to order: pick the plan, we price it line by line",
    ],
    catalogSeries: ["Redman"],
    code: "HUD or IRC",
    formerly: {
      name: "Paramount",
      note:
        "We no longer publish a Paramount series. Most Paramount plans were the same Champion model as an Aspire plan: the same model number, one home. Those pages now point to the Aspire listing for that home. The home itself has not changed. The plans that only ever came as Paramount are the sectionals listed below. We still order every one of them.",
    },
    quoteOnRequest: [
      { name: "Stafford", detail: "28' wide, 1,813N—2,027 sq ft, 3N—4 bed / 2N—3 bath" },
      { name: "Fenton", detail: "32' wide, 1,820N—2,063 sq ft, 3 bed / 2 bath" },
      { name: "Apollo", detail: "32' wide, 2,184N—2,305 sq ft, 4 bed / 2 bath" },
      { name: "Red Cedar", detail: "32' wide, 2,305 sq ft, 4 bed / 3 bath" },
      { name: "Alberta", detail: "28' wide, 1,707 sq ft, 4 bed / 2 bath" },
      { name: "Myrtle", detail: "28' wide, 1,600 sq ft, 3 bed / 2 bath" },
    ],
  },
  {
    slug: "dutch",
    name: "Dutch",
    fullName: "Champion Dutch Housing",
    eyebrow: "Premium finishes & modular",
    tagline: "Finished drywall, higher roof pitch and IRC modular compliance.",
    intro:
      "Dutch is Champion's premium brand, built in Topeka. Dutch homes come with drywall walls, a steeper roof and house-style trim. Many plans can be built as IRC modular homes. A modular home is appraised and financed like a site-built house. The Dutch Aspire homes we publish are listed below.",
    bestFor: ["Buyers who want a site-built look and appraisal", "Conventional or FHA/VA land-home financing", "Subdivisions that require IRC modular"],
    highlights: [
      "Finished drywall interiors and residential roof pitch",
      "IRC modular option on many plans (permanent foundation, local building code)",
      "Upgraded exteriors, windows and insulation packages",
      "Same factory-direct, line-item pricing as every home we sell",
    ],
    catalogSeries: ["Aspire", "Dutch"],
    slugPrefix: "dutch-",
    code: "HUD or IRC",
  },
];

export function getSeriesHub(slug: string): SeriesHub | undefined {
  return seriesHubs.find((s) => s.slug === slug);
}
