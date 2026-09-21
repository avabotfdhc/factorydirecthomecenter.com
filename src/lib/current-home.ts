"use client";

import { useEffect, useMemo, useSyncExternalStore } from "react";

// Which home the visitor is currently looking at, published to the layout.
//
// `MobileActionBar` lives in the root layout, so it has no way to know that the
// page under it is a floor-plan detail page. It asked for a quote with
// `modelName="Direct Inquiry"` — on the one page where the buyer's interest is
// unambiguous, the lead arrived in DealerTide, Supabase and Kyle's inbox with
// no home attached. The floor-plan CARDS already pass `p.name`, so a quote from
// the grid was better attributed than a quote from the detail page.
//
// A page declares the home it is about; anything in the layout can read it.
// Deliberately not React context: context flows down, and the bar is a sibling
// of `{children}`, not a descendant. Deliberately not a route lookup either —
// the pathname carries the slug, but turning a slug into a display name in the
// browser would mean shipping the whole catalogue to it.
//
// The snapshot is a single encoded STRING for the reason spelled out in
// `use-browser-value.ts`: React compares snapshots with `Object.is`, so handing
// back a fresh `{ name, series }` object each call is an infinite render loop.
// It is encoded once, when the page registers, and parsed at the call site.

/** Unit separator — a control character, so it cannot occur in a plan name. */
const SEP = "\u001f";

let encoded: string | null = null;
const listeners = new Set<() => void>();

function encode(home: CurrentHomeProps): string {
  return `${home.name}${SEP}${home.series ?? ""}`;
}

function decode(raw: string | null): { name: string; series?: string } | null {
  if (!raw) return null;
  const [name, series] = raw.split(SEP);
  return { name, series: series || undefined };
}

function emit(): void {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export interface CurrentHomeProps {
  /** The plan's display name, exactly as the lead should record it. */
  name: string;
  /** Champion series, when the plan has one. */
  series?: string;
}

/**
 * Publish a home; returns the function that withdraws it again.
 *
 * The withdrawal only clears the value it wrote. On a client navigation React
 * may run the new page's effect before the old page's cleanup, and without
 * that guard the departing page would erase the arriving page's home and the
 * bar would quietly fall back to "Direct Inquiry". Whichever order the two
 * run in, the newest registration is the one that stands.
 */
export function registerCurrentHome(home: CurrentHomeProps): () => void {
  const value = encode(home);
  encoded = value;
  emit();

  return () => {
    if (encoded === value) {
      encoded = null;
      emit();
    }
  };
}

/** The registered home, read directly. For the layout, use the hook below. */
export function readCurrentHome(): { name: string; series?: string } | null {
  return decode(encoded);
}

/**
 * Renders nothing; declares, for as long as it is mounted, that this page is
 * about one specific home.
 *
 * Registration is an effect rather than a render-time write because it has to
 * be undone — on a client navigation away from the plan page the layout must
 * stop claiming the visitor is still looking at that home.
 */
export function CurrentHome({ name, series }: CurrentHomeProps) {
  useEffect(() => registerCurrentHome({ name, series }), [name, series]);
  return null;
}

/**
 * The home the current page is about, or `null` on any other page — and on the
 * server, so a layout-level component prerenders the same markup everywhere.
 */
export function useCurrentHome(): { name: string; series?: string } | null {
  const raw = useSyncExternalStore(
    subscribe,
    () => encoded,
    () => null,
  );

  return useMemo(() => decode(raw), [raw]);
}

