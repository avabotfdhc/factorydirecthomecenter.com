import Link from "next/link";
import { ZoomableImage, LightboxGallery } from "@/components/ImageLightbox";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getApiFloorPlanBySlug, getApiFloorPlans } from "@/lib/api-content";
import { StructuredData } from "@/lib/seo";
import { buildPlanGraph } from "@/lib/plan-schema";
import { FAQSection } from "@/components/FAQSection";
import { PlanNarrative } from "@/components/PlanNarrative";
import { buildPlanNarrative, planTypeLabel } from "@/lib/plan-content";
import { ShareListing } from "@/components/ShareListing";
import { EmailBrochureForm } from "@/components/EmailBrochureForm";
import { FloorPlanActions } from "@/components/QuoteModal";
import { CurrentHome } from "@/lib/current-home";
import { SpecsDisclaimer } from "@/components/SpecsDisclaimer";
import { PlanVideo } from "@/components/PlanVideo";
import { absoluteImageUrl, planImageAlt } from "@/lib/image-alt";
import { isCodeNamed, planTitle } from "@/lib/page-title";

const SITE = "https://factorydirecthomescenter.com";

/** "28'" or "28" → 28; anything else → undefined. */
const feet = (raw: string): number | undefined => {
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : undefined;
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  // A CMS failure is deliberately NOT swallowed here (see the render below):
  // only a resolved `null` means the home does not exist.
  const plan = await getApiFloorPlanBySlug(slug);
  if (!plan) return { title: "Home Not Found" };
  const desc = (
    plan.description ||
    `${plan.name}: ${plan.beds} bed, ${plan.baths} bath, ${plan.sqft.toLocaleString()} sq ft ${plan.homeType || "manufactured home"} from Factory Direct Homes Center in Auburn, IN.`
  ).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 160);
  const url = `${SITE}/floor-plans/${plan.slug}`;
  const heroAlt = planImageAlt(plan.image, plan.name, plan.homeType, 0, 1);
  // "Thornton — 3 Bed 2 Bath Champion Double Wide Home, Auburn IN": the
  // brand, the home type as people search for it, and the place. Absolute,
  // because the layout's "| Factory Direct Homes" suffix pushed every plan
  // title to ~90 characters; planTitle() drops the optional words until it
  // fits in 65 (src/lib/page-title.ts).
  const title = planTitle(plan.name, plan.beds, plan.baths, planTypeLabel(plan), {
    modelNumber: plan.modelNumber,
    widthFt: plan.widthFt ?? feet(plan.width),
    lengthFt: feet(plan.length),
  });
  const shareImage = plan.image ? [{ url: absoluteImageUrl(plan.image), alt: heroAlt }] : undefined;
  return {
    title: { absolute: title },
    description: desc,
    alternates: { canonical: url },
    // The share card (Facebook, Messenger, X, iMessage) carries the same
    // descriptive title as the search result. It used to be
    // "1676H32107 | Factory Direct Homes Center", which for the 42 code-named
    // singles said nothing about the home. The brand rides on og:site_name —
    // this block REPLACES the layout's openGraph rather than merging with it,
    // so the site name has to be restated here or the card loses it.
    openGraph: {
      title,
      description: desc,
      url,
      siteName: "Factory Direct Homes Center",
      type: "website",
      images: shareImage,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: shareImage,
    },
  };
}

// ISR: each floor plan renders on first request and caches for 5 min — CMS edits
// appear without a redeploy, and the API is only hit on cache miss/revalidate.
export const revalidate = 300;

const Spec = ({ label, value }: { label: string; value: string }) => (
  <div className="text-center">
    <div className="font-serif text-2xl font-semibold text-[var(--color-teal)]">{value}</div>
    <div className="text-xs tracking-[0.15em] uppercase text-[var(--color-gray)] mt-1">{label}</div>
  </div>
);

