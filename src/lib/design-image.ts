// Pictures for a buyer's design copy, as raster images: email clients do not
// show SVG, and a text message carries JPEG or PNG. Drawn by the same
// HomeElevation component the designer shows (via src/lib/elevation-svg.ts)
// and rasterised with @napi-rs/canvas, which the build already uses for the
// sales-sheet previews.
//
// Server only. Used by /api/design-summary/image and
// /api/design-summary/floor-plan.

import { createCanvas, loadImage } from "@napi-rs/canvas";
import { renderElevationSvg } from "@/lib/elevation-svg";
import { exteriorCatalog } from "@/lib/exterior-options";
import { planElevation } from "@/lib/plan-elevation";
import { choicesFromPicks, sanitizePicks, type DesignPicks } from "@/lib/design-summary";
import type { DesignerPlanWithMedia } from "@/lib/designer-plans";
import { SITE_URL } from "@/lib/business";

/** Width of the design picture in pixels: sharp in an email, small enough for MMS. */
const DESIGN_WIDTH = 1200;
/** Longest side of the floor-plan picture. */
const FLOOR_PLAN_MAX = 1600;

/** The design's front (or chosen) elevation as a PNG, or null when the plan has no drawing. */
export async function renderDesignPng(plan: DesignerPlanWithMedia, rawPicks: Partial<Record<keyof DesignPicks, unknown>>): Promise<Buffer | null> {
  const elevation = planElevation({ modelNumber: plan.modelNumber, lengthFt: plan.lengthFt, widthFt: plan.widthFt, beds: plan.beds });
  if (!elevation) return null;
  const catalog = exteriorCatalog(plan.series, plan.homeType, plan.widthFt);
  const picks = sanitizePicks(rawPicks, catalog);
  const svg = await renderElevationSvg({
    plan: elevation,
    choices: choicesFromPicks(catalog, picks),
    view: picks.view,
    title: `${plan.name} design (illustration)`,
  });
  return rasterise(svg, DESIGN_WIDTH);
}

/** An SVG document drawn at `width` pixels wide on white, as PNG. */
export async function rasterise(svg: string, width: number): Promise<Buffer> {
  const box = svg.match(/viewBox="\s*[-\d.]+\s+[-\d.]+\s+([\d.]+)\s+([\d.]+)\s*"/);
  if (!box) throw new Error("SVG has no viewBox");
  const vw = Number(box[1]);
  const vh = Number(box[2]);
  const height = Math.max(1, Math.round((width * vh) / vw));
  // The component draws at width="100%" for the page; a standalone raster
  // needs real pixels, so the root gets them before it is decoded.
  const sized = svg.replace(/<svg\b([^>]*)>/, (_m, attrs: string) => {
    const rest = attrs.replace(/\s(width|height)="[^"]*"/g, "");
    return `<svg${rest} width="${width}" height="${height}">`;
  });
  const image = await loadImage(Buffer.from(sized, "utf8"));
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(image, 0, 0, width, height);
  return canvas.encode("png");
}

/**
 * The plan's floor-plan drawing as a JPEG (most are stored as WebP, which
 * Outlook and many phones' MMS do not show). The source URL comes from the
 * catalogue, never from the request. Null when the plan has no drawing or it
 * cannot be fetched.
 */
export async function floorPlanJpeg(plan: DesignerPlanWithMedia): Promise<Buffer | null> {
  if (!plan.floorPlanImage) return null;
  let src: URL;
  try {
    // Site-relative drawings are read from the live site: a preview
    // deployment sits behind Vercel's login, so its own URL would refuse us.
    src = new URL(plan.floorPlanImage, SITE_URL);
  } catch {
    return null;
  }
  if (src.protocol !== "https:" && src.protocol !== "http:") return null;
  const res = await fetch(src, { signal: AbortSignal.timeout(8_000) });
  if (!res.ok) return null;
  const image = await loadImage(Buffer.from(await res.arrayBuffer()));
  const scale = Math.min(1, FLOOR_PLAN_MAX / Math.max(image.width, image.height));
  const w = Math.max(1, Math.round(image.width * scale));
  const h = Math.max(1, Math.round(image.height * scale));
  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(image, 0, 0, w, h);
  return canvas.encode("jpeg", 85);
}
