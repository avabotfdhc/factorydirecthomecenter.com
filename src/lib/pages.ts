// Central Page Registry — single source of truth for all site pages
// Used by: sitemap.ts, PageFooter (related pages, breadcrumbs), llms.txt

export interface SitePage {
  url: string;
  title: string;
  /** Short label for the breadcrumb trail, when the full title is too long to
   *  read as a crumb. Google truncates breadcrumb labels and the visible trail
   *  wraps, so a blog post's 90-character headline makes a poor crumb. */
  shortTitle?: string;
  description: string;
  topics: string[];
  cluster: "core" | "locations" | "guides" | "products" | "blog";
  pillar?: string;
  priority: number;
  changeFrequency: "weekly" | "monthly" | "yearly";
}

export const sitePages: SitePage[] = [
  // Core Pages
  {
    url: "/",
    title: "Factory Direct Homes Center",
    description: "Factory-direct pricing on new Champion manufactured and modular homes from Auburn, IN.",
    topics: ["manufactured-homes", "champion-homes", "factory-direct"],
    cluster: "core",
    priority: 1,
    changeFrequency: "weekly",
  },
  {
    url: "/floor-plans",
    title: "Manufactured Home Floor Plans",
    description: "Browse every Champion floor plan we sell. Single wide, double wide, and modular homes with factory-direct pricing.",
    topics: ["floor-plans", "single-wide", "double-wide", "modular", "champion-homes"],
    cluster: "products",
    priority: 0.9,
    changeFrequency: "weekly",
  },
  {
    url: "/homes-on-sale",
    title: "Homes On Sale",
    description: "Current sale and promotional homes at factory-direct pricing on select Champion manufactured and modular models.",
    topics: ["sale", "homes-on-sale", "manufactured-homes", "champion-homes"],
    cluster: "products",
    priority: 0.9,
    changeFrequency: "weekly",
  },
  {
    url: "/homes-on-sale/clearance",
    title: "Clearance Homes",
    description: "Clearance and last-chance manufactured homes at factory-direct prices.",
    topics: ["clearance", "homes-on-sale", "manufactured-homes"],
    cluster: "products",
    pillar: "/homes-on-sale",
    priority: 0.7,
    changeFrequency: "weekly",
  },
  {
    url: "/financing",
    title: "Manufactured Home Financing",
    description: "Chattel loans, land-home packages, and conventional financing for manufactured homes in Indiana, Ohio, and Michigan.",
    topics: ["financing", "chattel-loans", "first-time-buyers"],
    cluster: "core",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    url: "/about",
    title: "About Factory Direct Homes Center",
    description: "Family-owned Champion Homes dealer in Auburn, Indiana. Serving Indiana, Ohio & Michigan, just 30 miles from the Champion factory.",
    topics: ["about", "champion-homes", "factory-direct"],
    cluster: "core",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    url: "/contact-us",
    title: "Contact Us",
    description: "Visit our Auburn showroom, call (260) 308-1457, or send a message.",
    topics: ["contact", "showroom"],
    cluster: "core",
    priority: 0.7,
    changeFrequency: "monthly",
  },
  {
    url: "/options",
    title: "Factory Options & Selections",
    description: "Champion's 2026 interior & exterior selections, option drawings (fireplaces, islands, cabinets, exteriors), and series brochures.",
    topics: ["options", "selections", "upgrades", "champion-homes"],
    cluster: "guides",
    priority: 0.7,
    changeFrequency: "monthly",
  },
  {
    url: "/resources",
    title: "Resources & Downloads",
    description: "Download 2026 Champion Homes floor plans, sales options, decor guide, and installation manuals.",
    topics: ["floor-plans", "resources", "downloads", "champion-homes"],
    cluster: "guides",
    priority: 0.7,
    changeFrequency: "monthly",
  },
  {
    url: "/privacy",
    title: "Privacy Policy",
    description: "Factory Direct Homes Center privacy policy.",
    topics: ["legal"],
    cluster: "core",
    priority: 0.3,
    changeFrequency: "yearly",
  },
  {
    url: "/terms",
    title: "Terms of Service",
    description: "Factory Direct Homes Center terms of service.",
    topics: ["legal"],
    cluster: "core",
    priority: 0.3,
    changeFrequency: "yearly",
  },

  // Location Pages
  {
    url: "/locations",
    title: "Locations We Serve",
    description: "Champion homes delivered throughout Indiana, Ohio, and Michigan.",
    topics: ["locations", "delivery", "service-area"],
    cluster: "locations",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    url: "/locations/allen-county",
    title: "Manufactured Homes in Allen County, IN",
    description: "Champion manufactured and modular homes delivered across Allen County — Fort Wayne, New Haven, Huntertown and Leo-Cedarville — with factory-direct pricing.",
    topics: ["allen-county", "fort-wayne", "manufactured-homes", "delivery"],
    cluster: "locations",
    pillar: "/locations",
    priority: 0.7,
    changeFrequency: "monthly",
  },
  {
    url: "/series/prime",
    title: "Champion PRIME Series Floor Plans",
    description: "Champion's value single-wide series: 14' and 16' wide plans with modern kitchens at the lowest factory-direct price.",
    topics: ["prime", "single-wide", "champion-homes", "floor-plans"],
    cluster: "products",
    pillar: "/floor-plans",
    priority: 0.8,
    changeFrequency: "weekly",
  },
  {
    url: "/series/aspire",
    title: "Champion Aspire (Dutch Aspire) Floor Plans",
    description: "Single and multi-section Aspire homes with upgraded kitchens, primary suites and optional drywall.",
    topics: ["aspire", "dutch-aspire", "champion-homes", "floor-plans"],
    cluster: "products",
    pillar: "/floor-plans",
    priority: 0.8,
    changeFrequency: "weekly",
  },
  {
    url: "/series/paramount",
    title: "Champion Paramount Series Floor Plans",
    description: "Spacious multi-section Paramount homes with kitchen islands, walk-in closets and up to 5 bedrooms.",
    topics: ["paramount", "double-wide", "multi-section", "champion-homes", "floor-plans"],
    cluster: "products",
    pillar: "/floor-plans",
    priority: 0.8,
    changeFrequency: "weekly",
  },
  {
    url: "/series/redman",
    title: "Champion Redman Series Homes",
    description: "Expansive Redman sectional homes with kitchen islands and luxury primary suites, ordered to spec from the Topeka plant.",
    topics: ["redman", "multi-section", "champion-homes"],
    cluster: "products",
    pillar: "/floor-plans",
    priority: 0.7,
    changeFrequency: "monthly",
  },
  {
    url: "/series/dutch",
    title: "Champion Dutch Housing Homes",
    description: "Premium Dutch-branded homes with finished drywall, higher roof pitch and IRC modular options.",
    topics: ["dutch", "modular", "champion-homes"],
    cluster: "products",
    pillar: "/floor-plans",
    priority: 0.7,
    changeFrequency: "monthly",
  },
  {
    url: "/locations/auburn",
    title: "Manufactured & Modular Homes in Auburn, IN",
    description: "Our Auburn, DeKalb County showroom at 1211 State Road 8. Factory-direct Champion homes, 30 miles from the factory.",
    topics: ["locations", "auburn", "dekalb-county", "indiana", "showroom"],
    cluster: "locations",
    pillar: "/locations",
    priority: 0.95,
    changeFrequency: "monthly",
  },
  {
    url: "/locations/huntertown",
    title: "Manufactured & Modular Homes in Huntertown, IN",
    description: "Champion homes delivered to Huntertown & northern Allen County. 18 miles from our Auburn showroom.",
    topics: ["locations", "huntertown", "allen-county", "indiana"],
    cluster: "locations",
    pillar: "/locations",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    url: "/locations/kendallville",
    title: "Manufactured & Modular Homes in Kendallville, IN",
    description: "Champion homes delivered to Kendallville & Noble County. 20 miles from our Auburn showroom, zoning-friendly rural placement.",
    topics: ["locations", "kendallville", "noble-county", "indiana"],
    cluster: "locations",
    pillar: "/locations",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    url: "/locations/angola",
    title: "Manufactured & Modular Homes in Angola, IN",
    description: "Champion homes delivered to Angola & Steuben County lake country. 25 miles up I-69 from our Auburn showroom.",
    topics: ["locations", "angola", "steuben-county", "indiana"],
    cluster: "locations",
    pillar: "/locations",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    url: "/locations/new-haven",
    title: "Manufactured & Modular Homes in New Haven, IN",
    description: "Champion homes delivered to New Haven & eastern Allen County. Factory-direct from our nearby Auburn showroom.",
    topics: ["locations", "new-haven", "allen-county", "indiana"],
    cluster: "locations",
    pillar: "/locations",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    url: "/locations/columbia-city",
    title: "Manufactured & Modular Homes in Columbia City, IN",
    description: "Champion homes delivered to Columbia City & Whitley County. Factory-direct from our Auburn showroom.",
    topics: ["locations", "columbia-city", "whitley-county", "indiana"],
    cluster: "locations",
    pillar: "/locations",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    url: "/locations/churubusco",
    title: "Manufactured & Modular Homes in Churubusco, IN",
    description: "Champion homes delivered to Churubusco. 22 miles from our Auburn showroom — one of our closest areas.",
    topics: ["locations", "churubusco", "whitley-county", "indiana"],
    cluster: "locations",
    pillar: "/locations",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    url: "/locations/ligonier",
    title: "Manufactured & Modular Homes in Ligonier, IN",
    description: "Champion homes delivered to Ligonier & western Noble County. Zoning-friendly rural placement, factory-direct pricing.",
    topics: ["locations", "ligonier", "noble-county", "indiana"],
    cluster: "locations",
    pillar: "/locations",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    url: "/locations/albion",
    title: "Manufactured & Modular Homes in Albion, IN",
    description: "Champion homes delivered to Albion & central Noble County near Chain O'Lakes. Factory-direct from our Auburn showroom.",
    topics: ["locations", "albion", "noble-county", "indiana"],
    cluster: "locations",
    pillar: "/locations",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    url: "/locations/fort-wayne",
    title: "Manufactured Homes Fort Wayne IN",
    description: "Champion homes delivered to Fort Wayne. 30 miles from our Auburn showroom. Serving Allen County.",
    topics: ["locations", "fort-wayne", "allen-county", "indiana"],
    cluster: "locations",
    pillar: "/locations",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    url: "/locations/indianapolis",
    title: "Manufactured Homes Indianapolis IN",
    description: "Champion homes delivered to Indianapolis. Serving central Indiana from our Auburn showroom.",
    topics: ["locations", "indianapolis", "marion-county", "indiana"],
    cluster: "locations",
    pillar: "/locations",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    url: "/locations/toledo",
    title: "Manufactured Homes Toledo OH",
    description: "Champion homes delivered to Toledo, Ohio. 75 miles from Auburn. Serving Lucas County.",
    topics: ["locations", "toledo", "lucas-county", "ohio"],
    cluster: "locations",
    pillar: "/locations",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    url: "/locations/kalamazoo",
    title: "Manufactured Homes Kalamazoo MI",
    description: "Champion homes delivered to Kalamazoo, Michigan. Serving Kalamazoo and Calhoun counties.",
    topics: ["locations", "kalamazoo", "michigan"],
    cluster: "locations",
    pillar: "/locations",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    url: "/locations/rural-indiana",
    title: "Manufactured Homes Rural Indiana",
    description: "Champion homes for rural Indiana. Noble, DeKalb, Whitley, Steuben counties. Zoning-friendly.",
    topics: ["locations", "rural", "noble-county", "dekalb-county", "indiana", "zoning"],
    cluster: "locations",
    pillar: "/locations",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    url: "/locations/noble-county",
    title: "Manufactured Homes Noble County IN",
    description: "Champion homes delivered to Noble County. Serving Kendallville, Ligonier, Albion.",
    topics: ["locations", "noble-county", "indiana", "rural"],
    cluster: "locations",
    pillar: "/locations",
    priority: 0.7,
    changeFrequency: "monthly",
  },
  {
    url: "/locations/dekalb-county",
    title: "Manufactured Homes DeKalb County IN",
    description: "Champion homes in DeKalb County. Auburn's local dealer serving Butler, Garrett, Waterloo.",
    topics: ["locations", "dekalb-county", "indiana", "rural"],
    cluster: "locations",
    pillar: "/locations",
    priority: 0.7,
    changeFrequency: "monthly",
  },
  {
    url: "/locations/whitley-county",
    title: "Manufactured Homes Whitley County IN",
    description: "Champion homes delivered to Whitley County. Serving Columbia City, South Whitley, Churubusco.",
    topics: ["locations", "whitley-county", "indiana", "rural"],
    cluster: "locations",
    pillar: "/locations",
    priority: 0.7,
    changeFrequency: "monthly",
  },
  {
    url: "/locations/steuben-county",
    title: "Manufactured Homes Steuben County IN",
    description: "Champion homes delivered to Steuben County. Serving Angola, Fremont, Ashley.",
    topics: ["locations", "steuben-county", "indiana", "rural"],
    cluster: "locations",
    pillar: "/locations",
    priority: 0.7,
    changeFrequency: "monthly",
  },
  {
    url: "/locations/lagrange-county",
    title: "Manufactured Homes LaGrange County IN",
    description: "Champion homes delivered to LaGrange County. Serving LaGrange, Shipshewana, Howe.",
    topics: ["locations", "lagrange-county", "indiana", "rural"],
    cluster: "locations",
    pillar: "/locations",
    priority: 0.7,
    changeFrequency: "monthly",
  },
  {
    url: "/locations/wells-county",
    title: "Manufactured Homes Wells County IN",
    description: "Champion homes delivered to Wells County. Serving Bluffton, Ossian, Markle.",
    topics: ["locations", "wells-county", "indiana", "rural"],
    cluster: "locations",
    pillar: "/locations",
    priority: 0.7,
    changeFrequency: "monthly",
  },
  {
    url: "/locations/adams-county",
    title: "Manufactured Homes Adams County IN",
    description: "Champion homes delivered to Adams County. Serving Decatur, Berne, Geneva.",
    topics: ["locations", "adams-county", "indiana", "rural"],
    cluster: "locations",
    pillar: "/locations",
    priority: 0.7,
    changeFrequency: "monthly",
  },
  {
    url: "/locations/garrett",
    title: "Manufactured Homes Garrett IN",
    description: "Champion homes delivered to Garrett, Indiana.",
    topics: ["locations", "garrett", "indiana", "hyperlocal"],
    cluster: "locations",
    pillar: "/locations",
    priority: 0.6,
    changeFrequency: "monthly",
  },
  {
    url: "/locations/waterloo",
    title: "Manufactured Homes Waterloo IN",
    description: "Champion homes delivered to Waterloo, Indiana.",
    topics: ["locations", "waterloo", "indiana", "hyperlocal"],
    cluster: "locations",
    pillar: "/locations",
    priority: 0.6,
    changeFrequency: "monthly",
  },
  {
    url: "/locations/butler",
    title: "Manufactured Homes Butler IN",
    description: "Champion homes delivered to Butler, Indiana.",
    topics: ["locations", "butler", "indiana", "hyperlocal"],
    cluster: "locations",
    pillar: "/locations",
    priority: 0.6,
    changeFrequency: "monthly",
  },

  // Guide Pages
  {
    url: "/guides",
    title: "Guides & Resources",
    description: "Educational guides for manufactured home buyers. Financing, pricing, buying process, and more.",
    topics: ["guides", "education", "first-time-buyers"],
    cluster: "guides",
    priority: 0.7,
    changeFrequency: "monthly",
  },
  {
    url: "/guides/buyers-guide",
    title: "Complete Manufactured Home Buyer's Guide",
    description: "Everything you need to know about buying a manufactured home. Types, financing, costs, timeline.",
    topics: ["guides", "buying-process", "first-time-buyers", "financing", "manufactured-homes"],
    cluster: "guides",
    pillar: "/guides",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    url: "/guides/financing",
    title: "Financing Options for Manufactured Homes",
    description: "Chattel, land-home, and conventional loans explained for manufactured homes.",
    topics: ["guides", "financing", "chattel-loans"],
    cluster: "guides",
    pillar: "/guides",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    url: "/guides/pricing",
    title: "How Our Pricing Works",
    description: "Line-item pricing explained. See exactly what you pay for — home, delivery, setup, site work.",
    topics: ["guides", "pricing", "transparency", "factory-direct"],
    cluster: "guides",
    pillar: "/guides",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    url: "/guides/site-work",
    title: "Site Work & Preparation Guide",
    description: "Preparing your land for a manufactured home. Foundations, utilities, permits, and costs.",
    topics: ["guides", "site-work", "foundations", "permits", "land-preparation"],
    cluster: "guides",
    pillar: "/guides",
    priority: 0.7,
    changeFrequency: "monthly",
  },
  {
    url: "/guides/zoning",
    title: "Zoning Laws for Manufactured Homes",
    description: "Zoning regulations for Indiana, Ohio, and Michigan. Placement, permits, and restrictions.",
    topics: ["guides", "zoning", "permits", "indiana", "ohio", "michigan"],
    cluster: "guides",
    pillar: "/guides",
    priority: 0.7,
    changeFrequency: "monthly",
  },
  {
    url: "/guides/manufactured-vs-modular",
    title: "Manufactured vs. Modular vs. Mobile Homes",
    description: "The difference between manufactured, modular, and mobile homes — building codes, foundations, financing, and appreciation.",
    topics: ["guides", "manufactured", "modular", "mobile-home", "comparison"],
    cluster: "guides",
    pillar: "/guides",
    priority: 0.75,
    changeFrequency: "monthly",
  },
  {
    url: "/guides/single-wide-vs-double-wide",
    title: "Single Wide vs. Double Wide",
    description: "Single wide vs. double wide manufactured homes compared — size, layout, price, land needs, and best uses.",
    topics: ["guides", "single-wide", "double-wide", "comparison"],
    cluster: "guides",
    pillar: "/guides",
    priority: 0.75,
    changeFrequency: "monthly",
  },
  {
    url: "/guides/delivery-and-setup",
    title: "Manufactured Home Delivery & Setup",
    description: "How manufactured and modular home delivery and setup works, from order to move-in in 8–12 weeks.",
    topics: ["guides", "delivery", "setup", "installation", "process"],
    cluster: "guides",
    pillar: "/guides",
    priority: 0.75,
    changeFrequency: "monthly",
  },
  // Blog Hub
  {
    url: "/blog",
    title: "The Manufactured Home Blog",
    description: "Expert guides, buyer tips, financing advice, and industry news for manufactured and modular home buyers.",
    topics: ["manufactured-homes", "first-time-buyers", "financing", "buying-process"],
    cluster: "blog",
    priority: 0.8,
    changeFrequency: "weekly",
  },
];

