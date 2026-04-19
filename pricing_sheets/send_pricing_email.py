#!/usr/bin/env python3
import sys
sys.path.insert(0, '/Users/ava/.openclaw/skills/agentmail/scripts')

import os
os.environ['AGENTMAIL_API_KEY'] = 'am_us_4966f926fb2b75aa5bcd3f7a94ee9b57ab11a189ce023ce8cefec1cc74c716bf'

from agentmail import AgentMail

client = AgentMail(api_key=os.environ['AGENTMAIL_API_KEY'])

# Read attachments from both locations
attachments = []

# Files in pricing_sheets folder
os.chdir('/Users/ava/.openclaw/workspace/pricing_sheets')
for filename in ['Aspire_Singles_Retail_Pricing_2026.csv', 'Aspire_Sectional_Retail_Pricing_2026.csv', 'Prime_Series_Retail_Pricing_2026.csv']:
    with open(filename, 'rb') as f:
        content = f.read()
        attachments.append({
            'filename': filename,
            'content': content,
            'content_type': 'text/csv'
        })

# Master price sheet from public folder
os.chdir('/Users/ava/.openclaw/workspace/factorydirecthomescenter.com/public')
with open('FDHC_Retail_Price_Sheet_2026.csv', 'rb') as f:
    content = f.read()
    attachments.append({
        'filename': 'FDHC_Retail_Price_Sheet_2026.csv',
        'content': content,
        'content_type': 'text/csv'
    })

# Send email
message = client.inboxes.messages.send(
    inbox_id='lonelysalt605@agentmail.to',
    to=['kdudgeon@factorydirecthomescenter.com'],
    subject='FDHC Retail Price Sheets - April 2026',
    text='''Navigator,

Attached are the most recent retail price sheets for Factory Direct Homes Center.

Files included:
- FDHC_Retail_Price_Sheet_2026.csv (Complete master sheet with all Aspire and Prime series)
- Aspire_Singles_Retail_Pricing_2026.csv
- Aspire_Sectional_Retail_Pricing_2026.csv  
- Prime_Series_Retail_Pricing_2026.csv

Effective Date: April 16, 2026

All prices are for base home only (factory cost + pack + markup). Does NOT include: delivery, setup, foundation, utilities, site work.

Let me know if you need anything else.

Ava 🏠
Factory Direct Homes Center''',
    attachments=attachments
)

print(f"Email sent successfully! Message ID: {message.message_id}")
