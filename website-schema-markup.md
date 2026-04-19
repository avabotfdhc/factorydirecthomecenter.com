# Schema Markup - Factory Direct Homes Center

## 1. LocalBusiness Schema (Add to all pages)

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Factory Direct Homes Center",
  "alternateName": "Factory Direct Homes Center LLC",
  "description": "Factory Direct Homes Center in Auburn, IN offers new Champion manufactured homes, single wides, double wides and modular homes at factory direct pricing.",
  "url": "https://factorydirecthomescenter.com",
  "telephone": "+1-260-308-1457",
  "email": "sales@factorydirecthomescenter.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "1211 State Road 8",
    "addressLocality": "Auburn",
    "addressRegion": "IN",
    "postalCode": "46706",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "41.3503",
    "longitude": "-85.0575"
  },
  "openingHours": [
    "Mo-Fr 09:00-17:00",
    "Sa 10:00-16:00"
  ],
  "image": "https://factorydirecthomescenter.com/logo.png",
  "priceRange": "$",
  "areaServed": {
    "@type": "GeoCircle",
    "geoMidpoint": {
      "@type": "GeoCoordinates",
      "latitude": "41.3503",
      "longitude": "-85.0575"
    },
    "geoRadius": "150 miles"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Manufactured Homes",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": "Single Wide Manufactured Homes"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": "Double Wide Manufactured Homes"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": "Modular Homes"
        }
      }
    ]
  },
  "sameAs": [
    "https://www.facebook.com/FactoryDirectHomesCenter/",
    "https://www.instagram.com/factory_direct_homes_center/",
    "https://www.linkedin.com/factorydirecthomescenter/",
    "https://www.youtube.com/@FactoryDirectHomesCenter"
  ]
}
```

---

## 2. FAQPage Schema (For FAQ page)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What's the Difference Between Manufactured, Modular, and Tiny Homes?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Manufactured homes are built entirely in a factory to HUD code and transported to the site. Modular homes are also factory-built but to local/state building codes and assembled on-site. Tiny homes are typically under 400 sq ft and may be built on wheels or foundations."
      }
    },
    {
      "@type": "Question",
      "name": "Can I Customize the Floor Plan or Interior Design?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! We offer extensive customization options including floor plan modifications, interior finishes, appliance packages, and exterior features. Work with our design team to create your dream home."
      }
    },
    {
      "@type": "Question",
      "name": "What's Included in the Base Price of a Home?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The base price typically includes the home construction, standard appliances, basic fixtures, and delivery to your site. Additional costs may include site preparation, foundation, utility connections, and optional upgrades."
      }
    }
  ]
}
```

---

## 3. Product Schema (For Floor Plan pages)

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Brighton - Aspire Series",
  "description": "Beautiful 3 bedroom, 2 bathroom double wide manufactured home with 1,386 sq ft of living space.",
  "brand": {
    "@type": "Brand",
    "name": "Champion Home Builders"
  },
  "manufacturer": {
    "@type": "Organization",
    "name": "Champion Home Builders"
  },
  "model": "2852H32170",
  "sku": "2852H32170",
  "category": "Double Wide Manufactured Home",
  "offers": {
    "@type": "Offer",
    "url": "https://factorydirecthomescenter.com/brands/champion-home-builders/series/aspire/floor-plans/Sectionals/brighton",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "LocalBusiness",
      "name": "Factory Direct Homes Center"
    }
  },
  "additionalProperty": [
    {
      "@type": "PropertyValue",
      "name": "Square Feet",
      "value": "1386"
    },
    {
      "@type": "PropertyValue",
      "name": "Bedrooms",
      "value": "3"
    },
    {
      "@type": "PropertyValue",
      "name": "Bathrooms",
      "value": "2"
    },
    {
      "@type": "PropertyValue",
      "name": "Width",
      "value": "28'"
    },
    {
      "@type": "PropertyValue",
      "name": "Length",
      "value": "52'"
    }
  ]
}
```

---

## 4. BreadcrumbList Schema (For all pages)

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://factorydirecthomescenter.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Floor Plans",
      "item": "https://factorydirecthomescenter.com/floor-plans"
    }
  ]
}
```

---

## 5. WebSite Schema (For homepage)

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Factory Direct Homes Center",
  "url": "https://factorydirecthomescenter.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://factorydirecthomescenter.com/floor-plans?search={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
```

---

## 6. Review/Rating Schema (For Reviews page)

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Factory Direct Homes Center",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "536"
  },
  "review": [
    {
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": "David Brown"
      },
      "datePublished": "2024-10-30",
      "reviewBody": "Buying our mobile home was a breeze. The sales team answered all our questions, and the setup team was very professional.",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5"
      }
    }
  ]
}
```

---

## Implementation Notes

### For Next.js App Router:

Add schema to each page's `page.tsx` using the `jsonLd` export or inline script:

```tsx
// app/page.tsx
export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema)
        }}
      />
      {/* page content */}
    </>
  )
}
```

Or use Next.js metadata API:

```tsx
export const metadata = {
  other: {
    'json-ld': JSON.stringify(localBusinessSchema)
  }
}
```

### Validation Tools:
- Google Rich Results Test: https://search.google.com/test/rich-results
- Schema.org Validator: https://validator.schema.org/