// Register blog posts into the page registry dynamically.
//
// THE REGISTRY IS BUILT FROM `local-posts.ts`, because that is the only thing
// `/blog/[slug]` can actually serve. Sourcing it from anywhere else has now
// gone wrong in both directions:
//
//   • Before 2026-09-14 it was built from `blog.ts`, the older editorial
//     calendar, which marks twelve posts "published" that no route serves.
//     All twelve were advertised as "Related Resources" cards across the site
//     and listed in sitemap.xml while answering 404 in production.
//   • The fix for that intersected the two lists — and the intersection is
//     EMPTY. `blog.ts` and `local-posts.ts` describe two disjoint sets of
//     posts, so from that day until 2026-09-20 not one of the thirty live
//     posts was in the registry. Nothing linked to them through PageFooter
//     (getRelatedPages returns [] for a URL it cannot find, so blog posts
//     showed no Related Resources section at all and no other page could ever
//     surface one), and their breadcrumbs fell back to title-casing the slug
//     — "Champion Vs Clayton Homes" instead of "Champion vs. Clayton Homes".
//     The sitemap was unaffected; it reads getApiBlogPosts() directly.
//
// Deriving the registry from the route's own source makes "advertised" and
// "renders" the same set by construction, which is what the guard in
// tests/internal-links.test.ts was really asking for. `blog.ts` is still read,
// but only to borrow its curated `topics` for the posts it happens to know.
import { getPublishedPosts } from "./blog";
import { localBlogPosts } from "./local-posts";

