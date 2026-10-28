// Champion's dormer, bump-out and bay options are drawn on the Design Your
// Home preview (src/lib/exterior-features.ts + HomeElevation), at the place
// the option sheet shows them. These tests hold the two halves: every option
// the catalogue offers has a drawing spec, and the placement rules — over the
// front door, on the end with the window, in a free stretch of the rear wall,
// and nowhere when the plan has no place for it.
//
//   npm test

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { exteriorCatalog } from "../src/lib/exterior-options";
import { FEATURES, addedDoorSlot, addedDoorSlots, endCentre, featureEnd, featureFor, frontCentre, mergeFeatures, viewForFeature } from "../src/lib/exterior-features";
import { sheetElevation } from "../src/lib/plan-elevation";
import { DoorSwatch, HomeElevation, type ExteriorChoices } from "../src/components/HomeElevation";
import type { PlanElevation } from "../src/lib/plan-elevation-types";

const multi = exteriorCatalog("Aspire", "Multi-Section");
const single = exteriorCatalog("Aspire", "Single Wide");
const modular = exteriorCatalog("Aspire", "Modular");

function choices(extra: Partial<ExteriorChoices> = {}): ExteriorChoices {
  return {
    siding: multi.siding[0],
    shingles: multi.shingles[0],
    trim: "shutters",
    shutter: multi.shutters[0],
    gableAccent: null,
    foundation: "block",
    addonPorch: false,
    door: "6-panel",
    blackPackage: false,
    windowGrids: true,
    features: {},
    addedDoors: [],
    ...extra,
  };
}

// a 56×24 double with the entry a third of the way along the front, one rear
// window, a window on the left end and a blank right end
const plan: PlanElevation = {
  L: 56,
  W: 24,
  sqft: 1344,
  views: {
    front: [["w", 8, 3], ["d", 20, 3], ["w", 40, 3]],
    rear: [["w", 24, 3.83, "4661", 1]],
    left: [["w", 12, 3.83, "4661"]],
    right: [],
  },
  porch: null,
  src: "sheet",
  model: "TEST",
};

test("every dormer and elevation option in the catalogue has a drawing spec", () => {
  for (const cat of [single, multi, modular]) {
    for (const o of [...cat.dormers, ...cat.elevations]) {
      const spec = featureFor(o.id);
      assert.ok(spec, `${cat.section}: ${o.id} (${o.label}) has no spec`);
      assert.ok(spec.dormer || spec.bumpOut || spec.end, `${o.id} draws nothing`);
    }
  }
  for (const [id, spec] of Object.entries(FEATURES)) {
    for (const w of [spec.dormer?.widthFt, spec.bumpOut?.widthFt, spec.end?.widthFt]) {
      if (w !== undefined) assert.ok(w >= 4 && w <= 24, `${id}: width ${w} ft is not a Champion dormer size`);
    }
  }
  // the sheets' labels and the specs agree on size
  assert.equal(FEATURES.d10.dormer?.widthFt, 20);
  assert.equal(FEATURES.x1.dormer?.widthFt, 6);
  assert.equal(FEATURES.s7.dormer?.style, "dropEave");
  assert.ok(FEATURES.s7.bumpOut?.shake, "S7 is the shake-column dormer");
  assert.ok(FEATURES.s1.end?.corbel && FEATURES.s1.end?.trim === "azek");
  assert.ok(FEATURES.x16.end?.shedRoof && FEATURES.x16.end?.box);
  assert.equal(featureFor("nope"), null);
  assert.equal(featureFor(""), null);
  assert.equal(featureFor("constructor"), null, "only real ids, not Object.prototype");
});

test("Prime offers none of them", () => {
  const prime = exteriorCatalog("Prime", "Multi-Section");
  assert.deepEqual(prime.dormers, []);
  assert.deepEqual(prime.elevations, []);
});

