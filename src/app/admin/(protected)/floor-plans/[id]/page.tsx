import Link from "next/link";
import { notFound } from "next/navigation";
import { adminConfigured, getFloorPlan, type AdminFloorPlan, type AdminImage } from "@/lib/supabase-admin";
import { saveFloorPlan, uploadFiles, removeImage, deletePlan } from "../actions";

export const dynamic = "force-dynamic";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
function publicUrl(path: string): string {
  if (!path) return "";
  if (/^https?:\/\//.test(path)) return path;
  return `${SUPABASE_URL}/storage/v1/object/public/floor-plans/${path.replace(/^\//, "")}`;
}

const FIELD = "w-full rounded-lg border border-black/15 px-3 py-2 text-sm";
const LABEL = "block text-xs font-medium text-black/60 mb-1";

export default async function EditFloorPlanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "new";

  if (!adminConfigured()) notFound();

  const plan =
    isNew ? null : ((await getFloorPlan(id)) as (AdminFloorPlan & { floor_plan_images: AdminImage[] }) | null);
  if (!isNew && !plan) notFound();

  const p: Partial<AdminFloorPlan> = plan ?? { brand: "Champion Homes", is_active: true, sort_order: 0 };
  const images = (plan?.floor_plan_images ?? []).slice().sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  return (
    <div className="max-w-4xl">
      <Link href="/admin/floor-plans" className="text-sm text-black/50 hover:text-black">← All floor plans</Link>
      <h1 className="font-serif text-2xl mt-2 mb-6">{isNew ? "New Home" : p.name || p.slug}</h1>

      {/* Core fields */}
      <form action={saveFloorPlan} className="bg-white rounded-xl border border-black/10 p-6 space-y-4">
        {!isNew && <input type="hidden" name="id" value={id} />}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={LABEL}>Name *</label>
            <input name="name" defaultValue={p.name ?? ""} className={FIELD} placeholder="Lincoln" required />
          </div>
          <div>
            <label className={LABEL}>Slug (URL) {isNew && "— leave blank to auto-generate"}</label>
            <input name="slug" defaultValue={p.slug ?? ""} className={FIELD} placeholder="dutch-aspire-lincoln-2852h32171" />
          </div>
        </div>
        <div>
          <label className={LABEL}>Full title</label>
          <input name="title" defaultValue={p.title ?? ""} className={FIELD} placeholder="Lincoln - 3 Bed 2 Bath | Champion Aspire" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div><label className={LABEL}>Model #</label><input name="model_number" defaultValue={p.model_number ?? ""} className={FIELD} /></div>
          <div><label className={LABEL}>Series</label><input name="series" defaultValue={p.series ?? ""} className={FIELD} placeholder="Aspire" /></div>
          <div><label className={LABEL}>Home type</label>
            <select name="home_type" defaultValue={p.home_type ?? ""} className={FIELD}>
              <option value="">—</option>
              <option>Single Wide</option>
              <option>Multi-Section</option>
              <option>Modular</option>
            </select>
          </div>
          <div><label className={LABEL}>Brand</label><input name="brand" defaultValue={p.brand ?? "Champion Homes"} className={FIELD} /></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div><label className={LABEL}>Beds</label><input name="beds" type="number" step="1" defaultValue={p.beds ?? ""} className={FIELD} /></div>
          <div><label className={LABEL}>Baths</label><input name="baths" type="number" step="0.5" defaultValue={p.baths ?? ""} className={FIELD} /></div>
          <div><label className={LABEL}>Sq Ft</label><input name="sqft" type="number" step="1" defaultValue={p.sqft ?? ""} className={FIELD} /></div>
          <div><label className={LABEL}>Width (ft)</label><input name="width" defaultValue={p.width ?? ""} className={FIELD} /></div>
          <div><label className={LABEL}>Length (ft)</label><input name="length" defaultValue={p.length ?? ""} className={FIELD} /></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div><label className={LABEL}>Price (number)</label><input name="price" defaultValue={p.price ?? ""} className={FIELD} placeholder="120800" /></div>
          <div><label className={LABEL}>Virtual tour URL</label><input name="virtual_tour" defaultValue={p.virtual_tour ?? ""} className={FIELD} /></div>
          <div><label className={LABEL}>Sort order</label><input name="sort_order" type="number" defaultValue={p.sort_order ?? 0} className={FIELD} /></div>
        </div>
        <div>
          <label className={LABEL}>Short description</label>
          <textarea name="description" defaultValue={p.description ?? ""} className={`${FIELD} min-h-20`} />
        </div>
        <div>
          <label className={LABEL}>Detail body (HTML allowed)</label>
          <textarea name="floor_plan_html" defaultValue={p.floor_plan_html ?? ""} className={`${FIELD} min-h-32 font-mono text-xs`} />
        </div>
        {/* Hidden passthroughs so saving core fields doesn't wipe uploaded media refs */}
        <input type="hidden" name="banner_image" value={p.banner_image ?? ""} />
        <input type="hidden" name="brochure_url" value={p.brochure_url ?? ""} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="is_active" defaultChecked={p.is_active ?? true} />
          Active (visible on the site)
        </label>
        <div className="flex items-center gap-3 pt-2">
          <button type="submit" className="px-5 py-2 rounded-lg bg-[var(--color-teal)] text-white text-sm font-medium hover:opacity-90">
            {isNew ? "Create" : "Save changes"}
          </button>
          {!isNew && p.slug && (
            <a href={`/floor-plans/${p.slug}`} target="_blank" rel="noopener noreferrer" className="text-sm text-black/50 hover:text-black">
              View on site ↗
            </a>
          )}
        </div>
      </form>

      {isNew ? (
        <p className="text-sm text-black/50 mt-4">Create the home first, then you can upload its banner, gallery, floor-plan drawings, and brochure.</p>
      ) : (
        <div className="mt-8 space-y-6">
          {/* Banner */}
          <MediaBlock title="Banner photo" hint="The main card/hero image.">
            {p.banner_image ? (
              <img src={publicUrl(p.banner_image)} alt="" className="h-32 rounded-lg border border-black/10 object-cover" />
            ) : (
              <span className="text-sm text-black/40">No banner yet.</span>
            )}
            <UploadForm id={id} slug={p.slug!} role="banner" accept="image/*" />
          </MediaBlock>

          {/* Gallery + drawings */}
          <MediaBlock title="Gallery & floor-plan drawings" hint="Interior/exterior photos and the plan drawing images (order preserved).">
            {images.length === 0 && <span className="text-sm text-black/40">No images yet.</span>}
            <div className="flex flex-wrap gap-3">
              {images.map((img) => (
                <div key={img.path} className="relative">
                  <img src={publicUrl(img.path)} alt="" className="h-24 w-24 rounded-lg border border-black/10 object-cover" />
                  <span className="absolute bottom-1 left-1 text-[10px] bg-black/60 text-white px-1 rounded">{img.kind}</span>
                  <form action={removeImage} className="absolute -top-2 -right-2">
                    <input type="hidden" name="id" value={id} />
                    <input type="hidden" name="slug" value={p.slug!} />
                    <input type="hidden" name="path" value={img.path} />
                    <button className="w-5 h-5 rounded-full bg-red-600 text-white text-xs leading-none" title="Remove">×</button>
                  </form>
                </div>
              ))}
            </div>
            <UploadForm id={id} slug={p.slug!} role="gallery" accept="image/*" multiple />
            <UploadForm id={id} slug={p.slug!} role="floorplan" accept="image/*" multiple label="Upload floor-plan drawing image(s)" />
          </MediaBlock>

          {/* Brochure */}
          <MediaBlock title="Brochure (PDF)" hint="Downloadable spec/sales sheet.">
            {p.brochure_url ? (
              <a href={publicUrl(p.brochure_url)} target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--color-teal)] hover:underline">
                Current brochure ↗
              </a>
            ) : (
              <span className="text-sm text-black/40">No brochure yet.</span>
            )}
            <UploadForm id={id} slug={p.slug!} role="brochure" accept="application/pdf" />
          </MediaBlock>

          {/* Danger zone */}
          <form action={deletePlan} className="pt-4 border-t border-black/10">
            <input type="hidden" name="id" value={id} />
            <button className="text-sm text-red-600 hover:underline">Delete this home</button>
          </form>
        </div>
      )}
    </div>
  );
}

function MediaBlock({ title, hint, children }: { title: string; hint: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-black/10 p-6">
      <h2 className="font-medium">{title}</h2>
      <p className="text-xs text-black/50 mb-3">{hint}</p>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function UploadForm({
  id, slug, role, accept, multiple, label,
}: { id: string; slug: string; role: string; accept: string; multiple?: boolean; label?: string }) {
  return (
    <form action={uploadFiles} encType="multipart/form-data" className="flex items-center gap-2">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="role" value={role} />
      <input type="file" name="files" accept={accept} multiple={multiple} required className="text-xs" />
      <button className="px-3 py-1.5 rounded-lg bg-black/80 text-white text-xs hover:bg-black">
        {label || `Upload ${role}`}
      </button>
    </form>
  );
}
