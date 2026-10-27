// What a buyer may pick for the outside of a home, by Champion series and
// section type, for the Design Your Home configurator. Every list here is
// transcribed from a Champion document the site already holds:
//
//   Aspire (Topeka: Aspire, Dutch, Redman) — the 2026 Interior and Exterior
//   Selections board (/options), the "Perfect Options 2026" brochure
//   (public/brochures/perfect-options-2026.pdf), the 2024 Aspire Singles /
//   Sectional Standards sheets, and the "2026 HUD Exterior Upgrades" and
//   "2026 Modular Exterior Upgrades" elevation sheets (literature bucket).
//   Prime (Decatur) — the "2026 PRIME Decatur Decor" board and the "2026 PRIME
//   Decatur Standards" sheet (literature bucket).
//
// Prime is Champion's value series with a fixed feature set: its own five
// siding colours, five shutter colours, black 3-tab shingles, 6-panel doors,
// no-grid windows, and no exterior upgrades (Kyle, 2026-10-27). Nothing here
// carries a price; options are preferences that go into the quote request.
//
// Hex values approximate the printed swatch for the on-screen chip; the
// physical sample governs.

export interface Swatch {
  label: string;
  hex: string;
  /** Champion's board lists it in the upgrade row */
  upgrade?: boolean;
}

export interface Choice {
  id: string;
  label: string;
  /** included on every home of this series */
  standard?: boolean;
  /** one line on what it is, for the picker */
  note?: string;
}

export type SeriesKey = "aspire" | "prime";
export type SectionType = "single" | "multi" | "modular";

export interface ExteriorCatalog {
  series: SeriesKey;
  seriesLabel: string;
  section: SectionType;
  /** the document the lists come from, for the caption */
  source: string;
  siding: Swatch[];
  shingles: Swatch[];
  shutters: Swatch[];
  /** whether lineal trim can replace shutters */
  lineals: boolean;
  /** shake accent colours for the end gables; empty = not offered */
  gableAccents: Swatch[];
  /** front/entry door styles; the standard one first */
  doors: Choice[];
  /** sliding or atrium doors a buyer can add (placement is settled at order) */
  extraDoors: Choice[];
  /** the Black Exterior package: black soffit, fascia, drip edge and lineals,
   *  a Black Craftsman door and non-gridded windows */
  blackPackage: boolean;
  /** dormer options for this section type; empty = none offered */
  dormers: Choice[];
  /** bay, bump-out and eyebrow elevations; empty = none offered */
  elevations: Choice[];
  /** standard windows carry grids (Aspire) or not (Prime) */
  windowGrids: boolean;
  interior: {
    cabinets: Swatch[];
    flooring: Swatch[];
    countertops: Swatch[];
  };
  /** the general upgrade checklist applies (Aspire); Prime has none to offer */
  upgrades: boolean;
}

// ---------- Aspire (Topeka) ----------

