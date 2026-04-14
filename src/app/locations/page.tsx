import { generateMetadata as genMeta } from "@/lib/seo";
import Link from "next/link";
import { H2, H3 } from "@/components/Heading";

export const metadata = genMeta({
  title: "Locations We Serve",
  description: "Factory Direct Homes Center delivers Champion manufactured and modular homes throughout Indiana, Ohio, Michigan, Wisconsin, and Kentucky. Find your city and get a custom delivery quote.",
  url: "/locations",
});

const locations = [
  {
    state: "Indiana - Rural Counties",
    cities: [
      { name: "Noble County", distance: "35 miles", slug: "noble-county" },
      { name: "DeKalb County", distance: "Local", slug: "dekalb-county" },
      { name: "Rural Indiana", distance: "25-45 miles", slug: "rural-indiana" },
      { name: "Fort Wayne", distance: "30 miles", slug: "fort-wayne" },
      { name: "Indianapolis", distance: "110 miles", slug: "indianapolis" },
    ],
  },
  {
    state: "Ohio",
    cities: [
      { name: "Toledo", distance: "75 miles", slug: "toledo" },
      { name: "Dayton", distance: "140 miles", slug: "dayton" },
      { name: "Lima", distance: "55 miles", slug: "lima" },
      { name: "Findlay", distance: "95 miles", slug: "findlay" },
    ],
  },
  {
    state: "Michigan",
    cities: [
      { name: "Kalamazoo", distance: "95 miles", slug: "kalamazoo" },
      { name: "Battle Creek", distance: "85 miles", slug: "battle-creek" },
      { name: "Jackson", distance: "120 miles", slug: "jackson" },
      { name: "Ann Arbor", distance: "140 miles", slug: "ann-arbor" },
    ],
  },
];

export default function LocationsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-[var(--color-charcoal)] grain-overlay text-white">
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="decorative-line" />
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--color-teal-light)]">
                Our Service Area
              </span>
            </div>
            <h1 className="font-serif text-5xl lg:text-6xl xl:text-7xl font-light tracking-tight mb-6">
              We Deliver <span className="italic text-[var(--color-teal-light)]">Throughout</span><br />
              The Midwest
            </h1>
            <p className="text-lg text-white/60 leading-relaxed max-w-xl">
              From our showroom in Auburn, Indiana, we deliver Champion manufactured 
              and modular homes to families across Indiana, Ohio, Michigan, Wisconsin, 
              and Kentucky.
            </p>
          </div>
        </div>
      </section>

      {/* Locations Grid */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {locations.map((location) => (
            <div key={location.state} className="mb-16 last:mb-0">
              <H2 className="font-serif text-3xl lg:text-4xl font-light tracking-tight mb-8 pb-4 border-b border-[var(--color-charcoal)]/10">
                {location.state}
              </H2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {location.cities.map((city) => (
                  <Link
                    key={city.slug}
                    href={`/locations/${city.slug}`}
                    className="group bg-white rounded-lg border border-[var(--color-charcoal)]/5 p-6 hover:shadow-lg hover:border-[var(--color-teal)]/30 transition-all duration-300"
                  >
                    <H3 className="font-serif text-xl font-semibold mb-2 group-hover:text-[var(--color-teal)] transition-colors">
                      {city.name}
                    </H3>
                    <p className="text-sm text-[var(--color-gray)]">
                      {city.distance} from Auburn
                    </p>
                    <span className="inline-flex items-center mt-4 text-sm font-bold uppercase tracking-wider text-[var(--color-lime-dark)] group-hover:text-[var(--color-teal)] transition-colors">
                      View Details →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32 bg-[var(--color-cream-dark)]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <H2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight mb-6">
            Don&apos;t See Your City?
          </H2>
          <p className="text-lg text-[var(--color-gray)] leading-relaxed mb-10 max-w-2xl mx-auto">
            We deliver to all of Indiana, Ohio, Michigan, Wisconsin, and Kentucky. 
            Contact us for a custom delivery quote to your location.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact-us"
              className="btn-primary inline-flex items-center justify-center bg-[var(--color-teal)] text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-[var(--color-teal-dark)] transition-colors duration-300"
            >
              Get a Custom Quote
            </Link>
            <a
              href="tel:+12603081457"
              className="inline-flex items-center justify-center border-2 border-[var(--color-charcoal)]/15 text-[var(--color-charcoal)] px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-[var(--color-charcoal)]/5 transition-colors duration-300"
            >
              Call (260) 308-1457
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
