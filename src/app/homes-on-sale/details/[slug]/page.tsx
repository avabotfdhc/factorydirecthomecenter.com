import Link from "next/link";
import { ZoomableImage } from "@/components/ImageLightbox";
import { notFound } from "next/navigation";
import { generateMetadata as genMeta } from "@/lib/seo";
import { FadeIn } from "@/components/VisualEffects";
import { SaleClaimForm } from "@/components/SaleClaimForm";
import { SaleDisclaimer } from "@/components/SaleDisclaimer";
import { getSaleHome, saleHomes } from "@/lib/sale-homes";
import { formatUsd, PriceTriple, PricingDisclaimer } from "@/components/Pricing";
import { getSaleStatus, saleDeadlineLabel, salePriceFor } from "@/lib/sale";
import { SHOW_SALE_PRICES } from "@/lib/price-visibility";

// ============================================
// SALE HOME DETAIL PAGE
// ============================================
// Homes come from src/lib/sale-homes.ts and the offer terms from
// src/lib/sale.ts, so this page can never advertise a discount or an expiry
// the sale page and the terms don't agree with. Pre-rendered for every sale
// home, and revalidated hourly so it flips to the post-sale wording on its own
// once the offer ends.
// ============================================

// Five minutes, for the same reason as the sale index: these pages carry the
// campaign name and rate, which turn over at midnight Eastern.
export const revalidate = 300;

export function generateStaticParams() {
  return saleHomes.map((home) => ({ slug: home.id }));
}

// Generate metadata for the page
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const home = getSaleHome(slug);
  const sale = getSaleStatus();

  if (!home) {
    return genMeta({
      title: "Home Not Found",
      description: "The requested home could not be found.",
      url: "/homes-on-sale",
    });
  }

  return genMeta({
    title: sale.active
      ? `${home.name} — Up to ${sale.discountPercent}% Off MSRP`
      : `${home.name} — Champion Home`,
    // A price only appears here when MSRP, sale price and savings can all be
    // stated together — the same all-or-nothing rule the page itself follows.
    description: `${home.name} — ${home.sqft} sq ft, ${home.beds} bed, ${home.baths} bath Champion home. ${
      SHOW_SALE_PRICES && sale.active
        ? `MSRP ${formatUsd(home.msrp)}, sale price ${formatUsd(
            salePriceFor(home.msrp, sale.discountPercent),
          )} — save ${formatUsd(
            home.msrp - salePriceFor(home.msrp, sale.discountPercent),
          )} during the ${sale.name}.`
        : "Call for pricing."
    }`,
    url: `/homes-on-sale/details/${home.id}`,
  });
}

