import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AnalyticsProvider, GoogleTagManagerNoScript } from "@/lib/analytics";
import { TrackingProvider } from "@/components/TrackingProvider";
import { StructuredData, structuredData } from "@/lib/seo";
import { PageFooter } from "@/components/PageFooter";
import { MobileActionBar } from "@/components/MobileActionBar";
import { DeferredOverlays } from "@/components/DeferredOverlays";
import { ConsentBanner } from "@/components/ConsentBanner";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://factorydirecthomescenter.com"),
  title: {
    default: "Factory Direct Homes Center | New Champion Homes in Auburn, IN",
    template: "%s | Factory Direct Homes",
  },
  description:
    "Factory-direct pricing on new Champion manufactured and modular homes. Single wides, double wides & modular homes. Serving Indiana, Michigan & Ohio from Auburn, IN. Contact us for pricing.",
  keywords: [
    "manufactured homes",
    "modular homes",
    "Champion homes",
    "Auburn IN",
    "factory direct homes",
    "mobile homes Indiana",
  ],
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.ico",
  },
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": [
        { url: "/blog/feed.xml", title: "The Manufactured Home Blog — Factory Direct Homes Center" },
      ],
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Factory Direct Homes Center",
    url: "https://factorydirecthomescenter.com",
    images: [
      {
        url: "/images/hero-home.jpg",
        width: 1200,
        height: 630,
        alt: "Factory Direct Homes Center - Champion Manufactured Homes in Auburn, Indiana",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Factory Direct Homes Center | New Champion Homes in Auburn, IN",
    description:
      "Factory-direct pricing on new Champion manufactured and modular homes. Serving Indiana, Michigan & Ohio from Auburn, IN.",
    images: ["/images/hero-home.jpg"],
  },
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${jakarta.variable} h-full antialiased`}
    >
      <head>
        {/* Global Structured Data — LocalBusiness + WebSite on every page */}
        <StructuredData data={structuredData.localBusiness()} />
        <StructuredData data={structuredData.website()} />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-[var(--color-cream)] text-[var(--color-charcoal)]">
        {/* Google Tag Manager NoScript (required for GTM) */}
        <GoogleTagManagerNoScript />
        
        {/* Analytics — loads GA4, Facebook Pixel, GTM and Clarity, but only
            after first interaction AND only if the visitor hasn't opted out
            (see src/lib/consent.ts and <ConsentBanner /> below). */}
        <AnalyticsProvider />
        
        <TrackingProvider />
        <Header />
        <main id="main-content" className="flex-1">{children}</main>
        <PageFooter />
        <Footer />
        <MobileActionBar />
        <DeferredOverlays />
        <ConsentBanner />
      </body>
    </html>
  );
}
