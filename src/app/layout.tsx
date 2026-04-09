import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GoogleAnalytics, GoogleTagManager, MetaPixel, MicrosoftClarity } from "@/lib/analytics";
import { StructuredData, structuredData } from "@/lib/seo";
import { PageFooter } from "@/components/PageFooter";

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
    template: "%s | Factory Direct Homes Center",
  },
  description:
    "Factory-direct pricing on new Champion manufactured and modular homes. Serving Indiana, Michigan & Ohio from Auburn, IN. Single wides from $50K, double wides from $80K.",
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
        {/* Analytics — next/script strategy="afterInteractive" handles deferred loading */}
        <GoogleAnalytics />
        <Header />
        <main id="main-content" className="flex-1">{children}</main>
        <PageFooter />
        <Footer />
      </body>
    </html>
  );
}
