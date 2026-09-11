import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getAdminRefreshToken, getAdminToken, verifyAdmin } from "@/lib/admin-auth";
import { LogoutButton } from "./LogoutButton";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

// Server-side guard: every page in this group requires a valid Supabase Auth
// admin session (see src/proxy.ts for the silent renewal of expired tokens).
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const token = await getAdminToken();
  const refresh = await getAdminRefreshToken();
  // src/proxy.ts already routes "no access cookie but a refresh cookie" through
  // /api/admin/refresh with the exact page; here only the no-session case is left.
  if (!token) redirect(refresh ? "/api/admin/refresh?next=/admin" : "/admin/login");

  const { status, user } = await verifyAdmin(token);
  if (status === "expired") redirect(refresh ? "/api/admin/refresh?next=/admin" : "/admin/login");
  // status "error" (Supabase unreachable) keeps the session rather than
  // bouncing a validly signed-in operator into a redirect loop.

  const userName = user?.name || "Admin";

  const nav = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/floor-plans", label: "Floor Plans" },
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
