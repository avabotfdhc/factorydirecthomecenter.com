// The /photos gallery: every room photo in the catalogue, grouped by room.
//
// Why it exists (competitor review 2026-11-26): Champion Homes Center
// (factorydirectmobilehomes.com) ranks 2nd to 5th for "mobile home pictures",
// "mobile home photos", "mobile homes images" and three more variants — about
// 1,000 US searches a month each — with one photo-gallery page. We held
// ~1,500 unique room photos on the plan pages and had no page that gathered
// them, so none of those searches could land on us.
//
// What a photo shows comes from describeImageFile() (src/lib/image-alt.ts),
// the same reader that writes the plan pages' alt text, so the gallery and
// the plan page never disagree about a picture. Anything it cannot name, and
// anything that is not a photograph of a room (sales sheets, renderings,
// cutaways, "main photo", "staged interior"), stays out: a gallery labelled
// "Kitchens" with a drawing in it is worse than a shorter gallery.
//
// Pure functions only, so tests/photo-gallery.test.ts can pin the grouping
// without the network. The loader is src/lib/photo-gallery-data.ts.

import { describeImageFile } from "./image-alt";
import { planKind, type PlanKind } from "./plan-content";
import { GALLERY_ROOMS } from "./gallery-rooms";

export { GALLERY_ROOMS, galleryRoom, type GalleryRoom } from "./gallery-rooms";

/** One plan's photos, as the loader hands them over. */
export interface PlanPhotoSource {
  slug: string;
  name: string;
  homeType: string;
  series: string;
  /** Absolute image URLs in the plan's own gallery order. */
  images: readonly string[];
}

export interface GalleryPhoto {
  src: string;
  alt: string;
  /** What the photo shows, from describeImageFile ("primary bathroom"). */
  what: string;
  room: string;
  planSlug: string;
  planName: string;
  series: string;
  kind: PlanKind;
}

const ROOM_BY_LABEL = new Map<string, string>(
  GALLERY_ROOMS.flatMap((r) => r.labels.map((l) => [l, r.slug] as [string, string])),
);

/** The room a photo belongs in, or "" when it belongs in no room. */
export function roomForImage(src: string): string {
  return ROOM_BY_LABEL.get(describeImageFile(src)) ?? "";
}

/** Champion's file name, which repeats when two plans share a photo. */
function fileKey(src: string): string {
  return decodeURIComponent(src.split("?")[0].split("/").pop() || "").toLowerCase();
}

function altFor(what: string, plan: PlanPhotoSource, kind: PlanKind): string {
  const type = kind === "modular" ? "modular home" : kind === "multi" ? "double wide home" : "single wide home";
  const name = plan.series && !plan.name.toLowerCase().includes(plan.series.toLowerCase())
    ? `${plan.series} ${plan.name}`
    : plan.name;
  const room = what.charAt(0).toUpperCase() + what.slice(1);
  return `${room} in the Champion ${name} ${type}`;
}

/**
 * Group every plan's room photos by room.
 *
 * - A file that appears on more than one plan (HUD/modular twins share
 *   Champion's photo set) is shown once, under the first plan that has it —
 *   the caller passes plans in catalogue order with canonical plans first.
 * - Within a room, photos are interleaved across plans (each plan's first
 *   kitchen, then each plan's second…) so the top of a room page shows many
 *   homes rather than eight angles of one.
 */
export function buildGallery(plans: readonly PlanPhotoSource[]): Map<string, GalleryPhoto[]> {
  const seen = new Set<string>();
  const perRoom = new Map<string, GalleryPhoto[][]>();
  for (const room of GALLERY_ROOMS) perRoom.set(room.slug, []);

  for (const plan of plans) {
    const kind = planKind(plan.homeType);
    const mine = new Map<string, GalleryPhoto[]>();
    for (const src of plan.images) {
      if (!src) continue;
      const key = fileKey(src);
      if (!key || seen.has(key)) continue;
      const what = describeImageFile(src);
      const room = ROOM_BY_LABEL.get(what);
      if (!room) continue;
      seen.add(key);
      const list = mine.get(room) ?? [];
      list.push({
        src,
        alt: altFor(what, plan, kind),
        what,
        room,
        planSlug: plan.slug,
        planName: plan.name,
        series: plan.series,
        kind,
      });
      mine.set(room, list);
    }
    for (const [room, list] of mine) perRoom.get(room)!.push(list);
  }

  const out = new Map<string, GalleryPhoto[]>();
  for (const [room, lists] of perRoom) {
    const merged: GalleryPhoto[] = [];
    for (let i = 0; lists.some((l) => i < l.length); i++) {
      for (const l of lists) if (i < l.length) merged.push(l[i]);
    }
    out.set(room, merged);
  }
  return out;
}

/** Total photos across rooms. */
export function galleryCount(gallery: Map<string, GalleryPhoto[]>): number {
  let n = 0;
  for (const list of gallery.values()) n += list.length;
  return n;
}
