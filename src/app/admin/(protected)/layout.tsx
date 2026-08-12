import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getAdminToken, cmsGet } from "@/lib/admin-auth";
import { LogoutButton } from "./LogoutButton";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

// Server-side guard: every page in this group requires a valid CMS admin token.
// Invalid/expired tokens bounce to /admin/login (validated against the live API,
// not just cookie presence, so a stale cookie can't show an empty dashboard).
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const token = await getAdminToken();
  if (!token) redirect("/admin/login");

  const profile = await cmsGet("/api/authenticate/get-profile", token);
  if (!profile?.success) redirect("/admin/login");

  const userName = profile?.data?.name || profile?.data?.username || "Admin";

  const nav = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/leads", label: "Leads" },
    { href: "/admin/campaigns", label: "Campaigns" },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      <header className="bg-[var(--color-charcoal)] text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <span className="font-serif text-lg">
              FDHC <span className="italic text-[var(--color-teal-light)]">Admin</span>
            </span>
            <nav className="flex gap-1">
              {nav.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="px-3 py-1.5 text-sm rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <a
              href="https://admin.factorydirecthomescenter.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/50 hover:text-white transition-colors"
            >
              Full CMS ↗
            </a>
            <Link href="/" className="text-white/50 hover:text-white transition-colors">
              View Site ↗
            </Link>
            <span className="text-white/40 hidden sm:inline">{userName}</span>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}
