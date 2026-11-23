import Link from "next/link";
import { generateMetadata as genMeta } from "@/lib/seo";
import { FadeIn } from "@/components/VisualEffects";
import { SalesAlertForm } from "@/components/SalesAlertForm";
import { getSaleStatus } from "@/lib/sale";
import { BUSINESS, dialable } from "@/lib/business";
import { OVERSTOCK_HOMES, formatOverstockDate, overstockMonth, type OverstockHome } from "@/lib/overstock-homes";
import { SpecsDisclaimer } from "@/components/SpecsDisclaimer";
import { GetPricingButton, TrackedPhoneLink } from "@/app/HomeSectionIslands";

// This page prints the running discount rate ("View 25% Off Sale"), so it
// cannot be a build-time static page: it froze at the deploy that built it and
// went on advertising the Summer event's 25% after that event ended and the
// Fall event started at 20%. Five minutes, matching the homepage, so a campaign
// that turns over at midnight is right within minutes rather than at the mercy
// of the next deploy.
export const revalidate = 300;

const HAS_HOMES = OVERSTOCK_HOMES.length > 0;

export const metadata = genMeta({
  title: HAS_HOMES ? "Overstock & Clearance Homes" : "Clearance Homes",
  description: HAS_HOMES
    ? "Overstock Champion homes at Factory Direct Homes Center in Auburn, IN: already built at the plant with options included, ready for delivery in Indiana, Ohio and Michigan."
    : "Shop clearance manufactured homes at Factory Direct Homes Center. Last chance pricing on select inventory. Single wide, double wide, and modular homes.",
  url: "/homes-on-sale/clearance",
  // With no home listed the page says "No Clearance Inventory at This Time",
  // so it stays out of the index. It is indexable only while
  // OVERSTOCK_HOMES (src/lib/overstock-homes.ts) has an entry; the registry
  // entry in src/lib/pages.ts and NOT_INDEXED in tests/indexing.test.ts follow
  // the same list.
  noindex: !HAS_HOMES,
});

