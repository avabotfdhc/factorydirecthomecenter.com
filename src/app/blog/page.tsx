import Link from "next/link";
import type { Metadata } from "next";
import { getApiBlogPosts } from "@/lib/api-content";
import { PostImage } from "@/components/PostImage";

const SITE = "https://factorydirecthomescenter.com";

export const metadata: Metadata = {
  title: "The Manufactured Home Blog",
  description:
    "Expert guides, buyer tips, financing advice, and industry news for manufactured and modular home buyers. From Factory Direct Homes Center in Auburn, IN.",
  alternates: { canonical: `${SITE}/blog` },
  keywords: [
    "manufactured home blog",
    "modular home tips",
    "manufactured home buying guide",
    "manufactured home financing blog",
  ],
};

// ISR: refreshed from the CMS every 5 min — new posts appear without a redeploy,
// while the API is hit at most once per window and stays served if it hiccups.
export const revalidate = 300;

export default async function BlogPage() {
  const posts = await getApiBlogPosts();

  return (
    <main className="bg-[var(--color-cream)] text-[var(--color-charcoal)]">
      <section className="bg-[var(--color-charcoal)] text-[var(--color-cream)] py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--color-lime)] mb-4">
            Guides &amp; Insights
          </p>
          <h1 className="font-serif text-4xl lg:text-6xl font-light tracking-tight mb-5">
            The Manufactured <span className="italic text-[var(--color-teal-light)]">Home Blog</span>
          </h1>
          <p className="text-lg text-white/60 max-w-2xl leading-relaxed">
            Buyer guides, financing tips, and industry news to help you find and finance
            the right manufactured or modular home.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
        {posts.length === 0 ? (
          <p className="text-center text-[var(--color-gray)]">New articles are on the way — check back soon.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group flex flex-col border border-[var(--color-charcoal)]/8 hover:border-[var(--color-teal)]/30 bg-white rounded-xl overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="aspect-[16/10] bg-[var(--color-cream-dark)] relative overflow-hidden">
                  <PostImage src={p.image} alt={p.title} className="group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  {p.date && (
                    <span className="text-xs tracking-[0.15em] uppercase text-[var(--color-lime-dark)] mb-2">{p.date}</span>
                  )}
                  <h2 className="font-serif text-xl font-semibold mb-3 group-hover:text-[var(--color-teal)] transition-colors leading-snug">
                    {p.title}
                  </h2>
                  <p className="text-sm text-[var(--color-gray)] leading-relaxed line-clamp-3">{p.excerpt}</p>
                  <span className="mt-4 text-sm font-bold uppercase tracking-wider text-[var(--color-teal)]">
                    Read article →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
