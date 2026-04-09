"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getRelatedPages, getBreadcrumbs, getPillarPage, sitePages } from "@/lib/pages";
import { getCitations } from "@/lib/citations";
import { StructuredData, structuredData } from "@/lib/seo";

export function PageFooter() {
  const pathname = usePathname();

  // Skip on homepage — it has its own layout
  if (pathname === "/") return null;
  // Skip on design system
  if (pathname === "/design-system") return null;

  const related = getRelatedPages(pathname);
  const breadcrumbs = getBreadcrumbs(pathname);
  const pillar = getPillarPage(pathname);

  // Get current page topics for citation lookup
  const currentPage = sitePages.find((p) => p.url === pathname);
  const citations = currentPage ? getCitations(currentPage.topics, 4) : [];

  return (
    <>
      {/* Breadcrumb Structured Data */}
      {breadcrumbs.length > 1 && (
        <StructuredData data={structuredData.breadcrumb(breadcrumbs)} />
      )}

      {/* Related Pages */}
      {related.length > 0 && (
        <section className="py-16 bg-[var(--color-cream-dark)]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="decorative-line mb-6" />
            <h2 id="related-pages" className="font-serif text-2xl lg:text-3xl font-light tracking-tight mb-8">
              Related Resources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((page) => (
                <Link
                  key={page.url}
                  href={page.url}
                  className="bg-white rounded-lg p-6 border border-[var(--color-charcoal)]/5 hover:shadow-md transition-shadow group"
                >
                  <h3 className="font-semibold text-[var(--color-teal)] group-hover:text-[var(--color-teal-dark)] mb-2 text-sm">
                    {page.title}
                  </h3>
                  <p className="text-xs text-[var(--color-gray)] leading-relaxed">
                    {page.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Pillar Page Link */}
      {pillar && (
        <div className="py-8 text-center bg-[var(--color-cream)]">
          <p className="text-sm text-[var(--color-gray)] mb-2">Part of our comprehensive guide:</p>
          <Link
            href={pillar.url}
            className="inline-flex items-center gap-2 text-[var(--color-teal)] font-semibold hover:underline"
          >
            {pillar.title}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" focusable="false">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      )}

      {/* External Citations */}
      {citations.length > 0 && (
        <section className="py-10 border-t border-[var(--color-charcoal)]/10">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <h3 id="sources" className="font-semibold text-xs uppercase tracking-[0.2em] text-[var(--color-gray)] mb-4">
              Sources & References
            </h3>
            <ul className="space-y-2">
              {citations.map((cite, idx) => (
                <li key={idx} className="text-sm">
                  <a
                    href={cite.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-teal)] hover:underline"
                  >
                    {cite.source}
                  </a>
                  {" — "}
                  <span className="text-[var(--color-gray)]">{cite.description}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Breadcrumb Navigation */}
      {breadcrumbs.length > 1 && (
        <nav aria-label="Breadcrumb" className="py-4 border-t border-[var(--color-charcoal)]/5">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <ol className="flex items-center gap-2 text-xs text-[var(--color-gray)]">
              {breadcrumbs.map((crumb, idx) => (
                <li key={crumb.url} className="flex items-center gap-2">
                  {idx > 0 && (
                    <svg className="w-3 h-3 text-[var(--color-gray-light)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" focusable="false">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                  {idx === breadcrumbs.length - 1 ? (
                    <span className="font-medium text-[var(--color-charcoal)]">{crumb.name}</span>
                  ) : (
                    <Link href={crumb.url} className="hover:text-[var(--color-teal)] transition-colors">
                      {crumb.name}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </nav>
      )}
    </>
  );
}
