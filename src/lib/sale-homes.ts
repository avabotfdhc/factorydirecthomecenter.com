// The homes on sale.
//
// Every model on the master price sheet is on sale — `saleListings` is the full
// 148 — while `saleHomes` is the curated subset that gets a photo card at the
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

export interface SaleListing {
  /** Champion model number — the key to the price sheet and the catalog. */
  modelNo: string;
  /** Display name. Dutch Aspire rows are named by model number. */
  name: string;
  /** "Dutch Aspire" / "Prime". */
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

// ── The featured twenty ─────────────────────────────────────────────────────
// Five singles and five multi-section homes from each series. Chosen so that
// each group is a price ladder rather than a cluster — an entry home, a couple
// of mid-range configurations, and the top of the range — with distinct bed and
// bath counts, and only models the catalog has a photo for. Reverse-aisle
// variants are left out of the featured set: they are the mirror image of a
// home already shown, so featuring both would spend a card on a duplicate.
//
// Order here is the order they appear on the page.
const FEATURED: Array<{ model: string; why: string }> = [
  // Dutch Aspire — single section
  { model: "1432H11214", why: "Entry point: the least expensive new home on the lot." },
  { model: "1652H21151", why: "Two bedrooms at 16 ft wide, still under the mid-range." },
  { model: "1656H22208", why: "First two-bath single — the step most buyers actually want." },
  { model: "1660H32206", why: "Least expensive three-bed, two-bath single section." },
  { model: "1676H32085", why: "Largest practical single at 1,153 sq ft." },
  // Prime — single section
  { model: "1636H11P01", why: "Prime's entry home." },
  { model: "1456H22P01", why: "Least expensive two-bed, two-bath in the series." },
  { model: "1656H22P01", why: "Same two-bath layout at 16 ft wide, 100 sq ft larger." },
  { model: "1666H32P01", why: "Least expensive Prime three-bed, two-bath." },
  { model: "1676H32P01", why: "Largest Prime single section." },
  // Prime — multi-section
  { model: "2844H32P01", why: "Entry double: three bedrooms under $95k MSRP." },
  { model: "2848H32P06", why: "The 28x48 three-bed, a common first double." },
  { model: "2856H32P01", why: "The volume 28x56 three-bed, two-bath." },
  { model: "2856H42P01", why: "Same footprint as the Apex with a fourth bedroom." },
  { model: "2876H53P01", why: "Flagship: five bedrooms, three baths, 2,027 sq ft." },
  // Dutch Aspire — multi-section
  { model: "2432H21166", why: "Least expensive double on the price sheet." },
  { model: "2840H32024", why: "Least expensive 28 ft wide three-bed, two-bath." },
  { model: "2852H32170", why: "The Brighton — the best-known plan in the series." },
  { model: "2864H32060", why: "Fillmore: 1,707 sq ft, the large-family three-bed." },
  { model: "3272H32186", why: "Top of the range at 2,184 sq ft." },
];

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

const seriesOf = (m: PriceSheetModel): string =>
  m.family.startsWith("Prime") ? "Prime" : "Dutch Aspire";

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
    slug: link?.slug,
    image: link?.image || undefined,
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
  return [
    {
      ...listing,
      id: saleHomeId(m),
      brand: "Champion Home Builders",
      image: curated.image ?? listing.image,
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
