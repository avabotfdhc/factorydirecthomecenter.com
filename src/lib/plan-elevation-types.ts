// Exterior elevations for the Design Your Home preview.
//
// A plan's elevation is read off Champion's own L-101 sales sheet by
// scripts/elevations/extract_elevations.py (see the README there) and shipped
// in src/lib/plan-elevations.json, keyed by model number. This module holds
// the shape of that data plus everything the browser needs to draw it; it
// imports nothing, so the client bundle gets the types and the small helpers
// without the 70 KB data file. The server-side lookup is plan-elevation.ts.
//
// Every view lists its openings by x in feet from the viewer's LEFT while
// standing outside facing that wall. "left"/"right" are the ends as seen from
// the front. When you face an end wall, the front of the home is on your left
// for the right end and on your right for the left end.

/** [kind, x (ft from the viewer's left), width ft, window code?, egress?]
 *  kind: w = window, d = entry door, p = patio door, o = unidentified opening */
export type Opening = [kind: "w" | "d" | "p" | "o", x: number, w: number, code?: string, egress?: 1];

export type ViewName = "front" | "rear" | "left" | "right";

export interface EndPorch {
  kind: "end";
  /** which end, as seen from the front */
  side: "left" | "right";
  /** how far the porch is cut into the floor, in feet */
  len: number;
  /** across the whole end, or only the front or rear section of a multi-section */
  depth: "full" | "front" | "rear";
  /** openings on the house wall at the back of the porch, viewer-oriented for that end view */
  back: Opening[];
}

export interface MidPorch {
  kind: "mid";
  /** recessed entry porch cut into the front wall, x = its centre */
  x: number;
  w: number;
  depth: number;
  depthEstimated?: boolean;
}

export interface AddonPorch {
  kind: "addon";
  /** Champion's optional porch drawn beside the box: adds `len` feet at that end */
  side: "left" | "right";
  len: number;
  lenEstimated?: boolean;
}

export type Porch = EndPorch | MidPorch | AddonPorch | null;

export interface PlanElevation {
  /** box length, feet (the porch of an add-on porch is extra) */
  L: number;
  /** box width, feet */
  W: number;
  sqft: number | null;
  views: Record<ViewName, Opening[]>;
  porch: Porch;
  /** "sheet": read from the plan's sales sheet. "representative": a typical
   *  layout for a home of this size, used when the sheet could not be read —
   *  the UI must say so. */
  src: "sheet" | "representative";
  model?: string;
}

/** Champion window codes are WWHH in inches: 3061 = 30" × 61", 4661E = egress. */
export function windowSize(code: string | undefined, fallbackWidthFt: number): { w: number; h: number } {
  const m = /^(\d{2})(\d{2})$/.exec(code || "");
  if (!m) return { w: fallbackWidthFt, h: 61 / 12 };
  return { w: Number(m[1]) / 12, h: Math.max(Number(m[2]), 8) / 12 };
}

/** The series code's own width (14/16/24/28/32) and length, when the model number carries them. */
export function sizeFromModel(model: string | undefined): { widthFt?: number; lengthFt?: number } {
  const m = /^(14|16|18|24|28|32)(\d{2})[HM]/i.exec(model || "");
  if (!m) return {};
  return { widthFt: Number(m[1]), lengthFt: Number(m[2]) };
}

/**
 * A plausible layout for a home we have no readable sheet for: windows at
 * sensible intervals, an entry door on the front, a utility door on the rear,
 * one window per end. Never passed off as the plan — the preview labels it.
 */
export function representativeElevation(
  { lengthFt, widthFt, beds }: { lengthFt: number; widthFt: number; beds?: number },
  model?: string,
): PlanElevation {
  const L = Math.max(lengthFt, 28);
  const W = Math.max(widthFt, 12);
  const single = W < 20;
  const front: Opening[] = [];
  const rear: Opening[] = [];
  // bedrooms at one end, living at the other: a 46" egress window per bedroom,
  // 30" windows along the living side, a 36" entry door about a third in
  const bedrooms = Math.max(beds || 3, 2);
  const bedBay = Math.min(10, (L * 0.45) / bedrooms);
  for (let i = 0; i < bedrooms; i++) {
    const x = L - bedBay * (i + 0.5);
    front.push(["w", round(x), 46 / 12, "4661", 1]);
  }
  const doorX = L * 0.36;
  front.push(["d", round(doorX), 3]);
  front.push(["w", round(doorX - 5), 30 / 12, "3061"]);
  front.push(["w", round(doorX + 6), 30 / 12, "3061"]);
  rear.push(["d", round(L * 0.12), 3]);
  rear.push(["w", round(L * 0.3), 30 / 12, "3036"]);
  rear.push(["w", round(L * 0.5), 30 / 12, "3061"]);
  rear.push(["w", round(L * 0.78), 30 / 12, "3061", 1]);
  if (!single) rear.push(["w", round(L * 0.64), 46 / 12, "4661"]);
  const left: Opening[] = [["w", round(W * 0.5), 30 / 12, "3061"]];
  const right: Opening[] = single ? [] : [["w", round(W * 0.3), 30 / 12, "3061", 1], ["w", round(W * 0.72), 30 / 12, "3061"]];
  return {
    L,
    W,
    sqft: null,
    views: { front: sortByX(front), rear: sortByX(rear), left, right },
    porch: null,
    src: "representative",
    model,
  };
}

function sortByX(list: Opening[]): Opening[] {
  return [...list].sort((a, b) => a[1] - b[1]);
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}
