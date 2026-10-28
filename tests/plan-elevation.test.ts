// The Design Your Home exterior preview draws each plan from
// src/lib/plan-elevations.json, read off Champion's L-101 sales sheets by
// scripts/elevations/extract_elevations.py. These tests hold the data to the
// shape the renderer assumes and keep the lookup honest: a plan we have no
// sheet for gets a representative layout that says so, never a silent guess.
//
//   npm test

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { planElevation, sheetElevation, SHEET_ELEVATION_COUNT } from "../src/lib/plan-elevation";
import { exteriorCatalog } from "../src/lib/exterior-options";
import { HomeElevation, shutterClearance, shutterReachFt, type ExteriorChoices } from "../src/components/HomeElevation";
import { spaceOpenings, representativeElevation, sizeFromModel, windowSize, type Opening, type PlanElevation } from "../src/lib/plan-elevation-types";

const data = JSON.parse(readFileSync("src/lib/plan-elevations.json", "utf8")) as Record<string, PlanElevation>;

test("every sheet-read plan is well formed and every opening sits on its wall", () => {
  assert.ok(SHEET_ELEVATION_COUNT >= 180, `expected most of the catalogue, got ${SHEET_ELEVATION_COUNT}`);
  for (const [model, p] of Object.entries(data)) {
    assert.match(model, /^[A-Z0-9-]+$/, model);
    assert.equal(p.src, "sheet", model);
    assert.ok(p.L >= 28 && p.L <= 90, `${model}: length ${p.L}`);
    assert.ok(p.W >= 12 && p.W <= 34, `${model}: width ${p.W}`);
    for (const view of ["front", "rear", "left", "right"] as const) {
      const span = view === "front" || view === "rear" ? p.L : p.W;
      for (const o of p.views[view]) {
        assert.ok(["w", "d", "p", "o"].includes(o[0]), `${model} ${view}: kind ${o[0]}`);
        assert.ok(o[1] - o[2] / 2 >= -0.6 && o[1] + o[2] / 2 <= span + 0.6, `${model} ${view}: ${JSON.stringify(o)} is off the wall`);
        if (o[0] === "w") assert.match(o[3] || "", /^\d{4}$/, `${model} ${view}: window without a code`);
      }
    }
    // a front wall with no glass at all means the sheet was misread
    const frontWindows = p.views.front.filter((o) => o[0] === "w").length;
    assert.ok(frontWindows >= 1, `${model}: no windows on the front`);
  }
});

test("porches carry what the renderer needs", () => {
  const kinds = { end: 0, mid: 0, addon: 0 };
  for (const [model, p] of Object.entries(data)) {
    if (!p.porch) continue;
    kinds[p.porch.kind]++;
    if (p.porch.kind === "end") {
      assert.ok(["left", "right"].includes(p.porch.side), model);
      assert.ok(p.porch.len >= 3 && p.porch.len <= 16, `${model}: porch ${p.porch.len}'`);
      assert.ok(["full", "front", "rear"].includes(p.porch.depth), model);
      for (const o of p.porch.back) assert.ok(o[1] >= 0 && o[1] <= p.W, `${model}: porch back opening off the wall`);
    } else if (p.porch.kind === "mid") {
      assert.ok(p.porch.x > 0 && p.porch.x < p.L && p.porch.w > 3, model);
    } else {
      assert.ok(["left", "right"].includes(p.porch.side) && p.porch.len >= 4, model);
    }
  }
  assert.ok(kinds.end > 0 && kinds.mid > 0 && kinds.addon > 0, JSON.stringify(kinds));
});

test("the lookup finds a model, its construction-code twin, and nothing it should not", () => {
  const hud = sheetElevation("2856h32103");
  assert.ok(hud && hud.model === "2856H32103" && hud.src === "sheet");
  // the modular twin shares the box; whichever letter the sheet is under serves both
  const twin = sheetElevation("2856M32103");
  assert.ok(twin && twin.L === hud.L && twin.W === hud.W);
  // Prime's Reverse Aisle plans draw from their base plan's LIT-1 sheet and say so
  const ra = sheetElevation("BARKLEY-RA");
  assert.ok(ra && ra.src === "sheet" && ra.basedOn === "1656H22P01");
  assert.deepEqual(ra.views, sheetElevation("1656H22P01")!.views);
  assert.equal(sheetElevation("HICKMAN"), null, "no sheet and no base plan");
  assert.equal(sheetElevation(""), null);
  assert.equal(sheetElevation(undefined), null);
});

test("a plan without a sheet gets a representative layout that says so, or nothing", () => {
  const fallback = planElevation({ modelNumber: "HICKMAN", lengthFt: 66, widthFt: 16, beds: 3 });
  assert.ok(fallback && fallback.src === "representative" && fallback.L === 66 && fallback.W === 16);
  assert.ok(fallback.views.front.some((o) => o[0] === "d"), "the representative front has a door");
  // size can come from the model code when the catalogue row has none
  const fromCode = planElevation({ modelNumber: "2860H32999" });
  assert.ok(fromCode && fromCode.src === "representative" && fromCode.L === 60 && fromCode.W === 28);
  assert.equal(planElevation({ modelNumber: "NOPE" }), null);
  assert.deepEqual(sizeFromModel("1676H32221"), { widthFt: 16, lengthFt: 76 });
  assert.deepEqual(sizeFromModel("ZENITH-RA"), {});
});

