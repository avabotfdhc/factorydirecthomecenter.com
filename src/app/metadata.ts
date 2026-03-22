import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manufactured & Modular Homes Indiana | Factory Direct Homes Center",
  description: "Champion manufactured and modular homes with factory-direct pricing. Serving Indiana, Ohio, Michigan & more from Auburn, IN. Line-item transparency, chattel loans, local delivery.",
  keywords: "manufactured homes Indiana, modular homes Fort Wayne, mobile homes Auburn IN, Champion Homes dealer, factory direct homes",
  openGraph: {
    title: "Manufactured & Modular Homes Indiana | Factory Direct Homes Center",
    description: "Champion manufactured and modular homes with factory-direct pricing. Line-item transparency, local delivery from Auburn, IN.",
    url: "https://factorydirecthomescenter.com",
    siteName: "Factory Direct Homes Center",
    images: [
      {
        url: "https://factorydirecthomescenter.com/images/hero-home.jpg",
        width: 1200,
        height: 630,
        alt: "Modern manufactured home with white siding and black trim",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Manufactured & Modular Homes Indiana | Factory Direct Homes Center",
    description: "Champion manufactured and modular homes with factory-direct pricing from Auburn, IN.",
    images: ["https://factorydirecthomescenter.com/images/hero-home.jpg"],
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
  alternates: {
    canonical: "https://factorydirecthomescenter.com",
  },
  verification: {
    google: "your-google-verification-code",
  },
};