test("a dormer from the dormer list wins over the one an elevation option brings", () => {
  const both = mergeFeatures("x6", "d2");
  assert.equal(both.dormer?.widthFt, 10, "X6's 10' dormer, not D2's 20' eyebrow");
  assert.equal(both.bumpOut?.widthFt, 12, "D2's bump-out still comes along");
  const only = mergeFeatures("", "d2");
  assert.equal(only.dormer?.style, "eyebrow");
  assert.deepEqual(mergeFeatures("", ""), { dormer: undefined, bumpOut: undefined, end: undefined });
});

test("a front feature centres over the front door and stays inside the wall", () => {
  assert.equal(frontCentre(plan, 10), 20);
  // a 20' dormer over a door 20' in fits exactly (half width + a foot of margin)
  assert.equal(frontCentre(plan, 20), 20);
  // a door 4' from the end pushes a 10' dormer inward
  const nearEnd: PlanElevation = { ...plan, views: { ...plan.views, front: [["d", 4, 3]] } };
  assert.equal(frontCentre(nearEnd, 10), 6);
  // no entry on the front: the window nearest the middle
  const noDoor: PlanElevation = { ...plan, views: { ...plan.views, front: [["w", 8, 3], ["w", 30, 3], ["w", 50, 3]] } };
  assert.equal(frontCentre(noDoor, 8), 30);
  // a dormer as wide as the home sits in the middle
  assert.equal(frontCentre(plan, 60), 28);
});

test("an end feature goes on the end with the window, never a porch end or a blank wall", () => {
  assert.equal(featureEnd(plan), "left", "the right end has no window");
  const bothEnds: PlanElevation = { ...plan, views: { ...plan.views, right: [["w", 12, 5, "6061"]] } };
  assert.equal(featureEnd(bothEnds), "right", "the wider window wins");
  const porchOnRight: PlanElevation = { ...bothEnds, porch: { kind: "end", side: "right", len: 8, depth: "full", back: [] } };
  assert.equal(featureEnd(porchOnRight), "left");
  const addon: PlanElevation = { ...bothEnds, porch: { kind: "addon", side: "right", len: 8 } };
  assert.equal(featureEnd(addon, true), "left", "Champion's add-on porch, once shown, takes that end");
  assert.equal(featureEnd(addon, false), "right");
  const blank: PlanElevation = { ...plan, views: { ...plan.views, left: [] } };
  assert.equal(featureEnd(blank), null, "nothing to frame");
  // the designer turns the preview to the end that shows it, or stays put
  assert.equal(viewForFeature(mergeFeatures("", "s1"), plan, false), "left");
  assert.equal(viewForFeature(mergeFeatures("", "s1"), blank, false), null);
  assert.equal(viewForFeature(mergeFeatures("x6", ""), plan, false), "front");
  assert.equal(endCentre(plan, "left", 7.5), 12);
  assert.equal(endCentre(plan, "right", 13.33), 12, "no window: the middle of the wall");
  assert.ok(endCentre({ ...plan, W: 14 }, "left", 13.33) >= 13.33 / 2 - 0.5);
});

test("an added door takes the widest free stretch of the rear wall, then the front", () => {
  const slot = addedDoorSlot(plan, 6);
  assert.equal(slot?.view, "rear");
  // the rear has one window at 24: the free runs are 1..22 and 26..55; the wider is on the right
  assert.ok(slot && slot.x > 26 && slot.x < 55, `landed at ${slot?.x}`);
  const two = addedDoorSlots(plan, ["patio", "atrium"]);
  assert.ok(two.patio && two.atrium);
  assert.ok(Math.abs(two.patio!.x - two.atrium!.x) >= 6, "two doors never share a stretch");
  // a rear wall with no room sends the door to the front
  const full: PlanElevation = { ...plan, views: { ...plan.views, rear: [["w", 6, 10], ["w", 18, 10], ["w", 30, 10], ["w", 42, 10], ["w", 52, 6]] } };
  assert.equal(addedDoorSlot(full, 6)?.view, "front");
  // a recessed end porch on the rear side is not wall — and from the rear the
  // left end is on the viewer's right, so the door lands in the left half
  const porchRear: PlanElevation = { ...plan, L: 20, views: { ...plan.views, rear: [], front: [["w", 2, 3], ["w", 10, 3], ["w", 18, 3]] }, porch: { kind: "end", side: "left", len: 10, depth: "rear", back: [] } };
  const s = addedDoorSlot(porchRear, 6);
  assert.ok(s && s.view === "rear" && s.x < 10 && s.x >= 4, `must sit beside the porch, got ${JSON.stringify(s)}`);
  // nowhere at all
  const tiny: PlanElevation = { ...plan, L: 12, views: { front: [["d", 6, 3]], rear: [["w", 6, 6]], left: [], right: [] } };
  assert.equal(addedDoorSlot(tiny, 6), null);
});

