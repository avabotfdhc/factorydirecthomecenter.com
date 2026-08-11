import { generateMetadata as genMeta } from "@/lib/seo";
import Link from "next/link";
import { H2, H3 } from "@/components/Heading";

export const metadata = genMeta({
  title: "Manufactured Homes in DeKalb County, IN",
  description: "Champion manufactured and modular homes in DeKalb County, Indiana. Auburn's local dealer serving Butler, Garrett, Waterloo, and rural areas with factory-direct pricing.",
  url: "/locations/dekalb-county",
  type: "article",
});

export default function DeKalbCountyPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-[var(--color-charcoal)] grain-overlay text-white">
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="decorative-line" />
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--color-teal-light)]">
                Your Local Dealer
              </span>
            </div>
            <h1 className="font-serif text-5xl lg:text-6xl xl:text-7xl font-light tracking-tight mb-6">
              Manufactured Homes<br />
              <span className="italic text-[var(--color-teal-light)]">in DeKalb County</span>
            </h1>
            <p className="text-lg text-white/60 leading-relaxed max-w-xl">
              We're right here in Auburn — your local DeKalb County dealer. From our 
              showroom to your property in 20 minutes. Factory-direct Champion homes 
              with the shortest delivery distances and best pricing.
            </p>
          </div>
        </div>
      </section>

      {/* Local Advantage */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="decorative-line mb-6" />
              <H2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight mb-8">
                Your Local<br />
                <span className="italic text-[var(--color-teal)]">DeKalb County Dealer</span>
              </H2>
              <div className="space-y-6 text-[var(--color-gray)] leading-relaxed">
                <p>
                  We're not a national chain calling from Topeka or Nappanee. We're your 
                  neighbors in Auburn, right here in DeKalb County. That means:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-[var(--color-lime)] mt-1">✓</span>
                    <span>Shortest delivery distances = lowest delivery costs</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[var(--color-lime)] mt-1">✓</span>
                    <span>Local knowledge of DeKalb County zoning and permits</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[var(--color-lime)] mt-1">✓</span>
                    <span>Relationships with local contractors and crews</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[var(--color-lime)] mt-1">✓</span>
                    <span>Visit our showroom anytime — we're 10 minutes away</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-[var(--color-cream-dark)] rounded-lg p-8 lg:p-12">
              <H3 className="font-serif text-2xl font-semibold mb-6">Delivery in DeKalb County</H3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-[var(--color-charcoal)]/10">
                  <span className="text-[var(--color-gray)]">Distance</span>
                  <span className="font-semibold text-lg">10-25 miles</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-[var(--color-charcoal)]/10">
                  <span className="text-[var(--color-gray)]">Delivery Cost</span>
                  <span className="font-semibold text-lg">$2,200 - $2,800</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-[var(--color-charcoal)]/10">
                  <span className="text-[var(--color-gray)]">Timeline</span>
                  <span className="font-semibold text-lg">6-10 weeks</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--color-gray)]">Permits</span>
                  <span className="font-semibold text-lg">2-3 weeks</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-[var(--color-charcoal)]/10">
                <p className="text-sm text-[var(--color-teal)] font-medium">
                  Lowest delivery costs in our service area — because we're local
                </p>
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
              Serving <span className="italic text-[var(--color-teal)]">All of DeKalb County</span>
            </H2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {["Auburn", "Butler", "Garrett", "Waterloo", "Ashley", "Corunna", "Hicksville", "St. Joe"].map((city) => (
              <div key={city} className="bg-white rounded-lg p-6 text-center border border-[var(--color-charcoal)]/5">
                <span className="font-medium">{city}</span>
              </div>
            ))}
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-8 border border-[var(--color-charcoal)]/5">
              <H3 className="font-serif text-xl font-semibold mb-4">Town & Village Lots</H3>
              <p className="text-[var(--color-gray)]">
                Building in Auburn, Butler, Garrett, or Waterloo? We know the local zoning, 
                setback requirements, and permit process for each municipality.
              </p>
            </div>
            <div className="bg-white rounded-lg p-8 border border-[var(--color-charcoal)]/5">
              <H3 className="font-serif text-xl font-semibold mb-4">Rural Acreage</H3>
              <p className="text-[var(--color-gray)]">
                DeKalb County's agricultural zoning is manufactured-home friendly. Whether 
                you have 5 acres or 50, we can make it work.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why DeKalb */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="decorative-line mx-auto mb-6" />
            <H2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight">
              Why Build in <span className="italic text-[var(--color-teal)]">DeKalb County?</span>
            </H2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-8 border border-[var(--color-charcoal)]/5">
              <H3 className="font-serif text-xl font-semibold mb-4">Affordable Land</H3>
              <p className="text-[var(--color-gray)]">
                DeKalb County offers some of the most affordable rural land in northeast Indiana. 
                Perfect for manufactured homes on acreage.
              </p>
            </div>
            <div className="bg-white rounded-lg p-8 border border-[var(--color-charcoal)]/5">
              <H3 className="font-serif text-xl font-semibold mb-4">Friendly Zoning</H3>
              <p className="text-[var(--color-gray)]">
                Agricultural and rural residential zoning welcomes manufactured homes. 
                Fewer restrictions than urban counties.
              </p>
            </div>
            <div className="bg-white rounded-lg p-8 border border-[var(--color-charcoal)]/5">
              <H3 className="font-serif text-xl font-semibold mb-4">Local Dealer</H3>
              <p className="text-[var(--color-gray)]">
                We're right here in Auburn — no long-distance dealer to chase down. And our
                referral list features local licensed and insured contractors, not out-of-town
                crews. Local support from start to finish.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32 bg-[var(--color-charcoal)] grain-overlay relative text-white">
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <H2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight mb-6">
            Your DeKalb County <span className="italic text-[var(--color-teal-light)]">Home Starts Here</span>
          </H2>
          <p className="text-lg text-white/60 leading-relaxed mb-10 max-w-2xl mx-auto">
            Visit our Auburn showroom, just minutes from anywhere in DeKalb County. 
            See the homes, meet the team, and get a custom quote for your property.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact-us"
              className="btn-primary inline-flex items-center justify-center bg-[var(--color-teal)] text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-[var(--color-teal-dark)] transition-colors duration-300"
            >
              Schedule a Visit
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
