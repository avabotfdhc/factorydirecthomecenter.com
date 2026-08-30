// Repo-published Champion PRIME Series floor plans, merged with the CMS/feed
// catalog in api-content.ts (same pattern as local blog posts) — published
// from the repo because these models were never entered into the CMS.
// Specs (conditioned sq ft, beds/baths, nominal dimensions) come from
// Champion's own PRIME literature/floor-plan drawings (Box: Decatur IN/
// Prime/Literature + Floor Plans) — NOT computed from box dimensions; the
// old price-sheet figures were box areas, which overstate living space.
// Fulton and Gallatin have no Champion literature in the library yet, so
// their sheet figures remain pending factory confirmation. Ridge's drawing
// (1676H32P01) misprints "1533 sq ft" — physically impossible for a
// 15'2" x 76' box; Ridge and Somerset carry 1152 per the dealer's
// confirmed figures. Cards without photos render the placeholder until images are
// added. Dollar amounts stay internal — display pricing goes through the
// same SHOW_PRICES gate as every other home.

import { paramountFloorPlans } from "./paramount-floor-plans";
import { aspireFloorPlans } from "./aspire-floor-plans";

export interface LocalFloorPlan {
  slug: string;
  hidden?: boolean;  // paused: excluded from listings/sitemap until imagery exists
  name: string;
  modelNumber: string;
  sqft: number;
  beds: number;
  baths: number;
  width: string;
  length: string;
  msrp: number;      // internal reference, not displayed while SHOW_PRICES is off
  fdhcPrice: number; // internal reference, not displayed while SHOW_PRICES is off
  homeType?: string; // "Multi-Section" for sectional models; defaults to Single Wide
  series?: string;   // Champion series ("Paramount", "Aspire", ...); defaults to Prime
  brochureUrl?: string; // site-relative PDF from Champion's literature library
  floorPlanUrl?: string; // Champion's dimensioned floor-plan sheet (PDF)
  virtualTour?: string; // Matterport / 3D Vista link from Champion's tour sheets
  image?: string;    // banner/card image (site-relative or S3), from Champion's media library
  gallery?: string[]; // detail-page gallery, banner first
}

export const PRIME_SERIES = "Prime";
export const PRIME_HOME_TYPE = "Single Wide";

/** Series label as Champion styles it in marketing copy ("PRIME", "Paramount"). */
export function seriesLabel(p: LocalFloorPlan): string {
  const s = p.series || PRIME_SERIES;
  return s === PRIME_SERIES ? "PRIME" : s;
}

export function planDescription(p: LocalFloorPlan): string {
  // Prime builds out of Decatur IN; Paramount/Aspire out of Topeka IN.
  const plant = (p.series || PRIME_SERIES) === PRIME_SERIES ? "Decatur" : "Topeka";
  return `The ${p.name} is a ${p.beds}-bedroom, ${p.baths}-bath Champion ${seriesLabel(p)} Series ${(p.homeType || PRIME_HOME_TYPE).toLowerCase()} — ${p.sqft.toLocaleString("en-US")} sq ft of conditioned living space at ${p.width} × ${p.length}. Built at Champion's ${plant}, Indiana plant and sold factory-direct from our Auburn showroom with line-item pricing. Contact us for your factory-direct quote.`;
}

