# 25% OFF MSRP Summer Sale Campaign - Launch Summary

**Launch Date:** June 13, 2026  
**Campaign End:** June 30, 2026  
**Discount:** 25% off MSRP (Manufacturer's Suggested Retail Price) base price

---

## Files Created

### 1. `/src/components/SaleDisclaimer.tsx`
- New reusable component for sale disclaimers
- Three variants: `compact`, `full`, `inline`
- Includes expandable details section
- Proper MSRP disclosure language

### 2. `/src/components/AnnouncementBar.tsx`
- Sticky announcement bar for site-wide promotion
- Gradient background with animated effects
- Dismissible by users
- Links to `/special-plans`

---

## Files Modified

### 1. `/src/components/Header.tsx`
- Added `AnnouncementBar` component above header
- Site-wide visibility of 25% OFF MSRP promotion

### 2. `/src/components/ExitIntentPopup.tsx`
- Updated offer from "$500 Off" to "25% OFF MSRP"
- Updated benefits list to reflect sale
- Updated disclaimer text
- Added "Ends June 30, 2026" urgency

### 3. `/src/app/special-plans/page.tsx`
- Updated from 20% to 25% OFF MSRP
- **Fixed hero banner image** - now uses `/images/2026-03-22-hero-autumn.png` with gradient overlay
- Updated all sale prices (25% off MSRP calculations):
  - Dutch Aspire 1656H22208: $89,900 → $67,425
  - Dutch Aspire 1652H21151: $84,900 → $63,675
  - Brighton: $145,000 → $108,750
  - Fillmore: $169,000 → $126,750
  - Silverton: $155,000 → $116,250
  - Bay Port: $162,000 → $121,500
- Updated metadata for SEO
- Replaced hardcoded disclaimer with `SaleDisclaimer` component
- Updated offer expiration to June 30, 2026

### 4. `/src/app/floor-plans/page.tsx`
- Added summer sale banner below hero section
- Added `SaleDisclaimer` component before lead capture
- Links to `/special-plans` for sale details

### 5. `/src/app/page.tsx`
- Updated `ParallaxHeroSection` with sale badge
- Added clickable "25% OFF MSRP — Summer Sale!" badge
- Links to `/special-plans`

---

## Key Messaging Updates

### Before:
- "20% OFF MSRP"
- "20% off base price"
- Offer ended May 31, 2026

### After:
- "25% OFF MSRP"
- "25% off MSRP base price"
- Offer ends June 30, 2026
- All disclaimers properly mention "MSRP (Manufacturer's Suggested Retail Price)"

---

## Disclaimer Language (Standardized)

> *25% off MSRP (Manufacturer's Suggested Retail Price) valid on all new floor plan orders placed during the promotional period. Discount applies to MSRP base price only and does not include options, upgrades, delivery, setup, or other fees. Cannot be combined with other offers or prior sales. See dealer for complete details. Financing subject to credit approval. Offer expires June 30, 2026 or while supplies last.*

---

## Visual Changes

1. **Announcement Bar**: Gradient blue-to-teal banner at top of all pages
2. **Homepage Hero**: Sale badge with arrow linking to special-plans
3. **Special Plans Hero**: Full-width background image with gradient overlay
4. **Floor Plans**: Sale banner between hero and filter tabs
5. **Exit Intent Popup**: Updated to promote 25% OFF MSRP

---

## Testing Checklist

- [x] Build passes successfully
- [x] All prices updated to 25% off MSRP
- [x] All dates updated to June 30, 2026
- [x] All disclaimers mention "MSRP"
- [x] Banner image fixed on special-plans page
- [x] Links to /special-plans work correctly
- [x] Announcement bar dismissible
- [x] Mobile responsive

---

## Next Steps

1. Deploy to production
2. Update any paid advertising campaigns with new 25% messaging
3. Notify sales team of promotion details
4. Monitor lead volume from exit intent popup
5. Track traffic to /special-plans page
