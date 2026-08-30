import Link from "next/link";
import Image from "next/image";
import { generateMetadata as genMeta } from "@/lib/seo";
import { FadeIn } from "@/components/VisualEffects";
import { H2 } from "@/components/Heading";
import { SaleDisclaimer } from "@/components/SaleDisclaimer";
import { SalesAlertForm } from "@/components/SalesAlertForm";
import { SaleHomesGrid } from "./SaleHomesGrid";
import { AllSaleHomesTable } from "./AllSaleHomesTable";
import { saleHomes, saleListings } from "@/lib/sale-homes";
import { getSaleStatus, saleDeadlineLabel } from "@/lib/sale";

// ============================================
// HOMES ON SALE — current promotional campaign
// ============================================
// The campaign's discount, production month, and end date come from
// src/lib/sale.ts; the homes come from src/lib/sale-homes.ts. Nothing about the
// offer is hardcoded here, so the page can't drift out of sync with the terms —
// and once the end date passes it renders an honest "offer has ended" state
// instead of advertising a dead promotion.
// ============================================

// Re-render daily so the page flips itself to the expired state on the morning
// after the offer ends, without waiting for a deploy.
export const revalidate = 3600;

export function generateMetadata() {
  const sale = getSaleStatus();
  return genMeta({
    title: sale.active
      ? `${sale.name} — Up to ${sale.discountPercent}% Off Select Champion Floor Plans`
      : "Champion Floor Plans on Sale",
    description: sale.active
      ? `${sale.name}: save up to ${sale.discountPercent}% off MSRP on select new Champion floor plans. Single wide, double wide, and modular homes on sale through ${sale.endDateLabel} from Factory Direct Homes Center in Auburn, Indiana.`
      : "Featured Champion manufactured and modular homes at factory-direct pricing from Factory Direct Homes Center in Auburn, Indiana. Call for the discounts running right now.",
    keywords: [
      "manufactured homes sale",
      "champion floor plans sale",
      "champion homes discount",
      "factory direct sale",
      "mobile home clearance",
      "modular home sale",
    ],
    url: "/homes-on-sale",
  });
}