export default async function SaleHomeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const home = getSaleHome(slug);

  if (!home) {
    notFound();
  }

  const sale = getSaleStatus();
  const galleryImages = home.gallery.map((src, i) => ({
    src,
    alt: `${home.name} — image ${i + 1} of ${home.gallery.length}`,
  }));

  return (
    <main className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-[#2c7a7b]">Home</Link>
            <span>/</span>
            <Link href="/homes-on-sale" className="hover:text-[#2c7a7b]">On Sale</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{home.name}</span>
          </nav>
        </div>
      </div>

      {/* Sale banner — only while the offer is actually live */}
      {sale.active && (
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="font-bold text-lg">
              🔥 {sale.name}: save up to {sale.discountPercent}% off select new Champion floor plans! 🔥
            </p>
            <p className="text-sm text-white/90">{saleDeadlineLabel(sale)}</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Image */}
          <FadeIn>
            <div className="relative">
              {sale.active && (
                <div className="absolute top-4 left-4 z-10 bg-red-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                  {sale.discountPercent}% OFF
                </div>
              )}
              
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 shadow-lg">
                {home.image ? (
                  <ZoomableImage
                    src={home.image}
                    alt={`${home.name} — ${home.sqft} sq ft Champion ${home.homeType.toLowerCase()} on sale`}
                    className="absolute inset-0 w-full h-full object-cover"
                    // Every published photograph and floor-plan sheet for this
                    // home, so the hero opens the whole set rather than itself.
                    images={galleryImages}
                    index={0}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    Photography for this plan is on the way — call for photos and the floor plan.
                  </div>
                )}
              </div>

              {/* The rest of the gallery. Champion publishes the floor-plan
                  sheet alongside the photographs, so this is where a buyer
                  finds the plan drawing without leaving the sale page. */}
              {home.gallery.length > 1 && (
                <ul className="mt-3 grid grid-cols-4 gap-2">
                  {home.gallery.slice(1, 9).map((src, i) => (
                    <li key={src} className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
                      <ZoomableImage
                        src={src}
                        alt={`${home.name} — photo ${i + 2} of ${home.gallery.length}`}
                        className="absolute inset-0 w-full h-full object-cover"
                        images={galleryImages}
                        index={i + 1}
                      />
                    </li>
                  ))}
                </ul>
              )}

              <p className="mt-3 text-sm text-gray-500">
                {home.gallery.length > 1
                  ? `Tap any photo to enlarge — ${home.gallery.length} images including the floor-plan sheet.`
                  : "Tap the photo to enlarge."}
              </p>

              {/* Everything else Champion publishes for this plan. */}
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium">
                {home.slug && (
                  <Link href={`/floor-plans/${home.slug}`} className="text-[#2c7a7b] hover:underline">
                    Full floor plan &amp; specifications →
                  </Link>
                )}
                {home.floorPlanUrl && (
                  <a
                    href={home.floorPlanUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#2c7a7b] hover:underline"
                  >
                    Floor plan sheet (PDF) →
                  </a>
                )}
                {home.virtualTour && (
                  <a
                    href={home.virtualTour}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#2c7a7b] hover:underline"
                  >
                    3D walkthrough →
                  </a>
                )}
                {home.brochureUrl && (
                  <a
                    href={home.brochureUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#2c7a7b] hover:underline"
                  >
                    Champion brochure (PDF) →
                  </a>
                )}
                <Link href="/floor-plans" className="text-gray-500 hover:underline">
                  Browse the full catalog
                </Link>
              </div>
            </div>
          </FadeIn>

          {/* Right Column - Details */}
          <FadeIn delay={0.2}>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {home.name}
              </h1>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
                <span>Series: {home.series}</span>
                <span>Model: {home.modelNo}</span>
              </div>

              {/* Quick Specs */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-[#2c7a7b]">{home.sqft}</p>
                  <p className="text-xs text-gray-500">Sq. Ft</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-[#2c7a7b]">{home.beds}</p>
                  <p className="text-xs text-gray-500">Beds</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-[#2c7a7b]">{home.baths}</p>
                  <p className="text-xs text-gray-500">Baths</p>
                </div>
              </div>

              {/* Dimensions */}
              <div className="flex gap-6 text-gray-600 mb-6 pb-6 border-b">
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  Size: {home.size}
                </span>

              </div>

              {/* All three figures, or nothing — see components/Pricing */}
              <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-xl mb-6 border border-red-100">
                {sale.active && (
                  <p className="text-sm text-red-600 font-semibold mb-2">
                    {sale.name.toUpperCase()} — SAVE UP TO {sale.discountPercent}% OFF MSRP
                  </p>
                )}
                <PriceTriple
                  msrp={home.msrp}
                  salePrice={sale.active ? salePriceFor(home.msrp, sale.discountPercent) : undefined}
                  size="lg"
                />
                <p className="text-sm text-gray-500 mt-3">
                  Home only. Delivery, setup, site work, taxes and options are quoted separately,
                  line by line. Call (260) 308-1457 for a written quotation.
                </p>
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-6">{home.description}</p>

              {/* Features — only where someone has written real copy */}
              {home.features && home.features.length > 0 && (
                <div className="mb-6">
                  <h2 className="font-bold text-gray-900 mb-3">Key Features</h2>
                  <ul className="space-y-2">
                    {home.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-gray-600">
                        <svg className="w-5 h-5 text-[#84cc16]" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact-us"
                  className="flex-1 text-center py-4 bg-[#84cc16] hover:bg-[#65a30d] text-white font-bold rounded-lg transition-colors"
                >
                  Get This Deal
                </Link>
                <a
                  href="tel:2603081457"
                  className="flex-1 text-center py-4 bg-[#2c7a7b] hover:bg-[#1a365d] text-white font-bold rounded-lg transition-colors"
                >
                  Call (260) 308-1457
                </a>
              </div>

              {/* Download Brochure */}
              <div className="mt-4 text-center">
                <a
                  href="https://factory-direct-homescenter.s3.us-east-1.amazonaws.com/brochure/Perfect%20Options%20Brochure%202024.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#2c7a7b] hover:text-[#1a365d] font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Brochure
                </a>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Terms — shared components so wording, expiry and pricing terms can't drift */}
        <div className="mt-12 space-y-6">
          <SaleDisclaimer variant="full" />
          <PricingDisclaimer variant="full" />
        </div>
      </div>

      {/* Lead Form Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
                {sale.active ? `Claim This ${sale.discountPercent}% Off Deal` : "Request a Quote on This Home"}
              </h2>
              <p className="text-center text-gray-600 mb-8">
                Fill out the form below and our team will contact you within one business day
                about the {home.name}.
              </p>

              <SaleClaimForm homeName={home.name} />
            </div>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
