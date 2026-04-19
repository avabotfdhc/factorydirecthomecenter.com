# Website Fix Implementation Guide

## Overview
This document contains all the code changes needed to fix the Factory Direct Homes Center website.

---

## Phase 1: Layout & Meta Tags

### File: `app/layout.tsx`

Add the following metadata and schema to the root layout:

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://factorydirecthomescenter.com'),
  title: {
    template: '%s | Factory Direct Homes Center',
    default: 'Manufactured & Modular Homes for Sale in Indiana | Factory Direct Homes Center',
  },
  description: 'Factory Direct Homes Center in Auburn, IN offers new Champion manufactured homes, single wides, double wides & modular homes at factory direct pricing. Serving Indiana, Ohio & Michigan.',
  keywords: ['manufactured homes', 'modular homes', 'mobile homes', 'single wide', 'double wide', 'Champion Homes', 'Auburn IN', 'Indiana'],
  authors: [{ name: 'Factory Direct Homes Center' }],
  creator: 'Factory Direct Homes Center',
  publisher: 'Factory Direct Homes Center',
  formatDetection: {
    telephone: true,
    email: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://factorydirecthomescenter.com',
    siteName: 'Factory Direct Homes Center',
    title: 'Manufactured & Modular Homes for Sale in Indiana | Factory Direct Homes Center',
    description: 'Factory Direct Homes Center in Auburn, IN offers new Champion manufactured homes at factory direct pricing.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Factory Direct Homes Center - Manufactured Homes in Auburn, IN',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@FactoryDirectHomes',
    title: 'Manufactured & Modular Homes for Sale | Factory Direct Homes Center',
    description: 'Factory Direct Homes Center in Auburn, IN offers new Champion manufactured homes at factory direct pricing.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'YOUR_GOOGLE_VERIFICATION_CODE', // Add if you have one
  },
  alternates: {
    canonical: '/',
  },
}
```

---

## Phase 2: Individual Page Metadata

### File: `app/page.tsx` (Homepage)

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Manufactured & Modular Homes for Sale in Indiana | Factory Direct Homes Center',
  description: 'Factory Direct Homes Center in Auburn, IN offers new Champion manufactured homes, single wides, double wides & modular homes at factory direct pricing. Serving Indiana, Ohio & Michigan.',
  alternates: {
    canonical: 'https://factorydirecthomescenter.com/',
  },
}

// Add LocalBusiness and WebSite schema
const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Factory Direct Homes Center',
  // ... (full schema from schema-markup.md)
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  // ... (full schema from schema-markup.md)
}
```

### File: `app/floor-plans/page.tsx`

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Floor Plans & Inventory | Manufactured & Modular Homes',
  description: 'Browse our complete inventory of single wide, double wide, and modular home floor plans. Filter by size, bedrooms, bathrooms & price. Champion Home Builders.',
  alternates: {
    canonical: 'https://factorydirecthomescenter.com/floor-plans',
  },
}
```

### File: `app/about-us/page.tsx`

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us | Factory Direct Homes Center | Auburn, IN',
  description: 'Factory Direct Homes Center is Auburn, Indiana\'s premier manufactured home retailer. We sell new Champion homes at factory direct prices with exceptional service.',
  alternates: {
    canonical: 'https://factorydirecthomescenter.com/about-us',
  },
}
```

### File: `app/contact-us/page.tsx`

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us | Factory Direct Homes Center | Auburn, IN',
  description: 'Contact Factory Direct Homes Center in Auburn, IN. Call (260) 308-1457 or visit us at 1211 State Road 8. Schedule a tour & get a $25 Outback gift card!',
  alternates: {
    canonical: 'https://factorydirecthomescenter.com/contact-us',
  },
}
```

### File: `app/faq/page.tsx`

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ | Manufactured & Modular Home Questions',
  description: 'Get answers to common questions about manufactured homes, modular homes, financing, customization & the buying process. Factory Direct Homes Center FAQ.',
  alternates: {
    canonical: 'https://factorydirecthomescenter.com/faq',
  },
}

// Add FAQPage schema
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  // ... (full schema from schema-markup.md)
}
```

### File: `app/blog/page.tsx`

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog | Manufactured Housing News & Tips',
  description: 'Stay informed with the latest news, tips & insights about manufactured homes, modular housing, financing options & homeownership. Read our blog.',
  alternates: {
    canonical: 'https://factorydirecthomescenter.com/blog',
  },
}
```

### File: `app/gallery/page.tsx`

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Photo Gallery | Manufactured & Modular Homes',
  description: 'Browse photos of our manufactured homes, modular homes & completed projects. See single wides, double wides & modular designs. Visit our gallery.',
  alternates: {
    canonical: 'https://factorydirecthomescenter.com/gallery',
  },
}
```

### File: `app/review/page.tsx`

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Customer Reviews | Factory Direct Homes Center | Auburn, IN',
  description: 'Read reviews from satisfied Factory Direct Homes Center customers. See why homeowners in Indiana, Ohio & Michigan choose us for their manufactured homes.',
  alternates: {
    canonical: 'https://factorydirecthomescenter.com/review',
  },
}

// Add Review schema
const reviewSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  // ... (full schema from schema-markup.md)
}
```

### File: `app/loans-lenders/page.tsx`

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Financing & Loans | Manufactured Home Financing',
  description: 'Explore manufactured home financing options. We work with multiple lenders to help you get approved. Apply online or call (260) 308-1457.',
  alternates: {
    canonical: 'https://factorydirecthomescenter.com/loans-lenders',
  },
}
```

