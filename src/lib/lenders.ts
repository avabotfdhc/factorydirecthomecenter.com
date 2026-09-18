// The lender list Kyle hands to buyers who ask about financing.
//
// Source: the "LENDERS" sheet Factory Direct Homes Center gives out with a
// credit application (Adobe Acrobat doc, transcribed 2026-09-18). It is also
// the DealerTide attachment and the DealerTide lender records — this file is
// the single source of truth for all three, so a phone number or a loan
// officer only ever changes in one place.
//
// TWO CONTACT LANES, ON PURPOSE. `phone` and `website` are the lender's own
// public front door and are safe to publish. `directContact` is a named loan
// officer's email from the sheet — those people did not agree to appear on a
// public web page, and a published address gets scraped within days. It is
// therefore used only where the sheet goes to one named buyer at a time: the
// printed/emailed lender sheet and the DealerTide record. Never render
// `directContact` in a page, a sitemap, a feed or Ava's replies.
//
// The disclaimer is not decoration. Steering a buyer to a particular lender is
// what RESPA Section 8 and the Indiana dealer rules are about, and the sheet's
// own authorization line ("This selection was not referred or suggested")
// depends on it. Publish the list; never rank it, never call one "our" lender,
// never pre-tick a row.

export interface Lender {
  name: string;
  /** Voice number exactly as the sheet prints it, extension included. */
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  /** Public website or application URL. Absent when the sheet gave only an email. */
  website?: string;
  /**
   * Named loan officer's email from the sheet. Internal + printed sheet only —
   * see the note above. Absent when the sheet gave only a website.
   */
  directContact?: string;
}

/** Verbatim from the sheet. Do not soften it, do not move it below the list. */
export const LENDER_DISCLAIMER =
  "Factory Direct Homes Center does not recommend any specific lender. Below is a list of lenders that are likely to provide financing for Manufactured Homes.";

/** The authorization the buyer signs when they pick lenders to apply to. */
export const LENDER_AUTHORIZATION =
  "I/We hereby grant authorization to fax my/our credit application to the lenders of my/our choice selected above. This selection was not referred or suggested.";

/** Sheet order, kept so the printed sheet and the CRM read the same top to bottom. */
export const LENDERS: readonly Lender[] = [
  {
    name: "21st Mortgage",
    phone: "800-955-0021",
    address: { street: "620 Market St., One Center Square", city: "Knoxville", state: "TN", zip: "37902" },
    website: "https://apply.21stmortgage.com/?sretid=3886-1",
  },
  {
    name: "InTerra Credit Union",
    phone: "574-534-2506",
    address: { street: "106 Crystal Heights Blvd", city: "Middlebury", state: "IN", zip: "46540" },
    directContact: "alexandriah@interracu.com",
  },
  {
    name: "Cascade Loans",
    phone: "480-812-3221",
    address: { street: "192 Cimarron Park Loop, STE B", city: "Buda", state: "TX", zip: "78610" },
    website: "https://www.cascadeloans.com",
  },
  {
    name: "Community Bank",
    phone: "715-458-2513",
    address: { street: "101 W Main St.", city: "Cameron", state: "WI", zip: "54822" },
    directContact: "slbohn@communitybankwi.com",
  },
  {
    name: "Credit Human",
    phone: "866-279-1899 x6685",
    address: { street: "33801 1st Way South #100", city: "Federal Way", state: "WA", zip: "98003" },
    website: "https://www.credithuman.com",
  },
  {
    name: "Farmers Savings Bank",
    phone: "319-752-6200",
    address: { street: "3131 Sunnyside Ave", city: "Burlington", state: "IA", zip: "52601" },
    directContact: "lfogle@fsbwever.com",
  },
  {
    name: "Lake Michigan Credit Union",
    phone: "616-234-6495",
    address: { street: "4050 Lake Dr. SE", city: "Grand Rapids", state: "MI", zip: "49546" },
    directContact: "Terry.wickering@LMCU.org",
  },
  {
    name: "Superior Choice",
    phone: "715-392-5616 ext. 666493",
    address: { street: "2817 Tower Ave.", city: "Superior", state: "WI", zip: "54880" },
    directContact: "nancyr@superiorchoice.com",
  },
  {
    name: "West Central Bank",
    phone: "217-476-3325",
    address: { street: "400 E Buchanan St.", city: "Ashland", state: "IL", zip: "62612" },
    directContact: "lynette@westcentralbank.com",
  },
  {
    name: "Triad Financial Services",
    phone: "800-522-2013",
    address: { street: "4336 Pablo Oaks Court", city: "Jacksonville", state: "FL", zip: "32224" },
    website: "https://www.triadfs.com",
  },
];

/** "620 Market St., One Center Square, Knoxville, TN 37902" */
export function lenderAddress(lender: Lender): string {
  const { street, city, state, zip } = lender.address;
  return `${street}, ${city}, ${state} ${zip}`;
}

/** Digits only, for a tel: href. Extensions are dropped — they are not dialable in the link. */
export function lenderTelHref(lender: Lender): string {
  return `tel:${lender.phone.split(/\s*(?:x|ext\.?)\s*/i)[0].replace(/\D/g, "")}`;
}

/** "www.triadfs.com" — the bare host, for display. */
export function lenderWebsiteLabel(lender: Lender): string | null {
  if (!lender.website) return null;
  return lender.website.replace(/^https?:\/\//, "").replace(/\/$/, "");
}
