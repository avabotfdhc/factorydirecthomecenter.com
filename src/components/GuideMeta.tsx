import { formatGuideDate, getGuide } from "@/lib/guides";
import { StructuredData } from "@/lib/seo";

// The "Last updated · N min read" byline under a guide's headline, plus the
// matching Article schema carrying the same dateModified. Guides are evergreen
// reference pages, so a visible, honest freshness date is what tells a reader
// (and a search engine) that the zoning rules or loan terms they're about to
// act on are current. Rendering both from one component means the visible date
// and the structured-data date can never disagree.
//
// `href` is the guide's own path, which keys into src/lib/guides.ts.
export function GuideMeta({
  href,
  className = "mt-5 text-white/60",
}: {
  href: string;
  className?: string;
}) {
  const guide = getGuide(href);
  if (!guide) return null;

  return (
    <>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: guide.title,
          description: guide.description,
          datePublished: guide.updated,
          dateModified: guide.updated,
          author: { "@type": "Organization", name: "Factory Direct Homes Center" },
          publisher: {
            "@type": "Organization",
            name: "Factory Direct Homes Center",
            logo: {
              "@type": "ImageObject",
              url: "https://factorydirecthomescenter.com/logo.png",
            },
          },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `https://factorydirecthomescenter.com${guide.href}`,
          },
        }}
      />
      <p className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-sm ${className}`}>
        <span>
          Last updated{" "}
          <time dateTime={guide.updated} className="font-semibold">
            {formatGuideDate(guide.updated)}
          </time>
        </span>
        <span aria-hidden="true">·</span>
        <span>{guide.readTime} read</span>
      </p>
    </>
  );
}
