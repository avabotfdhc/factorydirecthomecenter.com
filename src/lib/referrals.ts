// What we hand a buyer, and what we refuse to do with it.
//
// Kyle, 2026-09-23: "We do not make decisions for anything not a lender or
// contractor — we provide information so the client can choose. No
// recommendations disclaimers are important and should be present every place
// that matters."
//
// Two lists leave this dealership: the lender sheet (src/lib/lenders.ts) and
// the contractor referral list. Both are information, and neither is a
// recommendation — that distinction is the whole reason the buyer's own
// authorization can say "this selection was not referred or suggested", and
// the reason we carry no liability for a crew we did not hire and no referral
// interest in a loan we did not arrange. Say it wherever either list is
// offered; these strings are the single source so the wordings cannot drift
// apart.

/** Lenders. `LENDER_DISCLAIMER` in lenders.ts is the sheet's own verbatim line; this expands it. */
export const LENDER_NO_RECOMMENDATION =
  "Factory Direct Homes Center is not a lender and does not offer, arrange or broker financing. " +
  "The lender list names lenders our customers have used before — it is information, not a " +
  "recommendation. We are not affiliated with any of them, we receive nothing for naming them, " +
  "the order they appear in means nothing, and you may apply to as many as you like. The choice " +
  "is yours.";

/** Contractors. The same rule, for the list that goes out with every land purchase. */
export const CONTRACTOR_NO_RECOMMENDATION =
  "Site work, foundations, utilities and setup are yours to arrange. Our referral list names " +
  "licensed and insured contractors past customers have used — it is information, not a " +
  "recommendation or an endorsement. We do not hire, supervise, schedule or warrant them, we " +
  "receive nothing for naming them, and you are free to use anyone you choose.";

/** The one-line version, for the footer, where it has to hold for every page at once. */
export const REFERRAL_NO_RECOMMENDATION =
  "Lender and contractor lists are provided for information only. Factory Direct Homes Center " +
  "recommends no lender and no contractor, receives nothing for naming them, and does not hire, " +
  "supervise or warrant any contractor. You choose who you work with.";
