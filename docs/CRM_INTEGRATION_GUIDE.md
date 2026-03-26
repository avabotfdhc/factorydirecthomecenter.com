# Facebook Lead Ads + Renters Insight CRM Integration Guide
# Factory Direct Homes Center

## PART 1: CONNECTING FACEBOOK LEADS TO YOUR CRM

### Option A: Native Integration (if available)

1. **Log into Renters Insight CRM**
   - Go to Settings or Integrations
   - Look for "Facebook" or "Lead Ads"
   - If available, click "Connect"
   - Follow OAuth flow to authorize

2. **Map Lead Fields**
   Facebook Field → CRM Field
   - Full Name → Name
   - Email → Email
   - Phone Number → Phone
   - Lead Form Questions → Custom Fields
   - Ad Set/Ad Name → Source

3. **Test the Connection**
   - Submit test lead on Facebook
   - Verify it appears in CRM within 5 minutes
   - Check all data mapped correctly

### Option B: Zapier Integration (most common)

1. **Create Zapier Account**
   - Go to zapier.com
   - Sign up for free plan (100 tasks/month)

2. **Create New Zap**
   - Trigger: Facebook Lead Ads
   - Action: Renters Insight (or Webhook if no direct integration)

3. **Set Up Trigger**
   - Connect Facebook account
   - Select your Lead Ad form
   - Test trigger with sample data

4. **Set Up Action**
   - If Renters Insight has Zapier app: Select it, map fields
   - If no direct app: Use "Webhooks by Zapier" → POST
   - Endpoint URL: [Get from Renters Insight API settings]
   - Map all lead data fields

5. **Turn On Zap**
   - Test with real lead
   - Monitor first few leads closely

### Option C: Manual Export/Import (backup method)

1. **Facebook:** Go to Lead Ads → Download CSV daily
2. **CRM:** Import CSV to Renters Insight
3. **Note:** Not recommended - delays follow-up

---

## PART 2: AUTOMATED FOLLOW-UP WORKFLOW

### Recommended Workflow Structure

**Workflow Name:** "New Facebook Lead - 30 Day Nurture"
**Trigger:** New lead enters CRM from Facebook

---

### STAGE 1: IMMEDIATE (0-5 minutes)

**Action 1: Auto-Response Email**
- Send immediately
- From: sales@factorydirecthomescenter.com
- Subject: "We received your home inquiry!"

**Action 2: Internal Notification**
- Notify sales team (you)
- Include lead details
- Mark as "New Lead - Action Required"

**Action 3: Tag/Status Update**
- Tag: "Facebook Lead"
- Status: "New"
- Source: "Facebook Lead Ads"

---

### STAGE 2: DAY 1 (1-24 hours)

**Action 4: Value Email**
- Send: Next business day, 9am
- Subject: "Your manufactured home questions answered"
- Content: Educational + soft CTA

**Action 5: Task for Sales Rep**
- Create task: "Call new lead"
- Due: Within 4 hours of email send
- Priority: High

---

### STAGE 3: DAY 3 (72 hours)

**Action 6: Social Proof Email**
- Send: Day 3, 10am
- Subject: "See what families are saying about their new homes"
- Content: Testimonials + photos

**Action 7: Second Call Task**
- If no response to Day 1 attempt
- Task: "Second call attempt"
- Due: Day 3 afternoon

---

### STAGE 4: DAY 7 (1 week)

**Action 8: Educational Content**
- Send: Day 7, 9am
- Subject: "5 things to know before buying a manufactured home"
- Content: Blog post or guide

**Action 9: Third Call Task**
- If still no contact
- Task: "Final call attempt - leave voicemail"

---

### STAGE 5: DAY 14 (2 weeks)

**Action 10: Special Offer/Urgency**
- Send: Day 14, 10am
- Subject: "Limited: Factory-direct pricing this month"
- Content: Current promotion or incentive

---

### STAGE 6: DAY 30 (1 month)

**Action 11: Long-term Nurture**
- Send: Day 30, 9am
- Subject: "Still looking for your perfect home?"
- Content: New inventory, updated pricing

**Action 12: Status Update**
- If no purchase: Move to "Long-term nurture" list
- If contacted: Update status to "Engaged"
- If purchased: Move to "Customer" workflow

---

## PART 3: EMAIL TEMPLATES

