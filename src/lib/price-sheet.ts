// Champion price sheet — FDHC master, September 2026.
//
// Generated from the dealership's own master price sheet
// (FDHC_Price_Sheet_mASTER_unhidden.xlsx, "FDHC_Price_Sheet_Sept_2026_"), which
// is the authority on what a home costs. Every figure below is a direct input
// from that sheet; the arithmetic that turns them into an MSRP is the sheet's
// own, reproduced in msrpFor() and verified against it model by model.
//
// This exists because sale-home MSRPs used to be typed in by hand, and had
// drifted well above the sheet — by $12k on a single wide and by as much as
// $41k on a double — which inflated every "you save $X" figure derived from
// them. Deriving MSRP here means the published price and the price sheet can
// no longer disagree.
//
// To update after a new sheet: re-run the numbers below from the new workbook
// and adjust PRICE_SHEET_CONTROLS to match its Controls block.

/** The sheet's Controls block (rows 2-6). */
export const PRICE_SHEET_CONTROLS = {
  /** Everyday dealer discount off MSRP — the sheet's "Factory Direct %". */
  factoryDirectPercent: 0.05,
  /** Per-square-foot surcharge on single-section homes. */
  singleSurchargePerSqft: 1.8,
  /** Per-square-foot surcharge on HUD sectional (multi-section) homes. */
  sectionalSurchargePerSqft: 1.95,
  /** Dealer cost is marked up by this to reach MSRP. */
  msrpMultiplier: 1.85,
} as const;

export interface PriceSheetModel {
  /** Champion model number, e.g. "2852H32170". */
  model: string;
  /** Sheet display name, e.g. "52' Brighton". */
  name: string;
  /** Product family as grouped on the sheet. */
  family: string;
  /** "28'x52'" */
  size: string;
  beds: number;
  baths: number;
  sqft: number;
  /** Net base cost from the factory, before surcharge and pack. */
  netBase: number;
  /** Dealer pack, per the sheet's own column. */
  pack: number;
  /** True for HUD sectional homes, which carry the higher per-sqft surcharge. */
  sectional: boolean;
}

