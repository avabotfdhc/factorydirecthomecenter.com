import { generateMetadata as genMeta, StructuredData, structuredData } from "@/lib/seo";
import Link from "next/link";
import { H2, H3 } from "@/components/Heading";
import { DeliveryChecker } from "@/components/DeliveryChecker";

export const metadata = genMeta({
  title: "Locations We Serve — Delivery Areas & Zones",
  description:
    "Factory Direct Homes Center delivers Champion manufactured and modular homes throughout Indiana, Ohio, and Michigan. See our delivery zones, typical freight ranges by distance from Auburn, and find your city.",
  url: "/locations",
});

// Every city we publish a page for, with its road distance from the Auburn lot.
// The mileage drives two things: the "N miles from Auburn" line on each card,
// and which delivery zone the city is grouped under — previously the page was
// a flat list of cities with no indication of what delivery would cost or how
// far we actually go, which is the first thing a buyer wants to know.
interface ServedCity {
  name: string;
  miles: number;
  /** Overrides the "N miles from Auburn" line where a range or label reads better. */
  distanceLabel?: string;
  slug: string;
  state: "Indiana" | "Ohio" | "Michigan";
}

const cities: ServedCity[] = [
  { name: "Auburn (Showroom)", miles: 0, distanceLabel: "Our showroom", slug: "auburn", state: "Indiana" },
  { name: "Garrett", miles: 5, slug: "garrett", state: "Indiana" },
  { name: "Waterloo", miles: 6, slug: "waterloo", state: "Indiana" },
  { name: "DeKalb County", miles: 8, distanceLabel: "Our home county", slug: "dekalb-county", state: "Indiana" },
  { name: "Butler", miles: 12, slug: "butler", state: "Indiana" },
  { name: "Huntertown", miles: 18, slug: "huntertown", state: "Indiana" },
  { name: "Kendallville", miles: 20, slug: "kendallville", state: "Indiana" },
  { name: "Churubusco", miles: 22, slug: "churubusco", state: "Indiana" },
  { name: "Angola", miles: 25, slug: "angola", state: "Indiana" },
  { name: "Steuben County", miles: 25, slug: "steuben-county", state: "Indiana" },
  { name: "Albion", miles: 25, slug: "albion", state: "Indiana" },
  { name: "New Haven", miles: 28, slug: "new-haven", state: "Indiana" },
  { name: "Columbia City", miles: 30, slug: "columbia-city", state: "Indiana" },
  { name: "LaGrange County", miles: 30, slug: "lagrange-county", state: "Indiana" },
  { name: "Fort Wayne", miles: 30, slug: "fort-wayne", state: "Indiana" },
  { name: "Ligonier", miles: 32, slug: "ligonier", state: "Indiana" },
  { name: "Noble County", miles: 35, slug: "noble-county", state: "Indiana" },
  { name: "Whitley County", miles: 35, slug: "whitley-county", state: "Indiana" },
  { name: "Rural Indiana", miles: 35, distanceLabel: "25–45 miles", slug: "rural-indiana", state: "Indiana" },
  { name: "Wells County", miles: 50, slug: "wells-county", state: "Indiana" },
  { name: "Adams County", miles: 55, slug: "adams-county", state: "Indiana" },
  { name: "Toledo", miles: 75, slug: "toledo", state: "Ohio" },
  { name: "Kalamazoo", miles: 95, slug: "kalamazoo", state: "Michigan" },
  { name: "Indianapolis", miles: 110, slug: "indianapolis", state: "Indiana" },
];

// Zones mirror the tiers in <DeliveryChecker>, so the map, the table, and the
// zip lookup all tell a visitor the same thing. Freight figures are the ranges
// already published in /guides/pricing — quoted exactly per order, never
// bundled into the home price.
interface Zone {
  id: string;
  name: string;
  radius: string;
  maxMiles: number;
  freight: string;
  blurb: string;
  accent: string;
}

