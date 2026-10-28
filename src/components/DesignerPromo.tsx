import Image from "next/image";
import { DesignerCta } from "@/components/DesignerCta";
import { elevationSize } from "@/components/HomeElevation";
import { elevationImageUrl, homeLabel, type DesignerPlanRef } from "@/lib/designer-link";
import { defaultSiding } from "@/lib/elevation-defaults";
import { exteriorCatalog } from "@/lib/exterior-options";
import { planElevation } from "@/lib/plan-elevation";
import { isCodeNamed } from "@/lib/page-title";

// The Design Your Home band for listing pages (the catalogue, the series hubs,
// the single/double-wide pages, the sale). One home from the page is drawn as
// the example so the band shows the tool rather than describing it; the main
// button opens the designer with the picker empty — a listing page has not
// chosen a home for the visitor — and a second link starts from the example.
//
// Server component; the picture is the cached SVG from /api/plan-elevation/image.

/**
 * The plan a page draws as its example: a named multi-section home whose
 * drawing comes from its sheet reads best (more wall, a porch, a name a
 * buyer can repeat), then any named sheet-drawn plan, then any sheet-drawn
 * plan, then whatever has a size at all.
 */
export function pickDesignerExample(plans: DesignerPlanRef[]): DesignerPlanRef | undefined {
  const fromSheet = (p: DesignerPlanRef) =>
    Boolean(p.modelNumber) && planElevation({ modelNumber: p.modelNumber, lengthFt: p.lengthFt, widthFt: p.widthFt, beds: p.beds })?.src === "sheet";
  const named = (p: DesignerPlanRef) => !isCodeNamed(p.name, p.modelNumber);
  const wide = (p: DesignerPlanRef) => (p.widthFt ?? 0) >= 20 || /multi|double|modular/i.test(p.homeType || "");
  return (
    plans.find((p) => fromSheet(p) && named(p) && wide(p)) ||
    plans.find((p) => fromSheet(p) && named(p)) ||
    plans.find(fromSheet) ||
    plans.find((p) => p.modelNumber || (p.lengthFt && p.widthFt))
  );
}

const capital = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function DesignerPromo({
  example,
  location,
  heading = "Design your home online",
  className = "",
}: {
  /** a plan from the page to draw as the example (pickDesignerExample); omit for a text-only band */
  example?: DesignerPlanRef;
  /** the GA4 cta_location value, e.g. "series_hub" */
  location: string;
  heading?: string;
  className?: string;
}) {
  const elevation = example
    ? planElevation({ modelNumber: example.modelNumber, lengthFt: example.lengthFt, widthFt: example.widthFt, beds: example.beds })
    : null;
  const size = elevation ? elevationSize(elevation, "front") : null;
  const siding = example ? defaultSiding(exteriorCatalog(example.series, example.homeType, example.widthFt)) : null;

  return (
    <section
      aria-labelledby="designer-promo"
      className={`rounded-2xl border border-[var(--color-teal)]/25 bg-white overflow-hidden ${className}`}
    >
      <div className={`grid grid-cols-1 ${example && size ? "lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]" : ""}`}>
        {example && size && siding && (
          <DesignerCta
            slug={example.slug}
            src="promo_band"
            location={`${location}_image`}
            ariaLabel={`Design ${homeLabel(example)} in your own colors`}
            className="block bg-[#eaf1f5] p-4 sm:p-6"
          >
            {/* unoptimized: an SVG from our own route, cached a day at the CDN */}
            <Image
              unoptimized
              src={elevationImageUrl(example, { siding: siding.label })}
              width={size.width}
              height={size.height}
              alt={`Front of ${homeLabel(example)} drawn in ${siding.label} siding (illustration)`}
              loading="lazy"
              className="w-full h-auto block rounded-lg border border-[var(--color-charcoal)]/10 bg-white"
            />
            <span className="block mt-2 text-[11px] text-[var(--color-charcoal)]/65">
              {capital(homeLabel(example))}, drawn in {siding.label}. Illustration; colors approximate.
            </span>
          </DesignerCta>
        )}
        <div className="p-6 sm:p-8 flex flex-col justify-center">
          <p className="text-xs font-bold tracking-[0.25em] uppercase text-[var(--color-lime-dark)] mb-3">Design Your Home</p>
          <h2 id="designer-promo" className="font-serif text-2xl lg:text-3xl font-light tracking-tight mb-3">
            {heading}
          </h2>
          <p className="text-sm text-[var(--color-gray)] leading-relaxed mb-5">
            Pick any Champion plan we sell, watch it redraw in your siding, shingle, shutter and door choices from
            Champion&rsquo;s 2026 selection boards, and send us the design for a line-item quote. No obligation, and we
            don&rsquo;t pull credit.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <DesignerCta
              src="promo_band"
              location={location}
              className="inline-flex items-center justify-center gap-2 bg-[var(--color-teal)] text-white px-7 py-3.5 text-sm font-bold tracking-wider uppercase rounded-lg hover:bg-[var(--color-teal-dark)] transition-colors"
            >
              Start designing
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M4 12h16" /></svg>
            </DesignerCta>
            {example && (
              <DesignerCta
                slug={example.slug}
                src="promo_band"
                location={`${location}_example`}
                className="inline-flex items-center justify-center text-sm font-semibold text-[var(--color-teal)] underline underline-offset-4 px-2 py-2"
              >
                Start with {homeLabel(example)}
              </DesignerCta>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
