# Comprehensive SEO, Structured Data, Accessibility, AEO & WebMCP Upgrade

## Context

The site has strong foundations (11 schema generators, AEO library, MaxSEO template, semantic HTML) but critical gaps prevent new pages from automatically inheriting rich metadata, heading IDs are absent (blocking SEO anchor linking), accessibility has WCAG failures (no skip link, broken focus indicators, no mobile menu focus trap), and there is zero Web 3.0/WebMCP agent discoverability.

Internal linking and external citations are currently hardcoded per-page (only 7/21 pages have related links, only 2/21 have citations). This plan centralizes both into automatic, global systems so every page — current and future — gets them for free.

---

## Phase 1: Quick Wins (Highest Impact, Lowest Effort)

### 1A. Programmatic sitemap.ts + robots.ts
- Create `src/app/sitemap.ts` (Next.js MetadataRoute.Sitemap) listing all 21 pages with priorities
- Create `src/app/robots.ts` (MetadataRoute.Robots) with AI bot directives (GPTBot, ClaudeBot, PerplexityBot: Allow)
- Delete stale `public/sitemap.xml` and `public/robots.txt`

### 1B. Skip Link + main id
- **`src/components/Header.tsx`**: Add `<a href="#main-content">Skip to main content</a>` as first child of `<header>`, visually hidden until focused
- **`src/app/layout.tsx`**: Add `id="main-content"` to `<main>`

### 1C. Root Layout OG/Twitter Defaults
- **`src/app/layout.tsx`**: Add `metadataBase`, default OG image (1200x630), Twitter card config, so ALL pages inherit social cards automatically

### 1D. Fix focus:outline-none on Forms
- **`src/app/contact/ContactForm.tsx`**: Replace `focus:outline-none` with visible focus ring

### 1E. Mobile Menu Accessibility
- **`src/components/Header.tsx`**: Add `aria-expanded={mobileOpen}` to hamburger button, `role="dialog" aria-modal="true"` on mobile menu, focus trap (Escape to close, Tab wrap), focus restoration

---

## Phase 2: Metadata Inheritance (All Pages Get OG/Twitter Automatically)

### 2A. Fix generateMetadata() Title Bug
- **`src/lib/seo.ts` line 37**: Change `title: \`${title} | Factory Direct Homes Center\`` to just `title` -- the root layout template `%s | Factory Direct Homes Center` handles suffixing

### 2B. Migrate All Pages to generateMetadata()
- Replace hardcoded `export const metadata` on all 19 page files with `import { generateMetadata as genMeta } from "@/lib/seo"` + simple config object
- Each page goes from ~20 lines of metadata to ~5 lines and automatically gets: canonical URL, full OG with image, Twitter card, robots directives, merged keywords

### 2C. Root Layout Structured Data
- **`src/app/layout.tsx`**: Add `<StructuredData data={structuredData.localBusiness()} />` and `<StructuredData data={structuredData.website()} />` in `<head>` so every page has base schemas

---

## Phase 3: Global Internal Linking & External Citations System

### 3A. Create Central Page Registry (`src/lib/pages.ts`)

A single source of truth for every page on the site:

```ts
interface SitePage {
  url: string;
  title: string;
  description: string;
  topics: string[];           // e.g. ["financing", "first-time-buyers"]
  cluster: string;            // e.g. "guides", "locations", "products"
  pillar?: string;            // URL of parent pillar page
  priority: number;           // for sitemap
  changeFrequency: string;    // for sitemap
}
```

Functions:
- `getRelatedPages(currentUrl, count?)` -- auto-selects 3-5 related pages by topic overlap + cluster proximity
- `getBreadcrumbs(currentUrl)` -- generates breadcrumb trail from URL hierarchy
- `getClusterPages(cluster)` -- all pages in a topic cluster
- `getPillarPage(currentUrl)` -- parent pillar for current page
- `getAllPages()` -- for sitemap generation

This replaces all hardcoded `relatedPages` arrays across the codebase and also feeds `src/app/sitemap.ts`.

### 3B. Create Central Citations Bank (`src/lib/citations.ts`)

A topic-indexed repository of authoritative external sources:

```ts
interface Citation {
  source: string;       // e.g. "U.S. Census Bureau"
  url: string;
  description: string;
  topics: string[];     // e.g. ["manufactured-homes", "housing-statistics"]
}
```

Functions:
- `getCitations(topics[])` -- returns relevant citations for given topic tags
- `getCitationsByPage(url)` -- uses the page registry's topics to auto-select

Categories: manufactured-homes, financing, indiana-law, zoning, hud-standards, housing-statistics, energy-efficiency, etc.

### 3C. Create `<PageFooter />` Component (`src/components/PageFooter.tsx`)

A global component that renders at the bottom of every content page:

1. **Related Pages** section (auto-populated from page registry)
2. **External Sources & References** section (auto-populated from citations bank)
3. **Pillar Page** link (if page belongs to a cluster)
4. **Breadcrumb structured data** (JSON-LD)

Usage in layout or per-page:
```tsx
<PageFooter currentUrl="/financing" />
```

Or even simpler -- integrated into `layout.tsx` using `usePathname()` in a client wrapper so it's truly automatic on every page.

