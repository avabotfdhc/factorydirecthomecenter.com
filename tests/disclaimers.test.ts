// Disclaimer coverage.
//
// Two separate promises, made in two different ways, and it is worth being
// precise about which is which:
//
//   1. The Regulation Z financing disclosure and the HUD notice are SITEWIDE,
//      because `Footer` renders `ComplianceDisclaimers` and the root layout
//      renders `Footer`. That is the whole mechanism — if either link in that
//      chain breaks, every page on the site silently loses both disclosures
//      and nothing else would notice.
//
//   2. The Champion specifications disclaimer belongs on a page only when that
//      page actually shows floor plans, renderings or specs. It was on the two
//      /floor-plans routes and nowhere else, so the homepage, the five series
//      pages, both sale routes and the configurator all displayed renderings
//      with no "may show optional features not included in the base price".
//
// A disclosure also has to be readable to be a disclosure, so the third test
// keeps the two colours that failed WCAG AA from coming back.
//
//   npm test

import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";

const read = (rel: string) => readFileSync(resolve(process.cwd(), rel), "utf8");

test("the Reg Z and HUD disclosures reach every page through the root layout", () => {
  const layout = read("src/app/layout.tsx");
  assert.match(layout, /<Footer\s*\/>/, "the root layout must render <Footer />");

  const footer = read("src/components/Footer.tsx");
  assert.match(
    footer,
    /<ComplianceDisclaimers/,
    "Footer must render <ComplianceDisclaimers /> — it is what puts the Reg Z and HUD notices on every page",
  );
});

// Components whose presence means the page is showing plans, renderings or
// specs. A page that renders one of these is making the claims the Champion
// specifications disclaimer qualifies.
const PLAN_MARKERS = [
  "FeaturedHomes",
  "FloorPlanCard",
  "FloorPlansGrid",
  "HomeDesigner",
  "SaleHomesGrid",
  "AllSaleHomesTable",
  "PriceTriple",
];

test("every public page that shows plans or renderings carries the specs disclaimer", () => {
  const offenders: string[] = [];

  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        // /admin is behind auth and is not a place a buyer reads claims.
        if (entry.name === "admin") continue;
        walk(full);
        continue;
      }
      if (entry.name !== "page.tsx") continue;

      const rel = relative(process.cwd(), full).split(sep).join("/");
      // The design system is a labelled specimen sheet, not a claim about a
      // home anyone can buy.
      if (rel === "src/app/design-system/page.tsx") continue;

      const source = readFileSync(full, "utf8");
      const showsPlans = PLAN_MARKERS.some((m) => source.includes(m));
      if (showsPlans && !source.includes("SpecsDisclaimer")) offenders.push(rel);
    }
  };
  walk(resolve(process.cwd(), "src/app"));

  assert.deepEqual(
    offenders,
    [],
    "these pages show floor plans, renderings or specs without rendering <SpecsDisclaimer />",
  );
});

test("the specs disclaimer is still rendered on the two floor-plan routes", () => {
  // These two are the reason the component exists; the marker scan above does
  // not catch the detail page, which renders one plan directly.
  for (const rel of ["src/app/floor-plans/page.tsx", "src/app/floor-plans/[slug]/page.tsx"]) {
    assert.ok(read(rel).includes("SpecsDisclaimer"), `${rel} must render <SpecsDisclaimer />`);
  }
});

test("a disclaimer is never set in a colour that fails WCAG AA on its own surface", () => {
  // Measured 2026-09-23 against the surfaces these actually render on:
  //   --color-gray-light #94a3b8 on cream #F8F7F4 → 2.39:1
  //   --color-gray       #64748b on cream        → 4.44:1
  //   --color-gray       #64748b on charcoal     → 3.07:1
  // All three are below the 4.5:1 AA threshold for body text. The replacements
  // are charcoal/70 on light (5.6:1), white/75 on dark (7.9:1) and gray-light
  // in the footer (5.71:1 on charcoal).
  const specs = read("src/components/SpecsDisclaimer.tsx");
  assert.ok(
    !specs.includes("--color-gray-light") && !specs.includes("text-[var(--color-gray)]"),
    "SpecsDisclaimer must not use --color-gray-light or --color-gray; both fail AA on the cream page background",
  );

  const compliance = read("src/components/ComplianceDisclaimer.tsx");
  assert.ok(
    !compliance.includes("text-[var(--color-gray)]"),
    "the Reg Z / HUD disclosures must not use --color-gray; it is 4.44:1 on cream and 3.07:1 in the footer",
  );
  assert.ok(
    !compliance.includes("text-[11px]"),
    "the Reg Z / HUD disclosures are set at 12px or above — 11px legal text is not conspicuous",
  );

  const footer = read("src/components/Footer.tsx");
  assert.ok(
    !/ComplianceDisclaimers[^>]*--color-gray\)/.test(footer),
    "the footer sits on charcoal, where --color-gray is 3.07:1; it must override with a colour that passes",
  );
});

// An HTML entity inside a JSX *expression* is a plain string, so React prints
// it verbatim: the sale page's own heading read "Don&rsquo;t Miss Out on These
// Savings" to every visitor. AGENTS.md already states this rule for blog
// titles and excerpts; it holds anywhere a string is interpolated.
test("no HTML entity is interpolated into JSX, where it would render literally", () => {
  const offenders: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.name.endsWith(".tsx")) {
        const rel = relative(process.cwd(), full).split(sep).join("/");
        for (const [i, line] of readFileSync(full, "utf8").split("\n").entries()) {
          if (/\{[^}]*&(rsquo|lsquo|amp|quot|mdash|ndash|nbsp|hellip);/.test(line)) {
            offenders.push(`${rel}:${i + 1}`);
          }
        }
      }
    }
  };
  walk(resolve(process.cwd(), "src"));

  assert.deepEqual(
    offenders,
    [],
    "these lines put an HTML entity inside a JSX expression; use the real character (’ — …) instead",
  );
});