### EMAIL 1: Immediate Auto-Response

**Subject:** We received your home inquiry!

**Body:**
```
Hi {{First Name}},

Thanks for reaching out about manufactured homes! We received your inquiry and wanted to let you know we're here to help.

Here's what happens next:
• We'll review your information
• A team member will call you within 24 hours
• We'll answer your questions (no pressure, we promise!)

In the meantime, browse our floor plans at:
factorydirecthomescenter.com/floor-plans

Questions? Reply to this email or call us at (260) 308-1457.

Talk soon,
Factory Direct Homes Center Team
1211 State Road 8, Auburn, IN
```

---

### EMAIL 2: Day 1 - Value

**Subject:** Your manufactured home questions answered

**Body:**
```
Hi {{First Name}},

I wanted to follow up on your inquiry about manufactured homes. I know you probably have questions, so let me address the most common ones:

Q: How much do manufactured homes cost?
A: Our homes start at $50,000 for single wides and $80,000 for double wides. That's 30-50% less than site-built homes.

Q: What's the difference between manufactured and modular?
A: Manufactured homes are built to HUD standards. Modular homes are built to IRC codes (like site-built). Both offer factory precision at lower costs.

Q: Can I put a manufactured home on my own land?
A: Yes! Most rural Indiana counties welcome manufactured homes. We help verify zoning for your specific property.

Q: How long does delivery take?
A: From order to move-in: 8-12 weeks. We're only 20 miles from the Champion factory, so our delivery times are faster than most dealers.

I'd love to talk more about your specific situation. When's a good time for a quick call?

Best,
[Your Name]
Factory Direct Homes Center
(260) 308-1457
sales@factorydirecthomescenter.com
```

---

### EMAIL 3: Day 3 - Social Proof

**Subject:** See what families are saying about their new homes

**Body:**
```
Hi {{First Name}},

Don't just take our word for it. Here's what real customers are saying:

"We were priced out of the traditional housing market. Our double wide from Factory Direct gave us everything we wanted—3 bedrooms, modern kitchen, open living space—at half the price." - Sarah M., Indianapolis

"As a veteran, the VA loan process was so easy. Zero down, no PMI, and we moved in 10 weeks after ordering." - James T., Fort Wayne

"The team walked us through every step. No pressure, just honest guidance." - David B., Auburn

[Link to customer photos/testimonials page]

Every day, families just like yours are discovering that manufactured homes aren't what they used to be. Modern. Energy-efficient. Built to last.

Want to see for yourself? Visit our showroom in Auburn or schedule a virtual tour.

Call (260) 308-1457 or reply to this email.

Best,
[Your Name]
```

---

### EMAIL 4: Day 7 - Educational

**Subject:** 5 things to know before buying a manufactured home

**Body:**
```
Hi {{First Name}},

Whether you buy from us or not, I want you to be an informed buyer. Here are 5 things every manufactured home buyer should know:

1. ZONING MATTERS
Not all areas allow manufactured homes. Rural counties are usually more welcoming than cities. We help you check zoning before you buy.

2. FOUNDATION OPTIONS
Manufactured homes can go on various foundations: pier and beam, crawl space, or basement (for modular). Your choice affects cost and financing.

3. FINANCING VARIES
Chattel loans (home-only), land-home packages, VA loans, FHA loans—each has different requirements. We work with multiple lenders to find your best option.

4. SITE WORK IS SEPARATE
The home price doesn't include land clearing, foundation, utilities, or setup. We provide line-item transparency so you know exactly what to budget.

5. QUALITY HAS IMPROVED DRAMATICALLY
Today's manufactured homes are built with real wood cabinets, energy-efficient windows, and modern appliances. They're not the mobile homes of the 1970s.

Questions about any of these? I'm here to help.

Call (260) 308-1457 or reply to this email.

Best,
[Your Name]
Factory Direct Homes Center
```

---

### EMAIL 5: Day 14 - Offer/Urgency

**Subject:** Limited: Factory-direct pricing this month

