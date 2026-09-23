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

// FDHC sells the home and arranges delivery. The buyer owns site work, setup,
// foundations, utilities and the permits — that is the whole reason a quote
// here is not padded with them (Kyle, 2026-09-23: "Clients are responsible for
// all of their own site work, setup, and foundation work. Our model has not
// changed."). Copy that says otherwise is both a claim we cannot stand behind
// and a promise a buyer could rely on.
//
// /guides/zoning offered "free zoning checks" including "setback calculations",
// and five other pages said some form of "we verify zoning for your property".
// All removed 2026-09-23.
test("no page claims FDHC performs site work, setup, foundations or zoning verification", () => {
  const CLAIMS = [
    // "we (will|can|help) verify/check/evaluate ... zoning"
    /\b(we|our team)\b(?:(?!\byour\b)[^.\n;]){0,45}\b(verify|verifies|check|checks|evaluate|evaluates)\b(?:(?!\byour\b)[^.\n;]){0,40}\bzoning\b/i,
    // "we handle/perform/do ... site work | foundation | setup"
    /\b(we|our team)\b(?:(?!\byour\b)[^.\n;]){0,40}\b(perform|performs|handle|handles|install|installs|pour|pours|coordinate|coordinates|coordinating)\b(?:(?!\byour\b)[^.\n;]){0,40}\b(site work|site prep|foundation|footing|pier|setup|set-up|excavat|grading)\b/i,
    /free zoning check/i,
    /setback calculations/i,
  ];
  // "We recommend checking with the county" is advice, not a service, and
  // "we do not perform site work" is the disclaimer itself. The clause guards
  // above also stop a match running past a semicolon or a new subject, so
  // "We arrange transport; your contractor handles the site" reads correctly.
  const EXEMPT = /\b(we|our team)\b[^.\n]{0,20}\b(recommend|do not|don't|never|cannot|can't)\b/i;

  const offenders: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")) {
        const rel = relative(process.cwd(), full).split(sep).join("/");
        for (const [i, line] of readFileSync(full, "utf8").split("\n").entries()) {
          if (EXEMPT.test(line)) continue;
          if (CLAIMS.some((re) => re.test(line))) offenders.push(`${rel}:${i + 1}`);
        }
      }
    }
  };
  walk(resolve(process.cwd(), "src"));

  assert.deepEqual(
    offenders,
    [],
    "these lines say FDHC does site work, setup, foundations or zoning verification — the buyer's contractors do",
  );
});

