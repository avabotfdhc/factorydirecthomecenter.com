import { generateMetadata as genMeta } from "@/lib/seo";
import Link from "next/link";
import { H2, H3 } from "@/components/Heading";

export const metadata = genMeta({
  title: "Manufactured Homes in Noble County, IN",
  description: "Champion manufactured and modular homes delivered to Noble County, Indiana. Serving Kendallville, Ligonier, Albion, and rural areas with factory-direct pricing.",
  url: "/locations/noble-county",
  type: "article",
});

export default function NobleCountyPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-[var(--color-charcoal)] grain-overlay text-white">
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="decorative-line" />
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--color-teal-light)]">
                Rural Indiana
              </span>
            </div>
            <h1 className="font-serif text-5xl lg:text-6xl xl:text-7xl font-light tracking-tight mb-6">
              Manufactured Homes<br />
              <span className="italic text-[var(--color-teal-light)]">in Noble County</span>
            </h1>
            <p className="text-lg text-white/60 leading-relaxed max-w-xl">
              Noble County welcomes manufactured homes. From Kendallville to Ligonier, 
              rural lots to small-town settings — we deliver Champion homes with 
              factory-direct pricing and line-item transparency.
            </p>
          </div>
        </div>
      </section>

      {/* Why Noble County */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="decorative-line mb-6" />
              <H2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight mb-8">
                Why Noble County Is<br />
                <span className="italic text-[var(--color-teal)]">Perfect for Manufactured Homes</span>
              </H2>
              <div className="space-y-6 text-[var(--color-gray)] leading-relaxed">
                <p>
                  Noble County's rural character and progressive zoning make it ideal for 
                  manufactured homes. Whether you're looking for acreage in the countryside 
                  or a lot in Kendallville or Ligonier, you'll find welcoming regulations 
                  and affordable land.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-[var(--color-lime)] mt-1">✓</span>
                    <span>Manufactured homes permitted on most residential lots</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[var(--color-lime)] mt-1">✓</span>
                    <span>Affordable rural land available</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[var(--color-lime)] mt-1">✓</span>
                    <span>No minimum square footage restrictions in agricultural zones</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[var(--color-lime)] mt-1">✓</span>
                    <span>Permanent foundation options for conventional financing</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-[var(--color-cream-dark)] rounded-lg p-8 lg:p-12">
              <H3 className="font-serif text-2xl font-semibold mb-6">Delivery to Noble County</H3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-[var(--color-charcoal)]/10">
                  <span className="text-[var(--color-gray)]">Distance from Auburn</span>
                  <span className="font-semibold text-lg">35 miles</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-[var(--color-charcoal)]/10">
                  <span className="text-[var(--color-gray)]">Estimated Delivery</span>
                  <span className="font-semibold text-lg">$3,200</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-[var(--color-charcoal)]/10">
                  <span className="text-[var(--color-gray)]">Typical Timeline</span>
                  <span className="font-semibold text-lg">8-12 weeks</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--color-gray)]">Permit Timeline</span>
                  <span className="font-semibold text-lg">2-4 weeks</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Areas Served */}
      <section className="py-24 lg:py-32 bg-[var(--color-cream-dark)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="decorative-line mx-auto mb-6" />
            <H2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight">
              Serving <span className="italic text-[var(--color-teal)]">All of Noble County</span>
            </H2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {["Kendallville", "Ligonier", "Albion", "Cromwell", "Rome City", "Wolflake", "Brimfield", "Wayne Center"].map((city) => (
              <div key={city} className="bg-white rounded-lg p-6 text-center border border-[var(--color-charcoal)]/5">
                <span className="font-medium">{city}</span>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-white rounded-lg p-8 border border-[var(--color-charcoal)]/5">
            <H3 className="font-serif text-xl font-semibold mb-4">Rural Areas & Acreage</H3>
            <p className="text-[var(--color-gray)]">
              We specialize in delivering to rural Noble County properties. Whether you have
              1 acre or 40, we arrange delivery of your home, and your own contractors handle
              the foundation and setup — ask us for our referral list of licensed and insured
              crews past customers have used. Agricultural zoning typically allows manufactured
              homes with minimal restrictions.
            </p>
          </div>
        </div>
      </section>

      {/* Zoning Info */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <div className="decorative-line mb-6" />
              <H2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight mb-8">
                Noble County<br />
                <span className="italic text-[var(--color-teal)]">Zoning Basics</span>
              </H2>
              <div className="space-y-6 text-[var(--color-gray)]">
                <p>
                  Noble County's zoning ordinance permits manufactured homes in most residential 
                  and agricultural districts. Key requirements include:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-[var(--color-lime)]/20 text-[var(--color-lime)] rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                    <span>Home must be on permanent foundation for residential zones</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-[var(--color-lime)]/20 text-[var(--color-lime)] rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                    <span>Minimum lot sizes vary by zoning district</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-[var(--color-lime)]/20 text-[var(--color-lime)] rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                    <span>Setback requirements: typically 25-50 feet from property lines</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-[var(--color-lime)]/20 text-[var(--color-lime)] rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
                    <span>Building permit required through Noble County Building Department</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-[var(--color-charcoal)] text-white rounded-lg p-8 lg:p-12">
              <H3 className="font-serif text-2xl font-semibold mb-6">The Permit Checklist</H3>
              <p className="text-white/60 mb-8">
                Don't navigate Noble County permits blind. Here's what you and your contractor
                will take care of — and we can point you to the right county offices:
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <span className="text-[var(--color-lime)]">✓</span>
                  <span>Verify zoning compliance for your property</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[var(--color-lime)]">✓</span>
                  <span>File permit applications with the Building Department</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[var(--color-lime)]">✓</span>
                  <span>Schedule required inspections</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[var(--color-lime)]">✓</span>
                  <span>Confirm code-compliant installation</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32 bg-[var(--color-charcoal)] grain-overlay relative text-white">
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <H2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight mb-6">
            Ready for Your <span className="italic text-[var(--color-teal-light)]">Noble County Home?</span>
          </H2>
          <p className="text-lg text-white/60 leading-relaxed mb-10 max-w-2xl mx-auto">
            Browse our floor plans, visit our Auburn showroom (just 35 miles away), or give us a call. 
            We'll create a custom quote for delivery to your Noble County property.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/floor-plans"
              className="btn-primary inline-flex items-center justify-center bg-[var(--color-teal)] text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-[var(--color-teal-dark)] transition-colors duration-300"
            >
              Browse Floor Plans
            </Link>
            <a
              href="tel:+12603081457"
              className="inline-flex items-center justify-center border border-white/20 text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-white/5 transition-colors duration-300"
            >
              Call (260) 308-1457
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
