// The exterior a home is drawn in before the buyer has picked anything, and
// the handful of siding colours a page shows as "also available in…".
//
// Used by the plan page teaser (src/components/DesignThisHome.tsx) and the SVG
// image route (/api/plan-elevation/image), so a home looks the same wherever
// it is drawn without the buyer's picks. Every value comes from the series'
// own catalogue (src/lib/exterior-options.ts): the standard door, the first
// shingle, black shutters where the board has them, no upgrades — the picture
// shows what a base home comes with, not an option the quote would add.
//
// Client-safe: imports types and the catalogue only.

import type { ExteriorCatalog, Swatch } from "@/lib/exterior-options";
import type { ExteriorChoices, DoorStyle } from "@/components/HomeElevation";

/** Board labels that read as a plain, unobjectionable starting colour. */
const PREFERRED_FIRST = ["Flint", "Clay", "Pearl", "Cypress"];

/** The siding a home is first drawn in: a mid-tone standard colour if the board has one. */
export function defaultSiding(catalog: ExteriorCatalog): Swatch {
  const standard = catalog.siding.filter((s) => !s.upgrade);
  for (const label of PREFERRED_FIRST) {
    const hit = standard.find((s) => s.label === label);
    if (hit) return hit;
  }
  return standard[0] || catalog.siding[0];
}

/**
 * Up to `n` standard siding colours to show side by side, the default first.
 * Upgrade colours are left out: a teaser should not lead with an option.
 */
export function showcaseSidings(catalog: ExteriorCatalog, n = 4): Swatch[] {
  const first = defaultSiding(catalog);
  const rest = catalog.siding.filter((s) => !s.upgrade && s.label !== first.label);
  return [first, ...rest].slice(0, Math.max(1, n));
}

/** The board's swatch for a label, or null when the board does not carry it. */
export function sidingByLabel(catalog: ExteriorCatalog, label: string | undefined | null): Swatch | null {
  if (!label) return null;
  const want = label.trim().toLowerCase();
  return catalog.siding.find((s) => s.label.toLowerCase() === want) || null;
}

/** Everything the renderer needs for a base home, with an optional siding override. */
export function defaultChoices(catalog: ExteriorCatalog, overrides: { siding?: string | null } = {}): ExteriorChoices {
  const standardDoor = (catalog.doors.find((d) => d.standard) || catalog.doors[0])?.id as DoorStyle | undefined;
  return {
    siding: sidingByLabel(catalog, overrides.siding) || defaultSiding(catalog),
    shingles: catalog.shingles[0],
    trim: "shutters",
    shutter: catalog.shutters.find((s) => s.label === "Black") || catalog.shutters[0],
    gableAccent: null,
    foundation: "block",
    addonPorch: false,
    door: standardDoor || "6-panel",
    blackPackage: false,
    windowGrids: catalog.windowGrids,
    features: {},
    addedDoors: [],
  };
}
