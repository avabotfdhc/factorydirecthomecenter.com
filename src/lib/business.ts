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
/** The Google Business Profile listing — where real reviews are read and
 *  left. Named rather than indexed out of `sameAs` so reordering that list
 *  cannot silently repoint the review links. */
/** `+1-260-308-1457` → `+12603081457`, the form a `tel:` or `sms:` href wants. */
export function dialable(number: string): string {
  return number.replace(/[^\d+]/g, "");
}

export const GOOGLE_LISTING_URL =
  "https://www.google.com/maps/search/?api=1&query=Factory+Direct+Homes+Center+Auburn+IN";

/**
 * The schema.org types the dealership publishes, in one place so the nested
 * reference and the canonical node can never drift apart.
 *
 * `MobileHomeDealer` is the specific type schema.org defines for exactly this
 * business ("A mobile-home dealer"), and it was missing. `AutoDealer` — which
 * a manufactured-home dealer is sometimes tagged with because both sell
 * titled, transported units — is wrong and actively harmful: it tells Google
 * the business sells cars, and Vehicle/Car rich results are a different
 * eligibility path entirely. `RealEstateAgent` and
 * `HomeAndConstructionBusiness` stay because the dealership genuinely does
 * both: it sells homes and it coordinates the site work.
 */
export const BUSINESS_TYPES = ["MobileHomeDealer", "RealEstateAgent", "HomeAndConstructionBusiness"] as const;

export const BUSINESS = {
  legalName: "Factory Direct Homes Center LLC",
  name: "Factory Direct Homes Center",
  description:
    "Champion manufactured and modular homes with factory-direct, line-item pricing. Auburn, Indiana showroom serving Indiana, Ohio and Michigan.",
  telephone: "+1-260-308-1457",
  phoneDisplay: "(260) 308-1457",
  /**
   * The line that receives text messages — a different number from the voice
   * line, and the one the Google Business Profile advertises for texting
   * (Kyle, 2026-09-23). Until then the site's mobile "Text" button composed a
   * message to `telephone`, so every text a buyer sent from their phone went
   * to a line that does not answer them.
   *
   * Anything that opens a messaging app reads this; anything that dials reads
   * `telephone`. Never hard-code either into an `sms:` or `tel:` href —
   * `tests/contact-details.test.ts` fails on a literal number in an sms link.
   */
  smsNumber: "+1-260-750-1828",
  smsDisplay: "(260) 750-1828",
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
   * These are the five links Kyle publishes on the Google Business Profile
   * itself (supplied from the listing on 2026-09-23), so they are the
   * business's own answer to "where else are you" rather than anything
   * recovered or guessed. The two that the previous build's `utils/seo.js`
   * had supplied were close but not right — the Instagram handle in
   * particular was `factorydirecthomescenter`, where the real one carries
   * underscores — and a `sameAs` pointing at a profile that is not ours is
   * worse than no entry, because it asks Google to merge us with a stranger.
   *
   * The listing shows no LinkedIn page. Add one here only if Kyle creates it.
   */
  sameAs: [
    GOOGLE_LISTING_URL,
    "https://www.facebook.com/FactoryDirectHomesCenter",
    "https://www.instagram.com/factory_direct_homes_center/",
    "https://x.com/fd_homes_center",
    "https://youtube.com/@factorydirecthomescenter",
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
    "@type": [...BUSINESS_TYPES],
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
    "@type": [...BUSINESS_TYPES],
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
