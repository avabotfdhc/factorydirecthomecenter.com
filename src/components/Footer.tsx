import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[var(--color-charcoal)] text-[var(--color-cream)] grain-overlay relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex flex-col mb-6">
              <span className="font-serif text-3xl font-semibold tracking-tight">
                Factory Direct
              </span>
              <span className="text-xs font-medium tracking-[0.25em] uppercase text-[var(--color-lime)]">
                Homes Center
              </span>
            </div>
            <p className="text-sm leading-relaxed text-[var(--color-gray-light)] max-w-xs">
              Your Champion Homes exclusive dealer serving Indiana, Michigan &amp; Ohio
              with factory-direct pricing.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--color-gray)] mb-6">
              Explore
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/floor-plans", label: "Floor Plans" },
                { href: "/financing", label: "Financing" },
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--color-gray-light)] hover:text-[var(--color-lime)] transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Home Types */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--color-gray)] mb-6">
              Home Types
            </h4>
            <ul className="space-y-3">
              {["Single Wide Homes", "Double Wide Homes", "Modular Homes"].map(
                (type) => (
                  <li key={type}>
                    <Link
                      href="/floor-plans"
                      className="text-sm text-[var(--color-gray-light)] hover:text-[var(--color-lime)] transition-colors duration-300"
                    >
                      {type}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--color-gray)] mb-6">
              Visit Us
            </h4>
            <address className="not-italic space-y-3 text-sm text-[var(--color-gray-light)]">
              <p>1211 State Road 8<br />Auburn, IN 46706</p>
              <p>
                <a
                  href="tel:+12603081457"
                  className="hover:text-[var(--color-lime)] transition-colors"
                >
                  (260) 308-1457
                </a>
              </p>
              <p>
                <a
                  href="mailto:sales@factorydirecthomescenter.com"
                  className="hover:text-[var(--color-lime)] transition-colors"
                >
                  sales@factorydirecthomescenter.com
                </a>
              </p>
              <div className="pt-2 text-xs text-[var(--color-gray)]">
                <p>Mon–Fri: 9 AM – 5 PM</p>
                <p>Sat: 10 AM – 4 PM</p>
                <p>Sun: Closed</p>
              </div>
            </address>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[var(--color-gray)]">
            &copy; {new Date().getFullYear()} Factory Direct Homes Center LLC. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-xs text-[var(--color-gray)] hover:text-[var(--color-gray-light)] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-[var(--color-gray)] hover:text-[var(--color-gray-light)] transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
