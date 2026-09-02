import Link from "next/link";
import { notFound } from "next/navigation";
import { adminConfigured, listFloorPlans, listLiterature } from "@/lib/supabase-admin";
import ImportClient from "./ImportClient";

export const dynamic = "force-dynamic";

export default async function ImportPage() {
  if (!adminConfigured()) notFound();
  const [plans, lit] = await Promise.all([listFloorPlans(), listLiterature()]);
  return (
    <div>
      <Link href="/admin/floor-plans" className="text-sm text-black/50 hover:text-black">← All floor plans</Link>
      <h1 className="font-serif text-2xl mt-2 mb-1">Import from Box folder</h1>
      <p className="text-sm text-black/50 mb-6">
        {plans.length} models in the catalog · {lit.length} literature docs expected
      </p>
      <ImportClient
        plans={plans.map((p) => ({ slug: p.slug, model_number: p.model_number }))}
        lit={lit.filter((l) => l.id).map((l) => ({ id: l.id!, box_filename: l.box_filename || "", title: l.title, category: l.category }))}
      />
    </div>
  );
}
