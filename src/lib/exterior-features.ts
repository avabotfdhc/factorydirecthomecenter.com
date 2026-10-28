// How each of Champion's dormer, bump-out and bay options is drawn on the
// Design Your Home preview, and where it goes on a given plan.
//
// The option lists themselves live in src/lib/exterior-options.ts and are a
// transcription of the "2026 HUD Exterior Upgrades" (sheets SGL 1 and DBL 1)
// and "2026 Modular Exterior Upgrades" (MD-01..04) drawings. This file is the
// other half: what the drawing on that sheet shows, reduced to the few numbers
// HomeElevation needs. Three shapes cover every option on the sheets:
//
//   dormer   a decorative gable sitting on the front roof plane. "gable" is a
//            plain one (X1, X6, D10…), "eyebrow" a very low one (D11, S10), and
//            "dropEave" one whose own eave drops below the main eave with a
//            shake or siding face (X2, X3, X5, S7). "setback" sits up the roof
//            plane instead of on the eave (D6, D12).
//   bumpOut  a trim-framed section of the front wall around the entry: Azek
//            bands for a faux bump-out, shake columns for S7, corbels under
//            the eave where the sheet shows them.
//   end      the single-wide S-series and the double-wide bays, which Champion
//            draws on the gable end around its window: Azek trim and a corbel
//            (S1), a 6" box-out bay (S2, D4, X16), an eyebrow over the window
//            (S10, S5, D4), lineals (S5), a shed roof over the bay (X16).
//
// Dormer sizes are nominal ("will vary by roof pitch/ceiling height" on every
// sheet), the dormer and bump-out go over the front door, an end feature goes
// on the end with the widest window, and an added patio or atrium door takes
// the widest free stretch of the rear wall. All of that is illustration — the
// plant sets the real placement at order, and the caption says so.
//
// Import-free except for types, so it is safe in the client bundle.

import type { Opening, PlanElevation, ViewName } from "./plan-elevation-types";

export interface DormerSpec {
  widthFt: number;
  style: "gable" | "eyebrow" | "dropEave";
  /** shake in the face (the HUD sheet's drop-eave dormers); otherwise siding */
  shake?: boolean;
  /** sits up the roof plane rather than on the eave */
  setback?: boolean;
}

export interface BumpOutSpec {
  widthFt: number;
  /** vertical shake columns either side of the entry (S7) */
  shake?: boolean;
  /** small brackets under the eave at the trim bands */
  corbels?: boolean;
}

export interface EndSpec {
  widthFt: number;
  /** Azek bands at the zone edges */
  trim?: "azek";
  /** lineal trim around the window inside the zone */
  lineals?: boolean;
  /** a bracket under the gable peak */
  corbel?: boolean;
  /** a low eyebrow roof over the window */
  eyebrow?: boolean;
  /** the zone stands 6" proud of the wall */
  box?: boolean;
  /** a shed roof over the bay instead of the eyebrow */
  shedRoof?: boolean;
}

export interface FeatureSpec {
  dormer?: DormerSpec;
  bumpOut?: BumpOutSpec;
  end?: EndSpec;
}

/** Drawing spec for every id in exterior-options' dormer and elevation lists. */
export const FEATURES: Record<string, FeatureSpec> = {
  // --- HUD sheet SGL 1 (single wides) ---
  x1: { dormer: { widthFt: 6, style: "gable" } },
  s7: { dormer: { widthFt: 9, style: "dropEave", shake: true }, bumpOut: { widthFt: 7, shake: true } },
  s1: { end: { widthFt: 7.5, trim: "azek", corbel: true } },
  s2: { end: { widthFt: 7.5, box: true } },
  s10: { end: { widthFt: 7.5, eyebrow: true } },
  s5: { end: { widthFt: 7.5, eyebrow: true, trim: "azek", lineals: true } },
  // --- HUD sheet DBL 1 (3/12 double wides) ---
  d6: { dormer: { widthFt: 6, style: "gable", setback: true } },
  x5: { dormer: { widthFt: 8, style: "dropEave", shake: true } },
  x6: { dormer: { widthFt: 10, style: "gable" } },
  x2: { dormer: { widthFt: 10, style: "dropEave", shake: true } },
  d16: { dormer: { widthFt: 12, style: "gable" } },
  x3: { dormer: { widthFt: 12, style: "dropEave", shake: true } },
  x4: { dormer: { widthFt: 16, style: "gable" } },
  d12: { dormer: { widthFt: 16, style: "gable", setback: true } },
  d10: { dormer: { widthFt: 20, style: "gable" } },
  d11: { dormer: { widthFt: 20, style: "eyebrow" } },
  d2: { dormer: { widthFt: 20, style: "eyebrow" }, bumpOut: { widthFt: 12 } },
  d4: { end: { widthFt: 13.33, eyebrow: true, box: true } },
  x16: { end: { widthFt: 13.33, box: true, shedRoof: true } },
  // --- Modular sheets MD-01..04 ---
  m7: { dormer: { widthFt: 7, style: "dropEave" } },
  m20: { dormer: { widthFt: 20, style: "gable" } },
  m7b: { bumpOut: { widthFt: 7 } },
  m8b: { bumpOut: { widthFt: 8 } },
  m10b: { bumpOut: { widthFt: 10 } },
};

export function featureFor(id: string | null | undefined): FeatureSpec | null {
  return id && Object.prototype.hasOwnProperty.call(FEATURES, id) ? FEATURES[id] : null;
}

/** The buyer's dormer pick and elevation pick, merged into one set of parts.
 *  A dormer picked from the dormer list wins over one an elevation option
 *  (D2) brings with it, so two gables are never stacked on one spot. */
