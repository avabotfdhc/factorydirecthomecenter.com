import Link from "next/link";
import { countActivePlans, countLeadsInLastDays, fetchLeads } from "@/lib/admin-data";
import { localBlogPosts } from "@/lib/local-posts";
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
  const [leadsRes, leadsThisWeek, planCount] = await Promise.all([
    fetchLeads({ limit: 8, page: 1 }),
    countLeadsInLastDays(7),
    countActivePlans(),
  ]);
  const leads: LeadRow[] = leadsRes.rows;
  const totalLeads: number = leadsRes.total;
  const blogCount = localBlogPosts.length;

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl font-light text-[var(--color-charcoal)]">Dashboard</h1>
        <span className="text-xs text-[var(--color-gray)]">Live from Supabase · refreshes on load</span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Total Leads" value={totalLeads} hint="All time, from the website" />
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
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
