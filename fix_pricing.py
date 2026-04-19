#!/usr/bin/env python3
"""
Fix retail pricing to use correct 65% gross profit margin formula.

Correct Formula:
- True Cost = Base Price + Surcharge + $2,500 Dealer Pack
- Retail Price = True Cost / (1 - 0.65) = True Cost / 0.35
- This gives 65% gross profit margin (gross profit / sale price)
"""

import csv
import os

DEALER_PACK = 2500
TARGET_MARGIN = 0.65

def parse_price(price_str):
    """Parse price string like '$25,495' to float"""
    return float(price_str.replace('$', '').replace(',', ''))

def format_price(price):
    """Format price as currency string"""
    return f"${price:,.0f}"

def calculate_retail_price(base_price, surcharge, dealer_pack):
    """
    Calculate retail price for 65% gross profit margin.
    
    Formula: Retail = (Base + Surcharge + Pack) / (1 - 0.65)
    This ensures: (Retail - True Cost) / Retail = 0.65
    """
    true_cost = base_price + surcharge + dealer_pack
    retail_price = true_cost / (1 - TARGET_MARGIN)
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
            
            # Calculate margin to verify
            true_cost = base + surcharge + DEALER_PACK
            gross_profit = retail - true_cost
            actual_margin = gross_profit / retail
            
            models.append({
                'Model': model,
                'Sq Ft': sqft,
                'Base Price': format_price(base),
                'Surcharge': format_price(surcharge),
                'Dealer Pack': format_price(DEALER_PACK),
                'True Cost': format_price(true_cost),
                'Retail Price': format_price(retail),
                'Gross Profit': format_price(gross_profit),
                'Margin %': f"{actual_margin*100:.1f}%"
            })
    
    # Write output
    with open(output_file, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=models[0].keys())
        writer.writeheader()
        writer.writerows(models)
    
    print(f"Aspire Singles: {len(models)} models processed")
    print(f"Sample - Model {models[0]['Model']}:")
    print(f"  True Cost: {models[0]['True Cost']}")
    print(f"  Retail: {models[0]['Retail Price']}")
    print(f"  Margin: {models[0]['Margin %']}")
    
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
            
            # Calculate margin to verify
            true_cost = base + surcharge + DEALER_PACK
            gross_profit = retail - true_cost
            actual_margin = gross_profit / retail
            
            models.append({
                'Model': model,
                'Sq Ft': sqft,
                'Base Price': format_price(base),
                'Surcharge': format_price(surcharge),
                'Dealer Pack': format_price(DEALER_PACK),
                'True Cost': format_price(true_cost),
                'Retail Price': format_price(retail),
                'Gross Profit': format_price(gross_profit),
                'Margin %': f"{actual_margin*100:.1f}%"
            })
    
    # Write output
    with open(output_file, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=models[0].keys())
        writer.writeheader()
        writer.writerows(models)
    
    print(f"\nAspire Sectional: {len(models)} models processed")
    print(f"Sample - Model {models[0]['Model']}:")
    print(f"  True Cost: {models[0]['True Cost']}")
    print(f"  Retail: {models[0]['Retail Price']}")
    print(f"  Margin: {models[0]['Margin %']}")
    
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
            
            # Calculate margin to verify
            true_cost = base + surcharge + DEALER_PACK
            gross_profit = retail - true_cost
            actual_margin = gross_profit / retail
            
            models.append({
                'Model': model,
                'Sq Ft': sqft,
                'Base Price': format_price(base),
                'Surcharge': format_price(surcharge),
                'Dealer Pack': format_price(DEALER_PACK),
                'True Cost': format_price(true_cost),
                'Retail Price': format_price(retail),
                'Gross Profit': format_price(gross_profit),
                'Margin %': f"{actual_margin*100:.1f}%"
            })
    
    # Write output
    with open(output_file, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=models[0].keys())
        writer.writeheader()
        writer.writerows(models)
    
    print(f"\nPrime Series: {len(models)} models processed")
    print(f"Sample - Model {models[0]['Model']}:")
    print(f"  True Cost: {models[0]['True Cost']}")
    print(f"  Retail: {models[0]['Retail Price']}")
    print(f"  Margin: {models[0]['Margin %']}")
    
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
                  'Dealer Pack', 'True Cost', 'Retail Price', 'Gross Profit', 'Margin %']
    
    with open(output_file, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(all_models)
    
    print(f"\nMaster sheet created: {len(all_models)} total models")
    
    # Print summary statistics
    margins = [float(m['Margin %'].replace('%', '')) for m in all_models]
    retail_prices = [parse_price(m['Retail Price']) for m in all_models]
    
    print(f"\n=== SUMMARY STATISTICS ===")
    print(f"Total Models: {len(all_models)}")
    print(f"Margin Range: {min(margins):.1f}% - {max(margins):.1f}%")
    print(f"Average Margin: {sum(margins)/len(margins):.1f}%")
    print(f"Retail Price Range: ${min(retail_prices):,.0f} - ${max(retail_prices):,.0f}")
    print(f"Average Retail: ${sum(retail_prices)/len(retail_prices):,.0f}")

if __name__ == '__main__':
    print("Fixing FDHC Retail Pricing - 65% Gross Profit Margin")
    print("=" * 60)
    print(f"Formula: Retail = (Base + Surcharge + ${DEALER_PACK}) / {1-TARGET_MARGIN}")
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
