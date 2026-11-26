// Loads the /photos gallery: the published catalogue (so a retired series or
// plan never appears), canonical plans first (so a HUD/modular twin's shared
// photo is credited to the HUD page the sitemap lists), and one Supabase read
// for every plan's photos. Grouping lives in src/lib/photo-gallery.ts.

import { getApiFloorPlans } from "./api-content";
import { canonicalPlans } from "./plan-canonical";
import { buildGallery, type GalleryPhoto, type PlanPhotoSource } from "./photo-gallery";

export async function getGallery(): Promise<Map<string, GalleryPhoto[]>> {
  const { supabaseConfigured, getSupabasePlanPhotos } = await import("./supabase-content");
  if (!supabaseConfigured()) return buildGallery([]);

  const [plans, photos] = await Promise.all([getApiFloorPlans(), getSupabasePlanPhotos()]);
  // Only canonical pages are linked: a modular twin's photos are the HUD
  // plan's photos, and its page canonicalises there anyway.
  const linked = canonicalPlans(plans);
  const sources: PlanPhotoSource[] = linked.map((p) => ({
    slug: p.slug,
    name: p.name,
    homeType: p.homeType,
    series: p.series,
    images: photos[p.slug] ?? [],
  }));
  return buildGallery(sources);
}
