import type { Metadata } from "next";

// Applies to EVERYTHING under /admin (including /admin/login):
// never index admin pages. robots.txt also disallows /admin.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