export default async function FloorPlanDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // A transient CMS failure must NOT become a 404. This used to catch every
  // error and call notFound(), which told visitors (and Google) that a real
  // home did not exist, and Next then cached that 404 for the revalidate
  // window. getApiFloorPlanBySlug already distinguishes the two: it returns
  // null only when the slug genuinely is not in the catalogue, and throws when
  // it could not find out. The read itself now retries and falls back to the
  // last good response (src/lib/resilient-fetch.ts), so reaching this throw
  // means Supabase was unreachable for several seconds with nothing cached —
  // an error page that heals on refresh, not a wrong 404.
  const plan = await getApiFloorPlanBySlug(slug);
  if (!plan) notFound();

  // The rest of the catalogue, for the HUD/modular twin, the same box in
  // another series, and comparable homes (same 5-minute cache as the page).
  const allPlans = await getApiFloorPlans().catch(() => []);
  const narrative = buildPlanNarrative(plan, allPlans);
  const seriesCrumb = narrative.hub ? [{ name: `${narrative.hub.name} Series`, url: `/series/${narrative.hub.slug}` }] : [];

  const heroAlt = planImageAlt(plan.image, plan.name, plan.homeType, 0, 1);
  const galleryImages = plan.gallery.map((src, i) => ({
    src,
    alt: planImageAlt(src, plan.name, plan.homeType, i, plan.gallery.length),
  }));

  return (
    <div className="bg-[var(--color-cream)] text-[var(--color-charcoal)]">
      {/* One ld+json block for the whole page: the home (Product +
          SingleFamilyResidence, with an Offer once a price is shown),
          its breadcrumb trail, its FAQs and the WebPage tying them together.
          src/lib/plan-schema.ts explains the price gate. */}
      <StructuredData data={buildPlanGraph({ plan, narrative })} />

      {/* Breadcrumb */}
      <div className="border-b border-[var(--color-charcoal)]/5 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 text-sm text-[var(--color-gray)]">
          <Link href="/floor-plans" className="hover:text-[var(--color-teal)]">Floor Plans</Link>
          {seriesCrumb.map((c) => (
            <span key={c.url}>
              <span className="mx-2 text-[var(--color-gray-light)]">/</span>
              <Link href={c.url} className="hover:text-[var(--color-teal)]">{c.name}</Link>
            </span>
          ))}
          <span className="mx-2 text-[var(--color-gray-light)]">/</span>
          <span className="text-[var(--color-charcoal)] font-medium">{plan.name}</span>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          {/* Image */}
          <div className="rounded-2xl overflow-hidden border border-[var(--color-charcoal)]/8 bg-white aspect-[16/11] relative">
            {plan.image ? (
              <ZoomableImage
                src={plan.image}
                alt={heroAlt}
                // A rendered sales sheet (the only image for plans without
                // photos) is shown whole; photos fill the frame.
                className={`absolute inset-0 w-full h-full ${plan.floorPlanImage && plan.image === plan.floorPlanImage ? "object-contain p-3 bg-slate-50" : "object-cover"}`}
                // Hero click opens the full gallery so buyers can page through
                // every photo and floor-plan sheet from the first image.
                images={galleryImages}
                index={Math.max(0, plan.gallery.indexOf(plan.image))}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-[var(--color-gray)]">No photo</div>
            )}
          </div>

          {/* Summary */}
          <div className="flex flex-col">
            <p className="text-xs font-bold tracking-[0.25em] uppercase text-[var(--color-lime-dark)] mb-3">
              {plan.brand}{plan.series ? ` · ${plan.series}` : ""}
            </p>
            <h1 className="font-serif text-3xl lg:text-5xl font-light tracking-tight mb-3">{plan.name}</h1>
            {/* A code-named plan already shows its model number as the H1. */}
            {plan.modelNumber && !isCodeNamed(plan.name, plan.modelNumber) && (
              <p className="text-sm text-[var(--color-gray)] mb-6">Model {plan.modelNumber}</p>
            )}

            <div className="mb-8">
              <div className="text-2xl font-bold text-[var(--color-lime-dark)]">{plan.priceFrom || plan.price}</div>
              {plan.priceFrom ? (
                <p className="text-sm text-[var(--color-gray)] mt-1">
                  Final price depends on options and delivery — we quote line-item, so you see exactly what you pay.{" "}
                  <Link href="/financing#calculator" className="text-[var(--color-teal)] underline underline-offset-4">
                    Estimate monthly payments
                  </Link>
                </p>
              ) : (
                <p className="text-sm text-[var(--color-gray)] mt-1">
                  We quote line-item — home, delivery, setup and site work priced separately.{" "}
                  <a href="tel:+12603081457" className="text-[var(--color-teal)] underline underline-offset-4">
                    Call (260) 308-1457
                  </a>{" "}
                  for this plan&rsquo;s price, or{" "}
                  <Link href="/homes-on-sale" className="text-[var(--color-teal)] underline underline-offset-4">
                    see what&rsquo;s on sale
                  </Link>
                  .
                </p>
              )}
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 py-6 border-y border-[var(--color-charcoal)]/8 mb-8">
              <Spec label="Sq Ft" value={plan.sqft ? plan.sqft.toLocaleString() : "—"} />
              <Spec
                label="Beds"
                value={(() => {
                  const lo = Math.min(plan.bedsMin ?? plan.beds, plan.beds);
                  const hi = Math.max(plan.bedsMax ?? plan.beds, plan.beds);
                  return lo < hi ? `${lo}–${hi}` : String(plan.beds || "—");
                })()}
              />
              <Spec label="Baths" value={String(plan.baths || "—")} />
              {plan.width && <Spec label="Width" value={plan.width} />}
              {plan.length && <Spec label="Length" value={plan.length} />}
            </div>

            {plan.flexNote && (
              <p className="flex items-start gap-2.5 -mt-4 mb-8 text-sm text-[var(--color-charcoal)]/75 bg-[var(--color-lime)]/15 border border-[var(--color-lime)]/40 rounded-lg px-4 py-3">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-[var(--color-lime-dark)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
                <span><strong>{plan.bedsMin !== undefined || plan.bedsMax !== undefined ? "Flexible bedrooms" : "Factory option"}:</strong> {plan.flexNote}</span>
              </p>
            )}

            {/* Tells the layout's sticky mobile bar which home this page is
                about, so its quote carries the plan instead of "Direct
                Inquiry". */}
            <CurrentHome name={plan.name} series={plan.series} />

            <FloorPlanActions
              homeName={plan.name}
              slug={plan.slug}
              virtualTour={plan.virtualTour}
              floorPlanUrl={plan.floorPlanUrl}
              brochureUrl={plan.brochureUrl}
            />

            {plan.documents && plan.documents.length > 1 && (
              <div className="mt-6">
                <h2 className="text-xs font-bold tracking-widest uppercase text-[var(--color-gray)] mb-2">
                  Floor plan sheets from Champion
                </h2>
                <ul className="divide-y divide-[var(--color-charcoal)]/10 border-y border-[var(--color-charcoal)]/10">
                  {plan.documents.map((d) => (
                    <li key={d.url}>
                      <a
                        href={d.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-4 py-2.5 text-sm text-[var(--color-teal)] hover:underline underline-offset-4"
                      >
                        <span>{d.title}</span>
                        <span className="text-xs text-[var(--color-gray)]">PDF</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <EmailBrochureForm homeName={plan.name} modelNumber={plan.modelNumber || undefined} />

            <ShareListing
              name={plan.name}
              url={`${SITE}/floor-plans/${plan.slug}`}
              summary={`${plan.bedsMin !== undefined || plan.bedsMax !== undefined ? `${Math.min(plan.bedsMin ?? plan.beds, plan.beds)}–${Math.max(plan.bedsMax ?? plan.beds, plan.beds)}` : plan.beds} bed, ${plan.baths} bath, ${plan.sqft.toLocaleString()} sq ft ${plan.homeType || "manufactured home"}.`}
            />
          </div>
        </div>

        {/* Gallery */}
        {plan.gallery.length > 1 && (
          <div className="mt-14">
            <h2 className="font-serif text-2xl font-light mb-6">Gallery &amp; Floor Plan</h2>
            <LightboxGallery
              images={galleryImages}
              gridClassName="grid grid-cols-2 md:grid-cols-3 gap-4"
              imgClassName="w-full aspect-[4/3] rounded-xl border border-[var(--color-charcoal)]/8 bg-white object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 400px"
            />
          </div>
        )}

        {/* The plan's video tour, when DealerTide/Champion has one (floor_plans.video_url). */}
        <PlanVideo videoUrl={plan.videoUrl} planName={plan.name} />

        {/* Hand-written description from /admin (floor_plans.floor_plan_html),
            or Champion's spec-sheet extras for the single-wides the factory
            literature covers. Renders above the generated narrative so real
            copy wins. */}
        {plan.floorPlanHtml && (
          <div className="mt-14 max-w-3xl">
            <h2 className="font-serif text-2xl font-light mb-5">About this home</h2>
            <div
              className="prose-fdhc text-[var(--color-charcoal)]/80 leading-relaxed [&_p]:mb-4 [&_h2]:font-serif [&_h3]:font-serif [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-1"
              dangerouslySetInnerHTML={{ __html: plan.floorPlanHtml }}
            />
          </div>
        )}

        {/* Plan-specific narrative, twin/series callouts, comparable homes,
            guides and delivery areas (src/lib/plan-content.ts). */}
        <PlanNarrative narrative={narrative} planName={plan.name} planSlug={plan.slug} />
      </section>

      {/* FAQ (FAQPage schema is in the page graph) — questions and answers are about THIS plan,
          not the six homepage questions every other page used to repeat. */}
      <FAQSection
        title={`${plan.name}: Common Questions`}
        subtitle="Size, construction, delivery, placement and pricing for this home"
        faqs={narrative.faqs}
        // The FAQPage node is in the page graph above; a second block here
        // would publish the same questions twice.
        showSchema={false}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-10">
        <SpecsDisclaimer />
      </div>
    </div>
  );
}
