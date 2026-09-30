import { formatGuideDate, getGuide } from "@/lib/guides";
import { StructuredData, structuredData } from "@/lib/seo";

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
      {/* Built by the shared generator, never hand-written. This block used to
          inline its own Article schema with anonymous Organization author and
          publisher nodes — so all eight guide pages published a second
          organisation carrying our name with no @id and no address, the exact
          entity-fragmentation businessRef() exists to prevent. The generator
          walk in tests/structured-data.test.ts could not see it, because the
          node was in a component rather than in structuredData. */}
      <StructuredData
        data={structuredData.article({
          headline: guide.title,
          description: guide.description,
          // Guides carry no image of their own; the site default is what the
          // page's own Open Graph tags already use.
          image: "/images/hero-home.jpg",
          datePublished: guide.updated,
          dateModified: guide.updated,
          url: guide.href,
        })}
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
