// Blog Post Data Model
// All posts from CMO's 10-post content calendar (2026-04-09 marketing strategy)

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  primaryKeyword: string;
  publishedDate: string;
  modifiedDate?: string;
  author: string;
  category: "explainer" | "guide" | "myth-buster" | "news" | "practical" | "industry" | "decision-guide" | "niche";
  categoryLabel: string;
  readTimeMinutes: number;
  wordCountTarget: number;
  heroImage: string;
  heroImageAlt: string;
  topics: string[];
  pillarSlug?: string;
  cta: {
    text: string;
    href: string;
    label: string;
  };
  faqs: Array<{ question: string; answer: string }>;
  published: boolean;
}

export const blogPosts: BlogPost[] = [
  // ===== Post 1 (Week 1) =====
  {
    slug: "manufactured-vs-modular-vs-mobile",
    title: "Manufactured vs. Modular vs. Mobile: What's the Real Difference?",
    description: "Learn the real differences between manufactured, modular, and mobile homes. HUD code vs. IRC code, pricing, quality, and which type is right for you.",
    primaryKeyword: "modular homes vs manufactured homes",
    publishedDate: "2026-04-14",
    author: "Factory Direct Homes Center",
    category: "explainer",
    categoryLabel: "Explainer",
    readTimeMinutes: 9,
    wordCountTarget: 1800,
    heroImage: "/images/hero-home.jpg",
    heroImageAlt: "Modern manufactured home exterior showing quality construction and contemporary design",
    topics: ["manufactured-homes", "modular", "hud-standards", "first-time-buyers", "buying-process"],
    cta: {
      text: "Download our free buyer's checklist to compare home types side-by-side.",
      href: "/guides/buyers-guide",
      label: "Download buyer checklist",
    },
    faqs: [
      {
        question: "What is the difference between a manufactured home and a modular home?",
        answer: "A manufactured home is built to federal HUD code on a permanent steel chassis in a factory and transported to your site. A modular home is built to local IRC building codes in factory sections, then assembled on a permanent foundation on-site. Both are factory-built, but they follow different building standards and have different financing and zoning rules.",
      },
      {
        question: "Are mobile homes and manufactured homes the same thing?",
        answer: "Not exactly. The term 'mobile home' refers to factory-built homes constructed before June 15, 1976, when federal HUD standards took effect. Homes built after that date are officially called manufactured homes and must meet strict federal construction and safety standards. The quality difference between pre-1976 and modern manufactured homes is enormous.",
      },
      {
        question: "Which is better, manufactured or modular?",
        answer: "It depends on your priorities. Manufactured homes cost less and can be placed on owned land or in communities. Modular homes meet local building codes and may qualify for conventional mortgages more easily. Both offer factory-built quality at prices well below site-built construction. Your budget, land situation, and financing preferences determine which is the better fit.",
      },
      {
        question: "Do manufactured homes appreciate in value?",
        answer: "Yes, manufactured homes on owned land appreciate in value. Federal Housing Finance Agency data shows manufactured homes with land appreciated 211.8% between 2000 and 2024. The key factor is land ownership — homes on leased lots in communities may not appreciate as strongly. Location, maintenance, and land ownership all influence long-term value.",
      },
      {
        question: "Can you get a mortgage on a manufactured home?",
        answer: "Yes. Manufactured homes on permanent foundations with owned land qualify for FHA, VA, USDA, and conventional mortgages. Homes without permanent foundations or on leased land typically use chattel loans (personal property loans). Chattel loans have slightly higher rates but are easier to qualify for and close faster than traditional mortgages.",
      },
    ],
    published: true,
  },

  // ===== Post 2 (Week 2) =====
  {
    slug: "first-time-buyer-checklist",
    title: "First-Time Manufactured Home Buyer's Complete Checklist",
    description: "Everything first-time manufactured home buyers need to know. Step-by-step checklist covering budget, financing, land, floor plans, inspections, and move-in.",
    primaryKeyword: "manufactured home first time buyer",
    publishedDate: "2026-04-21",
    author: "Factory Direct Homes Center",
    category: "guide",
    categoryLabel: "Buyer's Guide",
    readTimeMinutes: 12,
    wordCountTarget: 2500,
    heroImage: "/images/hero-home.jpg",
    heroImageAlt: "Happy family receiving keys to their new manufactured home",
    topics: ["first-time-buyers", "buying-process", "financing", "manufactured-homes", "site-work", "zoning"],
    cta: {
      text: "Ready to start your home buying journey? Get a personalized quote.",
      href: "/contact",
      label: "Request a quote",
    },
    faqs: [
      {
        question: "How much does a manufactured home cost?",
        answer: "New manufactured homes range from about $50,000 for a single wide to $80,000 or more for a double wide, and $100,000 or more for a modular home. These are base home prices — total cost includes delivery, setup, foundation, utility connections, and any site work. Factory Direct Homes Center provides line-item pricing so you see exactly what you pay for.",
      },
      {
        question: "What credit score do I need to buy a manufactured home?",
        answer: "Credit score requirements vary by loan type. FHA loans require a minimum 580 score for 3.5% down payment. VA loans have no official minimum but most lenders prefer 620 or higher. Chattel loans from lenders like 21st Mortgage may approve scores as low as 575. Higher scores get better interest rates across all loan types.",
      },
      {
        question: "How long does it take to buy a manufactured home?",
        answer: "The typical timeline from order to move-in is 8 to 16 weeks. This includes factory build time of 4 to 8 weeks, transportation of 1 to 2 weeks, and site setup of 2 to 4 weeks. Site preparation like foundation work and utility connections should happen during the factory build to avoid delays.",
      },
      {
        question: "Do I need to own land to buy a manufactured home?",
        answer: "No, you do not need to own land. You can place a manufactured home on leased land in a manufactured home community, on rented private land, or on land you purchase. However, owning the land significantly improves your financing options and long-term investment value. Land-home packages bundle the land purchase with the home.",
      },
      {
        question: "What inspections are required for a manufactured home?",
        answer: "All manufactured homes are inspected at the factory by HUD-certified inspectors during construction. After delivery and setup, your state or county may require a local installation inspection. Indiana requires an installer certification and site inspection. We coordinate all inspections as part of our delivery and setup process.",
      },
    ],
    published: true,
  },

  // ===== Post 3 (Week 3) =====
  {
    slug: "how-to-finance-manufactured-home",
    title: "How to Finance a Manufactured Home: Every Option Explained",
    description: "Complete guide to manufactured home financing. FHA, VA, USDA, conventional mortgages, chattel loans, and land-home packages compared with rates and requirements.",
    primaryKeyword: "manufactured home financing",
    publishedDate: "2026-04-28",
    author: "Factory Direct Homes Center",
    category: "guide",
    categoryLabel: "Financing Guide",
    readTimeMinutes: 11,
    wordCountTarget: 2200,
    heroImage: "/images/hero-home.jpg",
    heroImageAlt: "Calculator and documents representing manufactured home financing options",
    topics: ["financing", "chattel-loans", "va-loans", "fha-loans", "first-time-buyers", "manufactured-homes"],
    pillarSlug: "first-time-buyer-checklist",
    cta: {
      text: "Have financing questions? Our team can walk you through your best options.",
      href: "/contact",
      label: "Talk to a financing expert",
    },
    faqs: [
      {
        question: "What is a chattel loan for a manufactured home?",
        answer: "A chattel loan is a personal property loan used to finance a manufactured home without the land. Unlike a mortgage, a chattel loan treats the home as personal property rather than real estate. Chattel loans typically have higher interest rates than mortgages but close faster and require less documentation. They are common for homes in communities or on leased land.",
      },
      {
        question: "Can I get an FHA loan for a manufactured home?",
        answer: "Yes. FHA Title II loans finance manufactured homes on permanent foundations with owned land, requiring just 3.5% down with a 580 credit score. FHA Title I loans finance the home alone without land, with limits of $69,678 for a single section and $92,904 for a multi-section home. Both require the home to be your primary residence.",
      },
      {
        question: "Do VA loans cover manufactured homes?",
        answer: "Yes. Veterans can use VA loans to purchase a manufactured home with zero down payment and no private mortgage insurance. The home must be on a permanent foundation and classified as real property. VA loans offer the lowest interest rates available for manufactured home buyers and have no official minimum credit score requirement.",
      },
      {
        question: "What is a land-home package?",
        answer: "A land-home package bundles the purchase of land and a manufactured home into a single loan. This simplifies financing because you make one monthly payment instead of separate land and home payments. Land-home packages typically qualify for conventional mortgages, FHA loans, or VA loans, which offer lower rates than chattel loans.",
      },
      {
        question: "What interest rates can I expect for a manufactured home loan?",
        answer: "Interest rates vary by loan type. Conventional and VA mortgages for manufactured homes on permanent foundations typically range from 6% to 8%. FHA loans are similar. Chattel loans for homes without permanent foundations run higher, typically 8% to 12%. Your credit score, down payment, and loan term all affect your specific rate.",
      },
    ],
    published: true,
  },

  // ===== Posts 4-10 (Weeks 4-10) — Stubs for future content =====
  {
    slug: "do-manufactured-homes-appreciate",
    title: "Do Manufactured Homes Appreciate? The Data Says Yes",
    description: "Real data on manufactured home appreciation. FHFA shows 211.8% value growth since 2000 for homes on owned land. Learn what drives value.",
    primaryKeyword: "do manufactured homes appreciate",
    publishedDate: "2026-05-05",
    author: "Factory Direct Homes Center",
    category: "myth-buster",
    categoryLabel: "Myth Buster",
    readTimeMinutes: 8,
    wordCountTarget: 1600,
    heroImage: "/images/hero-home.jpg",
    heroImageAlt: "Modern manufactured home on owned land showing appreciating property value",
    topics: ["manufactured-homes", "first-time-buyers", "buying-process"],
    cta: { text: "See our homes and start building equity.", href: "/floor-plans", label: "View our homes" },
    faqs: [],
    published: false,
  },
  {
    slug: "2025-hud-code-update",
    title: "What the 2025 HUD Code Update Means for Your Next Home",
    description: "The 2025 HUD code update brings major improvements to manufactured home construction standards. Here's what changed and why it matters for buyers.",
    primaryKeyword: "HUD code manufactured homes",
    publishedDate: "2026-05-12",
    author: "Factory Direct Homes Center",
    category: "news",
    categoryLabel: "Industry News",
    readTimeMinutes: 7,
    wordCountTarget: 1400,
    heroImage: "/images/hero-home.jpg",
    heroImageAlt: "New manufactured home built to 2025 HUD code standards",
    topics: ["manufactured-homes", "hud-standards", "champion-homes"],
    cta: { text: "Browse homes built to the latest HUD standards.", href: "/floor-plans", label: "Browse HUD-code homes" },
    faqs: [],
    published: false,
  },
  {
    slug: "energy-upgrades-manufactured-home-rebates",
    title: "Energy Upgrades for Your Manufactured Home + 2026 Rebates",
    description: "Save money with energy upgrades for your manufactured home. Federal and state rebates available in 2026 for insulation, HVAC, windows, and more.",
    primaryKeyword: "energy efficient manufactured homes rebates 2026",
    publishedDate: "2026-05-19",
    author: "Factory Direct Homes Center",
    category: "practical",
    categoryLabel: "Tips & Savings",
    readTimeMinutes: 7,
    wordCountTarget: 1500,
    heroImage: "/images/hero-home.jpg",
    heroImageAlt: "Energy-efficient manufactured home with modern upgrades",
    topics: ["manufactured-homes", "modular"],
    cta: { text: "Get a quote on energy-efficient home options.", href: "/contact", label: "Get an upgrade quote" },
    faqs: [],
    published: false,
  },
  {
    slug: "manufactured-home-insurance-guide",
    title: "Manufactured Home Insurance: What You Need and What It Costs",
    description: "Everything you need to know about insuring a manufactured home. Coverage types, average costs, what affects your premium, and how to save.",
    primaryKeyword: "manufactured home insurance cost",
    publishedDate: "2026-05-26",
    author: "Factory Direct Homes Center",
    category: "practical",
    categoryLabel: "Tips & Savings",
    readTimeMinutes: 7,
    wordCountTarget: 1400,
    heroImage: "/images/hero-home.jpg",
    heroImageAlt: "Protected manufactured home representing insurance coverage",
    topics: ["manufactured-homes", "buying-process", "first-time-buyers"],
    cta: { text: "Download our free insurance comparison guide.", href: "/guides/buyers-guide", label: "Get a free insurance guide" },
    faqs: [],
    published: false,
  },
  {
    slug: "fastest-growing-housing-segment-2026",
    title: "Why Manufactured Homes Are the Fastest-Growing Housing Segment in 2026",
    description: "The manufactured housing market is booming. Industry data, buyer trends, and why factory-built homes are the future of affordable housing.",
    primaryKeyword: "manufactured homes for sale",
    publishedDate: "2026-06-02",
    author: "Factory Direct Homes Center",
    category: "industry",
    categoryLabel: "Industry Insight",
    readTimeMinutes: 6,
    wordCountTarget: 1300,
    heroImage: "/images/hero-home.jpg",
    heroImageAlt: "Row of new manufactured homes representing industry growth",
    topics: ["manufactured-homes", "champion-homes", "factory-direct"],
    cta: { text: "Stay informed with market updates.", href: "/contact", label: "Subscribe to newsletter" },
    faqs: [],
    published: false,
  },
  {
    slug: "land-vs-community-manufactured-home",
    title: "Land vs. Community: Where Should You Put Your Manufactured Home?",
    description: "Pros and cons of placing your manufactured home on owned land vs. a manufactured home community. Costs, financing, appreciation, and lifestyle compared.",
    primaryKeyword: "manufactured home community vs land ownership",
    publishedDate: "2026-06-09",
    author: "Factory Direct Homes Center",
    category: "decision-guide",
    categoryLabel: "Decision Guide",
    readTimeMinutes: 8,
    wordCountTarget: 1600,
    heroImage: "/images/hero-home.jpg",
    heroImageAlt: "Manufactured home on private land in a rural setting",
    topics: ["manufactured-homes", "buying-process", "zoning", "financing", "rural"],
    cta: { text: "Talk to an advisor about your best placement options.", href: "/contact", label: "Talk to an advisor" },
    faqs: [],
    published: false,
  },
  {
    slug: "va-loans-manufactured-homes-veterans-guide",
    title: "VA Loans for Manufactured Homes: A Veteran's Guide",
    description: "Complete guide to using VA loans for manufactured homes. Eligibility, requirements, benefits, and step-by-step process for veterans and service members.",
    primaryKeyword: "VA loan manufactured home",
    publishedDate: "2026-06-16",
    author: "Factory Direct Homes Center",
    category: "niche",
    categoryLabel: "Veterans",
    readTimeMinutes: 7,
    wordCountTarget: 1500,
    heroImage: "/images/hero-home.jpg",
    heroImageAlt: "Veteran family in front of their new manufactured home purchased with VA loan",
    topics: ["va-loans", "financing", "manufactured-homes", "first-time-buyers"],
    cta: { text: "Contact us to discuss VA loan options for manufactured homes.", href: "/contact", label: "Contact us" },
    faqs: [],
    published: false,
  },
];

// Get all published posts
export function getPublishedPosts(): BlogPost[] {
  return blogPosts.filter((p) => p.published).sort(
    (a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
  );
}

// Get a post by slug
export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

// Get all post slugs (for generateStaticParams)
export function getAllPostSlugs(): string[] {
  return blogPosts.filter((p) => p.published).map((p) => p.slug);
}

// Get posts by category
export function getPostsByCategory(category: BlogPost["category"]): BlogPost[] {
  return getPublishedPosts().filter((p) => p.category === category);
}

// Get all unique categories from published posts
export function getCategories(): Array<{ value: BlogPost["category"]; label: string }> {
  const cats = new Map<BlogPost["category"], string>();
  for (const post of getPublishedPosts()) {
    cats.set(post.category, post.categoryLabel);
  }
  return Array.from(cats.entries()).map(([value, label]) => ({ value, label }));
}