export const PRICE_SHEET: PriceSheetModel[] = [
  { model: "1432H11214", name: "1432H11214", family: "Dutch Aspire - Single", size: "14'x32'", beds: 1, baths: 1, sqft: 427, netBase: 25495, pack: 3000, sectional: false },
  { model: "1440H11065", name: "1440H11065", family: "Dutch Aspire - Single", size: "14'x40'", beds: 1, baths: 1, sqft: 533, netBase: 27475, pack: 3000, sectional: false },
  { model: "1444H11023", name: "1444H11023", family: "Dutch Aspire - Single", size: "14'x44'", beds: 1, baths: 1, sqft: 587, netBase: 29820, pack: 3000, sectional: false },
  { model: "1452H21023", name: "1452H21023", family: "Dutch Aspire - Single", size: "14'x52'", beds: 2, baths: 1, sqft: 693, netBase: 33150, pack: 3000, sectional: false },
  { model: "1452H21081", name: "1452H21081", family: "Dutch Aspire - Single", size: "14'x52'", beds: 2, baths: 1, sqft: 693, netBase: 32385, pack: 3000, sectional: false },
  { model: "1456H21023", name: "1456H21023", family: "Dutch Aspire - Single", size: "14'x56'", beds: 2, baths: 1, sqft: 747, netBase: 34815, pack: 3000, sectional: false },
  { model: "1456H21030", name: "1456H21030", family: "Dutch Aspire - Single", size: "14'x56'", beds: 2, baths: 1, sqft: 747, netBase: 34245, pack: 3000, sectional: false },
  { model: "1460H21216", name: "1460H21216", family: "Dutch Aspire - Single", size: "14'x60'", beds: 2, baths: 1, sqft: 800, netBase: 35010, pack: 3000, sectional: false },
  { model: "1460H22215", name: "1460H22215", family: "Dutch Aspire - Single", size: "14'x60'", beds: 2, baths: 2, sqft: 800, netBase: 36460, pack: 3000, sectional: false },
  { model: "1466H32082", name: "1466H32082", family: "Dutch Aspire - Single", size: "14'x66'", beds: 3, baths: 2, sqft: 880, netBase: 38195, pack: 3000, sectional: false },
  { model: "1470H32082", name: "1470H32082", family: "Dutch Aspire - Single", size: "14'x70'", beds: 3, baths: 2, sqft: 933, netBase: 40320, pack: 3000, sectional: false },
  { model: "1476H32082", name: "1476H32082", family: "Dutch Aspire - Single", size: "14'x76'", beds: 3, baths: 2, sqft: 1013, netBase: 42640, pack: 3000, sectional: false },
  { model: "1652H21083", name: "1652H21083", family: "Dutch Aspire - Single", size: "16'x52'", beds: 2, baths: 1, sqft: 789, netBase: 35605, pack: 3000, sectional: false },
  { model: "1652H21151", name: "1652H21151", family: "Dutch Aspire - Single", size: "16'x52'", beds: 2, baths: 1, sqft: 789, netBase: 35055, pack: 3000, sectional: false },
  { model: "1656H22208", name: "1656H22208", family: "Dutch Aspire - Single", size: "16'x56'", beds: 2, baths: 2, sqft: 849, netBase: 37260, pack: 3000, sectional: false },
  { model: "1660H22212", name: "1660H22212", family: "Dutch Aspire - Single", size: "16'x60'", beds: 2, baths: 2, sqft: 910, netBase: 39380, pack: 3000, sectional: false },
  { model: "1660H32206", name: "1660H32206", family: "Dutch Aspire - Single", size: "16'x60'", beds: 3, baths: 2, sqft: 910, netBase: 38095, pack: 3000, sectional: false },
  { model: "1664H32212", name: "1664H32212", family: "Dutch Aspire - Single", size: "16'x64'", beds: 3, baths: 2, sqft: 971, netBase: 40895, pack: 3000, sectional: false },
  { model: "1666H22091", name: "1666H22091", family: "Dutch Aspire - Single", size: "16'x66'", beds: 2, baths: 2, sqft: 1001, netBase: 44495, pack: 3000, sectional: false },
  { model: "1666H22232", name: "1666H22232", family: "Dutch Aspire - Single", size: "16'x66'", beds: 2, baths: 2, sqft: 1001, netBase: 41450, pack: 3000, sectional: false },
  { model: "1666H32085", name: "1666H32085", family: "Dutch Aspire - Single", size: "16'x66'", beds: 3, baths: 2, sqft: 1001, netBase: 39995, pack: 3000, sectional: false },
  { model: "1666H32212", name: "1666H32212", family: "Dutch Aspire - Single", size: "16'x66'", beds: 3, baths: 2, sqft: 1001, netBase: 42200, pack: 3000, sectional: false },
  { model: "1666H32217", name: "1666H32217", family: "Dutch Aspire - Single", size: "16'x66'", beds: 3, baths: 2, sqft: 1001, netBase: 41680, pack: 3000, sectional: false },
  { model: "1666H32219", name: "1666H32219", family: "Dutch Aspire - Single", size: "16'x66'", beds: 3, baths: 2, sqft: 1001, netBase: 41035, pack: 3000, sectional: false },
  { model: "1668H22259", name: "1668H22259", family: "Dutch Aspire - Single", size: "16'x68'", beds: 2, baths: 2, sqft: 1031, netBase: 42295, pack: 3000, sectional: false },
  { model: "1668H32085", name: "1668H32085", family: "Dutch Aspire - Single", size: "16'x68'", beds: 3, baths: 2, sqft: 1031, netBase: 40830, pack: 3000, sectional: false },
  { model: "1668H32087", name: "1668H32087", family: "Dutch Aspire - Single", size: "16'x68'", beds: 3, baths: 2, sqft: 1031, netBase: 41850, pack: 3000, sectional: false },
  { model: "1668H32220", name: "1668H32220", family: "Dutch Aspire - Single", size: "16'x68'", beds: 3, baths: 2, sqft: 1031, netBase: 42940, pack: 3000, sectional: false },
  { model: "1672H32087", name: "1672H32087", family: "Dutch Aspire - Single", size: "16'x72'", beds: 3, baths: 2, sqft: 1092, netBase: 43515, pack: 3000, sectional: false },
  { model: "1672H32090", name: "1672H32090", family: "Dutch Aspire - Single", size: "16'x72'", beds: 3, baths: 2, sqft: 1092, netBase: 43495, pack: 3000, sectional: false },
  { model: "1676H32085", name: "1676H32085", family: "Dutch Aspire - Single", size: "16'x76'", beds: 3, baths: 2, sqft: 1153, netBase: 44160, pack: 3000, sectional: false },
  { model: "1676H32087", name: "1676H32087", family: "Dutch Aspire - Single", size: "16'x76'", beds: 3, baths: 2, sqft: 1153, netBase: 45180, pack: 3000, sectional: false },
  { model: "1676H32089", name: "1676H32089", family: "Dutch Aspire - Single", size: "16'x76'", beds: 3, baths: 2, sqft: 1071, netBase: 47995, pack: 3000, sectional: false },
  { model: "1676H32090", name: "1676H32090", family: "Dutch Aspire - Single", size: "16'x76'", beds: 3, baths: 2, sqft: 1153, netBase: 43995, pack: 3000, sectional: false },
  { model: "1676H32091", name: "1676H32091", family: "Dutch Aspire - Single", size: "16'x76'", beds: 3, baths: 2, sqft: 1153, netBase: 48660, pack: 3000, sectional: false },
  { model: "1676H32107", name: "1676H32107", family: "Dutch Aspire - Single", size: "16'x76'", beds: 3, baths: 2, sqft: 1153, netBase: 43995, pack: 3000, sectional: false },
  { model: "1676H32212", name: "1676H32212", family: "Dutch Aspire - Single", size: "16'x76'", beds: 3, baths: 2, sqft: 1153, netBase: 47730, pack: 3000, sectional: false },
  { model: "1676H32222", name: "1676H32222", family: "Dutch Aspire - Single", size: "16'x76'", beds: 3, baths: 2, sqft: 1153, netBase: 46395, pack: 3000, sectional: false },
  { model: "1676H32259", name: "1676H32259", family: "Dutch Aspire - Single", size: "16'x76'", beds: 3, baths: 2, sqft: 1153, netBase: 44995, pack: 3000, sectional: false },
  { model: "1456H22P01", name: "PEAK", family: "Prime - Single Section", size: "14' x 56'", beds: 2, baths: 2, sqft: 747, netBase: 30195, pack: 3000, sectional: false },
  { model: "1456H22P02", name: "PEAK REVERSE AISLE", family: "Prime - Single Section", size: "14' x 56'", beds: 2, baths: 2, sqft: 747, netBase: 30195, pack: 3000, sectional: false },
  { model: "1460H22P01", name: "CREST", family: "Prime - Single Section", size: "14' x 60'", beds: 2, baths: 2, sqft: 800, netBase: 31980, pack: 3000, sectional: false },
  { model: "1460H22P02", name: "CREST REVERSE AISLE", family: "Prime - Single Section", size: "14' x 60'", beds: 2, baths: 2, sqft: 800, netBase: 31980, pack: 3000, sectional: false },
  { model: "1466H32P01", name: "ZENITH", family: "Prime - Single Section", size: "14' x 66'", beds: 2, baths: 2, sqft: 880, netBase: 34200, pack: 3000, sectional: false },
  { model: "1466H32P02", name: "ZENITH REVERSE AISLE", family: "Prime - Single Section", size: "14' x 66'", beds: 2, baths: 2, sqft: 880, netBase: 34200, pack: 3000, sectional: false },
  { model: "1636H11P01", name: "PIKE", family: "Prime - Single Section", size: "16' x 36'", beds: 1, baths: 1, sqft: 546, netBase: 26495, pack: 3000, sectional: false },
  { model: "1648H21P01", name: "FULTON", family: "Prime - Single Section", size: "16' x 48'", beds: 2, baths: 1, sqft: 728, netBase: 29995, pack: 3000, sectional: false },
  { model: "1648H21P02", name: "FULTON REVERSE AISLE", family: "Prime - Single Section", size: "16' x 48'", beds: 2, baths: 1, sqft: 728, netBase: 29995, pack: 3000, sectional: false },
  { model: "1652H21P01", name: "GALLATIN", family: "Prime - Single Section", size: "16' x 52'", beds: 2, baths: 1, sqft: 789, netBase: 30995, pack: 3000, sectional: false },
  { model: "1652H21P02", name: "GALLATIN REVERSE AISLE", family: "Prime - Single Section", size: "16' x 52'", beds: 2, baths: 1, sqft: 789, netBase: 30995, pack: 3000, sectional: false },
  { model: "1656H22P01", name: "BARKLEY", family: "Prime - Single Section", size: "16' x 56'", beds: 2, baths: 2, sqft: 849, netBase: 31960, pack: 3000, sectional: false },
  { model: "1656H22P02", name: "BARKLEY REVERSE AISLE", family: "Prime - Single Section", size: "16' x 56'", beds: 2, baths: 2, sqft: 849, netBase: 31960, pack: 3000, sectional: false },
  { model: "1660H22P01", name: "SPIRE", family: "Prime - Single Section", size: "16' x 60'", beds: 2, baths: 2, sqft: 910, netBase: 33220, pack: 3000, sectional: false },
  { model: "1660H22P02", name: "SPIRE REVERSE AISLE", family: "Prime - Single Section", size: "16' x 60'", beds: 2, baths: 2, sqft: 910, netBase: 33220, pack: 3000, sectional: false },
  { model: "1660H32P05", name: "CASEY", family: "Prime - Single Section", size: "16' x 60'", beds: 3, baths: 2, sqft: 910, netBase: 34095, pack: 3000, sectional: false },
  { model: "1666H32P01", name: "VERTEX", family: "Prime - Single Section", size: "16' x 66'", beds: 3, baths: 2, sqft: 1001, netBase: 36720, pack: 3000, sectional: false },
  { model: "1666H32P02", name: "VERTEX REVERSE AISLE", family: "Prime - Single Section", size: "16' x 66'", beds: 3, baths: 2, sqft: 1001, netBase: 36720, pack: 3000, sectional: false },
  { model: "1666H32P07", name: "HICKMAN", family: "Prime - Single Section", size: "16' x 66'", beds: 3, baths: 2, sqft: 1092, netBase: 38580, pack: 3000, sectional: false },
  { model: "1666H32P09", name: "PENDLETON", family: "Prime - Single Section", size: "16' x 66'", beds: 3, baths: 2, sqft: 1000, netBase: 38580, pack: 3000, sectional: false },
  { model: "1672H32P01", name: "BARDSTOWN", family: "Prime - Single Section", size: "16' x 72'", beds: 3, baths: 2, sqft: 1092, netBase: 37350, pack: 3000, sectional: false },
  { model: "1672H32P02", name: "BARDSTOWN REVERSE AISLE", family: "Prime - Single Section", size: "16' x 72'", beds: 3, baths: 2, sqft: 1092, netBase: 37350, pack: 3000, sectional: false },
  { model: "1672H32P07", name: "BALLARD", family: "Prime - Single Section", size: "16' x 72'", beds: 3, baths: 2, sqft: 1092, netBase: 39210, pack: 3000, sectional: false },
  { model: "1672H32P09", name: "POWELL", family: "Prime - Single Section", size: "16' x 72'", beds: 3, baths: 2, sqft: 1092, netBase: 39210, pack: 3000, sectional: false },
  { model: "1676H32P01", name: "RIDGE", family: "Prime - Single Section", size: "16' x 76'", beds: 3, baths: 2, sqft: 1152, netBase: 39620, pack: 3000, sectional: false },
  { model: "1676H32P02", name: "RIDGE REVERSE AISLE", family: "Prime - Single Section", size: "16' x 76'", beds: 3, baths: 2, sqft: 1152, netBase: 39620, pack: 3000, sectional: false },
  { model: "1676H32P06", name: "MONTE", family: "Prime - Single Section", size: "16' x 76'", beds: 3, baths: 2, sqft: 1152, netBase: 40695, pack: 3000, sectional: false },
  { model: "1676H32P07", name: "SOMERSET", family: "Prime - Single Section", size: "16' x 76'", beds: 3, baths: 2, sqft: 1152, netBase: 40995, pack: 3000, sectional: false },
  { model: "1676H32P09", name: "FLOYD", family: "Prime - Single Section", size: "16' x 76'", beds: 3, baths: 2, sqft: 1152, netBase: 40995, pack: 3000, sectional: false },
  { model: "2448H32P02", name: "PLATEAU", family: "Prime - Multi-Section", size: "24' x 48'", beds: 3, baths: 2, sqft: 1120, netBase: 46185, pack: 3000, sectional: true },
  { model: "2456H32P02", name: "HORIZON", family: "Prime - Multi-Section", size: "24' x 56'", beds: 3, baths: 2, sqft: 1306, netBase: 49210, pack: 3000, sectional: true },
  { model: "2844H32P01", name: "ESTILL", family: "Prime - Multi-Section", size: "28' x 44'", beds: 3, baths: 2, sqft: 1173, netBase: 45190, pack: 3000, sectional: true },
  { model: "2848H32P06", name: "CHURCHILL", family: "Prime - Multi-Section", size: "28' x 48'", beds: 3, baths: 2, sqft: 1280, netBase: 47400, pack: 3000, sectional: true },
  { model: "2852H32P01", name: "MERCER", family: "Prime - Multi-Section", size: "28' x 52'", beds: 3, baths: 2, sqft: 1387, netBase: 48795, pack: 3000, sectional: true },
  { model: "2856H32P01", name: "APEX", family: "Prime - Multi-Section", size: "28' x 56'", beds: 3, baths: 2, sqft: 1493, netBase: 49645, pack: 3000, sectional: true },
  { model: "2856H42P01", name: "The Crown", family: "Prime - Multi-Section", size: "28' x 56'", beds: 4, baths: 2, sqft: 1493, netBase: 50445, pack: 3000, sectional: true },
  { model: "2868H42P01", name: "THE GRAND", family: "Prime - Multi-Section", size: "28' x 68'", beds: 4, baths: 2, sqft: 1813, netBase: 58695, pack: 3000, sectional: true },
  { model: "2876H53P01", name: "PINNACLE", family: "Prime - Multi-Section", size: "28' x 76'", beds: 5, baths: 3, sqft: 2027, netBase: 63995, pack: 3000, sectional: true },
  { model: "2840H32024", name: "40' Monroe", family: "Dutch Aspire - Multi-Section", size: "28'x40'", beds: 3, baths: 2, sqft: 1067, netBase: 48075, pack: 3000, sectional: true },
  { model: "2842H32388", name: "Appleton", family: "Dutch Aspire - Multi-Section", size: "28'x42'", beds: 3, baths: 2, sqft: 1120, netBase: 50195, pack: 3000, sectional: true },
  { model: "2844H32024", name: "44' Monroe", family: "Dutch Aspire - Multi-Section", size: "28'x44'", beds: 3, baths: 2, sqft: 1232, netBase: 50395, pack: 3000, sectional: true },
  { model: "2844H32169", name: "44' Bayfield", family: "Dutch Aspire - Multi-Section", size: "28'x44'", beds: 3, baths: 2, sqft: 1178, netBase: 51805, pack: 3000, sectional: true },
  { model: "2848H32024", name: "48' Monroe", family: "Dutch Aspire - Multi-Section", size: "28'x48'", beds: 3, baths: 2, sqft: 1344, netBase: 52995, pack: 3000, sectional: true },
  { model: "2848H32160", name: "48' Lancaster", family: "Dutch Aspire - Multi-Section", size: "28'x48'", beds: 3, baths: 2, sqft: 1280, netBase: 53695, pack: 3000, sectional: true },
  { model: "2848H32169", name: "48' Bayfield", family: "Dutch Aspire - Multi-Section", size: "28'x48'", beds: 3, baths: 2, sqft: 1280, netBase: 54165, pack: 3000, sectional: true },
  { model: "2848H32170", name: "48' Brighton", family: "Dutch Aspire - Multi-Section", size: "28'x48'", beds: 3, baths: 2, sqft: 1280, netBase: 54075, pack: 3000, sectional: true },
  { model: "2848H32171", name: "48' Lincoln", family: "Dutch Aspire - Multi-Section", size: "28'x48'", beds: 3, baths: 2, sqft: 1280, netBase: 49995, pack: 3000, sectional: true },
  { model: "2852H32034", name: "52' Ventura", family: "Dutch Aspire - Multi-Section", size: "28'x52'", beds: 3, baths: 2, sqft: 1387, netBase: 56395, pack: 3000, sectional: true },
  { model: "2852H32103", name: "52' Pontiac", family: "Dutch Aspire - Multi-Section", size: "28'x52'", beds: 3, baths: 2, sqft: 1387, netBase: 56795, pack: 3000, sectional: true },
  { model: "2852H32160", name: "52' Lancaster", family: "Dutch Aspire - Multi-Section", size: "28'x52'", beds: 3, baths: 2, sqft: 1387, netBase: 55875, pack: 3000, sectional: true },
  { model: "2852H32169", name: "52' Bayfield", family: "Dutch Aspire - Multi-Section", size: "28'x52'", beds: 3, baths: 2, sqft: 1387, netBase: 56495, pack: 3000, sectional: true },
  { model: "2852H32170", name: "52' Brighton", family: "Dutch Aspire - Multi-Section", size: "28'x52'", beds: 3, baths: 2, sqft: 1387, netBase: 56495, pack: 3000, sectional: true },
  { model: "2852H32171", name: "52' Lincoln", family: "Dutch Aspire - Multi-Section", size: "28'x52'", beds: 3, baths: 2, sqft: 1387, netBase: 52795, pack: 3000, sectional: true },
  { model: "2852H32172", name: "52' Warren", family: "Dutch Aspire - Multi-Section", size: "28'x52'", beds: 3, baths: 2, sqft: 1387, netBase: 56295, pack: 3000, sectional: true },
  { model: "2852H32173", name: "52' Jackson", family: "Dutch Aspire - Multi-Section", size: "28'x52'", beds: 3, baths: 2, sqft: 1387, netBase: 56495, pack: 3000, sectional: true },
  { model: "2852H32393", name: "Pierre", family: "Dutch Aspire - Multi-Section", size: "28'x52'", beds: 3, baths: 2, sqft: 1387, netBase: 56085, pack: 3000, sectional: true },
  { model: "2852H32A1C", name: "52' Summit", family: "Dutch Aspire - Multi-Section", size: "28'x52'", beds: 3, baths: 2, sqft: 1387, netBase: 55375, pack: 3000, sectional: true },
  { model: "2852H42096", name: "Livingston", family: "Dutch Aspire - Multi-Section", size: "28'x52'", beds: 4, baths: 2, sqft: 1387, netBase: 56395, pack: 3000, sectional: true },
  { model: "2856H32034", name: "56' Ventura", family: "Dutch Aspire - Multi-Section", size: "28'x56'", beds: 3, baths: 2, sqft: 1493, netBase: 57275, pack: 3000, sectional: true },
  { model: "2856H32103", name: "56' Pontiac", family: "Dutch Aspire - Multi-Section", size: "28'x56'", beds: 3, baths: 2, sqft: 1493, netBase: 57495, pack: 3000, sectional: true },
  { model: "2856H32168", name: "56' Bay Port", family: "Dutch Aspire - Multi-Section", size: "28'x56'", beds: 3, baths: 2, sqft: 1493, netBase: 61245, pack: 3000, sectional: true },
  { model: "2856H32171", name: "56' Lincoln", family: "Dutch Aspire - Multi-Section", size: "28'x56'", beds: 3, baths: 2, sqft: 1493, netBase: 57055, pack: 3000, sectional: true },
  { model: "2856H32172", name: "56' Warren", family: "Dutch Aspire - Multi-Section", size: "28'x56'", beds: 3, baths: 2, sqft: 1493, netBase: 57145, pack: 3000, sectional: true },
  { model: "2856H32173", name: "56' Jackson", family: "Dutch Aspire - Multi-Section", size: "28'x56'", beds: 3, baths: 2, sqft: 1493, netBase: 57345, pack: 3000, sectional: true },
  { model: "2856H32174", name: "56' Silverton", family: "Dutch Aspire - Multi-Section", size: "28'x56'", beds: 3, baths: 2, sqft: 1493, netBase: 55495, pack: 3000, sectional: true },
  { model: "2856H32301", name: "56' Easton", family: "Dutch Aspire - Multi-Section", size: "28'x56'", beds: 3, baths: 2, sqft: 1493, netBase: 60555, pack: 3000, sectional: true },
  { model: "2856H32392", name: "Belvidere", family: "Dutch Aspire - Multi-Section", size: "28'x56'", beds: 3, baths: 2, sqft: 1493, netBase: 57995, pack: 3000, sectional: true },
  { model: "2856H32A1C", name: "56' Summit", family: "Dutch Aspire - Multi-Section", size: "28'x56'", beds: 3, baths: 2, sqft: 1493, netBase: 57035, pack: 3000, sectional: true },
  { model: "2860H32047", name: "60' Woodward", family: "Dutch Aspire - Multi-Section", size: "28'x60'", beds: 3, baths: 2, sqft: 1600, netBase: 60195, pack: 3000, sectional: true },
  { model: "2860H32168", name: "60' Bay Port", family: "Dutch Aspire - Multi-Section", size: "28'x60'", beds: 3, baths: 2, sqft: 1600, netBase: 63755, pack: 3000, sectional: true },
  { model: "2860H32172", name: "60' Warren", family: "Dutch Aspire - Multi-Section", size: "28'x60'", beds: 3, baths: 2, sqft: 1600, netBase: 59615, pack: 3000, sectional: true },
  { model: "2860H32174", name: "60' Silverton", family: "Dutch Aspire - Multi-Section", size: "28'x60'", beds: 3, baths: 2, sqft: 1600, netBase: 58905, pack: 3000, sectional: true },
  { model: "2860H32301", name: "60' Easton", family: "Dutch Aspire - Multi-Section", size: "28'x60'", beds: 3, baths: 2, sqft: 1600, netBase: 62925, pack: 3000, sectional: true },
  { model: "2860H32394", name: "60' Odyssey", family: "Dutch Aspire - Multi-Section", size: "28'x60'", beds: 3, baths: 2, sqft: 1600, netBase: 58995, pack: 3000, sectional: true },
  { model: "2864H32047", name: "64' Woodward", family: "Dutch Aspire - Multi-Section", size: "28'x64'", beds: 3, baths: 2, sqft: 1707, netBase: 63065, pack: 3000, sectional: true },
  { model: "2864H32060", name: "Fillmore", family: "Dutch Aspire - Multi-Section", size: "28'x64'", beds: 3, baths: 2, sqft: 1707, netBase: 64345, pack: 3000, sectional: true },
  { model: "2864H32101", name: "Georgetown", family: "Dutch Aspire - Multi-Section", size: "28'x64'", beds: 3, baths: 2, sqft: 1707, netBase: 63595, pack: 3000, sectional: true },
  { model: "2864H42A1C", name: "64' Summit", family: "Dutch Aspire - Multi-Section", size: "28'x64'", beds: 4, baths: 2, sqft: 1707, netBase: 62695, pack: 3000, sectional: true },
  { model: "2868H32047", name: "68' Woodward", family: "Dutch Aspire - Multi-Section", size: "28'x68'", beds: 3, baths: 2, sqft: 1813, netBase: 67735, pack: 3000, sectional: true },
  { model: "2868H32394", name: "68' Odyssey", family: "Dutch Aspire - Multi-Section", size: "28'x68'", beds: 3, baths: 2, sqft: 1813, netBase: 64995, pack: 3000, sectional: true },
  { model: "2868H52A1C", name: "68' Summit", family: "Dutch Aspire - Multi-Section", size: "28'x68'", beds: 5, baths: 2, sqft: 1813, netBase: 65950, pack: 3000, sectional: true },
  { model: "2876H42180", name: "Baldwin", family: "Dutch Aspire - Multi-Section", size: "28'x76'", beds: 4, baths: 2, sqft: 2027, netBase: 71125, pack: 3000, sectional: true },
  { model: "3260H32207", name: "Timberlake", family: "Dutch Aspire - Multi-Section", size: "32' x 60'", beds: 3, baths: 2, sqft: 1820, netBase: 64995, pack: 3000, sectional: true },
  { model: "2432H21166", name: "32 Casper", family: "Dutch Aspire - Multi-Section", size: "24x32", beds: 2, baths: 1, sqft: 747, netBase: 38745, pack: 3000, sectional: true },
  { model: "2436H21166", name: "36 Casper", family: "Dutch Aspire - Multi-Section", size: "24x36", beds: 2, baths: 1, sqft: 840, netBase: 40810, pack: 3000, sectional: true },
  { model: "2440H32382", name: "40 Sheridan", family: "Dutch Aspire - Multi-Section", size: "24x40", beds: 3, baths: 2, sqft: 983, netBase: 46440, pack: 3000, sectional: true },
  { model: "2444H32167", name: "44 Sundance", family: "Dutch Aspire - Multi-Section", size: "24x44", beds: 3, baths: 2, sqft: 1027, netBase: 50595, pack: 3000, sectional: true },
  { model: "2444H32382", name: "44 Sheridan", family: "Dutch Aspire - Multi-Section", size: "24x44", beds: 3, baths: 2, sqft: 1027, netBase: 48585, pack: 3000, sectional: true },
  { model: "2448H32167", name: "48 Sundance", family: "Dutch Aspire - Multi-Section", size: "24x48", beds: 3, baths: 2, sqft: 1120, netBase: 52725, pack: 3000, sectional: true },
  { model: "2448H32382", name: "48 Sheridan", family: "Dutch Aspire - Multi-Section", size: "24x48", beds: 3, baths: 2, sqft: 1120, netBase: 50940, pack: 3000, sectional: true },
  { model: "2448H32384", name: "Fairplay", family: "Dutch Aspire - Multi-Section", size: "24x48", beds: 3, baths: 2, sqft: 1120, netBase: 51235, pack: 3000, sectional: true },
  { model: "2452H32160", name: "52 Broomfield", family: "Dutch Aspire - Multi-Section", size: "24x52", beds: 3, baths: 2, sqft: 1213, netBase: 54445, pack: 3000, sectional: true },
  { model: "2452H32167", name: "52 Sundance", family: "Dutch Aspire - Multi-Section", size: "24x52", beds: 3, baths: 2, sqft: 1213, netBase: 55245, pack: 3000, sectional: true },
  { model: "2456H32160", name: "56 Broomfield", family: "Dutch Aspire - Multi-Section", size: "24x56", beds: 3, baths: 2, sqft: 1307, netBase: 58045, pack: 3000, sectional: true },
  { model: "2456H32168", name: "Brooklyn", family: "Dutch Aspire - Multi-Section", size: "24x56", beds: 3, baths: 2, sqft: 1307, netBase: 62875, pack: 3000, sectional: true },
  { model: "2460H42096", name: "Glenrock", family: "Dutch Aspire - Multi-Section", size: "24x60", beds: 4, baths: 2, sqft: 1400, netBase: 61285, pack: 3000, sectional: true },
  { model: "3252H32377", name: "52 Thornton", family: "Dutch Aspire - Multi-Section", size: "32x52", beds: 3, baths: 2, sqft: 1577, netBase: 58690, pack: 3000, sectional: true },
  { model: "3256H32377", name: "56 Thornton", family: "Dutch Aspire - Multi-Section", size: "32x56", beds: 3, baths: 2, sqft: 1699, netBase: 61190, pack: 3000, sectional: true },
  { model: "3260H32181", name: "60 Shelby", family: "Dutch Aspire - Multi-Section", size: "32x60", beds: 3, baths: 2, sqft: 1820, netBase: 68395, pack: 3000, sectional: true },
  { model: "3260H32207", name: "Timberlake", family: "Dutch Aspire - Multi-Section", size: "32x60", beds: 3, baths: 2, sqft: 1820, netBase: 64995, pack: 3000, sectional: true },
  { model: "3260H32394", name: "Odyssey", family: "Dutch Aspire - Multi-Section", size: "32x60", beds: 3, baths: 2, sqft: 1820, netBase: 64995, pack: 3000, sectional: true },
  { model: "3264H32396", name: "64 Henderson", family: "Dutch Aspire - Multi-Section", size: "32x64", beds: 3, baths: 2, sqft: 1941, netBase: 67795, pack: 3000, sectional: true },
  { model: "3264H32181", name: "64 Shelby", family: "Dutch Aspire - Multi-Section", size: "32x64", beds: 3, baths: 2, sqft: 1941, netBase: 69995, pack: 3000, sectional: true },
  { model: "3268H32052", name: "Madison", family: "Dutch Aspire - Multi-Section", size: "32x68", beds: 3, baths: 2, sqft: 2063, netBase: 72795, pack: 3000, sectional: true },
  { model: "3268H32181", name: "68 Shelby", family: "Dutch Aspire - Multi-Section", size: "32x68", beds: 3, baths: 2, sqft: 2063, netBase: 74995, pack: 3000, sectional: true },
  { model: "3268H32396", name: "68 Henderson", family: "Dutch Aspire - Multi-Section", size: "32x68", beds: 3, baths: 2, sqft: 2063, netBase: 71195, pack: 3000, sectional: true },
  { model: "3272H32186", name: "Winston", family: "Dutch Aspire - Multi-Section", size: "32x72", beds: 3, baths: 2, sqft: 2184, netBase: 79995, pack: 3000, sectional: true },
  { model: "3276H42179", name: "Verona", family: "Dutch Aspire - Multi-Section", size: "32x76", beds: 4, baths: 2, sqft: 2305, netBase: 79995, pack: 3000, sectional: true },
  { model: "3276H42396", name: "76 Henderson", family: "Dutch Aspire - Multi-Section", size: "32x76", beds: 4, baths: 2, sqft: 2305, netBase: 80295, pack: 3000, sectional: true },
];