test("representative layouts keep every opening on the wall for the sizes we sell", () => {
  for (const [L, W] of [[32, 14], [56, 16], [76, 16], [44, 24], [56, 28], [76, 32]]) {
    const p = representativeElevation({ lengthFt: L, widthFt: W, beds: 3 });
    const check = (list: Opening[], span: number) => {
      for (const o of list) assert.ok(o[1] - o[2] / 2 >= 0 && o[1] + o[2] / 2 <= span, `${L}x${W}: ${JSON.stringify(o)}`);
    };
    check(p.views.front, L); check(p.views.rear, L); check(p.views.left, W); check(p.views.right, W);
  }
});

test("absurd sizes from the public endpoint are clamped, never looped over", () => {
  const p = representativeElevation({ lengthFt: 1e9, widthFt: 1e9, beds: 1e9 });
  assert.ok(p.L <= 120 && p.W <= 40, `${p.L}x${p.W}`);
  assert.ok(p.views.front.filter((o) => o[0] === "w").length <= 8, "bedroom windows are bounded");
  const tiny = representativeElevation({ lengthFt: 1, widthFt: 1, beds: 0.5 });
  assert.ok(tiny.L >= 28 && tiny.W >= 12 && tiny.views.front.length >= 3);
});

test("window codes read as inches, with a floor on transom height", () => {
  assert.deepEqual(windowSize("3061", 2.5), { w: 2.5, h: 61 / 12 });
  assert.deepEqual(windowSize("4661", 3.8), { w: 46 / 12, h: 61 / 12 });
  assert.deepEqual(windowSize("3008", 2.5), { w: 2.5, h: 8 / 12 });
  assert.deepEqual(windowSize(undefined, 3), { w: 3, h: 61 / 12 });
});

