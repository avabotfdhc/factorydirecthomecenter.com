// Server-side lookup of a plan's exterior elevation (see plan-elevation-types.ts).
//
// plan-elevations.json is ~80 KB and is keyed by Champion model number, which
// the HUD/modular twins (2852H32103 / 2852M32103) and the Aspire/Paramount
// twins share, so one entry serves every page that describes the same box.
// Topeka plans come from their L-101 sales sheets, Prime (Decatur) plans from
// their LIT-1 colour floor plans, and Prime's Reverse Aisle plans carry their
// base plan's drawing with `basedOn` set (scripts/elevations/README.md).
// Import this only from server code — the /api/plan-elevation route hands the
// browser one plan at a time.
import data from "./plan-elevations.json";
import {
  representativeElevation,
  sizeFromModel,
  type PlanElevation,
} from "./plan-elevation-types";

// The JSON's tuples type as loose arrays; the extractor guarantees the shape.
const SHEETS = data as unknown as Record<string, Omit<PlanElevation, "model">>;

/** How many plans have an elevation read from their sales sheet. */
export const SHEET_ELEVATION_COUNT = Object.keys(SHEETS).length;

/** The elevation read from this model's sales sheet, or null when there is none. */
export function sheetElevation(model: string | undefined): PlanElevation | null {
  const key = String(model || "").toUpperCase().trim();
  if (!key) return null;
  const hit = SHEETS[key];
  if (hit) return { ...hit, model: key };
  // the same box under the other construction code: 2852H… ↔ 2852M…
  const twin = key.replace(/^(\d{4})([HM])/i, (_, size, code) => `${size}${code.toUpperCase() === "H" ? "M" : "H"}`);
  if (twin !== key && SHEETS[twin]) return { ...SHEETS[twin], model: twin };
  return null;
}

/**
 * The elevation to draw for a plan: the sheet's when we have it, else a
 * representative layout built from the plan's size, flagged as such.
 */
export function planElevation(plan: {
  modelNumber?: string;
  lengthFt?: number;
  widthFt?: number;
  beds?: number;
}): PlanElevation | null {
  const fromSheet = sheetElevation(plan.modelNumber);
  if (fromSheet) return fromSheet;
  const guess = sizeFromModel(plan.modelNumber);
  const lengthFt = plan.lengthFt || guess.lengthFt;
  const widthFt = plan.widthFt || guess.widthFt;
  if (!lengthFt || !widthFt) return null;
  return representativeElevation({ lengthFt, widthFt, beds: plan.beds }, plan.modelNumber);
}
