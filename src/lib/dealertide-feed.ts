// DealerTide (Renter Insight) Meta Commerce product-catalog feed adapter.
//
// This is the inventory source for the public site: the same feed DealerTide
// generates for Meta/Facebook catalog ("vehicle" = home). It carries titles,
// prices, photos and specs for every home in the selected statuses.
//
// The feed URL (with its secret token) is provided via the DEALERTIDE_FEED_URL
// env var — set only in Vercel, never committed (this repo is public).
//
// Two on-the-wire formats are supported because Meta accepts both and DealerTide
// may emit either: RSS-XML (2.0 with the `g:` namespace) and CSV/TSV. The parser
// returns shape-agnostic records; mapToFloorPlan() adapts them to the same
// ApiFloorPlan shape the pages already render (see api-content.ts), so the
// feed can back the site without changing render code.

import type { ApiFloorPlan } from "@/lib/api-content";

const FEED_URL = process.env.DEALERTIDE_FEED_URL?.trim();

export function feedConfigured(): boolean {
  return Boolean(FEED_URL);
}

// ---------- fetch ----------

async function fetchFeedText(): Promise<string | null> {
  if (!FEED_URL) return null;
  try {
    const res = await fetch(FEED_URL, {
      headers: { Accept: "application/xml, text/csv, */*" },
      next: { revalidate: 300 },
    });
    if (!res.ok) {
      console.error(`[dt-feed] fetch failed: HTTP ${res.status} ${res.statusText}`);
      return null;
    }
    return await res.text();
  } catch (err) {
    console.error(`[dt-feed] fetch error: ${String(err)}`);
    return null;
  }
}

// ---------- parsing ----------

function decodeEntities(s: string): string {
  return String(s)
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .trim();
}

/** Parse RSS/Atom product XML into flat records. Repeated tags collapse into
 *  comma-joined values (e.g. multiple additional_image_link). Namespace prefix
 *  (g:) is dropped so `g:price` and `price` both key as `price`. */
function parseXml(xml: string): Record<string, string>[] {
  const blocks = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) ||
    xml.match(/<entry[\s>][\s\S]*?<\/entry>/gi) || [];
  return blocks.map((block) => {
    const rec: Record<string, string> = {};
    const re = /<(?:[a-zA-Z0-9]+:)?([a-zA-Z0-9_]+)(?:\s[^>]*)?>([\s\S]*?)<\/(?:[a-zA-Z0-9]+:)?\1>/g;
    let m;
    while ((m = re.exec(block))) {
      const key = m[1].toLowerCase();
      const val = decodeEntities(m[2]);
      if (!val) continue;
      rec[key] = rec[key] ? `${rec[key]},${val}` : val;
    }
    return rec;
  });
}

/** Minimal RFC-4180-ish CSV/TSV parser (handles quoted fields + embedded delimiters). */
function parseDelimited(text: string): Record<string, string>[] {
  const lines = text.split(/\r?\n/).filter((l) => l.length > 0);
  if (lines.length < 2) return [];
  const delim = (lines[0].match(/\t/g)?.length || 0) > (lines[0].match(/,/g)?.length || 0) ? "\t" : ",";

  const parseLine = (line: string): string[] => {
    const out: string[] = [];
    let cur = "", inQ = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (inQ) {
        if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; }
        else if (c === '"') inQ = false;
        else cur += c;
      } else if (c === '"') inQ = true;
      else if (c === delim) { out.push(cur); cur = ""; }
      else cur += c;
    }
    out.push(cur);
    return out;
  };

  const headers = parseLine(lines[0]).map((h) => h.trim().toLowerCase().replace(/^g:/, ""));
  return lines.slice(1).map((line) => {
    const cells = parseLine(line);
    const rec: Record<string, string> = {};
    headers.forEach((h, i) => { if (cells[i] != null && cells[i] !== "") rec[h] = cells[i].trim(); });
    return rec;
  });
}

