// An exterior elevation of a Champion plan, drawn as SVG from the plan's
// sales-sheet data (src/lib/plan-elevation-types.ts) and the buyer's exterior
// selections. Pure and client-safe: no fetching, no state. HomeDesigner feeds
// it the plan it fetched from /api/plan-elevation and the current swatches.
//
// Everything is laid out in feet and scaled once. Views are viewer-oriented:
// x runs left to right as you stand outside facing that wall.

import type { ReactNode } from "react";
import { windowSize, type Opening, type PlanElevation, type ViewName } from "@/lib/plan-elevation-types";

export interface ExteriorChoices {
  siding: string;
  shingles: string;
  /** shutters beside each window, or white lineal trim around every opening */
  trim: "shutters" | "lineals";
  shutterColor: string;
  /** shake accent in the end gables; "" keeps the gables in siding */
  gableAccent: string;
  foundation: "block" | "skirting";
  /** include Champion's optional add-on porch when the plan draws one */
  addonPorch: boolean;
}

// Champion's 2026 Aspire board, approximated for screen (the /options page shows the board).
export const SIDING_HEX: Record<string, string> = {
  Pearl: "#E6E2C3", Clay: "#8C877C", Flint: "#8F9694", White: "#F6F6F2", Cypress: "#7E8A6B",
  Wedgewood: "#566978", Shadow: "#3D3832", Brunswick: "#1D2C37", Dublin: "#3F4B43",
};
export const SHINGLE_HEX: Record<string, string> = { Black: "#2A2C2E", Weatherwood: "#5E574E" };
export const SHUTTER_HEX: Record<string, string> = {
  Black: "#151515", White: "#F2F2EF", Blue: "#3E5470", Wine: "#4B1C2B", Clay: "#A6A68D",
};
export const GABLE_HEX: Record<string, string> = { "Dover White": "#ECECE6", Pewter: "#7B8083", "Cabin Cedar": "#8E7965" };

const TRIM = "#F5F5F1";
const GLASS_TOP = "#a9bccb";
const GLASS_BOTTOM = "#4f6273";
const FOUND_H = 2; // exposed foundation, feet
const WALL_H = 8; // sidewall
const HEAD = 80 / 12; // window and door head height above the floor
const PITCH = 3 / 12;
const OVERHANG = 1;
const FASCIA = 0.45;

function hex(map: Record<string, string>, key: string, fallback: string): string {
  return map[key] || map[key.replace(/\s*\(.*\)$/, "")] || fallback;
}

function shade(color: string, p: number): string {
  const n = parseInt(color.slice(1), 16);
  let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  const t = p < 0 ? 0 : 255, a = Math.abs(p);
  r = Math.round(r + (t - r) * a); g = Math.round(g + (t - g) * a); b = Math.round(b + (t - b) * a);
  return `rgb(${r},${g},${b})`;
}

interface Ctx {
  s: number; // px per foot
  id: string; // pattern id prefix
  sid: string;
  sh: string;
  shut: string | null;
  lineals: boolean;
  gable: string | null;
  foundation: "block" | "skirting";
}

/* ---------- pieces ---------- */

