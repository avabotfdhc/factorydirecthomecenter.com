// Central Citations Bank — authoritative external sources indexed by topic
// Used by: PageFooter component for automatic E-E-A-T citation rendering

export interface Citation {
  source: string;
  url: string;
  description: string;
  topics: string[];
}

const citationsBank: Citation[] = [
  // HUD & Federal Standards
  {
    source: "U.S. Department of Housing and Urban Development (HUD)",
    url: "https://www.hud.gov/program_offices/housing/mhs/mhshome",
    description: "Federal manufactured housing construction and safety standards",
    topics: ["manufactured-homes", "hud-standards", "modular"],
  },
  {
    source: "HUD Manufactured Housing Program",
    url: "https://www.hud.gov/hud-partners/manufactured-home",
    description: "Overview of manufactured housing regulations and consumer protections",
    topics: ["manufactured-homes", "buying-process", "first-time-buyers"],
  },

  // Financing & Loans
  {
    source: "Consumer Financial Protection Bureau (CFPB)",
    url: "https://www.consumerfinance.gov/housing/manufactured-housing/",
    description: "Consumer guide to manufactured home financing and buyer protections",
    topics: ["financing", "chattel-loans", "first-time-buyers", "buying-process"],
  },
  {
    source: "21st Mortgage Corporation",
    url: "https://www.21stmortgage.com/",
    description: "Manufactured home lender specializing in chattel (home-only) financing",
    topics: ["financing", "chattel-loans", "manufactured-homes"],
  },
  {
    source: "Triad Financial Services",
    url: "https://www.triadfs.com/",
    description: "Manufactured home lender offering chattel and land-home financing",
    topics: ["financing", "chattel-loans", "manufactured-homes"],
  },

  // Industry Data & Statistics
  {
    source: "Manufactured Housing Institute (MHI)",
    url: "https://www.manufacturedhousing.org/",
    description: "National trade association for manufactured housing industry data and advocacy",
    topics: ["manufactured-homes", "champion-homes", "factory-direct"],
  },
  {
    source: "U.S. Census Bureau — Manufactured Housing Survey",
    url: "https://www.census.gov/programs-surveys/mhs.html",
    description: "Annual statistics on manufactured home placements, prices, and characteristics",
    topics: ["manufactured-homes", "pricing", "single-wide", "double-wide"],
  },

  // Champion Homes
  {
    source: "Champion Homes",
    url: "https://www.championhomes.com/",
    description: "Official Champion Homes manufacturer — floor plans, features, and dealer network",
    topics: ["champion-homes", "floor-plans", "modular", "single-wide", "double-wide"],
  },

  // Indiana Specific
  {
    source: "Indiana Manufactured Housing Association (IMHA)",
    url: "https://www.indianamha.org/",
    description: "Indiana state association for manufactured housing resources and regulations",
    topics: ["indiana", "zoning", "permits", "manufactured-homes"],
  },
  {
    source: "Indiana Department of Homeland Security — Manufactured Homes",
    url: "https://www.in.gov/dhs/fire-and-building-safety/code-enforcement/industrialized-building-systems-modularmobile-structures/",
    description: "Indiana state installation standards and inspection requirements",
    topics: ["indiana", "site-work", "foundations", "permits"],
  },

  // Zoning & Land Use
  {
    source: "American Planning Association",
    url: "https://www.planning.org/knowledgebase/manufacturedhousing/",
    description: "Zoning best practices and model ordinances for manufactured housing",
    topics: ["zoning", "permits", "land-preparation"],
  },

  // Energy & Construction
  {
    source: "ENERGY STAR Manufactured Homes",
    url: "https://www.energystar.gov/partner-resources/residential-new/manufactured-national-page",
    description: "Energy efficiency standards and certifications for manufactured homes",
    topics: ["modular", "manufactured-homes", "site-work"],
  },

  // Ohio & Michigan Specific
  {
    source: "Ohio Manufactured Homes Commission",
    url: "https://com.ohio.gov/divisions-and-programs/manufactured-homes-program",
    description: "Ohio state regulations for manufactured home installation and standards",
    topics: ["ohio", "toledo", "lucas-county", "zoning", "permits"],
  },
  {
    source: "Michigan Department of Licensing and Regulatory Affairs",
    url: "https://www.michigan.gov/lara/bureau-list/bcc",
    description: "Michigan manufactured housing licensing and installation standards",
    topics: ["michigan", "kalamazoo", "zoning", "permits"],
  },

  // Rural & County
  {
    source: "National Association of Counties (NACo)",
    url: "https://www.naco.org/resources/manufactured-housing",
    description: "County-level manufactured housing policy and zoning resources",
    topics: ["rural", "noble-county", "dekalb-county", "zoning"],
  },

  // Appreciation & Value (for blog posts)
  {
    source: "Federal Housing Finance Agency (FHFA) — House Price Index",
    url: "https://www.fhfa.gov/data/hpi",
    description: "Manufactured home appreciation data showing 211.8% value growth 2000-2024",
    topics: ["manufactured-homes", "buying-process", "first-time-buyers"],
  },
  {
    source: "National Association of Realtors — Housing Affordability",
    url: "https://www.nar.realtor/research-and-statistics/housing-statistics/housing-affordability-index",
    description: "Housing affordability data comparing manufactured homes to site-built housing",
    topics: ["manufactured-homes", "first-time-buyers", "buying-process"],
  },

  // Insurance
  {
    source: "National Association of Insurance Commissioners (NAIC)",
    url: "https://content.naic.org/consumer.htm",
    description: "Manufactured home insurance guidance and consumer information",
    topics: ["manufactured-homes", "buying-process"],
  },
];

// Get citations relevant to given topics (returns top matches by topic overlap)
export function getCitations(topics: string[], count = 4): Citation[] {
  return citationsBank
    .map((cite) => {
      const overlap = cite.topics.filter((t) => topics.includes(t)).length;
      return { cite, overlap };
    })
    .filter(({ overlap }) => overlap > 0)
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, count)
    .map(({ cite }) => cite);
}

// Get citations for a page URL (looks up topics from page registry)
export function getCitationsByUrl(url: string, pageTopics: string[], count = 4): Citation[] {
  return getCitations(pageTopics, count);
}
