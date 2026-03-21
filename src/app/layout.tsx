import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

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
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Factory Direct Homes Center",
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
      <body className="min-h-full flex flex-col font-sans bg-[var(--color-cream)] text-[var(--color-charcoal)]">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
