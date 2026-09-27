// The Paramount line is retired, and no visitor or crawler may hit a dead end
// because of it.
//
// Kyle, 2026-09-26: "remove Paramount Series and the floor plans associated
// with it ... However I would like to make sure we do everything we can to
// capture leads and website traffic for Redman and Paramount Series." Those two
// halves only hold together if every retired URL 301s to something live: 186
// Paramount plan pages were indexed, and deleting them outright would have
// thrown away the traffic the same sentence asks to keep.
//
// What each test here protects:
//   - every retired URL has exactly one redirect, and it points somewhere real
//   - nothing on the site links to a retired URL (a 301 is for outside traffic,
//     not for our own navigation)
//   - no public page offers Paramount as a series a buyer can order
//   - the Redman hub carries the Paramount term, so the search that used to
//     find the Paramount page finds this one
//
//   npm test

import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import {
  RETIRED_PARAMOUNT_TAILS,
  PARAMOUNT_WITHOUT_SUCCESSOR,
  RETIRED_SERIES_HUB,
  isRetiredPlanSlug,
  isRetiredSeries,
  paramountDestination,
  retiredSeriesRedirects,
} from "../src/lib/retired-series";
import { legacyFloorPlanRedirects } from "../src/lib/legacy-redirects";
import { seriesHubs, getSeriesHub } from "../src/lib/series-hubs";
import { sitePages, getAllPages } from "../src/lib/pages";
import { CATALOG_INDEX } from "../src/lib/catalog-index";

function sourceFiles(dir = "src"): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) out.push(...sourceFiles(p));
    else if (/\.tsx?$/.test(p)) out.push(p);
  }
  return out;
}
const files = sourceFiles();
const read = (f: string) => readFileSync(f, "utf8");

// ---------- the data itself ----------

test("the retired list is the catalogue snapshot it claims to be", () => {
  assert.equal(RETIRED_PARAMOUNT_TAILS.length, 186, "186 Paramount plans were active when the line was retired");
  assert.equal(new Set(RETIRED_PARAMOUNT_TAILS).size, 186, "duplicate slug in the retired list");
  assert.equal(PARAMOUNT_WITHOUT_SUCCESSOR.size, 22, "22 homes existed only as Paramount");
  for (const tail of PARAMOUNT_WITHOUT_SUCCESSOR) {
    assert.ok(
      RETIRED_PARAMOUNT_TAILS.includes(tail),
      `${tail} has no successor but is not in the retired list — it would never be redirected`,
    );
  }
});

test("every retired plan has exactly one redirect, to a live destination", () => {
  const sources = retiredSeriesRedirects.map((r) => r.source);
  assert.equal(new Set(sources).size, sources.length, "a retired URL is redirected twice — the first match wins silently");

  for (const tail of RETIRED_PARAMOUNT_TAILS) {
    const source = `/floor-plans/paramount-${tail}`;
    const hits = retiredSeriesRedirects.filter((r) => r.source === source);
    assert.equal(hits.length, 1, `${source} needs exactly one redirect`);
    assert.equal(hits[0].permanent, true, `${source} must be a 301: a 302 hands Google nothing`);

    const dest = hits[0].destination;
    if (PARAMOUNT_WITHOUT_SUCCESSOR.has(tail)) {
      assert.equal(dest, RETIRED_SERIES_HUB, `${tail} has no surviving home, so it belongs on the hub`);
    } else {
      assert.equal(dest, `/floor-plans/aspire-${tail}`, `${tail} should land on the Aspire page for the same model`);
      // That the 164 destinations exist and are active was verified in SQL
      // against floor_plans before this list was written (164 matched the slug
      // rule, 0 broke it, 0 destinations missing or inactive). A test cannot
      // re-check it: the CMS publishes plans the repo data files do not mirror,
      // so the repo is not a complete offline record. Re-verify with the query
      // recorded in src/lib/retired-series.ts if the catalogue is reshuffled.
      assert.ok(!isRetiredPlanSlug(dest.replace("/floor-plans/", "")), `${tail} redirects to another retired page`);
    }
  }

  const hub = retiredSeriesRedirects.find((r) => r.source === "/series/paramount");
  assert.ok(hub, "/series/paramount was an indexed page and must 301");
  assert.equal(hub!.destination, RETIRED_SERIES_HUB);
});

test("a retired slug and a retired series are both recognised", () => {
  assert.ok(isRetiredPlanSlug("paramount-stafford-2868h32179"));
  assert.ok(isRetiredPlanSlug(`paramount-${RETIRED_PARAMOUNT_TAILS[0]}`));
  assert.ok(!isRetiredPlanSlug("aspire-stafford-2868h32179"), "the surviving Aspire page must stay reachable");
  assert.ok(!isRetiredPlanSlug("prime-peak"));
  assert.ok(isRetiredSeries("Paramount"));
  assert.ok(isRetiredSeries("Paramount Series"), "a loosely spelled CMS label must still be caught");
  assert.ok(!isRetiredSeries("Aspire"));
  assert.ok(!isRetiredSeries("Redman"));
  assert.ok(!isRetiredSeries(""));
  assert.ok(!isRetiredSeries(undefined));

  // The destination rule, checked on one home of each kind rather than only
  // through the list the same function generated.
  assert.equal(paramountDestination("stafford-2868h32179"), RETIRED_SERIES_HUB);
  assert.equal(paramountDestination("bayfield-2852h32169"), "/floor-plans/aspire-bayfield-2852h32169");
});

// ---------- nothing points at a retired URL ----------

test("no redirect lands on another redirect", () => {
  const retiredSources = new Set(retiredSeriesRedirects.map((r) => r.source));
  for (const r of [...legacyFloorPlanRedirects, ...retiredSeriesRedirects]) {
    assert.ok(
      !retiredSources.has(r.destination),
      `${r.source} redirects to ${r.destination}, which redirects again — point it at the final URL`,
    );
  }
});

