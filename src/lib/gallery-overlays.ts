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
