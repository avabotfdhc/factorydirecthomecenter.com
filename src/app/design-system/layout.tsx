import type { Metadata } from "next";

// The design system is a specimen sheet for the team, disallowed in robots.txt
// but, until 2026-10-29, carrying the homepage's inherited canonical and no
// noindex — so a link to it could still put it in the index as a duplicate of
// "/". The page itself is a client component and cannot export metadata.
export const metadata: Metadata = {
  title: "Design System",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://factorydirecthomescenter.com/design-system" },
};

export default function DesignSystemLayout({ children }: { children: React.ReactNode }) {
  return children;
}
