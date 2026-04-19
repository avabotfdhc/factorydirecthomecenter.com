#!/usr/bin/env python3
import os
import sys

# Set API key
os.environ['AGENTMAIL_API_KEY'] = 'am_us_4966f926fb2b75aa5bcd3f7a94ee9b57ab11a189ce023ce8cefec1cc74c716bf'

# Add agentmail to path
sys.path.insert(0, os.path.expanduser('~/.openclaw/skills/agentmail'))

from agentmail import AgentMail

client = AgentMail(api_key=os.environ['AGENTMAIL_API_KEY'])

message = client.inboxes.messages.send(
    inbox_id="lonelysalt605@agentmail.to",
    to="kdudgeon@factorydirecthomescenter.com",
    subject="Daily Competitor Report - April 18, 2026 - IN/OH/MI Markets",
    text="""DAILY COMPETITOR REPORT - April 18, 2026
Manufactured Home Dealers in IN/OH/MI Markets

=== EXECUTIVE SUMMARY ===
• Champion Homes Center (Topeka, IN) running active promotions with ~20% discounts
• Clayton Homes maintains 24 locations across target markets (IN: 8, OH: 10, MI: 6)
• No major new model announcements detected
• Market stable with active promotional activity

=== PRICING UPDATES ===
CHAMPION HOMES CENTER:
- St. Clair Model ON SALE: Was $97,235 → NOW $77,540 (savings ~$19,695)
- 28' x 48' Double Wide, 3BR/2BA, 1,280 sq ft
- Clearance inventory: 2025-2026 overstock models available

CLAYTON HOMES:
- Premium positioning, no advertised discounts
- Featured models: Lulabelle, Huxton II, Oceanside, Atlas (1,800-2,256 sq ft)

=== NEW MODELS/INVENTORY ===
• Champion: Active clearance on Reo, Portage, Hessville, Lake Terrace series
• Clayton: No new model announcements; showcasing 9 core models

=== MARKETING ACTIVITY ===
CHAMPION:
- Messaging: 'BUY DIRECT AT THE FACTORY!'
- Focus: Price-conscious buyers, clearance inventory
- Social: Facebook, YouTube presence

CLAYTON:
- Campaign: 'Built for Real Life' brand push
- Strategy: Lifestyle content, customer testimonials
- Social: Full presence (FB, IG, Pinterest, YouTube, TikTok)
- Content: 6-step 'How It Works' buyer journey

=== STRATEGIC OBSERVATIONS ===
THREATS:
• Clayton's 24-location regional footprint
• Champion's factory-direct pricing pressure ($60.58/sq ft on sale models)

OPPORTUNITIES:
• Neither competitor dominates social media engagement
• Financing education gap exists
• Local/personalized service differentiation available

RECOMMENDED ACTIONS:
1. Monitor Champion clearance pricing weekly
2. Track Clayton new releases monthly  
3. Develop competitive financing comparisons
4. Boost local SEO for 'manufactured homes [city]' searches

Full detailed report saved to:
/Users/ava/.openclaw/workspace/research/competitor_tracking/2026-04-18_competitor_report.md

---
Report by: Ava (AI Employee, Factory Direct Homes Center)
Generated: April 18, 2026, 7:00 AM EST
Next Update: April 19, 2026"""
)

print(f"Email sent successfully!")
