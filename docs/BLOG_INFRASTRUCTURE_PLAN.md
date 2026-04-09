# Blog Infrastructure Plan

## Context

The CMO's marketing strategy (2026-04-09) calls for a content-first, SEO-driven approach with a `/blog` content hub, 10 initial posts (3 in Month 1), pillar pages, and lead capture. The existing infrastructure (page registry, PageFooter, structured data, AEO library, citations bank) was designed to support this — we just need to build the blog-specific layer on top.

**Option B chosen:** `/blog` is separate from `/guides`. Guides = evergreen reference content. Blog = keyword-targeting, time-based SEO content. They cross-link to strengthen both.

---

## Phase 1: Blog Data Model & Post Storage

### 1A. Create blog post data structure (`src/lib/blog.ts`)

TypeScript data file defining the `BlogPost` interface and all posts:

```ts
interface BlogPost {
  slug: string;
  title: string;
  description: string;          // 150-160 chars for meta
  primaryKeyword: string;       // CMO's target keyword
  publishedDate: string;        // ISO date
  modifiedDate?: string;
  author: string;
  category: "explainer" | "guide" | "myth-buster" | "news" | "practical" | "industry" | "decision-guide" | "niche";
  readTimeMinutes: number;
  heroImage: string;
  heroImageAlt: string;
  topics: string[];             // for page registry + citations
  pillarSlug?: string;          // parent pillar post
  cta: {
    text: string;
    href: string;
    label: string;              // e.g. "Download buyer checklist"
  };
}
```

Include stub data for all 10 posts from the CMO's calendar (titles, keywords, categories, CTAs). Content will be added incrementally.

### 1B. Extend page registry (`src/lib/pages.ts`)

- Add `"blog"` to the `cluster` union type
- Add a function `registerBlogPosts()` that converts blog post data into SitePage entries
- Blog posts auto-appear in sitemap, related pages, and internal linking

### 1C. Add blog-relevant citations (`src/lib/citations.ts`)

Add citations the CMO's posts will need:
- FHFA appreciation data (for "Do Manufactured Homes Appreciate?" post)
- 2025 HUD Code update sources
- ENERGY STAR rebate programs
- Insurance cost data sources
- VA loan manufactured home specifics

---

## Phase 2: Blog Post Template

### 2A. Create `BlogPostTemplate` (`src/components/BlogPostTemplate.tsx`)

A template that **enforces the CMO's content production checklist** by construction:

**Auto-included on every post:**
- Article + FAQ structured data (from `seo.ts`)
- H1 with primary keyword
- Published date + author byline + read time
- Hero image with ImageObject schema
- CTA block above the fold
- Content body (passed as children — JSX sections)
- FAQ section (minimum 5, using `FAQSection` component)
- CTA block at end of post
- E-E-A-T signals (using existing `EEATSignals` component)

**Auto-handled by existing infrastructure (no work needed):**
- OG/Twitter cards (from `generateMetadata`)
- Internal links to related posts (from `PageFooter`)
- External citations (from `PageFooter` + citations bank)
- Breadcrumbs with schema (from `PageFooter`)
- LocalBusiness + WebSite schema (from root layout)
- Heading IDs for anchor linking (from `Heading` components)
- Sitemap inclusion (from page registry)

### 2B. Create `CTABlock` component (`src/components/CTABlock.tsx`)

Reusable CTA component for blog posts:
- Primary CTA (teal background, white text, prominent)
- Secondary CTA (outlined, subtle)
- Props: `text`, `href`, `label`, `variant: "primary" | "secondary"`
- Used at top and bottom of every blog post per CMO guidelines

---

## Phase 3: Blog Routes

### 3A. Blog index page (`src/app/blog/page.tsx`)

- Hero section with "The Manufactured Home Blog" or similar
- Post grid showing all published posts (cards with image, title, description, date, category badge, read time)
- Category filter tabs (All, Guides, Explainers, News, etc.)
- Metadata via `generateMetadata()` with blog-specific keywords
- Structured data: CollectionPage schema

### 3B. Blog post pages (`src/app/blog/[slug]/page.tsx`)

- Dynamic route using `generateStaticParams()` for static generation
- Reads post data from `blog.ts`
- Renders `BlogPostTemplate` with post-specific content
- Each post's content is a separate component in `src/app/blog/[slug]/posts/` or inline in the data file
- Metadata via `generateMetadata()` per post

---

## Phase 4: Newsletter Signup & Lead Capture

### 4A. Newsletter signup in Footer (`src/components/Footer.tsx`)

Add a newsletter signup section between the link columns and the bottom bar:
- Email input + subscribe button
- Brief copy: "Get manufactured home buying tips, market updates, and new listing alerts."
- Simple form (can wire to email service later)

### 4B. Blog-specific CTA blocks

Each of the CMO's 10 posts has a specific CTA. The `CTABlock` component renders these. Examples:
- Post 1: "Download buyer checklist"
- Post 2: "Request a quote"  
- Post 3: "Talk to a financing expert"

---

## Phase 5: Scaffold First 3 Posts

Per the CMO's Month 1 target, scaffold posts 1-3 with full structure:

1. **"Manufactured vs. Modular vs. Mobile: What's the Real Difference?"** — Explainer, 1,800 words target
2. **"First-Time Manufactured Home Buyer's Complete Checklist"** — Guide, 2,500 words target  
3. **"How to Finance a Manufactured Home: Every Option Explained"** — Guide, 2,200 words target

Each scaffold includes: title, metadata, hero, content sections (H2 question headers), FAQ section (5+ FAQs with 40-60 word answers), CTAs. Content will be placeholder/stub that the CMO fills in.

---

## Key Files

| File | Action |
|------|--------|
| `src/lib/blog.ts` | **New** — Blog post data model + all 10 post stubs |
| `src/lib/pages.ts` | **Edit** — Add "blog" cluster, registerBlogPosts() |
| `src/lib/citations.ts` | **Edit** — Add blog-relevant citations |
| `src/components/BlogPostTemplate.tsx` | **New** — Blog template enforcing CMO checklist |
| `src/components/CTABlock.tsx` | **New** — Reusable CTA component |
| `src/app/blog/page.tsx` | **New** — Blog hub/index page |
| `src/app/blog/[slug]/page.tsx` | **New** — Dynamic blog post route |
| `src/components/Footer.tsx` | **Edit** — Add newsletter signup |

## Reused Existing Infrastructure

- `generateMetadata()` from `src/lib/seo.ts` — per-post metadata
- `structuredData.article()` from `src/lib/seo.ts` — Article schema
- `FAQSection` from `src/components/FAQSection.tsx` — FAQ accordion + schema
- `H2, H3, H4` from `src/components/Heading.tsx` — auto-ID headings
- `PageFooter` from `src/components/PageFooter.tsx` — auto related pages, citations, breadcrumbs
- `EEATSignals` from `src/components/MaxSEOPageTemplate.tsx` — trust signals
- `getCitations()` from `src/lib/citations.ts` — auto-matched citations
- `getRelatedPages()` from `src/lib/pages.ts` — auto-matched related content

## Verification

1. `npm run build` — all routes compile, blog/[slug] generates static params
2. Visit `/blog` — shows post grid with category filters
3. Visit `/blog/manufactured-vs-modular-vs-mobile` — shows full post with Article+FAQ schema, CTA, related pages, citations
4. Check OG tags on blog posts — verify title, description, image render in social card validators
5. Check `/sitemap.xml` — blog posts appear automatically
6. Footer newsletter signup renders on every page
7. PageFooter shows blog posts as "related" on guide pages (topic overlap)
