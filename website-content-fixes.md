# Content Fixes - Factory Direct Homes Center

## Typos to Fix

### 1. "Squre feet" → "Square feet"
**Location:** Floor Plans page, Special Plans page
**Elements:** Filter buttons
**Current:** `<button>Squre feet</button>`
**Fixed:** `<button>Square feet</button>`

### 2. "Signal Wide" → "Single Wide"
**Location:** Contact Us page form
**Element:** Home Type dropdown
**Current:** `<option>Signal Wide</option>`
**Fixed:** `<option>Single Wide</option>`

---

## Data Inconsistencies to Fix

### 3. Brighton Model Square Footage
**Location:** Homepage - Featured Floor Plan section
**Issue:** Two cards show different specs for same model
- Card 1: "1386" sq ft
- Card 2: "1387" sq ft
**Fix:** Verify correct spec with Champion and update both to match

---

## Broken/Placeholder Links to Fix

### 4. "Schedule a meeting" Button
**Location:** Homepage hero section
**Current:** `href="javascript:void(0);"`
**Fix:** Link to `/contact-us` or open contact modal

### 5. "Schedule A Tour" Button  
**Location:** Homepage - "Schedule a Tour and receive a $25 Outback Steakhouse Gift Card" section
**Current:** `href="javascript:void(0);"`
**Fix:** Link to `/contact-us` with query param `?tour=true` or scroll to contact form

---

## Content Updates Needed

### 6. Remove/Update Valentine's Day Banner
**Location:** Special Plans page (/special-plans)
**Current:** "Fall in Love with your home this Valentines day"
**Fix:** Remove seasonal banner or replace with current promotion

### 7. Fix About Us Location Reference
**Location:** About Us page
**Current:** "We're proud to serve the Garrett, Indiana community"
**Fix:** Change to "We're proud to serve the Auburn, Indiana community and surrounding areas"
**Note:** Your address is 1211 State Road 8, Auburn, IN 46706

### 8. Reviews Page Claims Consistency
**Location:** Reviews page
**Current:** "As the Nation's largest independently owned manufactured home retailer we have delivered homes to over 12,000 happy homeowners!"
**Issue:** About Us says you're a "new and innovative retail business"
**Fix Options:**
- Option A: Remove/modify the "Nation's largest" claim if not accurate
- Option B: Clarify if this refers to parent company or network
- Option C: Update About Us to reflect actual company history

### 9. Fix Empty City Tabs
**Location:** Contact Us page - "We are available in Major Cities" section
**Issue:** Michigan and Ohio tabs have no content
**Fix:** 
- Add major cities for Michigan (Detroit, Grand Rapids, Lansing, etc.)
- Add major cities for Ohio (Columbus, Cleveland, Cincinnati, Toledo, etc.)
- OR remove tabs if you only serve Indiana

### 10. Footer Address Link
**Location:** Footer on all pages
**Current:** `<a href="#">1211 State Road 8, Auburn, IN 46706</a>`
**Fix:** `<a href="https://www.google.com/maps/search/?api=1&query=1211%20State%20Road%208%2C%20Auburn%2C%20IN%2046706">1211 State Road 8, Auburn, IN 46706</a>`

### 11. Gallery Page Layout
**Location:** Gallery page
**Current:** Form appears BEFORE gallery images
**Fix:** Reorder so gallery images display first, form at bottom or on contact page only

---

## Content Enhancements

### 12. Add Pricing Information
**Location:** Floor plan cards
**Current:** No prices shown anywhere
**Recommendation:** Add "Starting at $XX,XXX" or price ranges to floor plan listings
**Why:** Helps qualify leads and improves conversion

### 13. Add Trust Signals
**Location:** Homepage, Footer
**Add:**
- Champion Home Builders official logo/badge
- BBB accreditation badge (if applicable)
- HUD certification mention
- Years in business (if applicable)

### 14. Blog Date Fix
**Location:** Blog page
**Issue:** Post dated "10-07-2025" appears to be a future date error
**Fix:** Verify and correct publication dates

---

## Form Improvements

### 15. Contact Form Optimization
**Location:** Contact Us page
**Current:** Very long single-page form
**Recommendations:**
- Consider multi-step form (Personal Info → Home Preferences → Contact Preferences)
- Add progress indicator
- Make phone number field auto-format (260) 308-1457
- Add form validation messages

### 16. Loans Form
**Location:** Loans & Lenders page
**Current:** Comprehensive but long
**Note:** Consider if all fields are necessary for initial inquiry

---

## Quick Reference: Files to Edit (Next.js)

Based on the site structure, these are likely the files:

```
app/
├── page.tsx                    # Homepage
├── floor-plans/
│   └── page.tsx               # Floor plans listing
├── about-us/
│   └── page.tsx               # About Us
├── contact-us/
│   └── page.tsx               # Contact page
├── faq/
│   └── page.tsx               # FAQ page
├── blog/
│   └── page.tsx               # Blog listing
├── gallery/
│   └── page.tsx               # Gallery page
├── review/
│   └── page.tsx               # Reviews page
├── loans-lenders/
│   └── page.tsx               # Loans page
├── special-plans/
│   └── page.tsx               # Specials/On Sale
├── brands/
│   └── page.tsx               # Brands page
├── layout.tsx                  # Root layout (meta tags, header, footer)
├── components/
│   ├── Header.tsx             # Navigation
│   ├── Footer.tsx             # Footer
│   ├── FloorPlanCard.tsx      # Floor plan display
│   ├── ContactForm.tsx        # Contact form
│   └── ...
```
