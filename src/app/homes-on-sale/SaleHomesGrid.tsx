"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FadeIn } from "@/components/VisualEffects";
import { formatUsd, type SaleHome } from "@/lib/sale-homes";
import { salePriceFor } from "@/lib/sale";

// The sale page previously rendered a full set of controls — a search box, a
// "Search" button, Bedrooms / Bathroom / Price / Square Feet / Sort By buttons,
// and a "Load More Homes" button — none of which were wired to anything. They
// were inert markup: typing in the box and clicking Search did nothing, and
// "Load More" had no more homes to load. This component makes the same controls
// real, and drops "Load More" (every sale home is on the page already).

type SortKey = "featured" | "price-asc" | "price-desc" | "sqft-asc" | "sqft-desc" | "beds-desc";

const SORT_LABELS: Record<SortKey, string> = {
  featured: "Featured",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  "sqft-asc": "Size: small to large",
  "sqft-desc": "Size: large to small",
  "beds-desc": "Most bedrooms",
};

const selectCls =
  "px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 min-h-11 focus:outline-none focus:ring-2 focus:ring-[#2c7a7b]";

export function SaleHomesGrid({
  homes,
  discountPercent,
  saleActive,
}: {
  homes: SaleHome[];
  discountPercent: number;
  saleActive: boolean;
}) {
  // Sale prices come from the running campaign phase, so filtering, sorting and
  // the card all agree and none of them can show a previous campaign's numbers.
  // Memoized on the discount so it can be a dependency of the list below.
  const priceOf = useCallback(
    (h: SaleHome) => salePriceFor(h.msrp, discountPercent),
    [discountPercent],
  );
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [minBeds, setMinBeds] = useState(0);
  const [minBaths, setMinBaths] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [minSqft, setMinSqft] = useState(0);
  const [sort, setSort] = useState<SortKey>("featured");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = homes.filter((h) => {
      if (q && !`${h.name} ${h.modelNo} ${h.series}`.toLowerCase().includes(q)) return false;
      if (type && h.homeType !== type) return false;
      if (minBeds && h.beds < minBeds) return false;
      if (minBaths && h.baths < minBaths) return false;
      if (maxPrice && priceOf(h) > maxPrice) return false;
      if (minSqft && h.sqft < minSqft) return false;
      return true;
    });

    const sorted = [...filtered];
    switch (sort) {
      case "price-asc":
        sorted.sort((a, b) => priceOf(a) - priceOf(b));
        break;
      case "price-desc":
        sorted.sort((a, b) => priceOf(b) - priceOf(a));
        break;
      case "sqft-asc":
        sorted.sort((a, b) => a.sqft - b.sqft);
        break;
      case "sqft-desc":
        sorted.sort((a, b) => b.sqft - a.sqft);
        break;
      case "beds-desc":
        sorted.sort((a, b) => b.beds - a.beds || b.sqft - a.sqft);
        break;
      default:
        break; // "featured" keeps the curated order
    }
    return sorted;
  }, [homes, query, type, minBeds, minBaths, maxPrice, minSqft, sort, priceOf]);

  const filtersActive = Boolean(query || type || minBeds || minBaths || maxPrice || minSqft);

  return (
    <>
      {/* Controls */}
      <div className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-grow max-w-sm">
              <label htmlFor="sale-search" className="sr-only">
                Search sale homes
              </label>
              <input
                id="sale-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or model number"
                className="w-full pl-10 pr-4 py-2 min-h-11 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c7a7b]"
              />
              <svg
                className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <select aria-label="Home type" className={selectCls} value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">All types</option>
              <option value="Single Wide">Single Wide</option>
              <option value="Multi-Section">Multi-Section</option>
            </select>

            <select aria-label="Minimum bedrooms" className={selectCls} value={minBeds || ""} onChange={(e) => setMinBeds(Number(e.target.value) || 0)}>
              <option value="">Any beds</option>
              <option value="2">2+ beds</option>
              <option value="3">3+ beds</option>
              <option value="4">4+ beds</option>
            </select>

            <select aria-label="Minimum bathrooms" className={selectCls} value={minBaths || ""} onChange={(e) => setMinBaths(Number(e.target.value) || 0)}>
              <option value="">Any baths</option>
              <option value="1">1+ baths</option>
              <option value="2">2+ baths</option>
            </select>

            <select aria-label="Maximum sale price" className={selectCls} value={maxPrice || ""} onChange={(e) => setMaxPrice(Number(e.target.value) || 0)}>
              <option value="">Any price</option>
              <option value="75000">Under $75,000</option>
              <option value="110000">Under $110,000</option>
              <option value="130000">Under $130,000</option>
            </select>

            <select aria-label="Minimum square feet" className={selectCls} value={minSqft || ""} onChange={(e) => setMinSqft(Number(e.target.value) || 0)}>
              <option value="">Any size</option>
              <option value="1000">1,000+ sq ft</option>
              <option value="1400">1,400+ sq ft</option>
              <option value="1600">1,600+ sq ft</option>
            </select>

            <select aria-label="Sort homes by" className={selectCls} value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
              {(Object.keys(SORT_LABELS) as SortKey[]).map((k) => (
                <option key={k} value={k}>
                  Sort: {SORT_LABELS[k]}
                </option>
              ))}
            </select>

            {filtersActive && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setType("");
                  setMinBeds(0);
                  setMinBaths(0);
                  setMaxPrice(0);
                  setMinSqft(0);
                }}
                className="min-h-11 px-4 text-sm font-semibold text-[#2c7a7b] hover:underline"
              >
                Clear filters
              </button>
            )}

            <span className="text-sm text-gray-500 ml-auto" aria-live="polite">
              {visible.length} of {homes.length} homes
            </span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <section id="sale-homes" className="py-12 md:py-16 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {visible.length === 0 ? (
            <p className="text-center text-gray-600 py-12">
              No sale homes match those filters.{" "}
              <a href="tel:+12603081457" className="text-[#2c7a7b] font-semibold">
                Call (260) 308-1457
              </a>{" "}
              and we&apos;ll tell you what else is discounted right now.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {visible.map((home, index) => (
                <FadeIn key={home.id} delay={index * 0.1}>
                  <article className="relative bg-white rounded-xl shadow-lg overflow-hidden border hover:shadow-xl transition-shadow h-full flex flex-col">
                    {saleActive && (
                      <>
                        <span className="absolute top-4 left-4 z-10 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          On Sale
                        </span>
                        <span className="absolute top-4 right-4 z-10 bg-[#84cc16] text-white px-3 py-1 rounded-full text-sm font-bold">
                          {discountPercent}% Off
                        </span>
                      </>
                    )}

                    <div className="relative h-56 bg-gray-100">
                      {home.image ? (
                        <Image
                          src={home.image}
                          alt={`${home.name} — ${home.sqft} sq ft, ${home.beds} bed ${home.baths} bath Champion home`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-400">
                          Photo coming soon
                        </div>
                      )}
                    </div>

                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{home.name}</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Model {home.modelNo} · {home.series} · {home.homeType}
                      </p>

                      <div className="grid grid-cols-3 gap-3 mb-4">
                        {[
                          { value: home.sqft.toLocaleString(), label: "Sq. Ft" },
                          { value: home.beds, label: "Beds" },
                          { value: home.baths, label: "Baths" },
                        ].map((spec) => (
                          <div key={spec.label} className="text-center p-3 bg-gray-50 rounded-lg">
                            <p className="text-2xl font-bold text-[#2c7a7b]">{spec.value}</p>
                            <p className="text-xs text-gray-500">{spec.label}</p>
                          </div>
                        ))}
                      </div>

                      <p className="text-sm text-gray-600 mb-4">{home.size}</p>

                      {/* Pricing — MSRP struck through against the campaign price */}
                      <div className="border-t pt-4 mb-4 mt-auto">
                        {saleActive ? (
                          <>
                            <p className="text-sm text-gray-500">
                              MSRP <s>{formatUsd(home.msrp)}</s>
                            </p>
                            <p className="text-2xl font-bold text-[#2c7a7b]">
                              {formatUsd(priceOf(home))}
                              <span className="text-sm font-semibold text-[#65a30d] ml-2">
                                save {formatUsd(home.msrp - priceOf(home))}
                              </span>
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Home only — excludes delivery, setup, site work, taxes &amp; fees.*
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-2xl font-bold text-[#2c7a7b]">{formatUsd(home.msrp)}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              MSRP, home only. Ask us what discounts are running right now.
                            </p>
                          </>
                        )}
                      </div>

                      <Link
                        href={`/homes-on-sale/details/${home.id}`}
                        className="block w-full text-center py-3 bg-[#2c7a7b] hover:bg-[#1a365d] text-white font-semibold rounded-lg transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </article>
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