/** All feed records, raw (lowercased keys, namespace-stripped). */
export async function getFeedRecordsRaw(): Promise<Record<string, string>[] | null> {
  const text = await fetchFeedText();
  if (!text) return null;
  const t = text.trimStart();
  const rows = t.startsWith("<") ? parseXml(text) : parseDelimited(text);
  return rows.filter((r) => Object.keys(r).length > 0);
}

// ---------- mapping ----------

const num = (v: unknown): number => {
  const n = Number(String(v ?? "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

/** First present value among candidate keys, else "". */
function pick(rec: Record<string, string>, keys: string[]): string {
  for (const k of keys) if (rec[k]) return rec[k];
  return "";
}

/** Pull "3" from "3 bed", "3br", "3 bedrooms" in any provided text. */
function extractCount(text: string, words: string[]): number {
  for (const w of words) {
    const m = text.match(new RegExp(`(\\d+(?:\\.\\d+)?)\\s*${w}`, "i"));
    if (m) return Number(m[1]);
  }
  return 0;
}

function slugFrom(rec: Record<string, string>): string {
  const link = pick(rec, ["link", "url"]);
  if (link) {
    const seg = link.split("?")[0].replace(/\/$/, "").split("/").pop();
    if (seg) return seg.toLowerCase();
  }
  const id = pick(rec, ["id", "sku", "mpn", "item_group_id"]);
  return String(id || pick(rec, ["title"]))
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "home";
}

const SHOW_PRICES = false; // mirror api-content.ts pre-launch policy

function formatPrice(raw: string): string {
  if (!SHOW_PRICES) return "Contact for price";
  const n = num(raw);
  return n > 0 ? `$${n.toLocaleString("en-US")}` : "Contact for price";
}

/** Map one feed record to the site's ApiFloorPlan card shape. */
export function mapToFloorPlan(rec: Record<string, string>): ApiFloorPlan & { gallery: string[] } {
  const title = pick(rec, ["title", "name"]);
  const desc = pick(rec, ["description", "summary"]);
  const specText = `${title} ${desc} ${pick(rec, ["product_type", "custom_label_0", "custom_label_1", "custom_label_2", "custom_label_3", "custom_label_4"])}`;

  const beds =
    num(pick(rec, ["bedrooms", "beds", "num_beds", "bed"])) ||
    extractCount(specText, ["bedrooms?", "beds?", "br\\b", "bd\\b"]);
  const baths =
    num(pick(rec, ["bathrooms", "baths", "num_baths", "bath"])) ||
    extractCount(specText, ["bathrooms?", "baths?", "ba\\b"]);
  const sqft =
    num(pick(rec, ["square_feet", "sqft", "square_footage", "size"])) ||
    extractCount(specText.replace(/,/g, ""), ["sq\\.?\\s*ft", "square\\s*feet", "sf\\b"]);

  const images = [
    pick(rec, ["image_link", "image", "image_url"]),
    pick(rec, ["additional_image_link", "additional_image_links", "additional_images"]),
  ].filter(Boolean).join(",");
  const gallery = [...new Set(images.split(",").map((s) => s.trim()).filter(Boolean))];

  return {
    slug: slugFrom(rec),
    name: (title.split(/\s[-|–]\s/)[0] || title || "Home").trim(),
    title,
    price: formatPrice(pick(rec, ["sale_price", "price"])),
    sqft,
    beds,
    baths,
    image: gallery[0] || "",
    brand: pick(rec, ["brand", "manufacturer"]) || "Champion Homes",
    homeType: pick(rec, ["product_type", "google_product_category", "condition"]) || "",
    gallery,
  };
}

/** All homes from the feed, mapped to the card shape. null if feed unavailable. */
export async function getFeedFloorPlans(): Promise<(ApiFloorPlan & { gallery: string[] })[] | null> {
  const rows = await getFeedRecordsRaw();
  if (!rows) return null;
  const homes = rows.map(mapToFloorPlan).filter((h) => h.slug && h.title);
  console.log(`[dt-feed] mapped ${homes.length} homes from feed`);
  return homes;
}
