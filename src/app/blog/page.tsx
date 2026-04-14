import Link from "next/link";
import Image from "next/image";
import { generateMetadata as genMeta } from "@/lib/seo";
import { getPublishedPosts, getCategories } from "@/lib/blog";
import { H2 } from "@/components/Heading";

export const metadata = genMeta({
  title: "The Manufactured Home Blog",
  description: "Expert guides, buyer tips, financing advice, and industry news for manufactured and modular home buyers. From Factory Direct Homes Center in Auburn, IN.",
  url: "/blog",
  keywords: [
    "manufactured home blog",
    "modular home tips",
    "manufactured home buying guide",
    "manufactured home financing blog",
  ],
});

export default function BlogPage() {
  const posts = getPublishedPosts();
  const categories = getCategories();

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-[var(--color-charcoal)] grain-overlay text-white">
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="decorative-line" />
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--color-teal-light)]">
                Blog
              </span>
            </div>
            <h1 className="font-serif text-5xl lg:text-6xl xl:text-7xl font-light tracking-tight mb-6">
              The Manufactured{" "}
              <span className="italic text-[var(--color-teal-light)]">Home</span> Blog
            </h1>
            <p className="text-lg text-white/60 leading-relaxed max-w-xl">
              Expert guides, honest advice, and real data for manufactured and modular
              home buyers. No jargon, no pressure — just the information you need.
            </p>
          </div>
        </div>
      </section>

      {/* Category Badges */}
      {categories.length > 1 && (
        <section className="py-6 border-b border-[var(--color-charcoal)]/5">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex flex-wrap gap-2">
              <span className="badge badge-teal text-[10px]">All Posts</span>
              {categories.map((cat) => (
                <span
                  key={cat.value}
                  className="badge text-[10px] bg-[var(--color-cream-dark)] text-[var(--color-charcoal)]"
                >
                  {cat.label}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Posts Grid */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <H2 className="font-serif text-3xl lg:text-4xl font-light tracking-tight mb-12">
            Latest Articles
          </H2>

          {posts.length === 0 ? (
            <p className="text-[var(--color-gray)] text-center py-12">
              New articles coming soon. Check back!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group bg-white rounded-lg overflow-hidden border border-[var(--color-charcoal)]/5 hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Image */}
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={post.heroImage}
                      alt={post.heroImageAlt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="badge badge-teal text-[9px]">{post.categoryLabel}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-xs text-[var(--color-gray)] mb-3">
                      <time dateTime={post.publishedDate}>
                        {new Date(post.publishedDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </time>
                      <span>{post.readTimeMinutes} min read</span>
                    </div>
                    <h3 className="font-serif text-xl font-semibold tracking-tight mb-2 group-hover:text-[var(--color-teal)] transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-[var(--color-gray)] leading-relaxed line-clamp-3">
                      {post.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-[var(--color-teal)]">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <H2 className="font-serif text-3xl lg:text-4xl font-light text-white mb-4">
            Stay Informed
          </H2>
          <p className="text-white/70 mb-8">
            Get manufactured home buying tips, market updates, and new listing alerts
            delivered to your inbox.
          </p>
          <Link
            href="/contact-us"
            className="inline-flex items-center gap-2 bg-white text-[var(--color-teal)] px-8 py-3 text-sm font-bold tracking-widest uppercase rounded hover:bg-[var(--color-cream)] transition-colors duration-300"
          >
            Subscribe for Updates
          </Link>
        </div>
      </section>
    </>
  );
}
