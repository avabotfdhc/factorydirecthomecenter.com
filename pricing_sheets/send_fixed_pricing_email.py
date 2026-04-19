#!/usr/bin/env python3
import sys
sys.path.insert(0, '/Users/ava/.openclaw/skills/agentmail/scripts')

import os
os.environ['AGENTMAIL_API_KEY'] = 'am_us_4966f926fb2b75aa5bcd3f7a94ee9b57ab11a189ce023ce8cefec1cc74c716bf'

from agentmail import AgentMail

client = AgentMail(api_key=os.environ['AGENTMAIL_API_KEY'])

# Read all fixed attachment files
attachments = []

files = [
    ('/Users/ava/.openclaw/workspace/pricing_sheets/Aspire_Singles_Retail_Pricing_2026_FIXED.csv', 'Aspire_Singles_Retail_Pricing_2026.csv'),
    ('/Users/ava/.openclaw/workspace/pricing_sheets/Aspire_Sectional_Retail_Pricing_2026_FIXED.csv', 'Aspire_Sectional_Retail_Pricing_2026.csv'),
    ('/Users/ava/.openclaw/workspace/pricing_sheets/Prime_Series_Retail_Pricing_2026_FIXED.csv', 'Prime_Series_Retail_Pricing_2026.csv'),
    ('/Users/ava/.openclaw/workspace/pricing_sheets/FDHC_Retail_Price_Sheet_2026_FIXED.csv', 'FDHC_Retail_Price_Sheet_2026.csv')
]

for filepath, filename in files:
    with open(filepath, 'rb') as f:
        content = f.read()
        attachments.append({
            'filename': filename,
            'content': content,
            'content_type': 'text/csv'
        })

# Send email
message = client.inboxes.messages.send(
    inbox_id='lonelysalt605@agentmail.to',
    to=['kdudgeon@factorydirecthomescenter.com'],
    subject='FDHC Retail Price Sheets - CORRECTED (65% Markup)',
    text='''Navigator,

Attached are the CORRECTED retail price sheets.

**Problem Fixed:**
The original sheets had ~185% markup instead of 65%.

**Correct Formula:**
MSRP = (Base Price + Surcharge + $2,500 Pack) × 1.65

**Example - 1432H11214:**
- Base: $25,495
- Surcharge: $224
- Pack: $2,500
- True Cost: $28,219
- MSRP: $46,561 (was $73,483 — wrong!)

**Files Attached:**
- Aspire_Singles_Retail_Pricing_2026.csv (40 models)
- Aspire_Sectional_Retail_Pricing_2026.csv (70 models)
- Prime_Series_Retail_Pricing_2026.csv (39 models)
- FDHC_Retail_Price_Sheet_2026.csv (master - 149 models)

All prices now correctly calculated at 65% markup over true cost.

Ava 🏠
Factory Direct Homes Center''',
    attachments=attachments
)

print(f"Email sent successfully! Message ID: {message.message_id}")
