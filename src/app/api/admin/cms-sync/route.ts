import { NextRequest, NextResponse } from "next/server";
import {
  localFloorPlans,
  planDescription,
  seriesLabel,
  PRIME_HOME_TYPE,
  PRIME_SERIES,
  type LocalFloorPlan,
} from "@/lib/local-floor-plans";
import { paramountExtraHtml } from "@/lib/paramount-content";
import { virtualTours } from "@/lib/virtual-tours";

// One-shot, resumable repo→CMS sync: pushes the repo-published floor plans
// (Paramount/Aspire/Prime) into the admin CMS so the admin panel shows the
// same catalog as the live site. Runs HERE (on Vercel) because the CMS API is
// only reachable from production, and is driven in small batches because the
// CMS rate-limits at 100 requests / 15 min / IP.
//
// The CMS derives each record's slug from its title (lowercase → strip
// non-[a-z0-9 space -] → spaces→hyphens → collapse hyphens), so titles are
// generated FROM our slugs to make the CMS slug exactly match the site slug.
// Since the site's data layer lets a repo-local plan win over a CMS record
// with the same slug, synced records appear in the admin panel without
// changing anything on the live site.
//
// The CMS floor-plan create endpoint only accepts images as uploaded files
// (no URL/S3-key attach), so each image is downloaded from the live site and
// re-uploaded multipart.
//
// Usage (idempotent — diffs by slug on every run, safe to re-run):
//   POST /api/admin/cms-sync  body: {user, pass, write?, batch?}
//     CMS admin credentials ride in the request body over HTTPS — nothing is
//     stored on Vercel, logged, or echoed back. Dry-run unless write:true.
//   GET  /api/admin/cms-sync?key=<CMS_SYNC_SECRET>[&write=1][&batch=N]
//     Alternative env-configured mode (CMS_SYNC_SECRET, CMS_ADMIN_USER,
//     CMS_ADMIN_PASS in Vercel). Optional CMS_CATEGORY_ID pins the category.
// Abuse of the POST mode as a login oracle is bounded by the CMS's own
// 5-per-15-min auth rate limit; when CMS_SYNC_SECRET is set it is required
// on BOTH modes.

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "https://api.factorydirecthomescenter.com").replace(/\/$/, "");
const SITE_BASE = "https://factorydirecthomescenter.com";

// Replica of the CMS's slug derivation — used to build a title whose
// server-derived slug equals our local slug.
function cmsSlugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/ /g, "-")
    .replace(/-+/g, "-");
}

function titleForSlug(slug: string): string {
  return slug
    .split("-")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

// CMS homeType is a strict enum; anything else makes the insert 500.
function cmsHomeType(homeType: string | undefined): string {
  const t = homeType || PRIME_HOME_TYPE;
  if (/single/i.test(t)) return "singleWide";
  if (/multi|double|sectional/i.test(t)) return "doubleWide";
  if (/modular/i.test(t)) return "modular";
  return "singleWide";
}

async function cmsFetch(path: string, init?: RequestInit): Promise<any> {
  const res = await fetch(`${API_BASE}${path}`, { ...init, cache: "no-store" });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`${path} → HTTP ${res.status}: ${JSON.stringify(body).slice(0, 300)}`);
  }
  return body;
}

