import Link from "next/link";
import Image from "next/image";
import { H3 } from "./Heading";
import type { ApiFloorPlan } from "@/lib/api-content";

// Featured homes for the homepage. Data arrives server-fetched from the page
// (see app/page.tsx) so the cards — a frequent LCP element — are in the
// initial HTML, and the photos route through next/image so the multi-
// megapixel S3 originals are resized, converted to AVIF/WebP, and cached.
export function FeaturedHomes({ homes }: { homes: ApiFloorPlan[] }) {
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
      {homes.map((plan, i) => (
        <Link
          key={plan.slug}
          href={`/floor-plans/${plan.slug}`}
          className="group bg-white rounded-lg border border-[var(--color-charcoal)]/8 overflow-hidden hover:shadow-lg hover:border-[var(--color-teal)]/30 transition-all duration-400"
        >
          <figure className="aspect-[16/11] bg-gradient-to-br from-gray-100 to-gray-50 relative overflow-hidden">
            {plan.image ? (
              <Image
                src={plan.image}
                alt={`${plan.name} ${plan.homeType} floor plan — ${plan.sqft} sq ft, ${plan.beds} bed, ${plan.baths} bath`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                loading={i === 0 ? "eager" : "lazy"}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-[var(--color-gray-light)] text-sm">No photo</div>
            )}
            {plan.homeType && (
              <span className="absolute top-3 left-3 bg-[var(--color-teal)] text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded z-10">
                {plan.homeType}
              </span>
            )}
            {plan.virtualTour && (
              <span className="absolute top-3 right-3 bg-black/60 text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded z-10">
                3D Tour
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
              <span className="font-serif text-xl font-semibold text-[var(--color-teal)]">{plan.priceFrom || plan.price}</span>
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
