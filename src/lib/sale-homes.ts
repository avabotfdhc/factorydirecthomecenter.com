// The homes in the current promotion.
//
// This list used to be copy-pasted between /homes-on-sale and
// /homes-on-sale/details/[slug] — two arrays that had to be edited together or
// a home would appear on the grid and 404 on click. It now lives here once and
// both pages import it.
//
// MSRP is the campaign figure signed off in 25-OFF-MSRP-CAMPAIGN-CHANGELOG.md.
// The sale price is NOT stored here: it is derived from MSRP and whichever
// campaign phase is running (see salePriceFor in src/lib/sale.ts). It used to
// be a hardcoded field, frozen at the August campaign's 25% — which meant a new
// campaign at a different discount would have gone live still showing the old
// prices, with the old savings, under the new percentage.

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
  msrp: number;
  image: string;
  description: string;
  features: string[];
}

export const saleHomes: SaleHome[] = [
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
    msrp: 89900,
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
    msrp: 84900,
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
    msrp: 145000,
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
    msrp: 169000,
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
    msrp: 155000,
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
    msrp: 162000,
    image: "/images/paramount/bayport-exterior.webp",
    description: "Champion 28'x60' 3 Beds 2 baths Double Wide",
    features: ["Family Friendly", "Bonus Room", "Luxury Finishes"],
  },
];

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
