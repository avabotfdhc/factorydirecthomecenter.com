// Shared leads table (server-safe, no client hooks).
// Renders rows from the CMS enquiry-form API.

export interface LeadRow {
  id: string | number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNo?: string;
  floorTitle?: string;
  leadSource?: string;
  address?: string; // free-text note field (interest/timeframe/message summary)
  createdAt?: string;
  deliveryStateDetails?: { name?: string } | null;
  /** Where the visitor came from (src/lib/attribution.ts). Undefined for
   *  leads captured before attribution existed, or from a visitor who opted
   *  out of tracking. */
  attribution?: {
    /** "google / cpc", "chatgpt / ai", "direct / none". */
    lastTouch: string;
    /** Only set when it differs from the last touch. */
    firstTouch?: string;
    campaign?: string;
    landingPage?: string;
  };
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
            <th className="p-3">Came from</th>
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
              <td className="p-3 text-[var(--color-gray)] max-w-[16rem]">
                {l.attribution ? (
                  <>
                    <span className="font-medium text-[var(--color-charcoal)]">{l.attribution.lastTouch}</span>
                    {l.attribution.campaign && (
                      <span className="block text-xs">{l.attribution.campaign}</span>
                    )}
                    {l.attribution.firstTouch && (
                      <span className="block text-xs italic">first: {l.attribution.firstTouch}</span>
                    )}
                    {l.attribution.landingPage && (
                      <span className="block text-xs truncate" title={l.attribution.landingPage}>
                        {l.attribution.landingPage}
                      </span>
                    )}
                  </>
                ) : (
                  "—"
                )}
              </td>
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