const BY_MODEL = new Map(PRICE_SHEET.map((m) => [m.model.toUpperCase(), m]));

export function priceSheetModel(model: string): PriceSheetModel | undefined {
  return BY_MODEL.get(model.trim().toUpperCase());
}

/**
 * MSRP for a model, exactly as the price sheet computes it:
 *
 *   surcharge   = sq ft x per-sqft rate      (1.80 single / 1.95 sectional)
 *   dealer cost = net base + surcharge + dealer pack
 *   MSRP        = dealer cost x 1.85
 *
 * Rounded to the dollar for display. Returns undefined for a model the sheet
 * does not carry, so a caller can fail loudly rather than invent a price.
 */
export function msrpFor(model: string): number | undefined {
  const m = priceSheetModel(model);
  if (!m) return undefined;
  const rate = m.sectional
    ? PRICE_SHEET_CONTROLS.sectionalSurchargePerSqft
    : PRICE_SHEET_CONTROLS.singleSurchargePerSqft;
  const dealerCost = m.netBase + m.sqft * rate + m.pack;
  return Math.round(dealerCost * PRICE_SHEET_CONTROLS.msrpMultiplier);
}

/** The sheet's everyday "Factory Direct Price": MSRP less the factory-direct %. */
export function factoryDirectPriceFor(model: string): number | undefined {
  const msrp = msrpFor(model);
  return msrp === undefined ? undefined : Math.round(msrp * (1 - PRICE_SHEET_CONTROLS.factoryDirectPercent));
}

/**
 * Cheapest Factory Direct Price across a home type, for the "From $X" anchors
 * on the catalog. Derived from the sheet and rounded UP to the nearest $100:
 * a "from" figure must never undercut a home we can actually sell, or the
 * quote that follows reads as a bait and switch.
 *
 * The sheet covers HUD single-section and multi-section homes. It carries no
 * modular line, so modular returns undefined and its caller shows no anchor
 * rather than an unverifiable one.
 */
export function anchorPriceFor(kind: "single" | "multi"): number | undefined {
  const wanted = PRICE_SHEET.filter((m) => (kind === "multi" ? m.sectional : !m.sectional));
  const prices = wanted
    .map((m) => factoryDirectPriceFor(m.model))
    .filter((p): p is number => p !== undefined);
  if (!prices.length) return undefined;
  return Math.ceil(Math.min(...prices) / 100) * 100;
}
