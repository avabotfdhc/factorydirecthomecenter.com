// Professional photo-shoot galleries from Champion's Topeka photography
// library (Box: Photos & Videos), applied to CMS-served Aspire listings whose
// records only carry the floor-plan drawing. The photos are of the same
// Champion model (matched by model number). The overlay's banner replaces the
// CMS drawing on cards; the drawing stays in the gallery (the CMS gallery is
// appended after these photos). Repo-published Paramount twins reference the
// same image files directly in paramount-floor-plans.ts.
export interface GalleryOverlay {
  image: string;      // banner/card photo
  gallery: string[];  // photo set, banner first
}

const g = (names: string[]) => names.map((n) => `/images/paramount/${n}.webp`);

export const galleryOverlays: Record<string, GalleryOverlay> = {
  "dutch-aspire-lincoln-2852h32171": {
    image: "/images/paramount/lincoln-exterior.webp",
    gallery: g(["lincoln-exterior", "lincoln-kitchen", "lincoln-living", "lincoln-primary-bedroom", "lincoln-primary-bath", "lincoln-bedroom", "lincoln-utility"]),
  },
  "dutch-aspire-bayport-2856h32168": {
    image: "/images/paramount/bayport-exterior.webp",
    gallery: g(["bayport-exterior", "bayport-kitchen", "bayport-living", "bayport-dining", "bayport-primary-bedroom", "bayport-primary-bath", "bayport-bedroom", "bayport-bath"]),
  },
  "belvidere": {
    image: "/images/paramount/belvidere-exterior.webp",
    gallery: g(["belvidere-exterior", "belvidere-kitchen", "belvidere-living", "belvidere-dining", "belvidere-primary-bedroom", "belvidere-primary-bath"]),
  },
  "brighton-3-bed-2-bath-manufactured-home-1386-sq-ft-champion-aspire": {
    image: "/images/paramount/brighton-exterior.webp",
    gallery: g(["brighton-exterior", "brighton-kitchen", "brighton-living", "brighton-dining", "brighton-primary-bedroom", "brighton-primary-bath"]),
  },
  "silverton-3-bed-2-bath-manufactured-home-1493-sq-ft-28x56-champion-aspire": {
    image: "/images/paramount/silverton-exterior.webp",
    gallery: g(["silverton-exterior", "silverton-kitchen", "silverton-living", "silverton-family", "silverton-primary-bedroom", "silverton-primary-bath"]),
  },
  "dutch-aspire-timberlake-3260h32207": {
    image: "/images/paramount/timberlake-kitchen.webp",
    gallery: g(["timberlake-kitchen", "timberlake-living", "timberlake-dining-kitchen", "timberlake-kitchen-2", "timberlake-living-2", "timberlake-dining", "timberlake-primary-bedroom", "timberlake-primary-bath", "timberlake-bedroom", "timberlake-bath", "timberlake-utility", "timberlake-entry", "timberlake-exterior", "timberlake-exterior-2"]),
  },
};

