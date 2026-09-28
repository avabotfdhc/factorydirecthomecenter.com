// Accessibility guards from the 2026-09-28 Lighthouse pass.
//
// Lighthouse scored / at 97 for accessibility because the body-text token
// --color-gray (#64748b) is 4.44:1 on cream and 4.03:1 on cream-dark, under
// the 4.5:1 AA floor on the two backgrounds most of the site sits on. An axe
// sweep of every page then found the same few pairings repeated elsewhere,
// plus eleven pages nesting their own <main> inside the layout's <main>.
//
// Contrast of individual elements can only be checked in a browser (axe
// composites alpha against the real background). What CAN be held in CI is
// the token itself and the landmark structure, which is what these do.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const css = readFileSync("src/app/globals.css", "utf8");

function token(name: string): string {
  const m = css.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`));
  assert.ok(m, `--${name} must be a 6-digit hex in globals.css`);
  return m[1];
}

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

test("--color-gray passes AA on white, cream and cream-dark", () => {
  const gray = token("color-gray");
  for (const bg of ["#FFFFFF", token("color-cream"), token("color-cream-dark")]) {
    const ratio = contrast(gray, bg);
    assert.ok(ratio >= 4.5, `--color-gray ${gray} on ${bg} is ${ratio.toFixed(2)}:1, under 4.5:1`);
  }
});

test("text tokens made for dark and light surfaces keep their contrast", () => {
  const charcoal = token("color-charcoal");
  const onDark = contrast(token("color-lime-on-dark"), charcoal);
  assert.ok(onDark >= 4.5, `--color-lime-on-dark on charcoal is ${onDark.toFixed(2)}:1`);
  const orange = contrast(token("color-orange-text"), "#FFFFFF");
  assert.ok(orange >= 4.5, `--color-orange-text on white is ${orange.toFixed(2)}:1`);
});

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (p.endsWith(".tsx")) out.push(p);
  }
  return out;
}

test("only the root layout renders <main>", () => {
  // The layout wraps every page in <main id="main-content">; a page that opens
  // its own <main> ships two main landmarks (axe landmark-no-duplicate-main).
  // /admin has its own layout tree and is not public.
  const offenders = walk("src")
    .filter((f) => !f.endsWith(join("app", "layout.tsx")) && !f.includes(join("app", "admin")))
    .filter((f) => /<main[\s>]/.test(readFileSync(f, "utf8")));
  assert.deepEqual(offenders, [], `nested <main> in: ${offenders.join(", ")}`);
});
