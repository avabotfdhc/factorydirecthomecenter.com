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
    url: "/inventory",
    title: "Available Homes & Quick Move-In",
    description: "Browse our current inventory of factory-built homes available for quick delivery. Skip the factory wait time with these ready-to-move-in Champion homes.",
    topics: ["manufactured-homes", "quick-move-in", "inventory"],
    cluster: "products",
    priority: 0.9,
    changeFrequency: "weekly",
  },
  {
    url: "/special-plans",
    title: "Homes On Sale | 25% Off MSRP",
    description: "Current sale homes with 25% off MSRP. Limited-time factory-direct pricing on select Champion manufactured and modular homes.",
    topics: ["sale", "special-plans", "manufactured-homes", "champion-homes"],
    cluster: "products",
    priority: 0.9,
    changeFrequency: "weekly",
  },
  {
    url: "/special-plans/clearance",
    title: "Clearance Homes",
    description: "Clearance and last-chance manufactured homes at factory-direct prices.",
    topics: ["clearance", "special-plans", "manufactured-homes"],
    cluster: "products",
    pillar: "/special-plans",
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
    description: "Family-owned Champion Homes dealer in Auburn, Indiana. Serving 6 states, just 20 miles from the Champion factory.",
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
    url: "/locations/auburn",
    title: "Manufactured & Modular Homes in Auburn, IN",
    description: "Our Auburn, DeKalb County showroom at 1211 State Road 8. Factory-direct Champion homes, 20 miles from the factory.",
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
