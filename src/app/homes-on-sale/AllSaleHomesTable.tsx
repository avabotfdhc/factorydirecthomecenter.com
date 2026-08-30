"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import type { SaleListing } from "@/lib/sale-homes";
import { CallForPricing, formatUsd, PricingDisclaimer } from "@/components/Pricing";
import { salePriceFor } from "@/lib/sale";

// The complete price list. Every model on the master price sheet is on sale, so
// all of them are published here with MSRP and the campaign price — the photo
// cards above are a curated shortlist, not the extent of the offer.
//
// A table rather than more cards: 148 homes is a shopping list, and a buyer
// comparing this many wants to scan sizes and prices in a column, not scroll
// through 148 photographs.

type SortKey = "price-asc" | "price-desc" | "sqft-desc" | "sqft-asc" | "name-asc";

const SORT_LABELS: Record<SortKey, string> = {
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  "sqft-desc": "Size: large to small",
  "sqft-asc": "Size: small to large",
  "name-asc": "Name: A–Z",
};

const selectCls =
  "px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 min-h-11 focus:outline-none focus:ring-2 focus:ring-[#2c7a7b]";

export function AllSaleHomesTable({
  listings,
  discountPercent,
  saleActive,
}: {
  listings: SaleListing[];
  discountPercent: number;
  saleActive: boolean;
}) {
  const [query, setQuery] = useState("");
  const [series, setSeries] = useState("");
  const [type, setType] = useState("");
  const [minBeds, setMinBeds] = useState(0);
  const [sort, setSort] = useState<SortKey>("price-asc");

  const priceOf = useCallback(
    (l: SaleListing) => salePriceFor(l.msrp, discountPercent),
    [discountPercent],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = listings.filter((l) => {
      if (q && !`${l.name} ${l.modelNo} ${l.size}`.toLowerCase().includes(q)) return false;
      if (series && l.series !== series) return false;
      if (type && l.homeType !== type) return false;
      if (minBeds && l.beds < minBeds) return false;
      return true;
    });
    const out = [...rows];
    switch (sort) {
      case "price-asc": out.sort((a, b) => priceOf(a) - priceOf(b)); break;
      case "price-desc": out.sort((a, b) => priceOf(b) - priceOf(a)); break;
      case "sqft-desc": out.sort((a, b) => b.sqft - a.sqft); break;
      case "sqft-asc": out.sort((a, b) => a.sqft - b.sqft); break;
      case "name-asc": out.sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    return out;
  }, [listings, query, series, type, minBeds, sort, priceOf]);

  const filtersActive = Boolean(query || series || type || minBeds);

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center mb-6">
        <div className="relative flex-grow max-w-xs">
          <label htmlFor="all-search" className="sr-only">Search all homes on sale</label>
          <input
            id="all-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, model or size"
            className="w-full px-4 py-2 min-h-11 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c7a7b]"
          />
        </div>
        <select aria-label="Series" className={selectCls} value={series} onChange={(e) => setSeries(e.target.value)}>
          <option value="">All series</option>
          <option value="Aspire">Aspire</option>
          <option value="Paramount">Paramount</option>
          <option value="Prime">Prime</option>
        </select>
        <select aria-label="Home type" className={selectCls} value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">Singles &amp; doubles</option>
          <option value="Single Wide">Single section</option>
          <option value="Multi-Section">Multi-section</option>
        </select>
        <select aria-label="Minimum bedrooms" className={selectCls} value={minBeds || ""} onChange={(e) => setMinBeds(Number(e.target.value) || 0)}>
          <option value="">Any beds</option>
          <option value="2">2+ beds</option>
          <option value="3">3+ beds</option>
          <option value="4">4+ beds</option>
        </select>
        <select aria-label="Sort homes by" className={selectCls} value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
          {(Object.keys(SORT_LABELS) as SortKey[]).map((k) => (
            <option key={k} value={k}>Sort: {SORT_LABELS[k]}</option>
          ))}
        </select>
        {filtersActive && (
          <button
            type="button"
            onClick={() => { setQuery(""); setSeries(""); setType(""); setMinBeds(0); }}
            className="min-h-11 px-4 text-sm font-semibold text-[#2c7a7b] hover:underline"
          >
            Clear filters
          </button>
        )}
        <span className="text-sm text-gray-500 ml-auto" aria-live="polite">
          {visible.length} of {listings.length} homes
        </span>
      </div>

      {/* Wide content scrolls inside its own container rather than the page */}
      <div className="overflow-x-auto border border-gray-200 rounded-xl bg-white">
        <table className="w-full min-w-[720px] text-sm border-collapse">
          <caption className="sr-only">
            Every Champion floor plan on sale, with MSRP and sale price
          </caption>
          <thead className="bg-gray-50 text-left">
            <tr className="border-b border-gray-200">
              <th scope="col" className="px-4 py-3 font-semibold text-gray-900">Home</th>
              <th scope="col" className="px-4 py-3 font-semibold text-gray-900">Series</th>
              <th scope="col" className="px-4 py-3 font-semibold text-gray-900">Size</th>
              <th scope="col" className="px-4 py-3 font-semibold text-gray-900 text-right">Beds</th>
              <th scope="col" className="px-4 py-3 font-semibold text-gray-900 text-right">Baths</th>
              <th scope="col" className="px-4 py-3 font-semibold text-gray-900 text-right">Sq ft</th>
              {saleActive ? (
                <>
                  <th scope="col" className="px-4 py-3 font-semibold text-gray-900 text-right">MSRP</th>
                  <th scope="col" className="px-4 py-3 font-semibold text-gray-900 text-right">Sale price</th>
                  <th scope="col" className="px-4 py-3 font-semibold text-gray-900 text-right">You save</th>
                </>
              ) : (
                <th scope="col" className="px-4 py-3 font-semibold text-gray-900 text-right">Price</th>
              )}
            </tr>
          </thead>
          <tbody>
            {visible.map((l) => (
              <tr key={l.modelNo} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                <th scope="row" className="px-4 py-3 text-left font-normal">
                  {l.slug ? (
                    <Link href={`/floor-plans/${l.slug}`} className="font-semibold text-[#2c7a7b] hover:underline">
                      {l.name}
                    </Link>
                  ) : (
                    <span className="font-semibold text-gray-900">{l.name}</span>
                  )}
                  <span className="block text-xs text-gray-500">{l.modelNo}</span>
                </th>
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                  {l.series}
                  <span className="block text-xs text-gray-400">
                    {l.homeType === "Multi-Section" ? "Multi-section" : "Single section"}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{l.size}</td>
                <td className="px-4 py-3 text-gray-600 text-right">{l.beds}</td>
                <td className="px-4 py-3 text-gray-600 text-right">{l.baths}</td>
                <td className="px-4 py-3 text-gray-600 text-right">{l.sqft.toLocaleString()}</td>
                {saleActive ? (
                  <>
                    <td className="px-4 py-3 text-right whitespace-nowrap text-gray-500">
                      <s>{formatUsd(l.msrp)}</s>
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-[#2c7a7b] whitespace-nowrap">
                      {formatUsd(priceOf(l))}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-[#65a30d] whitespace-nowrap">
                      {formatUsd(l.msrp - priceOf(l))}
                    </td>
                  </>
                ) : (
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <CallForPricing />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {visible.length === 0 && (
        <p className="text-center text-gray-600 py-10">
          No homes match those filters.{" "}
          <a href="tel:+12603081457" className="text-[#2c7a7b] font-semibold">Call (260) 308-1457</a>{" "}
          and we&apos;ll find you one.
        </p>
      )}

      <PricingDisclaimer variant="short" className="mt-4 max-w-3xl" />
    </div>
  );
}
