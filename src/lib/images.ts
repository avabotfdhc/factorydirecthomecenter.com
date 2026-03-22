import Image from "next/image";

// Image size configurations for different use cases
export const imageSizes = {
  // Hero images - full width
  hero: {
    width: 1920,
    height: 1080,
    sizes: "100vw",
    priority: true,
  },
  // Card thumbnails
  card: {
    width: 800,
    height: 600,
    sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
    priority: false,
  },
  // Gallery images
  gallery: {
    width: 1200,
    height: 800,
    sizes: "(max-width: 768px) 100vw, 50vw",
    priority: false,
  },
  // Thumbnail images
  thumbnail: {
    width: 400,
    height: 300,
    sizes: "150px",
    priority: false,
  },
  // Blog/Content images
  content: {
    width: 800,
    height: 600,
    sizes: "(max-width: 768px) 100vw, 800px",
    priority: false,
  },
};

// Generate optimized alt text
export function generateAltText(
  type: "home" | "floorplan" | "interior" | "exterior" | "location",
  data: {
    name: string;
    sqft?: string;
    beds?: number;
    baths?: number;
    features?: string[];
    location?: string;
  }
): string {
  switch (type) {
    case "home":
      return `${data.name} manufactured home${data.sqft ? ` - ${data.sqft}` : ""}${data.beds ? `, ${data.beds} bedroom${data.beds > 1 ? "s" : ""}` : ""}${data.baths ? `, ${data.baths} bathroom${data.baths > 1 ? "s" : ""}` : ""}${data.features ? ` featuring ${data.features.join(", ")}` : ""}`;
    
    case "floorplan":
      return `${data.name} floor plan - ${data.sqft || ""} square foot manufactured home layout with ${data.beds || ""} bedrooms and ${data.baths || ""} bathrooms`;
    
    case "interior":
      return `Interior of ${data.name} showing ${data.features?.join(", ") || "spacious living area"}`;
    
    case "exterior":
      return `Exterior view of ${data.name} manufactured home with professional landscaping and modern design`;
    
    case "location":
      return `Factory Direct Homes Center ${data.location || "Auburn"} location - manufactured home dealership serving Northeast Indiana`;
    
    default:
      return data.name;
  }
}

// Image component with SEO optimization
interface OptimizedImageProps {
  src: string;
  alt: string;
  type: "hero" | "card" | "gallery" | "thumbnail" | "content";
  className?: string;
  fill?: boolean;
  caption?: string;
}

export function OptimizedImage({
  src,
  alt,
  type,
  className = "",
  fill = false,
  caption,
}: OptimizedImageProps) {
  const config = imageSizes[type];

  if (fill) {
    return (
      <figure className={`relative ${className}`}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={config.sizes}
          priority={config.priority}
          className="object-cover"
          quality={90}
        />
        {caption && <figcaption className="sr-only">{caption}</figcaption>}
      </figure>
    );
  }

  return (
    <figure className={className}>
      <Image
        src={src}
        alt={alt}
        width={config.width}
        height={config.height}
        sizes={config.sizes}
        priority={config.priority}
        className="object-cover"
        quality={90}
        loading={config.priority ? "eager" : "lazy"}
      />
      {caption && <figcaption className="sr-only">{caption}</figcaption>}
    </figure>
  );
}

// Generate srcset for responsive images
export function generateSrcSet(basePath: string, widths: number[]): string {
  return widths
    .map((width) => `${basePath}?w=${width} ${width}w`)
    .join(", ");
}

// Image dimensions for common aspect ratios
export const aspectRatios = {
  landscape: { width: 16, height: 9 },
  portrait: { width: 3, height: 4 },
  square: { width: 1, height: 1 },
  video: { width: 16, height: 9 },
  card: { width: 4, height: 3 },
  banner: { width: 21, height: 9 },
};

// Calculate dimensions maintaining aspect ratio
export function calculateDimensions(
  aspectRatio: keyof typeof aspectRatios,
  targetWidth: number
): { width: number; height: number } {
  const ratio = aspectRatios[aspectRatio];
  return {
    width: targetWidth,
    height: Math.round((targetWidth * ratio.height) / ratio.width),
  };
}

// Validate image URL
export function isValidImageUrl(url: string): boolean {
  const validExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"];
  const lowerUrl = url.toLowerCase();
  return validExtensions.some((ext) => lowerUrl.endsWith(ext));
}

// Generate image metadata for structured data
export function generateImageMetadata(
  src: string,
  name: string,
  description: string,
  width: number,
  height: number
) {
  return {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    contentUrl: `https://factorydirecthomescenter.com${src}`,
    name,
    description,
    width,
    height,
    author: {
      "@type": "Organization",
      name: "Factory Direct Homes Center",
    },
  };
}

// Preload critical images
export function preloadImages(images: string[]) {
  return images.map((src) => (
    <link
      key={src}
      rel="preload"
      as="image"
      href={src}
      type="image/webp"
    />
  ));
}

// Generate blur placeholder for Next.js Image
export function generateBlurPlaceholder(width: number, height: number): string {
  // Returns a tiny base64-encoded SVG placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f8f7f4"/>
    </svg>
  `;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}
