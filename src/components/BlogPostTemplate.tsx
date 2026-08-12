import type { ReactNode } from "react";
import Image from "next/image";
import { FAQSection } from "@/components/FAQSection";
import { StructuredData, structuredData } from "@/lib/seo";
import { CTABlock } from "@/components/CTABlock";
import { H2 } from "@/components/Heading";
import type { BlogPost } from "@/lib/blog";

interface BlogPostTemplateProps {
  post: BlogPost;
  children: ReactNode;
}

export function BlogPostTemplate({ post, children }: BlogPostTemplateProps) {
  return (
    <>
      {/* Structured Data: Article + FAQ */}
      <StructuredData
        data={structuredData.article({
          headline: post.title,
          description: post.description,
          image: post.heroImage,
          datePublished: post.publishedDate,
          dateModified: post.modifiedDate || post.publishedDate,
          author: post.author,
          url: `/blog/${post.slug}`,
        })}
      />
      {post.faqs.length >= 5 && (
        <StructuredData data={structuredData.faqPage(post.faqs)} />
      )}
      <StructuredData
        data={structuredData.imageObject({
          url: post.heroImage,
          name: post.title,
          description: post.heroImageAlt,
          width: 1200,
          height: 630,
        })}
      />

      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-[var(--color-charcoal)] grain-overlay text-white">
        <div className="absolute inset-0">
          <Image
            src={post.heroImage}
            alt={post.heroImageAlt}
            fill
            preload
            className="object-cover opacity-30"
            sizes="100vw"
          />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-6">
            <span className="badge badge-teal text-[10px]">{post.categoryLabel}</span>
            <span className="text-xs text-white/50">
              {new Date(post.publishedDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="text-xs text-white/50">{post.readTimeMinutes} min read</span>
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl xl:text-6xl font-light tracking-tight mb-6">
            {post.title}
          </h1>
          <p className="text-lg text-white/70 leading-relaxed max-w-2xl">
            {post.description}
          </p>
          <div className="mt-6 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--color-teal)] flex items-center justify-center text-white text-xs font-bold">
              FD
            </div>
            <span className="text-sm text-white/60">By {post.author}</span>
          </div>
        </div>
      </section>

      {/* CTA Above the Fold */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <CTABlock
            text={post.cta.text}
            href={post.cta.href}
            label={post.cta.label}
            variant="secondary"
          />
        </div>
      </section>

      {/* Main Content */}
      <article className="py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="prose prose-lg max-w-none [&>h2]:font-serif [&>h2]:text-2xl [&>h2]:lg:text-3xl [&>h2]:font-light [&>h2]:tracking-tight [&>h2]:mt-12 [&>h2]:mb-4 [&>h3]:font-semibold [&>h3]:text-xl [&>h3]:mt-8 [&>h3]:mb-3 [&>p]:text-[var(--color-charcoal)]/80 [&>p]:leading-relaxed [&>p]:mb-4 [&>ul]:space-y-2 [&>ul]:mb-6 [&>ol]:space-y-2 [&>ol]:mb-6 [&>li]:text-[var(--color-charcoal)]/80">
            {children}
          </div>
        </div>
      </article>

      {/* FAQ Section */}
      {post.faqs.length > 0 && (
        <FAQSection
          title="Frequently Asked Questions"
          subtitle={`Common questions about ${post.title.toLowerCase()}`}
          faqs={post.faqs}
          showSchema={false}
        />
      )}

      {/* CTA at End of Post */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <CTABlock
            text={post.cta.text}
            href={post.cta.href}
            label={post.cta.label}
            variant="primary"
          />
        </div>
      </section>

      {/* E-E-A-T Trust Signals */}
      <section className="py-12 border-t border-[var(--color-charcoal)]/10">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <H2 className="font-serif text-xl font-semibold mb-6 text-center">Why Trust Factory Direct Homes Center</H2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl mb-2">70+</div>
              <p className="text-xs text-[var(--color-gray)]">Floor plans across Indiana, Ohio & Michigan</p>
            </div>
            <div>
              <div className="text-2xl mb-2">4.8</div>
              <p className="text-xs text-[var(--color-gray)]">Star rating from verified customers</p>
            </div>
            <div>
              <div className="text-2xl mb-2">30 mi</div>
              <p className="text-xs text-[var(--color-gray)]">From Champion&apos;s Topeka factory</p>
            </div>
            <div>
              <div className="text-2xl mb-2">100%</div>
              <p className="text-xs text-[var(--color-gray)]">Line-item pricing transparency</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