export default function HomesOnSalePage() {
  // Recomputed per render (not per build) so an ISR refresh picks up the flip.
  const sale = getSaleStatus();

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative w-full min-h-[400px] md:min-h-[450px] flex items-center">
        <div className="absolute inset-0">
          <Image
            src="/images/2026-03-22-hero-autumn.webp"
            alt="Modern manufactured home with autumn landscaping"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a365d]/95 via-[#1a365d]/80 to-[#2c7a7b]/70" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <FadeIn>
            <div className="text-center">
              {sale.active ? (
                <>
                  <div className="inline-flex items-center gap-2 bg-yellow-400 text-[#1a365d] px-4 py-1.5 rounded-full font-bold text-sm mb-4">
                    <span aria-hidden="true">🔥</span>
                    <span>LIMITED TIME OFFER</span>
                    <span aria-hidden="true">🔥</span>
                  </div>

                  <p className="text-lg md:text-xl text-white font-semibold mb-1">{sale.name}</p>
                  <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 tracking-tight">
                    UP TO {sale.discountPercent}% OFF
                  </h1>
                  <p className="text-xl md:text-2xl text-white/90 font-semibold mb-2">
                    Select New Champion Floor Plans
                  </p>
                  <p className="text-base text-white/80 max-w-xl mx-auto mb-3">
                    Save thousands on your new Champion manufactured home. Factory-direct pricing
                    just got better.
                  </p>
                  <p className="text-yellow-300 font-bold mb-2 text-sm md:text-base">
                    ⏰ {saleDeadlineLabel(sale)}
                    {sale.endingSoon && sale.daysLeft > 2 ? ` — only ${sale.daysLeft} days left` : ""}
                  </p>
                  {/* A stepped campaign should say what comes next, so the first
                      tier ending doesn't read as the whole event ending. */}
                  {sale.nextPhase && (
                    <p className="text-white/70 text-sm mb-4">
                      Then up to {sale.nextPhase.discountPercent}% off through{" "}
                      {new Date(`${sale.nextPhase.endDate}T00:00:00Z`).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        timeZone: "UTC",
                      })}
                      .
                    </p>
                  )}
                </>
              ) : (
                <>
                  <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-1.5 rounded-full font-bold text-sm mb-4">
                    <span>THIS OFFER HAS ENDED</span>
                  </div>

                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
                    Our {sale.name} Has Ended
                  </h1>
                  <p className="text-lg text-white/85 max-w-2xl mx-auto mb-3">
                    The homes below are still available to order at factory-direct pricing, and we
                    run new promotions regularly. Call or sign up below and we&rsquo;ll tell you
                    exactly what&rsquo;s discounted today.
                  </p>
                  <p className="text-white/70 font-medium mb-4 text-sm md:text-base">
                    Previous offer ended {sale.endDateLabel}
                  </p>
                </>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="#sale-homes"
                  className="inline-flex items-center justify-center px-6 py-3 bg-[#84cc16] hover:bg-[#65a30d] text-white font-bold rounded-lg transition-colors text-base"
                >
                  {sale.active ? "View Sale Homes" : "View These Homes"}
                  <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Link>
                <Link
                  href="#all-homes"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors text-base backdrop-blur-sm"
                >
                  See all {saleListings.length} prices
                </Link>
              </div>

              <div className="mt-4 flex flex-wrap justify-center gap-4 text-white/70 text-xs md:text-sm">
                {["Factory Direct", "Champion Quality", "Delivered in IN, OH & MI"].map((badge) => (
                  <span key={badge} className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Section tabs */}
      <section className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex gap-2">
          <span className="px-6 py-2 bg-[#2c7a7b] text-white rounded-full font-medium" aria-current="page">
            {sale.active ? "On Sale" : "Featured Homes"}
          </span>
          <Link
            href="/homes-on-sale/clearance"
            className="px-6 py-2 bg-white text-gray-700 border border-gray-300 rounded-full font-medium hover:bg-gray-50"
          >
            Clearance
          </Link>
        </div>
      </section>

      <div className="pt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-8">
              <H2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {sale.active ? "Homes Included in This Sale" : "Featured Champion Homes"}
              </H2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {sale.active
                  ? `A shortlist of ${saleHomes.length} — five single sections and five multi-section homes from each series, picked to span the range. Every one of our ${saleListings.length} floor plans is on sale at the same ${sale.discountPercent}% off MSRP; the full price list is below.`
                  : `A shortlist of ${saleHomes.length} across both series. All ${saleListings.length} floor plans are available to order at factory-direct pricing; the full price list is below.`}
              </p>
            </div>
          </FadeIn>
        </div>
      </div>

      <SaleHomesGrid homes={saleHomes} discountPercent={sale.discountPercent} saleActive={sale.active} />

      {/* Every home on the price sheet, not just the featured ones */}
      <section id="all-homes" className="bg-white border-t border-gray-200 py-14 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <H2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Every Floor Plan on Sale
          </H2>
          <p className="text-lg text-gray-600 max-w-3xl mb-8">
            All {saleListings.length} Champion floor plans we sell, with MSRP and
            {sale.active ? ` the ${sale.discountPercent}% ` : " "}
            {sale.active ? "sale price" : "factory-direct pricing"} for each. Every price comes
            straight from our master price sheet.
          </p>
          <AllSaleHomesTable
            listings={saleListings}
            discountPercent={sale.discountPercent}
            saleActive={sale.active}
          />
        </div>
      </section>

      {/* Terms */}
      <section className="bg-gray-100 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <SaleDisclaimer variant="full" />
          </FadeIn>
        </div>
      </section>

      {/* Sales alert */}
      <section className="py-16 bg-gradient-to-r from-[#1a365d] to-[#2c7a7b]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="text-3xl font-bold text-white mb-4">
              {sale.active ? "Don&rsquo;t Miss Out on These Savings" : "Be First to Hear About the Next Sale"}
            </h2>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto">
              Sign up for our Sales Alert and we&rsquo;ll email you when new promotions, clearance
              inventory, and exclusive factory-direct deals go live.
            </p>
            <SalesAlertForm />
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