const RAW_FLOOR_PLANS: LocalFloorPlan[] = [
  {
    slug: "prime-peak",
    name: "Peak",
    modelNumber: "1456H22P01",
    sqft: 746,
    beds: 2,
    baths: 2,
    width: "14'",
    length: "56'",
    msrp: 49812,
    fdhcPrice: 44831,
    image: "/images/prime/peak-rendering.webp",
    gallery: ["/images/prime/peak-rendering.webp"],
  },
  {
    slug: "prime-peak-reverse-aisle",
    name: "Peak Reverse Aisle",
    modelNumber: "PEAK-RA",
    sqft: 746,
    beds: 2,
    baths: 2,
    width: "14'",
    length: "56'",
    msrp: 49812,
    fdhcPrice: 44831,
    image: "/images/prime/peak-rendering.webp",
    gallery: ["/images/prime/peak-rendering.webp"],
  },
  {
    slug: "prime-crest",
    name: "Crest",
    modelNumber: "1460H22P01",
    sqft: 800,
    beds: 2,
    baths: 2,
    width: "14'",
    length: "60'",
    msrp: 52962,
    fdhcPrice: 47666,
    image: "/images/prime/crest-floorplan.webp",
    gallery: ["/images/prime/crest-floorplan.webp"],
  },
  {
    slug: "prime-crest-reverse-aisle",
    name: "Crest Reverse Aisle",
    modelNumber: "CREST-RA",
    sqft: 800,
    beds: 2,
    baths: 2,
    width: "14'",
    length: "60'",
    msrp: 52962,
    fdhcPrice: 47666,
    image: "/images/prime/crest-floorplan.webp",
    gallery: ["/images/prime/crest-floorplan.webp"],
  },
  {
    slug: "prime-zenith",
    name: "Zenith",
    modelNumber: "1466H32P01",
    sqft: 880,
    beds: 3,
    baths: 2,
    width: "14'",
    length: "66'",
    msrp: 56637,
    fdhcPrice: 50973,
    image: "/images/prime/zenith-floorplan.webp",
    gallery: ["/images/prime/zenith-floorplan.webp"],
  },
  {
    slug: "prime-zenith-reverse-aisle",
    name: "Zenith Reverse Aisle",
    modelNumber: "ZENITH-RA",
    sqft: 880,
    beds: 3,
    baths: 2,
    width: "14'",
    length: "66'",
    msrp: 56637,
    fdhcPrice: 50973,
    image: "/images/prime/zenith-floorplan.webp",
    gallery: ["/images/prime/zenith-floorplan.webp"],
  },
  {
    slug: "prime-pike",
    name: "Pike",
    modelNumber: "1636H11P01",
    sqft: 546,
    beds: 1,
    baths: 1,
    width: "16'",
    length: "36'",
    msrp: 43867,
    fdhcPrice: 39480,
    image: "/images/prime/pike-rendering.webp",
    gallery: ["/images/prime/pike-rendering.webp"],
  },
  {
    slug: "prime-fulton",
    hidden: true,
    name: "Fulton",
    modelNumber: "FULTON",
    sqft: 768,
    beds: 2,
    baths: 2,
    width: "16'",
    length: "48'",
    msrp: 49642,
    fdhcPrice: 44678,
  },
  {
    slug: "prime-fulton-reverse-aisle",
    hidden: true,
    name: "Fulton Reverse Aisle",
    modelNumber: "FULTON-RA",
    sqft: 768,
    beds: 2,
    baths: 2,
    width: "16'",
    length: "48'",
    msrp: 49642,
    fdhcPrice: 44678,
  },
  {
    slug: "prime-gallatin",
    hidden: true,
    name: "Gallatin",
    modelNumber: "GALLATIN",
    sqft: 832,
    beds: 2,
    baths: 2,
    width: "16'",
    length: "52'",
    msrp: 51292,
    fdhcPrice: 46163,
  },
  {
    slug: "prime-gallatin-reverse-aisle",
    hidden: true,
    name: "Gallatin Reverse Aisle",
    modelNumber: "GALLATIN-RA",
    sqft: 832,
    beds: 2,
    baths: 2,
    width: "16'",
    length: "52'",
    msrp: 51292,
    fdhcPrice: 46163,
  },
  {
    slug: "prime-barkley",
    name: "Barkley",
    modelNumber: "1656H22P01",
    sqft: 849,
    beds: 2,
    baths: 2,
    width: "16'",
    length: "56'",
    msrp: 52898,
    fdhcPrice: 47608,
    image: "/images/prime/barkley-floorplan.webp",
    gallery: ["/images/prime/barkley-floorplan.webp"],
  },
  {
    slug: "prime-barkley-reverse-aisle",
    name: "Barkley Reverse Aisle",
    modelNumber: "BARKLEY-RA",
    sqft: 849,
    beds: 2,
    baths: 2,
    width: "16'",
    length: "56'",
    msrp: 52898,
    fdhcPrice: 47608,
    image: "/images/prime/barkley-floorplan.webp",
    gallery: ["/images/prime/barkley-floorplan.webp"],
  },
  {
    slug: "prime-spire",
    name: "Spire",
    modelNumber: "1660H32P05",
    sqft: 910,
    beds: 3,
    baths: 2,
    width: "16'",
    length: "60'",
    msrp: 54982,
    fdhcPrice: 49484,
    image: "/images/prime/spire-rendering.webp",
    gallery: ["/images/prime/spire-rendering.webp"],
  },
  {
    slug: "prime-spire-reverse-aisle",
    name: "Spire Reverse Aisle",
    modelNumber: "SPIRE-RA",
    sqft: 910,
    beds: 3,
    baths: 2,
    width: "16'",
    length: "60'",
    msrp: 54982,
    fdhcPrice: 49484,
    image: "/images/prime/spire-rendering.webp",
    gallery: ["/images/prime/spire-rendering.webp"],
  },
  {
    slug: "prime-casey",
    hidden: true,
    name: "Casey",
    modelNumber: "CASEY",
    sqft: 910,
    beds: 3,
    baths: 2,
    width: "16'",
    length: "60'",
    msrp: 56432,
    fdhcPrice: 50789,
  },
  {
    slug: "prime-vertex",
    name: "Vertex",
    modelNumber: "1666H32P01",
    sqft: 1001,
    beds: 3,
    baths: 2,
    width: "16'",
    length: "66'",
    msrp: 61157,
    fdhcPrice: 55041,
    virtualTour: "https://my.matterport.com/show/?m=x29bKjegwxW",
    image: "/images/prime/vertex-exterior-2.webp",
    gallery: ["/images/prime/vertex-exterior-2.webp", "/images/prime/vertex-exterior-1.webp", "/images/prime/vertex-living-room.webp", "/images/prime/vertex-kitchen.webp", "/images/prime/vertex-dining.webp", "/images/prime/vertex-primary-bedroom.webp", "/images/prime/vertex-primary-bath.webp", "/images/prime/vertex-bedroom.webp"],
  },
  {
    slug: "prime-vertex-reverse-aisle",
    name: "Vertex Reverse Aisle",
    modelNumber: "VERTEX-RA",
    sqft: 1001,
    beds: 3,
    baths: 2,
    width: "16'",
    length: "66'",
    msrp: 61157,
    fdhcPrice: 55041,
    virtualTour: "https://my.matterport.com/show/?m=x29bKjegwxW",
    image: "/images/prime/vertex-exterior-2.webp",
    gallery: ["/images/prime/vertex-exterior-2.webp", "/images/prime/vertex-exterior-1.webp", "/images/prime/vertex-living-room.webp", "/images/prime/vertex-kitchen.webp", "/images/prime/vertex-dining.webp", "/images/prime/vertex-primary-bedroom.webp", "/images/prime/vertex-primary-bath.webp", "/images/prime/vertex-bedroom.webp"],
  },
  {
    slug: "prime-hickman",
    name: "Hickman",
    modelNumber: "HICKMAN",
    sqft: 1001,
    beds: 3,
    baths: 2,
    width: "16'",
    length: "66'",
    msrp: 64257,
    fdhcPrice: 57831,
    image: "/images/prime/hickman-rendering.webp",
    gallery: ["/images/prime/hickman-rendering.webp"],
  },
  {
    slug: "prime-pendleton",
    name: "Pendleton",
    modelNumber: "1666H32P09",
    sqft: 1001,
    beds: 3,
    baths: 2,
    width: "16'",
    length: "66'",
    msrp: 64257,
    fdhcPrice: 57831,
    image: "/images/prime/pendleton-floorplan.webp",
    gallery: ["/images/prime/pendleton-floorplan.webp"],
  },
  {
    slug: "prime-bardstown",
    hidden: true,
    name: "Bardstown",
    modelNumber: "BARDSTOWN",
    sqft: 1092,
    beds: 3,
    baths: 2,
    width: "16'",
    length: "72'",
    msrp: 62157,
    fdhcPrice: 55941,
  },
  {
    slug: "prime-bardstown-reverse-aisle",
    hidden: true,
    name: "Bardstown Reverse Aisle",
    modelNumber: "BARDSTOWN-RA",
    sqft: 1092,
    beds: 3,
    baths: 2,
    width: "16'",
    length: "72'",
    msrp: 62157,
    fdhcPrice: 55941,
  },
  {
    slug: "prime-ballard",
    hidden: true,
    name: "Ballard",
    modelNumber: "BALLARD",
    sqft: 1092,
    beds: 3,
    baths: 2,
    width: "16'",
    length: "72'",
    msrp: 65257,
    fdhcPrice: 58731,
  },
  {
    slug: "prime-powell",
    name: "Powell",
    modelNumber: "1672H32P09",
    sqft: 1092,
    beds: 3,
    baths: 2,
    width: "16'",
    length: "72'",
    msrp: 65257,
    fdhcPrice: 58731,
    image: "/images/prime/powell-floorplan.webp",
    gallery: ["/images/prime/powell-floorplan.webp"],
  },
  {
    slug: "prime-ridge",
    name: "Ridge",
    modelNumber: "1676H32P01",
    sqft: 1152,
    beds: 3,
    baths: 2,
    width: "16'",
    length: "76'",
    msrp: 65943,
    fdhcPrice: 59349,
    virtualTour: "https://my.matterport.com/show/?m=oGGVXBkLNVC",
    image: "/images/prime/ridge-rendering.webp",
    gallery: ["/images/prime/ridge-rendering.webp", "/images/prime/ridge-living-room.webp", "/images/prime/ridge-kitchen-1.webp", "/images/prime/ridge-kitchen-2.webp", "/images/prime/ridge-dining.webp", "/images/prime/ridge-primary-bedroom.webp", "/images/prime/ridge-primary-bath.webp"],
  },
  {
    slug: "prime-ridge-reverse-aisle",
    name: "Ridge Reverse Aisle",
    modelNumber: "RIDGE-RA",
    sqft: 1152,
    beds: 3,
    baths: 2,
    width: "16'",
    length: "76'",
    msrp: 65943,
    fdhcPrice: 59349,
    virtualTour: "https://my.matterport.com/show/?m=oGGVXBkLNVC",
    image: "/images/prime/ridge-rendering.webp",
    gallery: ["/images/prime/ridge-rendering.webp", "/images/prime/ridge-living-room.webp", "/images/prime/ridge-kitchen-1.webp", "/images/prime/ridge-kitchen-2.webp", "/images/prime/ridge-dining.webp", "/images/prime/ridge-primary-bedroom.webp", "/images/prime/ridge-primary-bath.webp"],
  },
  {
    slug: "prime-monte",
    name: "Monte",
    modelNumber: "MONTE",
    sqft: 1153,
    beds: 3,
    baths: 2,
    width: "16'",
    length: "76'",
    msrp: 67732,
    fdhcPrice: 60959,
    virtualTour: "https://my.matterport.com/show/?m=C98XzbqCou8",
    image: "/images/prime/monte-exterior-1.webp",
    gallery: ["/images/prime/monte-exterior-1.webp", "/images/prime/monte-exterior-2.webp", "/images/prime/monte-living-room.webp", "/images/prime/monte-kitchen.webp", "/images/prime/monte-dining.webp", "/images/prime/monte-primary-bedroom.webp", "/images/prime/monte-primary-bath.webp", "/images/prime/monte-bedroom.webp"],
  },
  {
    slug: "prime-monte-reverse-aisle",
    name: "Monte Reverse Aisle",
    modelNumber: "MONTE-RA",
    sqft: 1153,
    beds: 3,
    baths: 2,
    width: "16'",
    length: "76'",
    msrp: 67732,
    fdhcPrice: 60959,
    virtualTour: "https://my.matterport.com/show/?m=C98XzbqCou8",
    image: "/images/prime/monte-exterior-1.webp",
    gallery: ["/images/prime/monte-exterior-1.webp", "/images/prime/monte-exterior-2.webp", "/images/prime/monte-living-room.webp", "/images/prime/monte-kitchen.webp", "/images/prime/monte-dining.webp", "/images/prime/monte-primary-bedroom.webp", "/images/prime/monte-primary-bath.webp", "/images/prime/monte-bedroom.webp"],
  },
  {
    slug: "prime-somerset",
    hidden: true,
    name: "Somerset",
    modelNumber: "SOMERSET",
    sqft: 1152,
    beds: 3,
    baths: 2,
    width: "16'",
    length: "76'",
    msrp: 68232,
    fdhcPrice: 61409,
  },
  {
    slug: "prime-floyd",
    name: "Floyd",
    modelNumber: "1676H32P09",
    sqft: 1153,
    beds: 3,
    baths: 2,
    width: "16'",
    length: "76'",
    msrp: 68232,
    fdhcPrice: 61409,
    image: "/images/prime/floyd-rendering.webp",
    gallery: ["/images/prime/floyd-rendering.webp"],
  },
  {
    slug: "prime-plateau",
    name: "Plateau",
    modelNumber: "2448H32P02",
    sqft: 1120,
    beds: 3,
    baths: 2,
    width: "24'",
    length: "48'",
    homeType: "Multi-Section",
    msrp: 77030,
    fdhcPrice: 69327,
    image: "/images/prime/plateau-floorplan.webp",
    gallery: ["/images/prime/plateau-floorplan.webp"],
  },
  {
    slug: "prime-horizon",
    name: "Horizon",
    // 2026 plan: Champion moved the Horizon to a 24' x 56' box (2456H32P02,
    // 1,307 sq ft) — the 2025 28' x 48' drawing stays in the gallery.
    modelNumber: "2456H32P02",
    sqft: 1307,
    beds: 3,
    baths: 2,
    width: "24'",
    length: "56'",
    homeType: "Multi-Section",
    msrp: 82207,
    fdhcPrice: 73986,
    image: "/images/prime/horizon-2026-floorplan.webp",
    gallery: ["/images/prime/horizon-2026-floorplan.webp", "/images/prime/horizon-floorplan.webp"],
  },
  {
    slug: "prime-estill",
    name: "Estill",
    modelNumber: "2844H32P01",
    sqft: 1173,
    beds: 3,
    baths: 2,
    width: "28'",
    length: "44'",
    homeType: "Multi-Section",
    msrp: 75419,
    fdhcPrice: 67877,
    image: "/images/prime/estill-floorplan.webp",
    gallery: ["/images/prime/estill-floorplan.webp"],
  },
  {
    slug: "prime-churchill",
    name: "Churchill",
    modelNumber: "2848H32P06",
    sqft: 1284,
    beds: 3,
    baths: 2,
    width: "28'",
    length: "48'",
    homeType: "Multi-Section",
    msrp: 79107,
    fdhcPrice: 71196,
    image: "/images/prime/churchill-rendering.webp",
    gallery: ["/images/prime/churchill-rendering.webp"],
    virtualTour: "https://storage.net-fs.com/hosting/8433117/3/",
  },
  {
    slug: "prime-mercer",
    name: "Mercer",
    modelNumber: "2852H32P01",
    sqft: 1387,
    beds: 3,
    baths: 2,
    width: "28'",
    length: "52'",
    homeType: "Multi-Section",
    msrp: 81442,
    fdhcPrice: 73298,
    image: "/images/prime/mercer-rendering.webp",
    gallery: ["/images/prime/mercer-rendering.webp"],
  },
  {
    slug: "prime-apex",
    name: "Apex",
    modelNumber: "2856H32P01",
    sqft: 1493,
    beds: 3,
    baths: 2,
    width: "28'",
    length: "56'",
    homeType: "Multi-Section",
    msrp: 83862,
    fdhcPrice: 75476,
    image: "/images/prime/apex-rendering.webp",
    gallery: ["/images/prime/apex-rendering.webp"],
    virtualTour: "https://storage.net-fs.com/hosting/8433117/4/",
  },
  {
    slug: "prime-crown",
    name: "Crown",
    modelNumber: "2856H42P01",
    sqft: 1493,
    beds: 4,
    baths: 2,
    width: "28'",
    length: "56'",
    homeType: "Multi-Section",
    msrp: 85212,
    fdhcPrice: 76691,
    image: "/images/prime/crown-rendering.webp",
    gallery: ["/images/prime/crown-rendering.webp"],
  },
  {
    slug: "prime-the-grand",
    name: "The Grand",
    modelNumber: "2868H42P01",
    sqft: 1813,
    beds: 4,
    baths: 2,
    width: "28'",
    length: "68'",
    homeType: "Multi-Section",
    msrp: 99532,
    fdhcPrice: 89579,
    virtualTour: "https://my.matterport.com/show/?m=mDLEKL5MrLc",
    image: "/images/prime/the-grand-exterior-1.webp",
    gallery: ["/images/prime/the-grand-exterior-1.webp", "/images/prime/the-grand-elevation.webp", "/images/prime/the-grand-exterior-2.webp", "/images/prime/the-grand-living-room.webp", "/images/prime/the-grand-kitchen.webp", "/images/prime/the-grand-dining.webp", "/images/prime/the-grand-family-room.webp", "/images/prime/the-grand-primary-bedroom.webp", "/images/prime/the-grand-primary-bath.webp"],
  },
  {
    slug: "prime-pinnacle",
    name: "Pinnacle",
    modelNumber: "2876H53P01",
    sqft: 2027,
    beds: 5,
    baths: 3,
    width: "28'",
    length: "76'",
    homeType: "Multi-Section",
    msrp: 108442,
    fdhcPrice: 97598,
    image: "/images/prime/pinnacle-rendering.webp",
    gallery: ["/images/prime/pinnacle-rendering.webp"],
    virtualTour: "https://storage.net-fs.com/hosting/8433117/7/",
  },

  // ——— New 2026 Prime models (Decatur plant) ———
  // From Champion's "2026 Prime - Decatur" floor-plan folders; specs from each
  // model's 2026 SALES sheet. Not on the dealer price sheet yet (internal 0).
  {
    slug: "prime-spire-2-bedroom",
    name: "Spire 2-Bedroom",
    modelNumber: "1660H22P01",
    sqft: 910,
    beds: 2,
    baths: 2,
    width: "16'",
    length: "60'",
    msrp: 0,
    fdhcPrice: 0,
    image: "/images/prime/spire-2br-floorplan.webp",
    gallery: ["/images/prime/spire-2br-floorplan.webp"],
  },
  {
    slug: "prime-spire-2-bedroom-ii",
    name: "Spire 2-Bedroom II",
    modelNumber: "1660H22P02",
    sqft: 910,
    beds: 2,
    baths: 2,
    width: "16'",
    length: "60'",
    msrp: 0,
    fdhcPrice: 0,
    image: "/images/prime/spire-2br-b-floorplan.webp",
    gallery: ["/images/prime/spire-2br-b-floorplan.webp"],
  },
  {
    slug: "prime-richmond",
    name: "Richmond",
    modelNumber: "2856H42P01",
    sqft: 1493,
    beds: 4,
    baths: 2,
    width: "28'",
    length: "56'",
    msrp: 0,
    fdhcPrice: 0,
    homeType: "Multi-Section",
    image: "/images/prime/richmond-floorplan.webp",
    gallery: ["/images/prime/richmond-floorplan.webp"],
  },

  // ——— Aspire models missing from the CMS ———
  // Odyssey 32' — the only current 32-wide Aspire model the CMS never got.
  // Specs from Champion's 2026 SALES sheet (112APB-3260H32394); tour from the
  // Topeka Matterport sheet (exact model match).
  {
    slug: "dutch-aspire-odyssey-3260h32394",
    name: "Odyssey",
    modelNumber: "3260H32394",
    sqft: 1820,
    beds: 3,
    baths: 2,
    width: "32'",
    length: "60'",
    msrp: 0,
    fdhcPrice: 0,
    homeType: "Multi-Section",
    series: "Aspire",
    brochureUrl: "/brochures/odyssey-by-champion.pdf",
    virtualTour: "https://my.matterport.com/show/?m=kHVGAug33h3",
    image: "/images/paramount/odyssey-photo-exterior.webp",
    gallery: [
      "/images/paramount/odyssey-photo-exterior.webp",
      "/images/paramount/3260h32394.webp",
      "/images/paramount/odyssey-photo-kitchen.webp",
      "/images/paramount/odyssey-photo-living.webp",
      "/images/paramount/odyssey-photo-dining.webp",
      "/images/paramount/odyssey-photo-primary-bedroom.webp",
      "/images/paramount/odyssey-photo-primary-bath.webp",
      "/images/paramount/odyssey-photo-bedroom.webp",
      "/images/paramount/odyssey-photo-entry.webp",
      "/images/paramount/odyssey-photo-exterior-2.webp",
    ],
  },

  // ——— Remaining 2026 Aspire lineup (repo-published; see aspire-floor-plans.ts) ———
  ...aspireFloorPlans,

  // ——— Full 2026 Paramount Series lineup (repo-published) ———
  ...paramountFloorPlans,
];

