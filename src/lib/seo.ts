import React from "react";
import { Metadata } from "next";

interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  imageAlt?: string;
  url: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  locale?: string;
}

export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    image = "/images/hero-home.jpg",
    imageAlt = "Factory Direct Homes Center - Manufactured and Modular Homes",
    url,
    type = "website",
    publishedTime,
    modifiedTime,
    author,
    locale = "en_US",
  } = config;

  const fullUrl = `https://factorydirecthomescenter.com${url}`;
  const fullImage = image.startsWith("http") ? image : `https://factorydirecthomescenter.com${image}`;

  return {
    title,
    description,
    keywords: [
      "manufactured homes",
      "modular homes",
      "mobile homes",
      "champion homes",
      "indiana",
      "ohio",
      "michigan",
      ...keywords,
    ],
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName: "Factory Direct Homes Center",
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
      locale,
      type,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(author && { authors: [author] }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [fullImage],
    },
    alternates: {
      canonical: fullUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

// Structured Data Generators
export const structuredData = {
  // Local Business Schema
  localBusiness: () => ({
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": "https://factorydirecthomescenter.com/#business",
    name: "Factory Direct Homes Center LLC",
    description: "Champion manufactured and modular homes with factory-direct pricing. Serving Indiana, Ohio, and Michigan.",
    url: "https://factorydirecthomescenter.com",
    telephone: "+1-260-308-1457",
    email: "info@factorydirecthomescenter.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "1211 State Road 8",
      addressLocality: "Auburn",
      addressRegion: "IN",
      postalCode: "46706",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 41.3668,
      longitude: -85.0583,
    },
    image: "https://factorydirecthomescenter.com/images/hero-home.jpg",
    hasMap: "https://www.google.com/maps/search/?api=1&query=Factory+Direct+Homes+Center,+1211+State+Road+8,+Auburn,+IN+46706",
    sameAs: [
      "https://www.google.com/maps/search/?api=1&query=Factory+Direct+Homes+Center+Auburn+IN",
    ],
    openingHours: ["Mo-Fr 09:00-17:00", "Sa 10:00-16:00"],
    areaServed: [
      { "@type": "State", name: "Indiana" },
      { "@type": "State", name: "Ohio" },
      { "@type": "State", name: "Michigan" },
    ],
  }),

  // FAQ Page Schema
  faqPage: (faqs: Array<{ question: string; answer: string }>) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }),

  // Product Schema for Homes
  product: (product: {
    name: string;
    description: string;
    image: string;
    sku?: string;
    brand?: string;
    price?: string;
    priceCurrency?: string;
    availability?: string;
  }) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: `https://factorydirecthomescenter.com${product.image}`,
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: product.brand || "Champion Homes",
    },
    offers: product.price
      ? {
          "@type": "Offer",
          price: product.price.replace(/[^0-9.]/g, ""),
          priceCurrency: product.priceCurrency || "USD",
          availability: product.availability || "https://schema.org/InStock",
          seller: {
            "@type": "LocalBusiness",
            name: "Factory Direct Homes Center",
          },
        }
      : undefined,
  }),

  // Image Object Schema
  imageObject: (image: {
    url: string;
    name: string;
    description: string;
    width: number;
    height: number;
    author?: string;
  }) => ({
    "@context": "https://schema.org",
    "@type": "ImageObject",
    contentUrl: `https://factorydirecthomescenter.com${image.url}`,
    name: image.name,
    description: image.description,
    width: image.width,
    height: image.height,
    author: {
      "@type": "Organization",
      name: image.author || "Factory Direct Homes Center",
    },
  }),

  // Video Object Schema
  videoObject: (video: {
    name: string;
    description: string;
    thumbnailUrl: string;
    contentUrl: string;
    uploadDate: string;
    duration?: string;
  }) => ({
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.name,
    description: video.description,
    thumbnailUrl: `https://factorydirecthomescenter.com${video.thumbnailUrl}`,
    contentUrl: video.contentUrl,
    uploadDate: video.uploadDate,
    duration: video.duration,
    publisher: {
      "@type": "Organization",
      name: "Factory Direct Homes Center",
      logo: {
        "@type": "ImageObject",
        url: "https://factorydirecthomescenter.com/logo.png",
      },
    },
  }),

  // Breadcrumb Schema
  breadcrumb: (items: Array<{ name: string; url: string }>) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `https://factorydirecthomescenter.com${item.url}`,
    })),
  }),

  // Service Schema
  service: (service: {
    name: string;
    description: string;
    provider?: string;
    areaServed?: string;
  }) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    provider: {
      "@type": "LocalBusiness",
      name: service.provider || "Factory Direct Homes Center",
    },
    areaServed: {
      "@type": "State",
      name: service.areaServed || "Indiana",
    },
  }),

  // Review Schema
  review: (review: {
    author: string;
    reviewBody: string;
    rating: number;
    datePublished: string;
    itemReviewed?: string;
  }) => ({
    "@context": "https://schema.org",
    "@type": "Review",
    author: {
      "@type": "Person",
      name: review.author,
    },
    reviewBody: review.reviewBody,
    reviewRating: {
      "@type": "Rating",
      ratingValue: review.rating,
      bestRating: 5,
    },
    datePublished: review.datePublished,
    itemReviewed: review.itemReviewed
      ? {
          "@type": "Product",
          name: review.itemReviewed,
        }
      : undefined,
  }),

  // Aggregate Rating Schema
  aggregateRating: (rating: {
    ratingValue: number;
    reviewCount: number;
    itemReviewed?: string;
  }) => ({
    "@context": "https://schema.org",
    "@type": "AggregateRating",
    ratingValue: rating.ratingValue,
    reviewCount: rating.reviewCount,
    bestRating: 5,
    itemReviewed: rating.itemReviewed
      ? {
          "@type": "LocalBusiness",
          name: rating.itemReviewed,
        }
      : undefined,
  }),

  // Article Schema
  article: (article: {
    headline: string;
    description: string;
    image: string;
    datePublished: string;
    dateModified?: string;
    author?: string;
    url: string;
  }) => ({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.headline,
    description: article.description,
    image: `https://factorydirecthomescenter.com${article.image}`,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: {
      "@type": "Organization",
      name: article.author || "Factory Direct Homes Center",
    },
    publisher: {
      "@type": "Organization",
      name: "Factory Direct Homes Center",
      logo: {
        "@type": "ImageObject",
        url: "https://factorydirecthomescenter.com/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://factorydirecthomescenter.com${article.url}`,
    },
  }),

  // WebSite Schema
  website: () => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Factory Direct Homes Center",
    url: "https://factorydirecthomescenter.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://factorydirecthomescenter.com/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  }),
};

// Helper to inject structured data
export function StructuredData({ data }: { data: object }) {
  return React.createElement('script', {
    type: 'application/ld+json',
    dangerouslySetInnerHTML: {
      __html: JSON.stringify(data),
    },
  });
}
