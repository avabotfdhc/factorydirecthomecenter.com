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
