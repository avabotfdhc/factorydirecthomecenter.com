// Search Console, 2026-10-14: ~150 `?lang=es` / `?lang=my` URLs were crawled as
// 200 duplicates of English pages (the server always renders English; the
// language lives in the NEXT_LOCALE cookie). src/proxy.ts now 308s them to the
// clean URL and keeps the visitor's choice in the cookie. The same report had
// /index serving a copy of the homepage and an old PDF URL answering 404.
//
//   npm test

import { test } from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { proxy, config } from "../src/proxy";
import nextConfig from "../next.config";

test("?lang= redirects permanently to the clean URL and remembers the language", () => {
  const res = proxy(new NextRequest("https://factorydirecthomescenter.com/about?lang=es&utm_source=x"));
  assert.equal(res.status, 308);
  assert.equal(res.headers.get("location"), "https://factorydirecthomescenter.com/about?utm_source=x");
  assert.equal(res.cookies.get("NEXT_LOCALE")?.value, "es");
});

test("an unknown ?lang= value is stripped without setting a cookie", () => {
  const res = proxy(new NextRequest("https://factorydirecthomescenter.com/floor-plans?lang=xx"));
  assert.equal(res.status, 308);
  assert.equal(res.headers.get("location"), "https://factorydirecthomescenter.com/floor-plans");
  assert.equal(res.cookies.get("NEXT_LOCALE"), undefined);
});

test("pages without ?lang= pass straight through", () => {
  const res = proxy(new NextRequest("https://factorydirecthomescenter.com/contact-us?home=aspire-1432h11214"));
  assert.equal(res.headers.get("location"), null);
  assert.notEqual(res.status, 308);
});

test("the proxy only runs on ?lang= requests and /admin", () => {
  const matchers = config.matcher.map((m) => (typeof m === "string" ? m : JSON.stringify(m)));
  assert.ok(matchers.includes("/admin/:path*"));
  const lang = config.matcher.find((m) => typeof m !== "string");
  assert.deepEqual(lang && typeof lang !== "string" ? lang.has : null, [{ type: "query", key: "lang" }]);
});

test("/index and the old /special-plans PDFs redirect permanently", async () => {
  const redirects = await nextConfig.redirects!();
  const find = (source: string) => redirects.find((r) => r.source === source);
  assert.equal(find("/index")?.destination, "/");
  assert.equal(find("/index")?.permanent, true);
  assert.equal(find("/special-plans/details/features/:file*")?.permanent, true);
  assert.ok(redirects.every((r) => !("permanent" in r) || r.permanent === true), "every redirect should be permanent");
});
