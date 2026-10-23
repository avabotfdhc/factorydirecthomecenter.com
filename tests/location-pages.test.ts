import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

// Location pages must each earn their URL. Pages that differ only by place
// name are doorway pages under Google's spam policies, and on 2026-10-23 the
// seven pages on LocationPageTemplate were ~290 words with 57% of their text
// shared. Every page on the template now carries its own sections, FAQs, facts
// and public contacts — and none may print an invented delivery price.
const DIR = join(__dirname, "..", "src", "app", "locations");

const templatePages = readdirSync(DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory() && !d.name.startsWith("["))
  .map((d) => join(DIR, d.name, "page.tsx"))
  .filter((p) => existsSync(p) && readFileSync(p, "utf8").includes("<LocationPageTemplate"));

test("there are pages on LocationPageTemplate to check", () => {
  assert.ok(templatePages.length >= 8, `found ${templatePages.length}`);
});

for (const file of templatePages) {
  const src = readFileSync(file, "utf8");
  const name = file.split("/").slice(-2, -1)[0];

  test(`${name}: no dollar figure and no deliveryCost`, () => {
    assert.ok(!/deliveryCost/.test(src), "deliveryCost was an unsourced per-town price");
    assert.ok(!/\$\s?\d/.test(src), "dollar figures stay off location pages (pricing guide ranges only)");
  });

  test(`${name}: carries its own local sections and FAQs`, () => {
    assert.ok(/localSections:\s*\[/.test(src), "missing localSections");
    assert.ok(/faqs:\s*\[/.test(src), "missing faqs");
  });
}

// The pages rewritten in the 2026-10-23 batch also carry sourced facts, public
// contacts and their own meta description. Garrett predates the batch.
const REWRITTEN = ["butler", "waterloo", "wells-county", "whitley-county", "adams-county", "steuben-county", "lagrange-county"];
for (const name of REWRITTEN) {
  test(`${name}: has facts, contacts and its own meta description`, () => {
    const src = readFileSync(join(DIR, name, "page.tsx"), "utf8");
    assert.ok(/facts:\s*\[/.test(src), "missing facts");
    assert.ok(/contacts:\s*\[/.test(src), "missing contacts");
    assert.ok(/generateLocationMetadata\(\{[\s\S]*?description:/.test(src), "missing page-specific meta description");
  });
}
