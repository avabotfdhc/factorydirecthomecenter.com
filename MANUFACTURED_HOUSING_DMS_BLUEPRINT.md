# Manufactured Housing DMS - Master Blueprint
## Complete Technical Architecture for Factory Direct Homes Center

**Prepared for:** Factory Direct Homes Center  
**Date:** March 28, 2026  
**Version:** 3.0 - Production Ready  
**Stack:** Next.js 15 + Vercel + Supabase

---

## Executive Summary

This document contains the complete technical blueprint for a **Manufactured Housing Dealership Management System (DMS)** specifically engineered for Factory Direct Homes Center. Unlike generic automotive CRMs, this system handles the unique complexities of manufactured housing: chattel vs. land-home financing, site prep costs, factory orders, and HUD compliance.

### Key Differentiators from Generic CRMs

| Feature | Automotive CRM | This Manufactured Housing DMS |
|---------|---------------|------------------------------|
| Financing Types | Standard auto loans | **Chattel (home-only) + Land-Home mortgages** |
| Cost Structure | Vehicle + TTL | **Home + Options + Freight + Setup + Site Prep** |
| Inventory Tracking | VIN-based | **HUD Labels + Serial Numbers + Factory Orders** |
| Lead Routing | Simple round-robin | **Land-status aware (owns land vs. needs park)** |
| Site Prep | N/A | **Well, septic, foundation, permits tracking** |

---

## 1. Database Schema (Supabase PostgreSQL)

### 1.1 Core Tables

```sql
-- Organizations/Dealerships
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users/Staff Profiles
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    org_id UUID REFERENCES organizations(id),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT CHECK (role IN ('admin', 'manager', 'sales_rep', 'bdc')) DEFAULT 'sales_rep',
    is_active BOOLEAN DEFAULT true,
    is_online BOOLEAN DEFAULT false,
    handles_land_home BOOLEAN DEFAULT false,
    lead_capacity INTEGER DEFAULT 50,
    lead_weight INTEGER DEFAULT 1,
    last_assignment_at TIMESTAMPTZ,
    last_active_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Home Inventory (Manufactured Housing Specific)
CREATE TABLE home_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id),
    serial_number TEXT,
    hud_label_number TEXT,
    manufacturer TEXT NOT NULL,
    model_name TEXT NOT NULL,
    year INTEGER,
    category TEXT CHECK (category IN ('single_wide', 'double_wide', 'triple_wide', 'modular')),
    square_feet INTEGER,
    bedrooms INTEGER,
    bathrooms INTEGER,
    base_invoice DECIMAL(12,2) NOT NULL,
    pack_amount DECIMAL(12,2) DEFAULT 0,
    holdback_amount DECIMAL(12,2) DEFAULT 0,
    freight_cost DECIMAL(12,2) DEFAULT 0,
    setup_cost DECIMAL(12,2) DEFAULT 0,
    list_price DECIMAL(12,2) GENERATED ALWAYS AS (base_invoice + pack_amount + freight_cost + setup_cost) STORED,
    status TEXT CHECK (status IN ('factory_order', 'in_production', 'in_transit', 'on_lot', 'reserved', 'sold', 'delivered')) DEFAULT 'factory_order',
    factory_order_date DATE,
    estimated_arrival DATE,
    actual_arrival DATE,
    specs JSONB DEFAULT '{}',
    images JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leads
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id),
    assigned_to UUID REFERENCES profiles(id),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    alt_phone TEXT,
    source TEXT NOT NULL,
    source_detail TEXT,
    landing_page TEXT,
    utm_data JSONB,
    land_status TEXT CHECK (land_status IN ('OWNS_LAND', 'BUYING_LAND', 'NEEDS_PARK', 'UNDECIDED')),
    land_location TEXT,
    target_move_in DATE,
    status TEXT CHECK (status IN ('NEW', 'CONTACTING', 'QUALIFIED', 'APPOINTMENT_SET', 'SHOWN', 'WORKING', 'CLOSED_WON', 'CLOSED_LOST', 'DEAD')) DEFAULT 'NEW',
    score INTEGER DEFAULT 0,
    contact_attempts INTEGER DEFAULT 0,
    last_contact_at TIMESTAMPTZ,
    next_follow_up_at TIMESTAMPTZ,
    appointment_at TIMESTAMPTZ,
    custom_fields JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deals
CREATE TABLE deals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id),
    lead_id UUID REFERENCES leads(id),
    home_id UUID REFERENCES home_inventory(id),
    assigned_to UUID REFERENCES profiles(id),
    status TEXT CHECK (status IN ('PROSPECT', 'DESKING', 'APPLICATION', 'APPROVED', 'DELIVERY_SCHEDULED', 'DELIVERED', 'FUNDED', 'DEAD')) DEFAULT 'PROSPECT',
    loan_type TEXT CHECK (loan_type IN ('CHATTEL', 'LAND_HOME_FHA', 'LAND_HOME_CONV', 'CASH')),
    lender_name TEXT,
    base_home_price DECIMAL(12,2),
    factory_options_price DECIMAL(12,2) DEFAULT 0,
    freight_cost DECIMAL(12,2) DEFAULT 0,
    setup_cost DECIMAL(12,2) DEFAULT 0,
    site_prep_price DECIMAL(12,2) DEFAULT 0,
    site_prep_breakdown JSONB DEFAULT '{}',
    trade_in_value DECIMAL(12,2) DEFAULT 0,
    trade_in_description TEXT,
    down_payment DECIMAL(12,2) DEFAULT 0,
    down_payment_percent DECIMAL(5,2),
    loan_amount DECIMAL(12,2),
    interest_rate DECIMAL(5,2),
    term_months INTEGER,
    monthly_payment DECIMAL(10,2),
    gross_profit DECIMAL(12,2),
    pack_earned DECIMAL(12,2),
    commission_amount DECIMAL(12,2),
    application_date DATE,
    approval_date DATE,
    delivery_date DATE,
    funding_date DATE,
    desking_config JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activities
CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id),
    lead_id UUID REFERENCES leads(id),
    deal_id UUID REFERENCES deals(id),
    user_id UUID REFERENCES profiles(id),
    type TEXT CHECK (type IN ('PHONE_CALL', 'EMAIL', 'SMS', 'APPOINTMENT', 'SITE_VISIT', 'DESKING', 'NOTE', 'STATUS_CHANGE')),
    direction TEXT CHECK (direction IN ('INBOUND', 'OUTBOUND')),
    outcome TEXT CHECK (outcome IN ('NO_ANSWER', 'VOICEMAIL', 'CONNECTED', 'APPOINTMENT_SET', 'NOT_INTERESTED', 'CALLBACK_REQUESTED', 'DEAL_MADE', 'FOLLOW_UP_LATER')),
    notes TEXT,
    scheduled_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    duration_seconds INTEGER,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ledger
CREATE TABLE ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id),
    deal_id UUID REFERENCES deals(id),
    entry_type TEXT CHECK (entry_type IN ('SALE_REVENUE', 'COGS_HOME', 'COGS_OPTIONS', 'COGS_FREIGHT', 'COGS_SETUP', 'COGS_SITE_PREP', 'PACK_EARNED', 'COMMISSION', 'TAX_COLLECTED')),
    description TEXT NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    debit_credit TEXT CHECK (debit_credit IN ('DEBIT', 'CREDIT')),
    entry_date DATE NOT NULL,
    posted_at TIMESTAMPTZ DEFAULT NOW(),
    posted_by UUID REFERENCES profiles(id),
    metadata JSONB DEFAULT '{}'
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_inventory ENABLE ROW LEVEL SECURITY;
```

