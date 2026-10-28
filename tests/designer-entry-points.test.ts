// Design Your Home is offered from every plan page, every catalogue card and
// the listing pages, and every one of those doors is built from the same two
// helpers. These tests hold:
//
// - the link shape (/design-your-home?home=&siding=&src=) and the image URL
// - the base exterior a home is drawn in before anyone has picked anything
// - the SVG image route: a standalone document, cached, noindex, never a script
// - that each page that should carry an entry point still does (source scan)
// - that the designer honours ?siding= only through its catalogue check

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { designerHref, elevationImageUrl, homeLabel } from "../src/lib/designer-link";
import { defaultChoices, defaultSiding, showcaseSidings, sidingByLabel } from "../src/lib/elevation-defaults";
import { exteriorCatalog } from "../src/lib/exterior-options";
import { renderElevationSvg } from "../src/lib/elevation-svg";
import { sheetElevation } from "../src/lib/plan-elevation";
import { GET as imageRoute } from "../src/app/api/plan-elevation/image/route";

const read = (p: string) => readFileSync(p, "utf8");

test("designer links carry the plan, the colour and the placement, and nothing else", () => {
  assert.equal(designerHref(), "/design-your-home");
  assert.equal(designerHref("prime-ridge"), "/design-your-home?home=prime-ridge");
  assert.equal(designerHref("prime-ridge", { siding: "Light Blue", src: "plan_page_swatch" }), "/design-your-home?home=prime-ridge&siding=Light+Blue&src=plan_page_swatch");
  const url = new URL(elevationImageUrl({ modelNumber: "2856H32103", name: "Woodward", series: "Aspire", homeType: "Multi-Section", widthFt: 28, lengthFt: 56, beds: 3 }, { siding: "Cypress", view: "rear" }), "https://x");
  assert.equal(url.pathname, "/api/plan-elevation/image");
  assert.deepEqual(Object.fromEntries(url.searchParams), { model: "2856H32103", series: "Aspire", type: "Multi-Section", width: "28", length: "56", beds: "3", view: "rear", siding: "Cypress", name: "Woodward" });
  // the front view is the default and is not spelled out
  assert.ok(!elevationImageUrl({ modelNumber: "X" }).includes("view="));
  assert.equal(homeLabel({ name: "Woodward", modelNumber: "2856H32103" }), "the Woodward");
  assert.equal(homeLabel({ name: "1676H32107", modelNumber: "1676H32107" }), "model 1676H32107");
});

test("a home is first drawn in a standard mid-tone colour with the standard door, for both boards", () => {
  for (const [series, type] of [["Prime", "Single Wide"], ["Aspire", "Multi-Section"], ["Aspire", "Single Wide"], ["Aspire", "Modular"]] as const) {
    const cat = exteriorCatalog(series, type, type === "Single Wide" ? 16 : 28);
    const c = defaultChoices(cat);
    assert.ok(!c.siding.upgrade, `${series} ${type}: the starting siding is a standard colour, not an upgrade`);
    assert.equal(c.siding.label, "Flint", `${series}: both boards carry Flint, so both start there`);
    assert.equal(c.door, (cat.doors.find((d) => d.standard) || cat.doors[0]).id, "the standard door");
    assert.equal(c.shutter.label, "Black");
    assert.equal(c.windowGrids, cat.windowGrids);
    assert.deepEqual(c.features, {});
    assert.deepEqual(c.addedDoors, []);
    assert.equal(c.blackPackage, false, "never an option the quote would add");
    const show = showcaseSidings(cat, 4);
    assert.equal(show[0].label, defaultSiding(cat).label);
    assert.ok(show.length <= 4 && show.every((s) => !s.upgrade));
    assert.equal(new Set(show.map((s) => s.label)).size, show.length, "no colour twice");
  }
  const prime = exteriorCatalog("Prime", "Single Wide", 16);
  assert.equal(sidingByLabel(prime, "light blue")?.label, "Light Blue", "labels match case-insensitively");
  assert.equal(sidingByLabel(prime, "Dublin"), null, "an Aspire-only colour is not on the Prime board");
  assert.equal(defaultChoices(prime, { siding: "Dublin" }).siding.label, "Flint", "an unknown label falls back to the default");
  assert.equal(defaultChoices(prime, { siding: "Clay" }).siding.label, "Clay");
});

test("the SVG renderer produces a standalone document", async () => {
  const plan = sheetElevation("1676H32P01");
  assert.ok(plan);
  const cat = exteriorCatalog("Prime", "Single Wide", 16);
  const svg = await renderElevationSvg({ plan, choices: defaultChoices(cat), view: "front", title: `Ridge <front> & "more"` });
  assert.ok(svg.startsWith('<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg"'), svg.slice(0, 120));
  assert.ok(svg.includes("<title>Ridge &lt;front&gt; &amp; &quot;more&quot;</title>"), "the title is escaped");
  assert.ok(svg.includes("viewBox="), "keeps the viewBox so an <img> scales it");
  assert.ok(!/<script/i.test(svg) && !/\son\w+=/i.test(svg), "no script, no handlers");
  assert.ok(svg.endsWith("</svg>"));
});

