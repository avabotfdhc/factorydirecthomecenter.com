"use client";

import { useSyncExternalStore } from "react";

// Reading a browser-only value without lying to the server.
//
// Several components need something that only exists in the browser — the
// query string, localStorage, the current time — and each one solved it the
// same wrong way: render the server's value, then overwrite it from an effect
// on mount. That is a render cascade by construction (every visitor pays two
// renders), and `react-hooks/set-state-in-effect` flags it precisely because
// React has a primitive for this exact problem.
//
// `useSyncExternalStore` is that primitive. It takes a server snapshot used
// for SSR and hydration and a client snapshot used from then on; React swaps
// between them itself, after hydration, WITHOUT reporting a mismatch. No
// effect, no extra state, and — unlike `useSearchParams` — no forcing the
// surrounding tree out of prerendering, which on /floor-plans would have taken
// the entire card grid out of the initial HTML.
//
// Snapshots must be primitives or stable references: React compares them with
// Object.is, so returning a fresh object each call is an infinite render loop.
// Every hook here returns a string.

/** No-op subscribe for a value that cannot change without a navigation. */
function subscribeToNothing(): () => void {
  return () => {};
}

function subscribeToHistory(onChange: () => void): () => void {
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
}

/**
 * `window.location.search`, or `""` on the server.
 *
 * Returns the raw string rather than a `URLSearchParams` so the snapshot is
 * comparable; parse it in a `useMemo` at the call site.
 */
export function useLocationSearch(): string {
  return useSyncExternalStore(
    subscribeToHistory,
    () => window.location.search,
    () => "",
  );
}

/**
 * One `localStorage` entry as a raw string, or `null` on the server and
 * whenever storage is unavailable (Safari private mode and "block all
 * cookies" make the accessor throw rather than return null).
 */
export function useLocalStorageValue(key: string): string | null {
  return useSyncExternalStore(
    subscribeToNothing,
    () => {
      try {
        return window.localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    () => null,
  );
}

/**
 * False while rendering on the server and during hydration, true afterwards.
 *
 * For the narrow case of UI that must show a placeholder until the browser's
 * own state is readable. Prefer snapshotting the actual value above; reach for
 * this only when "we have not looked yet" and "we looked and found nothing"
 * need to render differently.
 */
export function useIsHydrated(): boolean {
  return useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );
}
