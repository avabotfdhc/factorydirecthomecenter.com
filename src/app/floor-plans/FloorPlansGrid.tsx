"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { ApiFloorPlan } from "@/lib/api-content";

// Client-side series filter over the server-fetched plan list. All cards are
// in the initial HTML (the "All" view), so crawlers see the full catalog.
export function FloorPlansGrid({ plans }: { plans: ApiFloorPlan[] }) {
  const [series, setSeries] = useState<string>("All");

  const seriesOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of plans) {
      if (p.series) counts.set(p.series, (counts.get(p.series) || 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [plans]);

  const visible = series === "All" ? plans : plans.filter((p) => p.series === series);

  return (
    <>
      {/* Series filter — only shown when the catalog spans more than one series */}
      {seriesOptions.length > 1 && (
        <div className="flex flex-wrap items-center gap-2 mb-10" role="group" aria-label="Filter floor plans by series">
          <FilterPill label={`All (${plans.length})`} active={series === "All"} onClick={() => setSeries("All")} />
          {seriesOptions.map(([name, count]) => (
            <FilterPill
              key={name}
              label={`${name} (${count})`}
              active={series === name}
              onClick={() => setSeries(name)}
            />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {visible.map((p) => (
          <Link
            key={p.slug}
            href={`/floor-plans/${p.slug}`}
            className="group block border border-[var(--color-charcoal)]/8 hover:border-[var(--color-teal)]/30 bg-white rounded-xl overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
          >
            <div className="aspect-[16/10] bg-gradient-to-br from-[var(--color-cream-dark)] to-[var(--color-cream)] relative overflow-hidden border-b border-[var(--color-charcoal)]/5">
              {p.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.image}
                  alt={`${p.name} — ${p.beds} bed ${p.baths} bath manufactured home floor plan`}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-[var(--color-gray-light)] text-sm">
                  No photo
                </div>
              )}
              {p.series && (
                <span className="absolute top-3 left-3 bg-[var(--color-teal)] text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded">
                  {p.series} Series
                </span>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between gap-3 mb-2">
                <h2 className="font-serif text-xl font-semibold group-hover:text-[var(--color-teal)] transition-colors">
                  {p.name}
                </h2>
                <span className="text-sm font-bold text-[var(--color-lime-dark)] whitespace-nowrap">
                  {p.price}
                </span>
              </div>
              <p className="text-sm text-[var(--color-teal)] font-medium mb-4">
                {p.brand}
                {p.series ? ` · ${p.series} Series` : ""}
              </p>
              <div className="flex gap-4 text-xs tracking-wider uppercase text-[var(--color-gray)]">
                <span>{p.sqft.toLocaleString()} sq ft</span>
                <span className="text-[var(--color-gray-light)]">|</span>
                <span>{p.beds} Bed</span>
                <span className="text-[var(--color-gray-light)]">|</span>
                <span>{p.baths} Bath</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {visible.length === 0 && (
        <p className="text-center text-[var(--color-gray)] py-12">
          No {series} series homes right now — check the other series or{" "}
          <a href="tel:+12603081457" className="text-[var(--color-teal)] font-semibold">call (260) 308-1457</a>{" "}
          to ask about ordering one.
        </p>
      )}
    </>
  );
}

function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`min-h-12 px-5 rounded-full text-sm font-semibold transition-colors border ${
        active
          ? "bg-[var(--color-teal)] text-white border-[var(--color-teal)]"
          : "bg-white text-[var(--color-charcoal)] border-[var(--color-charcoal)]/15 hover:border-[var(--color-teal)]/40 hover:text-[var(--color-teal)]"
      }`}
    >
      {label}
    </button>
  );
}
