/**
 * Renders the lender sheet that Factory Direct Homes Center hands to buyers —
 * the file uploaded to DealerTide as the financing attachment.
 *
 * Source of truth is src/lib/lenders.ts, so the printed sheet, the website
 * directory, Ava and the DealerTide records never drift apart. Unlike the
 * website table this sheet DOES print the named loan officers: it goes to one
 * buyer at a time, not to a crawler.
 *
 * Run: npm run lender-sheet   (needs LibreOffice on PATH for the HTML→PDF step)
 * Output: docs/lender-list/Factory-Direct-Homes-Center-Lender-List.pdf
 *
 * Not a build step and deliberately not written into public/ — the sheet
 * carries the loan officers' addresses and must not be served from the site.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readdirSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { BUSINESS } from "../src/lib/business";
import {
  LENDERS,
  LENDER_AUTHORIZATION,
  LENDER_DISCLAIMER,
  lenderAddress,
  lenderWebsiteLabel,
  type Lender,
} from "../src/lib/lenders";

const OUT_DIR = "docs/lender-list";
const OUT_NAME = "Factory-Direct-Homes-Center-Lender-List";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Website if the sheet gave one, otherwise the named loan officer's email. */
function contactCell(lender: Lender): string {
  return esc(lenderWebsiteLabel(lender) ?? lender.directContact ?? "");
}

function html(): string {
  const rows = LENDERS.map(
    (l) => `      <tr>
        <td class="name">${esc(l.name)}</td>
        <td class="nowrap">${esc(l.phone)}</td>
        <td>${esc(lenderAddress(l))}</td>
        <td class="contact">${contactCell(l)}</td>
        <td class="tick">&#9744;</td>
      </tr>`,
  ).join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${esc(BUSINESS.name)} — Lenders</title>
<style>
  @page { size: letter; margin: 0.6in; }
  body { font-family: "Liberation Sans", Arial, sans-serif; font-size: 8pt; color: #1a1a1a; }
  .letterhead { margin-bottom: 4pt; }
  hr.head { border: 0; border-top: 2px solid #1a1a1a; margin: 0 0 8pt 0; }
  .company { font-size: 14pt; font-weight: bold; letter-spacing: 0.4pt; }
  .meta { font-size: 8pt; color: #444; margin-top: 3pt; }
  h1 { font-size: 12pt; letter-spacing: 2pt; margin: 0 0 4pt 0; }
  .disclaimer { font-size: 8pt; margin: 0 0 8pt 0; line-height: 1.3; }
  table.lenders { border-collapse: collapse; width: 100%; table-layout: fixed; }
  col.c-name { width: 20%; } col.c-tel { width: 15%; } col.c-addr { width: 31%; }
  col.c-contact { width: 24%; } col.c-tick { width: 10%; }
  table.lenders th, table.lenders td { border: 1px solid #8c8c8c; padding: 2pt 4pt; text-align: left; vertical-align: top; }
  table.lenders th { background: #efefef; font-size: 7.5pt; text-transform: uppercase; letter-spacing: 0.3pt; }
  td.name { font-weight: bold; }
  td.nowrap { white-space: nowrap; }
  td.contact { font-size: 7.5pt; }
  td.tick, th.tick { text-align: center; width: 52pt; }
  .auth { margin-top: 9pt; font-size: 8pt; line-height: 1.35; }
  table.sig { border-collapse: collapse; margin-top: 10pt; font-size: 8pt; color: #444; }
  table.sig td { border: 0; padding: 0; }
  .foot { margin-top: 12pt; font-size: 7pt; color: #666; line-height: 1.4; }
</style>
</head>
<body>
  <div class="letterhead">
    <div class="company">${esc(BUSINESS.name)}</div>
    <div class="meta">${esc(BUSINESS.streetAddress)}, ${esc(BUSINESS.city)}, ${esc(BUSINESS.region)} ${esc(BUSINESS.postalCode)}
      &nbsp;&bull;&nbsp; ${esc(BUSINESS.phoneDisplay)}
      &nbsp;&bull;&nbsp; factorydirecthomescenter.com</div>
  </div>
  <hr class="head">

  <h1>LENDERS</h1>
  <p class="disclaimer">${esc(LENDER_DISCLAIMER)}</p>

  <table class="lenders" border="1" cellpadding="2" cellspacing="0" width="100%">
    <colgroup>
      <col class="c-name"><col class="c-tel"><col class="c-addr"><col class="c-contact"><col class="c-tick">
    </colgroup>
    <thead>
      <tr>
        <th>Name</th>
        <th>Telephone</th>
        <th>Address</th>
        <th>Website / Contact</th>
        <th class="tick">Authorization<br>to Submit App</th>
      </tr>
    </thead>
    <tbody>
${rows}
    </tbody>
  </table>

  <p class="auth">I/We ______________________________________   ${esc(LENDER_AUTHORIZATION.replace(/^I\/We /, ""))}</p>

  <table class="sig" cellpadding="0" cellspacing="0">
    <tr><td>_______________________________________</td><td>&nbsp;&nbsp;</td><td>______________________</td></tr>
    <tr><td>Customer</td><td>&nbsp;</td><td>Date</td></tr>
    <tr><td>_______________________________________</td><td>&nbsp;&nbsp;</td><td>______________________</td></tr>
    <tr><td>Customer</td><td>&nbsp;</td><td>Date</td></tr>
  </table>

  <p class="foot">${esc(BUSINESS.name)} is not a lender and does not arrange financing. Rates, terms and
  approval are determined solely by the lender you choose. This list is provided for your convenience and
  is not a referral, endorsement or recommendation of any lender.</p>
</body>
</html>`;
}

mkdirSync(OUT_DIR, { recursive: true });
const tmp = join(OUT_DIR, `${OUT_NAME}.html`);
writeFileSync(tmp, html(), "utf8");

// LibreOffice names the output after the input and drops it in --outdir. It
// needs absolute paths and a writable profile of its own, or it reports the
// unhelpful "source file could not be loaded" and exits 0-ish with no file.
const profile = mkdtempSync(join(tmpdir(), "lo-lender-sheet-"));
try {
  execFileSync(
    "soffice",
    [
      "--headless",
      `-env:UserInstallation=file://${profile}`,
      "--convert-to",
      "pdf:writer_pdf_Export",
      "--outdir",
      resolve(OUT_DIR),
      resolve(tmp),
    ],
    {
      stdio: "inherit",
      // LibreOffice picks its default paper size from the locale, and the
      // Writer/Web import ignores the CSS @page rule. en_US is what makes the
      // sheet come out US Letter instead of A4.
      env: { ...process.env, LC_ALL: "en_US.UTF-8", LANG: "en_US.UTF-8" },
    },
  );
} finally {
  rmSync(profile, { recursive: true, force: true });
  rmSync(tmp);
}

const produced = readdirSync(OUT_DIR).find((f) => f === `${OUT_NAME}.pdf`);
if (!produced) throw new Error(`LibreOffice produced no PDF in ${OUT_DIR}`);
renameSync(join(OUT_DIR, produced), join(OUT_DIR, `${OUT_NAME}.pdf`));
console.log(`wrote ${join(OUT_DIR, `${OUT_NAME}.pdf`)} — ${LENDERS.length} lenders`);