function OverstockCard({ home }: { home: OverstockHome }) {
  const month = overstockMonth(home.factoryCompleteDate);
  return (
    <article id={home.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="grid lg:grid-cols-2">
        <div className="bg-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element -- one repo-served rendering; a plain img keeps this card out of the optimiser's srcset weight */}
          <img
            src={home.image}
            alt={home.imageAlt}
            width={1024}
            height={743}
            loading="eager"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-[var(--color-orange)] text-[var(--color-charcoal)] text-xs font-bold tracking-wider uppercase rounded-full">
              Overstock
            </span>
            <span className="px-3 py-1 bg-[#2c7a7b] text-white text-xs font-bold tracking-wider uppercase rounded-full">
              Ready for delivery in {month}
            </span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-1">
            {home.modelYear} Champion {home.series} {home.name}
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Model {home.modelNumber} · {home.construction}
          </p>
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5 text-center">
            {[
              ["Bedrooms", String(home.beds)],
              ["Baths", String(home.baths)],
              ["Sq. ft.", home.sqft.toLocaleString("en-US")],
              ["Size", home.size],
            ].map(([label, value]) => (
              <div key={label} className="bg-gray-50 rounded-lg py-3 px-2">
                <dt className="text-xs uppercase tracking-wider text-gray-600">{label}</dt>
                <dd className="text-lg font-bold text-gray-900">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="text-gray-700 mb-4">{home.summary}</p>
          <p className="text-gray-700 mb-6">
            This home is being built at {home.plant} and is scheduled to come off the line{" "}
            {formatOverstockDate(home.factoryCompleteDate)}. Its options are already built in and cannot be changed,
            which is why there is no build wait.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <GetPricingButton
              modelName={`Overstock ${home.series} ${home.name} ${home.modelNumber}`}
              className="inline-flex items-center justify-center px-8 py-3 bg-[#2c7a7b] hover:bg-[#1a365d] text-white font-semibold rounded-lg transition-colors"
            />
            <TrackedPhoneLink
              href={`tel:${dialable(BUSINESS.telephone)}`}
              location="overstock_home"
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-[#2c7a7b] text-[#2c7a7b] font-semibold rounded-lg hover:bg-[#2c7a7b] hover:text-white transition-colors"
            >
              Call {BUSINESS.phoneDisplay}
            </TrackedPhoneLink>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            One home available. See the layout on the{" "}
            <Link href={`/floor-plans/${home.planSlug}`} className="text-[#2c7a7b] underline font-medium">
              {home.name} floor plan page
            </Link>
            .
          </p>
        </div>
      </div>
      <div className="border-t border-gray-200 p-6 sm:p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Floor plan</h3>
        {/* eslint-disable-next-line @next/next/no-img-element -- one repo-served drawing; see the note on the rendering above */}
        <img
          src={home.floorPlanImage}
          alt={home.floorPlanAlt}
          width={1800}
          height={1116}
          loading="lazy"
          className="w-full max-w-4xl mx-auto h-auto"
        />
        <p className="text-sm text-gray-700 mt-4 max-w-4xl mx-auto">{home.floorPlanNote}</p>
      </div>

      <div className="border-t border-gray-200 p-6 sm:p-8 bg-gray-50">
        <h3 className="text-xl font-bold text-gray-900 mb-1">Colors on this home</h3>
        <p className="text-sm text-gray-700 mb-4">Already chosen and built. They cannot be changed.</p>
        <dl className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {home.colors.map((c) => (
            <div key={c.label} className="bg-white border border-gray-200 rounded-lg p-3">
              <dt className="text-xs uppercase tracking-wider text-gray-600">{c.label}</dt>
              <dd className="font-semibold text-gray-900">{c.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="border-t border-gray-200 p-6 sm:p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-1">Options added to this home</h3>
        <p className="text-sm text-gray-700 mb-4">
          These are upgrades on top of the {home.series} standard features, already included.
        </p>
        <div className="grid lg:grid-cols-2 gap-6">
          <ul className="space-y-3">
            {home.options.map((o) => (
              <li key={o.name} className="border-l-4 border-[#2c7a7b] pl-4">
                <p className="font-semibold text-gray-900">{o.name}</p>
                <p className="text-sm text-gray-700">{o.detail}</p>
              </li>
            ))}
          </ul>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
            <h4 className="font-bold text-gray-900 mb-2">What the {home.packageContents.name} includes</h4>
            <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm text-gray-700 list-disc pl-5">
              {home.packageContents.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 p-6 sm:p-8 bg-gray-50">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Standard features</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {home.standards.map((group) => (
            <div key={group.title}>
              <h4 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-2">{group.title}</h4>
              <ul className="space-y-1.5 text-sm text-gray-700 list-disc pl-5">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-700 mt-6">{home.imageNote}</p>
        <p className="text-xs text-gray-700 mt-2">
          Delivery is quoted per route across Indiana, Ohio and Michigan. Site work, foundation and set-up are
          contracted by the buyer. Subject to prior sale.
        </p>
      </div>
    </article>
  );
}

export default function ClearancePage() {
  const sale = getSaleStatus();

  return (
    <div className="min-h-screen bg-white">      {/* Hero */}
      <section className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {HAS_HOMES ? "Overstock & Clearance Homes" : "Clearance Inventory"}
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              {HAS_HOMES
                ? "Already built at the plant, options included, and ready to deliver. No build wait."
                : "Last chance pricing on select homes. Once they’re gone, they’re gone!"}
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
              {HAS_HOMES ? "Overstock" : "Clearance"}
            </Link>
          </div>
        </div>
      </section>

      {HAS_HOMES ? (
        <section className="py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            {OVERSTOCK_HOMES.map((home) => (
              <OverstockCard key={home.id} home={home} />
            ))}
            <SpecsDisclaimer />
          </div>
        </section>
      ) : (
        /* Empty State */
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
      )}

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
    </div>
  );
}
