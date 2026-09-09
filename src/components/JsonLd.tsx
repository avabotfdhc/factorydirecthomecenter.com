// JSON-LD structured data blocks. Each renders one <script type="application/ld+json">.

const SITE = "https://factorydirecthomescenter.com";

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

/** Auburn showroom as a RealEstateAgent + HomeAndConstructionBusiness. */
export function LocalBusinessSchema() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": ["RealEstateAgent", "HomeAndConstructionBusiness"],
        "@id": `${SITE}/#business`,
        name: "Factory Direct Homes Center LLC",
        description:
          "Champion manufactured and modular homes with factory-direct, line-item pricing. Auburn, Indiana showroom serving Indiana, Ohio and Michigan.",
        url: SITE,
        telephone: "+1-260-308-1457",
        email: "info@factorydirecthomescenter.com",
        image: `${SITE}/images/hero-home.jpg`,
        logo: `${SITE}/images/logo.png`,
        priceRange: "$$",
        address: {
          "@type": "PostalAddress",
          streetAddress: "1211 State Road 8",
          addressLocality: "Auburn",
          addressRegion: "IN",
          postalCode: "46706",
          addressCountry: "US",
        },
        geo: { "@type": "GeoCoordinates", latitude: 41.3653, longitude: -85.0747 },
        hasMap: "https://www.google.com/maps/dir/?api=1&destination=1211+State+Road+8+Auburn+IN+46706",
        openingHoursSpecification: [
          { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "17:00" },
          { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "10:00", closes: "16:00" },
        ],
        areaServed: [
          { "@type": "State", name: "Indiana" },
          { "@type": "State", name: "Ohio" },
          { "@type": "State", name: "Michigan" },
        ],
        makesOffer: { "@type": "Offer", itemOffered: { "@type": "Product", name: "Champion manufactured and modular homes" } },
      }}
    />
  );
}

export interface ResidenceSchemaProps {
  name: string;
  slug: string;
  description: string;
  image?: string;
  sqft?: number;
  beds?: number;
  baths?: number;
  brand?: string;
  modelNumber?: string;
  homeType?: string;
}

/** A floor plan as a SingleFamilyResidence (with the dealer as the offering business). */
export function SingleFamilyResidenceSchema(p: ResidenceSchemaProps) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "SingleFamilyResidence",
        name: p.name,
        description: p.description,
        url: `${SITE}/floor-plans/${p.slug}`,
        ...(p.image ? { image: p.image } : {}),
        ...(p.sqft ? { floorSize: { "@type": "QuantitativeValue", value: p.sqft, unitCode: "FTK" } } : {}),
        ...(p.beds ? { numberOfBedrooms: p.beds } : {}),
        ...(p.baths ? { numberOfBathroomsTotal: p.baths } : {}),
        ...(p.modelNumber ? { identifier: p.modelNumber } : {}),
        additionalProperty: [
          { "@type": "PropertyValue", name: "Manufacturer", value: p.brand || "Champion Home Builders" },
          ...(p.homeType ? [{ "@type": "PropertyValue", name: "Home type", value: p.homeType }] : []),
          { "@type": "PropertyValue", name: "Construction", value: "Factory-built, delivered from Topeka, Indiana" },
        ],
        offeredBy: { "@id": `${SITE}/#business` },
      }}
    />
  );
}

export interface FaqItem {
  q: string;
  a: string;
}

/** FAQPage schema. */
export function FaqJsonLd({ faqs }: { faqs: FaqItem[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }}
    />
  );
}
