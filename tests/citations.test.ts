// Dead external citations stay dead: a URL retired once must not come back.
//
// Semrush's 08 Sep 2026 crawl reported 42 broken external links across 25
// pages. The sandbox cannot fetch an outbound host, so the finding sat
// unverified until 2026-10-19, when a search index confirmed the six URLs
// behind it: HUD retired its whole `/program_offices/` tree in the site
// rebuild, `consumerfinance.gov/housing/manufactured-housing/` and
// `naco.org/resources/manufactured-housing` no longer exist,
// `planning.org/knowledgebase/manufacturedhousing/` moved into the
// publications library, and the Indiana association publishes at
// imharvic.org, not indianamha.org.
//
// A network check is impossible here and would be flaky in CI anyway, so this
// file guards the one thing that can be checked offline: no source file may
// name a URL already measured dead. Replacing a working link with a broken one
// is the same defect, so a replacement needs evidence before it is typed here.
//
//   npm test

import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { getCitations } from "../src/lib/citations";

function sourceFiles(dir: string, found: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) sourceFiles(path, found);
    else if (/\.tsx?$/.test(path)) found.push(path);
  }
  return found;
}

// Each measured dead on 2026-10-19, with what replaced it.
const RETIRED: { pattern: RegExp; was: string; now: string }[] = [
  {
    pattern: /hud\.gov\/program_offices\//,
    was: "hud.gov/program_offices/… (retired in HUD's site rebuild)",
    now: "https://www.hud.gov/hud-partners/manufactured-home",
  },
  {
    pattern: /consumerfinance\.gov\/housing\/manufactured-housing/,
    was: "consumerfinance.gov/housing/manufactured-housing/ (no such landing page)",
    now: "the CFPB's manufactured-housing HMDA report on files.consumerfinance.gov",
  },
  {
    pattern: /naco\.org\/resources\/manufactured-housing/,
    was: "naco.org/resources/manufactured-housing (NACo documents live under /resource/)",
    now: "https://www.naco.org/resource/housing-americas-residents-regulations-codes-and-fees",
  },
  {
    pattern: /planning\.org\/knowledgebase\/manufacturedhousing/,
    was: "planning.org/knowledgebase/manufacturedhousing/",
    now: "https://www.planning.org/publications/document/9287254/",
  },
  {
    pattern: /indianamha\.org/,
    was: "indianamha.org (the association publishes at imharvic.org)",
    now: "https://www.imharvic.org/",
  },
];

test("no source file cites a URL already measured dead", () => {
  const offenders: string[] = [];
  for (const file of sourceFiles("src")) {
    if (file.endsWith(join("tests", "citations.test.ts"))) continue;
    const text = readFileSync(file, "utf8");
    for (const { pattern, was, now } of RETIRED) {
      if (pattern.test(text)) offenders.push(`${file}: ${was} — use ${now}`);
    }
  }
  assert.deepEqual(offenders, [], `dead external links:\n${offenders.join("\n")}`);
});

test("every citation URL is an absolute https URL", () => {
  const bad = getCitations(
    ["manufactured-homes", "financing", "zoning", "indiana", "rural", "ohio", "michigan", "permits"],
    100,
  ).filter((c) => !/^https:\/\/[^\s"']+$/.test(c.url));
  assert.deepEqual(bad, [], "a citation URL must be absolute https");
});
