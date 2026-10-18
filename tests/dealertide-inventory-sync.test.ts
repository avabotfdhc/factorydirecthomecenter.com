// The DealerTide inventory sync that runs on the website (2026-10-18), against
// a scripted fake of DealerTide's /public/inventory and a fake PostgREST. No
// network, no real token.
import { test, before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import {
  dealertideEnvNames,
  homesOf,
  inventoryToken,
  modelCodeOf,
  runInventorySync,
  sameList,
  tokenFromFeedUrl,
  urlList,
} from "../src/lib/dealertide-inventory-sync";

test("tokenFromFeedUrl / inventoryToken: the explicit var wins, else the token inside the feed URL", () => {
  assert.equal(tokenFromFeedUrl("https://api.dealertide.com/public/inventory?token=abc123&per_page=50"), "abc123");
  assert.equal(tokenFromFeedUrl("https://api.dealertide.com/public/inventory"), "");
  assert.equal(tokenFromFeedUrl("not a url"), "");
  assert.equal(tokenFromFeedUrl(undefined), "");
  assert.equal(inventoryToken({ DEALERTIDE_INVENTORY_TOKEN: " t1 ", DEALERTIDE_FEED_URL: "https://x/y?token=t2" }), "t1");
  assert.equal(inventoryToken({ DEALERTIDE_FEED_URL: "https://x/y?token=t2" }), "t2");
  assert.equal(inventoryToken({}), "");
  // Other names it may have been pasted under, as a bare token or a URL.
  assert.equal(inventoryToken({ DEALERTIDE_INVENTORY_KEY: "k9" }), "k9");
  assert.equal(inventoryToken({ DEALERTIDE_FEED_TOKEN: "k8" }), "k8");
  assert.equal(inventoryToken({ DEALERTIDE_INVENTORY_URL: "https://api.dealertide.com/public/inventory?token=k7&per_page=50" }), "k7");
  // The partner (lead) key is never a candidate, and a value with spaces or
  // query characters that is not a URL is not a token.
  assert.equal(inventoryToken({ DEALERTIDE_API_KEY: "lead-key", DEALERTIDE_API_BASE: "https://x" }), "");
  assert.equal(inventoryToken({ DEALERTIDE_TOKEN: "not a token" }), "");
  // Production's real names (2026-10-18): mixed case, and a feed-URL variable
  // whose name lost its last letter.
  assert.equal(inventoryToken({ Dealertide_Inventory_Key: "k6" }), "k6");
  assert.equal(inventoryToken({ DEALERTIDE_FEED_UR: "https://api.dealertide.com/public/inventory?token=k5" }), "k5");
  assert.equal(inventoryToken({ DEALERTIDE_FEED_UR: "https://x/feed.json" }), "", "a URL with no token is not a token");
  assert.equal(inventoryToken({ Dealertide_website_leads: "https://x/?token=no", DEALERTIDE_API_KEY: "https://x/?token=no" }), "", "lead-related names are never read");
  assert.deepEqual(dealertideEnvNames({ DEALERTIDE_API_KEY: "x", PATH: "/bin", RENTERINSIGHT_X: "y", NEXT_PUBLIC_X: "z" }), ["DEALERTIDE_API_KEY", "RENTERINSIGHT_X"]);
});

test("modelCodeOf: Champion codes from any of the fields DealerTide might use, upper-cased", () => {
  assert.equal(modelCodeOf({ model_number: "2852h32169" }), "2852H32169");
  assert.equal(modelCodeOf({ title: "2026 Champion Appleton 2842H32388 — 3BR/2.0BA" }), "2842H32388");
  assert.equal(modelCodeOf({ catalog_model: { model: "1456H22P01" } }), "1456H22P01");
  assert.equal(modelCodeOf({ title: "Prime Monte" }), null);
  // DealerTide's real shape (2026-10-18): the code is `identifier`, and some
  // end in a letter-digit-letter suffix.
  assert.equal(modelCodeOf({ identifier: "2852H32A1C", model: "52' Summit", trim: "Aspire" }), "2852H32A1C");
  assert.equal(modelCodeOf({ identifier: "2856H32392", display_name: "2026 Dutch Housing Belvidere" }), "2856H32392");
  assert.equal(modelCodeOf({ identifier: "MH-20260306-F811B5", display_name: "2026 Champion Appleton 2842 H32388" }), "2842H32388");
  assert.equal(modelCodeOf({ identifier: "MH-20260604-016065", display_name: "2026 Champion Chp 2868 H42 P01" }), "2868H42P01");
  assert.equal(modelCodeOf({ identifier: "MH-20260504-AF76E5", display_name: "2026 Dutch Housing Aspire Belvidere" }), null);
});

test("urlList / sameList / homesOf: the feed's shapes", () => {
  assert.deepEqual(urlList(["https://a/1.jpg", { url: "https://a/2.jpg" }, "ftp://no", 7]), ["https://a/1.jpg", "https://a/2.jpg"]);
  assert.deepEqual(urlList("https://a/1.jpg"), []);
  assert.equal(sameList(["a", "b"], ["a", "b"]), true);
  assert.equal(sameList(["a", "b"], ["b", "a"]), false);
  assert.deepEqual(homesOf({ data: [{ id: 1 }] }), [{ id: 1 }]);
  assert.deepEqual(homesOf([{ id: 2 }]), [{ id: 2 }]);
  assert.deepEqual(homesOf({ meta: {} }), []);
});

// ── end to end against fakes ────────────────────────────────────────────────
let server: http.Server;
let base = "";
type Req = { method: string; url: string; headers: http.IncomingHttpHeaders; body: string };
const calls: Req[] = [];
let feedPages: Record<number, unknown> = {};
let stored: unknown[] = [];
let detailStatus: Record<string, number> = {};

before(async () => {
  server = http.createServer((req, res) => {
    let raw = "";
    req.on("data", (c) => (raw += c));
    req.on("end", () => {
      calls.push({ method: req.method ?? "", url: req.url ?? "", headers: req.headers, body: raw });
      const u = new URL(req.url ?? "/", "http://x");
      const json = (status: number, body: unknown) => {
        res.writeHead(status, { "content-type": "application/json" });
        res.end(JSON.stringify(body));
      };
      if (u.pathname === "/feed") return json(200, feedPages[Number(u.searchParams.get("page"))] ?? { data: [] });
      if (u.pathname.startsWith("/feed/")) return json(detailStatus[u.pathname.slice(6)] ?? 200, {});
      if (u.pathname === "/rest/v1/dealertide_sync_runs" && req.method === "POST") return json(201, [{ id: 7 }]);
      if (u.pathname === "/rest/v1/dealertide_sync_runs" && req.method === "PATCH") return json(204, null);
      if (u.pathname === "/rest/v1/dealertide_inventory" && req.method === "GET") return json(200, stored);
      if (u.pathname === "/rest/v1/dealertide_inventory") return json(req.method === "POST" ? 201 : 204, null);
      return json(404, { error: "unexpected " + u.pathname });
    });
  });
  await new Promise<void>((r) => server.listen(0, "127.0.0.1", () => r()));
  base = `http://127.0.0.1:${(server.address() as { port: number }).port}`;
});
after(() => server.close());
beforeEach(() => {
  calls.length = 0;
  feedPages = {};
  stored = [];
  detailStatus = {};
});

const run = () => runInventorySync({ token: "secret-token", supabaseUrl: base, serviceKey: "svc", api: `${base}/feed` });

test("stages every page, flags media changes, removes only on a 410, and never leaks the token", async () => {
  feedPages = {
    1: { meta: { total_pages: 2, total: 3 }, data: [
      { id: "a", title: "Champion Appleton 2842H32388", status: "available", image_urls: ["https://p/a1.jpg"], floor_plan_images: [] },
      { id: "b", title: "Prime Monte", status: "available_to_order", image_urls: [{ url: "https://p/b1.jpg" }], floor_plan_images: ["https://p/bfp.jpg"] },
    ] },
    2: { meta: { total_pages: 2, total: 3 }, data: [
      { id: "c", identifier: "1456H22P01", display_name: "2026 Champion Monte", image_urls: [], floor_plan_images: [] },
    ] },
  };
  stored = [
    { id: "a", image_urls: ["https://p/a0.jpg"], floor_plan_images: [], media_changed_at: null, removed_at: null },
    { id: "gone", image_urls: [], floor_plan_images: [], media_changed_at: null, removed_at: null },
    { id: "kept", image_urls: [], floor_plan_images: [], media_changed_at: null, removed_at: null },
  ];
  detailStatus = { gone: 410, kept: 404 };

  const { status, summary } = await run();
  assert.equal(status, 200, JSON.stringify(summary));
  assert.equal(summary.ok, true);
  assert.equal(summary.pages, 2);
  assert.equal(summary.homes, 3);
  assert.equal(summary.added, 2, "b and c are new");
  assert.equal(summary.media_changed, 1, "a's photo list changed");
  assert.equal(summary.removed, 1, "only the 410 is removed");
  assert.match(String(summary.note), /kept \(HTTP 404\)/);
  assert.equal(summary.with_model_code, 2);

  const upserts = calls.filter((c) => c.url.startsWith("/rest/v1/dealertide_inventory?on_conflict=id"));
  assert.equal(upserts.length, 1);
  assert.match(String(upserts[0].headers.prefer), /merge-duplicates/);
  const rows = JSON.parse(upserts[0].body) as Record<string, unknown>[];
  assert.deepEqual(rows.map((r) => r.id), ["a", "b", "c"]);
  assert.equal(rows[0].model_code, "2842H32388");
  assert.equal(rows[1].model_code, null);
  assert.equal(rows[2].model_code, "1456H22P01");
  assert.equal(rows[2].title, "2026 Champion Monte");
  assert.deepEqual(rows[1].image_urls, ["https://p/b1.jpg"]);
  assert.ok(rows[0].media_changed_at, "a is flagged");
  assert.equal(rows[1].media_changed_at, null);

  const removal = calls.find((c) => c.method === "PATCH" && c.url.includes("dealertide_inventory?id=in."));
  assert.ok(removal, "removal PATCH sent");
  assert.match(decodeURIComponent(removal!.url), /"gone"/);
  assert.ok(!decodeURIComponent(removal!.url).includes("kept"));

  const runPatch = calls.find((c) => c.method === "PATCH" && c.url.includes("dealertide_sync_runs?id=eq.7"));
  assert.ok(runPatch, "run row finished");
  assert.equal(JSON.parse(runPatch!.body).ok, true);

  const feedCalls = calls.filter((c) => c.url.startsWith("/feed"));
  assert.equal(feedCalls.length, 4, "2 pages + 2 detail checks");
  assert.ok(feedCalls.every((c) => c.url.includes("token=secret-token")));
  for (const c of calls.filter((c) => c.url.startsWith("/rest/"))) {
    assert.equal(c.headers.apikey, "svc");
    assert.ok(!c.body.includes("secret-token") && !c.url.includes("secret-token"), "token never reaches Supabase");
  }
  assert.ok(!JSON.stringify(summary).includes("secret-token"), "token never in the summary");
});

test("a feed error is recorded on the run row and answered with 502, nothing written", async () => {
  feedPages = {}; // page 1 → { data: [] }
  const { status, summary } = await run();
  assert.equal(status, 502);
  assert.equal(summary.ok, false);
  assert.match(String(summary.error), /no homes/);
  assert.equal(calls.filter((c) => c.url.includes("on_conflict")).length, 0);
  const runPatch = calls.find((c) => c.method === "PATCH" && c.url.includes("dealertide_sync_runs"));
  assert.equal(JSON.parse(runPatch!.body).ok, false);
  assert.match(JSON.parse(runPatch!.body).note, /no homes/);
});

test("an incomplete pull skips removals", async () => {
  feedPages = { 1: { meta: { total_pages: 1, total: 5 }, data: [{ id: "a", image_urls: [], floor_plan_images: [] }] } };
  stored = [{ id: "gone", image_urls: [], floor_plan_images: [], media_changed_at: null, removed_at: null }];
  detailStatus = { gone: 410 };
  const { summary } = await run();
  assert.equal(summary.ok, true);
  assert.equal(summary.removed, 0);
  assert.match(String(summary.note), /incomplete/);
  assert.equal(calls.filter((c) => c.url.startsWith("/feed/")).length, 0, "no detail calls on an incomplete pull");
});
