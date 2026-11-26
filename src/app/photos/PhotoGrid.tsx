"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CatalogueImage } from "@/components/CatalogueImage";
import { shortImageSrc } from "@/lib/image-src";
// Type-only imports: the grouping code (and plan-content behind it) stays on
// the server and out of the client bundle.
import type { GalleryPhoto } from "@/lib/photo-gallery";
import type { PlanKind } from "@/lib/plan-content";

// One room's photos on /photos/<room>: a home-type filter and "Show more".
//
// Page weight: a room holds up to ~280 photos. The server renders the first
// PAGE of them as real <img> markup (crawlable, and what a visitor sees
// first); the rest arrive as plain data in the RSC payload (~150 bytes each)
// and only become markup when the visitor asks for more. Every <img> is
// lazy-loaded with a three-width srcset (src/components/CatalogueImage.tsx).
//
// Each photo links to the home it was taken in: the gallery is a way into the
// floor-plan pages, where the quote and visit buttons are.

const PAGE = 24;

/** The words buyers filter by. */
const KIND_LABEL: Record<PlanKind, string> = {
  single: "Single wide",
  multi: "Double wide",
  modular: "Modular",
};

type Filter = "all" | PlanKind;

export function PhotoGrid({ photos, roomLabel }: { photos: GalleryPhoto[]; roomLabel: string }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [shown, setShown] = useState(PAGE);

  const kinds = useMemo(() => {
    const present = new Set(photos.map((p) => p.kind));
    return (["single", "multi", "modular"] as PlanKind[]).filter((k) => present.has(k));
  }, [photos]);

  const visible = useMemo(
    () => (filter === "all" ? photos : photos.filter((p) => p.kind === filter)),
    [photos, filter],
  );

  const choose = (f: Filter) => {
    setFilter(f);
    setShown(PAGE);
  };

  return (
    <div>
      {kinds.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label={`Filter ${roomLabel.toLowerCase()} photos by home type`}>
          {(["all", ...kinds] as Filter[]).map((f) => {
            const on = filter === f;
            const count = f === "all" ? photos.length : photos.filter((p) => p.kind === f).length;
            return (
              <button
                key={f}
                type="button"
                aria-pressed={on}
                onClick={() => choose(f)}
                className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                  on
                    ? "bg-[var(--color-charcoal)] text-[var(--color-cream)] border-[var(--color-charcoal)]"
                    : "bg-white text-[var(--color-charcoal)] border-[var(--color-charcoal)]/15 hover:border-[var(--color-teal)]"
                }`}
              >
                {f === "all" ? "All homes" : KIND_LABEL[f]} <span className="opacity-60">({count})</span>
              </button>
            );
          })}
        </div>
      )}

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visible.slice(0, shown).map((p) => (
          <li key={p.src}>
            <PhotoTile photo={p} />
          </li>
        ))}
      </ul>

      {shown < visible.length && (
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => setShown((n) => n + PAGE)}
            className="px-6 py-3 rounded-full border border-[var(--color-charcoal)]/20 bg-white text-sm font-medium hover:border-[var(--color-teal)] transition-colors"
          >
            Show more {roomLabel.toLowerCase()} ({visible.length - shown} more)
          </button>
        </div>
      )}
    </div>
  );
}

/** A photo and the home it belongs to. Shared with the /photos hub. */
export function PhotoTile({ photo: p }: { photo: GalleryPhoto }) {
  const home = p.series && !p.planName.toLowerCase().includes(p.series.toLowerCase())
    ? `${p.series} ${p.planName}`
    : p.planName;
  return (
    <figure className="group">
      <Link
        href={`/floor-plans/${p.planSlug}`}
        className="relative block aspect-[4/3] overflow-hidden rounded-xl border border-[var(--color-charcoal)]/8 bg-white"
        aria-label={`${p.alt}. See this home`}
      >
        <CatalogueImage
          src={shortImageSrc(p.src)}
          alt={p.alt}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
        />
      </Link>
      <figcaption className="mt-2 flex items-baseline justify-between gap-3 text-sm">
        <span className="capitalize text-[var(--color-charcoal)]/70">{p.what}</span>
        <Link href={`/floor-plans/${p.planSlug}`} className="font-medium text-[var(--color-teal)] hover:underline">
          {home} · {KIND_LABEL[p.kind].toLowerCase()}
        </Link>
      </figcaption>
    </figure>
  );
}