export function mergeFeatures(dormerId: string, elevationId: string): FeatureSpec {
  const a = featureFor(dormerId), b = featureFor(elevationId);
  return {
    dormer: a?.dormer ?? b?.dormer,
    bumpOut: a?.bumpOut ?? b?.bumpOut,
    end: b?.end ?? a?.end,
  };
}

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

/** The centre (feet along the front wall, viewer's left to right) for a
 *  front feature of the given width: over the front door when the plan has
 *  one, else over the mid porch, else the middle of the wall; kept a foot
 *  inside the ends. */
export function frontCentre(plan: PlanElevation, widthFt: number): number {
  const { L, porch } = plan;
  const front = plan.views.front;
  const door = front.find((o) => o[0] === "d") ?? front.find((o) => o[0] === "p");
  let cx: number;
  if (door) cx = door[1];
  else if (porch?.kind === "mid") cx = porch.x;
  else {
    // no entry on this side: the window nearest the middle, as the modular
    // sheet frames its bump-outs around a window
    const win = front.filter((o) => o[0] === "w").sort((a, b) => Math.abs(a[1] - L / 2) - Math.abs(b[1] - L / 2))[0];
    cx = win ? win[1] : L / 2;
  }
  if (widthFt + 2 >= L) return L / 2;
  return clamp(cx, widthFt / 2 + 1, L - widthFt / 2 - 1);
}

function widestWindow(openings: Opening[]): Opening | null {
  let best: Opening | null = null;
  for (const o of openings) if (o[0] === "w" && (!best || o[2] > best[2])) best = o;
  return best;
}

/** Which end wall an end feature is drawn on: an end without a porch that
 *  has a window, and of those the one with the widest window (Champion draws
 *  the S-series and the bays around the end wall's 46" window). Null when
 *  neither end qualifies — the option then stays on the quote and off the
 *  picture, rather than framing a blank wall. */
export function featureEnd(plan: PlanElevation, addonPorch = false): "left" | "right" | null {
  const { porch } = plan;
  const porchEnd = porch?.kind === "end" || (porch?.kind === "addon" && addonPorch) ? porch.side : null;
  const score = (v: "left" | "right") => (v === porchEnd ? 0 : (widestWindow(plan.views[v])?.[2] ?? 0));
  const l = score("left"), r = score("right");
  if (l <= 0 && r <= 0) return null;
  return r > l ? "right" : "left";
}

/** The centre (feet along that end wall) for an end feature: on its widest window, kept inside the wall. */
export function endCentre(plan: PlanElevation, view: "left" | "right", widthFt: number): number {
  const w = Math.min(widthFt, plan.W - 1);
  const win = widestWindow(plan.views[view]);
  return clamp(win ? win[1] : plan.W / 2, w / 2 + 0.5, plan.W - w / 2 - 0.5);
}

export type AddedDoor = "patio" | "atrium";

export interface DoorSlot {
  view: "rear" | "front";
  /** centre, feet along that wall */
  x: number;
}

/** Occupied intervals [a, b] along a wall: its openings, and a recessed end
 *  porch when that porch shows on this side. */
function occupied(plan: PlanElevation, view: "front" | "rear"): [number, number][] {
  const out: [number, number][] = plan.views[view].map((o) => [o[1] - o[2] / 2, o[1] + o[2] / 2]);
  const { porch, L } = plan;
  if (porch?.kind === "end" && (porch.depth === "full" || porch.depth === view)) {
    const onLeft = view === "front" ? porch.side === "left" : porch.side === "right";
    out.push(onLeft ? [0, porch.len] : [L - porch.len, L]);
  }
  if (porch?.kind === "mid" && view === "front") out.push([porch.x - porch.w / 2, porch.x + porch.w / 2]);
  return out;
}

/** The widest free stretch of a wall that fits a door of `widthFt` with a
 *  foot of clearance each side; the rear wall first, then the front. */
export function addedDoorSlot(plan: PlanElevation, widthFt: number, taken: DoorSlot[] = []): DoorSlot | null {
  for (const view of ["rear", "front"] as const) {
    const ivs = occupied(plan, view).concat(taken.filter((t) => t.view === view).map((t) => [t.x - widthFt / 2, t.x + widthFt / 2] as [number, number]));
    ivs.sort((a, b) => a[0] - b[0]);
    let cursor = 1; // a foot in from the corner trim
    let best: { x: number; w: number } | null = null;
    const consider = (a: number, b: number) => {
      const w = b - a;
      if (w >= widthFt + 2 && (!best || w > best.w)) best = { x: (a + b) / 2, w };
    };
    for (const [a, b] of ivs) {
      consider(cursor, a);
      cursor = Math.max(cursor, b);
    }
    consider(cursor, plan.L - 1);
    if (best) return { view, x: (best as { x: number }).x };
  }
  return null;
}

/** Slots for every added door, each in its own free stretch. */
export function addedDoorSlots(plan: PlanElevation, doors: AddedDoor[]): Partial<Record<AddedDoor, DoorSlot>> {
  const out: Partial<Record<AddedDoor, DoorSlot>> = {};
  const taken: DoorSlot[] = [];
  for (const d of doors) {
    const slot = addedDoorSlot(plan, 6, taken);
    if (slot) {
      out[d] = slot;
      taken.push(slot);
    }
  }
  return out;
}

/** The view a buyer should be looking at to see what they just picked. */
export function viewForFeature(spec: FeatureSpec, plan: PlanElevation, addonPorch: boolean): ViewName | null {
  if (spec.dormer || spec.bumpOut) return "front";
  if (spec.end) return featureEnd(plan, addonPorch);
  return null;
}
