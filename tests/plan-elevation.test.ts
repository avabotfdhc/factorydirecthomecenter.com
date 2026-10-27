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
import { planElevation, sheetElevation, SHEET_ELEVATION_COUNT } from "../src/lib/plan-elevation";
import { representativeElevation, sizeFromModel, windowSize, type Opening, type PlanElevation } from "../src/lib/plan-elevation-types";

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
  assert.equal(sheetElevation("BARKLEY-RA"), null);
  assert.equal(sheetElevation(""), null);
  assert.equal(sheetElevation(undefined), null);
});

test("a plan without a sheet gets a representative layout that says so, or nothing", () => {
  const fallback = planElevation({ modelNumber: "BARKLEY-RA", lengthFt: 56, widthFt: 16, beds: 2 });
  assert.ok(fallback && fallback.src === "representative" && fallback.L === 56 && fallback.W === 16);
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
