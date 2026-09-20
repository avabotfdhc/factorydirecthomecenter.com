import Link from "next/link";
import type { Metadata } from "next";
import { SiteSearch } from "@/components/SiteSearch";
import { runSiteSearch } from "@/lib/site-search";
import { H2 } from "@/components/Heading";

// The search results page.
//
// It did not exist until now, while the WebSite schema emitted on every page
// (structuredData.website in src/lib/seo.ts) advertised
// `/search?q={search_term_string}` as this site's search endpoint. Google's
// sitelinks searchbox requires that URL to resolve; ours answered 404, so the
// markup described a capability the site did not have — the kind of mismatch
// that costs trust in the whole structured-data graph, not just this feature.
//
// Results render on the SERVER from the query string, so the page works with
// no JavaScript, is linkable, and can be read by a crawler or an answer
// engine. The client-side <SiteSearch /> box sits on top for refining.
//
// Deliberately noindex, follow: search-results pages are the textbook
// "soft 404 / thin content" pattern in Google's own guidance, and an infinite
// space of ?q= URLs in the index competes with the floor-plan pages that
// should rank. Crawlers still follow the outbound links to real content.

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Search",
  description: "Search Champion floor plans, model numbers, series, brochures and buying guides from Factory Direct Homes Center in Auburn, Indiana.",
  robots: { index: false, follow: true },
  alternates: { canonical: "https://factorydirecthomescenter.com/search" },
};

const CATEGORY_ORDER = ["Floor Plan", "Brochure", "Guide & Resource"];

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const params = await searchParams;
  const raw = Array.isArray(params.q) ? params.q[0] : params.q;
  const query = (raw || "").trim().slice(0, 100);
  const { results } = query.length >= 2 ? await runSiteSearch(query) : { results: [] };

  // Group so a search for "Thornton" shows the home above the brochure that
  // mentions it, rather than interleaving them by raw rank.
  const groups = new Map<string, typeof results>();
  for (const r of results) {
    const list = groups.get(r.category) || [];
    list.push(r);
    groups.set(r.category, list);
  }
  const ordered = [...groups.entries()].sort(
    (a, b) =>
      (CATEGORY_ORDER.indexOf(a[0]) + 1 || 99) - (CATEGORY_ORDER.indexOf(b[0]) + 1 || 99),
  );

  return (
    <>      <section className="bg-[var(--color-charcoal)] text-white pt-32 pb-12 lg:pt-40 lg:pb-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="decorative-line" />
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--color-teal-light)]">
              Search
            </span>
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl font-light tracking-tight mb-8">
            {query ? <>Results for “{query}”</> : <>Find your home</>}
          </h1>

          {/* No-JS fallback: a plain GET form to this same page, so the search
              box works before hydration and for any crawler that submits it. */}
          <form action="/search" method="get" className="flex gap-2 max-w-xl">
            <label htmlFor="site-search-q" className="sr-only">
              Search homes, series, model numbers and guides
            </label>
            <input
              id="site-search-q"
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Try a model number, “3 bedroom double wide”, or “zoning”"
              className="flex-1 rounded-lg px-4 py-3 text-[var(--color-charcoal)] bg-white"
            />
            <button
              type="submit"
              className="rounded-lg px-6 py-3 bg-[var(--color-lime)] text-[var(--color-charcoal)] font-bold hover:bg-[var(--color-lime-dark)] transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
        {/* Type-ahead for refining, once JavaScript is up. */}
        <div className="mb-10">
          <SiteSearch />
        </div>

        {query.length < 2 ? (
          <p className="text-[var(--color-gray)]">
            Enter at least two characters. You can search by model number (“B3260”), by what you
            need (“3 bedroom double wide”), or by topic (“financing”, “zoning”, “delivery”).
          </p>
        ) : results.length === 0 ? (
          <div className="text-[var(--color-gray)] space-y-4">
            <p className="text-lg">
              Nothing matched <strong className="text-[var(--color-charcoal)]">“{query}”</strong>.
            </p>
            <p>
              Try a shorter phrase, or start from{" "}
              <Link href="/floor-plans" className="text-[var(--color-teal)] hover:underline">
                every floor plan
              </Link>
              ,{" "}
              <Link href="/homes-on-sale" className="text-[var(--color-teal)] hover:underline">
                the homes on sale
              </Link>{" "}
              or{" "}
              <Link href="/guides" className="text-[var(--color-teal)] hover:underline">
                the buying guides
              </Link>
              . You can also call the showroom on{" "}
              <a href="tel:2603081457" className="text-[var(--color-teal)] hover:underline">
                (260) 308-1457
              </a>
              .
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {ordered.map(([category, items]) => (
              <div key={category}>
                <H2 className="font-serif text-2xl font-light mb-5">
                  {category}
                  <span className="text-[var(--color-gray)] text-base ml-3">{items.length}</span>
                </H2>
                <ul className="divide-y divide-[var(--color-charcoal)]/8">
                  {items.map((r) => (
                    <li key={r.url} className="py-4">
                      <Link
                        href={r.url}
                        className="font-medium text-[var(--color-teal)] hover:underline"
                      >
                        {r.title}
                      </Link>
                      {r.content && (
                        <p className="text-sm text-[var(--color-gray)] mt-1">{r.content}</p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
