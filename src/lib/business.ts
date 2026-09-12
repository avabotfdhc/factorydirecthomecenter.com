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
  /** Public profiles that identify the same business. Only verified URLs belong here. */
  sameAs: ["https://www.google.com/maps/search/?api=1&query=Factory+Direct+Homes+Center+Auburn+IN"],
  hours: [
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "17:00" },
    { days: ["Saturday"], opens: "10:00", closes: "16:00" },
  ],
  states: ["Indiana", "Ohio", "Michigan"],
} as const;

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
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS.streetAddress,
      addressLocality: BUSINESS.city,
      addressRegion: BUSINESS.region,
      postalCode: BUSINESS.postalCode,
      addressCountry: "US",
    },
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
  };
}
