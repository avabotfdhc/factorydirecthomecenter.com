// Overstock homes: finished or nearly finished homes at a Champion plant that
// have no buyer, listed on /homes-on-sale/clearance.
//
// These are the one exception to "every home is built to order": the home
// already exists (or is on the line with a completion date), so its options
// are fixed and it can ship as soon as the plant releases it. It is still
// NOT a home on the Auburn lot — say where it is and when it comes off the
// line, never "in stock".
//
// Rules that still apply here:
//   • No dollar figures (prices are hidden site-wide; the page asks for a call
//     or a quote request).
//   • Every spec comes from the factory order for that unit, read line by
//     line. Do not add a feature the order does not list.
//   • Never the name or address of the buyer the home was first ordered for.
//   • Remove the entry the day the home sells. An empty list puts the page
//     back to its "no clearance inventory" state and out of the index.

export interface OverstockHome {
  /** Stable id, used as the anchor on the page. */
  id: string;
  name: string;
  series: string;
  modelNumber: string;
  modelYear: number;
  /** Live floor-plan page for the same model. */
  planSlug: string;
  beds: number;
  baths: number;
  sqft: number;
  /** Box size as Champion's drawing gives it. */
  size: string;
  construction: string;
  /** Plant the home is built at. */
  plant: string;
  /** Day the plant expects the home to come off the line, "YYYY-MM-DD". */
  factoryCompleteDate: string;
  image: string;
  imageAlt: string;
  /** What the picture is, shown under it. */
  imageNote: string;
  /** Champion's plan drawing for the model. */
  floorPlanImage: string;
  floorPlanAlt: string;
  /** Where this home differs from the drawing, shown under it. */
  floorPlanNote: string;
  summary: string;
  /** Every colour and finish chosen on the order. */
  colors: { label: string; value: string }[];
  /** Options added to the order on top of the series standards. */
  options: { name: string; detail: string }[];
  /** What a named package on the order includes, as the order lists it. */
  packageContents: { name: string; items: string[] };
  /** Series standard features, from Champion's standards sheet and the order. */
  standards: { title: string; items: string[] }[];
}

// Source for the Churchill: Champion Decatur quote QT006992 revision 2
// (2026-09-10), model CHPR-2848H32P06, with drawing L-101 and the Prime Plus
// standards sheet dated 6/4/26. Kyle listed it 2026-11-23: the plant finishes
// it December 9, 2026 and the options cannot be changed.
export const OVERSTOCK_HOMES: OverstockHome[] = [
  {
    id: "churchill-2848h32p06",
    name: "Churchill",
    series: "Prime",
    modelNumber: "2848H32P06",
    modelYear: 2027,
    planSlug: "prime-churchill",
    beds: 3,
    baths: 2,
    sqft: 1280,
    size: "26'8\" x 48'",
    construction: "HUD-code multi-section",
    plant: "Champion's Decatur, IN plant",
    factoryCompleteDate: "2026-12-09",
    image: "/images/prime/churchill-rendering.webp",
    imageAlt: "Churchill 3 bedroom 2 bath double wide by Champion Homes, exterior rendering",
    imageNote:
      "Champion's rendering of the Churchill. This home is built with Clay vinyl siding, white shutters and black shingles.",
    floorPlanImage: "/images/prime/churchill-2848h32p06-floorplan.webp",
    floorPlanAlt: "Churchill 2848H32P06 floor plan drawing: 3 bedrooms, 2 baths, 48' x 26'8\"",
    floorPlanNote:
      "Champion's plan drawing for the Churchill. This home differs in two places: the primary bath has a 60\" fiberglass shower where the drawing shows a tub, and both primary bath sinks are included. The washer, dryer and dishwasher shown as optional are not part of this home.",
    summary:
      "A new 2027 Champion Prime double wide that is already on the line with its upgrades built in. One home, one set of options and colors, ready to ship in December.",
    colors: [
      { label: "Siding", value: "Clay vinyl" },
      { label: "Shutters", value: "White" },
      { label: "Corner posts", value: "White" },
      { label: "Shingles", value: "Black 3-tab" },
      { label: "Cabinets", value: "Arctic White shaker" },
      { label: "Countertops", value: "White Carrara" },
      { label: "Appliances", value: "Stainless steel, black range hood" },
      { label: "Interior doors and window jambs", value: "White" },
    ],
    options: [
      {
        name: "Prime Plus package",
        detail: "Champion's upgrade package for the Prime series. Its contents are listed below.",
      },
      { name: "OSB wrap", detail: "OSB sheathing over the exterior walls, under the siding." },
      { name: "16' roof dormer", detail: "The gable over the front of the home, as in the rendering." },
      { name: "Shutoff valves throughout", detail: "A shutoff at each plumbing fixture, plus the whole-house shutoff." },
    ],
    packageContents: {
      name: "Prime Plus package",
      items: [
        "60\" fiberglass shower in the primary bath",
        "Fiberglass tub and shower in the hall bath",
        "Porcelain sinks",
        "Double sinks in the primary bath",
        "Metal faucets throughout",
        "6-panel residential front and rear doors",
        "Shaker cabinets",
        "Cabinet knobs",
        "Furnace door",
        "6\" LED can lights",
        "Full tape and texture ceiling",
        "White MDF window jambs",
        "Stainless steel appliances",
      ],
    },
    standards: [
      {
        title: "Construction",
        items: [
          "2x6 exterior walls, 16\" on center",
          "R-19 wall, R-28 roof and R-11 floor insulation",
          "2x6 floor joists, 16\" on center",
          "19/32\" OSB floor decking",
          "7/16\" OSB roof sheathing",
          "30 lb roof load, rafters 24\" on center",
          "8' sidewalls with flat ceilings",
          "Recessed frame with detachable hitch",
          "Energy Zone 3",
        ],
      },
      {
        title: "Exterior",
        items: [
          "Vinyl siding",
          "Shutters on the door side and hitch end",
          "Vinyl Low-E windows, no grids",
          "3-tab shingles",
          "Ice dam protection",
          "Exterior faucet, receptacle and a light at each door",
        ],
      },
      {
        title: "Kitchen and interior",
        items: [
          "30\" overhead cabinets with shelf",
          "4-drawer bank in the kitchen",
          "Laminate countertops with 4\" backsplash",
          "7\" stainless steel sink",
          "Vinyl-on-gypsum wall panels throughout",
          "ArmorFlor vinyl flooring throughout",
          "30\" 2-panel interior doors",
          "Wire shelf closets",
          "Vanity mirror in both baths",
        ],
      },
      {
        title: "Appliances and mechanical",
        items: [
          "30\" smooth-top electric range",
          "19 cu. ft. refrigerator",
          "30\" vented range hood",
          "Carrier electric furnace",
          "30 gallon electric water heater",
          "200 amp electrical service",
          "Programmable thermostat",
          "Whole-house water shutoff",
        ],
      },
    ],
  },
];

/** "2026-12-09" → "December 9, 2026". Parsed as a plain calendar date. */
export function formatOverstockDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** "2026-12-09" → "December". */
export function overstockMonth(iso: string): string {
  const [y, m] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("en-US", { month: "long", timeZone: "UTC" });
}