// ——— Floor-plan drawings shared across listings of the same model ————————
//
// Champion publishes one drawing per model number, but the same model is often
// listed twice — once as Aspire and once as Paramount — and only one of the two
// listings carries the drawing. A buyer landing on the other one could see
// photographs of the home and never its layout. 41 of the 193 published plans
// were in exactly that state.
//
// So a plan with no drawing of its own inherits the drawing (and the brochure)
// from another listing of the same model. Only the plan drawing and the
// brochure travel: photographs stay with the listing that published them,
// because two listings of one model can be photographed in different decor.
//
// This runs over the data rather than being written into it so a plan added
// later inherits automatically, and so there is one copy of each asset path.

/** A Champion plan drawing, as opposed to a photograph of the finished home. */
function isPlanDrawing(src: string): boolean {
  return /floorplan|floor-plan|\/banner\//i.test(src);
}

const planDrawings = (p: LocalFloorPlan): string[] =>
  [p.image, ...(p.gallery ?? [])].filter((s): s is string => Boolean(s)).filter(isPlanDrawing);

const normalizePlanName = (s: string) => String(s || "").toLowerCase().replace(/[^a-z0-9]/g, "");

function withInheritedDrawings(plans: LocalFloorPlan[]): LocalFloorPlan[] {
  const byModel = new Map<string, LocalFloorPlan[]>();
  const byName = new Map<string, LocalFloorPlan[]>();
  for (const p of plans) {
    if (p.modelNumber) {
      const k = p.modelNumber.toUpperCase();
      byModel.set(k, [...(byModel.get(k) ?? []), p]);
    }
    const n = normalizePlanName(p.name);
    if (n) byName.set(n, [...(byName.get(n) ?? []), p]);
  }

  return plans.map((p) => {
    if (planDrawings(p).length > 0 && p.brochureUrl && p.floorPlanUrl) return p;

    // Model number first — it is the thing Champion draws against. Name is the
    // fallback for Prime, whose listings record plant codes inconsistently.
    const siblings = [
      ...(p.modelNumber ? (byModel.get(p.modelNumber.toUpperCase()) ?? []) : []),
      ...(byName.get(normalizePlanName(p.name)) ?? []),
    ].filter((q) => q !== p);

    const drawings =
      planDrawings(p).length > 0
        ? []
        : siblings.flatMap(planDrawings).filter((src, i, a) => a.indexOf(src) === i);
    const brochureUrl = p.brochureUrl ?? siblings.find((q) => q.brochureUrl)?.brochureUrl;
    const floorPlanUrl = p.floorPlanUrl ?? siblings.find((q) => q.floorPlanUrl)?.floorPlanUrl;

    if (drawings.length === 0 && brochureUrl === p.brochureUrl && floorPlanUrl === p.floorPlanUrl) {
      return p;
    }

    const gallery = [...(p.gallery ?? [])];
    for (const src of drawings) if (!gallery.includes(src)) gallery.push(src);
    return { ...p, gallery, brochureUrl, floorPlanUrl };
  });
}

