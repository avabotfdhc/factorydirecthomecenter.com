#!/usr/bin/env python3
"""
Fix retail pricing to use 65% markup (not margin).

Markup Formula:
- True Cost = Base Price + Surcharge + $2,500 Dealer Pack
- MSRP = True Cost × 1.65

This gives 65% markup over cost (not 65% gross profit margin)
"""

import csv
import os

DEALER_PACK = 2500
MARKUP_PERCENT = 0.65

def parse_price(price_str):
    """Parse price string like '$25,495' to float"""
    return float(price_str.replace('$', '').replace(',', ''))

def format_price(price):
    """Format price as currency string"""
    return f"${price:,.0f}"

def calculate_retail_price(base_price, surcharge, dealer_pack):
    """
    Calculate retail price with 65% markup over true cost.
    
    Formula: MSRP = (Base + Surcharge + Pack) × 1.65
    """
    true_cost = base_price + surcharge + dealer_pack
    retail_price = true_cost * (1 + MARKUP_PERCENT)
    return retail_price

def process_aspire_singles():
    """Process Aspire Singles pricing"""
    input_file = '/Users/ava/.openclaw/workspace/pricing_sheets/Aspire_Singles_Retail_Pricing_2026.csv'
    output_file = '/Users/ava/.openclaw/workspace/pricing_sheets/Aspire_Singles_Retail_Pricing_2026_FIXED.csv'
    
    models = []
    with open(input_file, 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            model = row['Model Name']
            sqft = int(row['Square Feet'])
            base = parse_price(row['Base Price'])
            surcharge = parse_price(row['Surcharge ($0.50/sqft)'])
            
            # Calculate correct retail price
            retail = calculate_retail_price(base, surcharge, DEALER_PACK)
            
            # Calculate true cost and markup amount
            true_cost = base + surcharge + DEALER_PACK
            markup_amount = retail - true_cost
            
            models.append({
                'Model': model,
                'Sq Ft': sqft,
                'Base Price': format_price(base),
                'Surcharge': format_price(surcharge),
                'Dealer Pack': format_price(DEALER_PACK),
                'True Cost': format_price(true_cost),
                'MSRP (65% Markup)': format_price(retail),
                'Markup Amount': format_price(markup_amount),
                'Markup %': f"{MARKUP_PERCENT*100:.0f}%"
            })
    
    # Write output
    with open(output_file, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=models[0].keys())
        writer.writeheader()
        writer.writerows(models)
    
    print(f"Aspire Singles: {len(models)} models processed")
    print(f"Sample - Model {models[0]['Model']}:")
    print(f"  True Cost: {models[0]['True Cost']}")
    print(f"  MSRP: {models[0]['MSRP (65% Markup)']}")
    
    return models

def process_aspire_sectional():
    """Process Aspire Sectional (Double Wide) pricing"""
    input_file = '/Users/ava/.openclaw/workspace/pricing_sheets/Aspire_Sectional_Retail_Pricing_2026.csv'
    output_file = '/Users/ava/.openclaw/workspace/pricing_sheets/Aspire_Sectional_Retail_Pricing_2026_FIXED.csv'
    
    models = []
    with open(input_file, 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            model = row['Model Name']
            sqft = int(row['Square Feet'])
            base = parse_price(row['Base Price'])
            surcharge = parse_price(row['Surcharge ($0.65/sqft)'])
            
            # Calculate correct retail price
            retail = calculate_retail_price(base, surcharge, DEALER_PACK)
            
            # Calculate true cost and markup amount
            true_cost = base + surcharge + DEALER_PACK
            markup_amount = retail - true_cost
            
            models.append({
                'Model': model,
                'Sq Ft': sqft,
                'Base Price': format_price(base),
                'Surcharge': format_price(surcharge),
                'Dealer Pack': format_price(DEALER_PACK),
                'True Cost': format_price(true_cost),
                'MSRP (65% Markup)': format_price(retail),
                'Markup Amount': format_price(markup_amount),
                'Markup %': f"{MARKUP_PERCENT*100:.0f}%"
            })
    
    # Write output
    with open(output_file, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=models[0].keys())
        writer.writeheader()
        writer.writerows(models)
    
    print(f"\nAspire Sectional: {len(models)} models processed")
    print(f"Sample - Model {models[0]['Model']}:")
    print(f"  True Cost: {models[0]['True Cost']}")
    print(f"  MSRP: {models[0]['MSRP (65% Markup)']}")
    
    return models

def process_prime_series():
    """Process Prime Series pricing"""
    input_file = '/Users/ava/.openclaw/workspace/pricing_sheets/Prime_Series_Retail_Pricing_2026.csv'
    output_file = '/Users/ava/.openclaw/workspace/pricing_sheets/Prime_Series_Retail_Pricing_2026_FIXED.csv'
    
    models = []
    with open(input_file, 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            model = row['Model Name']
            sqft = int(row['Square Feet'])
            base = parse_price(row['Base Price'])
            # Prime series has no surcharge
            surcharge = 0
            
            # Calculate correct retail price
            retail = calculate_retail_price(base, surcharge, DEALER_PACK)
            
            # Calculate true cost and markup amount
            true_cost = base + surcharge + DEALER_PACK
            markup_amount = retail - true_cost
            
            models.append({
                'Model': model,
                'Sq Ft': sqft,
                'Base Price': format_price(base),
                'Surcharge': format_price(surcharge),
                'Dealer Pack': format_price(DEALER_PACK),
                'True Cost': format_price(true_cost),
                'MSRP (65% Markup)': format_price(retail),
                'Markup Amount': format_price(markup_amount),
                'Markup %': f"{MARKUP_PERCENT*100:.0f}%"
            })
    
    # Write output
    with open(output_file, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=models[0].keys())
        writer.writeheader()
        writer.writerows(models)
    
    print(f"\nPrime Series: {len(models)} models processed")
    print(f"Sample - Model {models[0]['Model']}:")
    print(f"  True Cost: {models[0]['True Cost']}")
    print(f"  MSRP: {models[0]['MSRP (65% Markup)']}")
    
    return models

def create_master_sheet(singles, sectionals, prime):
    """Create combined master price sheet"""
    output_file = '/Users/ava/.openclaw/workspace/pricing_sheets/FDHC_Retail_Price_Sheet_2026_FIXED.csv'
    
    all_models = []
    
    # Add category column to each
    for m in singles:
        m['Category'] = 'Aspire Single Wide'
        all_models.append(m)
    
    for m in sectionals:
        m['Category'] = 'Aspire Sectional'
        all_models.append(m)
        
    for m in prime:
        m['Category'] = 'Prime Series'
        all_models.append(m)
    
    # Reorder columns
    fieldnames = ['Category', 'Model', 'Sq Ft', 'Base Price', 'Surcharge', 
                  'Dealer Pack', 'True Cost', 'MSRP (65% Markup)', 'Markup Amount', 'Markup %']
    
    with open(output_file, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(all_models)
    
    print(f"\nMaster sheet created: {len(all_models)} total models")
    
    # Print summary statistics
    retail_prices = [parse_price(m['MSRP (65% Markup)']) for m in all_models]
    true_costs = [parse_price(m['True Cost']) for m in all_models]
    
    print(f"\n=== SUMMARY STATISTICS ===")
    print(f"Total Models: {len(all_models)}")
    print(f"MSRP Range: ${min(retail_prices):,.0f} - ${max(retail_prices):,.0f}")
    print(f"Average MSRP: ${sum(retail_prices)/len(retail_prices):,.0f}")
    print(f"True Cost Range: ${min(true_costs):,.0f} - ${max(true_costs):,.0f}")
    print(f"Average True Cost: ${sum(true_costs)/len(true_costs):,.0f}")

if __name__ == '__main__':
    print("Fixing FDHC Retail Pricing - 65% Markup (Not Margin)")
    print("=" * 60)
    print(f"Formula: MSRP = (Base + Surcharge + ${DEALER_PACK}) × {1+MARKUP_PERCENT}")
    print("=" * 60 + "\n")
    
    singles = process_aspire_singles()
    sectionals = process_aspire_sectional()
    prime = process_prime_series()
    
    create_master_sheet(singles, sectionals, prime)
    
    print("\n" + "=" * 60)
    print("FIXED price sheets created:")
    print("  - Aspire_Singles_Retail_Pricing_2026_FIXED.csv")
    print("  - Aspire_Sectional_Retail_Pricing_2026_FIXED.csv")
    print("  - Prime_Series_Retail_Pricing_2026_FIXED.csv")
    print("  - FDHC_Retail_Price_Sheet_2026_FIXED.csv")
    print("=" * 60)