test("the image route answers an SVG with cache and noindex headers, and 404s a plan it cannot draw", async () => {
  const base = "https://factorydirecthomescenter.com/api/plan-elevation/image";
  const ok = await imageRoute(new Request(`${base}?model=1676H32P01&series=Prime&type=Single%20Wide&width=16&length=76&beds=3&siding=Clay&name=Ridge`));
  assert.equal(ok.status, 200);
  assert.match(ok.headers.get("content-type") || "", /^image\/svg\+xml/);
  assert.match(ok.headers.get("cache-control") || "", /public/);
  assert.equal(ok.headers.get("x-robots-tag"), "noindex");
  const body = await ok.text();
  assert.ok(body.startsWith("<?xml"));
  assert.ok(body.includes("Clay siding"), "the title names the colour it was asked for");
  assert.ok(body.includes("front elevation"));

  const rear = await imageRoute(new Request(`${base}?model=1676H32P01&series=Prime&view=rear`));
  assert.ok((await rear.text()).includes("rear elevation"));
  const bogusView = await imageRoute(new Request(`${base}?model=1676H32P01&series=Prime&view=<b>`));
  assert.ok((await bogusView.text()).includes("front elevation"), "an unknown view falls back to the front");
  const bogusSiding = await imageRoute(new Request(`${base}?model=1676H32P01&series=Prime&siding=Neon`));
  assert.ok((await bogusSiding.text()).includes("Flint siding"), "an unknown colour falls back to the board's default");

  // no model and no size: nothing to draw
  const none = await imageRoute(new Request(`${base}?model=NOPE`));
  assert.equal(none.status, 404);
  // a size with no sheet still draws the representative layout
  const rep = await imageRoute(new Request(`${base}?model=NOPE&width=16&length=66&beds=3`));
  assert.equal(rep.status, 200);
});

test("every plan page, card and listing page offers the designer, through the tracked link", () => {
  const planPage = read("src/app/floor-plans/[slug]/page.tsx");
  assert.ok(/<DesignThisHome\b/.test(planPage), "the plan page renders the teaser");
  const teaser = read("src/components/DesignThisHome.tsx");
  assert.ok(/src="plan_page"/.test(teaser) && /src="plan_page_swatch"/.test(teaser));
  assert.ok(/elevationImageUrl\(/.test(teaser), "the teaser draws the home through the image route");
  assert.ok(/illustration/i.test(teaser), "the teaser says the picture is an illustration");
  const card = read("src/components/FloorPlanCard.tsx");
  assert.ok(/<DesignerCta[^>]*src="plan_card"/.test(card), "every catalogue card links the designer");
  for (const [file, where] of [
    ["src/app/floor-plans/page.tsx", "the catalogue"],
    ["src/app/series/[slug]/page.tsx", "the series hubs"],
    ["src/components/HomeTypeLanding.tsx", "the single/double-wide pages"],
    ["src/app/homes-on-sale/page.tsx", "the sale page"],
    ["src/app/page.tsx", "the homepage"],
  ]) {
    assert.ok(/<DesignerPromo\b/.test(read(file)), `${where} carries the Design Your Home band`);
  }
  // no bare <a href="/design-your-home"> or Link to it in a component that
  // should report the click — the tracked component is the one door
  const cta = read("src/components/DesignerCta.tsx");
  assert.ok(/trackCTAClick\("design_this_home"/.test(cta));
  const designerSrcs = new Set<string>();
  for (const file of ["src/components/DesignThisHome.tsx", "src/components/DesignerPromo.tsx", "src/components/FloorPlanCard.tsx"]) {
    for (const m of read(file).matchAll(/src="([a-z_]+)"/g)) designerSrcs.add(m[1]);
  }
  const link = read("src/lib/designer-link.ts");
  for (const s of designerSrcs) assert.ok(link.includes(`"${s}"`), `${s} is a DesignerSource`);
});

test("the designer takes ?siding= only through the plan's catalogue, and carries the source on plan_selected", () => {
  const page = read("src/app/design-your-home/page.tsx");
  assert.ok(/sidingByLabel\(exteriorCatalog\(/.test(page), "the page validates the label against the chosen plan's board");
  assert.ok(/initialSiding=\{initialSiding\}/.test(page) && /source=\{source\}/.test(page));
  const designer = read("src/components/HomeDesigner.tsx");
  assert.ok(/useState\(initialSiding \|\| ""\)/.test(designer));
  assert.ok(/step\("plan_selected",[^)]*source/.test(designer), "plan_selected reports where the visitor came from");
  assert.ok(/data-designer-quote-bar/.test(designer) && /id="design-quote"/.test(designer), "the quote bar and the section it jumps to");
  assert.ok(/step\("cta_quote"/.test(designer), "the jump is measured");
  assert.ok(/<ShowroomVisitButton/.test(designer), "a submitted design is offered a lot visit");
  assert.ok(/<CurrentHome\b/.test(designer), "the layout's mobile bar learns which home the design is about");
});