test("the data file stays on the server: the client-safe module imports nothing", () => {
  const types = readFileSync("src/lib/plan-elevation-types.ts", "utf8");
  assert.ok(!/^import /m.test(types), "plan-elevation-types.ts must stay import-free so the designer bundle never pulls the 70 KB data file");
  const importsData = (src: string) => /from\s+["'][^"']*plan-elevations\.json["']/.test(src) || /from\s+["']@\/lib\/plan-elevation["']/.test(src);
  assert.ok(!importsData(readFileSync("src/components/HomeDesigner.tsx", "utf8")), "HomeDesigner must fetch /api/plan-elevation, not import the data");
  assert.ok(!importsData(readFileSync("src/components/HomeElevation.tsx", "utf8")), "HomeElevation must not import the data file");
});

test("Prime plans draw from their LIT-1 sheets: every active Prime model except the three with no drawing", () => {
  // the active Prime catalogue on 2026-10-28; 34 of these 41 fell back to the
  // representative layout before the LIT-1 extractor, which is what Kyle saw
  // as "every model pulls up the same home design"
  const prime = ["1456H22P01", "1460H22P01", "1466H32P01", "1476H32P01", "1636H11P01", "1656H22P01", "1660H22P01", "1660H22P02", "1660H32P05", "1666H22P01", "1666H32P01", "1666H32P07", "1666H32P09", "1672H32P01", "1672H32P07", "1672H32P09", "1676H32P01", "1676H32P04", "1676H32P06", "1676H32P07", "1676H32P09", "2448H32P02", "2456H32P02", "2844H32P01", "2848H32P02", "2848H32P06", "2852H32P01", "2856H32P01", "2856H42P01", "2868H42P01", "2876H53P01", "BARKLEY-RA", "CREST-RA", "PEAK-RA", "RIDGE-RA", "SPIRE-RA", "VERTEX-RA", "ZENITH-RA", "HICKMAN", "MONTE", "MONTE-RA"];
  const noDrawing = new Set(["HICKMAN", "MONTE", "MONTE-RA"]);
  for (const m of prime) {
    const e = sheetElevation(m);
    if (noDrawing.has(m)) assert.equal(e, null, `${m} has no sheet in the catalogue`);
    else assert.ok(e && e.src === "sheet", `${m} should draw from its sheet`);
  }
  // a LIT-1 read: the Ridge's front door and two 46" living windows, a rear door, one end window
  const ridge = sheetElevation("1676H32P01")!;
  assert.equal(ridge.L, 76);
  assert.ok(ridge.W > 15 && ridge.W < 15.5, "the drawn box is 15'-2\", not the nominal 16");
  assert.equal(ridge.views.front.filter((o) => o[0] === "d").length, 1);
  assert.equal(ridge.views.front.filter((o) => o[3] === "4661").length, 2);
  assert.equal(ridge.views.rear.filter((o) => o[0] === "d").length, 1);
  assert.equal(ridge.views.left.length + ridge.views.right.length, 1);
  assert.equal(ridge.sqft, 1152, "square footage comes from the catalogue when the sheet's text has none");
});

test("openings never overlap each other's shutters, on a sheet plan or a stand-in", () => {
  const pad = (o: Opening) => (o[0] === "w" ? 1.7 : 0.5);
  const clear = (list: Opening[], label: string) => {
    const s = [...list].sort((a, b) => a[1] - b[1]);
    for (let i = 1; i < s.length; i++) {
      const a = s[i - 1], b = s[i];
      assert.ok(b[1] - b[2] / 2 - pad(b) >= a[1] + a[2] / 2 + pad(a) - 0.01, `${label}: ${JSON.stringify(a)} and ${JSON.stringify(b)} overlap`);
    }
  };
  // every size the catalogue has, every bedroom count: the 32' single used to
  // draw a door-side window into a bedroom window's shutters
  for (const W of [14, 16, 24, 28, 32]) {
    for (let L = 28; L <= 80; L += 4) {
      for (let beds = 1; beds <= 5; beds++) {
        const p = representativeElevation({ lengthFt: L, widthFt: W, beds });
        for (const v of ["front", "rear", "left", "right"] as const) {
          clear(p.views[v], `${L}x${W} beds=${beds} ${v}`);
          for (const o of p.views[v]) {
            const span = v === "front" || v === "rear" ? p.L : p.W;
            assert.ok(o[1] - o[2] / 2 >= 0.5 && o[1] + o[2] / 2 <= span - 0.5, `${L}x${W} ${v}: ${JSON.stringify(o)} off the wall`);
          }
        }
        assert.ok(p.views.front.some((o) => o[0] === "d"), "the front keeps its door");
        assert.ok(p.views.front.some((o) => o[0] === "w"), "and at least one window");
      }
    }
  }
  const short = representativeElevation({ lengthFt: 32, widthFt: 14, beds: 1 });
  assert.ok(short.views.front.length <= 4, `a 32' single carries ${short.views.front.length} front openings`);
  // spaceOpenings itself: pushes apart, keeps order, drops what runs off the end
  const spaced = spaceOpenings([["w", 10, 3], ["w", 11, 3], ["d", 12, 3], ["w", 40, 3]], 42);
  assert.deepEqual(spaced.map((o) => o[0]), ["w", "w", "d"], "the window pushed past the end is dropped");
  for (let i = 1; i < spaced.length; i++) assert.ok(spaced[i][1] > spaced[i - 1][1]);
});

test("a mulled pair of windows gets shutters on its outer edges only", () => {
  // Champion draws twin living-room windows a few inches apart (2844H32P01's
  // front has two 3661s at 19.02 and 22.43). Each used to get a shutter on both
  // sides, so two panels landed on top of each other between the panes — the
  // "overlapping windows" look. Shutters are drawn only where they fit.
  const pair = sheetElevation("2844H32P01");
  assert.ok(pair, "2844H32P01 reads from its LIT-1 sheet");
  const twins = pair.views.front.filter((o) => o[0] === "w" && o[3] === "3661");
  assert.equal(twins.length, 2);
  assert.ok(Math.abs(twins[0][1] - twins[1][1]) < 4, "the pair sits within a window width of each other");
  const inner = shutterClearance(twins[0], pair.views.front);
  assert.ok(inner.right < shutterReachFt(twins[0][2]), "no room for a shutter between the panes");
  assert.ok(inner.left >= shutterReachFt(twins[0][2]), "room on the outside");
  const cat = exteriorCatalog("Prime", "HUD");
  const choices: ExteriorChoices = {
    siding: cat.siding[0], shingles: cat.shingles[0], trim: "shutters", shutter: cat.shutters[0], gableAccent: null,
    foundation: "block", addonPorch: false, door: "6-panel", blackPackage: false, windowGrids: false, features: {}, addedDoors: [],
  };
  const html = renderToStaticMarkup(createElement(HomeElevation, { plan: pair, choices, view: "front" }));
  const shutters = (html.match(/data-shutter=""/g) || []).length;
  const windows = pair.views.front.filter((o) => o[0] === "w").length;
  assert.equal(shutters, windows * 2 - 2, `${windows} windows, one mulled pair: ${shutters} shutters`);
  // a lone window keeps both
  const lone: PlanElevation = { ...pair, views: { ...pair.views, front: [["w", 20, 2.5, "3061"], ["d", 30, 3]] } };
  const loneHtml = renderToStaticMarkup(createElement(HomeElevation, { plan: lone, choices, view: "front" }));
  assert.equal((loneHtml.match(/data-shutter=""/g) || []).length, 2);
  // the stand-in layout never relies on the rule: no two of its windows are
  // closer than two shutters' reach, so every window carries both panels
  for (const [L, W, beds] of [[66, 16, 3], [76, 16, 3], [80, 32, 5], [52, 28, 4]] as const) {
    const p = representativeElevation({ lengthFt: L, widthFt: W, beds });
    for (const o of p.views.front) {
      if (o[0] !== "w") continue;
      const c = shutterClearance(o, p.views.front);
      assert.ok(c.left >= shutterReachFt(o[2]) && c.right >= shutterReachFt(o[2]), `${L}x${W} ${beds}bd: ${JSON.stringify(o)} would lose a shutter`);
    }
  }
});
