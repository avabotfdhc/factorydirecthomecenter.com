// TEMPORARY shape-discovery probe for the DealerTide /vehicles payload.
//
// The endpoint + auth are already confirmed (src/lib/dealertide.ts). This
// prints the field names and a redacted sample of one vehicle to the Vercel
// build log so the floor-plan field mapping can be pinned down without needing
// admin credentials. Non-fatal; no-op without the key. Remove once mapped.

const KEY = process.env.DEALERTIDE_API_KEY?.trim();
const BASE =
  process.env.DEALERTIDE_API_BASE ||
  "https://renterinsight-api-prod.onrender.com/api/partner/v1";

function unwrap(json) {
  if (Array.isArray(json)) return json;
  for (const k of ["data", "vehicles", "results", "items", "rows"]) {
    if (Array.isArray(json?.[k])) return json[k];
  }
  return null;
}

// Print keys and short scalar previews; never dump full nested blobs.
function shape(obj, prefix = "") {
  const lines = [];
  for (const [k, v] of Object.entries(obj || {})) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) {
      lines.push(`${path}: {object}`);
    } else if (Array.isArray(v)) {
      const first = v[0];
      lines.push(`${path}: [${v.length}] ${first && typeof first === "object" ? "{object}" : JSON.stringify(first)?.slice(0, 40)}`);
    } else {
      lines.push(`${path} = ${JSON.stringify(v)?.slice(0, 60)}`);
    }
  }
  return lines;
}

async function main() {
  if (!KEY) {
    console.log("[dt-shape] DEALERTIDE_API_KEY not set — skipping");
    return;
  }
  const auth = KEY.startsWith("Bearer ") ? KEY : `Bearer ${KEY}`;
  try {
    const res = await fetch(`${BASE}/vehicles`, {
      headers: { Authorization: auth, Accept: "application/json" },
    });
    console.log(`[dt-shape] GET /vehicles -> ${res.status} ${res.headers.get("content-type") || ""}`);
    const text = await res.text();
    if (!res.ok) {
      console.log(`[dt-shape] body: ${text.replace(/\s+/g, " ").slice(0, 300)}`);
      return;
    }
    let json;
    try { json = JSON.parse(text); } catch { console.log(`[dt-shape] non-JSON: ${text.slice(0, 200)}`); return; }
    const rows = unwrap(json);
    if (!rows) {
      console.log(`[dt-shape] envelope keys: ${Object.keys(json || {}).join(", ")}`);
      return;
    }
    console.log(`[dt-shape] vehicles count: ${rows.length}`);
    if (rows[0]) {
      console.log("[dt-shape] --- field shape of vehicles[0] ---");
      for (const line of shape(rows[0])) console.log(`[dt-shape] ${line}`);
      // One nested images/gallery hint if present.
      for (const k of ["images", "photos", "media", "gallery", "attachments"]) {
        if (rows[0][k]) {
          console.log(`[dt-shape] --- ${k}[0] shape ---`);
          const first = Array.isArray(rows[0][k]) ? rows[0][k][0] : rows[0][k];
          for (const line of shape(first, k)) console.log(`[dt-shape] ${line}`);
        }
      }
    }
  } catch (e) {
    console.log(`[dt-shape] ERR ${String(e?.cause?.code || e?.name || e).slice(0, 100)}`);
  }
}

main().catch((e) => console.log(`[dt-shape] fatal: ${e}`));
