// Central Page Registry — single source of truth for all site pages
// Used by: sitemap.ts, PageFooter (related pages, breadcrumbs), llms.txt

export interface SitePage {
  url: string;
  title: string;
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
    description: "Browse 20+ Champion floor plans. Single wide, double wide, and modular homes with factory-direct pricing.",
    topics: ["floor-plans", "single-wide", "double-wide", "modular", "champion-homes"],
    cluster: "products",
    priority: 0.9,
    changeFrequency: "weekly",
  },
  {
    url: "/floor-plans/emerald-sky",
    title: "Emerald Sky | 3 Bed 2 Bath Modular Home",
    description: "1,680 sq ft modular home with 3 bedrooms, 2 baths, fireplace, kitchen island, and office/flex room.",
    topics: ["floor-plans", "modular", "champion-homes"],
    cluster: "products",
    pillar: "/floor-plans",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    url: "/financing",
    title: "Manufactured Home Financing",
    description: "Chattel loans, VA, FHA, and land-home packages for manufactured homes in Indiana, Ohio, and Michigan.",
    topics: ["financing", "chattel-loans", "va-loans", "fha-loans", "first-time-buyers"],
    cluster: "core",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    url: "/about",
    title: "About Factory Direct Homes Center",
    description: "Family-owned Champion Homes dealer in Auburn, Indiana. 500+ homes delivered across 6 states.",
    topics: ["about", "champion-homes", "factory-direct"],
    cluster: "core",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    url: "/contact",
    title: "Contact Us",
    description: "Visit our Auburn showroom, call (260) 308-1457, or send a message.",
    topics: ["contact", "showroom"],
    cluster: "core",
    priority: 0.7,
    changeFrequency: "monthly",
  },

  // Location Pages
  {
    url: "/locations",
    title: "Locations We Serve",
    description: "Champion homes delivered throughout Indiana, Ohio, Michigan, Wisconsin, and Kentucky.",
    topics: ["locations", "delivery", "service-area"],
    cluster: "locations",
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
    description: "FHA, VA, conventional, and chattel loans explained for manufactured homes.",
    topics: ["guides", "financing", "chattel-loans", "va-loans", "fha-loans"],
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

// Register blog posts into the page registry dynamically
import { getPublishedPosts } from "./blog";

function buildAllPages(): SitePage[] {
  const blogPages: SitePage[] = getPublishedPosts().map((post) => ({
    url: `/blog/${post.slug}`,
    title: post.title,
    description: post.description,
    topics: post.topics,
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
      name: page?.title || segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
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
