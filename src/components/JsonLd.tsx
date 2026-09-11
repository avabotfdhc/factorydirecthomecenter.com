// JSON-LD structured data blocks. Each renders one <script type="application/ld+json">.

import { businessJsonLd, SITE_URL } from "@/lib/business";

const SITE = SITE_URL;

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

/** The Auburn showroom (RealEstateAgent + HomeAndConstructionBusiness), from
 *  the single source of business facts in src/lib/business.ts. */
export function LocalBusinessSchema() {
  return <JsonLd data={businessJsonLd()} />;
}

export interface ResidenceSchemaProps {
  name: string;
  slug: string;
  description: string;
  image?: string | string[];
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
