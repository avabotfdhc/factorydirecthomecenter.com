// Tell Bing (and every other IndexNow engine: Yandex, Seznam, Naver) which
// URLs changed, so they are re-crawled in minutes instead of days.
//
// Why it matters for AI search: Microsoft Copilot answers from Bing's index,
// and ChatGPT search leans on it too. Google does not use IndexNow; it has the
// sitemap and Search Console.
//
//   npm run indexnow                      every URL in the live sitemap
//   npm run indexnow -- --since=2026-11-01  only URLs whose lastmod is on/after
//   npm run indexnow -- /faq /financing     just these paths
//   add --dry-run to print the list without sending
//
// The key is public by design: IndexNow proves ownership by fetching
// https://<host>/<key>.txt, which is public/53b328e1b5de9cfb6cd2cb4f72aa43cf.txt in this repo.
// Run it after a deploy that changed content. Not a build step: IndexNow asks
// for changed URLs only, and a submit-everything-on-every-push would be noise.

const HOST = "factorydirecthomescenter.com";
const KEY = "53b328e1b5de9cfb6cd2cb4f72aa43cf";
const ORIGIN = `https://${HOST}`;

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const since = args.find((a) => a.startsWith("--since="))?.slice(8);
const paths = args.filter((a) => a.startsWith("/"));

async function sitemapUrls() {
  const res = await fetch(`${ORIGIN}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap.xml answered ${res.status}`);
  const xml = await res.text();
  const out = [];
  for (const block of xml.split("<url>").slice(1)) {
    const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1];
    const lastmod = block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1];
    if (!loc) continue;
    if (since && !(lastmod && lastmod.slice(0, 10) >= since)) continue;
    out.push(loc);
  }
  return out;
}

const urlList = paths.length ? paths.map((p) => ORIGIN + p) : await sitemapUrls();
console.log(`[indexnow] ${urlList.length} URL(s)${since ? ` changed since ${since}` : ""}`);
if (dryRun || urlList.length === 0) {
  for (const u of urlList) console.log("  " + u);
  process.exit(0);
}

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `${ORIGIN}/${KEY}.txt`, urlList }),
});
// 200 = accepted, 202 = accepted, key check pending. 403 = key file not
// reachable yet (deploy first). 422 = a URL is not on this host.
console.log(`[indexnow] api.indexnow.org answered ${res.status} ${res.statusText}`);
process.exit(res.ok ? 0 : 1);
