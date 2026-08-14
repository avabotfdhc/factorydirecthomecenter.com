// Repo-side spec corrections for CMS-served (Aspire) floor plans, keyed by
// slug. Applied on top of the CMS response in api-content.ts — used only when
// the CMS value is provably wrong against Champion's own floor-plan drawing
// (the S3 banner literature). Audit 2026-08-14: every CMS sq ft value was
// OCR/visually checked against its drawing; the catalog is otherwise correct
// conditioned square footage, so this list stays deliberately tiny. Fix the
// CMS record and the override can be deleted.
export const sqftOverrides: Record<string, number> = {
  // Drawing 112APF-2852H32170 prints 1387 Sq. Ft.; CMS says 1386.
  "brighton-3-bed-2-bath-manufactured-home-1386-sq-ft-champion-aspire": 1387,
  // CMS record is corrupt (1 sq ft). Champion's same-box 1652H21 plan
  // (52' x 15'2") prints 789 conditioned — its sibling listing 1652h21151
  // carries the same figure.
  "dutch-aspire-1652h21083": 789,
};

// Homes whose floor plan can be optioned with a different bedroom count
// (a den/bonus/activity room swaps for a bedroom, or vice versa). bedsMax is
// the highest configurable count; the base listing's beds stays the minimum.
// Cards show the range ("2–3 Bed"), search matches any count in the range,
// and the detail page explains the option. Entries require evidence from
// Champion materials or the dealer — extend as Kyle confirms more plans.
export interface BedOption {
  bedsMax: number;
  note: string;
}

export const bedOptions: Record<string, BedOption> = {
  // Champion published separate 2-bedroom and 3-bedroom Matterport scans of
  // this plan — the third bedroom is an orderable option.
  "dutch-aspire1676h32089": {
    bedsMax: 3,
    note: "This floor plan can be ordered as a 2-bedroom with a larger living area or as a 3-bedroom — your choice at the factory.",
  },
};