function Defs({ c }: { c: Ctx }) {
  const { s, id, sid, sh } = c;
  const lap = Math.max(3, s * 0.33);
  const blockW = s * (16 / 12), blockH = s * (8 / 12);
  return (
    <defs>
      <pattern id={`${id}-sid`} width={lap} height={lap} patternUnits="userSpaceOnUse">
        <rect width={lap} height={lap} fill={sid} />
        <rect width={lap} height={Math.max(1, lap * 0.18)} fill={shade(sid, 0.12)} />
        <rect y={lap - Math.max(1, lap * 0.22)} width={lap} height={Math.max(1, lap * 0.22)} fill={shade(sid, -0.24)} />
      </pattern>
      <pattern id={`${id}-shk`} width={s * 0.5} height={s * 0.55} patternUnits="userSpaceOnUse">
        <rect width={s * 0.5} height={s * 0.55} fill={c.gable || sid} />
        <rect width={s * 0.5} height={Math.max(1, s * 0.07)} fill={shade(c.gable || sid, 0.1)} />
        <rect y={s * 0.55 - Math.max(1, s * 0.08)} width={s * 0.5} height={Math.max(1, s * 0.08)} fill={shade(c.gable || sid, -0.25)} />
        <rect x={s * 0.5 - 1} width={1} height={s * 0.55} fill="rgba(0,0,0,.16)" />
      </pattern>
      <pattern id={`${id}-shg`} width={s * 1.4} height={s * 0.24} patternUnits="userSpaceOnUse">
        <rect width={s * 1.4} height={s * 0.24} fill={sh} />
        <rect width={s * 1.4} height={1} fill={shade(sh, 0.12)} />
        <rect y={s * 0.24 - Math.max(1, s * 0.05)} width={s * 1.4} height={Math.max(1, s * 0.05)} fill={shade(sh, -0.4)} />
        <rect x={s * 1.4 - 1} width={1} height={s * 0.24} fill="rgba(0,0,0,.25)" />
      </pattern>
      <pattern id={`${id}-blk`} width={blockW} height={blockH * 2} patternUnits="userSpaceOnUse">
        <rect width={blockW} height={blockH * 2} fill="#b3b1aa" />
        <rect x={1} y={1} width={blockW - 2} height={blockH - 2} fill="#bcb9b1" />
        <rect x={blockW / 2 + 1} y={blockH + 1} width={blockW - 2} height={blockH - 2} fill="#bcb9b1" />
        <rect x={-blockW / 2 + 1} y={blockH + 1} width={blockW - 2} height={blockH - 2} fill="#bcb9b1" />
      </pattern>
      <pattern id={`${id}-skt`} width={s * 0.5} height={s} patternUnits="userSpaceOnUse">
        <rect width={s * 0.5} height={s} fill="#b3b2ab" />
        <rect x={s * 0.5 - Math.max(1, s * 0.08)} width={Math.max(1, s * 0.08)} height={s} fill="#9d9c95" />
      </pattern>
      <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={GLASS_TOP} />
        <stop offset="0.55" stopColor="#6f8597" />
        <stop offset="1" stopColor={GLASS_BOTTOM} />
      </linearGradient>
      <linearGradient id={`${id}-porch`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="rgba(20,24,30,.72)" />
        <stop offset="1" stopColor="rgba(60,66,74,.30)" />
      </linearGradient>
      <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#cddcea" />
        <stop offset="1" stopColor="#eaf1f5" />
      </linearGradient>
      <linearGradient id={`${id}-lawn`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#8eaa6d" />
        <stop offset="1" stopColor="#6f8b54" />
      </linearGradient>
    </defs>
  );
}

/** A window centred at cx (px) with its sill at `floorY - sillFt`; sizes from the code. */
function Window({ c, cx, floorY, code, wFt }: { c: Ctx; cx: number; floorY: number; code?: string; wFt: number }) {
  const { s } = c;
  const { w, h } = windowSize(code, wFt);
  const W = w * s, H = h * s;
  const x = cx - W / 2, y = floorY - HEAD * s;
  const tr = (c.lineals ? 0.42 : 0.3) * s;
  const sash = Math.max(1.5, 0.11 * s);
  const out: ReactNode[] = [];
  if (c.shut) {
    const sw = (w >= 3.5 ? 15 : 12) / 12 * s, g = 0.08 * s;
    for (const sx of [x - tr - g - sw, x + W + tr + g]) {
      out.push(<rect key={`sh${sx}`} x={sx} y={y - tr} width={sw} height={H + 2 * tr} fill={c.shut} stroke="rgba(0,0,0,.28)" />);
      out.push(<rect key={`sp1${sx}`} x={sx + sw * 0.18} y={y - tr + sw * 0.18} width={sw * 0.64} height={(H + 2 * tr) / 2 - sw * 0.27} fill="rgba(0,0,0,.08)" stroke="rgba(0,0,0,.22)" />);
      out.push(<rect key={`sp2${sx}`} x={sx + sw * 0.18} y={y - tr + (H + 2 * tr) / 2 + sw * 0.09} width={sw * 0.64} height={(H + 2 * tr) / 2 - sw * 0.27} fill="rgba(0,0,0,.08)" stroke="rgba(0,0,0,.22)" />);
    }
  }
  out.push(<rect key="frame" x={x - tr} y={y - tr} width={W + 2 * tr} height={H + 2 * tr} fill={TRIM} stroke="rgba(0,0,0,.2)" />);
  if (c.lineals) out.push(<rect key="head" x={x - tr - 0.12 * s} y={y - tr - 0.14 * s} width={W + 2 * tr + 0.24 * s} height={0.18 * s} fill={TRIM} stroke="rgba(0,0,0,.22)" />);
  out.push(<rect key="sill" x={x - tr - 0.1 * s} y={y + H + tr - 0.06 * s} width={W + 2 * tr + 0.2 * s} height={0.16 * s} fill={TRIM} stroke="rgba(0,0,0,.2)" />);
  out.push(<rect key="glass" x={x} y={y} width={W} height={H} fill={`url(#${c.id}-glass)`} stroke="#fbfbf8" strokeWidth={sash} />);
  if (h > 2) out.push(<rect key="mid" x={x} y={y + H / 2 - sash / 2} width={W} height={sash * 1.2} fill="#fbfbf8" />);
  return <g>{out}</g>;
}

/** A 36" entry door with a nine-lite upper glass, with steps below it to the ground. */
function Door({ c, cx, floorY, groundY, steps = true }: { c: Ctx; cx: number; floorY: number; groundY: number; steps?: boolean }) {
  const { s } = c;
  const W = 3 * s, H = HEAD * s, x = cx - W / 2, y = floorY - H, tr = (c.lineals ? 0.42 : 0.3) * s;
  const gx = x + 0.3 * s, gy = y + 0.3 * s, gw = W - 0.6 * s, gh = H * 0.42;
  const m = Math.max(1.5, 0.07 * s);
  return (
    <g>
      {steps && <Steps c={c} cx={cx} w={4} floorY={floorY} groundY={groundY} />}
      <rect x={x - tr} y={y - tr} width={W + 2 * tr} height={H + tr} fill={TRIM} stroke="rgba(0,0,0,.2)" />
      {c.lineals && <rect x={x - tr - 0.12 * s} y={y - tr - 0.14 * s} width={W + 2 * tr + 0.24 * s} height={0.18 * s} fill={TRIM} stroke="rgba(0,0,0,.22)" />}
      <rect x={x} y={y} width={W} height={H} fill="#f3f3ee" stroke="rgba(0,0,0,.12)" />
      <rect x={gx} y={gy} width={gw} height={gh} fill={`url(#${c.id}-glass)`} stroke="rgba(0,0,0,.25)" />
      {[1, 2].map((i) => (
        <g key={i}>
          <rect x={gx + (gw * i) / 3 - m / 2} y={gy} width={m} height={gh} fill="#fbfbf8" />
          <rect x={gx} y={gy + (gh * i) / 3 - m / 2} width={gw} height={m} fill="#fbfbf8" />
        </g>
      ))}
      <rect x={gx} y={gy + gh + 0.35 * s} width={(gw - 0.25 * s) / 2} height={H - gh - 1.0 * s} fill="rgba(0,0,0,.03)" stroke="rgba(0,0,0,.15)" />
      <rect x={gx + (gw + 0.25 * s) / 2} y={gy + gh + 0.35 * s} width={(gw - 0.25 * s) / 2} height={H - gh - 1.0 * s} fill="rgba(0,0,0,.03)" stroke="rgba(0,0,0,.15)" />
      <circle cx={x + W - 0.42 * s} cy={y + H * 0.53} r={Math.max(1.5, 0.11 * s)} fill="#2b2b2b" />
    </g>
  );
}

/** A 72" sliding patio door. */
function Patio({ c, cx, floorY, groundY, steps = true }: { c: Ctx; cx: number; floorY: number; groundY: number; steps?: boolean }) {
  const { s } = c;
  const W = 6 * s, H = HEAD * s, x = cx - W / 2, y = floorY - H, tr = (c.lineals ? 0.42 : 0.3) * s;
  const fw = Math.max(2, 0.18 * s), pw = (W - 3 * fw) / 2;
  return (
    <g>
      {steps && <Steps c={c} cx={cx} w={7} floorY={floorY} groundY={groundY} />}
      <rect x={x - tr} y={y - tr} width={W + 2 * tr} height={H + tr} fill={TRIM} stroke="rgba(0,0,0,.2)" />
      {c.lineals && <rect x={x - tr - 0.12 * s} y={y - tr - 0.14 * s} width={W + 2 * tr + 0.24 * s} height={0.18 * s} fill={TRIM} stroke="rgba(0,0,0,.22)" />}
      <rect x={x} y={y} width={W} height={H} fill="#f7f7f4" />
      <rect x={x + fw} y={y + fw} width={pw} height={H - 2 * fw} fill={`url(#${c.id}-glass)`} stroke="rgba(0,0,0,.2)" />
      <rect x={x + 2 * fw + pw} y={y + fw} width={pw} height={H - 2 * fw} fill={`url(#${c.id}-glass)`} stroke="rgba(0,0,0,.2)" />
      <rect x={x + fw + pw - 0.25 * s} y={y + H * 0.48} width={Math.max(1.5, 0.08 * s)} height={0.55 * s} fill="#2b2b2b" rx={1} />
    </g>
  );
}

function Steps({ c, cx, w, floorY, groundY }: { c: Ctx; cx: number; w: number; floorY: number; groundY: number }) {
  const { s } = c;
  const n = 3, h = (groundY - floorY) / n;
  return (
    <g>
      {Array.from({ length: n }, (_, i) => (
        <rect key={i} x={cx - (w * s) / 2} y={floorY + i * h} width={w * s} height={h} fill={i % 2 ? "#9a8e7b" : "#a39784"} stroke="#74695a" />
      ))}
    </g>
  );
}

function Torch({ c, cx, y }: { c: Ctx; cx: number; y: number }) {
  const { s } = c;
  return (
    <g>
      <rect x={cx - 0.18 * s} y={y - 0.05 * s} width={0.36 * s} height={0.09 * s} fill="#111" />
      <rect x={cx - 0.16 * s} y={y} width={0.32 * s} height={0.62 * s} fill="#1a1a1a" rx={1} />
      <rect x={cx - 0.12 * s} y={y + 0.08 * s} width={0.24 * s} height={0.42 * s} fill="#f3d58a" stroke="#111" strokeWidth={Math.max(1, 0.04 * s)} />
    </g>
  );
}

/** Porch railing between x and x+w (px) on a floor at floorY. */
function Rail({ c, x, w, floorY }: { c: Ctx; x: number; w: number; floorY: number }) {
  const { s } = c;
  const top = floorY - 3 * s, bw = Math.max(1.5, s * 0.13), bp = Math.max(4, s * 0.42);
  const balusters: ReactNode[] = [];
  for (let bx = x + bp; bx < x + w - bw; bx += bp) balusters.push(<rect key={bx} x={bx} y={top + 0.2 * s} width={bw} height={2.35 * s} fill="#f4f4f0" />);
  return (
    <g>
      {balusters}
      <rect x={x} y={top} width={w} height={0.25 * s} fill={TRIM} stroke="rgba(0,0,0,.2)" />
      <rect x={x} y={floorY - 0.5 * s} width={w} height={0.18 * s} fill={TRIM} />
    </g>
  );
}

function Post({ c, x, top, bottom }: { c: Ctx; x: number; top: number; bottom: number }) {
  const { s } = c;
  return <rect x={x} y={top} width={0.5 * s} height={bottom - top} fill="#ffffff" stroke="rgba(0,0,0,.12)" />;
}

function Foundation({ c, x, w, floorY, groundY }: { c: Ctx; x: number; w: number; floorY: number; groundY: number }) {
  return (
    <g>
      <rect x={x} y={floorY} width={w} height={groundY - floorY} fill={`url(#${c.id}-${c.foundation === "block" ? "blk" : "skt"})`} />
      <rect x={x} y={floorY} width={w} height={Math.min(groundY - floorY, c.s * 0.5)} fill="rgba(0,0,0,.25)" opacity={0.6} />
      {c.foundation === "block" && <Vents c={c} x={x} w={w} floorY={floorY} groundY={groundY} />}
    </g>
  );
}

/** Crawl-space vents every ~12 ft along a block foundation. */
function Vents({ c, x, w, floorY, groundY }: { c: Ctx; x: number; w: number; floorY: number; groundY: number }) {
  const { s } = c;
  const vw = (16 / 12) * s, vh = (8 / 12) * s, cy = (floorY + groundY) / 2;
  const n = Math.max(1, Math.round(w / s / 12));
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const cx = x + (w * (i + 0.5)) / n;
        return <rect key={i} x={cx - vw / 2} y={cy - vh / 2} width={vw} height={vh} fill="#5b5b57" stroke="#2a2a2a" />;
      })}
    </g>
  );
}

