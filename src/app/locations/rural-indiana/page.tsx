import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Manufactured Homes in Rural Indiana | Factory Direct Homes Center",
  description: "Champion manufactured homes for rural Indiana. Serving Whitley, Steuben, LaGrange, Wells, and Adams counties with factory-direct pricing and line-item transparency.",
};

const ruralCounties = [
  {
    name: "Whitley County",
    cities: ["Columbia City", "South Whitley", "Churubusco"],
    distance: "25 miles",
    delivery: "$2,800",
    highlights: ["Strong agricultural zoning", "Affordable acreage", "Close to Fort Wayne"],
  },
  {
    name: "Steuben County",
    cities: ["Angola", "Fremont", "Hamilton"],
    distance: "45 miles",
    delivery: "$3,500",
    highlights: ["Lake James area", "Tourism-friendly", "Rural lakeside living"],
  },
  {
    name: "LaGrange County",
    cities: ["LaGrange", "Shipshewana", "Topeka"],
    distance: "35 miles",
    delivery: "$3,200",
    highlights: ["Amish country charm", "Agricultural heritage", "Peaceful rural setting"],
  },
  {
    name: "Wells County",
    cities: ["Bluffton", "Ossian", "Uniondale"],
    distance: "30 miles",
    delivery: "$3,000",
    highlights: ["Small-town atmosphere", "Affordable housing", "Strong community"],
  },
  {
    name: "Adams County",
    cities: ["Decatur", "Berne", "Geneva"],
    distance: "25 miles",
    delivery: "$2,800",
    highlights: ["Swiss heritage", "Agricultural economy", "Family-friendly"],
  },
];

export default function RuralIndianaPage() {
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
              <span className="italic text-[var(--color-teal-light)]">for Rural Indiana</span>
            </h1>
            <p className="text-lg text-white/60 leading-relaxed max-w-xl">
              Rural Indiana welcomes manufactured homes. From Whitley to Adams County, 
              agricultural zoning and affordable acreage make it the perfect place for 
              your Champion home.
            </p>
          </div>
        </div>
      </section>

      {/* Why Rural Indiana */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="decorative-line mx-auto mb-6" />
            <h2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight">
              Why <span className="italic text-[var(--color-teal)]">Rural Indiana?</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-8 border border-[var(--color-charcoal)]/5">
              <h3 className="font-serif text-xl font-semibold mb-4">Zoning-Friendly</h3>
              <p className="text-[var(--color-gray)]">
                Agricultural and rural residential zoning across northeast Indiana 
                welcomes manufactured homes. Fewer restrictions, more freedom.
              </p>
            </div>
            <div className="bg-white rounded-lg p-8 border border-[var(--color-charcoal)]/5">
              <h3 className="font-serif text-xl font-semibold mb-4">Affordable Acreage</h3>
              <p className="text-[var(--color-gray)]">
                Rural land in Whitley, Steuben, LaGrange, Wells, and Adams counties 
                costs a fraction of urban areas. Get more land for your money.
              </p>
            </div>
            <div className="bg-white rounded-lg p-8 border border-[var(--color-charcoal)]/5">
              <h3 className="font-serif text-xl font-semibold mb-4">Peace & Quiet</h3>
              <p className="text-[var(--color-gray)]">
                Escape the city. Rural Indiana offers space, privacy, and a slower 
                pace of life — with your brand-new manufactured home.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Counties */}
      <section className="py-24 lg:py-32 bg-[var(--color-cream-dark)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="decorative-line mx-auto mb-6" />
            <h2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight">
              Counties <span className="italic text-[var(--color-teal)]">We Serve</span>
            </h2>
          </div>

          <div className="space-y-8">
            {ruralCounties.map((county) => (
              <div key={county.name} className="bg-white rounded-lg p-8 border border-[var(--color-charcoal)]/5">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
                  <div>
                    <h3 className="font-serif text-2xl font-semibold mb-2">{county.name}</h3>
                    <p className="text-[var(--color-gray)] text-sm">
                      {county.cities.join(" • ")}
                    </p>
                  </div>
                  <div className="flex gap-8">
                    <div>
                      <span className="text-xs uppercase tracking-wider text-[var(--color-gray)]">Distance</span>
                      <div className="font-semibold text-lg">{county.distance}</div>
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-wider text-[var(--color-gray)]">Delivery</span>
                      <div className="font-semibold text-lg text-[var(--color-teal)]">{county.delivery}</div>
                    </div>
                  </div>
                  <div className="lg:col-span-2">
                    <div className="flex flex-wrap gap-2">
                      {county.highlights.map((highlight) => (
                        <span
                          key={highlight}
                          className="bg-[var(--color-cream-dark)] rounded-full px-4 py-2 text-sm"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Zoning Info */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <div className="decorative-line mb-6" />
              <h2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight mb-8">
                Rural Zoning<br />
                <span className="italic text-[var(--color-teal)]">Advantages</span>
              </h2>
              <div className="space-y-6 text-[var(--color-gray)]">
                <p>
                  Rural Indiana counties typically have more permissive zoning for manufactured 
                  homes than urban areas. Here's what that means for you:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-[var(--color-lime)] mt-1">✓</span>
                    <span>Agricultural zones often allow manufactured homes by right</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[var(--color-lime)] mt-1">✓</span>
                    <span>Smaller minimum lot sizes than urban areas</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[var(--color-lime)] mt-1">✓</span>
                    <span>More flexibility on foundation types</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[var(--color-lime)] mt-1">✓</span>
                    <span>Faster permit approval timelines</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[var(--color-lime)] mt-1">✓</span>
                    <span>Less restrictive aesthetic requirements</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-[var(--color-charcoal)] text-white rounded-lg p-8 lg:p-12">
              <h3 className="font-serif text-2xl font-semibold mb-6">2025 Indiana Law Update</h3>
              <p className="text-white/60 mb-6">
                Recent legislation (Public Law 175) strengthens protections for manufactured 
                home placement in Indiana:
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-[var(--color-lime)]">✓</span>
                  <span>Local governments cannot categorically ban manufactured homes over 950 sq ft</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[var(--color-lime)]">✓</span>
                  <span>Homes must be treated equally with other dwellings in zoning</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[var(--color-lime)]">✓</span>
                  <span>Permanent foundation requirements clarified</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32 bg-[var(--color-charcoal)] grain-overlay relative text-white">
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight mb-6">
            Ready for <span className="italic text-[var(--color-teal-light)]">Rural Living?</span>
          </h2>
          <p className="text-lg text-white/60 leading-relaxed mb-10 max-w-2xl mx-auto">
            Browse our floor plans or visit our Auburn showroom. We'll help you find the 
            perfect manufactured home for your rural Indiana property — with transparent 
            pricing and local expertise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/floor-plans"
              className="btn-primary inline-flex items-center justify-center bg-[var(--color-teal)] text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-[var(--color-teal-dark)] transition-colors duration-300"
            >
              Browse Floor Plans
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center border border-white/20 text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-white/5 transition-colors duration-300"
            >
              Get a Rural Property Quote
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
