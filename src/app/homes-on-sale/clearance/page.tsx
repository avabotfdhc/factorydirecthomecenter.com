import Link from "next/link";
import { generateMetadata as genMeta } from "@/lib/seo";
import { FadeIn } from "@/components/VisualEffects";
import { SalesAlertForm } from "@/components/SalesAlertForm";
import { getSaleStatus } from "@/lib/sale";

// This page prints the running discount rate ("View 25% Off Sale"), so it
// cannot be a build-time static page: it froze at the deploy that built it and
// went on advertising the Summer event's 25% after that event ended and the
// Fall event started at 20%. Five minutes, matching the homepage, so a campaign
// that turns over at midnight is right within minutes rather than at the mercy
// of the next deploy.
export const revalidate = 300;

export const metadata = genMeta({
  title: "Clearance Homes",
  description: "Shop clearance manufactured homes at Factory Direct Homes Center. Last chance pricing on select inventory. Single wide, double wide, and modular homes.",
  url: "/homes-on-sale/clearance",
});

export default function ClearancePage() {
  const sale = getSaleStatus();

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Clearance Inventory
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Last chance pricing on select homes. Once they're gone, they're gone!
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex gap-2">
            <Link
              href="/homes-on-sale"
              className="px-6 py-2 bg-white text-gray-700 border border-gray-300 rounded-full font-medium hover:bg-gray-50"
            >
              On Sale
            </Link>
            <Link
              href="/homes-on-sale/clearance"
              className="px-6 py-2 bg-[#2c7a7b] text-white rounded-full font-medium"
            >
              Clearance
            </Link>
          </div>
        </div>
      </section>

      {/* Empty State */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              No Clearance Inventory at This Time
            </h2>
            <p className="text-gray-600 mb-8 max-w-lg mx-auto">
              Our clearance inventory moves fast! {sale.active ? "Check out our current " : "See our "}
              <Link href="/homes-on-sale" className="text-[#2c7a7b] hover:underline font-medium">
                {sale.active ? `${sale.discountPercent}% off sale` : "featured homes"}
              </Link>{" "}
              for the best deals on new Champion homes, or browse our full{" "}
              <Link href="/floor-plans" className="text-[#2c7a7b] hover:underline font-medium">floor plan collection</Link>.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/homes-on-sale"
                className="inline-flex items-center justify-center px-8 py-3 bg-[#2c7a7b] hover:bg-[#1a365d] text-white font-semibold rounded-lg transition-colors"
              >
                {sale.active ? `View ${sale.discountPercent}% Off Sale` : "View Featured Homes"}
              </Link>
              <Link
                href="/floor-plans"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-[#2c7a7b] text-[#2c7a7b] font-semibold rounded-lg hover:bg-[#2c7a7b] hover:text-white transition-colors"
              >
                Browse All Floor Plans
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Sales Alert */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Get Notified of Clearance Deals
            </h2>
            <p className="text-gray-600 mb-8">
              Sign up to be the first to know when clearance inventory becomes available.
            </p>
            <div className="text-left">
              <SalesAlertForm tone="light" />
            </div>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
