import { notFound } from "next/navigation";
import { generateMetadata as genMeta } from "@/lib/seo";
import { getPostBySlug, getAllPostSlugs } from "@/lib/blog";
import { BlogPostTemplate } from "@/components/BlogPostTemplate";
import { H2, H3 } from "@/components/Heading";
import Link from "next/link";

// Generate static params for all published posts
export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

// Generate metadata per post
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return genMeta({
    title: post.title,
    description: post.description,
    url: `/blog/${post.slug}`,
    type: "article",
    image: post.heroImage,
    imageAlt: post.heroImageAlt,
    publishedTime: post.publishedDate,
    modifiedTime: post.modifiedDate || post.publishedDate,
    author: post.author,
    keywords: [post.primaryKeyword],
  });
}

// Post content components — each post's body content
function Post1Content() {
  return (
    <>
      <p>
        If you&rsquo;re shopping for a factory-built home, you&rsquo;ve probably seen the terms <strong>manufactured</strong>, <strong>modular</strong>, and <strong>mobile</strong> used almost interchangeably. They&rsquo;re not the same thing — and understanding the differences can save you thousands of dollars and months of frustration.
      </p>
      <p>
        Here&rsquo;s the plain-English breakdown of what each term actually means, how they differ in construction quality, financing, and resale value, and which one might be right for you.
      </p>

      <H2 className="font-serif text-2xl lg:text-3xl font-light tracking-tight mt-12 mb-4">What is a manufactured home?</H2>
      <p>
        A manufactured home is built entirely in a factory to federal HUD (Department of Housing and Urban Development) standards. After June 15, 1976, all factory-built homes must meet these standards — covering structural design, fire safety, plumbing, electrical systems, and energy efficiency.
      </p>
      <p>
        Manufactured homes are built on a permanent steel chassis and transported to your site on their own wheels. They come in single-wide (500–1,200 sq ft), double-wide (1,000–2,400 sq ft), and triple-wide configurations. At Factory Direct Homes Center, our Champion-built manufactured homes start at $50,000 for single wides and $80,000 for double wides.
      </p>

      <H2 className="font-serif text-2xl lg:text-3xl font-light tracking-tight mt-12 mb-4">What is a modular home?</H2>
      <p>
        A modular home is also factory-built, but to your <strong>state and local building codes</strong> (IRC — International Residential Code) rather than federal HUD code. Modular home sections are transported to your site on flatbed trucks and assembled on a permanent foundation by local contractors.
      </p>
      <p>
        Once assembled, a modular home is virtually indistinguishable from a site-built home — and it&rsquo;s treated as real property for financing and tax purposes. Modular homes at Factory Direct start around $100,000 and range from 1,200 to 3,000+ sq ft.
      </p>

      <H2 className="font-serif text-2xl lg:text-3xl font-light tracking-tight mt-12 mb-4">What about mobile homes?</H2>
      <p>
        &ldquo;Mobile home&rdquo; is technically an outdated term referring to factory-built homes constructed <strong>before June 15, 1976</strong> — before the federal HUD code existed. These older homes were built without the safety, structural, and energy standards that modern manufactured homes must meet.
      </p>
      <p>
        The quality gap between a pre-1976 mobile home and a 2026 manufactured home is enormous. Modern manufactured homes feature drywall interiors, energy-efficient windows, contemporary kitchens, and construction that meets or exceeds many site-built standards.
      </p>

      <H2 className="font-serif text-2xl lg:text-3xl font-light tracking-tight mt-12 mb-4">How do they compare on financing?</H2>
      <p>
        This is where the differences matter most for your wallet:
      </p>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li><strong>Manufactured homes on permanent foundations with land:</strong> Qualify for FHA, VA, USDA, and conventional mortgages</li>
        <li><strong>Manufactured homes without permanent foundations:</strong> Financed with chattel loans (personal property loans) — higher rates but faster closing</li>
        <li><strong>Modular homes:</strong> Always qualify for conventional mortgages, treated identically to site-built for lending</li>
      </ul>

      <H2 className="font-serif text-2xl lg:text-3xl font-light tracking-tight mt-12 mb-4">Which type appreciates in value?</H2>
      <p>
        Both manufactured and modular homes on owned land appreciate in value. FHFA data shows manufactured homes with land gained 211.8% in value between 2000 and 2024. The key factor is <strong>land ownership</strong> — homes on leased lots don&rsquo;t build equity the same way.
      </p>
      <p>
        Modular homes, because they&rsquo;re classified as real property from day one, may appraise more favorably. But a well-maintained manufactured home on owned land is a solid investment.
      </p>

      <H2 className="font-serif text-2xl lg:text-3xl font-light tracking-tight mt-12 mb-4">Which one should you choose?</H2>
      <p>
        Here&rsquo;s a simple decision framework:
      </p>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li><strong>Budget is the priority:</strong> Manufactured home — lowest cost, most floor plan options</li>
        <li><strong>Conventional mortgage important:</strong> Modular home — treated as real property by all lenders</li>
        <li><strong>Fastest path to homeownership:</strong> Manufactured home with chattel loan — close in weeks</li>
        <li><strong>Want maximum customization:</strong> Either — both offer extensive factory customization</li>
        <li><strong>Rural land with flexible zoning:</strong> Manufactured home — widely accepted, affordable</li>
      </ul>
      <p>
        No matter which type you choose, factory-built homes deliver better quality per dollar than site-built construction. At Factory Direct Homes Center, we carry Champion manufactured and modular homes and can help you figure out which option fits your budget, land, and lifestyle.
      </p>
    </>
  );
}

