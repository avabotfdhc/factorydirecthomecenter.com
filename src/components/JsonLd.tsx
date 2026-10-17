// JSON-LD structured data blocks. Each renders one <script type="application/ld+json">.

import { businessJsonLd } from "@/lib/business";
import { jsonLdScript } from "@/lib/json-ld";

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdScript(data) }}
    />
  );
}

/** The Auburn showroom (RealEstateAgent + HomeAndConstructionBusiness), from
 *  the single source of business facts in src/lib/business.ts. */
export function LocalBusinessSchema() {
  return <JsonLd data={businessJsonLd()} />;
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