// ——— Champion floor-plan sheets held in the repo ————————————————————————
//
// public/images/floor-plans/pdfs/ carries nine dimensioned floor-plan sheets
// and their matching sales sheets, and not one of them was referenced from
// anywhere — a buyer could not reach a single one. The filenames are unreliable
// (brighton-2856-floor-plan.pdf is actually the Lincoln), so each is keyed by
// the Champion model number printed inside the PDF itself rather than by its
// name. Two more sheets in that folder, 3268M32052 and 3276M42179, are the
// modular versions of the Madison and Verona, and neither has a catalogue page
// to attach to yet.
const FLOOR_PLAN_SHEETS: Record<string, { floorPlan: string; sales: string }> = {
  "1456H21023": { floorPlan: "/images/floor-plans/pdfs/aspire-1456-floor-plan.pdf", sales: "/images/floor-plans/pdfs/aspire-1456-sales.pdf" },
  "1460H21216": { floorPlan: "/images/floor-plans/pdfs/dutch-1460-floor-plan.pdf", sales: "/images/floor-plans/pdfs/dutch-1460-sales.pdf" },
  "1672H32087": { floorPlan: "/images/floor-plans/pdfs/aspire-1672-floor-plan.pdf", sales: "/images/floor-plans/pdfs/aspire-1672-sales.pdf" },
  "2852H32170": { floorPlan: "/images/floor-plans/pdfs/brighton-2852-floor-plan.pdf", sales: "/images/floor-plans/pdfs/brighton-2852-sales.pdf" },
  "2856H32171": { floorPlan: "/images/floor-plans/pdfs/brighton-2856-floor-plan.pdf", sales: "/images/floor-plans/pdfs/brighton-2856-sales.pdf" },
  "2860H32047": { floorPlan: "/images/floor-plans/pdfs/aspire-modular-2860-floor-plan.pdf", sales: "/images/floor-plans/pdfs/aspire-modular-2860-sales.pdf" },
  "2876H42180": { floorPlan: "/images/floor-plans/pdfs/silverton-2876-floor-plan.pdf", sales: "/images/floor-plans/pdfs/silverton-2876-sales.pdf" },
};

