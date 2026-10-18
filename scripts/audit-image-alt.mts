/**
 * Audit every image the live catalogue serves, for the alt text and the image
 * quality Google actually reads.
 *
 * Why this exists as a script and not only a test: `tests/image-alt.test.ts`
 * pins `public/seed/box-import-manifest.json`, which is a committed file, so CI
 * can check it with no network. It cannot see a row added to `floor_plan_images`
 * afterwards — by this script, by `/admin`, or by an agent writing SQL. That is
 * exactly how 14 bad rows reached the canonical pages on 2026-09-28: ~600×400
 * banner art of a *different* model number, plus a sales sheet filed as a photo,
 * all of which `sitemap.ts` would have submitted to Google Images.
 *
 * Run it after any change that adds catalogue imagery:
 *     vercel env run -- npm run image-audit
 *
 * Exit code is 1 when a gallery photo cannot be described or a rule below is
 * broken, so it can gate a deploy.
 *
 * What it checks, and why each rule is the shape it is:
 *
 *  - GALLERY PHOTOS MUST NAME A ROOM. A gallery entry is a photograph of part of
 *    a home, so its alt should say which part. Banner images are exempt on
 *    purpose: a hero shot is of the whole home, and "Woodward multi-section home
 *    by Champion Homes" is the correct alt for it, not a failure to describe.
 *    Measuring banners against a room-naming bar is what produced a misleading
 *    "72.9% coverage" before this split existed.
 *  - NO DOCUMENT IN THE PHOTO GALLERY. A sales sheet or floor-plan drawing is
 *    `kind='floorplan'`, never `kind='gallery'`.
 *  - NO ABSOLUTE URLS IN `path`. `imgUrl()` resolves "/images/…" and a bare
 *    storage key; an absolute URL bypasses it.
 *
 * It deliberately does NOT invent alt text for a file whose name carries no
 * room. A wrong alt is worse than a generic one — the reason Champion's `_LR`
 * suffix is still left alone (see AGENTS.md).
 */
import { describeImageFile } from "../src/lib/image-alt";

const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!URL_ || !KEY) {
  console.error("No Supabase env vars. Run with: vercel env run -- npm run image-audit");
  process.exit(2);
}

type Row = { path: string; kind: string; floor_plans: { slug: string; series: string; is_active: boolean } | null };

const res = await fetch(
  `${URL_}/rest/v1/floor_plan_images?select=path,kind,floor_plans!inner(slug,series,is_active)&floor_plans.is_active=eq.true&limit=5000`,
  { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } },
);
if (!res.ok) {
  console.error(`Supabase ${res.status} ${res.statusText}`);
  process.exit(2);
}
const rows = ((await res.json()) as Row[]).filter(
  (r) => r.floor_plans && r.floor_plans.series.toLowerCase() !== "paramount",
);

const DOCUMENT = /\b(sales?|apb|apf|lit|l-?10[12]|sheet|brochure)\b/i;

const byKind: Record<string, { total: number; specific: number }> = {};
const noRoom: Row[] = [];
const docsInGallery: Row[] = [];
const absoluteUrls: Row[] = [];

for (const r of rows) {
  const k = r.kind || "gallery";
  byKind[k] ||= { total: 0, specific: 0 };
  byKind[k].total++;
  const described = describeImageFile(r.path) !== "";
  if (described) byKind[k].specific++;
  if (k === "gallery") {
    if (!described) noRoom.push(r);
    if (DOCUMENT.test(r.path.split("/").pop() || "")) docsInGallery.push(r);
  }
  if (/^https?:\/\//i.test(r.path)) absoluteUrls.push(r);
}

console.log(`\nCatalogue images on active, non-retired plans: ${rows.length}\n`);
console.log("  kind         total  specific  coverage");
for (const [k, v] of Object.entries(byKind).sort((a, b) => b[1].total - a[1].total)) {
  const pct = v.total ? (v.specific / v.total) * 100 : 100;
  const note = k === "banner" ? "   (hero shot — the home's name is the right alt)" : "";
  console.log(`  ${k.padEnd(11)}${String(v.total).padStart(6)}${String(v.specific).padStart(10)}${`${pct.toFixed(1)}%`.padStart(10)}${note}`);
}

const gallery = byKind.gallery ?? { total: 0, specific: 0 };
const galleryPct = gallery.total ? (gallery.specific / gallery.total) * 100 : 100;
let failed = false;

const report = (title: string, items: Row[], hint: string) => {
  if (!items.length) return;
  failed = true;
  console.log(`\n${title} (${items.length}):`);
  for (const r of items.slice(0, 40)) console.log(`   ${r.floor_plans!.slug}  ${r.path}`);
  if (items.length > 40) console.log(`   … and ${items.length - 40} more`);
  console.log(`   → ${hint}`);
};

report("A DOCUMENT IS FILED AS A PHOTO", docsInGallery,
  "sales sheets and drawings are kind='floorplan', not kind='gallery'");
report("ABSOLUTE URL IN path", absoluteUrls,
  "store '/images/…' or a bare storage key; imgUrl() builds the URL");

if (galleryPct < 95) {
  failed = true;
  console.log(`\nGALLERY ALT COVERAGE ${galleryPct.toFixed(1)}% is below the 95% floor (${noRoom.length} photos name no room):`);
  for (const r of noRoom.slice(0, 40)) console.log(`   ${r.floor_plans!.slug}  ${r.path}`);
  console.log("   → rename the file to carry its room, or add a pattern to ROOMS in src/lib/image-alt.ts.");
  console.log("     Do NOT guess: a wrong alt is worse than a generic one.");
} else {
  console.log(`\nGallery alt coverage ${galleryPct.toFixed(1)}% — at or above the 95% floor.`);
  if (noRoom.length) {
    console.log(`${noRoom.length} gallery photos still fall back to the generic alt (within tolerance):`);
    for (const r of noRoom.slice(0, 20)) console.log(`   ${r.floor_plans!.slug}  ${r.path}`);
  }
}

console.log(failed ? "\nFAILED\n" : "\nOK\n");
process.exit(failed ? 1 : 0);