const ASPIRE_SIDING: Swatch[] = [
  { label: "Pearl", hex: "#E6E2C3" },
  { label: "Clay", hex: "#8C877C" },
  { label: "Flint", hex: "#8F9694" },
  { label: "White", hex: "#F6F6F2" },
  { label: "Cypress", hex: "#7E8A6B" },
  { label: "Wedgewood", hex: "#566978", upgrade: true },
  { label: "Shadow", hex: "#3D3832", upgrade: true },
  { label: "Brunswick", hex: "#1D2C37", upgrade: true },
  { label: "Dublin", hex: "#3F4B43", upgrade: true },
];
const ASPIRE_SHINGLES: Swatch[] = [
  { label: "Black", hex: "#2A2C2E" },
  { label: "Weatherwood", hex: "#5E574E" },
];
const ASPIRE_SHUTTERS: Swatch[] = [
  { label: "Black", hex: "#151515" },
  { label: "White", hex: "#F2F2EF" },
  { label: "Blue", hex: "#3E5470" },
  { label: "Wine", hex: "#4B1C2B" },
  { label: "Clay", hex: "#A6A68D" },
];
const ASPIRE_GABLE_ACCENTS: Swatch[] = [
  { label: "Dover White", hex: "#ECECE6" },
  { label: "Pewter", hex: "#7B8083" },
  { label: "Cabin Cedar", hex: "#8E7965" },
];
// Perfect Options 2026, "Exterior Doors"; 6-panel is the standard on the
// Singles and Sectional standards sheets
const ASPIRE_DOORS: Choice[] = [
  { id: "6-panel", label: "6-Panel", standard: true },
  { id: "9-lite", label: "9-Lite", note: "nine panes of glass in the top half" },
  { id: "craftsman", label: "Craftsman", note: "three small panes over a shelf and two panels" },
  { id: "craftsman-black", label: "Black Craftsman" },
];
const ASPIRE_EXTRA_DOORS: Choice[] = [
  { id: "patio", label: "Patio (sliding) door" },
  { id: "atrium", label: "Atrium door" },
];
const ASPIRE_INTERIOR = {
  cabinets: [
    { label: "Urban Oak", hex: "#C8A97C" },
    { label: "Destin White", hex: "#ECE9E0" },
    { label: "Boho", hex: "#9A9B86", upgrade: true },
    { label: "Timberwolf", hex: "#7D766F", upgrade: true },
  ],
  flooring: [
    { label: "9656 Natural", hex: "#B89A72" },
    { label: "9661 Thunder", hex: "#6D6A62" },
    { label: "9701 Serenity", hex: "#B5B6A7" },
  ],
  countertops: [
    { label: "Glacier Quartzite", hex: "#A7A29A" },
    { label: "Aluma Marble", hex: "#ECE7DF" },
    { label: "Bello Romano", hex: "#B2A48B" },
    { label: "Lisola", hex: "#463C34" },
    { label: "Pietra Viva", hex: "#C8C6BE" },
    { label: "Roca Bosco", hex: "#8E8C87" },
  ],
};

// 2026 HUD Exterior Upgrades, sheet SGL 1 (single wides)
const ASPIRE_SINGLE_DORMERS: Choice[] = [
  { id: "x1", label: "6' dormer (X1)" },
  { id: "s7", label: "9' dormer with shake (S7)" },
];
const ASPIRE_SINGLE_ELEVATIONS: Choice[] = [
  { id: "s1", label: "Azek trim and corbels (S1)" },
  { id: "s2", label: "Box-out bay (S2)" },
  { id: "s10", label: "Eyebrow (S10)" },
  { id: "s5", label: "Eyebrow with faux bump-out (S5)" },
];
// 2026 HUD Exterior Upgrades, sheet DBL 1 (3/12 double wides)
const ASPIRE_MULTI_DORMERS: Choice[] = [
  { id: "x1", label: "6' dormer (X1)" },
  { id: "d6", label: "6' setback dormer (D6)" },
  { id: "x5", label: "8' drop-eave dormer (X5)" },
  { id: "x6", label: "10' dormer (X6)" },
  { id: "x2", label: "10' drop-eave dormer (X2)" },
  { id: "d16", label: "12' dormer (D16)" },
  { id: "x3", label: "12' drop-eave dormer (X3)" },
  { id: "x4", label: "16' dormer (X4)" },
  { id: "d12", label: "16' setback dormer (D12)" },
  { id: "d10", label: "20' dormer (D10)" },
  { id: "d11", label: "20' eyebrow dormer (D11)" },
];
const ASPIRE_MULTI_ELEVATIONS: Choice[] = [
  { id: "d2", label: "Faux bump-out (D2)" },
  { id: "d4", label: "Box-out bay (D4)" },
  { id: "x16", label: "Box bay with shed roof, gable end (X16)" },
];
// 2026 Modular Exterior Upgrades (Aspire modular)
const ASPIRE_MODULAR_DORMERS: Choice[] = [
  { id: "x1", label: "6' dormer (X1)" },
  { id: "m7", label: "7' dormer, factory installed" },
  { id: "x5", label: "8' drop-eave dormer (X5)" },
  { id: "x6", label: "10' dormer (X6)" },
  { id: "x2", label: "10' drop-eave dormer (X2)" },
  { id: "x3", label: "12' drop-eave dormer (X3)" },
  { id: "m20", label: "20' dormer, site installed" },
];
const ASPIRE_MODULAR_ELEVATIONS: Choice[] = [
  { id: "m7b", label: "7' faux bump-out" },
  { id: "m8b", label: "8' faux bump-out" },
  { id: "m10b", label: "10' faux bump-out" },
];

