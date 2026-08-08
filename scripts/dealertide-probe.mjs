// TEMPORARY discovery probe for the DealerTide / Renter Insight API.
//
// DealerTide publishes no API docs, and the coding sandbox has no network
// access to it — but Vercel's build machines do, and this repo's build logs
// are readable. So this script runs before `next build` (see package.json),
// tries the plausible hosts/endpoints/auth schemes with the key from
// DEALERTIDE_API_KEY, and prints compact results to the build log.
// It NEVER fails the build and does nothing when the key is absent.
// Remove this file + the package.json hook once the real endpoints are known.

const KEY = process.env.DEALERTIDE_API_KEY;

const HOSTS = [
  "https://api.dealertide.com",
  "https://app.dealertide.com/api",
  "https://api.renterinsight.com",
  "https://dms.landlordinsight.com/api",
];

const PATHS = [
  "/",
  "/v1",
  "/v1/inventory",
  "/inventory",
  "/v1/homes",
  "/homes",
  "/v1/units",
  "/units",
  "/v1/listings",
  "/listings",
  "/v1/models",
];

const AUTHS = [
  ["Authorization", (k) => `Bearer ${k}`],
  ["X-API-Key", (k) => k],
];

async function probe(url, headerName, headerValue) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), 8000);
  try {
    const res = await fetch(url, {
      headers: { [headerName]: headerValue, Accept: "application/json" },
      signal: ctl.signal,
      redirect: "manual",
    });
    const body = (await res.text()).replace(/\s+/g, " ").slice(0, 250);
    return `${res.status} ${res.headers.get("content-type") || ""} :: ${body}`;
  } catch (err) {
    return `ERR ${String(err?.cause?.code || err?.name || err).slice(0, 80)}`;
  } finally {
    clearTimeout(t);
  }
}

async function main() {
  if (!KEY) {
    console.log("[dealertide-probe] DEALERTIDE_API_KEY not set — skipping");
    return;
  }
  console.log(`[dealertide-probe] key present (${KEY.slice(0, 8)}…${KEY.slice(-4)}), starting`);

  // Pass 1: find hosts that resolve at all (one cheap request each).
  const liveHosts = [];
  for (const host of HOSTS) {
    const r = await probe(`${host}/`, "Accept", "application/json");
    console.log(`[dealertide-probe] HOST ${host} -> ${r}`);
    if (!r.startsWith("ERR ENOTFOUND") && !r.startsWith("ERR EAI_AGAIN")) liveHosts.push(host);
  }

  // Pass 2: endpoints × auth on live hosts.
  for (const host of liveHosts) {
    for (const path of PATHS) {
      for (const [h, fv] of AUTHS) {
        const r = await probe(`${host}${path}`, h, fv(KEY));
        console.log(`[dealertide-probe] ${h === "X-API-Key" ? "xkey" : "bear"} ${host}${path} -> ${r}`);
      }
    }
  }
  console.log("[dealertide-probe] done");
}

main().catch((e) => console.log(`[dealertide-probe] fatal: ${e}`));