test("nothing on the site links to a retired URL", () => {
  const offenders: string[] = [];
  for (const f of files) {
    if (f === "src/lib/retired-series.ts") continue; // the redirect list names them by definition
    const text = read(f);
    text.split("\n").forEach((line, i) => {
      if (/["'(]\/series\/paramount\b/.test(line)) offenders.push(`${f}:${i + 1} links /series/paramount`);
      if (/["'(]\/floor-plans\/paramount-/.test(line)) offenders.push(`${f}:${i + 1} links a retired plan page`);
    });
  }
  assert.deepEqual(offenders, [], "these link to a URL that 301s — link the destination instead");
});

test("the page registry does not advertise the retired series", () => {
  const advertised = getAllPages().map((p) => p.url);
  assert.ok(!advertised.includes("/series/paramount"), "a 301'd URL must not be in the sitemap or Related Resources");
  assert.ok(advertised.includes(RETIRED_SERIES_HUB), "the destination hub has to be registered to be linkable");
});

test("no series hub publishes a retired series", () => {
  for (const hub of seriesHubs) {
    assert.ok(!isRetiredSeries(hub.name), `the ${hub.name} hub is a retired series`);
    assert.ok(hub.slug !== "paramount", "/series/paramount still generates a page, so the 301 can never run");
    for (const s of hub.catalogSeries) {
      assert.ok(!isRetiredSeries(s), `the ${hub.name} hub still lists ${s} homes`);
    }
  }
});

// ---------- the traffic actually lands somewhere useful ----------

test("the Redman hub is the destination, and it answers for Paramount", () => {
  const redman = getSeriesHub("redman");
  assert.ok(redman, "the redirect destination must exist");
  assert.equal(RETIRED_SERIES_HUB, "/series/redman");

  // A visitor 301'd off a Paramount URL has to be told what happened, or the
  // page looks like the wrong one and they leave.
  assert.ok(redman!.formerly, "the hub must explain where Paramount went");
  assert.equal(redman!.formerly!.name, "Paramount");
  assert.match(redman!.intro, /Paramount/, "the hub has to carry the term people search for");

  // The 22 homes that only came as Paramount land here, so the page has to
  // name them — otherwise it is a dead end with a form on it.
  assert.ok(redman!.quoteOnRequest && redman!.quoteOnRequest.length >= 6, "name the homes we still order");
  const named = redman!.quoteOnRequest!.map((q) => q.name.toLowerCase().replace(/\s+/g, "-"));
  for (const family of ["stafford", "fenton", "apollo", "red-cedar", "alberta", "myrtle"]) {
    assert.ok(named.includes(family), `${family} only ever came as Paramount and must be offered here`);
    assert.ok(
      [...PARAMOUNT_WITHOUT_SUCCESSOR].some((t) => t.startsWith(family)),
      `${family} is offered on the hub but is not one of the homes that lost its page`,
    );
  }
});

test("the registry keeps the Paramount topic on the Redman hub", () => {
  const entry = sitePages.find((p) => p.url === RETIRED_SERIES_HUB);
  assert.ok(entry, "the hub must be in the registry");
  assert.ok(
    entry!.topics.includes("paramount"),
    "without the topic, a page about the old range cannot surface its replacement in Related Resources",
  );
});

// ---------- no page offers Paramount as something to buy ----------

test("no page offers a Paramount series a buyer could order", () => {
  // Data files keep Paramount slugs and asset paths on purpose: they are the
  // offline record of the retired homes and the photo filenames on disk, and
  // api-content.ts filters them out of everything a visitor sees.
  const DATA = new Set([
    "src/lib/retired-series.ts",
    "src/lib/paramount-floor-plans.ts",
    "src/lib/aspire-floor-plans.ts",
    "src/lib/local-floor-plans.ts",
    "src/lib/gallery-overlays.ts",
    "src/lib/spec-overrides.ts",
    "src/lib/model-catalog.ts",
    "src/lib/paramount-content.ts",
    "src/lib/sale-homes.ts",
    "src/lib/series.ts",       // keyword detection: the label must be recognised to be filtered
    "src/lib/catalog-index.ts",
    "src/lib/image-alt.ts",    // strips the word out of legacy photo filenames
    "src/lib/home-video.ts",
    "src/lib/brochures.ts",
  ]);
  const OFFERS = [
    /\bParamount\s+(?:Series|series)\b(?![^.]*\bretired\b)/,
    /\b(?:sell|order|offer|carry|browse)\s+(?:the\s+)?Paramount\b/i,
    /\bParamount\s+(?:homes|plans|floor plans|lineup|line)\b/i,
  ];
  const offenders: string[] = [];
  for (const f of files) {
    if (DATA.has(f)) continue;
    read(f).split("\n").forEach((line, i) => {
      if (!/paramount/i.test(line)) return;
      // An explicit "we no longer publish / used to list" sentence is the point.
      if (/no longer|used to|once listed|retired|formerly|Redman Paramount|there is no Paramount/i.test(line)) return;
      for (const re of OFFERS) {
        if (re.test(line)) offenders.push(`${f}:${i + 1} ${line.trim().slice(0, 110)}`);
      }
    });
  }
  assert.deepEqual(offenders, [], "these read as an offer to sell a Paramount home");
});

test("the catalogue index sends no model to a retired page", () => {
  const bad = Object.entries(CATALOG_INDEX).filter(
    ([, e]) => isRetiredPlanSlug(e.slug) || isRetiredSeries(e.series),
  );
  assert.deepEqual(bad, [], "the sale page would link to a retired plan page");
});