// Option-layout sheets (page 2+ of each model's 2026 SALES plan — alternate
// kitchen/bath/bedroom/porch configurations), appended to the END of the
// CMS gallery so the main drawing stays first.
export const sheetExtras: Record<string, string[]> = {
  "3268h32052-dutch-aspire-madison": ["/images/paramount/3268h32052-opt2.webp"],
  "appleton": ["/images/paramount/2842h32388-opt2.webp"],
  "baldwin": ["/images/paramount/2876h42180-opt2.webp", "/images/paramount/2876h42180-opt3.webp"],
  "bay-port": ["/images/paramount/2860h32168-opt2.webp"],
  "belvidere": ["/images/paramount/2856h32392-opt2.webp", "/images/paramount/2856h32392-opt3.webp"],
  "brighton-3-bed-2-bath-manufactured-home-1386-sq-ft-champion-aspire": ["/images/paramount/2852h32170-opt2.webp"],
  "dutch-aspire-1440h11065": ["/images/paramount/1440h11065-opt2.webp"],
  "dutch-aspire-1452h21023": ["/images/paramount/1452h21023-opt2.webp"],
  "dutch-aspire-1452h21081": ["/images/paramount/1452h21081-opt2.webp"],
  "dutch-aspire-1456h21023": ["/images/paramount/1456h21023-opt2.webp"],
  "dutch-aspire-1456h21030": ["/images/paramount/1456h21030-opt2.webp"],
  "dutch-aspire-1460h21216": ["/images/paramount/1460h21216-opt2.webp"],
  "dutch-aspire-1460h22215": ["/images/paramount/1460h22215-opt2.webp", "/images/paramount/1476h32082-opt2.webp"],
  "dutch-aspire-1466h32082": ["/images/paramount/1466h32082-opt2.webp"],
  "dutch-aspire-1470h32082": ["/images/paramount/1470h32082-opt2.webp"],
  "dutch-aspire-1472h32082": ["/images/paramount/1472h32082-opt2.webp"],
  "dutch-aspire-1652h21083": ["/images/paramount/1652h21083-opt2.webp"],
  "dutch-aspire-1652h21151": ["/images/paramount/1652h21151-opt2.webp"],
  "dutch-aspire-1656h22208": ["/images/paramount/1656h22208-opt2.webp"],
  "dutch-aspire-1664h32212": ["/images/paramount/1664h32212-opt2.webp"],
  "dutch-aspire-1666h32085": ["/images/paramount/1666h32085-opt2.webp"],
  "dutch-aspire-1666h32212": ["/images/paramount/1666h32212-opt2.webp"],
  "dutch-aspire-1666h32217": ["/images/paramount/1666h32217-opt2.webp", "/images/paramount/1666h32217-opt3.webp"],
  "dutch-aspire-1668h32085": ["/images/paramount/1668h32085-opt2.webp"],
  "dutch-aspire-bayport-2856h32168": ["/images/paramount/2856h32168-opt2.webp"],
  "dutch-aspire-easton-2856h32301": ["/images/paramount/2856h32301-opt2.webp"],
  "dutch-aspire-henderson-3264h32396": ["/images/paramount/3264h32396-opt2.webp", "/images/paramount/3264h32396-opt3.webp", "/images/paramount/3264h32396-opt4.webp"],
  "dutch-aspire-henderson-3268h32396": ["/images/paramount/3268h32396-opt2.webp", "/images/paramount/3268h32396-opt3.webp"],
  "dutch-aspire-henderson-3276h42396": ["/images/paramount/3276h42396-opt2.webp", "/images/paramount/3276h42396-opt3.webp", "/images/paramount/3276h42396-opt4.webp"],
  "dutch-aspire-lincoln-2848h32171": ["/images/paramount/2848h32171-opt2.webp"],
  "dutch-aspire-lincoln-2852h32171": ["/images/paramount/2852h32171-opt2.webp"],
  "dutch-aspire-lincoln-2856h32171": ["/images/paramount/2856h32171-opt2.webp"],
  "dutch-aspire-monroe-2840h32024": ["/images/paramount/2840h32024-opt2.webp"],
  "dutch-aspire-odyssey-2860h32394": ["/images/paramount/2860h32394-opt2.webp"],
  "dutch-aspire-shelby-3260h32181": ["/images/paramount/3260h32181-opt2.webp"],
  "dutch-aspire-shelby-3264h32181": ["/images/paramount/3264h32181-opt2.webp"],
  "dutch-aspire-shelby-3268h32181": ["/images/paramount/3268h32181-opt2.webp", "/images/paramount/3268h32181-opt3.webp"],
  "dutch-aspire-silverton-2860h32174": ["/images/paramount/2860h32174-opt2.webp", "/images/paramount/2860h32174-opt3.webp"],
  "dutch-aspire-summit-2864h42a1c": ["/images/paramount/2864h42a1c-opt2.webp", "/images/paramount/2864h42a1c-opt3.webp"],
  "dutch-aspire-summit-2868h52a1c": ["/images/paramount/2868h52a1c-opt2.webp", "/images/paramount/2868h52a1c-opt3.webp"],
  "dutch-aspire-thornton-3252h32377": ["/images/paramount/3252h32377-opt2.webp"],
  "dutch-aspire-thornton-3256h32377": ["/images/paramount/3256h32377-opt2.webp"],
  "dutch-aspire-timberlake-3260h32207": ["/images/paramount/3260h32207-opt2.webp", "/images/paramount/3260h32207-opt3.webp"],
  "dutch-aspire-ventura-2856h32034": ["/images/paramount/2856h32034-opt2.webp"],
  "dutch-aspire-verona-3276h42179": ["/images/paramount/3276h42179-opt2.webp", "/images/paramount/3276h42179-opt3.webp"],
  "dutch-aspire-warren-2860h32172": ["/images/paramount/2860h32172-opt2.webp"],
  "dutch-aspire-winston-3272h32186": ["/images/paramount/3272h32186-opt2.webp", "/images/paramount/3272h32186-opt3.webp"],
  "dutch-aspire-woodward-2864h32047": ["/images/paramount/2864h32047-opt2.webp"],
  "dutch-aspire1666h32219": ["/images/paramount/1666h32219-opt2.webp"],
  "dutch-aspire1668h32087": ["/images/paramount/1668h32087-opt2.webp", "/images/paramount/1668h32087-opt3.webp"],
  "dutch-aspire1668h32220": ["/images/paramount/1668h32220-opt2.webp"],
  "dutch-aspire1676h32089": ["/images/paramount/1676h32089-opt2.webp", "/images/paramount/1676h32089-opt3.webp"],
  "dutch-aspire1676h32090": ["/images/paramount/1676h32090-opt2.webp"],
  "dutch-aspire1676h32091": ["/images/paramount/1676h32091-opt2.webp", "/images/paramount/1676h32091-opt3.webp"],
  "dutch-aspire1676h32212": ["/images/paramount/1676h32212-opt2.webp"],
  "dutch-aspire1676h32221": ["/images/paramount/1676h32221-opt2.webp", "/images/paramount/1676h32221-opt3.webp"],
  "dutch-aspire1676h32222": ["/images/paramount/1676h32222-opt2.webp"],
  "dutch-aspire1676h32259": ["/images/paramount/1676h32259-opt2.webp"],
  "fillmore": ["/images/paramount/2864h32060-opt2.webp", "/images/paramount/2864h32060-opt3.webp"],
  "georgetown": ["/images/paramount/2864h32101-opt2.webp"],
  "pontiac": ["/images/paramount/2852h32103-opt2.webp"],
  "silverton-3-bed-2-bath-manufactured-home-1493-sq-ft-28x56-champion-aspire": ["/images/paramount/2856h32174-opt2.webp", "/images/paramount/2856h32174-opt3.webp"],
  "the-bayfield-3-bed-2-bath-manufactured-home-1387-sq-ft-champion-aspire": ["/images/paramount/2852h32169-opt2.webp"],
  "ventura-3-bed-2-bath-manufactured-home-1387-sq-ft-28x52-champion-aspire": ["/images/paramount/2852h32034-opt2.webp"],
  "warren": ["/images/paramount/2856h32172-opt2.webp"],
};