test("on every sheet-drawn plan, added doors clear the shutters and bump-outs stay on flat wall", () => {
  // Vercel's review found both on real plans (2842H32388: the second door over a
  // shutter; 2856M32301: the bump-out painted behind the recessed porch).
  const data = JSON.parse(readFileSync("src/lib/plan-elevations.json", "utf8")) as Record<string, PlanElevation>;
  const models = Object.keys(data);
  assert.ok(models.length > 150);
  const SHUTTER = 1.7, TRIM = 0.5;
  const overlaps = (a: [number, number], b: [number, number]) => a[0] < b[1] && a[1] > b[0];
  const recessesOf = (p: PlanElevation, view: "front" | "rear"): [number, number][] => {
    const out: [number, number][] = [];
    if (p.porch?.kind === "end" && (p.porch.depth === "full" || p.porch.depth === view)) {
      const onLeft = view === "front" ? p.porch.side === "left" : p.porch.side === "right";
      out.push(onLeft ? [0, p.porch.len] : [p.L - p.porch.len, p.L]);
    }
    if (p.porch?.kind === "mid" && view === "front") out.push([p.porch.x - p.porch.w / 2, p.porch.x + p.porch.w / 2]);
    return out;
  };
  let doorsPlaced = 0, bumpOuts = 0;
  for (const m of models) {
    const p = { ...data[m], model: m };
    const slots = addedDoorSlots(p, ["patio", "atrium"]);
    const placed = Object.values(slots);
    for (const slot of placed) {
      doorsPlaced++;
      const door: [number, number] = [slot.x - 3, slot.x + 3];
      for (const o of p.views[slot.view]) {
        const pad = o[0] === "w" ? SHUTTER : TRIM;
        assert.ok(!overlaps(door, [o[1] - o[2] / 2 - pad, o[1] + o[2] / 2 + pad]), `${m} ${slot.view}: door at ${slot.x} overlaps ${o[0]} at ${o[1]}`);
      }
      for (const r of recessesOf(p, slot.view)) assert.ok(!overlaps(door, r), `${m} ${slot.view}: door at ${slot.x} is inside the porch recess`);
      assert.ok(door[0] >= 0.9 && door[1] <= p.L - 0.9, `${m}: door at ${slot.x} runs off the ${slot.view} wall`);
    }
    if (placed.length === 2) assert.ok(!overlaps([placed[0].x - 3, placed[0].x + 3], [placed[1].x - 3, placed[1].x + 3]) || placed[0].view !== placed[1].view, `${m}: both doors in one stretch`);
    for (const w of [7, 8, 10, 12]) {
      const cx = frontCentre(p, w, "bumpOut");
      bumpOuts++;
      const zone: [number, number] = [cx - w / 2, cx + w / 2];
      for (const r of recessesOf(p, "front")) {
        if (w + 2 >= p.L) continue; // wider than the home: nothing to do but centre it
        assert.ok(!overlaps(zone, r), `${m}: ${w}' bump-out at ${cx} crosses the porch recess ${r}`);
      }
      assert.ok(zone[0] >= 0.9 && zone[1] <= p.L - 0.9, `${m}: ${w}' bump-out at ${cx} runs off the wall`);
    }
  }
  assert.ok(doorsPlaced > models.length, "most plans take both doors somewhere");
  assert.equal(bumpOuts, models.length * 4);
  // the two plans from the review, pinned
  const a = { ...data["2842H32388"], model: "2842H32388" };
  const aSlots = addedDoorSlots(a, ["patio", "atrium"]);
  assert.equal(aSlots.patio?.view, "rear");
  assert.equal(aSlots.atrium?.view, "front", "the rear stretch between the door and the 46\" window is too short once its shutters count");
  const b = { ...data["2856M32301"], model: "2856M32301" };
  assert.equal(b.porch?.kind, "mid");
  assert.equal(frontCentre(b, 8, "bumpOut"), 25.06, "frames the window beside the recessed porch, not the porch");
  assert.equal(frontCentre(b, 10, "dormer"), 35.56, "a dormer alone still goes over the porch entry");
});