/* ---------- the views ---------- */

interface Frame {
  width: number;
  height: number;
  ground: number;
  floor: number;
  eave: number;
  x0: number; // px where the home's left end lands
}

function frameFor(c: Ctx, spanFt: number, riseFt: number): Frame {
  const { s } = c;
  const margin = 1.5 * s;
  const width = spanFt * s + 2 * margin;
  const ground = (FOUND_H + WALL_H + riseFt + FASCIA + 1.2) * s;
  const height = ground + 1.6 * s;
  return { width, height, ground, floor: ground - FOUND_H * s, eave: ground - (FOUND_H + WALL_H) * s, x0: margin };
}

function Sky({ c, f }: { c: Ctx; f: Frame }) {
  return (
    <g>
      <rect width={f.width} height={f.height} fill={`url(#${c.id}-sky)`} />
      <rect y={f.ground} width={f.width} height={f.height - f.ground} fill={`url(#${c.id}-lawn)`} />
      <ellipse cx={f.width / 2} cy={f.ground + 0.1 * c.s} rx={f.width * 0.48} ry={0.35 * c.s} fill="rgba(0,0,0,.22)" />
    </g>
  );
}

function Opening_({ c, o, x0, floorY, groundY, steps }: { c: Ctx; o: Opening; x0: number; floorY: number; groundY: number; steps: boolean }) {
  const cx = x0 + o[1] * c.s;
  if (o[0] === "w") return <Window c={c} cx={cx} floorY={floorY} code={o[3]} wFt={o[2]} />;
  if (o[0] === "d") {
    return (
      <g>
        <Door c={c} cx={cx} floorY={floorY} groundY={groundY} steps={steps} />
        <Torch c={c} cx={cx + 2.3 * c.s} y={floorY - 6.4 * c.s} />
      </g>
    );
  }
  if (o[0] === "p") return <Patio c={c} cx={cx} floorY={floorY} groundY={groundY} steps={steps} />;
  return null;
}