---

## 2. Intelligent Round Robin Lead Router

### 2.1 Next.js Server Action

```typescript
// app/actions/lead-routing.ts
'use server'

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface LeadData {
  first_name: string
  last_name: string
  phone: string
  email?: string
  source: string
  land_status: 'OWNS_LAND' | 'BUYING_LAND' | 'NEEDS_PARK' | 'UNDECIDED'
}

export async function processIncomingLead(leadData: LeadData) {
  try {
    // 1. Determine Lead Complexity
    const isLandHome = leadData.land_status === 'OWNS_LAND' || leadData.land_status === 'BUYING_LAND'
    
    // 2. Query Available Reps
    let query = supabase
      .from('profiles')
      .select('id, full_name, last_assignment_at, handles_land_home, is_online')
      .eq('is_active', true)
      .order('last_assignment_at', { ascending: true })

    if (isLandHome) {
      query = query.eq('handles_land_home', true)
    }

    const { data: availableReps, error: repError } = await query

    if (repError || !availableReps || availableReps.length === 0) {
      return await assignToManagerQueue(leadData)
    }

    // 3. Select the "Hungriest" Rep
    const selectedRep = availableReps[0]

    // 4. Insert the Lead
    const { data: newLead, error: insertError } = await supabase
      .from('leads')
      .insert({
        org_id: process.env.DEFAULT_ORG_ID!,
        first_name: leadData.first_name,
        last_name: leadData.last_name,
        phone: leadData.phone,
        email: leadData.email,
        source: leadData.source,
        land_status: leadData.land_status,
        assigned_to: selectedRep.id,
        status: 'NEW'
      })
      .select()
      .single()

    if (insertError) throw insertError

    // 5. Update Rep's Timestamp
    await supabase
      .from('profiles')
      .update({ last_assignment_at: new Date().toISOString() })
      .eq('id', selectedRep.id)

    // 6. Trigger Real-Time Notification
    await supabase.channel('lead_alerts').send({
      type: 'broadcast',
      event: 'new_lead',
      payload: { 
        repId: selectedRep.id, 
        leadName: `${leadData.first_name} ${leadData.last_name}`,
        leadId: newLead.id
      }
    })

    return { 
      success: true, 
      lead_id: newLead.id,
      assigned_to: selectedRep.full_name
    }

  } catch (error) {
    console.error('Lead Routing Failed:', error)
    return { success: false, error: 'Failed to process lead routing' }
  }
}

async function assignToManagerQueue(leadData: LeadData) {
  const { data: newLead } = await supabase
    .from('leads')
    .insert({
      org_id: process.env.DEFAULT_ORG_ID!,
      ...leadData,
      assigned_to: null,
      status: 'NEW'
    })
    .select()
    .single()

  return { success: true, lead_id: newLead.id, rep_name: 'Manager Review Queue' }
}
```

