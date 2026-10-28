import Image from "next/image";
import { DesignerCta } from "@/components/DesignerCta";
import { elevationSize } from "@/components/HomeElevation";
import { elevationImageUrl, homeLabel, type DesignerPlanRef } from "@/lib/designer-link";
import { showcaseSidings } from "@/lib/elevation-defaults";
import { exteriorCatalog } from "@/lib/exterior-options";
import { planElevation } from "@/lib/plan-elevation";

// The plan page's "Design this home" teaser: the home itself, drawn from its
// sheet in a starting colour, three more colours beside it, and one button
// into the designer with this plan preselected. Buyers who have just looked
// at the photos get to see *this* house in their colours, which is what the
// Design Your Home tool does best, and the quote it ends in is the lead.
//
// Server component. The pictures are <img>s served by
// /api/plan-elevation/image (cached a day at the CDN), so a plan page's HTML
// grows by a few hundred bytes rather than by four inline SVGs; width and
// height come from elevationSize() so nothing shifts when they arrive. A plan
// with no readable size at all still gets the button, just no picture.

export function DesignThisHome({ plan, className = "" }: { plan: DesignerPlanRef; className?: string }) {
  const catalog = exteriorCatalog(plan.series, plan.homeType, plan.widthFt);
  const sidings = showcaseSidings(catalog, 4);
  const [first, ...more] = sidings;
  const elevation = planElevation({
    modelNumber: plan.modelNumber,
    lengthFt: plan.lengthFt,
    widthFt: plan.widthFt,
    beds: plan.beds,
  });
  const size = elevation ? elevationSize(elevation, "front") : null;
  const isPrime = catalog.series === "prime";
  const words = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
  const count = (n: number) => words[n] ?? String(n);
  const picks = isPrime
    ? `Champion’s ${count(catalog.siding.length)} Prime siding colors and ${count(catalog.shutters.length)} shutter colors`
    : `${count(catalog.siding.length)} siding colors, shingles, shutters or lineals, the front door, a shake gable accent${catalog.dormers.length ? ", dormers" : ""} and more on Champion’s 2026 Aspire board`;

  return (
    <section
      aria-labelledby="design-this-home"
      className={`rounded-2xl border border-[var(--color-teal)]/25 bg-white overflow-hidden shadow-[0_8px_30px_-18px_rgba(0,0,0,.35)] ${className}`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        {/* The picture, then the other colours it comes in */}
        <div className="bg-[#eaf1f5] p-4 sm:p-6 flex flex-col gap-4">
          {elevation && size ? (
            <DesignerCta
              slug={plan.slug}
              siding={first.label}
              src="plan_page"
              location="floor_plan_detail_teaser_image"
              ariaLabel={`Design ${homeLabel(plan)} in your own colors`}
              className="block rounded-xl overflow-hidden border border-[var(--color-charcoal)]/10 bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-teal)]"
            >
              {/* unoptimized: an SVG from our own route, already cached a day at the CDN;
                  the optimiser would only add a transform and cannot resize an SVG anyway */}
              <Image
                unoptimized
                src={elevationImageUrl(plan, { siding: first.label })}
                width={size.width}
                height={size.height}
                alt={`Front of ${homeLabel(plan)} drawn in ${first.label} siding (illustration)`}
                loading="lazy"
                decoding="async"
                className="w-full h-auto block"
              />
            </DesignerCta>
          ) : null}

          {elevation && size && more.length > 0 && (
            <ul className="grid grid-cols-3 gap-3" aria-label={`${homeLabel(plan)} in other standard siding colors`}>
              {more.map((s) => (
                <li key={s.label}>
                  <DesignerCta
                    slug={plan.slug}
                    siding={s.label}
                    src="plan_page_swatch"
                    location="floor_plan_detail_teaser_swatch"
                    ariaLabel={`Design ${homeLabel(plan)} in ${s.label} siding`}
                    className="group block rounded-lg overflow-hidden border border-[var(--color-charcoal)]/10 bg-white hover:border-[var(--color-teal)]/60 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-teal)]"
                  >
                    <Image
                      unoptimized
                      src={elevationImageUrl(plan, { siding: s.label })}
                      width={size.width}
                      height={size.height}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="w-full h-auto block"
                    />
                    <span className="flex items-center gap-2 px-2.5 py-1.5 text-[11px] font-semibold text-[var(--color-charcoal)]/80 group-hover:text-[var(--color-teal)]">
                      <span className="inline-block w-3 h-3 rounded-full border border-black/15" style={{ backgroundColor: s.hex }} aria-hidden="true" />
                      {s.label}
                    </span>
                  </DesignerCta>
                </li>
              ))}
            </ul>
          )}

          {elevation && (
            <p className="text-[11px] leading-relaxed text-[var(--color-charcoal)]/65">
              {elevation.src === "sheet"
                ? "Illustration drawn from Champion’s floor plan sheet for this model: windows and doors sit where the plan puts them."
                : "Illustration: we don’t have this model’s drawing on file, so window placement is typical for a home this size."}{" "}
              Colors are approximate; the foundation, steps and landscaping are site work by your contractor.
            </p>
          )}
        </div>

        {/* The ask */}
        <div className="p-6 sm:p-8 flex flex-col justify-center">
          <p className="text-xs font-bold tracking-[0.25em] uppercase text-[var(--color-lime-dark)] mb-3">Design Your Home</p>
          <h2 id="design-this-home" className="font-serif text-2xl lg:text-3xl font-light tracking-tight mb-3">
            See {homeLabel(plan)} in <span className="italic text-[var(--color-teal)]">your</span> colors
          </h2>
          <p className="text-sm text-[var(--color-gray)] leading-relaxed mb-5">
            Pick from {picks} and watch this home redraw as you click. Send us the design and we price it line by
            line &mdash; the home, your options and delivery &mdash; so you see exactly what you&rsquo;d pay.
          </p>
          <DesignerCta
            slug={plan.slug}
            src="plan_page"
            location="floor_plan_detail_teaser"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto sm:self-start bg-[var(--color-teal)] text-white px-8 py-4 text-sm font-bold tracking-wider uppercase rounded-lg hover:bg-[var(--color-teal-dark)] transition-colors"
          >
            Design This Home
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M4 12h16" />
            </svg>
          </DesignerCta>
          <p className="text-xs text-[var(--color-gray)] mt-3">
            About two minutes. No obligation, and we don&rsquo;t pull credit.
          </p>
        </div>
      </div>
    </section>
  );
}