/** The front or rear elevation. */
function LongView({ c, plan, view, choices }: { c: Ctx; plan: PlanElevation; view: "front" | "rear"; choices: ExteriorChoices }) {
  const { s } = c;
  const { L, W, porch } = plan;
  const rise = (W / 2) * PITCH;
  const addon = porch?.kind === "addon" && choices.addonPorch ? porch : null;
  // in the rear view the ends swap sides
  const addonOnLeft = addon ? (view === "front" ? addon.side === "left" : addon.side === "right") : false;
  const span = L + (addon ? addon.len : 0);
  const f = frameFor(c, span, rise);
  const houseX = f.x0 + (addon && addonOnLeft ? addon.len * s : 0);
  const openings = plan.views[view];
  const items: ReactNode[] = [];

  // recessed end porch: the wall stops short of the end, the porch shows as a shaded bay
  let recess: { x: number; w: number } | null = null;
  if (porch?.kind === "end" && (porch.depth === "full" || porch.depth === view)) {
    const onLeft = view === "front" ? porch.side === "left" : porch.side === "right";
    recess = { x: onLeft ? 0 : L - porch.len, w: porch.len };
  }
  const mid = porch?.kind === "mid" && view === "front" ? porch : null;

  // walls
  const wallSegs: { x: number; w: number }[] = [];
  if (recess) wallSegs.push(recess.x === 0 ? { x: recess.w, w: L - recess.w } : { x: 0, w: L - recess.w });
  else wallSegs.push({ x: 0, w: L });
  for (const seg of wallSegs) {
    items.push(<rect key={`wall${seg.x}`} x={houseX + seg.x * s} y={f.eave} width={seg.w * s} height={WALL_H * s} fill={`url(#${c.id}-sid)`} />);
    items.push(<rect key={`wsh${seg.x}`} x={houseX + seg.x * s} y={f.eave} width={seg.w * s} height={1.1 * s} fill="rgba(0,0,0,.16)" />);
    items.push(<rect key={`ct${seg.x}`} x={houseX + seg.x * s} y={f.eave} width={0.35 * s} height={WALL_H * s} fill={TRIM} />);
    items.push(<rect key={`ct2${seg.x}`} x={houseX + (seg.x + seg.w) * s - 0.35 * s} y={f.eave} width={0.35 * s} height={WALL_H * s} fill={TRIM} />);
  }
  // recessed bay interior, posts and railing
  if (recess) {
    const rx = houseX + recess.x * s, rw = recess.w * s;
    items.push(<rect key="recess" x={rx} y={f.eave} width={rw} height={WALL_H * s} fill={porch?.kind === "end" && porch.depth !== "full" ? `url(#${c.id}-sid)` : "#dfe6ec"} />);
    items.push(<rect key="recess-shade" x={rx} y={f.eave} width={rw} height={WALL_H * s} fill={`url(#${c.id}-porch)`} />);
    items.push(<rect key="recess-floor" x={rx} y={f.floor - 0.05 * s} width={rw} height={0.6 * s} fill={TRIM} stroke="rgba(0,0,0,.2)" />);
    items.push(<Rail key="recess-rail" c={c} x={rx + 0.5 * s} w={rw - 1.0 * s} floorY={f.floor} />);
    items.push(<Post key="rp1" c={c} x={rx} top={f.eave} bottom={f.floor} />);
    items.push(<Post key="rp2" c={c} x={rx + rw - 0.5 * s} top={f.eave} bottom={f.floor} />);
  }
  if (mid) {
    const mx = houseX + (mid.x - mid.w / 2) * s, mw = mid.w * s;
    items.push(<rect key="mid" x={mx} y={f.eave} width={mw} height={WALL_H * s} fill={`url(#${c.id}-sid)`} />);
    items.push(<rect key="mid-shade" x={mx} y={f.eave} width={mw} height={WALL_H * s} fill={`url(#${c.id}-porch)`} />);
    items.push(<Door key="mid-door" c={c} cx={mx + mw / 2} floorY={f.floor} groundY={f.ground} steps={false} />);
    items.push(<rect key="mid-floor" x={mx} y={f.floor - 0.05 * s} width={mw} height={0.6 * s} fill={TRIM} stroke="rgba(0,0,0,.2)" />);
    items.push(<Steps key="mid-steps" c={c} cx={mx + mw / 2} w={Math.min(mid.w - 1, 5)} floorY={f.floor + 0.55 * s} groundY={f.ground} />);
    items.push(<Post key="mp1" c={c} x={mx} top={f.eave} bottom={f.floor} />);
    items.push(<Post key="mp2" c={c} x={mx + mw - 0.5 * s} top={f.eave} bottom={f.floor} />);
  }
  // openings on the wall (skip any inside a recess or the mid porch)
  for (const o of openings) {
    if (recess && o[1] > recess.x - 0.3 && o[1] < recess.x + recess.w + 0.3) continue;
    if (mid && Math.abs(o[1] - mid.x) < mid.w / 2 + 0.3) continue;
    items.push(<Opening_ key={`o${o[1]}`} c={c} o={o} x0={houseX} floorY={f.floor} groundY={f.ground} steps />);
  }
  // add-on porch: open, under the main roof, with posts and railing
  if (addon) {
    const ax = addonOnLeft ? f.x0 : houseX + L * s;
    const aw = addon.len * s;
    items.push(<rect key="addon" x={ax} y={f.eave} width={aw} height={WALL_H * s} fill="#dfe6ec" />);
    items.push(<rect key="addon-shade" x={ax} y={f.eave} width={aw} height={WALL_H * s} fill={`url(#${c.id}-porch)`} />);
    items.push(<rect key="addon-floor" x={ax} y={f.floor - 0.05 * s} width={aw} height={0.6 * s} fill={TRIM} stroke="rgba(0,0,0,.2)" />);
    items.push(<Rail key="addon-rail" c={c} x={ax + 0.5 * s} w={aw - 1.0 * s} floorY={f.floor} />);
    items.push(<Post key="ap1" c={c} x={ax} top={f.eave} bottom={f.floor} />);
    items.push(<Post key="ap2" c={c} x={ax + aw - 0.5 * s} top={f.eave} bottom={f.floor} />);
    // the porch stands on piers, so the foundation stops at the house
    for (let px = ax + 1.5 * s; px < ax + aw - 1 * s; px += 3 * s) {
      items.push(<rect key={`pier${px}`} x={px} y={f.floor + 0.55 * s} width={0.6 * s} height={f.ground - f.floor - 0.55 * s} fill="#9d9c95" />);
    }
  }

  const roofX = f.x0 - OVERHANG * s, roofW = span * s + 2 * OVERHANG * s;
  const ridgeY = f.eave - FASCIA * s - rise * s;
  return (
    <svg viewBox={`0 0 ${f.width} ${f.height}`} width="100%" role="img" aria-label={`${view === "front" ? "Front" : "Rear"} elevation`}>
      <Defs c={c} />
      <Sky c={c} f={f} />
      <Foundation c={c} x={houseX} w={L * s} floorY={f.floor} groundY={f.ground} />
      {items}
      {/* roof: eave shadow, the sloped face seen edge-on, ridge cap, fascia, rake trim */}
      <rect x={roofX} y={f.eave} width={roofW} height={0.35 * s} fill="rgba(0,0,0,.38)" />
      <rect x={roofX} y={ridgeY} width={roofW} height={rise * s} fill={`url(#${c.id}-shg)`} />
      <rect x={roofX} y={ridgeY - 0.2 * s} width={roofW} height={0.3 * s} fill={shade(c.sh, -0.25)} />
      <rect x={roofX} y={f.eave - FASCIA * s} width={roofW} height={FASCIA * s} fill={TRIM} stroke="rgba(0,0,0,.2)" />
      <rect x={roofX - 0.05 * s} y={ridgeY - 0.2 * s} width={0.22 * s} height={rise * s + 0.2 * s} fill={TRIM} />
      <rect x={roofX + roofW - 0.17 * s} y={ridgeY - 0.2 * s} width={0.22 * s} height={rise * s + 0.2 * s} fill={TRIM} />
    </svg>
  );
}