const zones: Zone[] = [
  {
    id: "core",
    name: "Zone 1 — Core area",
    radius: "Within 30 miles of Auburn",
    maxMiles: 30,
    freight: "Low end of $2,500–$8,000",
    blurb:
      "DeKalb, Noble, Steuben, Allen and Whitley counties. Shortest freight run, easiest permits, and the fastest we can get a crew back out to you after set.",
    accent: "var(--color-lime)",
  },
  {
    id: "regional",
    name: "Zone 2 — Regional",
    radius: "30–90 miles",
    maxMiles: 90,
    freight: "Mid $2,500–$8,000",
    blurb:
      "The rest of northeast Indiana plus northwest Ohio. Freight climbs with distance and any oversize-load escorts your route needs.",
    accent: "var(--color-teal)",
  },
  {
    id: "extended",
    name: "Zone 3 — Extended",
    radius: "90+ miles, anywhere in IN, OH & MI",
    maxMiles: Number.POSITIVE_INFINITY,
    freight: "Upper $2,500–$8,000, quoted per route",
    blurb:
      "Southern Michigan, central Indiana, and the rest of Ohio. Longer runs, more permitting — still factory-direct, still quoted line by line.",
    accent: "var(--color-charcoal)",
  },
];

function zoneFor(city: ServedCity): Zone {
  return zones.find((z) => city.miles <= z.maxMiles) ?? zones[zones.length - 1];
}

const STATES: Array<ServedCity["state"]> = ["Indiana", "Ohio", "Michigan"];

