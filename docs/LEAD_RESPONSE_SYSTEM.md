# Lead Response System

## Overview
Automated lead capture, qualification, and response system for Factory Direct Homes Center.

## Current Setup

### Email Inbox (AgentMail)
- **Address**: `lonelysalt605@agentmail.to`
- **API Key**: Configured in `~/.openclaw/openclaw.json`
- **Purpose**: Dedicated AI email identity for lead communication

### Telegram Integration
- **Primary Channel**: Direct messages to 8353870817
- **Bot**: @FactoryDirectAvaBot
- **Response Time**: Instant for DMs

## Lead Flow Architecture

```
Lead Source
    ↓
[Email/Form/Phone] → AgentMail Inbox
    ↓
AI Agent (Ava) Processes Lead
    ↓
├─ Qualification (budget, timeline, location)
├─ Urgency Assessment (hot/warm/cold)
├─ Auto-Response (immediate acknowledgment)
└─ Routing (notify Kyle/team)
    ↓
CRM/Database Entry (upcoming)
    ↓
Follow-up Sequence (automated)
```

## Lead Qualification Criteria

### Hot Leads (Immediate Alert)
- Ready to buy within 30 days
- Pre-approved financing or cash buyer
- Specific model/size in mind
- Visited lot or scheduled visit

### Warm Leads (Same Day Response)
- Buying within 3-6 months
- Researching options
- Financing questions
- Comparing dealers

### Cold Leads (Batch Response)
- Just browsing
- No timeline
- Early research phase
- Price shopping only

## Response Templates

### Initial Email Response
```
Subject: Thanks for reaching out to Factory Direct Homes Center

Hi [Name],

Thanks for your interest in manufactured homes. I'm Ava, and I help Navigator (Kyle) and the team at Factory Direct Homes Center.

I wanted to let you know we received your message and will get back to you shortly. In the meantime:

• Browse our inventory: factorydirecthomescenter.com
• Financing options: We work with multiple lenders
• Questions? Just reply to this email

Talk soon,
Ava
Factory Direct Homes Center
```

### Telegram Alert to Kyle
```
🚨 NEW LEAD - [HOT/WARM/COLD]

Source: [Email/Website/Phone]
Name: [Name]
Contact: [Email/Phone]
Interest: [Home type/Model/Budget]
Timeline: [30 days/3-6 months/Researching]

Quick Actions:
[Reply] [Schedule Call] [Mark as Contacted]
```

## Automation Rules

### Immediate Actions (< 5 minutes)
1. Send acknowledgment email
2. Qualify based on message content
3. Send Telegram alert to Kyle
4. Log to lead database

### Same Day Actions
1. Personalized follow-up email
2. Send relevant resources (financing guide, model info)
3. Schedule callback if requested

### Weekly Actions
1. Nurture sequence for warm leads
2. Market update email for cold leads
3. Re-engagement for stale leads (30+ days)

## Integration Points

### Upcoming: CRM Integration
- **Target**: HubSpot or similar
- **Data Sync**: Bidirectional
- **Fields**: Contact info, lead source, status, notes

### Upcoming: Phone System
- **AI Voice**: Inbound call handling
- **Outbound**: Appointment reminders, follow-ups
- **Recording**: Transcription and analysis

### Upcoming: Website Forms
- **Chat Widget**: Real-time website assistance
- **Lead Capture**: Exit intent, model interest
- **Scheduling**: Direct appointment booking

## Metrics to Track

| Metric | Target | Current |
|--------|--------|---------|
| Response Time | < 5 min | Manual |
| Lead Qualification Rate | 80% | N/A |
| Conversion Rate | 15% | N/A |
| Follow-up Completion | 100% | Manual |

## Next Steps

1. [ ] Set up AgentMail inbox monitoring cron job
2. [ ] Create lead database (Airtable/Notion/DB)
3. [ ] Build response template library
4. [ ] Test end-to-end lead flow
5. [ ] Integrate with CRM
6. [ ] Add phone AI system
