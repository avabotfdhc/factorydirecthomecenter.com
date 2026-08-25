import Link from "next/link";
import { getAdminToken, fetchLeads } from "@/lib/admin-auth";
import { LeadsTable, type LeadRow } from "../LeadsTable";

export const dynamic = "force-dynamic";

const PER_PAGE = 20;

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const token = (await getAdminToken())!; // layout guarantees a valid token

  const res = await fetchLeads(token, { limit: PER_PAGE, page });
  const leads: LeadRow[] = res.rows as LeadRow[];
  const totalCount: number = res.total;
  const totalPages: number = Math.max(1, Math.ceil(totalCount / PER_PAGE));

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl font-light text-[var(--color-charcoal)]">Leads</h1>
        <span className="text-sm text-[var(--color-gray)]">
          {totalCount} total · newest first
        </span>
      </div>

      <LeadsTable leads={leads} />

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6 text-sm">
          {page > 1 ? (
            <Link
              href={`/admin/leads?page=${page - 1}`}
              className="px-4 py-2 rounded-lg border border-[var(--color-charcoal)]/15 hover:border-[var(--color-teal)] hover:text-[var(--color-teal)] transition-colors"
            >
              ← Newer
            </Link>
          ) : (
            <span className="px-4 py-2 rounded-lg border border-[var(--color-charcoal)]/5 text-[var(--color-gray-light)]">← Newer</span>
          )}
          <span className="text-[var(--color-gray)]">
            Page {page} of {totalPages}
          </span>
          {page < totalPages ? (
            <Link
              href={`/admin/leads?page=${page + 1}`}
              className="px-4 py-2 rounded-lg border border-[var(--color-charcoal)]/15 hover:border-[var(--color-teal)] hover:text-[var(--color-teal)] transition-colors"
            >
              Older →
            </Link>
          ) : (
            <span className="px-4 py-2 rounded-lg border border-[var(--color-charcoal)]/5 text-[var(--color-gray-light)]">Older →</span>
          )}
        </div>
      )}
    </>
  );
}
