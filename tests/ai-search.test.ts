// AI-search readiness (audit of 2026-11-11). Each test pins one thing the
// audit found wrong on the live site, so it cannot quietly come back.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import robots from "../src/app/robots";
import { AI_CRAWLER_TOKENS } from "../src/lib/ai-crawlers";
import { pickFeaturedHomes } from "../src/lib/featured-pick";
import { planTitle, titleLength, TITLE_MAX, DESCRIPTION_MAX } from "../src/lib/page-title";
import { generateMetadata } from "../src/lib/seo";
import type { ApiFloorPlan } from "../src/lib/api-content";

const root = resolve(__dirname, "..");

test("robots.txt names every AI crawler in one group that keeps the private paths closed", () => {
  const rules = robots().rules as Array<{ userAgent: string | string[]; allow?: string; disallow?: string[] }>;
  const star = rules.find((r) => r.userAgent === "*");
  assert.ok(star && star.allow === "/", "everyone is allowed in");
  const ai = rules.find((r) => Array.isArray(r.userAgent));
  assert.ok(ai, "one group lists the AI crawlers");
  // A named group replaces "*" for that bot, so it must repeat the disallows.
  assert.deepEqual(ai.disallow, star.disallow);
  for (const r of rules) assert.ok(r.disallow?.includes("/admin") && r.disallow.includes("/api/"), "no group opens /admin or /api/");
  // The bots that fetch a page for a live answer, not only the training ones.
  for (const token of [
    "GPTBot", "OAI-SearchBot", "ChatGPT-User",
    "ClaudeBot", "Claude-SearchBot", "Claude-User",
    "PerplexityBot", "Perplexity-User",
    "Google-Extended", "bingbot", "Applebot", "Applebot-Extended",
    "meta-externalagent", "Amazonbot", "MistralAI-User", "DuckAssistBot", "CCBot",
  ]) {
    assert.ok((AI_CRAWLER_TOKENS as readonly string[]).includes(token), `${token} is named`);
  }
  assert.equal(new Set(AI_CRAWLER_TOKENS).size, AI_CRAWLER_TOKENS.length, "no token twice");
  // No AI crawler is ever disallowed from the whole site.
  assert.ok(!rules.some((r) => r.disallow?.includes("/")));
});

test("two lengths of one family get two different titles", () => {
  const a = planTitle("Woodward", 3, 2, "Double Wide Home", { modelNumber: "2864H32047", widthFt: 28, lengthFt: 64 });
  const b = planTitle("Woodward", 3, 2, "Double Wide Home", { modelNumber: "2868H32047", widthFt: 28, lengthFt: 68 });
  assert.notEqual(a, b);
  assert.equal(a, "Woodward 28×64 — 3 Bed 2 Bath Champion Double Wide Home");
  for (const name of ["Barkley Reverse Aisle", "Prime 1676H32P07 (2x6 walls)", "Pike", "Bay Port"]) {
    const t = planTitle(name, 4, 2.5, "Multi-Section Home", { widthFt: 32, lengthFt: 76 });
    assert.ok(titleLength(t) <= TITLE_MAX && t.startsWith(name), `${t} (${titleLength(t)})`);
  }
});

test("every page built with generateMetadata gets a description that fits a snippet", () => {
  const long = "Kitchen islands, luxury primary suites and wide-open floor plans. Browse Redman series manufactured homes from Factory Direct Homes Center in Auburn, IN, with factory-direct, line-item pricing. Champion’s Paramount plans are ordered here.";
  const meta = generateMetadata({ title: "x", description: long, url: "/series/redman" });
  for (const d of [meta.description, meta.openGraph?.description, meta.twitter?.description]) {
    assert.ok(typeof d === "string" && d.length <= DESCRIPTION_MAX && d.length > 60, String(d));
  }
  const short = generateMetadata({ title: "x", description: "Short and whole.", url: "/x" });
  assert.equal(short.description, "Short and whole.");
});

const plan = (o: Partial<ApiFloorPlan>): ApiFloorPlan => ({
  slug: "s", name: "N", title: "", price: "Call for pricing", sqft: 1500, beds: 3, baths: 2,
  image: "/i.webp", brand: "Champion Homes", homeType: "Multi-Section", series: "Aspire", ...o,
});

