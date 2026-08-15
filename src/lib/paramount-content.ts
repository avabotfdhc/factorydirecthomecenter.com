// Paramount Series detail-page content from Champion's own 2026 factory
// literature (Box: 2026 Paramount): the "Paramount Singles Standards 2026"
// sheet, the "FLOOR PLANS w SUMMIT KITCHEN" flyer, and the 2026 decor poster
// (served at /images/paramount/2026-selections.webp). Rendered by
// api-content.ts into the About section of Paramount detail pages.

import type { LocalFloorPlan } from "./local-floor-plans";

// Curated from the Redman Paramount Singles standards sheet (1/5/2026) —
// buyer-relevant items only, grouped the way the sheet groups them.
// Applies to the 14' and 16' single-wide models; the sectional standards
// live in the series brochure and are not repo-published yet.
const singlesStandardFeatures: Array<[string, string[]]> = [
  ["Structure & exterior", [
    "8' sidewalls with a nominal 3/12 roof pitch and 30 lb roof load",
    "25-year shingles with upgraded ice & water shield",
    "Double 4\" vinyl siding, white aluminum fascia, vented soffit",
    "R-11 sidewall and floor insulation",
  ]],
  ["Windows & doors", [
    "Six-panel residential front and rear doors",
    "Low-E vinyl windows",
    "Two-panel interior doors with black hinges and knobs",
  ]],
  ["Kitchen & baths", [
    "Smooth-top electric range, 30\" range hood, 18 cu ft refrigerator",
    "Wrapped Shaker cabinets with lined overhead cabinets",
    "Stainless steel kitchen sink and black metal faucets throughout",
    "Formica countertops in your choice of color",
    "60\" fiberglass tub/shower combo and china lavatory bowls",
    "Lighted bath fans",
  ]],
  ["Interior & mechanical", [
    "Flat ceilings, linoleum throughout in your choice of color",
    "Finished closets with wire shelving",
    "Electric furnace with programmable thermostat",
    "100-amp service, all-copper wiring, PEX water lines",
    "30-gallon electric water heater and frost-free exterior faucet",
    "Washer plumbing and electric dryer wiring",
    "Smoke alarms with battery backup",
  ]],
];

// Models built with Champion's upgraded Summit kitchen, per the factory's
// "FLOOR PLANS w/ SUMMIT KITCHEN" flyer. (The flyer's 2864H32A1C is not in
// the 2026 lineup — the current 64' Summit is 2864H42A1C — so it's omitted
// rather than guessed.)
const summitKitchenModels = new Set([
  "2848H32160", "2848H32170", "2852H32160", "2852H32170",
  "2852H32A1C", "2856H32A1C", "2856H32301", "2860H32301",
  "2868H32179", "2872H42179", "2876H43179",
]);

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

/** Extra About-section HTML for Paramount detail pages; "" for other series. */
export function paramountExtraHtml(p: LocalFloorPlan): string {
  if (p.series !== "Paramount") return "";
  const parts: string[] = [];

  if (summitKitchenModels.has(p.modelNumber)) {
    parts.push(
      `<p><strong>Summit kitchen standard:</strong> this floor plan is built with Champion's upgraded Summit kitchen package.</p>`
    );
  }

  parts.push(
    `<p>Interior and exterior finishes are your choice at order time — view <a href="/images/paramount/2026-selections.webp" target="_blank" rel="noopener">Champion's 2026 selections chart</a> for countertops, cabinets, flooring, siding, and shingle options.</p>`
  );

  if ((p.homeType || "Single Wide") === "Single Wide") {
    const groups = singlesStandardFeatures
      .map(([title, items]) =>
        `<h3>${esc(title)}</h3><ul>${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`)
      .join("");
    parts.push(
      `<h2>Standard features</h2><p>Every Paramount single-wide leaves the factory with these standards (per Champion's 2026 spec sheet) — backed by a 7-year warranty:</p>${groups}`
    );
  }

  return parts.join("");
}