// ---------- Prime (Decatur) ----------

const PRIME_SIDING: Swatch[] = [
  { label: "Flint", hex: "#DDD9D2" },
  { label: "White", hex: "#FBF9F4" },
  { label: "Cypress", hex: "#B6B3A1" },
  { label: "Light Blue", hex: "#BDC9CE" },
  { label: "Clay", hex: "#C0B7A8" },
];
const PRIME_SHINGLES: Swatch[] = [{ label: "Black", hex: "#121213" }];
const PRIME_SHUTTERS: Swatch[] = [
  { label: "Black", hex: "#3B3B3B" },
  { label: "Blue", hex: "#878CA0" },
  { label: "White", hex: "#FAF9F3" },
  { label: "Clay", hex: "#BEAF9C" },
  { label: "Wine", hex: "#73443C" },
];
const PRIME_DOORS: Choice[] = [{ id: "6-panel", label: "6-Panel", standard: true }];
const PRIME_INTERIOR = {
  cabinets: [
    { label: "Chai Oak", hex: "#B99B7C" },
    { label: "Arctic White", hex: "#F1EEE7" },
  ],
  flooring: [{ label: "AF020 plank", hex: "#9C8468" }],
  countertops: [
    { label: "White Carrara", hex: "#E9E7E3" },
    { label: "Roca Bosco", hex: "#8E8C87" },
  ],
};

/** The series a plan belongs to, for option purposes. Dutch, Redman and the
 *  retired Paramount are Topeka lines on the Aspire boards; Prime is Decatur. */
export function seriesKey(series: string | undefined): SeriesKey {
  return /prime/i.test(series || "") ? "prime" : "aspire";
}

export function sectionType(homeType: string | undefined, widthFt?: number): SectionType {
  const t = homeType || "";
  if (/modular/i.test(t)) return "modular";
  if (/single/i.test(t)) return "single";
  if (/multi|double|triple/i.test(t)) return "multi";
  return (widthFt ?? 24) < 20 ? "single" : "multi";
}

export function exteriorCatalog(series: string | undefined, homeType: string | undefined, widthFt?: number): ExteriorCatalog {
  const key = seriesKey(series);
  const section = sectionType(homeType, widthFt);
  if (key === "prime") {
    return {
      series: "prime",
      seriesLabel: "Prime",
      section,
      source: "Champion's 2026 Prime (Decatur) selections and standards",
      siding: PRIME_SIDING,
      shingles: PRIME_SHINGLES,
      shutters: PRIME_SHUTTERS,
      lineals: false,
      gableAccents: [],
      doors: PRIME_DOORS,
      extraDoors: [],
      blackPackage: false,
      dormers: [],
      elevations: [],
      windowGrids: false,
      interior: PRIME_INTERIOR,
      upgrades: false,
    };
  }
  const dormers = section === "single" ? ASPIRE_SINGLE_DORMERS : section === "modular" ? ASPIRE_MODULAR_DORMERS : ASPIRE_MULTI_DORMERS;
  const elevations = section === "single" ? ASPIRE_SINGLE_ELEVATIONS : section === "modular" ? ASPIRE_MODULAR_ELEVATIONS : ASPIRE_MULTI_ELEVATIONS;
  return {
    series: "aspire",
    seriesLabel: "Aspire",
    section,
    source: "Champion's 2026 Aspire selections board and Perfect Options brochure",
    siding: ASPIRE_SIDING,
    shingles: ASPIRE_SHINGLES,
    shutters: ASPIRE_SHUTTERS,
    lineals: true,
    gableAccents: ASPIRE_GABLE_ACCENTS,
    doors: ASPIRE_DOORS,
    extraDoors: ASPIRE_EXTRA_DOORS,
    blackPackage: true,
    dormers,
    elevations,
    windowGrids: true,
    interior: ASPIRE_INTERIOR,
    upgrades: true,
  };
}

/** The label with "(upgrade)" when the board lists it in the upgrade row. */
export function swatchLabel(s: Swatch): string {
  return s.upgrade ? `${s.label} (upgrade)` : s.label;
}