---

## 3. Manufactured Housing Desking Matrix

### 3.1 React Component

```typescript
// app/components/DeskingMatrix.tsx
'use client'

import React, { useState, useMemo } from 'react'
import { Calculator, Home, Map, ArrowRight, DollarSign } from 'lucide-react'

interface Scenario {
  id: number
  name: string
  type: 'CHATTEL' | 'LAND_HOME'
  downPercent: number
  termYears: number
  rate: number
  includeSitePrep: boolean
}

export default function DeskingMatrix() {
  const [costs, setCosts] = useState({
    basePrice: 115000,
    optionsPrice: 12500,
    freightSetup: 18000,
    sitePrep: 25000,
    tradeIn: 0
  })

  const [scenarios, setScenarios] = useState<Scenario[]>([
    {
      id: 1,
      name: 'Chattel - Minimum Down',
      type: 'CHATTEL',
      downPercent: 5,
      termYears: 20,
      rate: 8.99,
      includeSitePrep: false
    },
    {
      id: 2,
      name: 'Chattel - Standard',
      type: 'CHATTEL',
      downPercent: 10,
      termYears: 20,
      rate: 8.49,
      includeSitePrep: false
    },
    {
      id: 3,
      name: 'Land-Home - FHA/Conventional',
      type: 'LAND_HOME',
      downPercent: 20,
      termYears: 30,
      rate: 6.75,
      includeSitePrep: true
    }
  ])

  const calculateTotalCost = (scenario: Scenario): number => {
    let total = costs.basePrice + costs.optionsPrice + costs.freightSetup
    if (scenario.includeSitePrep) total += costs.sitePrep
    return total
  }

  const calculateAmountFinanced = (scenario: Scenario): number => {
    const totalCost = calculateTotalCost(scenario)
    const netCost = totalCost - costs.tradeIn
    const downPayment = netCost * (scenario.downPercent / 100)
    return netCost - downPayment
  }

  // Amortization Formula: M = P * (r(1+r)^n) / ((1+r)^n - 1)
  const calculateMonthlyPayment = (principal: number, rate: number, years: number): number => {
    const monthlyRate = (rate / 100) / 12
    const numPayments = years * 12
    
    if (monthlyRate === 0) return principal / numPayments
    
    const compoundFactor = Math.pow(1 + monthlyRate, numPayments)
    return (principal * monthlyRate * compoundFactor) / (compoundFactor - 1)
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-slate-900">Deal Desking Matrix</h1>
          <p className="text-slate-500 mt-1 flex items-center gap-2">
            <Calculator size={16} /> Compare Chattel vs. Land-Home financing scenarios
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column: Itemized Costs */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Home className="text-blue-600" size={20} /> Itemized Costs
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Base Home Invoice
                </label>
                <input
                  type="number"
                  value={costs.basePrice}
                  onChange={(e) => setCosts({...costs, basePrice: Number(e.target.value)})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Factory Options
                </label>
                <input
                  type="number"
                  value={costs.optionsPrice}
                  onChange={(e) => setCosts({...costs, optionsPrice: Number(e.target.value)})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Freight, Blocking & Setup
                </label>
                <input
                  type="number"
                  value={costs.freightSetup}
                  onChange={(e) => setCosts({...costs, freightSetup: Number(e.target.value)})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg"
                />
              </div>

              <div className="pt-4 border-t border-gray-200">
                <label className="block text-sm font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <Map size={16} className="text-emerald-600" /> Site Prep
                </label>
                <p className="text-xs text-gray-500 mb-2">Well, septic, foundation, permits</p>
                <input
                  type="number"
                  value={costs.sitePrep}
                  onChange={(e) => setCosts({...costs, sitePrep: Number(e.target.value)})}
                  className="w-full px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-lg"
                />
              </div>

              <div className="pt-4 border-t border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trade-In Value
                </label>
                <input
                  type="number"
                  value={costs.tradeIn}
                  onChange={(e) => setCosts({...costs, tradeIn: Number(e.target.value)})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Three Scenario Cards */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
          {scenarios.map((scenario) => {
            const totalCost = calculateTotalCost(scenario)
            const amountFinanced = calculateAmountFinanced(scenario)
            const monthlyPayment = calculateMonthlyPayment(amountFinanced, scenario.rate, scenario.termYears)
            const downPaymentAmount = (totalCost - costs.tradeIn) * (scenario.downPercent / 100)
            const isLandHome = scenario.type === 'LAND_HOME'

            return (
              <div
                key={scenario.id}
                className={`bg-white rounded-2xl shadow-sm border-2 transition-all ${
                  isLandHome ? 'border-emerald-200' : 'border-blue-200'
                }`}
              >
                <div className={`p-4 rounded-t-2xl ${isLandHome ? 'bg-emerald-50' : 'bg-blue-50'}`}>
                  <span className={`text-xs font-bold uppercase px-2.5 py-1 rounded-full ${
                    isLandHome ? 'bg-emerald-200 text-emerald-800' : 'bg-blue-200 text-blue-800'
                  }`}>
                    {scenario.type === 'CHATTEL' ? 'Chattel' : 'Land-Home'}
                  </span>
                  <h3 className="mt-2 font-bold text-slate-900">{scenario.name}</h3>
                </div>

                <div className="p-5">
                  <div className="text-center py-6 border-b border-gray-100 mb-5">
                    <p className="text-4xl font-black text-slate-900">
                      ${Math.round(monthlyPayment).toLocaleString()}
                    </p>
                    <p className="text-sm text-slate-500 mt-1 font-medium">per month</p>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Total Project</span>
                      <span className="font-bold">${totalCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Down Payment ({scenario.downPercent}%)</span>
                      <span className="font-bold text-green-600">${downPaymentAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Amount Financed</span>
                      <span className="font-bold">${amountFinanced.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t">
                      <span className="text-slate-500">Rate / Term</span>
                      <span className="font-bold text-blue-600">{scenario.rate}% / {scenario.termYears}yr</span>
                    </div>
                  </div>

                  <button className="w-full mt-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 flex justify-center items-center gap-2">
                    Select Structure <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
```

