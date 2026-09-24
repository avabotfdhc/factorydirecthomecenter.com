// Texts and calls go to two different lines, and neither number is retyped.
//
// Until 2026-09-23 the mobile bar's "Text" button composed a message to
// `sms:+12603081457` — the voice line. The Google Business Profile advertises
// a separate texting number, so every text a buyer sent from their phone
// arrived at a line that does not answer them: a lead lost silently, with the
// buyer believing they had made contact.
//
// The number now comes from src/lib/business.ts. This file guards the shape
// of that fix rather than the digits: a hard-coded recipient in an `sms:`
// href is the defect, whatever it happens to spell.
//
//   npm test

import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { BUSINESS, dialable } from "../src/lib/business";

function sourceFiles(dir: string, found: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) sourceFiles(path, found);
    else if (/\.tsx?$/.test(path)) found.push(path);
  }
  return found;
}

test("dialable strips a display number down to what a tel:/sms: href wants", () => {
  assert.equal(dialable("+1-260-308-1457"), "+12603081457");
  assert.equal(dialable("(260) 750-1828"), "2607501828");
  assert.equal(dialable("+12603081457"), "+12603081457", "an already-dialable number is unchanged");
});

test("texts and calls are addressed to different lines", () => {
  assert.notEqual(
    dialable(BUSINESS.smsNumber),
    dialable(BUSINESS.telephone),
    "smsNumber is the line that receives texts; the voice line does not. If these ever " +
      "become one number, say so here rather than deleting the distinction.",
  );
});

test("the display forms agree with the dialable ones", () => {
  assert.equal(dialable(BUSINESS.smsDisplay), dialable(BUSINESS.smsNumber).replace("+1", ""));
  assert.equal(dialable(BUSINESS.phoneDisplay), dialable(BUSINESS.telephone).replace("+1", ""));
});

test("no sms: link in the site hard-codes a recipient", () => {
  // `sms:?&body=…` — share-with-a-friend, no recipient — is the one legitimate
  // shape, so the pattern only rejects an sms: followed by a number.
  const offenders: string[] = [];
  for (const file of sourceFiles("src")) {
    readFileSync(file, "utf8")
      .split("\n")
      .forEach((line, i) => {
        if (/sms:\s*\+?\d/.test(line)) offenders.push(`${file}:${i + 1}`);
      });
  }
  assert.deepEqual(
    offenders,
    [],
    "an sms: href names a number directly — read BUSINESS.smsNumber through dialable() instead, " +
      "or the next time the texting line changes this one will be missed",
  );
});