async function downloadAsFile(url: string): Promise<{ blob: Blob; name: string } | null> {
  const abs = /^https?:\/\//.test(url) ? url : `${SITE_BASE}${url}`;
  try {
    const res = await fetch(abs, { cache: "no-store" });
    if (!res.ok) return null;
    const buf = await res.arrayBuffer();
    // Multer detects the extension from the uploaded filename.
    const clean = abs.split("?")[0];
    const base = decodeURIComponent(clean.substring(clean.lastIndexOf("/") + 1)) || "image.webp";
    const type = res.headers.get("content-type") || "application/octet-stream";
    return { blob: new Blob([buf], { type }), name: base };
  } catch {
    return null;
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const secret = process.env.CMS_SYNC_SECRET;
  if (!secret || !process.env.CMS_ADMIN_USER || !process.env.CMS_ADMIN_PASS) {
    return NextResponse.json(
      { error: "Env mode not configured — POST credentials instead, or set CMS_SYNC_SECRET, CMS_ADMIN_USER, CMS_ADMIN_PASS in Vercel." },
      { status: 503 },
    );
  }
  if (params.get("key") !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return runSync({
    user: process.env.CMS_ADMIN_USER,
    pass: process.env.CMS_ADMIN_PASS,
    write: params.get("write") === "1",
    batch: Number(params.get("batch")),
  });
}

export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  // When an env secret exists it gates this mode too.
  const secret = process.env.CMS_SYNC_SECRET;
  if (secret && body?.key !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!body?.user || !body?.pass) {
    return NextResponse.json({ error: "Body must include user and pass (CMS admin login)." }, { status: 400 });
  }
  return runSync({
    user: String(body.user),
    pass: String(body.pass),
    write: body.write === true || body.write === 1 || body.write === "1",
    batch: Number(body.batch),
  });
}

async function runSync(opts: { user: string; pass: string; write: boolean; batch: number }) {
  try {
    return await runSyncInner(opts);
  } catch (err) {
    return NextResponse.json({ error: String(err).slice(0, 500) }, { status: 502 });
  }
}

async function runSyncInner(opts: { user: string; pass: string; write: boolean; batch: number }) {
  const write = opts.write;
  const batch = Math.min(Math.max(opts.batch || 3, 1), 5);

  // Login (token also works across runs, but re-logging once per run stays
  // within the CMS's 5-per-15-min auth limit at our batch cadence).
  const login = await cmsFetch("/api/authenticate/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userName: opts.user, password: opts.pass }),
  });
  const token: string = login?.token || login?.data?.token;
  if (!token) return NextResponse.json({ error: "CMS login returned no token", login }, { status: 502 });
  const auth = { Authorization: `Bearer ${token}` };

  // Existing CMS slugs (get-all includes inactive; soft-deleted rows still
  // block slugs but don't appear — those surface as create-time errors).
  const all = await cmsFetch("/api/floor-plan/get-all?limit=1000&page=1", { headers: auth });
  const rows: any[] = Array.isArray(all?.data) ? all.data : all?.rows || [];
  const existing = new Set(rows.map((r) => String(r.slug)));

  // Category: pinned by env, else the most common one among existing records.
  let categoryId = process.env.CMS_CATEGORY_ID || "";
  if (!categoryId) {
    const counts = new Map<string, number>();
    for (const r of rows) {
      const c = String(r.category ?? "");
      if (c) counts.set(c, (counts.get(c) || 0) + 1);
    }
    categoryId = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || "";
  }
  if (!categoryId) {
    return NextResponse.json({ error: "Could not determine a CMS category id — set CMS_CATEGORY_ID." }, { status: 502 });
  }

  // Brand + series ids (optional on the CMS side, but keeps admin filters sane).
  const brands = await cmsFetch("/api/brand/get-active").catch(() => null);
  const brandRows: any[] = Array.isArray(brands?.data) ? brands.data : [];
  const championId = brandRows.find((b) => /champion/i.test(String(b.name)))?.id;
  const seriesRes = await cmsFetch("/api/series/get-active").catch(() => null);
  const seriesRows: any[] = Array.isArray(seriesRes?.data) ? seriesRes.data : [];
  const seriesIdByName = new Map(seriesRows.map((s) => [String(s.name).toLowerCase(), s.id]));

  const candidates = localFloorPlans.filter((p) => !p.hidden && !existing.has(p.slug));
  const withImage = candidates.filter((p) => p.image);
  const skippedNoImage = candidates.filter((p) => !p.image).map((p) => p.slug);
  const queue = withImage.slice(0, batch);

  const report = {
    mode: write ? "write" : "dry-run",
    cmsRecords: rows.length,
    localPlans: localFloorPlans.filter((p) => !p.hidden).length,
    missingFromCms: candidates.length,
    skippedNoImage,
    batch: queue.map((p) => p.slug),
    created: [] as string[],
    errors: [] as { slug: string; error: string }[],
    remainingAfterRun: Math.max(0, withImage.length - (write ? queue.length : 0)),
  };
  if (!write) return NextResponse.json(report);

  for (const p of queue) {
    try {
      report.errors.push(...(await createPlan(p, { auth, categoryId, championId, seriesIdByName })));
      if (!report.errors.find((e) => e.slug === p.slug)) report.created.push(p.slug);
    } catch (err) {
      report.errors.push({ slug: p.slug, error: String(err).slice(0, 400) });
    }
    // Pace well under the CMS's 100-requests-per-15-minutes limit.
    await sleep(4000);
  }
  report.remainingAfterRun = Math.max(0, withImage.length - report.created.length);
  return NextResponse.json(report);
}

async function createPlan(
  p: LocalFloorPlan,
  ctx: {
    auth: Record<string, string>;
    categoryId: string;
    championId?: number;
    seriesIdByName: Map<string, number>;
  },
): Promise<{ slug: string; error: string }[]> {
  const title = titleForSlug(p.slug);
  if (cmsSlugify(title) !== p.slug) {
    return [{ slug: p.slug, error: `Title "${title}" would slugify to "${cmsSlugify(title)}", not the site slug — skipped.` }];
  }

  const banner = await downloadAsFile(p.image!);
  if (!banner) return [{ slug: p.slug, error: `Banner download failed: ${p.image}` }];

  const desc = planDescription(p);
  const form = new FormData();
  form.append("title", title);
  form.append("category", ctx.categoryId);
  form.append("sqft", String(p.sqft));
  form.append("beds", String(p.beds));
  form.append("baths", String(p.baths));
  form.append("length", p.length);
  form.append("width", p.width);
  form.append("price", String(p.fdhcPrice || 0));
  form.append("description", desc);
  form.append("floorPlan", `<p>${desc}</p>${paramountExtraHtml(p)}`);
  form.append("homeType", cmsHomeType(p.homeType));
  if (p.modelNumber) form.append("modelNumber", p.modelNumber);
  form.append("series", seriesLabel(p));
  const tour = p.virtualTour || virtualTours[p.slug];
  if (tour) form.append("virtualTour", tour);
  if (ctx.championId) form.append("brandId", String(ctx.championId));
  const seriesId = ctx.seriesIdByName.get((p.series || PRIME_SERIES).toLowerCase());
  if (seriesId) form.append("seriesId", String(seriesId));
  form.append("banner", banner.blob, banner.name);

  // Remaining gallery entries (drawings, option sheets, photos) — capped at
  // the CMS's 30-file field limit; download failures skip the file, not the plan.
  const rest = (p.gallery ?? []).filter((g) => g !== p.image).slice(0, 30);
  for (const g of rest) {
    const f = await downloadAsFile(g);
    if (f) form.append("galleryImages", f.blob, f.name);
  }

  await cmsFetch("/api/floor-plan/create", { method: "POST", headers: ctx.auth, body: form });
  return [];
}
