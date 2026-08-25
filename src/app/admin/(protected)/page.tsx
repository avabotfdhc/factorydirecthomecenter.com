import Link from "next/link";
import { getAdminToken, fetchLeads, CMS_API } from "@/lib/admin-auth";
import { LeadsTable, type LeadRow } from "./LeadsTable";

export const dynamic = "force-dynamic";

function StatCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="bg-white rounded-xl border border-[var(--color-charcoal)]/10 p-6">
      <div className="font-serif text-4xl font-semibold text-[var(--color-teal)]">{value}</div>
      <div className="text-sm font-medium text-[var(--color-charcoal)] mt-1">{label}</div>
      {hint && <div className="text-xs text-[var(--color-gray)] mt-1">{hint}</div>}
    </div>
  );
}

export default async function AdminDashboard() {
  const token = (await getAdminToken())!; // layout guarantees a valid token

  // Leads (authenticated, endpoint auto-detected) + public catalog counts.
  const [leadsRes, plansRes, blogRes] = await Promise.all([
    fetchLeads(token, { limit: 100, page: 1 }),
    fetch(`${CMS_API}/api/floor-plan/get-active?limit=500`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null),
    fetch(`${CMS_API}/api/blog/get-all?limit=100`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null),
  ]);

  const leads: LeadRow[] = leadsRes.rows as LeadRow[];
  const totalLeads: number = leadsRes.total;
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const leadsThisWeek = leads.filter((l) => l.createdAt && Date.parse(l.createdAt) >= weekAgo).length;
  const planCount = Array.isArray(plansRes?.data) ? plansRes.data.length : "—";
  const blogCount = Array.isArray(blogRes?.data) ? blogRes.data.length : "—";

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl font-light text-[var(--color-charcoal)]">Dashboard</h1>
        <span className="text-xs text-[var(--color-gray)]">Live from the CMS · refreshes on load</span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Total Leads" value={totalLeads} hint="All time, from the website + CMS" />
        <StatCard label="New This Week" value={leadsThisWeek} hint="Last 7 days" />
        <StatCard label="Active Floor Plans" value={planCount} hint="Live on the website" />
        <StatCard label="Blog Posts" value={blogCount} hint="Published articles" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-2xl font-light text-[var(--color-charcoal)]">Recent Leads</h2>
        <Link href="/admin/leads" className="text-sm font-semibold text-[var(--color-teal)] hover:underline">
          View all →
        </Link>
      </div>
      <LeadsTable leads={leads.slice(0, 8)} />

      {leadsRes.source && (
        <p className="mt-3 text-xs text-[var(--color-gray)]">
          Leads source: <code>{leadsRes.source}</code>
        </p>
      )}

      {/* TEMPORARY diagnostic — shows what each candidate CMS endpoint returned
          so the correct leads endpoint/shape can be pinned down. Remove once the
          leads list is confirmed populating. */}
      {leads.length === 0 && (
        <div className="mt-6 rounded-xl border border-amber-300 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-900 mb-2">
            Leads endpoint diagnostic (no rows matched)
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left text-amber-800">
                  <th className="p-2">Endpoint</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Rows</th>
                  <th className="p-2">Response keys</th>
                  <th className="p-2">First-row keys</th>
                </tr>
              </thead>
              <tbody>
                {leadsRes.probes.map((p) => (
                  <tr key={p.endpoint} className="border-t border-amber-200 align-top">
                    <td className="p-2 font-mono">{p.endpoint}</td>
                    <td className="p-2">{p.status}</td>
                    <td className="p-2">{p.rowCount}</td>
                    <td className="p-2 font-mono">{p.keys.join(", ") || "—"}</td>
                    <td className="p-2 font-mono">{p.firstRowKeys.join(", ") || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
