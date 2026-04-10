# Floor Plan Expansion Plan

## Context

Champion's Topeka factory produces 171 model numbers across singlewides, sectionals (double wides), and modulars. We currently have 10 models on the site. The CMO wants the site filled with content. Each named design variant (Monroe, Brighton, Lincoln, etc.) gets its own page since buyers search by name.

## Strategy: Named Variants as Pages

**Singlewides** — No named variants. Group by unique bed/bath/sqft combos. One page per unique layout. ~15 pages.

**Sectionals (28' wide)** — Named variants: Monroe, Appleton, Bayfield, Lancaster, Brighton, Lincoln, Ventura, Pontiac, Warren, Jackson, Pierre, Summit, Livingston, Bay Port, Silverton, Easton, Belvidere, Berkley, Woodward, Fillmore, Georgetown, Odyssey, Baldwin. Each name = different interior design. One page per name. ~23 pages.

**Sectionals (24' wide)** — Named variants: Casper, Sheridan, Sundance, Fairplay, Broomfield, Brooklyn, Glenrock. ~7 pages.

**Sectionals (32' wide)** — Named variants: Thornton, Shelby, Timberlake, Odyssey, Henderson, Madison, Winston, Verona. ~8 pages.

**Modulars** — Same floor plans as sectionals but IRC code. NOT separate pages — instead, each sectional/double-wide page notes "Also available as Modular (IRC code)" since it's the same layout.

## Implementation

### Step 1: Update floor-plans.ts data model

Add all models to `src/lib/floor-plans.ts`. For each named variant:
- slug: lowercase name (e.g., "monroe-2840", "lincoln-2856")
- Accurate specs from Box SALES PDFs
- 5 FAQs auto-generated per model
- Note modular availability

### Step 2: Correct existing 9 models

Fix specs that were inaccurate:
- Aspire 1456: Actually 2BD/1BT/747sqft (was listed as 2BD/2BT/1008sqft)
- Aspire 1672: Actually 3BD/2BT/1092sqft (was 1152)
- Aspire Modular 3276: Actually 4BD/2BT/2280sqft (was 5BD/3BT/2432)

### Step 3: Download SALES PDFs for all new models

Only the SALES PDFs — one per model. Store in `/public/images/floor-plans/pdfs/`.

### Step 4: Update floor-plans index page

The categories on the main floor plans page need to show all models, not just the original 9.

### Step 5: Register in page registry

Add all new floor plan pages to `src/lib/pages.ts` so they appear in sitemap, related pages, etc.

## Model Count

- ~15 singlewide pages
- ~7 sectional 24' pages  
- ~23 sectional 28' pages (we have 4, need 19 more)
- ~8 sectional 32' pages (we have 2, need 6 more)
- = ~53 new floor plan pages + corrections to existing 9
- Total floor plan detail pages: ~63

## Files Modified

| File | Changes |
|------|---------|
| `src/lib/floor-plans.ts` | Add ~53 new models, correct existing 9 |
| `src/app/floor-plans/page.tsx` | Update categories to show all models |
| `src/lib/pages.ts` | Register new floor plan pages |
| `public/images/floor-plans/pdfs/` | Download SALES PDFs for new models |
