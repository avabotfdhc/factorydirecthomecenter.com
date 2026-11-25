import Link from "next/link";
import Image from "next/image";
import { shortImageSrc } from "@/lib/image-src";
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
          className="group bg-white rounded-[6px] border border-[var(--color-charcoal)]/10 overflow-hidden hover:shadow-[0_24px_48px_-28px_rgba(14,42,33,0.45)] hover:border-[var(--color-charcoal)]/20 transition-all duration-500"
        >
          <figure className="aspect-[16/11] bg-gradient-to-br from-gray-100 to-gray-50 relative overflow-hidden">
            {plan.image ? (
              <Image
                src={shortImageSrc(plan.image)}
                alt={`${plan.name} ${plan.homeType} floor plan — ${plan.sqft} sq ft, ${plan.beds} bed, ${plan.baths} bath`}
                fill
                className="object-cover group-hover:scale-[1.04] transition-transform duration-700"
                sizes="(max-width: 640px) 88vw, (max-width: 1024px) 45vw, 22vw"
                loading={i === 0 ? "eager" : "lazy"}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-[var(--color-gray)] text-sm">No photo</div>
            )}
            {plan.homeType && (
              <span className="absolute top-3 left-3 bg-white/90 text-[var(--color-evergreen)] text-[10px] font-semibold tracking-[0.14em] uppercase px-2.5 py-1 rounded-full z-10">
                {plan.homeType}
              </span>
            )}
            {plan.virtualTour && (
              <span className="absolute top-3 right-3 bg-[var(--color-evergreen)]/80 text-white text-[10px] font-semibold tracking-[0.14em] uppercase px-2.5 py-1 rounded-full z-10">
                3D Tour
              </span>
            )}
          </figure>

          <div className="p-6">
            <H3 className="font-serif text-2xl font-medium leading-tight mb-1 group-hover:text-[var(--color-teal)] transition-colors">{plan.name}</H3>
            <p className="text-xs text-[var(--color-gray)] font-medium tracking-wide mb-4">{plan.brand}</p>

            <div className="flex gap-4 text-xs tracking-wider uppercase text-[var(--color-charcoal)]/80 mb-5">
              <span>{plan.sqft ? plan.sqft.toLocaleString() : "—"} ft²</span>
              <span>{plan.beds} Bed</span>
              <span>{plan.baths} Bath</span>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[var(--color-charcoal)]/10">
              <span className="font-serif text-lg font-medium lining-nums text-[var(--color-teal-dark)]">{plan.priceFrom || plan.price}</span>
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-orange-text)] transition-colors">
                View Plan →
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