**Body:**
```
Hi {{First Name}},

I wanted to reach out because we're running a special promotion this month:

🏠 FREE appliance upgrade package ($2,000 value)
🏠 Preferred pricing for cash buyers (3% additional discount)
🏠 Expedited delivery for orders placed by [end of month]

Why are we doing this? We're approaching our busy season and want to fill our production slots. When you order now, you:

✓ Lock in current pricing (materials costs are rising)
✓ Get priority delivery (avoid summer backlog)
✓ Move in by [target date]

This isn't high-pressure sales—it's just good timing. If you've been considering a manufactured home, now is the time to act.

Want to discuss your options? Call me at (260) 308-1457 or reply to this email.

Best,
[Your Name]
Factory Direct Homes Center

P.S. Even if you're not ready to buy yet, I'd love to show you what's available. No obligation, just information.
```

---

### EMAIL 6: Day 30 - Long-term Nurture

**Subject:** Still looking for your perfect home?

**Body:**
```
Hi {{First Name}},

It's been about a month since you reached out about manufactured homes. I wanted to check in and see where you are in your search.

If you're still looking, here's what's new:

• New floor plans just added to our catalog
• Updated pricing for spring season
• Financing rates remain competitive
• Delivery slots available for summer move-in

If you've already found a home elsewhere, no hard feelings! I'm glad you found what you were looking for.

If you're still exploring options, I'm here to answer questions—whether you buy from us or not. Sometimes it just takes time to figure out the right path.

Either way, reply and let me know how you're doing. I read every email.

Best,
[Your Name]
Factory Direct Homes Center
(260) 308-1457

P.S. If now isn't the right time, I understand. Just reply "not ready" and I'll check back in a few months instead of weeks.
```

---

## PART 4: SMS TEXT TEMPLATES

### SMS 1: Immediate (0-5 minutes)

```
Hi {{First Name}}, this is Factory Direct Homes Center. We received your inquiry about manufactured homes. We'll call you within 24 hours, or you can reach us at (260) 308-1457. -[Your Name]
```

### SMS 2: Day 1 (follow-up)

```
Hi {{First Name}}, just wanted to follow up on your manufactured home inquiry. Do you have 5 minutes for a quick call today? -[Your Name] at Factory Direct (260) 308-1457
```

### SMS 3: Day 7 (check-in)

```
Hi {{First Name}}, checking in. Any questions about manufactured homes I can answer? Happy to help, no pressure. -[Your Name] (260) 308-1457
```

### SMS 4: Day 14 (offer)

```
Hi {{First Name}}, we're running a special this month: free appliance upgrade + preferred pricing. Worth a conversation? Call (260) 308-1457 or reply here. -[Your Name]
```

---

## PART 5: SETUP CHECKLIST

### Pre-Setup
- [ ] Confirm Facebook Lead Ad form is active
- [ ] Verify all form fields are correct
- [ ] Test lead submission yourself
- [ ] Confirm Renters Insight login works

### Integration Setup
- [ ] Choose integration method (Native/Zapier/Manual)
- [ ] Connect Facebook to CRM
- [ ] Map all lead fields correctly
- [ ] Test with sample lead
- [ ] Verify lead appears in CRM within 5 minutes

### Workflow Setup
- [ ] Create "New Facebook Lead" workflow
- [ ] Set trigger: New lead from Facebook source
- [ ] Add all 12 workflow actions
- [ ] Configure timing for each stage
- [ ] Add email templates
- [ ] Add SMS templates (if supported)
- [ ] Set up internal notifications
- [ ] Test workflow with sample lead

### Go-Live
- [ ] Submit test lead from Facebook
- [ ] Verify workflow triggers
- [ ] Check first email sends
- [ ] Confirm task created for sales rep
- [ ] Monitor first 5 real leads closely
- [ ] Adjust timing/content as needed

---

## NOTES

### Compliance Reminders
- Include opt-out in all emails (unsubscribe link)
- Include physical address in emails (CAN-SPAM)
- Honor opt-out requests within 10 days
- For SMS: Ensure leads opted in to text messages

### Best Practices
- Personalize with {{First Name}} when possible
- Keep emails under 200 words when possible
- One clear call-to-action per email
- Mobile-optimized (60%+ read on phones)
- Test emails before sending to leads

### Tracking
- Track open rates (target: 20%+)
- Track click rates (target: 3%+)
- Track reply rates
- Track conversion to appointment
- Track conversion to sale
- A/B test subject lines monthly

---

*Created: March 26, 2026*
*For: Factory Direct Homes Center*
*Platform: Renters Insight CRM + Facebook Lead Ads*
