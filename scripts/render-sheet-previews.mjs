#!/usr/bin/env node
/**
 * Render page 1 of each floor plan's primary Champion sales sheet (PDF) to a
 * JPEG and use it as the plan's card image when the plan has no photo.
 *
 * Runs as `postbuild` on Vercel, where the production Supabase env vars are
 * available, so a plan imported with only a sales sheet gets a card image on
 * the next deploy. Locally: `vercel env run -- node scripts/render-sheet-previews.mjs`.
 *
 * Idempotent: only active plans with no banner image and no gallery photos are
 * touched, and the rendered preview is stored next to the sheet
 * (`<series>/<MODEL>/previews/<sheet>.jpg`) and registered as a "floorplan"
 * image so the card and the plan page both show it.
 *
 * Never fails the build: without env vars it prints a note and exits 0, and
 * per-plan errors are logged and skipped. Pass --strict to exit 1 on errors,
 * --dry-run to list candidates without writing anything.
 */
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { createCanvas } from "@napi-rs/canvas";

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/+$/, "");
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const BUCKET = "floor-plans";
const MAX_WIDTH = 1600;
const JPEG_QUALITY = 82;
const LIMIT = Number(process.env.SHEET_PREVIEW_LIMIT) || 80;
const DRY_RUN = process.argv.includes("--dry-run");
const STRICT = process.argv.includes("--strict");

const log = (...a) => console.log("[sheet-previews]", ...a);

if (!SUPABASE_URL || !SERVICE_KEY) {
  log("NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set; skipping.");
  process.exit(0);
}

const headers = {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
};

async function rest(path, init = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: { ...headers, "Content-Type": "application/json", ...(init.headers || {}) },
  });
  if (!res.ok) throw new Error(`${init.method || "GET"} ${path} -> ${res.status} ${await res.text()}`);
  return res.status === 204 ? null : res.json();
}

/** Active plans with no card image and no photos, plus their sheets. */
async function candidates() {
  const rows = await rest(
    "floor_plans?select=id,slug,series,model_number,banner_image,brochure_url," +
      "floor_plan_documents(path,title,sort_order),floor_plan_images(id)" +
      "&is_active=eq.true&or=(banner_image.is.null,banner_image.eq.%22%22)&order=slug",
  );
  return rows
    .filter((r) => !(r.floor_plan_images || []).length)
    .map((r) => ({ ...r, sheet: pickSheet(r) }))
    .filter((r) => r.sheet);
}

/** The dimensioned sales sheet (APB first, then APF, then anything) as a storage key. */
function pickSheet(r) {
  const key = (p) => String(p || "").trim();
  const isPdf = (p) => /\.pdf$/i.test(p) && !/^https?:\/\//i.test(p);
  const docs = [...(r.floor_plan_documents || [])]
    .sort((a, b) => (Number(a.sort_order) || 0) - (Number(b.sort_order) || 0))
    .map((d) => key(d.path))
    .filter(isPdf);
  const rank = (p) => (/APB-/i.test(p) ? 0 : /APF-/i.test(p) ? 1 : /L-101/i.test(p) ? 2 : 3);
  docs.sort((a, b) => rank(a) - rank(b));
  const brochure = key(r.brochure_url);
  return docs[0] || (isPdf(brochure) ? brochure : "");
}

async function download(storageKey) {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${encodeURI(storageKey)}`, { headers });
  if (!res.ok) throw new Error(`download ${storageKey} -> ${res.status}`);
  return new Uint8Array(await res.arrayBuffer());
}

async function renderFirstPage(pdfBytes) {
  const doc = await getDocument({
    data: pdfBytes,
    useSystemFonts: false,
    standardFontDataUrl: new URL("../node_modules/pdfjs-dist/standard_fonts/", import.meta.url).href,
    cMapUrl: new URL("../node_modules/pdfjs-dist/cmaps/", import.meta.url).href,
    cMapPacked: true,
  }).promise;
  try {
    const page = await doc.getPage(1);
    const base = page.getViewport({ scale: 1 });
    const viewport = page.getViewport({ scale: MAX_WIDTH / base.width });
    const canvas = createCanvas(Math.round(viewport.width), Math.round(viewport.height));
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: ctx, viewport, canvas }).promise;
    return { jpeg: await canvas.encode("jpeg", JPEG_QUALITY), width: canvas.width, height: canvas.height };
  } finally {
    await doc.destroy();
  }
}

async function upload(storageKey, jpeg) {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${encodeURI(storageKey)}`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "image/jpeg", "x-upsert": "true", "Cache-Control": "public, max-age=31536000" },
    body: jpeg,
  });
  if (!res.ok) throw new Error(`upload ${storageKey} -> ${res.status} ${await res.text()}`);
}

function previewKey(sheetKey, plan) {
  const file = sheetKey.split("/").pop().replace(/\.pdf$/i, ".jpg");
  const dir = sheetKey.includes("/plans/")
    ? sheetKey.slice(0, sheetKey.lastIndexOf("/plans/")) + "/previews"
    : `${String(plan.series || "misc").toLowerCase()}/${String(plan.model_number || plan.slug).toUpperCase()}/previews`;
  return `${dir}/${file}`;
}

async function attach(plan, key) {
  await rest(`floor_plans?id=eq.${plan.id}`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({ banner_image: key }),
  });
  await rest("floor_plan_images?on_conflict=floor_plan_id,path", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify([{ floor_plan_id: plan.id, path: key, kind: "floorplan", sort_order: 0 }]),
  });
}

const started = Date.now();
let list;
try {
  list = await candidates();
} catch (err) {
  log(`could not list plans: ${err.message}`);
  process.exit(STRICT ? 1 : 0);
}
log(`${list.length} plan(s) without a card image have a sales sheet${DRY_RUN ? " (dry run)" : ""}`);

let done = 0;
let failed = 0;
for (const plan of list.slice(0, LIMIT)) {
  const key = previewKey(plan.sheet, plan);
  if (DRY_RUN) {
    log(`${plan.slug}: ${plan.sheet} -> ${key}`);
    continue;
  }
  try {
    const { jpeg, width, height } = await renderFirstPage(await download(plan.sheet));
    await upload(key, jpeg);
    await attach(plan, key);
    done++;
    log(`${plan.slug}: ${key} (${width}x${height}, ${Math.round(jpeg.length / 1024)} KB)`);
  } catch (err) {
    failed++;
    log(`${plan.slug}: FAILED ${err.message}`);
  }
}
if (list.length > LIMIT) log(`${list.length - LIMIT} more left for the next run (SHEET_PREVIEW_LIMIT=${LIMIT})`);
log(`${done} rendered, ${failed} failed in ${((Date.now() - started) / 1000).toFixed(1)}s`);
process.exit(STRICT && failed ? 1 : 0);
