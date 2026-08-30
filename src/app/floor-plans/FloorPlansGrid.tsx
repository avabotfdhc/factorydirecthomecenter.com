"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { ApiFloorPlan } from "@/lib/api-content";
import { CompareTray, MAX_COMPARE } from "./CompareTray";

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

// Sorting. "Featured" is the catalog's own order, which is how the CMS ranks
// homes — it stays the default so the initial server HTML and the first client
// render agree. Price sorting reads whichever price string the card shows
// (an exact price, or the "From $X" band); plans with no number at all sort
// last either way rather than jumping to the top as $0.
type SortKey = "featured" | "sqft-desc" | "sqft-asc" | "beds-desc" | "baths-desc" | "price-asc" | "price-desc" | "name-asc";

const SORT_LABELS: Record<SortKey, string> = {
  featured: "Featured",
  "sqft-desc": "Size: large to small",
  "sqft-asc": "Size: small to large",
  "beds-desc": "Most bedrooms",
  "baths-desc": "Most bathrooms",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  "name-asc": "Name: A–Z",
};

const priceValue = (p: ApiFloorPlan): number => {
  const n = Number(String(p.priceFrom || p.price || "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : NaN;
};

// NaN prices always sort to the end, whichever direction is chosen.
const byPrice = (dir: 1 | -1) => (a: ApiFloorPlan, b: ApiFloorPlan) => {
  const av = priceValue(a);
  const bv = priceValue(b);
  if (Number.isNaN(av) && Number.isNaN(bv)) return 0;
  if (Number.isNaN(av)) return 1;
  if (Number.isNaN(bv)) return -1;
  return (av - bv) * dir;
};

function sortPlans(plans: ApiFloorPlan[], sort: SortKey): ApiFloorPlan[] {
  if (sort === "featured") return plans;
  const out = [...plans];
  switch (sort) {
    case "sqft-desc": out.sort((a, b) => b.sqft - a.sqft); break;
    case "sqft-asc": out.sort((a, b) => a.sqft - b.sqft); break;
    case "beds-desc": out.sort((a, b) => bedsRange(b)[1] - bedsRange(a)[1] || b.sqft - a.sqft); break;
    case "baths-desc": out.sort((a, b) => b.baths - a.baths || b.sqft - a.sqft); break;
    case "price-asc": out.sort(byPrice(1)); break;
    case "price-desc": out.sort(byPrice(-1)); break;
    case "name-asc": out.sort((a, b) => a.name.localeCompare(b.name)); break;
  }
  return out;
}

export function FloorPlansGrid({ plans }: { plans: ApiFloorPlan[] }) {
  const [series, setSeries] = useState<string>("All");
  const [type, setType] = useState<string>("");
  const [width, setWidth] = useState<number>(0);
  const [minSqft, setMinSqft] = useState<number>(0);
  const [minBeds, setMinBeds] = useState<number>(0);
  const [minBaths, setMinBaths] = useState<number>(0);
  const [sort, setSort] = useState<SortKey>("featured");
  // Slugs the shopper has ticked for comparison, in the order they picked them.
  const [compare, setCompare] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);

  // Seed filters from the homepage search deep link after hydration.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if (q.get("type")) setType((q.get("type") || "").replace("double", "multi"));
    if (q.get("width")) setWidth(Number(q.get("width")) || 0);
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

  // Width options come from the catalog itself (14/16/24/28/32 today) so the
  // dropdown never offers a width with zero matches.
  const widthOptions = useMemo(() => {
    const widths = new Set<number>();
    for (const p of plans) if (p.widthFt) widths.add(p.widthFt);
    return [...widths].sort((a, b) => a - b);
  }, [plans]);

  const visible = useMemo(() => {
    const filtered = plans.filter((p) => {
      if (series !== "All" && p.series !== series) return false;
      if (type && !p.homeType.toLowerCase().includes(type)) return false;
      if (width && p.widthFt !== width) return false;
      if (minSqft && p.sqft < minSqft) return false;
      if (minBeds && !matchesBeds(p, minBeds)) return false;
      if (minBaths && p.baths < minBaths) return false;
      return true;
    });
    return sortPlans(filtered, sort);
  }, [plans, series, type, width, minSqft, minBeds, minBaths, sort]);

  // Compared plans keep pick order, and survive a filter change that would
  // otherwise hide them — the selection is the shopper's, not the filter's.
  const comparePlans = useMemo(
    () => compare.map((slug) => plans.find((p) => p.slug === slug)).filter((p): p is ApiFloorPlan => Boolean(p)),
    [compare, plans],
  );

  const toggleCompare = useCallback((slug: string) => {
    setCompare((current) =>
      current.includes(slug)
        ? current.filter((s) => s !== slug)
        : current.length >= MAX_COMPARE
          ? current
          : [...current, slug],
    );
  }, []);

  const filtersActive = type || width || minSqft || minBeds || minBaths;
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
        <select aria-label="Home width" className={selectCls} value={width || ""} onChange={(e) => setWidth(Number(e.target.value) || 0)}>
          <option value="">Any Width</option>
          {widthOptions.map((w) => (
            <option key={w} value={w}>{w}&#8242; wide</option>
          ))}
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
            onClick={() => { setType(""); setWidth(0); setMinSqft(0); setMinBeds(0); setMinBaths(0); }}
            className="min-h-12 px-4 text-sm font-semibold text-[var(--color-teal)] hover:underline"
          >
            Clear filters
          </button>
        ) : null}
        <select
          aria-label="Sort floor plans"
          className={`${selectCls} ml-auto`}
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
        >
          {(Object.keys(SORT_LABELS) as SortKey[]).map((k) => (
            <option key={k} value={k}>
              Sort: {SORT_LABELS[k]}
            </option>
          ))}
        </select>
        <span className="text-sm text-[var(--color-gray)]" aria-live="polite">
          {visible.length} of {plans.length} homes
        </span>
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${compare.length ? "pb-24" : ""}`}>
        {visible.map((p) => {
          const selected = compare.includes(p.slug);
          // The checkbox sits outside the card's <Link> — nesting an input in
          // an anchor would make ticking it navigate to the plan instead.
          return (
          <div key={p.slug} className="relative">
          <Link
            href={`/floor-plans/${p.slug}`}
            className="group block border border-[var(--color-charcoal)]/8 hover:border-[var(--color-teal)]/30 bg-white rounded-xl overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-1 h-full"
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
              {p.virtualTour && (
                <span className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded">
                  3D Tour
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
                  {p.priceFrom || p.price}
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

          <label
            className={`absolute bottom-4 right-4 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer border transition-colors ${
              selected
                ? "bg-[var(--color-teal)] text-white border-[var(--color-teal)]"
                : "bg-white/95 text-[var(--color-charcoal)] border-[var(--color-charcoal)]/15 hover:border-[var(--color-teal)]/50"
            } ${!selected && compare.length >= MAX_COMPARE ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <input
              type="checkbox"
              className="w-4 h-4 accent-[var(--color-teal)]"
              checked={selected}
              disabled={!selected && compare.length >= MAX_COMPARE}
              onChange={() => toggleCompare(p.slug)}
            />
            <span>Compare</span>
            <span className="sr-only">{p.name}</span>
          </label>
          </div>
          );
        })}
      </div>

      {/* Sticky compare bar — appears once something is ticked */}
      {compare.length > 0 && (
        <div
          // Stacks above the consent notice and the mobile action bar rather
          // than being hidden underneath them (see src/lib/bottom-bars.ts).
          style={{ bottom: "calc(var(--consent-h, 0px) + var(--mobile-bar-h, 0px))" }}
          className="fixed inset-x-0 z-40 bg-[var(--color-charcoal)] text-white shadow-2xl"
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex flex-wrap items-center gap-4">
            <p className="text-sm font-semibold">
              {compare.length} of {MAX_COMPARE} selected
              {comparePlans.length > 0 && (
                <span className="hidden sm:inline font-normal text-white/60">
                  {" "}
                  — {comparePlans.map((p) => p.name).join(", ")}
                </span>
              )}
            </p>
            <div className="flex items-center gap-3 ml-auto">
              <button
                type="button"
                onClick={() => setCompare([])}
                className="text-sm font-semibold text-white/70 hover:text-white"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setCompareOpen(true)}
                disabled={compare.length < 2}
                className="bg-[var(--color-lime)] text-[var(--color-charcoal)] px-6 py-2.5 rounded-lg text-sm font-bold tracking-wider uppercase hover:bg-[var(--color-lime-dark)] hover:text-white disabled:opacity-50 disabled:hover:bg-[var(--color-lime)] disabled:hover:text-[var(--color-charcoal)] transition-colors"
              >
                {compare.length < 2 ? "Pick one more" : `Compare ${compare.length}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {compareOpen && comparePlans.length > 0 && (
        <CompareTray
          plans={comparePlans}
          bedsLabel={bedsLabel}
          onRemove={(slug) => {
            const next = compare.filter((s) => s !== slug);
            setCompare(next);
            if (next.length === 0) setCompareOpen(false);
          }}
          onClear={() => {
            setCompare([]);
            setCompareOpen(false);
          }}
          onClose={() => setCompareOpen(false)}
        />
      )}

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
