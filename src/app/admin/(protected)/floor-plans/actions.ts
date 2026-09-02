"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  upsertFloorPlan,
  deleteFloorPlan,
  getFloorPlan,
  replaceImages,
  uploadObject,
  type AdminFloorPlan,
  type AdminImage,
} from "@/lib/supabase-admin";

function slugify(s: string): string {
  return String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function str(fd: FormData, k: string): string {
  return String(fd.get(k) ?? "").trim();
}
function numOrNull(fd: FormData, k: string): number | null {
  const v = str(fd, k);
  if (v === "") return null;
  const n = Number(v.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : null;
}

const EXT: Record<string, string> = {
  "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp",
  "image/gif": "gif", "image/avif": "avif", "application/pdf": "pdf",
};

/** Create or update the core floor-plan record. */
export async function saveFloorPlan(fd: FormData): Promise<void> {
  const id = str(fd, "id");
  const name = str(fd, "name");
  const slug = str(fd, "slug") || slugify(name);
  if (!slug) throw new Error("A name or slug is required.");

  const data: AdminFloorPlan = {
    ...(id ? { id } : {}),
    slug,
    name,
    title: str(fd, "title"),
    price: numOrNull(fd, "price"),
    sqft: numOrNull(fd, "sqft"),
    beds: numOrNull(fd, "beds"),
    baths: numOrNull(fd, "baths"),
    home_type: str(fd, "home_type"),
    series: str(fd, "series"),
    brand: str(fd, "brand") || "Champion Homes",
    model_number: str(fd, "model_number"),
    length: str(fd, "length"),
    width: str(fd, "width"),
    description: str(fd, "description"),
    floor_plan_html: str(fd, "floor_plan_html"),
    banner_image: str(fd, "banner_image"),
    brochure_url: str(fd, "brochure_url"),
    virtual_tour: str(fd, "virtual_tour"),
    is_active: fd.get("is_active") != null,
    sort_order: Number(numOrNull(fd, "sort_order") ?? 0),
  };

  const newId = await upsertFloorPlan(data);
  revalidatePath("/admin/floor-plans");
  revalidatePath(`/floor-plans/${slug}`);
  redirect(`/admin/floor-plans/${newId || id}`);
}

/** Upload one or more files for a plan and attach them by role. */
export async function uploadFiles(fd: FormData): Promise<void> {
  const id = str(fd, "id");
  const slug = str(fd, "slug");
  const role = str(fd, "role"); // banner | gallery | floorplan | brochure
  if (!id || !slug) throw new Error("Missing plan id/slug.");

  const files = fd.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length === 0) redirect(`/admin/floor-plans/${id}`);

  const plan = await getFloorPlan(id);
  const existing: AdminImage[] = plan?.floor_plan_images ?? [];

  const uploadedPaths: string[] = [];
  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    const ext = EXT[f.type] || (f.name.split(".").pop() || "bin").toLowerCase();
    const stamp = Date.now().toString(36);
    const key = `${slug}/${role}-${stamp}-${i}.${ext}`;
    const buf = new Uint8Array(await f.arrayBuffer());
    const path = await uploadObject(key, buf, f.type || "application/octet-stream");
    uploadedPaths.push(path);
  }

  if (role === "banner") {
    await upsertFloorPlan({ ...(plan as AdminFloorPlan), banner_image: uploadedPaths[0] });
  } else if (role === "brochure") {
    await upsertFloorPlan({ ...(plan as AdminFloorPlan), brochure_url: uploadedPaths[0] });
  } else {
    const startOrder = existing.length;
    const next: AdminImage[] = [
      ...existing.map((e, idx) => ({ path: e.path, kind: e.kind, sort_order: e.sort_order ?? idx })),
      ...uploadedPaths.map((p, idx) => ({ path: p, kind: role || "gallery", sort_order: startOrder + idx })),
    ];
    await replaceImages(id, next);
  }

  revalidatePath("/admin/floor-plans");
  revalidatePath(`/floor-plans/${slug}`);
  redirect(`/admin/floor-plans/${id}`);
}

/** Remove one gallery image (by index in the current ordered set). */
export async function removeImage(fd: FormData): Promise<void> {
  const id = str(fd, "id");
  const slug = str(fd, "slug");
  const path = str(fd, "path");
  if (!id) throw new Error("Missing plan id.");
  const plan = await getFloorPlan(id);
  const remaining = (plan?.floor_plan_images ?? [])
    .filter((e) => e.path !== path)
    .map((e, idx) => ({ path: e.path, kind: e.kind, sort_order: idx }));
  await replaceImages(id, remaining);
  revalidatePath("/admin/floor-plans");
  revalidatePath(`/floor-plans/${slug}`);
  redirect(`/admin/floor-plans/${id}`);
}

export async function deletePlan(fd: FormData): Promise<void> {
  const id = str(fd, "id");
  if (!id) throw new Error("Missing plan id.");
  await deleteFloorPlan(id);
  revalidatePath("/admin/floor-plans");
  redirect("/admin/floor-plans");
}