### 3D. Migrate Existing Pages
- Remove all hardcoded `relatedPages` and `citations` arrays from the 7 pages that have them
- Replace with `<PageFooter />` or let the layout handle it
- Ensure MaxSEOPageTemplate's `InternalLinking` and `ExternalSources` components consume from the central registry instead of props

---

## Phase 4: Heading IDs + SVG Accessibility

### 4A. Create Heading Component with Auto-IDs
- **Create `src/components/Heading.tsx`**: H2-H6 components that auto-generate `id` from text via slugification
- Ensures all future headings automatically get anchor-linkable IDs

### 4B. Add IDs to Existing Headings
- Replace `<h2>`-`<h6>` in all page and component files with the new Heading components
- Priority targets: MaxSEOPageTemplate AEOContent, all page-level section headings

### 4C. Decorative SVG Accessibility
- Add `aria-hidden="true" focusable="false"` to all decorative inline SVGs
- SVGs inside links/buttons with text labels are purely decorative

---

## Phase 5: Web 3.0 / WebMCP Agent Discoverability

### 5A. Create llms.txt
- **Create `public/llms.txt`**: Business description, contact info, key pages, service area, pricing ranges

### 5B. Create .well-known/mcp.json
- **Create `public/.well-known/mcp.json`**: Describe site capabilities (floor plan browsing, financing inquiry, contact form) as MCP-style tool descriptions for AI agents

### 5C. AI Bot Directives in robots.ts
- Explicit Allow for GPTBot, ClaudeBot, PerplexityBot, GoogleOther

---

## Phase 6: Form Accessibility + Performance

### 6A. Form Error States
- **`src/app/contact/ContactForm.tsx`**: Add `aria-required`, `aria-invalid`, `aria-describedby`, error messages with `aria-live="polite"`, visual error styling

### 6B. Dynamic Imports
- Homepage and heavy pages: use `next/dynamic` for below-fold sections

### 6C. Analytics Optimization
- Move GA4 from blocking `<head>` to `next/script` with `strategy="afterInteractive"`

---

## Phase 7: Content & AEO Consistency (Ongoing)

- Ensure every page has minimum 5 FAQs with 40-60 word answers
- Add question-based h2 headers where natural
- Location pages should use hyperlocal content from `aeo.ts`

---

## Key Files

| File | Changes |
|------|---------|
| `src/app/layout.tsx` | metadataBase, OG defaults, Twitter, main id, root structured data, PageFooter |
| `src/lib/seo.ts` | Fix title bug in generateMetadata() |
| `src/lib/pages.ts` | **New** -- central page registry with topic relationships |
| `src/lib/citations.ts` | **New** -- central citations bank by topic |
| `src/components/PageFooter.tsx` | **New** -- global related pages + citations component |
| `src/components/Header.tsx` | Skip link, aria-expanded, focus trap, SVG aria-hidden |
| `src/components/Heading.tsx` | **New** -- H2-H6 with auto-IDs |
| `src/app/contact/ContactForm.tsx` | Fix focus:outline-none, add error states |
| `src/app/sitemap.ts` | **New** -- programmatic sitemap (consumes page registry) |
| `src/app/robots.ts` | **New** -- programmatic robots with AI bot rules |
| `public/llms.txt` | **New** -- AI agent discovery file |
| `public/.well-known/mcp.json` | **New** -- WebMCP configuration |
| All 19 page files | Migrate to generateMetadata(), remove hardcoded relatedPages/citations |
| All pages with h2-h6 | Replace with Heading components |

## How New Pages Automatically Get Everything

After this upgrade, creating a new page requires only:

1. **Add to page registry** (`src/lib/pages.ts`) -- one object with url, title, description, topics, cluster
2. **Export metadata** -- `export const metadata = genMeta({ title, description, url })` (5 lines)
3. **Write content** -- use `<H2>`, `<H3>` etc. for auto-ID headings

The page automatically receives:
- Full OG tags + Twitter cards (from root layout defaults + generateMetadata)
- LocalBusiness + WebSite structured data (from root layout)
- Related pages section (from PageFooter via page registry)
- External citations (from PageFooter via citations bank)
- Breadcrumbs with schema (from PageFooter)
- Pillar page link (from PageFooter)
- Sitemap inclusion (sitemap.ts reads page registry)
- AI agent discoverability (llms.txt, robots.ts, mcp.json)

---

## Verification

1. **Social cards**: Twitter Card Validator + Facebook Sharing Debugger -- every page shows title, description, image
2. **Structured data**: Google Rich Results Test -- LocalBusiness + WebSite on all, FAQ on content pages
3. **Accessibility**: Lighthouse a11y audit target 100. Tab through verifying skip link, focus indicators, mobile menu trap
4. **Internal linking**: Every page renders 3-5 related pages and relevant citations without manual configuration
5. **SEO**: Heading IDs in rendered HTML. Sitemap.xml and robots.txt at live URLs
6. **WebMCP**: `llms.txt` and `.well-known/mcp.json` accessible at site root
7. **Performance**: Lighthouse performance -- no regressions
8. **Build**: `npm run build` completes without errors
