import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getApiBlogBySlug } from "@/lib/api-content";
import { StructuredData, structuredData } from "@/lib/seo";
import { PostImage } from "@/components/PostImage";
import { languageAlternates } from "@/lib/seo";
import { absoluteImageUrl } from "@/lib/image-alt";

const SITE = "https://factorydirecthomescenter.com";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getApiBlogBySlug(slug).catch(() => null);
  if (!post) return { title: "Article Not Found" };
  const url = `${SITE}/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: url, languages: languageAlternates(url) },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      type: "article",
      ...(post.date ? { publishedTime: new Date(post.date).toISOString() } : {}),
      images: post.image ? [{ url: absoluteImageUrl(post.image), alt: post.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.image ? [{ url: absoluteImageUrl(post.image), alt: post.title }] : undefined,
    },
  };
}

// ISR: each post renders on first request and caches for 5 min — CMS edits appear
// without a redeploy, and the API is only hit on cache miss/revalidate.
export const revalidate = 300;

export default async function BlogDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getApiBlogBySlug(slug).catch(() => null);
  if (!post) notFound();

  // Built by the shared generator rather than by hand. The hand-rolled node
  // this replaces had two defects: it published NO `datePublished`, which
  // Google requires on Article and without which the post is ineligible for
  // an article rich result at all; and its `publisher` was a bare Organization
  // with no `@id`, so every post announced a *second* organisation called
  // "Factory Direct Homes Center" alongside the real `#business` node. That is
  // the same duplicate-entity defect src/lib/business.ts was written to stop,
  // just wearing Organization instead of LocalBusiness — which is why the
  // existing guard in tests/structured-data.test.ts did not catch it.
  //
  // `post.date` is a display string ("September 18, 2026"), so it is parsed
  // back to a date and only sent when it actually parses. A wrong date is
  // worse than none.
  const published = Number.isFinite(Date.parse(post.date))
    ? new Date(Date.parse(post.date)).toISOString().slice(0, 10)
    : undefined;
  const articleLd = structuredData.article({
    headline: post.title,
    description: post.excerpt,
    image: post.image || "/images/hero-home.jpg",
    datePublished: published ?? "",
    url: `/blog/${post.slug}`,
  });

  return (
    <main className="bg-[var(--color-cream)] text-[var(--color-charcoal)]">
      {published ? <StructuredData data={articleLd} /> : null}      <div className="border-b border-[var(--color-charcoal)]/5 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-4 text-sm text-[var(--color-gray)]">
          <Link href="/blog" className="hover:text-[var(--color-teal)]">Blog</Link>
          <span className="mx-2 text-[var(--color-gray-light)]">/</span>
          <span className="text-[var(--color-charcoal)] font-medium line-clamp-1">{post.title}</span>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
        {post.date && (
          <p className="text-xs tracking-[0.2em] uppercase text-[var(--color-lime-dark)] mb-3">{post.date}</p>
        )}
        <h1 className="font-serif text-3xl lg:text-5xl font-light tracking-tight mb-8">{post.title}</h1>

        <div className="rounded-2xl overflow-hidden border border-[var(--color-charcoal)]/8 mb-10 aspect-[16/9] relative bg-[var(--color-cream-dark)]">
          <PostImage src={post.image} alt={post.title} />
        </div>

        <div
          className="text-[var(--color-charcoal)]/85 leading-relaxed text-lg [&_p]:mb-5 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:font-serif [&_h3]:text-xl [&_h3]:mt-6 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-5 [&_li]:mb-1 [&_a]:text-[var(--color-teal)] [&_a]:underline"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />

        <div className="mt-12 pt-8 border-t border-[var(--color-charcoal)]/10">
          <Link
            href="/contact-us"
            className="inline-flex items-center justify-center bg-[var(--color-teal)] text-white px-7 py-3.5 text-sm font-bold tracking-wider uppercase rounded-lg hover:bg-[var(--color-teal-dark)] transition-colors"
          >
            Talk to us about your new home
          </Link>
        </div>
      </article>
    </main>
  );
}