function Post2Content() {
  return (
    <>
      <p>
        Buying a manufactured home is one of the smartest paths to homeownership — but the process is different from buying a traditional house. This checklist walks you through every step, from setting your budget to getting your keys.
      </p>

      <H2 className="font-serif text-2xl lg:text-3xl font-light tracking-tight mt-12 mb-4">Step 1: Determine your budget</H2>
      <p>
        Before looking at floor plans, get clear on what you can afford. New manufactured homes range from $50,000 (single wide) to $100,000+ (modular). But the home price is just the starting point — factor in delivery, setup, foundation, utility connections, and any land costs.
      </p>
      <p>
        A realistic total budget includes: home price + delivery ($3–8/mile) + setup ($3,000–8,000) + foundation ($4,000–15,000) + utility connections ($3,000–10,000) + permits ($500–2,000). At Factory Direct Homes Center, we provide line-item pricing so there are no surprises.
      </p>

      <H2 className="font-serif text-2xl lg:text-3xl font-light tracking-tight mt-12 mb-4">Step 2: Get pre-qualified for financing</H2>
      <p>
        Talk to a lender before you fall in love with a floor plan. Your financing options depend on whether you own land, your credit score, and whether the home will be on a permanent foundation.
      </p>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li><strong>Own land + permanent foundation:</strong> FHA, VA, USDA, or conventional mortgage</li>
        <li><strong>No land or no permanent foundation:</strong> Chattel loan from 21st Mortgage, Triad, or Credit Human</li>
        <li><strong>Buying land + home together:</strong> Land-home package (single loan, one payment)</li>
      </ul>

      <H2 className="font-serif text-2xl lg:text-3xl font-light tracking-tight mt-12 mb-4">Step 3: Decide on land</H2>
      <p>
        You have three options: buy your own land, lease a lot in a manufactured home community, or place the home on land you already own. Owning the land gives you the best financing options, builds equity, and gives you full control over your property.
      </p>
      <p>
        If you&rsquo;re buying land, check zoning regulations before you commit. Not all areas allow manufactured homes. Our team can help you verify zoning for any property in Indiana, Ohio, or Michigan.
      </p>

      <H2 className="font-serif text-2xl lg:text-3xl font-light tracking-tight mt-12 mb-4">Step 4: Choose your floor plan</H2>
      <p>
        Visit our showroom in Auburn, IN to walk through homes and see the build quality firsthand. Consider your family size, lifestyle, and must-haves (extra bedrooms, open kitchen, home office). Every Champion home is customizable — you can modify layouts, finishes, and features.
      </p>

      <H2 className="font-serif text-2xl lg:text-3xl font-light tracking-tight mt-12 mb-4">Step 5: Order your home</H2>
      <p>
        Once you&rsquo;ve chosen a floor plan and finalized customizations, we place the order with Champion&rsquo;s factory in Topeka, IN — just 30 miles from our showroom. Factory build time is typically 4 to 8 weeks.
      </p>

      <H2 className="font-serif text-2xl lg:text-3xl font-light tracking-tight mt-12 mb-4">Step 6: Prepare your site</H2>
      <p>
        While your home is being built, prepare your land. This includes grading, foundation work, utility connections (water, sewer/septic, electric, gas), driveway, and permits. Start this during the factory build to stay on schedule.
      </p>

      <H2 className="font-serif text-2xl lg:text-3xl font-light tracking-tight mt-12 mb-4">Step 7: Delivery and setup</H2>
      <p>
        Your home is transported to your site and placed on the foundation. Professional installers handle the setup, including leveling, anchoring, utility hookups, and skirting. The entire delivery and setup process takes 2 to 4 weeks.
      </p>

      <H2 className="font-serif text-2xl lg:text-3xl font-light tracking-tight mt-12 mb-4">Step 8: Final inspection and move-in</H2>
      <p>
        After setup, your home undergoes a final inspection by state or county inspectors. Once it passes, you receive your certificate of occupancy and the keys to your new home. Total timeline from order to move-in: 8 to 16 weeks.
      </p>
    </>
  );
}