/** Curated topic tags from the editorial calendar, by slug. */
const curatedTopics = new Map(getPublishedPosts().map((post) => [post.slug, post.topics]));

/**
 * Topic tags for a post, used only to rank "Related Resources".
 *
 * A curated list from `blog.ts` wins. Otherwise the tags are derived from the
 * slug against the same controlled vocabulary the rest of the registry uses.
 * This is a ranking heuristic, not metadata anyone publishes — a post that
 * deserves better tags should get a curated entry rather than a cleverer
 * regex here.
 */
function topicsForPost(slug: string): string[] {
  const curated = curatedTopics.get(slug);
  if (curated?.length) return curated;

  const topics = new Set<string>(["manufactured-homes"]);
  // "manufactured-homes-<town>-indiana" and the "-guide" posts are the town
  // series; relating them to the /locations pages is the whole point.
  if (/^manufactured-homes-.+-(indiana|guide)$/.test(slug) || slug.endsWith("-buyers-guide")) {
    topics.add("locations");
    topics.add("service-area");
    topics.add("delivery");
  }
  if (/financ|loan|credit|mortgage/.test(slug)) topics.add("financing");
  if (/cost|pricing|price|quote/.test(slug)) topics.add("pricing");
  if (/modular/.test(slug)) topics.add("modular");
  if (/champion|clayton/.test(slug)) topics.add("champion-homes");
  if (/zoning|permit/.test(slug)) topics.add("zoning");
  if (/site-work|septic|well|foundation/.test(slug)) topics.add("site-work");
  if (/buyer|first-time|how-to|guide/.test(slug)) topics.add("first-time-buyers");
  return [...topics];
}

