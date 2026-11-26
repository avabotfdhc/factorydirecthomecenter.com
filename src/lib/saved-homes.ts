// The browser half of saved homes: localStorage, cross-tab sync and the hook.
// Why the feature exists, and the pure helpers, are in saved-homes-core.ts.

import { useMemo, useSyncExternalStore } from "react";
import { parseSaved, SAVED_KEY, toggleSaved, type SavedHome } from "./saved-homes-core";

export { MAX_SAVED, parseSaved, SAVED_KEY, toSavedHome, toggleSaved, type SavedHome } from "./saved-homes-core";

const CHANGE_EVENT = "fdhc:saved-homes";

function readRaw(): string {
  try {
    return window.localStorage.getItem(SAVED_KEY) ?? "";
  } catch {
    return "";
  }
}

function writeList(list: SavedHome[]): boolean {
  try {
    if (list.length) window.localStorage.setItem(SAVED_KEY, JSON.stringify(list));
    else window.localStorage.removeItem(SAVED_KEY);
  } catch {
    return false; // private mode / storage blocked: the heart simply does not stick
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
  return true;
}

function subscribe(onChange: () => void): () => void {
  const onStorage = (e: StorageEvent) => {
    if (e.key === null || e.key === SAVED_KEY) onChange();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

/** The saved list. Empty on the server and on the first client render. */
export function useSavedHomes(): SavedHome[] {
  const raw = useSyncExternalStore(subscribe, readRaw, () => "");
  return useMemo(() => parseSaved(raw), [raw]);
}

/** Save or unsave one home. Returns whether it is saved afterwards. */
export function toggleSavedHome(home: SavedHome): boolean {
  const next = toggleSaved(parseSaved(readRaw()), home);
  writeList(next);
  return next.some((h) => h.slug === home.slug);
}

export function removeSavedHome(slug: string): void {
  writeList(parseSaved(readRaw()).filter((h) => h.slug !== slug));
}

export function clearSavedHomes(): void {
  writeList([]);
}
