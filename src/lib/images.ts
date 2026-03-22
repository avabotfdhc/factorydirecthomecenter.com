import React from "react";
import Image from "next/image";

// Image size configurations for different use cases
export const imageSizes = {
  hero: { width: 1920, height: 1080, sizes: "100vw", priority: true },
  card: { width: 800, height: 600, sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw", priority: false },
  gallery: { width: 1200, height: 800, sizes: "(max-width: 768px) 100vw, 80vw", priority: false },
  thumbnail: { width: 400, height: 300, sizes: "150px", priority: false },
  logo: { width: 200, height: 100, sizes: "200px", priority: true },
  icon: { width: 64, height: 64, sizes: "64px", priority: true },
};

export type ImageSizeType = keyof typeof imageSizes;

// Generate optimized image props
export function getImageProps(type: ImageSizeType, customAlt?: string) {
  const config = imageSizes[type];
  return {
    ...config,
    quality: 90,
    className: "object-cover",
  };
}

// Generate srcset for responsive images
export function generateSrcSet(basePath: string, widths: number[]): string {
  return widths.map((width) => `${basePath}?w=${width} ${width}w`).join(", ");
}

// Predefined widths for srcset generation
export const responsiveWidths = {
  hero: [640, 750, 828, 1080, 1200, 1920],
  card: [400, 600, 800],
  gallery: [600, 900, 1200],
};

// Generate alt text helper
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

// Get image dimensions for preventing layout shift
export function getImageDimensions(type: ImageSizeType): { width: number; height: number } {
  const config = imageSizes[type];
  return { width: config.width, height: config.height };
}

// Check if image should be priority
export function shouldBePriority(type: ImageSizeType): boolean {
  return imageSizes[type].priority;
}

// Generate blur data URL for placeholder
export function generateBlurDataURL(width: number = 10, height: number = 10): string {
  return `data:image/svg+xml;base64,${Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"><rect fill="#f8f7f4" width="${width}" height="${height}"/></svg>`).toString("base64")}`;
}

// Image loading strategy
export const imageLoading = {
  eager: { loading: "eager" as const, priority: true },
  lazy: { loading: "lazy" as const, priority: false },
};

// Aspect ratio helpers
export const aspectRatios = {
  landscape: "aspect-video",
  square: "aspect-square",
  portrait: "aspect-[3/4]",
  wide: "aspect-[21/9]",
  ultrawide: "aspect-[32/9]",
};

// Common image paths
export const imagePaths = {
  hero: "/images/hero-home.jpg",
  logo: "/images/logo.svg",
  singleWide: "/images/2026-03-21-singlewide-exterior.png",
  doubleWide: "/images/2026-03-21-doublewide-exterior.png",
  family: "/images/2026-03-21-family-keys.png",
  sunset: "/images/2026-03-21-sunset-home.png",
  dusk: "/images/2026-03-21-dusk-modular.png",
  aerial: "/images/2026-03-21-aerial-community.png",
  whiteBlack: {
    landscape: "/images/2026-03-21-home-white-black-landscape.png",
    front: "/images/2026-03-21-home-white-black-front.png",
    side: "/images/2026-03-21-home-white-black-side.png",
  },
};

// Validate image URL
export function isValidImageUrl(url: string): boolean {
  return url.startsWith("/") || url.startsWith("http://") || url.startsWith("https://");
}

// Get placeholder image
export function getPlaceholderImage(type: "home" | "interior" | "exterior" = "home"): string {
  const placeholders = {
    home: "/images/hero-home.jpg",
    interior: "/images/hero-home.jpg",
    exterior: "/images/2026-03-21-singlewide-exterior.png",
  };
  return placeholders[type];
}
