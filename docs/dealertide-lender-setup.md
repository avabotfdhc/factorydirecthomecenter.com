# Lender list → DealerTide

Two jobs Kyle asked for on 2026-09-18:

1. The lender sheet available as an **attachment** to send prospects asking about financing.
2. The ten lenders added as **selectable lenders** in DealerTide.

Both are configuration inside the DealerTide (Renter Insight) web app. **Neither can be done
from this repo.** The partner API we integrate with exposes `GET /vehicles`, `POST /leads` and
the CRM read endpoints (`/locations`, `/contacts`, `/deals`, `/quotes`) — there is no lender or
attachment endpoint, no DealerTide app on Zapier, and the agent sandbox's network policy blocks
`renterinsight-api-prod.onrender.com` outright. So the steps below are Kyle's to run in the UI.

**The exact menu names below are not verified.** No one on this side has seen DealerTide's admin
screens. Treat the navigation as "look for something along these lines", and the data tables as
the part that is exact.

---

## 1. Upload the attachment

File: [`Factory-Direct-Homes-Center-Lender-List.pdf`](./lender-list/Factory-Direct-Homes-Center-Lender-List.pdf)
(one page, US Letter, letterhead + the ten lenders + the authorization signature block).

1. In DealerTide, open **Settings / Admin → Documents** (may be called Attachments, Templates,
   Files or Document Library).
2. Upload the PDF. Name it **`Lender List`** — short, because the name is what shows in the
   attachment picker when composing an email.
3. If there is a category or tag field, file it under **Financing**.
4. If there is a "available to send from Deals/Leads" or "customer-facing" toggle, turn it on —
   that is what makes it appear in the attachment picker rather than only in the library.
5. Send yourself a test email from a lead record with the attachment picked, and open the PDF
   from that email before relying on it.

If DealerTide has an email-template builder, also add the attachment to whichever template
answers financing enquiries, so it goes out without anyone remembering to tick it.

## 2. Add the ten lenders

Look for **Settings / Admin → Lenders** (may be under Finance, F&I, Lending or Deal Setup). Add
one record per row. If DealerTide asks for a lender *type*, everything here is
manufactured-home / chattel lending.

| Name | Telephone | Address | Website / contact |
|---|---|---|---|
| 21st Mortgage | 800-955-0021 | 620 Market St., One Center Square, Knoxville, TN 37902 | https://apply.21stmortgage.com/?sretid=3886-1 |
| InTerra Credit Union | 574-534-2506 | 106 Crystal Heights Blvd, Middlebury, IN 46540 | alexandriah@interracu.com |
| Cascade Loans | 480-812-3221 | 192 Cimarron Park Loop, STE B, Buda, TX 78610 | https://www.cascadeloans.com |
| Community Bank | 715-458-2513 | 101 W Main St., Cameron, WI 54822 | slbohn@communitybankwi.com |
| Credit Human | 866-279-1899 x6685 | 33801 1st Way South #100, Federal Way, WA 98003 | https://www.credithuman.com |
| Farmers Savings Bank | 319-752-6200 | 3131 Sunnyside Ave, Burlington, IA 52601 | lfogle@fsbwever.com |
| Lake Michigan Credit Union | 616-234-6495 | 4050 Lake Dr. SE, Grand Rapids, MI 49546 | Terry.wickering@LMCU.org |
| Superior Choice | 715-392-5616 ext. 666493 | 2817 Tower Ave., Superior, WI 54880 | nancyr@superiorchoice.com |
| West Central Bank | 217-476-3325 | 400 E Buchanan St., Ashland, IL 62612 | lynette@westcentralbank.com |
| Triad Financial Services | 800-522-2013 | 4336 Pablo Oaks Court, Jacksonville, FL 32224 | https://www.triadfs.com |

Three things to get right while entering them:

- **Do not mark one as default, preferred or primary.** The sheet the buyer signs says the
  selection "was not referred or suggested"; a pre-selected lender in the CRM contradicts the
  form the buyer is signing. If DealerTide forces a sort order, alphabetical is the neutral one.
- **Leave rate, term and fee fields blank** unless the lender gave you those numbers in writing.
  A stale rate in the CRM becomes a quoted rate on a customer's screen.
- The emails are named loan officers, not general inboxes — put them in the record's *contact*
  field, not a public-facing description.

### If those screens do not exist

Ask DealerTide support directly:

> We hand buyers a lender sheet with ten lenders and need two things in DealerTide: (1) the PDF
> available as a customer-facing attachment when emailing a lead about financing, and (2) the ten
> lenders set up as selectable lenders on a deal so we can record which ones a buyer authorized
> us to submit their application to. Which screens do those live on for our account, and can you
> bulk-load the lender records if I send a spreadsheet?

---

## Keeping the three copies in step

`src/lib/lenders.ts` is the source of truth. It feeds the PDF, the `/financing#lenders` table and
Ava's roster. When a lender, phone number or loan officer changes:

1. Edit `src/lib/lenders.ts`.
2. `npm run lender-sheet` (needs LibreOffice on PATH) — rewrites the PDF.
3. Re-upload the PDF in DealerTide and edit the matching lender record.

The website table shows **phone and website only**. The loan officers' email addresses appear in
the PDF and in DealerTide but never on a public page: those people did not agree to be listed on
factorydirecthomescenter.com, and published addresses get scraped. Keep it that way.

## Open question for Kyle

Superior Choice is written on the sheet as `715-392-5616 EXT 666493`. A six-digit extension is
unusual — worth one call to confirm before it goes out to buyers on a form.
