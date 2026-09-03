import Link from "next/link";
import { SALES_PHONE, SALES_PHONE_HREF } from "@/components/Pricing";

// The site had no not-found page, so every 404 rendered Next.js's bare default:
// black text on white, no header, no footer, no navigation and — the part that
// mattered — no phone number. A visitor who followed a link to a home we could
// not render was handed a dead end with nothing to click.
//
// That is not hypothetical. While the CMS was returning 502 (2026-08-29 to
// 2026-09-01) every CMS-backed floor plan degraded to notFound(), so real
// shoppers landed here and reported that "click to call doesn't work" — there
// was no call to click.
//
// A 404 is still a page someone is standing on. It gets the phone number first.

export const metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: true },
};

const LINKS = [
  { href: "/floor-plans", label: "Browse floor plans", note: "Every Champion home we sell" },
  { href: "/homes-on-sale", label: "See what's on sale", note: "This month's factory-direct offer" },
  { href: "/contact-us", label: "Ask us a question", note: "We answer every enquiry" },
  { href: "/locations", label: "Delivery areas", note: "Indiana, Ohio and Michigan" },
];

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex items-center px-6 py-20">
      <div className="max-w-3xl mx-auto w-full">
        <p className="text-xs font-bold tracking-[0.25em] uppercase text-[var(--color-lime-dark)] mb-4">
          Page not found
        </p>
        <h1 className="font-serif text-4xl lg:text-5xl font-light tracking-tight mb-4">
          We couldn&rsquo;t find that page
        </h1>
        <p className="text-lg text-[var(--color-gray)] max-w-xl mb-8">
          The home or page you were looking for may have been renamed, sold, or is
          temporarily unavailable. Everything else on the site is working — and if you
          were looking at a particular home, we can tell you about it right now.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mb-12">
          <a
            href={SALES_PHONE_HREF}
            className="inline-flex items-center justify-center bg-[var(--color-teal)] text-white px-7 py-4 text-sm font-bold tracking-wider uppercase rounded-lg hover:bg-[var(--color-teal-dark)] transition-colors"
          >
            Call {SALES_PHONE}
          </a>
          <Link
            href="/contact-us"
            className="inline-flex items-center justify-center border-2 border-[var(--color-charcoal)]/15 px-7 py-4 text-sm font-bold tracking-wider uppercase rounded-lg hover:bg-[var(--color-charcoal)]/5 transition-colors"
          >
            Send us a message
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block bg-white rounded-lg p-5 border border-[var(--color-charcoal)]/5 hover:shadow-md transition-shadow group"
            >
              <span className="font-semibold text-[var(--color-teal)] group-hover:text-[var(--color-teal-dark)]">
                {l.label}
              </span>
              <span className="block text-sm text-[var(--color-gray)] mt-1">{l.note}</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
