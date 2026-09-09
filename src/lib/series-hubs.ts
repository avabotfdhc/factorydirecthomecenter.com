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
}

export const seriesHubs: SeriesHub[] = [
  {
    slug: "prime",
    name: "Prime",
    fullName: "Champion PRIME Series",
    eyebrow: "Best value single-wides",
    tagline: "Modern kitchens and efficient layouts at the lowest factory-direct price.",
    intro:
      "PRIME is Champion's value line out of the Topeka, Indiana plant: 14- and 16-foot-wide single-section homes with the finishes buyers actually ask for, built on an 8–12 week schedule. It is the series we recommend first for a budget-conscious first home, a rental, or a lot with limited width.",
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
      "Aspire, built in Topeka under Champion's Dutch brand as \"Dutch Aspire\", spans single-wides and multi-section homes with upgraded kitchens, primary suites and optional drywall. It is the broadest series we sell and the sweet spot for most families.",
    bestFor: ["Growing families", "Land-home buyers", "Buyers who want a sectional at a single-wide budget"],
    highlights: [
      "Single-section and 24'–32' wide multi-section plans",
      "Kitchen islands, walk-in pantries and spa-style primary baths on many plans",
      "Optional finished drywall and higher roof pitch",
      "Flexible bedroom counts on select models",
    ],
    catalogSeries: ["Aspire"],
    code: "HUD",
  },
  {
    slug: "paramount",
    name: "Paramount",
    fullName: "Champion Paramount Series",
    eyebrow: "Sectional homes with room to grow",
    tagline: "Spacious multi-section homes with the features of a site-built house.",
    intro:
      "Paramount is our largest multi-section line: open-plan living, kitchen islands, walk-in closets and up to 5 bedrooms, delivered as two or three sections and joined on your foundation.",
    bestFor: ["Larger families", "Replacing an older home on owned land", "Buyers comparing against site-built"],
    highlights: [
      "24' to 32' wide, 1,300 to 2,300+ sq ft plans",
      "Optional layouts for kitchens, baths and porches on most models",
      "Primary suites with dual vanities and walk-in closets",
      "Ready for permanent foundations and land-home financing",
    ],
    catalogSeries: ["Paramount"],
    code: "HUD",
  },
  {
    slug: "redman",
    name: "Redman",
    fullName: "Champion Redman Series",
    eyebrow: "Expansive sectional homes",
    tagline: "Kitchen islands, luxury primary suites and wide-open floor plans.",
    intro:
      "Redman is Champion's expansive sectional line: big kitchens with islands, luxury primary suites and generous living areas. We order Redman plans to spec from the Topeka plant; the catalogue below lists any we currently publish, and every other Redman plan can be quoted on request.",
    bestFor: ["Buyers who want the most home per dollar", "Entertaining kitchens", "Acreage and land-home packages"],
    highlights: [
      "Multi-section plans with open great rooms",
      "Kitchen islands and full-size appliance packages",
      "Luxury primary suites with soaking tubs on select plans",
      "Built to order: pick the plan, we price it line by line",
    ],
    catalogSeries: ["Redman"],
    code: "HUD",
  },
  {
    slug: "dutch",
    name: "Dutch",
    fullName: "Champion Dutch Housing",
    eyebrow: "Premium finishes & modular",
    tagline: "Finished drywall, higher roof pitch and IRC modular compliance.",
    intro:
      "Dutch is Champion's premium brand from the Topeka plant. Dutch-branded homes carry finished drywall, steeper roof pitches and residential trim, and many plans are available as IRC-code modular homes that appraise and finance like a site-built house. The Dutch Aspire homes we publish are listed below.",
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