// FDHC does not do financing (Kyle, 2026-09-23: "we don't do financing at all.
// Clients choose their own financial lender we provide them a list our clients
// have done business with in the past but we make no recommendations and we do
// not pull credit").
//
// This is the same family of claim as the site-work one, and it carries more
// legal weight: calling a lender a "partner", ranking one, or offering to
// arrange credit is what separates a dealer from a credit broker. The
// /financing page had "Our Lending Partners", "the nation's top manufactured
// home lenders" and "we help you compare options and choose the best fit" —
// while the lender table lower down on the SAME page carried the disclaimer
// saying we recommend nobody. The page contradicted itself. Fixed 2026-09-23.
test("no page offers financing, ranks a lender, or calls one a partner", () => {
  const CLAIMS: [RegExp, string][] = [
    [/\b(our|we[a-z']*)\s+lending partners?\b/i, "lenders are not our partners"],
    [/\bour lenders?\b/i, "they are not our lenders — the buyer chooses"],
    [/\bour\s+(?:primary|preferred|top|main|partner|recommended|best|go-to|chosen)\s+lenders?\b/i, "no lender is ours, primary or otherwise"],
    [/\bnation'?s top\b[^.\n]{0,30}\blender/i, "never rank lenders"],
    [/\bpreferred lender\b/i, "no preferred lender"],
    [/\b(we|our team)\b(?:(?!\byour\b)[^.\n;]){0,40}\b(offer|offers|provide|provides|arrange|arranges|broker|brokers)\b(?:(?!\byour\b)[^.\n;]){0,25}\bfinanc/i, "we do not offer or arrange financing"],
    [/\b(we|our team)\b(?:(?!\byour\b)[^.\n;]){0,40}\b(pull|pulls|run|runs|check|checks)\b[^.\n;]{0,15}\bcredit\b/i, "we never pull credit"],
    [/\b(we|our team)\b(?:(?!\byour\b)[^.\n;]){0,50}\b(best|right)\b(?:(?!\byour\b)[^.\n;]){0,20}\b(lender|loan|financing|rate)\b/i, "we make no recommendation"],
  ];
  // Denials are the point of the copy — and Ava's playbook states the rule by
  // quoting the banned phrase ('never say one is "our lender"'), so a line that
  // forbids something is not a line that claims it.
  const EXEMPT = /\b(we|our team)\b[^.\n]{0,28}\b(do not|don't|never|are not|aren't|is not|no part|take no)\b|\bnever say\b|\bRanking them is not\b/i;

  const offenders: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) { walk(full); continue; }
      if (!entry.name.endsWith(".ts") && !entry.name.endsWith(".tsx")) continue;
      const rel = relative(process.cwd(), full).split(sep).join("/");
      // The design system is a labelled specimen sheet, not a public claim.
      if (rel === "src/app/design-system/page.tsx") continue;
      for (const [i, raw] of readFileSync(full, "utf8").split("\n").entries()) {
        // An HTML entity carries a semicolon, and the clause guards stop at
        // one — so "We&apos;ll connect you with the right lender" slipped
        // straight through the first version of this test. Flatten every
        // entity to a letter before matching; the guards care about clause
        // boundaries, not about apostrophes.
        const line = raw.replace(/&(?:[a-zA-Z]+|#\d+);/g, "'");
        if (EXEMPT.test(line)) continue;
        for (const [re, why] of CLAIMS) {
          if (re.test(line)) { offenders.push(`${rel}:${i + 1} — ${why}`); break; }
        }
      }
    }
  };
  walk(resolve(process.cwd(), "src"));

  assert.deepEqual(offenders, [], "these lines claim we do financing or recommend a lender");
});

// The "we…" sentence patterns above miss the shape that actually shipped: a
// lender card whose recommendation lives in a DATA FIELD rather than a
// sentence. /financing carried a `lendingPartners` array of five cards, each
// with `bestFor: "Home-only purchases, buyers without land"` rendered under a
// "Best for:" label — a per-lender ranking with no verb in it, sitting a few
// hundred pixels above the neutral table that says we recommend nobody.
// Removed 2026-09-23. A label is a recommendation whoever writes it, so the
// guard is proximity: a named lender and a "best for" label in the same block.
test("no lender is labelled best for anything", () => {
  // Proper names, not the generic word "lender" — "best for buyers without
  // land" describing a LOAN TYPE is buyer education and stays allowed. It is
  // naming a company next to it that turns it into a recommendation.
  const LENDER_NAMES = [
    /\b21st Mortgage\b/i, /\bInTerra Credit Union\b/i, /\bCascade Loans\b/i,
    /\bCredit Human\b/i, /\bFarmers Savings Bank\b/i, /\bLake Michigan Credit Union\b/i,
    /\bSuperior Choice\b/i, /\bWest Central Bank\b/i, /\bTriad Financial\b/i,
    /\bLocal Lenders\b/i,
  ];
  const RECOMMENDATION = /\bbest ?For\b|\bbest for\b|\brecommended for\b|\bideal for\b|\bperfect for\b|\btop pick\b|\bour (?:top|first) choice\b/i;
  const WINDOW = 8;

  const offenders: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) { walk(full); continue; }
      if (!entry.name.endsWith(".ts") && !entry.name.endsWith(".tsx")) continue;
      const rel = relative(process.cwd(), full).split(sep).join("/");
      const lines = readFileSync(full, "utf8").split("\n");
      for (const [i, line] of lines.entries()) {
        if (!LENDER_NAMES.some((re) => re.test(line))) continue;
        const from = Math.max(0, i - WINDOW);
        const to = Math.min(lines.length, i + WINDOW + 1);
        for (let j = from; j < to; j++) {
          // The rule itself names the thing it forbids; that is not a claim.
          if (/\bnever\b|\bdo not\b|\bdon't\b|\bnot ranked\b/i.test(lines[j])) continue;
          if (RECOMMENDATION.test(lines[j])) {
            offenders.push(`${rel}:${j + 1} — "best for" next to ${lines[i].trim().slice(0, 40)}`);
            break;
          }
        }
      }
    }
  };
  walk(resolve(process.cwd(), "src"));

  assert.deepEqual(offenders, [], "a named lender must never carry a recommendation label");
});

// The claim that cost the most and showed the least: /financing published a
// `Service` node naming "Manufactured Home Financing" with the dealership as
// its `provider`. No visitor could see it and no copy guard could catch it —
// it told Google, and every answer engine reading the markup, that we are in
// the lending business. Removed 2026-09-23. The remaining Service nodes are
// all sales and delivery, which is what we actually do.
test("no Service schema names us as the provider of financing", () => {
  const MONEY = /\bfinanc|\bloan|\bcredit|\blend|\bmortgage/i;
  const offenders: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) { walk(full); continue; }
      if (!entry.name.endsWith(".ts") && !entry.name.endsWith(".tsx")) continue;
      const rel = relative(process.cwd(), full).split(sep).join("/");
      const lines = readFileSync(full, "utf8").split("\n");
      for (const [i, line] of lines.entries()) {
        if (!/structuredData\.service\(/.test(line)) continue;
        // The call's own argument object — name, description, provider.
        for (let j = i; j < Math.min(lines.length, i + 8); j++) {
          if (/^\s*(name|description):/.test(lines[j]) && MONEY.test(lines[j])) {
            offenders.push(`${rel}:${j + 1} — a Service we provide may not be a financial one`);
          }
          if (/\}\)/.test(lines[j]) && j > i) break;
        }
      }
    }
  };
  walk(resolve(process.cwd(), "src"));

  assert.deepEqual(offenders, [], "these Service nodes advertise a financial service in our name");
});
