"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "/floor-plans", label: "Floor Plans" },
  { href: "/locations", label: "Locations" },
  { href: "/guides", label: "Guides" },
  { href: "/financing", label: "Financing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[var(--color-charcoal)]/5">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo.png"
              alt="Factory Direct Homes Center"
              width={140}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs font-medium text-[var(--color-charcoal)]/70 hover:text-[var(--color-teal)] transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
            <a
              href="tel:+12603081457"
              className="btn-primary inline-flex items-center gap-1.5 bg-[var(--color-lime)] text-[var(--color-charcoal)] px-4 py-2 text-xs font-bold tracking-wide rounded hover:bg-[var(--color-lime-dark)] transition-colors duration-300"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              (260) 308-1457
            </a>
          </nav>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-[var(--color-charcoal)]"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-[var(--color-charcoal)]/5 bg-white">
          <div className="px-6 py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-base font-medium text-[var(--color-charcoal)]/80 hover:text-[var(--color-teal)] transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <a
              href="tel:+12603081457"
              className="mt-2 inline-flex items-center justify-center gap-2 bg-[var(--color-lime)] text-[var(--color-charcoal)] px-6 py-3 text-sm font-bold rounded"
            >
              Call (260) 308-1457
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
