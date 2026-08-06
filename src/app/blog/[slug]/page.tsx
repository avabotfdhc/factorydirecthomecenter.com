import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getApiBlogBySlug } from "@/lib/api-content";
import { StructuredData } from "@/lib/seo";
import { PostImage } from "@/components/PostImage";

const SITE = "https://factorydirecthomescenter.com";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getApiBlogBySlug(slug);
  if (!post) return { title: "Article Not Found | Factory Direct Homes Center" };
  const url = `${SITE}/blog/${post.slug}`;
  return {
    title: `${post.title} | Factory Direct Homes Center`,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      type: "article",
      images: post.image ? [{ url: post.image }] : undefined,
    },
  };
}

// ISR: each post renders on first request and caches for 5 min — CMS edits appear
// without a redeploy, and the API is only hit on cache miss/revalidate.
export const revalidate = 300;

export default async function BlogDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getApiBlogBySlug(slug);
  if (!post) notFound();

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    ...(post.image ? { image: post.image } : {}),
    author: { "@type": "Organization", name: "Factory Direct Homes Center" },
    publisher: {
      "@type": "Organization",
      name: "Factory Direct Homes Center",
      logo: { "@type": "ImageObject", url: `${SITE}/images/logo.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE}/blog/${post.slug}` },
  };

  return (
    <main className="bg-[var(--color-cream)] text-[var(--color-charcoal)]">
      <StructuredData data={articleLd} />

      <div className="border-b border-[var(--color-charcoal)]/5 bg-white">
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