### File: `app/special-plans/page.tsx`

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Homes On Sale | Clearance & Special Pricing',
  description: 'Save thousands on manufactured homes! Browse our clearance inventory, used homes & special pricing on single wides, double wides & modulars.',
  alternates: {
    canonical: 'https://factorydirecthomescenter.com/special-plans',
  },
}
```

---

## Phase 3: Component Fixes

### Fix 1: "Squre feet" → "Square feet"

Find the filter button component (likely in `components/Filters.tsx` or similar):

```tsx
// BEFORE:
<button>Squre feet</button>

// AFTER:
<button>Square feet</button>
```

### Fix 2: "Signal Wide" → "Single Wide"

In the Contact form component:

```tsx
// BEFORE:
<option value="single-wide">Signal Wide</option>

// AFTER:
<option value="single-wide">Single Wide</option>
```

### Fix 3: Fix Schedule Button Links

In the Hero section component:

```tsx
// BEFORE:
<a href="javascript:void(0);">Schedule a meeting</a>

// AFTER:
<a href="/contact-us">Schedule a meeting</a>
// OR:
<a href="#contact">Schedule a meeting</a>
```

In the Tour section:

```tsx
// BEFORE:
<a href="javascript:void(0);">Schedule A Tour</a>

// AFTER:
<a href="/contact-us?tour=true">Schedule A Tour</a>
// OR with scroll:
<a href="#contact" onClick={scrollToContact}>Schedule A Tour</a>
```

### Fix 4: Footer Address Link

In the Footer component:

```tsx
// BEFORE:
<a href="#">1211 State Road 8, Auburn, IN 46706</a>

// AFTER:
<a 
  href="https://www.google.com/maps/search/?api=1&query=1211%20State%20Road%208%2C%20Auburn%2C%20IN%2046706"
  target="_blank"
  rel="noopener noreferrer"
>
  1211 State Road 8, Auburn, IN 46706
</a>
```

---

## Phase 4: Content Updates

### Fix: About Us Location

In `app/about-us/page.tsx` or content file:

```tsx
// BEFORE:
"We're proud to serve the Garrett, Indiana community"

// AFTER:
"We're proud to serve the Auburn, Indiana community and surrounding areas including Garrett, Fort Wayne, and Decatur."
```

### Fix: Reviews Page Claims

In `app/review/page.tsx`:

```tsx
// BEFORE:
"As the Nation's largest independently owned manufactured home retailer we have delivered homes to over 12,000 happy homeowners!"

// AFTER (Option A - Conservative):
"We're proud to have helped hundreds of families find their dream homes. Here's what some of our satisfied customers have to say:"

// AFTER (Option B - If claim is accurate):
"As part of the Champion Home Builders network, we've helped thousands of families achieve homeownership. Here's what our customers say about their experience with us:"
```

### Fix: Remove Valentine's Banner

In `app/special-plans/page.tsx`:

```tsx
// REMOVE or COMMENT OUT:
{/* 
<h2>Fall in Love with your home this Valentines day</h2>
*/}

// OR replace with:
<h2>Special Pricing on Select Models</h2>
```

### Fix: Gallery Page Layout

In `app/gallery/page.tsx`, reorder components:

```tsx
// BEFORE:
<ContactForm />  {/* Form at top */}
<GalleryGrid />  {/* Images at bottom */}

// AFTER:
<GalleryGrid />  {/* Images at top */}
<ContactForm />  {/* Form at bottom */}
// OR remove ContactForm from gallery page entirely
```

### Fix: Contact Page City Tabs

In `app/contact-us/page.tsx`, add content or remove empty tabs:

```tsx
// OPTION A: Add Michigan cities
const michiganCities = ['Detroit', 'Grand Rapids', 'Lansing', 'Ann Arbor', 'Kalamazoo']

// OPTION B: Add Ohio cities  
const ohioCities = ['Columbus', 'Cleveland', 'Cincinnati', 'Toledo', 'Dayton']

// OPTION C: Remove tabs if only serving Indiana
// Just show Indiana cities
```

---

## Phase 5: Brighton Model Fix

In the Featured Floor Plan section (homepage), ensure both cards show consistent data:

```tsx
// Card 1 and Card 2 should both show:
sqFt: "1386"  // Verify correct number with Champion
```

---

## Deployment Checklist

- [ ] All page titles updated
- [ ] All meta descriptions added
- [ ] Open Graph tags added
- [ ] Schema markup added
- [ ] Typos fixed (Squre → Square, Signal → Single)
- [ ] Broken links fixed (Schedule buttons)
- [ ] Footer address link fixed
- [ ] About Us location fixed
- [ ] Reviews claims updated
- [ ] Valentine's banner removed/updated
- [ ] Gallery layout fixed
- [ ] Brighton model specs consistent
- [ ] Contact page city tabs populated or removed
- [ ] Site tested on mobile
- [ ] Schema validated with Google's tool
- [ ] Sitemap submitted to Google Search Console

---

## Post-Launch SEO Tasks

1. **Submit sitemap** to Google Search Console
2. **Request indexing** for all updated pages
3. **Set up Google Analytics 4** (if not already done)
4. **Set up Google Business Profile** and link to website
5. **Create social media posts** announcing updated site
6. **Monitor search rankings** for target keywords
