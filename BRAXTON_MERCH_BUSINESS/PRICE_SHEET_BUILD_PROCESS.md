# Price Sheet Build Process

**Project:** Factory Direct Homes Center Retail Price Sheets  
**Date:** April 17, 2026  
**Built By:** Ava (AI Employee)

---

## Overview

This document outlines the process for building professional retail price sheets for manufactured home dealerships. The format is based on industry-standard pricing sheets (e.g., Champion Homes Center Topeka) and can be adapted for any website build requiring transparent pricing displays.

---

## Data Requirements

### Required Fields Per Model

| Field | Description | Example |
|-------|-------------|---------|
| Model Name | Marketing name of home | Ridge, Verona, Winston |
| Model Number | Manufacturer SKU | 1676H32090, 76' Verona |
| Type | HUD or Modular | HUD |
| Size | Width × Length | 16×76, 32×76 |
| Bed/Bath | Bedroom/Bathroom count | 3/2, 4/2 |
| Sq. Ft. | Total square footage | 1,216, 2,432 |
| Total Cost | Dealer cost (internal) | $44,603 |
| MSRP | Manufacturer Suggested Retail | $127,437 |
| Discount | Amount off MSRP | -$25,000 |
| Sale Price | Final customer price | $102,437 |

### Margin Calculation

```
Gross Profit % = (Sale Price - Total Cost) / Sale Price × 100

Example:
Sale Price: $102,437
Total Cost: $44,603
Profit: $57,834
Margin: 56.5%
```

**Minimum Margin Requirement:** 35%  
**Target Margin:** 55-60%

---

## File Structure

```
pricing_sheets/
├── Aspire_Singles_Retail_Pricing_2026.csv    # Raw single wide data
├── Aspire_Sectional_Retail_Pricing_2026.csv  # Raw double wide data
├── Prime_Series_Retail_Pricing_2026.csv      # Alternative series data
├── FDHC_Price_Sheet_Single_Wide.html         # Formatted single wide sheet
├── FDHC_Price_Sheet_Double_Wide.html         # Formatted double wide sheet
└── FDHC_All_Models_Pricing.csv               # Combined export
```

---

## HTML Price Sheet Template

### Header Format

```html
<h1>[Company Name] Price Sheet for [Month Year]</h1>
<h2>[Series Name] - [Single/Multi] Section</h2>
<p>[Month Year]</p>
```

### Table Structure

| Column | Alignment | Notes |
|--------|-----------|-------|
| Name | Left | Model marketing name |
| Model No. | Left | Manufacturer SKU |
| Type | Left | HUD or Modular |
| Size | Left | Format: ##×## |
| Bed/Bath | Left | Format: #/# |
| Sq. Ft. | Right | With comma separator |
| MSRP | Right | Dollar amount |
| Discount | Right | Negative number with dash |
| Sale Price | Right | Dollar amount |

### Styling Guidelines

- **Header Background:** #d9d9d9 (light gray)
- **Featured Models:** #c6efce (light green)
- **Font:** Arial, Helvetica, sans-serif
- **Font Size:** 10-11px for table, 12px for header
- **Borders:** 1px solid #ccc (light gray)
- **Footer:** Disclaimer text, 10px, centered

### Featured Model Highlighting

Apply `background: #c6efce` to rows for:
- Best Seller
- Best Value
- Popular
- New Arrival
- Featured
- Luxury
- Premium
- Family Favorite

---

## Build Process

### Step 1: Data Collection

1. Export pricing data from manufacturer (CSV format)
2. Verify all models have complete information
3. Calculate MSRP at 65% gross profit if not provided
4. Confirm Total Cost includes all surcharges

### Step 2: Model Selection

**Single Wide:** Select 8 featured models
- Mix of sizes (e.g., 16×68 to 16×76)
- Various bed/bath configurations
- Range of price points

**Double Wide:** Select 8 featured models
- Mix of sizes (e.g., 28×56 to 32×76)
- 3/2 and 4/2 configurations
- Range of price points

### Step 3: Discount Strategy

Calculate discounts to achieve target margins:

| Price Range | Typical Discount |
|-------------|------------------|
| $100K-$110K | $19K-$25K |
| $140K-$160K | $25K-$32K |
| $175K-$200K | $32K-$38K |

**Verify:** All models maintain ≥35% margin after discount

### Step 4: HTML Generation

1. Create header with company name, series, date
2. Build table with 8 featured models
3. Apply green highlighting to featured rows
4. Add footer disclaimer
5. Set page info (Page X of Y, print date)

### Step 5: Validation

- [ ] All 8 models per category
- [ ] Margins ≥35% on all models
- [ ] Format matches industry standard
- [ ] Contact info included
- [ ] Disclaimer present

---

## Output Files

### For Email Distribution

- `FDHC_Price_Sheet_Single_Wide_[Month]_[Year].html`
- `FDHC_Price_Sheet_Double_Wide_[Month]_[Year].html`
- `FDHC_All_Models_Pricing_[Month]_[Year].csv`

### For Website Integration

- Convert HTML to React/Vue component
- Use responsive table for mobile
- Add print stylesheet
- Include PDF download option

---

## Example: FDHC April 2026

### Single Wide Results

| Model | Size | Bed/Bath | Sq.Ft. | Sale Price | Margin |
|-------|------|----------|--------|------------|--------|
| Ridge | 16×76 | 3/2 | 1,216 | $102,437 | 56.5% |
| Somerset | 16×76 | 3/2 | 1,216 | $103,909 | 56.9% |
| Monte | 16×76 | 3/2 | 1,216 | $107,823 | 57.5% |
| Floyd | 16×76 | 3/2 | 1,216 | $105,437 | 57.7% |
| Plateau | 16×72 | 3/2 | 1,152 | $104,974 | 58.0% |
| Horizon | 16×72 | 3/2 | 1,152 | $105,417 | 58.2% |
| Estill | 16×68 | 3/2 | 1,088 | $104,240 | 58.3% |
| Churchill | 16×68 | 3/2 | 1,088 | $101,626 | 58.3% |

### Double Wide Results

| Model | Size | Bed/Bath | Sq.Ft. | Sale Price | Margin |
|-------|------|----------|--------|------------|--------|
| Verona | 32×76 | 4/2 | 2,432 | $195,074 | 58.2% |
| Winston | 32×72 | 4/2 | 2,304 | $195,837 | 58.4% |
| Madison | 28×76 | 4/2 | 2,176 | $177,026 | 58.1% |
| Henderson | 32×76 | 4/2 | 2,432 | $199,931 | 59.0% |
| Shelby | 28×76 | 4/2 | 2,176 | $185,312 | 58.8% |
| Pinnacle | 28×56 | 3/2 | 1,568 | $152,843 | 58.1% |
| Baldwin | 28×76 | 4/2 | 2,128 | $175,166 | 58.6% |
| Grand | 28×64 | 3/2 | 1,792 | $142,700 | 58.9% |

---

## Tools Used

- **Data Source:** Manufacturer CSV exports
- **Build Tool:** Python/HTML
- **Email Distribution:** AgentMail API
- **Storage:** OpenClaw workspace

---

## Notes for Future Builds

1. Always verify margin calculations before distribution
2. Update pricing monthly or as manufacturer changes occur
3. Keep raw CSV files for audit trail
4. Featured model selection should rotate based on inventory
5. Discount amounts can be adjusted to meet sales goals while maintaining margins

---

*Last Updated: April 17, 2026*