// ——— Photograph sets held in the repo but attached to nothing ——————————
//
// public/images/floor-plans/<home>/ holds three sets of interior and exterior
// photographs, 34 in all, that no listing referenced. The folder names follow
// the same convention as the floor-plan sheets beside them, and each sheet
// names its Champion model number inside the PDF, so the folders resolve to
// real models rather than to a guess from the folder name. Exteriors lead, so
// a gallery opens on the home rather than on a bathroom.
const PHOTO_SETS: Record<string, string[]> = {
  "1672H32087": [
    "/images/floor-plans/aspire-1672/exterior-1.jpg",
    "/images/floor-plans/aspire-1672/exterior-2.jpg",
    "/images/floor-plans/aspire-1672/exterior-3.jpg",
    "/images/floor-plans/aspire-1672/bath.jpg",
    "/images/floor-plans/aspire-1672/dining-kitchen.jpg",
    "/images/floor-plans/aspire-1672/kitchen-1.jpg",
    "/images/floor-plans/aspire-1672/kitchen-2.jpg",
    "/images/floor-plans/aspire-1672/living-room-1.jpg",
    "/images/floor-plans/aspire-1672/living-room-2.jpg",
    "/images/floor-plans/aspire-1672/primary-bath-1.jpg",
    "/images/floor-plans/aspire-1672/primary-bedroom-1.jpg",
    "/images/floor-plans/aspire-1672/primary-bedroom-2.jpg",
  ],
  "2860H32047": [
    "/images/floor-plans/aspire-modular-2860/exterior-1.jpg",
    "/images/floor-plans/aspire-modular-2860/exterior-2.jpg",
    "/images/floor-plans/aspire-modular-2860/exterior-3.jpg",
    "/images/floor-plans/aspire-modular-2860/dining-area.jpg",
    "/images/floor-plans/aspire-modular-2860/entry.jpg",
    "/images/floor-plans/aspire-modular-2860/kitchen-1.jpg",
    "/images/floor-plans/aspire-modular-2860/kitchen-2.jpg",
    "/images/floor-plans/aspire-modular-2860/living-room-1.jpg",
    "/images/floor-plans/aspire-modular-2860/living-room-2.jpg",
    "/images/floor-plans/aspire-modular-2860/primary-bath-1.jpg",
    "/images/floor-plans/aspire-modular-2860/primary-bedroom-1.jpg",
  ],
  "2856H32171": [
    "/images/floor-plans/brighton-2856/exterior-1.jpg",
    "/images/floor-plans/brighton-2856/exterior-2.jpg",
    "/images/floor-plans/brighton-2856/exterior-3.jpg",
    "/images/floor-plans/brighton-2856/dining-room.jpg",
    "/images/floor-plans/brighton-2856/entry.jpg",
    "/images/floor-plans/brighton-2856/kitchen-1.jpg",
    "/images/floor-plans/brighton-2856/kitchen-2.jpg",
    "/images/floor-plans/brighton-2856/living-room-1.jpg",
    "/images/floor-plans/brighton-2856/living-room-2.jpg",
    "/images/floor-plans/brighton-2856/primary-bath-1.jpg",
    "/images/floor-plans/brighton-2856/primary-bedroom-1.jpg",
  ],
};

function withPhotoSets(plans: LocalFloorPlan[]): LocalFloorPlan[] {
  return plans.map((p) => {
    const photos = PHOTO_SETS[(p.modelNumber || "").toUpperCase()];
    if (!photos) return p;
    const gallery = [...(p.gallery ?? [])];
    for (const src of photos) if (!gallery.includes(src)) gallery.push(src);
    return { ...p, gallery };
  });
}

function withFloorPlanSheets(plans: LocalFloorPlan[]): LocalFloorPlan[] {
  return plans.map((p) => {
    const sheet = FLOOR_PLAN_SHEETS[(p.modelNumber || "").toUpperCase()];
    if (!sheet) return p;
    return {
      ...p,
      floorPlanUrl: p.floorPlanUrl ?? sheet.floorPlan,
      // The sales sheet is the model's spec brochure; it only fills a gap.
      brochureUrl: p.brochureUrl ?? sheet.sales,
    };
  });
}

/**
 * The published catalogue, with every listing carrying its model's floor-plan
 * drawing and sheet wherever one exists anywhere in the catalogue.
 */
export const localFloorPlans: LocalFloorPlan[] = withInheritedDrawings(
  withPhotoSets(withFloorPlanSheets(RAW_FLOOR_PLANS)),
);
