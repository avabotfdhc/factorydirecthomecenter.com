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

// Homes whose floor plan can be ordered with a different bedroom count or a
// swappable room (study/den in place of a bedroom or dining space). Source:
// full audit of Champion's 2026 Aspire SALES sheets (Box: Topeka IN/Dutch
// Housing/2026 Aspire) — every listed model's sheet was checked for option
// pages; entries below are the ones whose L-102 page prints a bedroom or
// room option. bedsMin/bedsMax bound the orderable range around the CMS's
// listed count; cards show the range, bed filters match any count in it,
// and the detail page explains the option. A note without a range is a
// non-bedroom factory option (study/den) shown on the detail page only.
export interface BedOption {
  bedsMin?: number;
  bedsMax?: number;
  note: string;
}

const twoBedOption: BedOption = {
  bedsMin: 2,
  note: "Champion builds this floor plan as a 3-bedroom or as a 2-bedroom with a larger living area — your choice at the factory.",
};

export const bedOptions: Record<string, BedOption> = {
  // 3-bedroom singles with a factory 2-Bedroom Option on the sales sheet
  "dutch-aspire-1466h32082": twoBedOption,
  "dutch-aspire-1470h32082": twoBedOption,
  "dutch-aspire-1472h32082": twoBedOption,
  "dutch-aspire-1476h32082": twoBedOption,
  "dutch-aspire-1664h32212": twoBedOption,
  "dutch-aspire-1666h32085": twoBedOption,
  "dutch-aspire-1666h32212": twoBedOption,
  "dutch-aspire-1666h32217": twoBedOption,
  "dutch-aspire1666h32219": twoBedOption,
  "dutch-aspire-1668h32085": twoBedOption,
  "dutch-aspire1668h32087": twoBedOption,
  "dutch-aspire1676h32089": twoBedOption,
  "dutch-aspire1676h32212": twoBedOption,
  "dutch-aspire1676h32221": twoBedOption,

  // Double wides with a factory 2-Bedroom Option
  "dutch-aspire-monroe-2840h32024": twoBedOption,
  "appleton": twoBedOption, // 2842H32388

  // Non-bedroom factory options (room swaps) printed on the sales sheets
  "belvidere": { note: "An optional study can be ordered in place of the formal dining space." }, // 2856H32392
  "dutch-aspire-verona-3276h42179": { note: "An optional study configuration is available for this floor plan." },
  "dutch-aspire-summit-2864h42a1c": { note: "An optional study configuration is available for this floor plan." },
  "dutch-aspire-summit-2868h52a1c": { note: "An optional study configuration is available for this floor plan." },

  // ——— Paramount Series (repo-published; same audit, 2026 Paramount SALES
  // sheets — same floor plans carry the same factory options) ———
  "paramount-1466h32082": twoBedOption,
  "paramount-1470h32082": twoBedOption,
  "paramount-1472h32082": twoBedOption,
  "paramount-1476h32082": twoBedOption,
  "paramount-1660h32206": twoBedOption,
  "paramount-1664h32212": twoBedOption,
  "paramount-1666h32085": twoBedOption,
  "paramount-1666h32212": twoBedOption,
  "paramount-1666h32217": twoBedOption,
  "paramount-1666h32219": twoBedOption,
  "paramount-1668h32085": twoBedOption,
  "paramount-1668h32087": twoBedOption,
  "paramount-1672h32087": twoBedOption,
  "paramount-1676h32085": twoBedOption,
  "paramount-1676h32087": twoBedOption,
  "paramount-1676h32089": twoBedOption,
  "paramount-1676h32212": twoBedOption,
  "paramount-1676h32221": twoBedOption,
  "paramount-sundance-2444h32167": twoBedOption,
  "paramount-sundance-2448h32167": twoBedOption,
  "paramount-sundance-2452h32167": twoBedOption,
  "paramount-monroe-2840h32024": twoBedOption,
  "paramount-appleton-2842h32388": twoBedOption,
  "paramount-monroe-2844h32024": twoBedOption,
  "paramount-bayfield-2844h32169": twoBedOption,
  "paramount-monroe-2848h32024": twoBedOption,
  "paramount-lancaster-2848h32160": twoBedOption,
  "paramount-bayfield-2848h32169": twoBedOption,
  "paramount-belvidere-2856h32392": { note: "An optional study can be ordered in place of the formal dining space." },
  "paramount-alberta-2864h42177": { note: "An optional study configuration is available for this floor plan." },
  "paramount-summit-2864h42a1c": { note: "An optional study configuration is available for this floor plan." },
  "paramount-summit-2868h52a1c": { note: "An optional study configuration is available for this floor plan." },
};
