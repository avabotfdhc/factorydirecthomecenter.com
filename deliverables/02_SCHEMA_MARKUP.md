# Factory Direct Homes Center
## Schema Markup (Structured Data)
### Deliverable 2 of 50+ — For Your Review

---

## What is Schema Markup?

Schema markup is code that helps search engines understand your content and display rich snippets (star ratings, prices, business info) in search results.

**Implementation:** Add this JSON-LD code to the `<head>` section of each page.

---

## 1. LocalBusiness Schema (Homepage)

**Add to:** `https://factorydirecthomescenter.com/` (homepage)

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Factory Direct Homes Center",
  "alternateName": "FDHC",
  "description": "Factory Direct Homes Center sells new Champion manufactured and modular homes at factory direct pricing. Serving Indiana, Michigan and Ohio.",
  "url": "https://factorydirecthomescenter.com",
  "logo": "https://factorydirecthomescenter.com/logo.png",
  "image": "https://factorydirecthomescenter.com/showroom.jpg",
  "telephone": "+1-260-308-1457",
  "email": "sales@factorydirecthomescenter.com",
  "priceRange": "$$",
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
    "latitude": "41.3668",
    "longitude": "-85.0583"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "18:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Saturday",
      "opens": "09:00",
      "closes": "17:00"
    }
  ],
  "areaServed": [
    {
      "@type": "State",
      "name": "Indiana"
    },
    {
      "@type": "State",
      "name": "Michigan"
    },
    {
      "@type": "State",
      "name": "Ohio"
    }
  ],
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
    "https://www.youtube.com/@FactoryDirectHomesCenter",
    "https://www.linkedin.com/factorydirecthomescenter/"
  ]
}
```

---

## 2. Product Schema (Floor Plan Detail Pages)

**Add to:** Each individual floor plan page (e.g., `/floor-plans/details/dutch-aspire-1656h22208`)

**Template:**

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "[Model Name]",
  "image": "https://factorydirecthomescenter.com/images/[model-image].jpg",
  "description": "[Model Name] is a [bedrooms]-bedroom, [bathrooms]-bathroom [type] manufactured home with [sq ft] square feet. Built by Champion Home Builders.",
  "sku": "[Model Number]",
  "brand": {
    "@type": "Brand",
    "name": "Champion Home Builders"
  },
  "manufacturer": {
    "@type": "Organization",
    "name": "Champion Home Builders"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://factorydirecthomescenter.com/floor-plans/details/[model-slug]",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "LocalBusiness",
      "name": "Factory Direct Homes Center"
    }
  },
  "additionalProperty": [
    {
      "@type": "PropertyValue",
      "name": "Bedrooms",
      "value": "[Number]"
    },
    {
      "@type": "PropertyValue",
      "name": "Bathrooms",
      "value": "[Number]"
    },
    {
      "@type": "PropertyValue",
      "name": "Square Feet",
      "value": "[Number]"
    },
    {
      "@type": "PropertyValue",
      "name": "Home Type",
      "value": "[Single Wide/Double Wide/Modular]"
    },
    {
      "@type": "PropertyValue",
      "name": "Width",
      "value": "[Number] feet"
    },
    {
      "@type": "PropertyValue",
      "name": "Length",
      "value": "[Number] feet"
    }
  ]
}
```

