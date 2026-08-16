"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

// Homepage search bar. The selects build a
// /floor-plans?type=&width=&sqft=&beds=&baths= URL that FloorPlansGrid reads
// to pre-apply filters, so the homepage search actually filters the catalog
// instead of just linking to it.
const selectCls =
  "flex-1 px-3 py-2 bg-[var(--color-cream-dark)] border-0 rounded text-sm text-[var(--color-charcoal)]";

export function HomeSearchBar() {
  const router = useRouter();
  const [type, setType] = useState("");
  const [width, setWidth] = useState("");
  const [sqft, setSqft] = useState("");
  const [beds, setBeds] = useState("");
  const [baths, setBaths] = useState("");

  const search = () => {
    const q = new URLSearchParams();
    if (type) q.set("type", type);
    if (width) q.set("width", width);
    if (sqft) q.set("sqft", sqft);
    if (beds) q.set("beds", beds);
    if (baths) q.set("baths", baths);
    router.push(`/floor-plans${q.toString() ? `?${q.toString()}` : ""}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-2 flex flex-col sm:flex-row gap-2">
      <select aria-label="Home type" className={selectCls} value={type} onChange={(e) => setType(e.target.value)}>
        <option value="">All Types</option>
        <option value="single">Single Wide</option>
        <option value="multi">Multi-Section</option>
        <option value="modular">Modular</option>
      </select>
      <select aria-label="Home width" className={selectCls} value={width} onChange={(e) => setWidth(e.target.value)}>
        <option value="">Any Width</option>
        <option value="14">14&#8242; wide</option>
        <option value="16">16&#8242; wide</option>
        <option value="24">24&#8242; wide</option>
        <option value="28">28&#8242; wide</option>
        <option value="32">32&#8242; wide</option>
      </select>
      <select aria-label="Home size" className={selectCls} value={sqft} onChange={(e) => setSqft(e.target.value)}>
        <option value="">Any Size</option>
        <option value="1000">1,000+ sq ft</option>
        <option value="1500">1,500+ sq ft</option>
        <option value="2000">2,000+ sq ft</option>
      </select>
      <select aria-label="Bedrooms" className={selectCls} value={beds} onChange={(e) => setBeds(e.target.value)}>
        <option value="">Any Beds</option>
        <option value="2">2+ Beds</option>
        <option value="3">3+ Beds</option>
        <option value="4">4+ Beds</option>
        <option value="5">5+ Beds</option>
      </select>
      <select aria-label="Bathrooms" className={selectCls} value={baths} onChange={(e) => setBaths(e.target.value)}>
        <option value="">Any Baths</option>
        <option value="1">1+ Baths</option>
        <option value="2">2+ Baths</option>
        <option value="3">3+ Baths</option>
      </select>
      <button
        type="button"
        onClick={search}
        className="bg-[var(--color-lime)] text-[var(--color-charcoal)] px-6 py-2 text-sm font-bold uppercase rounded hover:bg-[var(--color-lime-dark)] transition-colors flex items-center justify-center"
      >
        Search
      </button>
    </div>
  );
}