/** An end elevation: gable, and the porch when it is on this end. */
function EndView({ c, plan, view, choices }: { c: Ctx; plan: PlanElevation; view: "left" | "right"; choices: ExteriorChoices }) {
  const { s } = c;
  const { W, porch } = plan;
  const rise = (W / 2) * PITCH;
  const f = frameFor(c, W, rise);
  const x0 = f.x0;
  const items: ReactNode[] = [];
  // from this end, the front of the home is on the viewer's left for the right end and on the right for the left end
  const frontOnLeft = view === "right";
  const half = W / 2;
  // a porch on this end: recessed into the floor, or Champion's optional
  // add-on standing in front of the end wall (the end wall is then its back)
  let porchSpan: { x: number; w: number } | null = null;
  let porchBack: Opening[] = [];
  if (porch?.kind === "end" && porch.side === view) {
    if (porch.depth === "full") porchSpan = { x: 0, w: W };
    else if ((porch.depth === "front") === frontOnLeft) porchSpan = { x: 0, w: half };
    else porchSpan = { x: half, w: half };
    porchBack = porch.back;
  } else if (porch?.kind === "addon" && porch.side === view && choices.addonPorch) {
    porchSpan = { x: 0, w: W };
    porchBack = plan.views[view];
  }
  const endPorch = porchSpan ? { back: porchBack } : null;

  // the house wall: full, or the part beside the porch (set back behind the porch, shaded)
  items.push(<rect key="wall" x={x0} y={f.eave} width={W * s} height={WALL_H * s} fill={`url(#${c.id}-sid)`} />);
  items.push(<rect key="wsh" x={x0} y={f.eave} width={W * s} height={1.1 * s} fill="rgba(0,0,0,.16)" />);
  if (!porchSpan) {
    items.push(<rect key="ct" x={x0} y={f.eave} width={0.35 * s} height={WALL_H * s} fill={TRIM} />);
    items.push(<rect key="ct2" x={x0 + W * s - 0.35 * s} y={f.eave} width={0.35 * s} height={WALL_H * s} fill={TRIM} />);
  }
  for (const o of plan.views[view]) {
    if (porchSpan && o[1] > porchSpan.x - 0.3 && o[1] < porchSpan.x + porchSpan.w + 0.3) continue;
    items.push(<Opening_ key={`o${o[1]}`} c={c} o={o} x0={x0} floorY={f.floor} groundY={f.ground} steps />);
  }
  if (endPorch && porchSpan) {
    const px = x0 + porchSpan.x * s, pw = porchSpan.w * s;
    items.push(<rect key="pshade" x={px} y={f.eave} width={pw} height={WALL_H * s} fill={`url(#${c.id}-porch)`} />);
    // the back wall's openings, seen through the porch
    for (const o of endPorch.back) {
      if (o[1] < porchSpan.x || o[1] > porchSpan.x + porchSpan.w) continue;
      items.push(
        <g key={`b${o[1]}`} opacity={0.92}>
          <Opening_ c={c} o={o} x0={x0} floorY={f.floor} groundY={f.ground} steps={false} />
        </g>,
      );
    }
    items.push(<rect key="pfloor" x={px} y={f.floor - 0.05 * s} width={pw} height={0.6 * s} fill={TRIM} stroke="rgba(0,0,0,.2)" />);
    const posts = porchSpan.w > 16 ? [0, porchSpan.w / 2 - 0.25, porchSpan.w - 0.5] : [0, porchSpan.w - 0.5];
    // a step opening in the railing in front of the door, when there is one
    const doorX = endPorch.back.find((o) => o[0] === "d" || o[0] === "p")?.[1] ?? porchSpan.x + porchSpan.w / 2;
    for (let i = 0; i < posts.length - 1; i++) {
      const a = posts[i] + 0.5, b = posts[i + 1];
      if (doorX !== undefined && doorX > porchSpan.x + a && doorX < porchSpan.x + b) {
        const gap = 3.6;
        const gx = doorX - porchSpan.x;
        if (gx - gap / 2 > a + 0.5) items.push(<Rail key={`r${i}a`} c={c} x={px + a * s} w={(gx - gap / 2 - a) * s} floorY={f.floor} />);
        if (gx + gap / 2 < b - 0.5) items.push(<Rail key={`r${i}b`} c={c} x={px + (gx + gap / 2) * s} w={(b - gx - gap / 2) * s} floorY={f.floor} />);
        items.push(<Steps key="psteps" c={c} cx={px + gx * s} w={gap} floorY={f.floor + 0.55 * s} groundY={f.ground} />);
      } else {
        items.push(<Rail key={`r${i}`} c={c} x={px + a * s} w={(b - a) * s} floorY={f.floor} />);
      }
    }
    for (const p of posts) items.push(<Post key={`p${p}`} c={c} x={px + p * s} top={f.eave + 0.7 * s} bottom={f.floor} />);
    items.push(<rect key="pbeam" x={px - 0.1 * s} y={f.eave} width={pw + 0.2 * s} height={0.7 * s} fill={TRIM} stroke="rgba(0,0,0,.2)" />);
  }

  const gx = x0 - OVERHANG * s, gw = W * s + 2 * OVERHANG * s;
  const peak = f.eave - FASCIA * s - rise * s - OVERHANG * PITCH * s;
  const tri = (inset: number, y: number) => `${gx + inset},${y + (rise + OVERHANG * PITCH) * s} ${gx + gw - inset},${y + (rise + OVERHANG * PITCH) * s} ${gx + gw / 2},${y}`;
  return (
    <svg viewBox={`0 0 ${f.width} ${f.height}`} width="100%" role="img" aria-label={`${view === "left" ? "Left" : "Right"} end elevation`}>
      <Defs c={c} />
      <Sky c={c} f={f} />
      <Foundation c={c} x={x0} w={W * s} floorY={f.floor} groundY={f.ground} />
      {items}
      {/* gable: shingle edge, white rake, then the gable face in siding or shake accent */}
      <polygon points={tri(0, peak - 0.3 * s)} fill={shade(c.sh, -0.1)} />
      <polygon points={tri(0.1 * s, peak)} fill={TRIM} />
      <polygon points={tri(OVERHANG * s + 0.5 * s, peak + (OVERHANG * PITCH + 0.5 * PITCH) * s + 0.45 * s)} fill={`url(#${c.id}-${c.gable ? "shk" : "sid"})`} />
      <rect x={gx} y={f.eave - FASCIA * s} width={gw} height={FASCIA * s} fill={TRIM} stroke="rgba(0,0,0,.2)" />
    </svg>
  );
}

/* ---------- public component ---------- */

export function HomeElevation({
  plan,
  choices,
  view,
  scale = 18,
  id = "el",
}: {
  plan: PlanElevation;
  choices: ExteriorChoices;
  view: ViewName;
  /** px per foot in the SVG's own units; the SVG scales to its container */
  scale?: number;
  /** unique prefix for pattern ids when several elevations share a page */
  id?: string;
}) {
  const c: Ctx = {
    s: scale,
    id: `${id}-${view}`,
    sid: hex(SIDING_HEX, choices.siding, SIDING_HEX.Dublin),
    sh: hex(SHINGLE_HEX, choices.shingles, SHINGLE_HEX.Black),
    shut: choices.trim === "shutters" ? hex(SHUTTER_HEX, choices.shutterColor, SHUTTER_HEX.Black) : null,
    lineals: choices.trim === "lineals",
    gable: choices.gableAccent ? hex(GABLE_HEX, choices.gableAccent, "") || null : null,
    foundation: choices.foundation,
  };
  if (view === "front" || view === "rear") return <LongView c={c} plan={plan} view={view} choices={choices} />;
  return <EndView c={c} plan={plan} view={view} choices={choices} />;
}
