// The guide catalog. Lives here (rather than inline in /guides/page.tsx) so the
// index cards, each guide's own byline, and the Article schema all read the
// same `updated` date — a "Last updated" that only appeared in one of the three
// would be worse than none at all.
//
// `updated` is the date the guide's content last actually changed (from the
// file's git history at the time it was added here). When you edit a guide,
// bump its date.

export interface Guide {
  title: string;
  description: string;
  href: string;
  icon: string;
  readTime: string;
  /** ISO calendar date (YYYY-MM-DD) the content last changed. */
  updated: string;
}

export const guides: Guide[] = [
  {
    title: "Manufactured vs. Modular vs. Mobile",
    description:
      "The real difference between the three — building codes (HUD vs. IRC), foundations, financing, and which factory-built home is right for you.",
    href: "/guides/manufactured-vs-modular",
    icon: "🏠",
    readTime: "6 min",
    updated: "2026-08-29",
  },
  {
    title: "Single Wide vs. Double Wide",
    description:
      "Size, layout, price, and land needs compared — plus which one fits your budget, family, and property.",
    href: "/guides/single-wide-vs-double-wide",
    icon: "📐",
    readTime: "6 min",
    updated: "2026-08-15",
  },
  {
    title: "Delivery & Setup: What to Expect",
    description:
      "From order to move-in in 8–12 weeks — factory build, site prep, permitting, delivery day, and installation, step by step.",
    href: "/guides/delivery-and-setup",
    icon: "🚚",
    readTime: "6 min",
    updated: "2026-08-16",
  },
  {
    title: "Complete Buyer's Guide",
    description:
      "Everything you need to know about buying a manufactured or modular home. Types of homes, financing options, costs, and timeline.",
    href: "/guides/buyers-guide",
    icon: "📖",
    readTime: "15 min",
    updated: "2026-08-16",
  },
  {
    title: "How Our Pricing Works",
    description:
      "Understanding line-item transparency. See exactly what you're paying for and how you can save by choosing your own contractors.",
    href: "/guides/pricing",
    icon: "💰",
    readTime: "10 min",
    updated: "2026-08-30",
  },
  {
    title: "Financing Options Explained",
    description:
      "Chattel, land-home, and conventional loans. Which is right for you? Requirements, pros, cons, and how to qualify.",
    href: "/guides/financing",
    icon: "🏦",
    readTime: "12 min",
    updated: "2026-08-14",
  },
  {
    title: "Site Work & Preparation",
    description:
      "Land clearing, foundations, utilities, and permits. What needs to happen before your home arrives.",
    href: "/guides/site-work",
    icon: "🏗️",
    readTime: "10 min",
    updated: "2026-08-14",
  },
  {
    title: "Zoning Laws by State",
    description:
      "Manufactured home regulations in Indiana, Ohio, and Michigan. What you need to know before you buy.",
    href: "/guides/zoning",
    icon: "📋",
    readTime: "15 min",
    updated: "2026-08-29",
  },
  {
    title: "Champion Homes & Our Series",
    description:
      "Who builds the homes we sell, and how the Aspire, Prime, and Paramount series differ — plus how factory-built quality and the HUD code work.",
    href: "/champion-homes",
    icon: "🏆",
    readTime: "7 min",
    updated: "2026-08-17",
  },
];

export function getGuide(href: string): Guide | undefined {
  return guides.find((g) => g.href === href);
}

/** "2026-08-29" → "August 29, 2026", parsed as a plain calendar date. */
export function formatGuideDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
