// The homes on sale.
//
// Every model on the master price sheet is on sale — `saleListings` is all of
// them — while `saleHomes` is the curated thirty that get a photo card at the
// top of the page. Both derive their money from the same place:
//
//   MSRP       from the price sheet (src/lib/price-sheet.ts)
//   sale price from that MSRP and the running campaign phase (src/lib/sale.ts)
//
// Nothing about price is stored here. Both figures used to be hand-entered and
// both had gone wrong: sale price was frozen at a previous campaign's discount,
// and MSRP had drifted above the price sheet by $12k on a single wide and up to
// $41k on a double, inflating every "you save $X" computed from it.

import { PRICE_SHEET, msrpFor, type PriceSheetModel } from "./price-sheet";
import { catalogLinkFor } from "./model-catalog";
import { catalogEntryFor, fallbackSeries } from "./catalog-index";

export interface SaleListing {
  /** Champion model number — the key to the price sheet and the catalog. */
  modelNo: string;
  /** Display name. Dutch Aspire rows are named by model number. */
  name: string;
  /** Series as the published catalogue labels it: Aspire, Paramount or Prime. */
  series: string;
  /** "Single Wide" / "Multi-Section". */
  homeType: "Single Wide" | "Multi-Section";
  size: string;
  beds: number;
  baths: number;
  sqft: number;
  /** From the price sheet, via the model number — never typed in by hand. */
  msrp: number;
  /** Catalog page for the home, when the catalog carries it. */
  slug?: string;
  /** Catalog hero image, when there is one. */
  image?: string;
  /** Every published photograph and floor-plan sheet, hero first. */
  gallery: string[];
  /** Champion's PDF brochure, where one is published. */
  brochureUrl?: string;
  /** Champion's dimensioned floor-plan sheet (PDF), where one is published. */
  floorPlanUrl?: string;
  /** 3D walkthrough, where Champion publishes one. */
  virtualTour?: string;
  /**
   * Whether this home is one of the featured thirty. Only featured homes
   * publish a price; everything else is listed as on sale and quoted by
   * phone. See the note above FEATURED.
   */
  featured: boolean;
}

/** A featured home: a listing plus whatever curated copy we have for it. */
export interface SaleHome extends SaleListing {
  /** Stable id used in /homes-on-sale/details/[slug]. */
  id: string;
  brand?: string;
  description: string;
  /** Only present where someone has written real copy for the home. */
  features?: string[];
}