test("the homepage features named homes, one per family, never the four smallest singles", () => {
  const catalogue: ApiFloorPlan[] = [
    plan({ slug: "aspire-1432h11214", name: "1432H11214", modelNumber: "1432H11214", sqft: 427, beds: 1, widthFt: 14, homeType: "Single Wide" }),
    plan({ slug: "aspire-1440h11065", name: "1440H11065", modelNumber: "1440H11065", sqft: 533, beds: 1, widthFt: 14, homeType: "Single Wide" }),
    plan({ slug: "aspire-woodward-2860h32047", name: "Woodward", modelNumber: "2860H32047", widthFt: 28 }),
    plan({ slug: "aspire-woodward-2864h32047", name: "Woodward", modelNumber: "2864H32047", widthFt: 28 }),
    plan({ slug: "aspire-silverton-2856h32174", name: "Silverton", modelNumber: "2856H32174", widthFt: 28, virtualTour: "https://my.matterport.com/show/?m=x" }),
    plan({ slug: "aspire-silverton-2856m32174", name: "Silverton", modelNumber: "2856M32174", widthFt: 28, virtualTour: "https://my.matterport.com/show/?m=x" }),
    plan({ slug: "aspire-brighton-2848h32170", name: "Brighton", modelNumber: "2848H32170", widthFt: 28 }),
    plan({ slug: "prime-belmont", name: "Belmont", modelNumber: "1676H32P06", widthFt: 16, homeType: "Single Wide", series: "Prime" }),
    plan({ slug: "aspire-no-photo", name: "Ghost", image: "", widthFt: 28 }),
  ];
  const picked = pickFeaturedHomes(catalogue);
  assert.equal(picked.length, 4);
  assert.equal(picked[0].slug, "aspire-silverton-2856h32174", "a home with a 3D tour leads, as its HUD page");
  const names = picked.map((h) => h.name);
  assert.equal(new Set(names).size, 4, "one home per family");
  assert.ok(!names.some((n) => /^\d{4}[A-Z]/.test(n)), "no code-named single in the shop window");
  assert.ok(picked.every((h) => h.image), "every featured home has a photo");
  assert.equal(picked.filter((h) => h.homeType === "Single Wide").length, 1, "three multi-section, one single wide");
  assert.deepEqual(pickFeaturedHomes(catalogue).map((h) => h.slug), picked.map((h) => h.slug), "stable between renders");
  // A degraded catalogue with only code-named homes still shows four homes.
  assert.equal(pickFeaturedHomes(catalogue.slice(0, 2)).length, 2);
});

test("the homepage plan count is counted, not typed", () => {
  const src = readFileSync(resolve(root, "src/app/HomeSections.tsx"), "utf8");
  assert.ok(!/AnimatedCounter end=\{\d{3,}\}/.test(src), "no hard-coded plan count in the stats strip");
  assert.ok(/planCount=\{planCount\}/.test(readFileSync(resolve(root, "src/app/page.tsx"), "utf8")));
});

test("the IndexNow key file matches the key the script submits", () => {
  const script = readFileSync(resolve(root, "scripts/indexnow.mjs"), "utf8");
  const key = script.match(/const KEY = "([0-9a-f]{32})"/)?.[1];
  assert.ok(key, "the script carries a 32-hex key");
  const files = readdirSync(resolve(root, "public")).filter((f) => /^[0-9a-f]{32}\.txt$/.test(f));
  assert.deepEqual(files, [`${key}.txt`]);
  assert.equal(readFileSync(resolve(root, "public", files[0]), "utf8"), key, "the file holds the key and nothing else");
});

test("hand-written page descriptions fit a snippet too", () => {
  const walk = (dir: string): string[] =>
    readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
      e.isDirectory() ? walk(resolve(dir, e.name)) : /^(page|layout)\.tsx$/.test(e.name) ? [resolve(dir, e.name)] : []);
  const long: string[] = [];
  for (const file of walk(resolve(root, "src/app"))) {
    if (/[\\/]admin[\\/]/.test(file)) continue;
    const src = readFileSync(file, "utf8");
    // Only a metadata object typed out in the page: one built by
    // generateMetadata() / generateLocationMetadata() is fitted there.
    const at = src.search(/export const metadata(?::\s*Metadata)?\s*=\s*\{/);
    if (at < 0) continue;
    const m = src.slice(at, at + 1200).match(/\bdescription:\s*"((?:[^"\\]|\\.)+)"/);
    if (m && m[1].length > DESCRIPTION_MAX) long.push(`${file.slice(root.length + 1)} (${m[1].length})`);
  }
  assert.deepEqual(long, [], "keep a hand-written meta description to 160 characters, or build it with generateMetadata()");
});

test("an abbreviation's full stop does not end a description", () => {
  const meta = generateMetadata({
    title: "x", url: "/x",
    description: "Meet Champion Homes and the series we sell: Aspire, Prime, and Redman. How factory-built homes are made, HUD vs. IRC code, quality, warranty and what each series is for, explained by the dealer.",
  });
  assert.ok(!/\bvs\.$/.test(String(meta.description)), String(meta.description));
});
