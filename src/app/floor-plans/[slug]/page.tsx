import Link from "next/link";
import { ZoomableImage, LightboxGallery } from "@/components/ImageLightbox";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getApiFloorPlanBySlug } from "@/lib/api-content";
import { StructuredData, structuredData } from "@/lib/seo";
import { FAQSection } from "@/components/FAQSection";
import { commonFAQs } from "@/lib/faqs";

const SITE = "https://factorydirecthomescenter.com";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const plan = await getApiFloorPlanBySlug(slug);
  if (!plan) return { title: "Home Not Found | Factory Direct Homes Center" };
  const desc = (
    plan.description ||
    `${plan.name}: ${plan.beds} bed, ${plan.baths} bath, ${plan.sqft.toLocaleString()} sq ft ${plan.homeType || "manufactured home"} from Factory Direct Homes Center in Auburn, IN.`
  ).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 160);
  const url = `${SITE}/floor-plans/${plan.slug}`;
  return {
    title: `${plan.name} — ${plan.beds} Bed ${plan.baths} Bath ${plan.homeType || "Home"} | Factory Direct Homes Center`,
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

  // Product JSON-LD (built inline because CMS images are absolute S3 URLs)
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
      <StructuredData data={productLd} />
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
              <ZoomableImage src={plan.image} alt={`${plan.name} ${plan.homeType || "manufactured home"} — floor plan`} className="absolute inset-0 w-full h-full object-cover" />
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

            <div className="text-2xl font-bold text-[var(--color-lime-dark)] mb-8">{plan.price}</div>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 py-6 border-y border-[var(--color-charcoal)]/8 mb-8">
              <Spec label="Sq Ft" value={plan.sqft ? plan.sqft.toLocaleString() : "—"} />
              <Spec label="Beds" value={String(plan.beds || "—")} />
              <Spec label="Baths" value={String(plan.baths || "—")} />
              {plan.width && <Spec label="Width" value={plan.width} />}
              {plan.length && <Spec label="Length" value={plan.length} />}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={`/contact-us?home=${encodeURIComponent(plan.name)}`}
                className="inline-flex items-center justify-center bg-[var(--color-teal)] text-white px-7 py-3.5 text-sm font-bold tracking-wider uppercase rounded-lg hover:bg-[var(--color-teal-dark)] transition-colors"
              >
                Get a Quote
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
    </main>
  );
}