test("the elevation draws each feature on its own view and nothing when none is picked", () => {
  const render = (c: ExteriorChoices, view: "front" | "rear" | "left" | "right", p = plan) => renderToStaticMarkup(createElement(HomeElevation, { plan: p, choices: c, view }));
  assert.ok(!/data-feature=/.test(render(choices(), "front")), "no features, no markers");
  const dormer = choices({ features: mergeFeatures("x3", "") });
  assert.match(render(dormer, "front"), /data-feature="dormer"/);
  assert.ok(!/data-feature="dormer"/.test(render(dormer, "rear")), "a dormer is a front-roof feature");
  const s7 = choices({ features: mergeFeatures("s7", "") });
  const s7Front = render(s7, "front");
  assert.match(s7Front, /data-feature="dormer"/);
  assert.match(s7Front, /data-feature="bump-out"/);
  const bay = choices({ features: mergeFeatures("", "d4") });
  assert.match(render(bay, "left"), /data-feature="end"/);
  assert.match(render(bay, "left"), /data-feature="end-roof"/);
  assert.ok(!/data-feature="end/.test(render(bay, "right")), "the blank end stays blank");
  assert.ok(!/data-feature="end/.test(render(bay, "front")));
  const doors = choices({ addedDoors: ["patio", "atrium"] });
  const rear = render(doors, "rear");
  assert.match(rear, /data-door="patio"/);
  assert.match(rear, /data-door="atrium"/);
  assert.match(rear, /data-feature="atrium"/);
  assert.ok(!/data-feature="added-door"/.test(render(doors, "front")), "both fit on the rear, so the front is unchanged");
  // a real sheet-drawn plan renders all four views with a 20' dormer and an end bay
  const real = sheetElevation("2456H32P02");
  assert.ok(real, "fixture plan exists");
  for (const v of ["front", "rear", "left", "right"] as const) {
    const out = render(choices({ features: mergeFeatures("d10", "x16"), addedDoors: ["patio"] }), v, real!);
    assert.match(out, /<svg /);
  }
});

test("the door chips draw every style, and black means a black craftsman leaf", () => {
  for (const style of ["6-panel", "9-lite", "craftsman", "craftsman-black"] as const) {
    const out = renderToStaticMarkup(createElement(DoorSwatch, { style }));
    assert.match(out, /<svg /, style);
    assert.match(out, /aria-hidden="true"/);
  }
  assert.match(renderToStaticMarkup(createElement(DoorSwatch, { style: "craftsman-black" })), /#1c1c1c/);
});

test("the designer no longer tells buyers these options are not drawn", () => {
  const src = readFileSync("src/components/HomeDesigner.tsx", "utf8");
  assert.ok(!/\(not drawn\)/.test(src), "the dormer and bay pickers draw now");
  assert.ok(!/not drawn\)<\/span>/.test(src));
  assert.match(src, /DoorPicker/, "door styles are picked from pictures");
  assert.match(src, /pickFeature/, "picking a feature turns the preview to it");
  // still no prices, in the new file either
  assert.ok(!/\$\s?\d/.test(readFileSync("src/lib/exterior-features.ts", "utf8")));
});