export default function LocationsPage() {
  return (
    <>
      <StructuredData
        data={structuredData.breadcrumb([
          { name: "Home", url: "/" },
          { name: "Locations", url: "/locations" },
        ])}
      />

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
              We Deliver <span className="italic text-[var(--color-teal-light)]">Throughout</span>
              <br />
              Indiana, Ohio &amp; Michigan
            </h1>
            <p className="text-lg text-white/60 leading-relaxed max-w-xl">
              From our showroom in Auburn, Indiana we deliver Champion manufactured and modular
              homes across three states — {cities.length} areas with their own page below, and
              plenty more in between.
            </p>
          </div>
        </div>
      </section>

      {/* Delivery zones */}
      <section className="py-20 lg:py-24 bg-[var(--color-cream-dark)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <H2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight mb-4">
            How Far We Deliver
          </H2>
          <p className="text-lg text-[var(--color-gray)] leading-relaxed max-w-3xl mb-12">
            Freight is priced by distance and home size, and we quote it as its own line on your
            estimate — never bundled into the home price. Here is roughly where each zone falls
            relative to our Auburn lot.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-12 items-start">
            {/* Radius diagram */}
            <div>
              <svg
                viewBox="0 0 320 320"
                className="w-full max-w-md mx-auto"
                role="img"
                aria-label="Concentric delivery zones centred on Auburn, Indiana: Zone 1 within 30 miles, Zone 2 from 30 to 90 miles, Zone 3 beyond 90 miles across Indiana, Ohio and Michigan."
              >
                <circle cx="160" cy="160" r="150" fill="var(--color-charcoal)" opacity="0.07" />
                <circle cx="160" cy="160" r="150" fill="none" stroke="var(--color-charcoal)" strokeOpacity="0.25" strokeDasharray="5 5" />
                <circle cx="160" cy="160" r="100" fill="var(--color-teal)" opacity="0.14" />
                <circle cx="160" cy="160" r="100" fill="none" stroke="var(--color-teal)" strokeOpacity="0.5" />
                <circle cx="160" cy="160" r="52" fill="var(--color-lime)" opacity="0.28" />
                <circle cx="160" cy="160" r="52" fill="none" stroke="var(--color-lime-dark)" strokeOpacity="0.6" />
                <circle cx="160" cy="160" r="6" fill="var(--color-charcoal)" />
                <text x="160" y="182" textAnchor="middle" className="fill-[var(--color-charcoal)]" fontSize="11" fontWeight="700">
                  Auburn, IN
                </text>
                <text x="160" y="122" textAnchor="middle" className="fill-[var(--color-charcoal)]" fontSize="10" fontWeight="600">
                  30 mi
                </text>
                <text x="160" y="72" textAnchor="middle" className="fill-[var(--color-charcoal)]" fontSize="10" fontWeight="600">
                  90 mi
                </text>
                <text x="160" y="24" textAnchor="middle" className="fill-[var(--color-charcoal)]" fontSize="10" fontWeight="600">
                  IN · OH · MI
                </text>
              </svg>
              <p className="text-xs text-[var(--color-gray)] text-center mt-3">
                Zones are approximate road distance from 1211 State Road 8, Auburn, IN 46706.
              </p>
            </div>

            {/* Zone table */}
            <div className="space-y-5">
              {zones.map((zone) => (
                <div
                  key={zone.id}
                  className="bg-white rounded-lg p-6 border-l-4"
                  style={{ borderLeftColor: zone.accent }}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                    <H3 className="font-serif text-xl font-semibold">{zone.name}</H3>
                    <span className="text-sm font-semibold text-[var(--color-teal)]">{zone.radius}</span>
                  </div>
                  <p className="text-sm text-[var(--color-gray)] leading-relaxed mb-3">{zone.blurb}</p>
                  <p className="text-sm">
                    <span className="font-bold uppercase tracking-wider text-xs text-[var(--color-charcoal)]">
                      Typical freight:
                    </span>{" "}
                    <span className="text-[var(--color-gray)]">{zone.freight}</span>
                  </p>
                </div>
              ))}
              <p className="text-sm text-[var(--color-gray)] leading-relaxed">
                Setup and site work are separate from freight and vary by property.{" "}
                <Link href="/guides/pricing" className="text-[var(--color-teal)] font-semibold underline underline-offset-4">
                  See how our line-item pricing works
                </Link>
                .
              </p>
            </div>
          </div>

          {/* Zip check */}
          <div className="mt-12 max-w-2xl">
            <DeliveryChecker />
          </div>
        </div>
      </section>

      {/* Cities, grouped by state then zone */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <H2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight mb-12">
            Areas We Serve
          </H2>

          {STATES.map((state) => {
            const inState = cities
              .filter((c) => c.state === state)
              .sort((a, b) => a.miles - b.miles);
            if (inState.length === 0) return null;

            return (
              <div key={state} className="mb-16 last:mb-0">
                <H3 className="font-serif text-3xl lg:text-4xl font-light tracking-tight mb-8 pb-4 border-b border-[var(--color-charcoal)]/10">
                  {state}
                </H3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {inState.map((city) => {
                    const zone = zoneFor(city);
                    return (
                      <Link
                        key={city.slug}
                        href={`/locations/${city.slug}`}
                        className="group bg-white rounded-lg border border-[var(--color-charcoal)]/5 p-6 hover:shadow-lg hover:border-[var(--color-teal)]/30 transition-all duration-300 flex flex-col"
                      >
                        <span
                          className="self-start text-[10px] font-bold tracking-wider uppercase px-2 py-1 rounded mb-3"
                          style={{ backgroundColor: zone.accent, color: zone.id === "core" ? "var(--color-charcoal)" : "#fff" }}
                        >
                          {zone.name.split(" — ")[0]}
                        </span>
                        <h4 className="font-serif text-xl font-semibold mb-2 group-hover:text-[var(--color-teal)] transition-colors">
                          {city.name}
                        </h4>
                        <p className="text-sm text-[var(--color-gray)]">
                          {city.distanceLabel ?? `${city.miles} miles from Auburn`}
                        </p>
                        <span className="inline-flex items-center mt-4 text-sm font-bold uppercase tracking-wider text-[var(--color-lime-dark)] group-hover:text-[var(--color-teal)] transition-colors">
                          View Details →
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32 bg-[var(--color-cream-dark)]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <H2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight mb-6">
            Don&apos;t See Your City?
          </H2>
          <p className="text-lg text-[var(--color-gray)] leading-relaxed mb-10 max-w-2xl mx-auto">
            The pages above are the areas we write about most — we deliver anywhere in Indiana,
            Ohio, and Michigan. Tell us where the home is going and we&apos;ll quote the freight
            exactly.
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