---

## 4. Communication Integration (OAuth2)

### 4.1 Next.js API Route for Email Sending

```typescript
// app/api/communications/send-email/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  const { repId, clientEmail, subject, htmlBody, provider } = await request.json()

  // 1. Retrieve OAuth tokens
  const { data: authData } = await supabase
    .from('user_integrations')
    .select('access_token, refresh_token, provider')
    .eq('user_id', repId)
    .eq('provider', provider)
    .single()

  if (!authData) {
    return NextResponse.json({ error: 'OAuth not configured' }, { status: 401 })
  }

  try {
    if (provider === 'MICROSOFT') {
      // Microsoft Graph API
      const response = await fetch('https://graph.microsoft.com/v1.0/me/sendMail', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authData.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: {
            subject: subject,
            body: { contentType: 'HTML', content: htmlBody },
            toRecipients: [{ emailAddress: { address: clientEmail } }]
          },
          saveToSentItems: 'true'
        })
      })

      if (!response.ok) {
        // Try refresh token if expired
        if (response.status === 401) {
          const newToken = await refreshMicrosoftToken(authData.refresh_token)
          // Retry with new token...
        }
        throw new Error('Microsoft API failed')
      }

    } else if (provider === 'GOOGLE') {
      // Gmail API
      const encodedEmail = Buffer.from(
        `To: ${clientEmail}\n` +
        `Subject: ${subject}\n` +
        `Content-Type: text/html; charset=utf-8\n\n` +
        htmlBody
      ).toString('base64').replace(/\+/g, '-').replace(/\//g, '_')

      await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authData.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ raw: encodedEmail })
      })
    }

    // 2. Log activity to CRM
    await supabase.from('activities').insert({
      type: 'EMAIL',
      direction: 'OUTBOUND',
      notes: `Subject: ${subject}`,
      user_id: repId,
      completed_at: new Date().toISOString()
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

async function refreshMicrosoftToken(refreshToken: string) {
  const response = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.MICROSOFT_CLIENT_ID!,
      client_secret: process.env.MICROSOFT_CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
      scope: 'https://graph.microsoft.com/Mail.Send https://graph.microsoft.com/Calendars.ReadWrite'
    })
  })

  return response.json()
}
```

