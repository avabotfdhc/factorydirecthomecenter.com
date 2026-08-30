// The homes in the current promotion.
//
// This list used to be copy-pasted between /homes-on-sale and
// /homes-on-sale/details/[slug] — two arrays that had to be edited together or
// a home would appear on the grid and 404 on click. It now lives here once and
// both pages import it.
//
// Nothing about price is stored here any more. Each home names a Champion model
// number, and both numbers on the card are derived:
//
//   MSRP       from the master price sheet (src/lib/price-sheet.ts)
//   sale price from that MSRP and the running campaign phase (src/lib/sale.ts)
//
// Both used to be hand-entered, and both had gone wrong. `salePrice` was frozen
// at the August campaign's 25%, so a new campaign would have shown old prices
// under a new percentage. `msrp` had drifted above the price sheet by $12k on a
// single wide and up to $41k on a double, which inflated every "you save $X"
// figure computed from it.

import { msrpFor } from "./price-sheet";

export interface SaleHome {
  id: string;
  name: string;
  series: string;
  brand?: string;
  modelNo: string;
  sqft: number;
  beds: number;
  baths: number;
  /** Width in feet — used by the grid's size filter and shown on the card. */
  widthFt: number;
  /** Length in feet. */
  lengthFt: number;
  /** From the price sheet, via the model number — never typed in by hand. */
  msrp: number;
  image: string;
  description: string;
  features: string[];
}

const saleHomeDetails: Omit<SaleHome, "msrp">[] = [
  {
    id: "dutch-aspire-1656h22208",
    name: "Dutch Aspire 1656H22208",
    series: "Dutch Aspire",
    modelNo: "1656H22208",
    sqft: 849,
    beds: 2,
    baths: 2,
    widthFt: 16,
    lengthFt: 56,
    image: "/images/paramount/1656h22208-opt2.webp",
    description: "Champion 16'x56' 2 Beds 2 baths Single Wide Dutch Aspire",
    features: ["Smart Floor Plan", "Modern Kitchen", "Comfortable Living Area", "Spacious Bedrooms"],
  },
  {
    id: "dutch-aspire-1652h21151",
    name: "Dutch Aspire 1652H21151",
    series: "Dutch Aspire",
    modelNo: "1652H21151",
    sqft: 789,
    beds: 2,
    baths: 1,
    widthFt: 16,
    lengthFt: 52,
    image: "/images/paramount/1652h21151-opt2.webp",
    description: "Champion 16'x52' 2 Beds 1 bath Single Wide Dutch Aspire",
    features: ["Efficient Layout", "Modern Kitchen", "Cozy Living Space"],
  },
  {
    id: "brighton-2852",
    name: "Brighton",
    series: "Aspire",
    brand: "Champion Home Builders",
    modelNo: "2852H32170",
    sqft: 1386,
    beds: 3,
    baths: 2,
    widthFt: 28,
    lengthFt: 52,
    image: "/images/paramount/2852h32170-opt2.webp",
    description: "Champion 28'x52' 3 Beds 2 baths Double Wide",
    features: ["Open Concept", "Master Suite", "Large Kitchen Island"],
  },
  {
    id: "fillmore-2864",
    name: "Fillmore",
    series: "Aspire",
    brand: "Champion Home Builders",
    modelNo: "2864H32060",
    sqft: 1707,
    beds: 3,
    baths: 2,
    widthFt: 28,
    lengthFt: 64,
    image: "/images/paramount/2864h32060-opt2.webp",
    description: "Champion 28'x64' 3 Beds 2 baths Double Wide",
    features: ["Spacious Layout", "Walk-in Closets", "Gourmet Kitchen"],
  },
  {
    id: "silverton-2856",
    name: "Silverton",
    series: "Aspire",
    brand: "Champion Home Builders",
    modelNo: "2856H32174",
    sqft: 1493,
    beds: 3,
    baths: 2,
    widthFt: 28,
    lengthFt: 56,
    image: "/images/paramount/silverton-exterior.webp",
    description: "Champion 28'x56' 3 Beds 2 baths Double Wide",
    features: ["Modern Design", "Vaulted Ceilings", "Large Windows"],
  },
  {
    id: "bay-port-2860",
    name: "Bay Port",
    series: "Aspire",
    brand: "Champion Home Builders",
    modelNo: "2860H32168",
    sqft: 1600,
    beds: 3,
    baths: 2,
    widthFt: 28,
    lengthFt: 60,
    image: "/images/paramount/bayport-exterior.webp",
    description: "Champion 28'x60' 3 Beds 2 baths Double Wide",
    features: ["Family Friendly", "Bonus Room", "Luxury Finishes"],
  },
];

/**
 * The sale homes, with MSRP resolved from the master price sheet. A model the
 * sheet does not carry is dropped rather than shown at an invented price — a
 * missing card is recoverable, a wrong price on a discount claim is not.
 */
export const saleHomes: SaleHome[] = saleHomeDetails.flatMap((home) => {
  const msrp = msrpFor(home.modelNo);
  if (msrp === undefined) {
    console.error(`[sale-homes] ${home.modelNo} is not in the price sheet — omitting from the sale.`);
    return [];
  }
  return [{ ...home, msrp }];
});

export function getSaleHome(id: string): SaleHome | undefined {
  return saleHomes.find((h) => h.id === id);
}

/** "Single Wide" / "Multi-Section" — derived from width, used by the grid filter. */
export function saleHomeType(home: SaleHome): "Single Wide" | "Multi-Section" {
  return home.widthFt <= 18 ? "Single Wide" : "Multi-Section";
}

export function formatUsd(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}
