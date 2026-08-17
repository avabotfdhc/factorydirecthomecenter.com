import Link from "next/link";
import { ZoomableImage, LightboxGallery } from "@/components/ImageLightbox";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getApiFloorPlanBySlug } from "@/lib/api-content";
import { StructuredData, structuredData } from "@/lib/seo";
import { FAQSection } from "@/components/FAQSection";
import { commonFAQs } from "@/lib/faqs";
import { ShareListing } from "@/components/ShareListing";
import { EmailBrochureForm } from "@/components/EmailBrochureForm";
import { SpecsDisclaimer } from "@/components/SpecsDisclaimer";

const SITE = "https://factorydirecthomescenter.com";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const plan = await getApiFloorPlanBySlug(slug);
  if (!plan) return { title: "Home Not Found" };
  const desc = (
    plan.description ||
    `${plan.name}: ${plan.beds} bed, ${plan.baths} bath, ${plan.sqft.toLocaleString()} sq ft ${plan.homeType || "manufactured home"} from Factory Direct Homes Center in Auburn, IN.`
  ).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 160);
  const url = `${SITE}/floor-plans/${plan.slug}`;
  return {
    title: `${plan.name} — ${plan.beds} Bed ${plan.baths} Bath ${plan.homeType || "Home"}`,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title: `${plan.name} | Factory Direct Homes Center`,
      description: desc,
      url,
      type: "website",
      images: plan.image ? [{ url: plan.image }] : undefined,
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
  const plan = await getApiFloorPlanBySlug(slug);
  if (!plan) notFound();

  const cleanDesc = (plan.description || plan.floorPlanHtml || "")
    .replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 300) ||
    `${plan.name} ${plan.homeType} by ${plan.brand}.`;

  // Product JSON-LD (built inline because CMS images are absolute S3 URLs).
  // Google's product-snippet rules require offers, review, or aggregateRating
  // on every Product — with prices hidden ("Contact for price") we have none,
  // and price-less Product markup gets flagged in Search Console. So the
  // Product block is only emitted when a numeric price exists (i.e. it
  // returns automatically if prices are ever shown again).
  const priceNumeric = plan.price.replace(/[^0-9.]/g, "");
  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: plan.name,
    description: cleanDesc,
    ...(plan.image ? { image: plan.image } : {}),
    ...(plan.modelNumber ? { sku: plan.modelNumber } : {}),
    brand: { "@type": "Brand", name: plan.brand || "Champion Homes" },
    ...(priceNumeric
      ? {
          offers: {
            "@type": "Offer",
            price: priceNumeric,
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
            url: `${SITE}/floor-plans/${plan.slug}`,
            seller: { "@type": "LocalBusiness", name: "Factory Direct Homes Center" },
          },
        }
      : {}),
  };

  return (
    <main className="bg-[var(--color-cream)] text-[var(--color-charcoal)]">
      {priceNumeric ? <StructuredData data={productLd} /> : null}
      <StructuredData
        data={structuredData.breadcrumb([
          { name: "Home", url: "/" },
          { name: "Floor Plans", url: "/floor-plans" },
          { name: plan.name, url: `/floor-plans/${plan.slug}` },
        ])}
      />

      {/* Breadcrumb */}
      <div className="border-b border-[var(--color-charcoal)]/5 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 text-sm text-[var(--color-gray)]">
          <Link href="/floor-plans" className="hover:text-[var(--color-teal)]">Floor Plans</Link>
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
                alt={`${plan.name} ${plan.homeType || "manufactured home"} — floor plan`}
                className="absolute inset-0 w-full h-full object-cover"
                // Hero click opens the full gallery so buyers can page through
                // every photo and floor-plan sheet from the first image.
                images={plan.gallery.map((src, i) => ({ src, alt: `${plan.name} image ${i + 1}` }))}
                index={Math.max(0, plan.gallery.indexOf(plan.image))}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-[var(--color-gray-light)]">No photo</div>
            )}
          </div>

          {/* Summary */}
          <div className="flex flex-col">
            <p className="text-xs font-bold tracking-[0.25em] uppercase text-[var(--color-lime-dark)] mb-3">
              {plan.brand}{plan.series ? ` · ${plan.series}` : ""}
            </p>
            <h1 className="font-serif text-3xl lg:text-5xl font-light tracking-tight mb-3">{plan.name}</h1>
            {plan.modelNumber && (
              <p className="text-sm text-[var(--color-gray)] mb-6">Model {plan.modelNumber}</p>
            )}

            <div className="mb-8">
              <div className="text-2xl font-bold text-[var(--color-lime-dark)]">{plan.priceFrom || plan.price}</div>
              {plan.priceFrom && (
                <p className="text-sm text-[var(--color-gray)] mt-1">
                  Final price depends on options and delivery — we quote line-item, so you see exactly what you pay.{" "}
                  <Link href="/financing#calculator" className="text-[var(--color-teal)] underline underline-offset-4">
                    Estimate monthly payments
                  </Link>
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

            <div className="flex flex-wrap gap-3">
              <Link
                href={`/design-your-home?home=${encodeURIComponent(plan.slug)}`}
                className="inline-flex items-center justify-center bg-[var(--color-teal)] text-white px-7 py-3.5 text-sm font-bold tracking-wider uppercase rounded-lg hover:bg-[var(--color-teal-dark)] transition-colors"
              >
                Design This Home
              </Link>
              <Link
                href={`/contact-us?home=${encodeURIComponent(plan.name)}`}
                className="inline-flex items-center justify-center border-2 border-[var(--color-teal)]/30 text-[var(--color-teal)] px-7 py-3.5 text-sm font-bold tracking-wider uppercase rounded-lg hover:bg-[var(--color-teal)]/5 transition-colors"
              >
                Get a Quote
              </Link>
              <Link
                href={`/contact-us?home=${encodeURIComponent(plan.name)}&visit=1`}
                className="inline-flex items-center justify-center bg-[var(--color-lime)] text-[var(--color-charcoal)] px-7 py-3.5 text-sm font-bold tracking-wider uppercase rounded-lg hover:bg-[var(--color-lime-dark)] hover:text-white transition-colors"
              >
                Schedule a Lot Visit
              </Link>
              <a
                href="tel:+12603081457"
                className="inline-flex items-center justify-center border-2 border-[var(--color-charcoal)]/15 px-7 py-3.5 text-sm font-bold tracking-wider uppercase rounded-lg hover:bg-[var(--color-charcoal)]/5 transition-colors"
              >
                Call (260) 308-1457
              </a>
              {plan.virtualTour && (
                <a
                  href={plan.virtualTour}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center border-2 border-[var(--color-teal)]/30 text-[var(--color-teal)] px-7 py-3.5 text-sm font-bold tracking-wider uppercase rounded-lg hover:bg-[var(--color-teal)]/5 transition-colors"
                >
                  3D Virtual Tour
                </a>
              )}
              {plan.brochureUrl && (
                <a
                  href={plan.brochureUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center text-sm font-medium text-[var(--color-teal)] underline underline-offset-4 px-2 py-3.5"
                >
                  Download brochure (PDF)
                </a>
              )}
            </div>

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
              images={plan.gallery.map((src, i) => ({ src, alt: `${plan.name} image ${i + 1}` }))}
              gridClassName="grid grid-cols-2 md:grid-cols-3 gap-4"
              imgClassName="w-full aspect-[4/3] rounded-xl border border-[var(--color-charcoal)]/8 bg-white object-cover"
            />
          </div>
        )}

        {/* Description */}
        {plan.floorPlanHtml && (
          <div className="mt-14 max-w-3xl">
            <h2 className="font-serif text-2xl font-light mb-5">About this home</h2>
            <div
              className="prose-fdhc text-[var(--color-charcoal)]/80 leading-relaxed [&_p]:mb-4 [&_h2]:font-serif [&_h3]:font-serif [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-1"
              dangerouslySetInnerHTML={{ __html: plan.floorPlanHtml }}
            />
          </div>
        )}
      </section>

      {/* FAQ (adds FAQPage schema) */}
      <FAQSection
        title="Common Questions"
        subtitle="Financing, delivery, and placement for your new home"
        faqs={commonFAQs.homepage.slice(0, 6)}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-10">
        <SpecsDisclaimer />
      </div>
    </main>
  );
}
