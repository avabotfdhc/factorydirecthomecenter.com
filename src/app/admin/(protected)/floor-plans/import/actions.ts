"use server";

import { revalidatePath } from "next/cache";
import {
  createSignedUploadUrl,
  patchFloorPlanBySlug,
  appendImageBySlug,
  setLiteraturePath,
  insertLiterature,
} from "@/lib/supabase-admin";

/** One file the browser wants to upload, already classified client-side. */
export interface PlannedUpload {
  name: string;          // original filename
  path: string;          // storage key to write to
  role: "brochure" | "gallery" | "literature";
  slug?: string;         // for brochure/gallery
  litId?: string;        // for literature matched to an existing row
  litTitle?: string;     // for literature that needs a new row
  litCategory?: string;
  litHomeType?: string;
}

/** Step 1: return a signed direct-upload URL for each planned file. */
export async function prepareImport(items: PlannedUpload[]): Promise<Record<string, string>> {
  const out: Record<string, string> = {};
  for (const it of items) {
    out[it.path] = await createSignedUploadUrl(it.path);
  }
  return out;
}

/** Step 2: after the browser has uploaded the bytes, record them in the DB. */
export async function finalizeImport(items: PlannedUpload[]): Promise<{ ok: number; failed: string[] }> {
  let ok = 0;
  const failed: string[] = [];
  const touchedSlugs = new Set<string>();
  for (const it of items) {
    try {
      if (it.role === "brochure" && it.slug) {
        await patchFloorPlanBySlug(it.slug, { brochure_url: it.path });
        touchedSlugs.add(it.slug);
      } else if (it.role === "gallery" && it.slug) {
        await appendImageBySlug(it.slug, it.path, "gallery");
        touchedSlugs.add(it.slug);
      } else if (it.role === "literature") {
        if (it.litId) await setLiteraturePath(it.litId, it.path);
        else await insertLiterature({
          title: it.litTitle || it.name.replace(/\.[^.]+$/, ""),
          category: it.litCategory || "other",
          home_type: it.litHomeType || "",
          path: it.path,
          box_filename: it.name,
        });
      }
      ok++;
    } catch (e) {
      failed.push(`${it.name}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }
  revalidatePath("/admin/floor-plans");
  for (const s of touchedSlugs) revalidatePath(`/floor-plans/${s}`);
  return { ok, failed };
}
