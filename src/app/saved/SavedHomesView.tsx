"use client";

import { useState } from "react";
import Link from "next/link";
import { CatalogueImage } from "@/components/CatalogueImage";
import { shortImageSrc } from "@/lib/image-src";
import { SavedHomesQuoteButton, ShowroomVisitButton } from "@/components/QuoteModal";
import { CompareTray, MAX_COMPARE } from "@/app/floor-plans/CompareTray";
import { clearSavedHomes, removeSavedHome, useSavedHomes, type SavedHome } from "@/lib/saved-homes";
import { trackEvent } from "@/lib/analytics";

// /saved: the shopper's shortlist (src/lib/saved-homes.ts), side-by-side
// compare (the same CompareTray as /floor-plans), and one button that asks
// for prices on every saved home through the normal lead form.

const bedsLabel = (p: SavedHome) => {
  const lo = Math.min(p.bedsMin ?? p.beds, p.beds);
  const hi = Math.max(p.bedsMax ?? p.beds, p.beds);
  return lo < hi ? `${lo}–${hi}` : String(p.beds);
};

export function SavedHomesView() {
  const saved = useSavedHomes();
  // Which saved homes are ticked for comparing. Unticked by default would
  // make "Compare" a two-step action; the first four are ticked instead,
  // until the shopper changes it.
  const [picked, setPicked] = useState<string[] | null>(null);
  const [comparing, setComparing] = useState(false);

  const chosen = (picked ?? saved.slice(0, MAX_COMPARE).map((h) => h.slug)).filter((s) =>
    saved.some((h) => h.slug === s),
  );
  const comparePlans = chosen.map((s) => saved.find((h) => h.slug === s)!).filter(Boolean);

  const togglePick = (slug: string) => {
    const cur = chosen;
    if (cur.includes(slug)) setPicked(cur.filter((s) => s !== slug));
    else if (cur.length < MAX_COMPARE) setPicked([...cur, slug]);
  };

  if (saved.length === 0) {
    return (
      <div className="rounded-2xl bg-white border border-[var(--color-charcoal)]/8 p-8 lg:p-10 text-center">
        <p className="text-lg">You haven&apos;t saved any homes yet.</p>
        <p className="mt-2 text-[var(--color-charcoal)]/70">
          Tap the heart on any floor plan to keep it here. Your list stays in this browser; nothing is sent to us
          until you ask for prices.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/floor-plans"
            className="btn-primary bg-[var(--color-teal)] text-white px-6 py-3 text-sm font-bold tracking-widest uppercase rounded hover:bg-[var(--color-teal-dark)] transition-colors duration-300"
          >
            Browse floor plans
          </Link>
          <Link
            href="/photos"
            className="border border-[var(--color-charcoal)]/20 px-6 py-3 text-sm font-bold tracking-widest uppercase rounded hover:border-[var(--color-teal)] transition-colors duration-300"
          >
            Browse photos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <p className="text-[var(--color-charcoal)]/70">
          {saved.length} saved {saved.length === 1 ? "home" : "homes"}. Tick up to {MAX_COMPARE} to compare side by side.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={comparePlans.length < 2}
            onClick={() => {
              trackEvent("compare_saved_homes", { count: comparePlans.length });
              setComparing(true);
            }}
            className="border border-[var(--color-charcoal)]/20 bg-white px-5 py-3 text-sm font-bold tracking-widest uppercase rounded hover:border-[var(--color-teal)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {comparePlans.length < 2 ? "Tick 2 to compare" : `Compare ${comparePlans.length}`}
          </button>
          <SavedHomesQuoteButton
            homeNames={saved.map((h) => (h.series && !h.name.includes(h.series) ? `${h.series} ${h.name}` : h.name))}
            className="btn-primary bg-[var(--color-teal)] text-white px-5 py-3 text-sm font-bold tracking-widest uppercase rounded hover:bg-[var(--color-teal-dark)] transition-colors duration-300"
          />
        </div>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {saved.map((h) => {
          const ticked = chosen.includes(h.slug);
          return (
            <li key={h.slug} className="rounded-2xl bg-white border border-[var(--color-charcoal)]/8 overflow-hidden">
              <Link href={`/floor-plans/${h.slug}`} className="relative block aspect-[16/10] bg-[var(--color-cream-dark)]">
                {h.image ? (
                  <CatalogueImage
                    src={shortImageSrc(h.image)}
                    alt={`${h.name} — ${bedsLabel(h)} bed ${h.baths} bath manufactured home`}
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                  />
                ) : null}
              </Link>
              <div className="p-5">
                <Link href={`/floor-plans/${h.slug}`} className="font-serif text-xl hover:text-[var(--color-teal)]">
                  {h.name}
                </Link>
                <p className="mt-1 text-sm text-[var(--color-charcoal)]/70">
                  {[h.series && `${h.series} Series`, h.homeType, `${bedsLabel(h)} bed`, `${h.baths} bath`, h.sqft ? `${h.sqft.toLocaleString("en-US")} sq ft` : ""]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                <div className="mt-4 flex items-center justify-between gap-3 text-sm">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ticked}
                      disabled={!ticked && chosen.length >= MAX_COMPARE}
                      onChange={() => togglePick(h.slug)}
                      className="h-4 w-4 accent-[var(--color-teal)]"
                    />
                    Compare
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      removeSavedHome(h.slug);
                      trackEvent("unsave_home", { item_name: h.name, location: "saved_page" });
                    }}
                    className="text-[var(--color-charcoal)]/60 hover:text-[var(--color-charcoal)] underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
        <ShowroomVisitButton
          location="saved_homes"
          label="Book a visit to see them"
          className="border border-[var(--color-charcoal)]/20 bg-white px-5 py-3 text-sm font-bold tracking-widest uppercase rounded hover:border-[var(--color-teal)] transition-colors"
        />
        <button
          type="button"
          onClick={() => {
            if (window.confirm("Remove every saved home from this browser?")) clearSavedHomes();
          }}
          className="text-sm text-[var(--color-charcoal)]/60 underline hover:text-[var(--color-charcoal)]"
        >
          Clear my list
        </button>
      </div>

      {comparing && comparePlans.length > 0 && (
        <CompareTray
          plans={comparePlans}
          bedsLabel={bedsLabel}
          onRemove={(slug) => setPicked(chosen.filter((s) => s !== slug))}
          onClear={() => {
            setPicked([]);
            setComparing(false);
          }}
          onClose={() => setComparing(false)}
        />
      )}
    </div>
  );
}
