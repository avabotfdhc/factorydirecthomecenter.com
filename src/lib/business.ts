// The one place the dealership's identity lives for structured data: name,
// address, phone, email, map pin, hours. Both JSON-LD generators
// (src/components/JsonLd.tsx, used by the root layout, and
// src/lib/seo.ts#structuredData.localBusiness, spread by the location pages)
// read from here, so every page describes the same `#business` entity.
// Before this file they each carried their own copy with different
// coordinates, map links and email — two answers for one entity, which is
// exactly what Google's knowledge graph penalises for trust.
//
// Coordinates are the ones the layout published (2026-09-09); the older seo.ts
// copy pointed at downtown Auburn. Correct them here if the pin is off, and
// nowhere else.

export const SITE_URL = "https://factorydirecthomescenter.com";
export const BUSINESS_ID = `${SITE_URL}/#business`;
/** The owner as a schema.org Person. Guides and posts cite this same @id as
 *  their author, so Google reads one named human behind the site. */
export const OWNER_ID = `${SITE_URL}/about#kyle-dudgeon`;

export const BUSINESS = {
  legalName: "Factory Direct Homes Center LLC",
  name: "Factory Direct Homes Center",
  description:
    "Champion manufactured and modular homes with factory-direct, line-item pricing. Auburn, Indiana showroom serving Indiana, Ohio and Michigan.",
  telephone: "+1-260-308-1457",
  phoneDisplay: "(260) 308-1457",
  email: "sales@factorydirecthomescenter.com",
  streetAddress: "1211 State Road 8",
  city: "Auburn",
  region: "IN",
  postalCode: "46706",
  latitude: 41.3653,
  longitude: -85.0747,
  image: `${SITE_URL}/images/hero-home.jpg`,
  logo: `${SITE_URL}/images/logo.png`,
  hasMap: "https://www.google.com/maps/dir/?api=1&destination=1211+State+Road+8+Auburn+IN+46706",
  /**
   * Public profiles that identify the same business, for the `sameAs` graph.
   *
   * The Facebook and Instagram URLs were recovered from the previous site's
   * own structured data (`utils/seo.js` in kmdudgeon/fdhc-next-frontend) at
   * Kyle's request on 2026-09-16 — they are the handles that site published,
   * not guesses. They could not be fetched from the agent sandbox (its
   * network policy blocks outbound hosts), so Kyle should open each once and
   * confirm it resolves; a dead `sameAs` entry is worse than a missing one.
   *
   * The old site also rendered YouTube and LinkedIn icons, but those URLs
   * lived in the retired CMS database (`social` table on the terminated EC2
   * instance), not in any repo, so they are unrecoverable. Add them here if
   * the profiles exist.
   */
  sameAs: [
    "https://www.google.com/maps/search/?api=1&query=Factory+Direct+Homes+Center+Auburn+IN",
    "https://www.facebook.com/factorydirecthomescenter",
    "https://www.instagram.com/factorydirecthomescenter",
  ],
  hours: [
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "17:00" },
    { days: ["Saturday"], opens: "10:00", closes: "16:00" },
  ],
  states: ["Indiana", "Ohio", "Michigan"],
  /** Month the dealership opened. Used for foundingDate and anywhere the site
   *  says how long we have been trading — so it stays one answer. */
  foundingDate: "2024-11",
  owner: {
    name: "Kyle Dudgeon",
    jobTitle: "Owner",
    /** Swap in a real photograph of Kyle when there is one; the section and the
     *  schema both drop the image cleanly while this is empty. */
    image: "",
  },
} as const;

/** The postal address, built once so every node that needs one agrees. */
export function businessAddressJsonLd(): Record<string, unknown> {
  return {
    "@type": "PostalAddress",
    streetAddress: BUSINESS.streetAddress,
    addressLocality: BUSINESS.city,
    addressRegion: BUSINESS.region,
    postalCode: BUSINESS.postalCode,
    addressCountry: "US",
  };
}

/**
 * The dealership as a NESTED node — a `provider`, `seller`, `offeredBy` or
 * `itemReviewed` inside some other schema.
 *
 * Use this and never hand-write `{ "@type": "LocalBusiness", name: "..." }`.
 * Those bare stubs were the site's most widespread markup error (15 pages on
 * Semrush's 2026-09-16 crawl): schema.org requires `address` on a
 * LocalBusiness, and a stub with no `@id` also reads as a *second* business
 * with the same name as the real one — the duplicate-entity problem
 * `businessJsonLd` exists to prevent. Carrying the same `@id` and `@type` as
 * the canonical node means Google merges the two instead of competing, and
 * the nested node still validates standalone.
 */
export function businessRef(): Record<string, unknown> {
  return {
    "@type": ["RealEstateAgent", "HomeAndConstructionBusiness"],
    "@id": BUSINESS_ID,
    name: BUSINESS.legalName,
    url: SITE_URL,
    telephone: BUSINESS.telephone,
    address: businessAddressJsonLd(),
  };
}

/** The shared LocalBusiness node. Callers may spread and add page-specific
 *  `areaServed` / `serviceArea`; they must not override identity fields. */
export function businessJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": ["RealEstateAgent", "HomeAndConstructionBusiness"],
    "@id": BUSINESS_ID,
    name: BUSINESS.legalName,
    alternateName: BUSINESS.name,
    description: BUSINESS.description,
    url: SITE_URL,
    telephone: BUSINESS.telephone,
    email: BUSINESS.email,
    image: BUSINESS.image,
    logo: BUSINESS.logo,
    priceRange: "$$",
    address: businessAddressJsonLd(),
    geo: { "@type": "GeoCoordinates", latitude: BUSINESS.latitude, longitude: BUSINESS.longitude },
    hasMap: BUSINESS.hasMap,
    sameAs: [...BUSINESS.sameAs],
    openingHoursSpecification: BUSINESS.hours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [...h.days],
      opens: h.opens,
      closes: h.closes,
    })),
    areaServed: BUSINESS.states.map((name) => ({ "@type": "State", name })),
    makesOffer: {
      "@type": "Offer",
      itemOffered: { "@type": "Product", name: "Champion manufactured and modular homes" },
    },
    foundingDate: BUSINESS.foundingDate,
    founder: ownerJsonLd(),
  };
}

/** The owner as a Person node. Referenced by @id from author bylines, so the
 *  full description is published once (on /about) and cited everywhere else. */
export function ownerJsonLd(): Record<string, unknown> {
  return {
    "@type": "Person",
    "@id": OWNER_ID,
    name: BUSINESS.owner.name,
    jobTitle: BUSINESS.owner.jobTitle,
    url: `${SITE_URL}/about`,
    ...(BUSINESS.owner.image ? { image: `${SITE_URL}${BUSINESS.owner.image}` } : {}),
    worksFor: { "@id": BUSINESS_ID },
  };
}
