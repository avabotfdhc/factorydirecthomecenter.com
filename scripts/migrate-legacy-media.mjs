#!/usr/bin/env node
/**
 * Move catalogue media off the legacy AWS S3 bucket into Supabase Storage.
 *
 * Runs as part of `postbuild` on Vercel (production env vars present), so it
 * needs no local credentials and no downloads on anyone's machine. Idempotent:
 * every source URL is recorded in public.media_migrations, rows already
 * migrated are skipped, and re-running after the bucket is gone is a no-op.
 *
 * Sources:
 *  - floor_plans.banner_image and floor_plan_images.path that still point at
 *    the S3 bucket (rows are updated to the new storage key), and
 *  - S3 URLs hard-coded in src/lib/*.ts and src/app (recorded in
 *    media_migrations so the repo data can be rewritten from the map).
 *
 * Photos are re-encoded as WebP (max 1920px, the largest size next/image
 * serves); PDFs and other files are copied as-is. Destination:
 * legacy/<original file name>.<ext> in the floor-plans bucket.
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/+$/, "");
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const BUCKET = "floor-plans";
const S3_HOST = "factory-direct-homescenter.s3.us-east-1.amazonaws.com";
const LIMIT = Number(process.env.LEGACY_MEDIA_LIMIT) || 400;
const DRY_RUN = process.argv.includes("--dry-run");
const log = (...a) => console.log("[legacy-media]", ...a);

if (!SUPABASE_URL || !SERVICE_KEY) {
  log("NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set; skipping.");
  process.exit(0);
}
const headers = { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` };

async function rest(p, init = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${p}`, {
    ...init,
    headers: { ...headers, "Content-Type": "application/json", ...(init.headers || {}) },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${init.method || "GET"} ${p} -> ${res.status} ${text}`);
  return text ? JSON.parse(text) : null;
}

const isS3 = (u) => typeof u === "string" && u.includes(S3_HOST);

/** Canonical form of a legacy URL: single-encoded, so "%2520" and " " both become "%20". */
function canon(u) {
  let s = String(u).trim();
  try {
    // Decode repeatedly until stable (handles %2520), then encode once.
    for (let i = 0; i < 3; i++) {
      const d = decodeURIComponent(s);
      if (d === s) break;
      s = d;
    }
  } catch {
    /* leave as-is */
  }
  return encodeURI(s);
}

/** Destination key inside the bucket. */
function destKey(url) {
  const file = decodeURIComponent(url.split("?")[0].split("/").pop() || "file");
  const ext = (file.match(/\.([a-z0-9]+)$/i)?.[1] || "").toLowerCase();
  const base = file
    .replace(/\.[a-z0-9]+$/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const isImage = ["png", "jpg", "jpeg", "webp", "gif", "bmp", "tif", "tiff"].includes(ext);
  return { key: `legacy/${base || "file"}.${isImage ? "webp" : ext || "bin"}`, isImage, ext };
}

async function scanRepo() {
  const found = new Set();
  const re = new RegExp(`https://${S3_HOST.replace(/\./g, "\\.")}/[^"'\\s)]+`, "g");
  async function walk(dir) {
    for (const e of await readdir(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) await walk(p);
      else if (/\.(ts|tsx|js|mjs|json|md)$/.test(e.name)) {
        const t = await readFile(p, "utf8");
        for (const m of t.match(re) || []) found.add(m);
      }
    }
  }
  await walk(path.join(process.cwd(), "src"));
  return [...found];
}

async function main() {
  const started = Date.now();
  const migrated = new Map(
    (await rest("media_migrations?select=source_url,path&limit=5000")).map((r) => [r.source_url, r.path]),
  );

  const plans = await rest(`floor_plans?select=id,slug,banner_image&banner_image=ilike.*${S3_HOST}*`);
  const images = await rest(`floor_plan_images?select=id,path&path=ilike.*${S3_HOST}*`);
  const repoUrls = await scanRepo();

  const jobs = new Map(); // canonical url -> { rows: [...], repo: bool }
  const add = (url, ref) => {
    if (!isS3(url)) return;
    const c = canon(url);
    const j = jobs.get(c) || { rows: [], repo: false, original: url };
    if (ref) j.rows.push(ref);
    else j.repo = true;
    jobs.set(c, j);
  };
  for (const p of plans) add(p.banner_image, { table: "floor_plans", id: p.id, column: "banner_image" });
  for (const i of images) add(i.path, { table: "floor_plan_images", id: i.id, column: "path" });
  for (const u of repoUrls) add(u, null);

  log(`${jobs.size} legacy file(s): ${plans.length} banners, ${images.length} gallery rows, ${repoUrls.length} repo URLs${DRY_RUN ? " (dry run)" : ""}`);

  let done = 0, reused = 0, failed = 0;
  for (const [url, job] of [...jobs].slice(0, LIMIT)) {
    try {
      let key = migrated.get(url);
      if (!key) {
        if (DRY_RUN) { log(`${url} -> ${destKey(url).key}`); continue; }
        const res = await fetch(url, { signal: AbortSignal.timeout(30000) });
        if (!res.ok) throw new Error(`download ${res.status}`);
        const buf = Buffer.from(await res.arrayBuffer());
        const { key: k, isImage, ext } = destKey(url);
        let body = buf, type = res.headers.get("content-type") || "application/octet-stream", width = null, height = null;
        if (isImage) {
          const out = await sharp(buf).rotate().resize({ width: 1920, withoutEnlargement: true }).webp({ quality: 82 }).toBuffer({ resolveWithObject: true });
          body = out.data; type = "image/webp"; width = out.info.width; height = out.info.height;
        } else if (ext === "pdf") type = "application/pdf";
        const up = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${encodeURI(k)}`, {
          method: "POST",
          headers: { ...headers, "Content-Type": type, "x-upsert": "true", "Cache-Control": "public, max-age=31536000" },
          body,
        });
        if (!up.ok) throw new Error(`upload ${up.status} ${await up.text()}`);
        await rest("media_migrations?on_conflict=source_url", {
          method: "POST",
          headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
          body: JSON.stringify([{ source_url: url, path: k, bytes: body.length, width, height }]),
        });
        migrated.set(url, k);
        key = k;
        done++;
        log(`${url.split("/").pop()} -> ${k} (${Math.round(body.length / 1024)} KB${width ? `, ${width}x${height}` : ""})`);
      } else {
        reused++;
      }
      for (const ref of job.rows) {
        await rest(`${ref.table}?id=eq.${ref.id}`, {
          method: "PATCH",
          headers: { Prefer: "return=minimal" },
          body: JSON.stringify({ [ref.column]: key }),
        });
      }
    } catch (err) {
      failed++;
      log(`FAILED ${url}: ${err.message}`);
    }
  }
  if (jobs.size > LIMIT) log(`${jobs.size - LIMIT} left for the next run (LEGACY_MEDIA_LIMIT=${LIMIT})`);
  log(`${done} copied, ${reused} already copied, ${failed} failed in ${((Date.now() - started) / 1000).toFixed(1)}s`);
}

main().catch((err) => {
  log(`aborted: ${err.message}`);
  process.exit(0);
});
