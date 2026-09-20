// Alt text for catalogue and page imagery.
//
// Everything else this file used to export — `imageSizes`, `ImageSizeType`,
// `getImageProps`, `getImageDimensions`, `shouldBePriority`, `generateSrcSet`,
// `responsiveWidths`, `generateBlurDataURL`, `imageLoading`, `aspectRatios`,
// `imagePaths`, `isValidImageUrl`, `getPlaceholderImage` — had no caller
// anywhere in the app. next/image does the sizing, srcset and placeholder work
// directly at each call site, so the helpers were superseded before anything
// used them. `getImageProps` was the one worth deleting rather than leaving:
// it accepted a `customAlt` argument and then never put it in the props it
// returned, so the first caller to rely on it would have silently shipped
// images with no alt text.

export function generateAltText(context: string, details?: Record<string, string>): string {
  const baseAlts: Record<string, string> = {
    hero: "Beautiful manufactured home with modern exterior design and spacious layout",
    singleWide: "Single wide manufactured home exterior showing efficient design and quality construction",
    doubleWide: "Double wide manufactured home with spacious layout and modern exterior",
    modular: "Modular home built to IRC codes with site-built quality and customizable design",
    interior: "Modern manufactured home interior with open floor plan and quality finishes",
    kitchen: "Gourmet kitchen in manufactured home featuring modern appliances and island",
    bedroom: "Spacious bedroom in manufactured home with walk-in closet",
    bathroom: "Modern bathroom in manufactured home with quality fixtures",
    livingRoom: "Open concept living room in manufactured home with fireplace",
    community: "Manufactured home community with well-maintained properties",
    delivery: "Manufactured home being delivered and set up on foundation",
    family: "Happy family in their new manufactured home",
    location: `Manufactured homes available in ${details?.location || "northeast Indiana"}`,
  };
  return baseAlts[context] || "Quality manufactured home from Factory Direct Homes Center";
}