// ── The featured thirty ─────────────────────────────────────────────────────
// Ten from each series the catalogue publishes — Aspire, Paramount and Prime —
// split five single-section and five multi-section.
//
// Each group of five is built as a price ladder rather than a cluster: an entry
// home, two or three mid-range configurations, and the top of that series'
// range, with the bed and bath counts varied so consecutive cards represent a
// real choice rather than the same home at a slightly different length. Only
// models the catalogue has a photograph for are eligible, and reverse-aisle
// variants are excluded — they are the mirror image of a home already shown, so
// featuring both would spend a card on a duplicate.
//
// Order here is the order they appear on the page.
const FEATURED: Array<{ model: string; why: string }> = [
  // ── Aspire — single section ($62,672 – $92,972 across the series) ──
  { model: "1444H11023", why: "Entry point, and the only one-bedroom Aspire single." },
  { model: "1660H32206", why: "Least expensive three-bed, two-bath in the series." },
  { model: "1660H22212", why: "Same 16x60 footprint as the 1660H32206, two beds instead of three." },
  { model: "1668H22259", why: "Two-bed two-bath with 1,031 sq ft — space over bedroom count." },
  { model: "1676H32085", why: "Largest Aspire single at 1,153 sq ft." },
  // ── Aspire — multi-section ($79,923 – $137,400) ──
  { model: "2432H21166", why: "Casper: the least expensive double on the price sheet." },
  { model: "2440H32382", why: "Sheridan: three bedrooms under $100k MSRP." },
  { model: "2848H32170", why: "Brighton at 28x48 — the best-known plan in the series." },
  { model: "2460H42096", why: "Glenrock: the four-bedroom option in this range." },
  { model: "2868H32394", why: "Odyssey at 68 ft, the series flagship." },
  // ── Paramount — single section ($54,138 – $99,410) ──
  { model: "1432H11214", why: "The least expensive new home we sell." },
  { model: "1452H21081", why: "Least expensive two-bedroom." },
  { model: "1656H22208", why: "First two-bath single, and 16 ft wide — the step most buyers want." },
  { model: "1666H32085", why: "Least expensive 16 ft wide three-bed, two-bath." },
  { model: "1676H32091", why: "Top of the single-section range at 1,153 sq ft." },
  // ── Paramount — multi-section ($98,338 – $161,420) ──
  { model: "2840H32024", why: "Monroe: the least expensive 28 ft wide three-bed, under $100k." },
  { model: "2852H42096", why: "Livingston: a fourth bedroom for the same money as the Brighton." },
  { model: "2852H32170", why: "The 52 ft Brighton — the plan people ask for by name." },
  { model: "2864H32060", why: "Fillmore: 1,707 sq ft, the large-family three-bed." },
  { model: "3272H32186", why: "Winston: 2,184 sq ft, the largest home on the price sheet." },
  // ── Prime — single section ($56,384 – $85,227) ──
  { model: "1636H11P01", why: "Pike: Prime's entry home." },
  { model: "1456H22P01", why: "Peak: least expensive two-bed, two-bath in the series." },
  { model: "1656H22P01", why: "Barkley: the same two-bath layout at 16 ft wide, 100 sq ft larger." },
  { model: "1666H32P01", why: "Vertex: least expensive Prime three-bed, two-bath." },
  { model: "1676H32P01", why: "Ridge: largest Prime single section." },
  // ── Prime — multi-section ($93,383 – $131,253) ──
  { model: "2844H32P01", why: "Estill: entry double, three bedrooms under $95k." },
  { model: "2848H32P06", why: "Churchill: the 28x48 three-bed." },
  { model: "2856H32P01", why: "Apex: the volume 28x56 three-bed, two-bath." },
  { model: "2868H42P01", why: "The Grand: four bedrooms at 1,813 sq ft." },
  { model: "2876H53P01", why: "Pinnacle: five bedrooms, three baths, 2,027 sq ft." },
];

/** Fast membership test for toListing — the featured thirty by model number. */
const FEATURED_MODELS = new Set(FEATURED.map((f) => f.model.toUpperCase()));

// Hand-written copy for the homes that have it. Everything else gets a factual
// description built from the price sheet — better a plain, true sentence than
// invented "features" for a home nobody has written about.
const CURATED: Record<string, { image?: string; description?: string; features?: string[] }> = {
  "1656H22208": {
    image: "/images/paramount/1656h22208-opt2.webp",
    description: "Champion 16'x56' 2 Beds 2 baths Single Wide Dutch Aspire",
    features: ["Smart Floor Plan", "Modern Kitchen", "Comfortable Living Area", "Spacious Bedrooms"],
  },
  "1652H21151": {
    image: "/images/paramount/1652h21151-opt2.webp",
    description: "Champion 16'x52' 2 Beds 1 bath Single Wide Dutch Aspire",
    features: ["Efficient Layout", "Modern Kitchen", "Cozy Living Space"],
  },
  "2852H32170": {
    image: "/images/paramount/2852h32170-opt2.webp",
    description: "Champion 28'x52' 3 Beds 2 baths Double Wide",
    features: ["Open Concept", "Master Suite", "Large Kitchen Island"],
  },
  "2864H32060": {
    image: "/images/paramount/2864h32060-opt2.webp",
    description: "Champion 28'x64' 3 Beds 2 baths Double Wide",
    features: ["Spacious Layout", "Walk-in Closets", "Gourmet Kitchen"],
  },
  "2856H32174": {
    image: "/images/paramount/silverton-exterior.webp",
    description: "Champion 28'x56' 3 Beds 2 baths Double Wide",
    features: ["Modern Design", "Vaulted Ceilings", "Large Windows"],
  },
  "2860H32168": {
    image: "/images/paramount/bayport-exterior.webp",
    description: "Champion 28'x60' 3 Beds 2 baths Double Wide",
    features: ["Family Friendly", "Bonus Room", "Luxury Finishes"],
  },
};

