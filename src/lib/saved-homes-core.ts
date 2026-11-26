// Saved homes: a shopper's shortlist, kept in their own browser.
//
// Why (competitor review 2026-11-26): neither Champion Homes Center nor
// Factory Expo lets a shopper keep a list. A list is a reason to come back,
// and "send me prices on these" is a softer first step than a quote form.
//
// - localStorage only: no account, no cookie, nothing leaves the browser until
//   the shopper asks for prices (which goes through the normal lead form).
// - Each entry is a small card snapshot, so /saved renders without shipping
//   the catalogue to the browser. The snapshot can go stale (a renamed plan);
//   the link still goes to the live page, and an entry whose page is gone 404s
//   like any other old link — the shopper can remove it.
// - Read through useSyncExternalStore with a string snapshot (see
//   use-browser-value.ts for why), and kept in step across tabs by the
//   `storage` event and within a tab by our own event.
//
// This file is the pure half (no React), so a server component can call
// toSavedHome and tests/saved-homes.test.ts can run it; the browser half,
// with the hooks, is src/lib/saved-homes.ts.

import type { ApiFloorPlan } from "./api-content";

export const SAVED_KEY = "fdhc.savedHomes.v1";
export const MAX_SAVED = 12;

/** What a saved card needs. Mirrors ApiFloorPlan so CompareTray can show it. */
export type SavedHome = Pick<
  ApiFloorPlan,
  "slug" | "name" | "title" | "price" | "sqft" | "beds" | "baths" | "image" | "brand" | "homeType" | "series"
> &
  Partial<Pick<ApiFloorPlan, "priceFrom" | "virtualTour" | "widthFt" | "bedsMin" | "bedsMax" | "flexNote">>;

/** The fields worth keeping from a plan (drops drawings, dates, model codes). */
export function toSavedHome(p: SavedHome): SavedHome {
  return {
    slug: p.slug,
    name: p.name,
    title: p.title,
    price: p.price,
    sqft: p.sqft,
    beds: p.beds,
    baths: p.baths,
    image: p.image,
    brand: p.brand,
    homeType: p.homeType,
    series: p.series,
    ...(p.priceFrom ? { priceFrom: p.priceFrom } : {}),
    ...(p.virtualTour ? { virtualTour: p.virtualTour } : {}),
    ...(p.widthFt ? { widthFt: p.widthFt } : {}),
    ...(p.bedsMin !== undefined ? { bedsMin: p.bedsMin } : {}),
    ...(p.bedsMax !== undefined ? { bedsMax: p.bedsMax } : {}),
    ...(p.flexNote ? { flexNote: p.flexNote } : {}),
  };
}

/** The stored list, tolerant of anything a browser might hold under the key. */
export function parseSaved(raw: string | null | undefined): SavedHome[] {
  if (!raw) return [];
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(data)) return [];
  const seen = new Set<string>();
  const out: SavedHome[] = [];
  for (const d of data) {
    if (!d || typeof d !== "object") continue;
    const h = d as Partial<SavedHome>;
    if (typeof h.slug !== "string" || !/^[a-z0-9-]+$/.test(h.slug) || seen.has(h.slug)) continue;
    if (typeof h.name !== "string" || !h.name) continue;
    seen.add(h.slug);
    out.push({
      slug: h.slug,
      name: h.name,
      title: String(h.title ?? ""),
      price: String(h.price ?? ""),
      sqft: Number(h.sqft) || 0,
      beds: Number(h.beds) || 0,
      baths: Number(h.baths) || 0,
      image: typeof h.image === "string" ? h.image : "",
      brand: String(h.brand ?? "Champion Homes"),
      homeType: String(h.homeType ?? ""),
      series: String(h.series ?? ""),
      ...(h.priceFrom ? { priceFrom: String(h.priceFrom) } : {}),
      ...(h.virtualTour ? { virtualTour: String(h.virtualTour) } : {}),
      ...(Number(h.widthFt) > 0 ? { widthFt: Number(h.widthFt) } : {}),
      ...(typeof h.bedsMin === "number" && Number.isFinite(h.bedsMin) ? { bedsMin: h.bedsMin } : {}),
      ...(typeof h.bedsMax === "number" && Number.isFinite(h.bedsMax) ? { bedsMax: h.bedsMax } : {}),
      ...(h.flexNote ? { flexNote: String(h.flexNote) } : {}),
    });
    if (out.length >= MAX_SAVED) break;
  }
  return out;
}

/**
 * Add the home if it is not saved, remove it if it is. Newest first; when the
 * list is full the oldest drops off, so saving always does what the shopper
 * pressed.
 */
export function toggleSaved(list: readonly SavedHome[], home: SavedHome, max = MAX_SAVED): SavedHome[] {
  if (list.some((h) => h.slug === home.slug)) return list.filter((h) => h.slug !== home.slug);
  return [toSavedHome(home), ...list].slice(0, max);
}