**Example for Dutch Aspire 1656H22208:**

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Dutch Aspire 1656H22208",
  "image": "https://factorydirecthomescenter.com/images/dutch-aspire-1656h22208.jpg",
  "description": "Dutch Aspire 1656H22208 is a 2-bedroom, 2-bathroom single wide manufactured home with 849 square feet. Built by Champion Home Builders.",
  "sku": "1656H22208",
  "brand": {
    "@type": "Brand",
    "name": "Champion Home Builders"
  },
  "manufacturer": {
    "@type": "Organization",
    "name": "Champion Home Builders"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://factorydirecthomescenter.com/floor-plans/details/dutch-aspire-1656h22208",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "LocalBusiness",
      "name": "Factory Direct Homes Center"
    }
  },
  "additionalProperty": [
    {
      "@type": "PropertyValue",
      "name": "Bedrooms",
      "value": "2"
    },
    {
      "@type": "PropertyValue",
      "name": "Bathrooms",
      "value": "2"
    },
    {
      "@type": "PropertyValue",
      "name": "Square Feet",
      "value": "849"
    },
    {
      "@type": "PropertyValue",
      "name": "Home Type",
      "value": "Single Wide"
    },
    {
      "@type": "PropertyValue",
      "name": "Width",
      "value": "16 feet"
    },
    {
      "@type": "PropertyValue",
      "name": "Length",
      "value": "56 feet"
    }
  ]
}
```

---

## 3. FAQPage Schema (FAQ Page)

**Add to:** `https://factorydirecthomescenter.com/faq`

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
        "text": "Manufactured homes are built to HUD code on a permanent chassis, designed to be moved in one or more sections. Modular homes are built to state/local building codes (IRC) in sections and assembled on-site. Tiny homes are typically under 400 sq ft and may be built on wheels or foundations. We specialize in manufactured and modular homes by Champion."
      }
    },
    {
      "@type": "Question",
      "name": "Can I Customize the Floor Plan or Interior Design?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! Champion Homes offers various customization options including flooring, cabinetry, countertops, appliance packages, exterior colors, and more. While floor plan modifications are limited in manufactured homes, modular homes offer greater flexibility. Contact us to discuss available options for your chosen model."
      }
    },
    {
      "@type": "Question",
      "name": "What's Included in the Base Price of a Home?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The base price typically includes the home structure, standard appliances (stove, refrigerator), standard fixtures, and delivery to your site within our service area. Additional costs may include site preparation, foundation, utility connections, skirting, steps, and any upgrades or customizations. We provide detailed pricing breakdowns during your consultation."
      }
    },
    {
      "@type": "Question",
      "name": "How much does a manufactured home cost in Indiana?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Manufactured home prices in Indiana vary by size and features. Single wides typically range from $50,000-$90,000, double wides from $80,000-$150,000, and modular homes from $100,000-$200,000+. These prices are for the home only and don't include site preparation, delivery, or setup. Contact Factory Direct Homes Center at (260) 308-1457 for current pricing."
      }
    },
    {
      "@type": "Question",
      "name": "Can you finance a manufactured home?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! We work with multiple lenders offering various financing options including FHA Title I and Title II loans, VA loans for veterans, conventional mortgages for modular homes on permanent foundations, and chattel loans for manufactured homes. Credit requirements vary by program. We can help you explore options and get pre-qualified."
      }
    },
    {
      "@type": "Question",
      "name": "How long does it take to get a manufactured home delivered?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Timeline varies by model and current demand. Typically, from order to delivery takes 8-16 weeks for manufactured homes and 12-20 weeks for modular homes. This includes factory construction, transportation scheduling, and site preparation coordination. Rush options may be available for certain models."
      }
    },
    {
      "@type": "Question",
      "name": "Champion Homes vs Clayton Homes: Which is better?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Both are quality manufacturers. Champion Homes (our brand) is the #2 builder nationally with a reputation for innovation, energy efficiency, and modern designs. Clayton is larger but often more expensive. Champion offers excellent value with comparable quality. As a Champion exclusive dealer, we provide factory-direct pricing and deep product expertise."
      }
    },
    {
      "@type": "Question",
      "name": "Do manufactured homes appreciate in value?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Like any home, value depends on location, condition, and market factors. Modern manufactured homes on owned land can appreciate similarly to site-built homes. Homes in well-maintained communities also hold value well. Key factors include: land ownership vs. leasing, home quality, maintenance, and local market conditions. We can discuss this in detail during your consultation."
      }
    }
  ]
}
```

---

## 4. BreadcrumbList Schema (All Pages)

**Add to:** Every page — dynamically generated based on URL structure

**For Homepage:**
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
    }
  ]
}
```

**For Floor Plans Page:**
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

**For Single Floor Plan Page:**
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
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Single Wides",
      "item": "https://factorydirecthomescenter.com/floor-plans/single-wides"
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": "Dutch Aspire 1656H22208",
      "item": "https://factorydirecthomescenter.com/floor-plans/details/dutch-aspire-1656h22208"
    }
  ]
}
```

---

## 5. Review/Rating Schema (Reviews Page)

**Add to:** `https://factorydirecthomescenter.com/review`

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Factory Direct Homes Center",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "536",
    "bestRating": "5",
    "worstRating": "1"
  },
  "review": [
    {
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": "David Brown"
      },
      "datePublished": "2024-10-30",
      "reviewBody": "Buying our mobile home was a breeze. The sales team answered all our questions, and the setup team was very professional. We had a few minor issues, but customer service was quick to respond and resolve them.",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5"
      }
    }
  ]
}
```

**Note:** Update `ratingValue` and `reviewCount` with your actual numbers. Add more review objects for recent testimonials.

---

## 6. WebSite Schema (Homepage — for Sitelinks Searchbox)

**Add to:** `https://factorydirecthomescenter.com/` (homepage, in addition to LocalBusiness)

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

## Implementation Instructions

### How to Add Schema Markup:

1. **Wrap each JSON object in a script tag:**
```html
<script type="application/ld+json">
[PASTE JSON HERE]
</script>
```

2. **Place in the `<head>` section** of each page

3. **For dynamic pages** (floor plans), use templates with variables

### Example Complete Head Section:

```html
<head>
  <title>New Champion Manufactured & Modular Homes for Sale | Factory Direct Homes Center</title>
  <meta name="description" content="Factory Direct Homes Center sells new Champion manufactured & modular homes at factory pricing. Serving Indiana, Michigan & Ohio. Call (260) 308-1457 today!">
  
  <!-- LocalBusiness Schema -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Factory Direct Homes Center",
    ...
  }
  </script>
  
  <!-- WebSite Schema -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    ...
  }
  </script>
  
  <!-- BreadcrumbList Schema -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    ...
  }
  </script>
</head>
```

---

## Testing Your Schema

After implementation, test with:

1. **Google Rich Results Test:** https://search.google.com/test/rich-results
2. **Schema Markup Validator:** https://validator.schema.org/

---

## Next Steps

1. **Review this schema markup**
2. **Confirm business hours** (I estimated M-F 9-6, Sat 9-5)
3. **Verify coordinates** (I used Auburn, IN approximate)
4. **Add actual review count** to Review schema
5. **I'll create Deliverable 3:** Image Alt Text + Optimization Guide

---

**APPROVAL NEEDED:** Reply with any changes or "APPROVED" to move to Deliverable 3.