function buildAllPages(): SitePage[] {
  const blogPages: SitePage[] = localBlogPosts.map((post) => ({
    url: `/blog/${post.slug}`,
    title: post.title,
    // Post headlines are written as "Subject: promise" — the subject alone is
    // the crumb. "Champion vs. Clayton Homes: How to Choose in 2026" becomes
    // "Champion vs. Clayton Homes".
    shortTitle: post.title.split(/\s[:—–]\s|:\s/)[0].trim() || post.title,
    description: post.excerpt,
    topics: topicsForPost(post.slug),
    cluster: "blog" as const,
    pillar: "/blog",
    priority: 0.7,
    changeFrequency: "monthly" as const,
  }));
  return [...sitePages, ...blogPages];
}

// Get all pages including blog posts (for sitemap generation)
export function getAllPages(): SitePage[] {
  return buildAllPages();
}

// Get related pages by topic overlap, excluding the current page
export function getRelatedPages(currentUrl: string, count = 4): SitePage[] {
  const allPages = buildAllPages();
  const current = allPages.find((p) => p.url === currentUrl);
  if (!current) return [];

  return allPages
    .filter((p) => p.url !== currentUrl && p.url !== "/")
    .map((page) => {
      const sharedTopics = page.topics.filter((t) => current.topics.includes(t));
      const clusterBonus = page.cluster === current.cluster ? 2 : 0;
      return { page, score: sharedTopics.length + clusterBonus };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(({ page }) => page);
}

// Get breadcrumbs from URL hierarchy
export function getBreadcrumbs(currentUrl: string): Array<{ name: string; url: string }> {
  const allPages = buildAllPages();
  const crumbs: Array<{ name: string; url: string }> = [{ name: "Home", url: "/" }];

  if (currentUrl === "/") return crumbs;

  const segments = currentUrl.split("/").filter(Boolean);
  let path = "";

  for (const segment of segments) {
    path += `/${segment}`;
    const page = allPages.find((p) => p.url === path);
    crumbs.push({
      // A registered page names itself; only an unregistered segment falls
      // back to title-casing the slug (which produced "Champion Vs Clayton
      // Homes" for every blog post while none of them were registered).
      name:
        page?.shortTitle ||
        page?.title ||
        segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      url: path,
    });
  }

  return crumbs;
}

// Get the pillar page for a given URL
export function getPillarPage(currentUrl: string): SitePage | undefined {
  const allPages = buildAllPages();
  const current = allPages.find((p) => p.url === currentUrl);
  if (!current?.pillar) return undefined;
  return allPages.find((p) => p.url === current.pillar);
}

// Get all pages in a cluster
export function getClusterPages(cluster: SitePage["cluster"]): SitePage[] {
  return buildAllPages().filter((p) => p.cluster === cluster);
}
