"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "/floor-plans", label: "Floor Plans" },
  { href: "/financing", label: "Financing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--color-cream)]/95 backdrop-blur-sm border-b border-[var(--color-charcoal)]/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex flex-col">
            <span className="font-serif text-2xl font-semibold tracking-tight text-[var(--color-charcoal)]">
              Factory Direct
            </span>
            <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-[var(--color-terracotta)]">
              Homes Center
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium tracking-wide text-[var(--color-charcoal)]/70 hover:text-[var(--color-terracotta)] transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
            <a
              href="tel:+12603081457"
              className="btn-primary inline-flex items-center gap-2 bg-[var(--color-terracotta)] text-white px-6 py-2.5 text-sm font-semibold tracking-wide hover:bg-[var(--color-terracotta-dark)] transition-colors duration-300"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              (260) 308-1457
            </a>
          </nav>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-[var(--color-charcoal)]"
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

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--color-charcoal)]/5 bg-[var(--color-cream)]">
          <div className="px-6 py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-base font-medium text-[var(--color-charcoal)]/80 hover:text-[var(--color-terracotta)] transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <a
              href="tel:+12603081457"
              className="mt-2 inline-flex items-center justify-center gap-2 bg-[var(--color-terracotta)] text-white px-6 py-3 text-sm font-semibold tracking-wide"
            >
              Call (260) 308-1457
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
