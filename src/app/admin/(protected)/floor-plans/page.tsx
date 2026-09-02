import Link from "next/link";
import { adminConfigured, listFloorPlans } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export default async function FloorPlansAdminPage() {
  if (!adminConfigured()) {
    return (
      <div>
        <h1 className="font-serif text-2xl mb-4">Floor Plans</h1>
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-6 text-sm text-amber-900 max-w-2xl">
          <p className="font-semibold mb-2">Supabase not connected yet.</p>
          <p className="mb-2">
            Set these environment variables in Vercel, then redeploy:
          </p>
          <ul className="list-disc pl-5 space-y-1 font-mono text-xs">
            <li>NEXT_PUBLIC_SUPABASE_URL</li>
            <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
            <li>SUPABASE_SERVICE_ROLE_KEY (server-only secret)</li>
          </ul>
        </div>
      </div>
    );
  }

  let plans;
  try {
    plans = await listFloorPlans();
  } catch (err) {
    return (
      <div>
        <h1 className="font-serif text-2xl mb-4">Floor Plans</h1>
        <div className="rounded-xl border border-red-300 bg-red-50 p-6 text-sm text-red-900 max-w-2xl">
          Could not load floor plans: {err instanceof Error ? err.message : String(err)}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl">Floor Plans</h1>
          <p className="text-sm text-black/50">{plans.length} total · managed in the new Supabase CMS</p>
        </div>
        <div className="flex gap-2">
        <Link
          href="/admin/floor-plans/import"
          className="px-4 py-2 rounded-lg border border-black/15 text-sm font-medium hover:bg-black/[0.03]"
        >
          Import from Box folder
        </Link>
        <Link
          href="/admin/floor-plans/new"
          className="px-4 py-2 rounded-lg bg-[var(--color-teal)] text-white text-sm font-medium hover:opacity-90"
        >
          + New Home
        </Link>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-black/10 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-black/[0.03] text-black/60 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Model #</th>
              <th className="px-4 py-3 font-medium">Beds/Baths</th>
              <th className="px-4 py-3 font-medium">Sq Ft</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {plans.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-black/40">
                  No homes yet. Add one, or I can seed them from your Box library.
                </td>
              </tr>
            )}
            {plans.map((p) => (
              <tr key={p.id} className="border-t border-black/5 hover:bg-black/[0.02]">
                <td className="px-4 py-3">
                  <Link href={`/admin/floor-plans/${p.id}`} className="text-[var(--color-teal)] hover:underline font-medium">
                    {p.name || p.slug}
                  </Link>
                  <div className="text-black/40 text-xs">{p.slug}</div>
                </td>
                <td className="px-4 py-3 text-black/70">{p.model_number || "—"}</td>
                <td className="px-4 py-3 text-black/70">{p.beds ?? "—"} / {p.baths ?? "—"}</td>
                <td className="px-4 py-3 text-black/70">{p.sqft ? p.sqft.toLocaleString() : "—"}</td>
                <td className="px-4 py-3 text-black/70">{p.home_type || "—"}</td>
                <td className="px-4 py-3">
                  {p.is_active ? (
                    <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs">Active</span>
                  ) : (
                    <span className="inline-block px-2 py-0.5 rounded-full bg-black/10 text-black/50 text-xs">Hidden</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/floor-plans/${p.id}`} className="text-black/50 hover:text-black text-xs">Edit →</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