// The price sheet lumps Aspire and Paramount together as "Dutch Aspire"; the
// published catalogue tells them apart. See src/lib/catalog-index.ts.
const seriesOf = (m: PriceSheetModel): string =>
  catalogEntryFor(m.model)?.series ?? fallbackSeries(m.family);

const bathLabel = (n: number) => (n === 1 ? "1 bath" : `${n} baths`);

function describe(m: PriceSheetModel): string {
  const kind = m.sectional ? "Multi-Section" : "Single Wide";
  return `Champion ${m.size} ${m.beds} Bed ${bathLabel(m.baths)} ${kind} — ${seriesOf(m)} series`;
}

/** Slug-safe id for the detail page, e.g. "52-brighton-2852h32170". */
function saleHomeId(m: PriceSheetModel): string {
  const model = m.model.toLowerCase();
  const base = m.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return base && base !== model ? `${base}-${model}` : model;
}

function toListing(m: PriceSheetModel): SaleListing | null {
  const msrp = msrpFor(m.model);
  if (msrp === undefined) return null;
  // Two catalogue sources, and both are needed. CATALOG_INDEX is the published
  // catalogue's own model-to-slug mapping and settles the series; the repo's
  // floor-plan files carry the artwork and a handful of pages the index misses
  // (the price sheet's CASEY is catalogued as the Spire, its "The Crown" as the
  // Crown). Prefer the index for the slug, fall back to the repo, and take
  // every picture from the repo.
  const entry = catalogEntryFor(m.model);
  const link = catalogLinkFor(m.model, m.name);
  return {
    modelNo: m.model,
    name: m.name,
    series: seriesOf(m),
    homeType: m.sectional ? "Multi-Section" : "Single Wide",
    size: m.size,
    beds: m.beds,
    baths: m.baths,
    sqft: m.sqft,
    msrp,
    slug: entry?.slug ?? link?.slug,
    image: link?.image || undefined,
    gallery: link?.gallery ?? [],
    brochureUrl: link?.brochureUrl,
    floorPlanUrl: link?.floorPlanUrl,
    virtualTour: link?.virtualTour,
    featured: FEATURED_MODELS.has(m.model.toUpperCase()),
  };
}

/**
 * Every model on the price sheet, on sale. Deduplicated by model number — the
 * sheet lists one home (the Timberlake) twice with identical figures.
 */
export const saleListings: SaleListing[] = (() => {
  const seen = new Set<string>();
  const out: SaleListing[] = [];
  for (const m of PRICE_SHEET) {
    const key = m.model.toUpperCase();
    if (seen.has(key)) continue;
    seen.add(key);
    const listing = toListing(m);
    if (listing) out.push(listing);
  }
  return out;
})();

/**
 * The featured homes, in the order declared above. A model missing from the
 * price sheet is skipped with an error rather than shown at an invented price.
 */
export const saleHomes: SaleHome[] = FEATURED.flatMap(({ model }) => {
  const m = PRICE_SHEET.find((p) => p.model.toUpperCase() === model.toUpperCase());
  if (!m) {
    console.error(`[sale-homes] featured model ${model} is not on the price sheet — skipping.`);
    return [];
  }
  const listing = toListing(m);
  if (!listing) return [];
  const curated = CURATED[m.model.toUpperCase()] ?? {};
  const image = curated.image ?? listing.image;
  // Whichever picture leads the card must also lead the gallery, or tapping it
  // opens the lightbox on a different home's photograph.
  const gallery = image
    ? [image, ...listing.gallery.filter((src) => src !== image)]
    : listing.gallery;
  return [
    {
      ...listing,
      id: saleHomeId(m),
      brand: "Champion Home Builders",
      image,
      gallery,
      description: curated.description ?? describe(m),
      features: curated.features,
    },
  ];
});

export function getSaleHome(id: string): SaleHome | undefined {
  return saleHomes.find((h) => h.id === id);
}

export function formatUsd(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}
