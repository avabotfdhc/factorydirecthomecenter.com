"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { H3 } from "./Heading";

interface Home {
  slug: string;
  name: string;
  homeType: string;
  sqft: number;
  beds: number;
  baths: number;
  price: string;
  image: string;
  brand: string;
}

export function FeaturedHomes() {
  const [homes, setHomes] = useState<Home[] | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/homes/featured")
      .then((r) => (r.ok ? r.json() : { homes: [] }))
      .then((d) => {
        if (active) setHomes(Array.isArray(d.homes) ? d.homes : []);
      })
      .catch(() => active && setHomes([]));
    return () => {
      active = false;
    };
  }, []);

  // Loading skeletons keep layout stable while the CMS responds.
  if (homes === null) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-[var(--color-charcoal)]/8 overflow-hidden">
            <div className="aspect-[16/11] bg-[var(--color-cream-dark)] animate-pulse" />
            <div className="p-5 space-y-3">
              <div className="h-4 w-2/3 bg-[var(--color-cream-dark)] rounded animate-pulse" />
              <div className="h-3 w-1/2 bg-[var(--color-cream-dark)] rounded animate-pulse" />
              <div className="h-5 w-1/3 bg-[var(--color-cream-dark)] rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (homes.length === 0) {
    return (
      <p className="text-center text-[var(--color-gray)]">
        Explore our full lineup on the{" "}
        <Link href="/floor-plans" className="text-[var(--color-teal)] font-semibold">floor plans page</Link>.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {homes.map((plan) => (
        <Link
          key={plan.slug}
          href={`/floor-plans/${plan.slug}`}
          className="group bg-white rounded-lg border border-[var(--color-charcoal)]/8 overflow-hidden hover:shadow-lg hover:border-[var(--color-teal)]/30 transition-all duration-400"
        >
          <figure className="aspect-[16/11] bg-gradient-to-br from-gray-100 to-gray-50 relative overflow-hidden">
            {plan.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={plan.image}
                alt={`${plan.name} ${plan.homeType} floor plan — ${plan.sqft} sq ft, ${plan.beds} bed, ${plan.baths} bath`}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-[var(--color-gray-light)] text-sm">No photo</div>
            )}
            {plan.homeType && (
              <span className="absolute top-3 left-3 bg-[var(--color-teal)] text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded z-10">
                {plan.homeType}
              </span>
            )}
          </figure>

          <div className="p-5">
            <H3 className="font-semibold text-base mb-1 group-hover:text-[var(--color-teal)] transition-colors">{plan.name}</H3>
            <p className="text-xs text-[var(--color-teal)] font-medium mb-3">{plan.brand}</p>

            <div className="flex gap-3 text-xs text-[var(--color-gray)] mb-4">
              <span>{plan.sqft ? plan.sqft.toLocaleString() : "—"} ft²</span>
              <span>{plan.beds} Bed</span>
              <span>{plan.baths} Bath</span>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[var(--color-charcoal)]/5">
              <span className="font-serif text-xl font-semibold text-[var(--color-teal)]">{plan.price}</span>
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-lime-dark)] group-hover:text-[var(--color-teal)] transition-colors">
                View Plan →
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
