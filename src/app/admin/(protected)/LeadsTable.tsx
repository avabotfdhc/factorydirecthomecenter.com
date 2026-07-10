// Shared leads table (server-safe, no client hooks).
// Renders rows from the CMS enquiry-form API.

export interface LeadRow {
  id: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNo?: string;
  floorTitle?: string;
  leadSource?: string;
  address?: string; // free-text note field (interest/timeframe/message summary)
  createdAt?: string;
  deliveryStateDetails?: { name?: string } | null;
}

function fmtDate(iso?: string): string {
  if (!iso) return "—";
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return "—";
  return new Date(t).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function LeadsTable({ leads }: { leads: LeadRow[] }) {
  if (!leads.length) {
    return <p className="text-[var(--color-gray)] py-8 text-center">No leads yet.</p>;
  }
  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--color-charcoal)]/10 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[var(--color-cream-dark)] text-left text-xs uppercase tracking-wider text-[var(--color-gray)]">
            <th className="p-3">Name</th>
            <th className="p-3">Contact</th>
            <th className="p-3">Interest</th>
            <th className="p-3">Delivery</th>
            <th className="p-3">Source</th>
            <th className="p-3">Note</th>
            <th className="p-3">Date</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((l) => (
            <tr key={l.id} className="border-t border-[var(--color-charcoal)]/5 align-top hover:bg-[var(--color-cream)]/60">
              <td className="p-3 font-medium text-[var(--color-charcoal)] whitespace-nowrap">
                {[l.firstName, l.lastName].filter(Boolean).join(" ") || "—"}
              </td>
              <td className="p-3 text-[var(--color-gray)]">
                {l.email && (
                  <a href={`mailto:${l.email}`} className="text-[var(--color-teal)] hover:underline block">
                    {l.email}
                  </a>
                )}
                {l.phoneNo && (
                  <a href={`tel:${l.phoneNo}`} className="hover:underline block">
                    {l.phoneNo}
                  </a>
                )}
              </td>
              <td className="p-3 text-[var(--color-gray)]">{l.floorTitle || "—"}</td>
              <td className="p-3 text-[var(--color-gray)] whitespace-nowrap">{l.deliveryStateDetails?.name || "—"}</td>
              <td className="p-3 text-[var(--color-gray)] whitespace-nowrap">{l.leadSource || "—"}</td>
              <td className="p-3 text-[var(--color-gray)] max-w-[26rem]">
                <span className="line-clamp-2">{l.address || "—"}</span>
              </td>
              <td className="p-3 text-[var(--color-gray)] whitespace-nowrap">{fmtDate(l.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
