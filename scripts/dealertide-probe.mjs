// TEMPORARY shape-discovery probe for the DealerTide inventory feed.
//
// Two possible sources, tried in order:
//   1. DEALERTIDE_FEED_URL  — Meta Commerce catalog feed (token in the URL).
//      This is the whole inventory (homes + photos) in Meta product-feed
//      format (CSV or XML/RSS). Set in Vercel env only (URL carries a secret
//      token; this repo is public, so it is NEVER hard-coded here).
//   2. Partner API /vehicles — needs the vehicles:read scope on the key.
//
// Prints format + field names + one sample record to the Vercel build log so
// the website field mapping can be pinned down. Non-fatal; no-op if unset.
// Remove this file + the package.json hook once the mapping is built.

const FEED_URL = process.env.DEALERTIDE_FEED_URL?.trim();
const KEY = process.env.DEALERTIDE_API_KEY?.trim();
const API_BASE =
  process.env.DEALERTIDE_API_BASE ||
  "https://renterinsight-api-prod.onrender.com/api/partner/v1";

function firstTag(xml, tag) {
  const m = xml.match(new RegExp(`<${tag}[\\s>][\\s\\S]*?</${tag}>`, "i"));
  return m ? m[0] : null;
}

function tagNames(block) {
  const names = new Set();
  const re = /<([a-zA-Z0-9:_-]+)[\s>]/g;
  let m;
  while ((m = re.exec(block))) names.add(m[1]);
  return [...names];
}

async function probeFeed() {
  console.log(`[dt-feed] fetching DEALERTIDE_FEED_URL`);
  const res = await fetch(FEED_URL, { headers: { Accept: "*/*" } });
  const ct = res.headers.get("content-type") || "";
  console.log(`[dt-feed] -> ${res.status} ${ct}`);
  const text = await res.text();
  console.log(`[dt-feed] length: ${text.length} bytes`);
  if (!res.ok) {
    console.log(`[dt-feed] body: ${text.replace(/\s+/g, " ").slice(0, 300)}`);
    return;
  }

  const trimmed = text.trimStart();
  if (trimmed.startsWith("<")) {
    // XML / RSS product feed
    const item = firstTag(text, "item") || firstTag(text, "entry") || firstTag(text, "product");
    const count = (text.match(/<item[\s>]/gi) || text.match(/<entry[\s>]/gi) || []).length;
    console.log(`[dt-feed] format: XML, ~${count} items`);
    if (item) {
      console.log(`[dt-feed] item fields: ${tagNames(item).join(", ")}`);
      console.log(`[dt-feed] --- first item (truncated) ---`);
      console.log(item.replace(/\s+/g, " ").slice(0, 1200));
    }
  } else if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    // JSON
    let json;
    try { json = JSON.parse(text); } catch { console.log(`[dt-feed] JSON parse failed`); return; }
    const rows = Array.isArray(json) ? json : (json.data || json.products || json.items || json.entries);
    console.log(`[dt-feed] format: JSON, ${Array.isArray(rows) ? rows.length : "?"} items`);
    if (Array.isArray(rows) && rows[0]) {
      console.log(`[dt-feed] item fields: ${Object.keys(rows[0]).join(", ")}`);
      console.log(`[dt-feed] first item: ${JSON.stringify(rows[0]).slice(0, 1200)}`);
    }
  } else {
    // Assume CSV/TSV
    const lines = text.split(/\r?\n/).filter(Boolean);
    const delim = (lines[0].match(/\t/g) || []).length > (lines[0].match(/,/g) || []).length ? "\t" : ",";
    console.log(`[dt-feed] format: CSV (delim ${delim === "\t" ? "TAB" : "comma"}), ${lines.length - 1} rows`);
    console.log(`[dt-feed] headers: ${lines[0].slice(0, 1000)}`);
    if (lines[1]) console.log(`[dt-feed] row 1: ${lines[1].slice(0, 1200)}`);
  }
}

async function probeApi() {
  const auth = KEY.startsWith("Bearer ") ? KEY : `Bearer ${KEY}`;
  const res = await fetch(`${API_BASE}/vehicles`, {
    headers: { Authorization: auth, Accept: "application/json" },
  });
  const text = await res.text();
  console.log(`[dt-shape] GET /vehicles -> ${res.status}: ${text.replace(/\s+/g, " ").slice(0, 200)}`);
}

async function main() {
  try {
    if (FEED_URL) {
      await probeFeed();
    } else {
      console.log("[dt-feed] DEALERTIDE_FEED_URL not set — skipping feed probe");
    }
    if (KEY) await probeApi();
  } catch (e) {
    console.log(`[dt-probe] ERR ${String(e?.cause?.code || e?.name || e).slice(0, 120)}`);
  }
}

main().catch((e) => console.log(`[dt-probe] fatal: ${e}`));