function Post3Content() {
  return (
    <>
      <p>
        Financing a manufactured home isn&rsquo;t as straightforward as getting a mortgage on a traditional house — but you have more options than you might think. This guide breaks down every financing path available, with real numbers and honest pros and cons.
      </p>

      <H2 className="font-serif text-2xl lg:text-3xl font-light tracking-tight mt-12 mb-4">What determines your financing options?</H2>
      <p>
        Three factors drive your manufactured home financing options:
      </p>
      <ol className="list-decimal pl-6 space-y-2 mb-6">
        <li><strong>Do you own the land?</strong> Land ownership opens the door to mortgages with lower rates.</li>
        <li><strong>Will the home be on a permanent foundation?</strong> Permanent foundations make the home &ldquo;real property&rdquo; for lending purposes.</li>
        <li><strong>What&rsquo;s your credit score?</strong> Different loan types have different minimum scores.</li>
      </ol>

      <H2 className="font-serif text-2xl lg:text-3xl font-light tracking-tight mt-12 mb-4">Chattel loans: The most common option</H2>
      <p>
        A chattel loan finances the home as personal property — like a car loan. It&rsquo;s the most common financing for manufactured homes, especially those in communities or on leased land.
      </p>
      <H3 className="font-semibold text-xl mt-8 mb-3">Pros:</H3>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li>Faster closing (2-4 weeks vs. 6-8 for mortgages)</li>
        <li>Less paperwork and lower closing costs</li>
        <li>Don&rsquo;t need to own the land</li>
        <li>Credit score minimums as low as 575 (21st Mortgage)</li>
      </ul>
      <H3 className="font-semibold text-xl mt-8 mb-3">Cons:</H3>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li>Higher interest rates (typically 8-12%)</li>
        <li>Shorter loan terms (15-20 years vs. 30)</li>
        <li>Higher monthly payments due to shorter term</li>
      </ul>

      <H2 className="font-serif text-2xl lg:text-3xl font-light tracking-tight mt-12 mb-4">FHA loans: Low down payment, accessible credit</H2>
      <p>
        FHA loans are government-backed and designed for borrowers who may not qualify for conventional mortgages. There are two types for manufactured homes:
      </p>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li><strong>Title II:</strong> For homes on permanent foundations with owned land. 3.5% down with 580+ credit score. 30-year terms.</li>
        <li><strong>Title I:</strong> For the home only (no land required). Limits: $69,678 for single section, $92,904 for multi-section. 20-year max term.</li>
      </ul>

      <H2 className="font-serif text-2xl lg:text-3xl font-light tracking-tight mt-12 mb-4">VA loans: Best deal for veterans</H2>
      <p>
        If you&rsquo;re a veteran or active-duty service member, VA loans offer the best manufactured home financing available: zero down payment, no private mortgage insurance, and the lowest interest rates. The home must be on a permanent foundation and classified as real property.
      </p>

      <H2 className="font-serif text-2xl lg:text-3xl font-light tracking-tight mt-12 mb-4">USDA loans: Rural buyers with zero down</H2>
      <p>
        USDA Rural Development loans offer zero-down financing for manufactured homes in eligible rural areas. Income limits apply (typically 115% of area median income). The home must be new, on a permanent foundation, and on owned land. Many areas in Indiana, Ohio, and Michigan qualify.
      </p>

      <H2 className="font-serif text-2xl lg:text-3xl font-light tracking-tight mt-12 mb-4">Conventional mortgages: If you qualify</H2>
      <p>
        Conventional loans from Fannie Mae and Freddie Mac now accept manufactured homes that meet specific criteria: permanent foundation, HUD-code compliant, minimum 400 sq ft, and the home must be titled as real property. Rates are competitive with site-built home mortgages.
      </p>

      <H2 className="font-serif text-2xl lg:text-3xl font-light tracking-tight mt-12 mb-4">Land-home packages: One loan, one payment</H2>
      <p>
        If you&rsquo;re buying land and a home, a land-home package bundles everything into one loan. This simplifies your finances and typically qualifies for better rates than financing land and home separately. Our lending partners — 21st Mortgage, Triad Financial, and Credit Human — all offer land-home packages.
      </p>

      <H2 className="font-serif text-2xl lg:text-3xl font-light tracking-tight mt-12 mb-4">Which financing is right for you?</H2>
      <p>
        Here&rsquo;s a quick decision guide:
      </p>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li><strong>Own land + permanent foundation + good credit:</strong> Conventional or FHA Title II</li>
        <li><strong>Veteran:</strong> VA loan (always the best option if eligible)</li>
        <li><strong>Rural area + moderate income:</strong> USDA Rural Development</li>
        <li><strong>No land or no permanent foundation:</strong> Chattel loan</li>
        <li><strong>Buying land + home together:</strong> Land-home package</li>
        <li><strong>Credit challenges:</strong> FHA Title I or chattel loan (lower credit thresholds)</li>
      </ul>
      <p>
        Don&rsquo;t guess — talk to a lender early. Our team at Factory Direct Homes Center works with multiple lending partners and can connect you with the right financing for your situation.
      </p>
    </>
  );
}

// Map slugs to content components
const postContent: Record<string, () => React.JSX.Element> = {
  "manufactured-vs-modular-vs-mobile": Post1Content,
  "first-time-buyer-checklist": Post2Content,
  "how-to-finance-manufactured-home": Post3Content,
};

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post || !post.published) notFound();

  const ContentComponent = postContent[post.slug];

  return (
    <BlogPostTemplate post={post}>
      {ContentComponent ? <ContentComponent /> : (
        <p className="text-[var(--color-gray)] text-center py-12">
          Content coming soon.
        </p>
      )}
    </BlogPostTemplate>
  );
}