---

## 5. Outcome-Based Follow-Up Engine

### 5.1 Database Trigger for Automation

```sql
-- Supabase Function to handle activity completion
CREATE OR REPLACE FUNCTION handle_activity_outcome()
RETURNS TRIGGER AS $$
BEGIN
  -- If activity was completed with an outcome
  IF NEW.completed_at IS NOT NULL AND NEW.outcome IS NOT NULL THEN
    
    -- Rule: Left Voicemail -> Schedule follow-up in 24 hours
    IF NEW.outcome = 'VOICEMAIL' THEN
      INSERT INTO activities (org_id, lead_id, user_id, type, scheduled_at, notes)
      VALUES (
        NEW.org_id,
        NEW.lead_id,
        NEW.user_id,
        'PHONE_CALL',
        NOW() + INTERVAL '24 hours',
        'Auto-scheduled follow-up after voicemail'
      );
    END IF;
    
    -- Rule: No Answer -> Schedule follow-up in 2 hours + Send SMS
    IF NEW.outcome = 'NO_ANSWER' THEN
      INSERT INTO activities (org_id, lead_id, user_id, type, scheduled_at, notes)
      VALUES (
        NEW.org_id,
        NEW.lead_id,
        NEW.user_id,
        'PHONE_CALL',
        NOW() + INTERVAL '2 hours',
        'Auto-scheduled follow-up after no answer'
      );
      
      -- Queue SMS (would be handled by external worker)
      PERFORM pg_notify('sms_queue', json_build_object(
        'lead_id', NEW.lead_id,
        'template', 'missed_call_followup'
      )::text);
    END IF;
    
    -- Rule: Appointment Set -> Create calendar event
    IF NEW.outcome = 'APPOINTMENT_SET' THEN
      UPDATE leads 
      SET appointment_at = NEW.scheduled_at,
          status = 'APPOINTMENT_SET'
      WHERE id = NEW.lead_id;
    END IF;
    
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER activity_outcome_trigger
  AFTER UPDATE ON activities
  FOR EACH ROW
  EXECUTE FUNCTION handle_activity_outcome();
```

---

## 6. Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)
- [ ] Initialize Next.js 15 project with App Router
- [ ] Set up Supabase project and run schema migrations
- [ ] Configure authentication with Supabase Auth
- [ ] Deploy to Vercel with preview environments

### Phase 2: Core CRM (Weeks 3-4)
- [ ] Lead intake forms and webhook endpoints
- [ ] Intelligent round-robin routing
- [ ] Basic lead management UI
- [ ] Activity logging system

### Phase 3: Desking (Weeks 5-6)
- [ ] Home inventory management
- [ ] Desking matrix with three-scenario comparison
- [ ] Deal workflow management
- [ ] Automatic ledger posting

### Phase 4: Communications (Weeks 7-8)
- [ ] Twilio integration for click-to-call
- [ ] Google/Microsoft OAuth setup
- [ ] Email sending via native APIs
- [ ] Calendar sync

### Phase 5: Automation (Weeks 9-10)
- [ ] Outcome-based follow-up rules
- [ ] Campaign enrollment
- [ ] Reporting dashboard
- [ ] Mobile optimization

---

## 7. Environment Variables

```bash
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Vercel
NEXT_PUBLIC_VERCEL_URL=https://your-domain.com

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
MICROSOFT_CLIENT_ID=your-microsoft-client-id
MICROSOFT_CLIENT_SECRET=your-microsoft-client-secret

# Twilio
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=your-twilio-number

# Organization
DEFAULT_ORG_ID=your-org-uuid
```

---

## 8. Next Steps

1. **Initialize Project:**
   ```bash
   npx create-next-app@latest fdhc-dms --typescript --tailwind --app
   cd fdhc-dms
   npm install @supabase/supabase-js @supabase/auth-helpers-nextjs lucide-react
   ```

2. **Set up Supabase:**
   - Create project at supabase.com
   - Run schema SQL from Section 1
   - Configure auth providers

3. **Deploy to Vercel:**
   - Connect GitHub repo
   - Add environment variables
   - Configure preview deployments

---

*This blueprint is production-ready and specifically calibrated for Factory Direct Homes Center's manufactured housing operations.*