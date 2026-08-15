"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { ApiFloorPlan } from "@/lib/api-content";

// Client-side filters over the server-fetched plan list. All cards are in the
// initial HTML (the unfiltered view), so crawlers see the full catalog. The
// homepage search bar deep-links here with ?type=&sqft=&beds=&baths=; those
// params are read from window.location in an effect (NOT useSearchParams,
// which would bail the whole grid out of server rendering and drop every
// card from the initial HTML).
const bedsRange = (p: ApiFloorPlan): [number, number] => [
  Math.min(p.bedsMin ?? p.beds, p.beds),
  Math.max(p.bedsMax ?? p.beds, p.beds),
];
const bedsLabel = (p: ApiFloorPlan) => {
  const [lo, hi] = bedsRange(p);
  return lo < hi ? `${lo}–${hi}` : String(p.beds);
};

// A plan matches "N+ beds" if any orderable configuration reaches N.
const matchesBeds = (p: ApiFloorPlan, min: number) => bedsRange(p)[1] >= min;

export function FloorPlansGrid({ plans }: { plans: ApiFloorPlan[] }) {
  const [series, setSeries] = useState<string>("All");
  const [type, setType] = useState<string>("");
  const [minSqft, setMinSqft] = useState<number>(0);
  const [minBeds, setMinBeds] = useState<number>(0);
  const [minBaths, setMinBaths] = useState<number>(0);

  // Seed filters from the homepage search deep link after hydration.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if (q.get("type")) setType((q.get("type") || "").replace("double", "multi"));
    if (q.get("sqft")) setMinSqft(Number(q.get("sqft")) || 0);
    if (q.get("beds")) setMinBeds(Number(q.get("beds")) || 0);
    if (q.get("baths")) setMinBaths(Number(q.get("baths")) || 0);
  }, []);

  const seriesOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of plans) {
      if (p.series) counts.set(p.series, (counts.get(p.series) || 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [plans]);

  const visible = plans.filter((p) => {
    if (series !== "All" && p.series !== series) return false;
    if (type && !p.homeType.toLowerCase().includes(type)) return false;
    if (minSqft && p.sqft < minSqft) return false;
    if (minBeds && !matchesBeds(p, minBeds)) return false;
    if (minBaths && p.baths < minBaths) return false;
    return true;
  });

  const filtersActive = type || minSqft || minBeds || minBaths;
  const selectCls =
    "px-3 py-2.5 bg-white border border-[var(--color-charcoal)]/15 rounded-lg text-sm text-[var(--color-charcoal)] min-h-12";

  return (
    <>
      {/* Series filter — only shown when the catalog spans more than one series */}
      {seriesOptions.length > 1 && (
        <div className="flex flex-wrap items-center gap-2 mb-6" role="group" aria-label="Filter floor plans by series">
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

      {/* Spec filters — seeded from the homepage search */}
      <div className="flex flex-wrap items-center gap-2.5 mb-10" role="group" aria-label="Filter floor plans by specs">
        <select aria-label="Home type" className={selectCls} value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All Types</option>
          <option value="single">Single Wide</option>
          <option value="multi">Multi-Section</option>
          <option value="modular">Modular</option>
        </select>
        <select aria-label="Minimum size" className={selectCls} value={minSqft || ""} onChange={(e) => setMinSqft(Number(e.target.value) || 0)}>
          <option value="">Any Size</option>
          <option value="1000">1,000+ sq ft</option>
          <option value="1500">1,500+ sq ft</option>
          <option value="2000">2,000+ sq ft</option>
        </select>
        <select aria-label="Minimum bedrooms" className={selectCls} value={minBeds || ""} onChange={(e) => setMinBeds(Number(e.target.value) || 0)}>
          <option value="">Any Beds</option>
          <option value="2">2+ Beds</option>
          <option value="3">3+ Beds</option>
          <option value="4">4+ Beds</option>
          <option value="5">5+ Beds</option>
        </select>
        <select aria-label="Minimum bathrooms" className={selectCls} value={minBaths || ""} onChange={(e) => setMinBaths(Number(e.target.value) || 0)}>
          <option value="">Any Baths</option>
          <option value="1">1+ Baths</option>
          <option value="2">2+ Baths</option>
          <option value="3">3+ Baths</option>
        </select>
        {filtersActive ? (
          <button
            type="button"
            onClick={() => { setType(""); setMinSqft(0); setMinBeds(0); setMinBaths(0); }}
            className="min-h-12 px-4 text-sm font-semibold text-[var(--color-teal)] hover:underline"
          >
            Clear filters
          </button>
        ) : null}
        <span className="text-sm text-[var(--color-gray)] ml-auto" aria-live="polite">
          {visible.length} of {plans.length} homes
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {visible.map((p) => (
          <Link
            key={p.slug}
            href={`/floor-plans/${p.slug}`}
            className="group block border border-[var(--color-charcoal)]/8 hover:border-[var(--color-teal)]/30 bg-white rounded-xl overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
          >
            <div className="aspect-[16/10] bg-gradient-to-br from-[var(--color-cream-dark)] to-[var(--color-cream)] relative overflow-hidden border-b border-[var(--color-charcoal)]/5">
              {p.image ? (
                <Image
                  src={p.image}
                  alt={`${p.name} — ${bedsLabel(p)} bed ${p.baths} bath manufactured home floor plan`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
              {bedsRange(p)[0] < bedsRange(p)[1] && (
                <span className="absolute top-3 right-3 bg-[var(--color-lime)] text-[var(--color-charcoal)] text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded">
                  {bedsRange(p)[0]} or {bedsRange(p)[1]} Bed
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
                <span>{bedsLabel(p)} Bed</span>
                <span className="text-[var(--color-gray-light)]">|</span>
                <span>{p.baths} Bath</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {visible.length === 0 && (
        <p className="text-center text-[var(--color-gray)] py-12">
          No homes match those filters right now — try widening the search or{" "}
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
