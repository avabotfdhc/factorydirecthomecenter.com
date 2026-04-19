# Manufactured Housing DMS - Enterprise Supplement v4.0
## Additional Modules for Complete Dealership Management

**This document contains the gaps identified and solutions for:**
- Compliance & Regulatory (HUD, State-specific)
- Advanced Financing Engine (Credit tiers, Lender programs)
- Site Prep Workflow (Permits, Zoning, Utilities)
- Multi-State Tax Configuration
- Post-Sale Operations (Delivery, Punch lists)
- Service & Warranty Management

---

## 1. Compliance & Regulatory Module

### 1.1 HUD Compliance Tracking (24 CFR 3282/3285)

```sql
-- HUD Compliance Table
CREATE TABLE hud_compliance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_id UUID REFERENCES deals(id),
    home_id UUID REFERENCES home_inventory(id),
    
    -- HUD Label Verification
    hud_label_verified BOOLEAN DEFAULT false,
    hud_label_photo_url TEXT,
    label_verification_date DATE,
    verified_by UUID REFERENCES profiles(id),
    
    -- Installation Compliance (24 CFR 3285)
    installation_manual_received BOOLEAN DEFAULT false,
    installer_certified BOOLEAN DEFAULT false,
    installer_name TEXT,
    installer_license_number TEXT,
    foundation_type TEXT CHECK (foundation_type IN ('piers', 'slab', 'crawl_space', 'basement', 'other')),
    foundation_inspection_date DATE,
    foundation_inspection_passed BOOLEAN,
    
    -- State Inspection
    state_inspection_required BOOLEAN DEFAULT true,
    state_inspection_date DATE,
    state_inspection_passed BOOLEAN,
    inspector_name TEXT,
    occupancy_permit_issued BOOLEAN DEFAULT false,
    occupancy_permit_number TEXT,
    
    -- Warranty
    manufacturer_warranty_start DATE,
    dealer_warranty_start DATE,
    warranty_packet_delivered BOOLEAN DEFAULT false,
    warranty_delivery_date DATE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- State-Specific Configuration
CREATE TABLE state_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id),
    state_code TEXT NOT NULL CHECK (state_code IN ('IN', 'OH', 'MI', 'WI', 'IL', 'KY')),
    state_name TEXT NOT NULL,
    sales_tax_rate DECIMAL(5,4) NOT NULL,
    sales_tax_applies_to TEXT[] DEFAULT '{home,freight,setup}',
    title_type TEXT CHECK (title_type IN ('chattel', 'real_property', 'both')),
    installation_code TEXT NOT NULL,
    warranty_requirements JSONB DEFAULT '{}',
    dealer_license_number TEXT,
    dealer_license_expiry DATE,
    settings JSONB DEFAULT '{}',
    UNIQUE(org_id, state_code)
);
```

### 1.2 State Compliance Matrix

| State | Installation Code | Title Type | Warranty | Sales Tax Notes |
|-------|------------------|------------|----------|-----------------|
| **IN** | Indiana Modular | Chattel | 1-year dealer | 7% on home + freight |
| **OH** | Ohio Basic | Both | 1-year dealer | Varies by county (5.75% + county) |
| **MI** | Michigan Modular | Both | 1-year dealer | 6% state tax |
| **WI** | Wisconsin UDC | Real Property | 1-year dealer | 5% on everything |
| **IL** | Illinois Modular | Both | 1-year dealer | 6.25% state + local |
| **KY** | Kentucky | Chattel | 1-year dealer | 6% state tax |

---

## 2. Advanced Financing Engine

### 2.1 Lender & Program Management

```sql
-- Lenders Table
CREATE TABLE lenders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id),
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    lender_type TEXT CHECK (lender_type IN ('chattel', 'mortgage', 'bank', 'credit_union', 'captive')),
    contact_name TEXT,
    contact_phone TEXT,
    contact_email TEXT,
    offers_chattel BOOLEAN DEFAULT false,
    offers_fha_title_i BOOLEAN DEFAULT false,
    offers_fha_title_ii BOOLEAN DEFAULT false,
    offers_va BOOLEAN DEFAULT false,
    offers_usda BOOLEAN DEFAULT false,
    offers_conventional BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    is_preferred BOOLEAN DEFAULT false,
    UNIQUE(org_id, code)
);

-- Lender Programs with Tiered Rates
CREATE TABLE lender_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lender_id UUID REFERENCES lenders(id),
    program_name TEXT NOT NULL,
    program_type TEXT CHECK (program_type IN ('chattel', 'fha_title_i', 'fha_title_ii', 'va', 'usda', 'conventional')),
    min_credit_score INTEGER,
    max_credit_score INTEGER,
    min_down_payment_percent DECIMAL(5,2),
    max_loan_amount DECIMAL(12,2),
    min_term_months INTEGER,
    max_term_months INTEGER,
    interest_rate_tiers JSONB DEFAULT '{}', -- {excellent: 6.99, good: 7.99, ...}
    requires_land_owned BOOLEAN DEFAULT false,
    requires_foundation_permanent BOOLEAN DEFAULT false,
    max_home_age_years INTEGER,
    is_active BOOLEAN DEFAULT true
);

-- Credit Applications
CREATE TABLE credit_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id),
    lead_id UUID REFERENCES leads(id),
    deal_id UUID REFERENCES deals(id),
    application_type TEXT CHECK (application_type IN ('individual', 'joint')),
    application_date DATE NOT NULL,
    
    -- Primary Applicant
    primary_ssn_encrypted TEXT,
    primary_dob DATE,
    primary_employment_status TEXT,
    primary_employer_name TEXT,
    primary_job_title TEXT,
    primary_years_employed DECIMAL(4,1),
    primary_monthly_income DECIMAL(10,2),
    primary_other_income DECIMAL(10,2),
    
    -- Co-Applicant
    co_ssn_encrypted TEXT,
    co_dob DATE,
    co_employment_status TEXT,
    co_employer_name TEXT,
    co_monthly_income DECIMAL(10,2),
    
    -- Financial Summary
    total_monthly_income DECIMAL(10,2),
    total_monthly_debts DECIMAL(10,2),
    debt_to_income_ratio DECIMAL(5,2),
    
    -- Credit Pull Results
    credit_pulled_at TIMESTAMPTZ,
    credit_bureau TEXT,
    credit_score INTEGER,
    credit_tier TEXT, -- excellent, good, fair, poor, subprime
    credit_report_url TEXT,
    
    -- Status
    status TEXT CHECK (status IN ('pending', 'submitted', 'in_review', 'approved', 'denied', 'counter_offer')) DEFAULT 'pending',
    decision_date DATE,
    decision_notes TEXT,
    submitted_to_lender_id UUID REFERENCES lenders(id),
    lender_reference_number TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2.2 Credit Tier-Based Routing Logic

```typescript
// lib/financing/credit-routing.ts

type CreditTier = 'excellent' | 'good' | 'fair' | 'poor' | 'subprime';

interface CreditProfile {
  score: number;
  monthlyIncome: number;
  monthlyDebts: number;
  dtiRatio: number;
  landStatus: 'OWNS_LAND' | 'BUYING_LAND' | 'NEEDS_PARK' | 'UNDECIDED';
  downPaymentAvailable: number;
  estimatedHomePrice: number;
}

const creditTierRanges: Record<CreditTier, { min: number; max: number }> = {
  excellent: { min: 720, max: 850 },
  good: { min: 680, max: 719 },
  fair: { min: 620, max: 679 },
  poor: { min: 580, max: 619 },
  subprime: { min: 300, max: 579 }
};

// Example Lender Program Configuration
const lenderPrograms = [
  {
    lender: "21st Mortgage",
    programs: [
      {
        name: "Chattel - Standard",
        type: "CHATTEL",
        minCreditScore: 580,
        maxDebtToIncome: 0.45,
        minDownPayment: 5,
        maxTermMonths: 240,
        rateTiers: {
          excellent: 6.99,
          good: 7.99,
          fair: 9.99,
          poor: 12.99,
          subprime: 15.99
        },
        requiresLandOwned: false
      },
      {
        name: "Land-Home FHA",
        type: "FHA_TITLE_II",
        minCreditScore: 620,
        maxDebtToIncome: 0.43,
        minDownPayment: 3.5,
        maxTermMonths: 360,
        rateTiers: {
          excellent: 5.99,
          good: 6.49,
          fair: 7.49
        },
        requiresLandOwned: true
      }
    ]
  },
  {
    lender: "Vanderbilt Mortgage",
    programs: [
      {
        name: "Chattel - Gold",
        type: "CHATTEL",
        minCreditScore: 640,
        maxDebtToIncome: 0.41,
        minDownPayment: 10,
        maxTermMonths: 240,
        rateTiers: {
          excellent: 6.49,
          good: 7.49,
          fair: 8.99,
          poor: 11.99
        }
      }
    ]
  },
  {
    lender: "Triad Financial",
    programs: [
      {
        name: "Chattel - Subprime",
        type: "CHATTEL",
        minCreditScore: 550,
        maxDebtToIncome: 0.50,
        minDownPayment: 10,
        maxTermMonths: 240,
        rateTiers: {
          fair: 10.99,
          poor: 13.99,
          subprime: 16.99
        }
      }
    ]
  }
];
```

---

## 3. Site Prep Workflow Module

### 3.1 Site Assessment & Contractor Management

```sql
-- Contractors
CREATE TABLE contractors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id),
    company_name TEXT NOT NULL,
    contact_name TEXT,
    phone TEXT,
    email TEXT,
    services TEXT[] DEFAULT '{}', -- ['excavation', 'foundation', 'septic', 'well', 'electrical']
    licensed_states TEXT[] DEFAULT '{}',
    insurance_expiry DATE,
    rating DECIMAL(3,2),
    average_completion_days INTEGER,
    is_active BOOLEAN DEFAULT true
);

-- Site Prep Tracking
CREATE TABLE site_prep (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_id UUID REFERENCES deals(id),
    contractor_id UUID REFERENCES contractors(id),
    
    -- Site Details
    site_address TEXT NOT NULL,
    site_city TEXT,
    site_state TEXT,
    site_zip TEXT,
    site_county TEXT,
    
    -- Zoning & Feasibility
    zoning_verified BOOLEAN DEFAULT false,
    zoning_notes TEXT,
    perc_test_status TEXT CHECK (perc_test_status IN ('not_required', 'pending', 'passed', 'failed')),
    perc_test_date DATE,
    soil_type TEXT,
    
    -- Foundation
    foundation_type TEXT CHECK (foundation_type IN ('piers', 'slab', 'crawl_space', 'basement', 'other')),
    foundation_specs JSONB DEFAULT '{}',
    
    -- Utilities
    electric_connection TEXT CHECK (electric_connection IN ('on_grid', 'solar', 'generator', 'pending')),
    water_source TEXT CHECK (water_source IN ('well', 'municipal', 'cistern', 'pending')),
    sewer_type TEXT CHECK (sewer_type IN ('septic', 'municipal', 'lagoon', 'pending')),
    gas_type TEXT CHECK (gas_type IN ('natural', 'propane', 'electric', 'none', 'pending')),
    
    -- Costs
    site_clearing_cost DECIMAL(10,2) DEFAULT 0,
    excavation_cost DECIMAL(10,2) DEFAULT 0,
    foundation_cost DECIMAL(10,2) DEFAULT 0,
    utility_connection_cost DECIMAL(10,2) DEFAULT 0,
    septic_cost DECIMAL(10,2) DEFAULT 0,
    well_cost DECIMAL(10,2) DEFAULT 0,
    other_costs DECIMAL(10,2) DEFAULT 0,
    total_cost DECIMAL(12,2) DEFAULT 0,
    
    -- Timeline
    estimated_start DATE,
    estimated_completion DATE,
    actual_start DATE,
    actual_completion DATE,
    
    status TEXT CHECK (status IN ('pending', 'in_progress', 'completed', 'delayed')) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Permits
CREATE TABLE permits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_prep_id UUID REFERENCES site_prep(id),
    permit_type TEXT CHECK (permit_type IN ('building', 'electrical', 'plumbing', 'septic', 'well', 'zoning', 'other')),
    permit_number TEXT,
    issuing_authority TEXT,
    application_date DATE,
    application_fee DECIMAL(10,2),
    status TEXT CHECK (status IN ('not_required', 'pending', 'approved', 'denied', 'expired')) DEFAULT 'pending',
    approved_date DATE,
    expiry_date DATE,
    inspection_required BOOLEAN DEFAULT false,
    inspection_scheduled DATE,
    inspection_completed DATE,
    inspection_passed BOOLEAN,
    notes TEXT
);
```

### 3.2 Site Assessment Checklist

```typescript
interface SiteAssessment {
  dealId: string;
  siteAddress: string;
  
  zoning: {
    zoneType: string;
    allowsManufacturedHomes: boolean;
    minimumLotSize: number;
    setbackRequirements: { front: number; back: number; sides: number };
  };
  
  soil: {
    soilType: string;
    percTestStatus: 'pending' | 'passed' | 'failed' | 'not_required';
    percRate: number;
    septicSystemType: 'conventional' | 'alternative' | 'mound' | 'aerobic';
  };
  
  utilities: {
    electric: { available: boolean; distance: number; cost: number };
    water: { source: 'well' | 'municipal' | 'cistern'; cost: number };
    sewer: { type: 'septic' | 'municipal' | 'lagoon'; cost: number };
    gas: { type: 'natural' | 'propane' | 'none'; cost: number };
  };
  
  access: {
    roadWidth: number;
    overheadClearance: number;
    turnRadiusAdequate: boolean;
    craneRequired: boolean;
  };
  
  foundation: {
    recommendedType: 'piers' | 'slab' | 'crawl_space' | 'basement';
    frostLineDepth: number;
    estimatedCost: number;
  };
}

// Typical Site Prep Cost Ranges by State
const sitePrepEstimates = {
  'IN': { clearing: 2000, excavation: 3000, foundation: 8000, septic: 7000, well: 6000 },
  'OH': { clearing: 2500, excavation: 3500, foundation: 9000, septic: 8000, well: 6500 },
  'MI': { clearing: 2200, excavation: 3200, foundation: 8500, septic: 7500, well: 6000 },
  'WI': { clearing: 2000, excavation: 3000, foundation: 9000, septic: 8000, well: 5500 },
  'IL': { clearing: 2800, excavation: 4000, foundation: 10000, septic: 8500, well: 7000 },
  'KY': { clearing: 1800, excavation: 2800, foundation: 7500, septic: 6500, well: 5000 }
};
```

---

## 4. Multi-State Tax Configuration

### 4.1 Tax Calculator

```typescript
// lib/taxes/multi-state.ts

interface TaxCalculation {
  state: 'IN' | 'OH' | 'MI' | 'WI' | 'IL' | 'KY';
  county?: string;
  homePrice: number;
  freightCost: number;
  setupCost: number;
  optionsPrice: number;
  sitePrepPrice: number;
}

const stateTaxRules = {
  'IN': {
    stateRate: 0.07,
    appliesTo: ['home', 'freight', 'setup', 'options'],
    exemptSitePrep: true,
    note: '7% state sales tax. Site prep exempt if separately stated.'
  },
  'OH': {
    stateRate: 0.0575,
    countyRates: {
      'Franklin': 0.015,
      'Cuyahoga': 0.02,
      'Hamilton': 0.015,
      'Montgomery': 0.0125
    },
    appliesTo: ['home', 'freight', 'setup', 'options'],
    exemptSitePrep: false
  },
  'MI': {
    stateRate: 0.06,
    appliesTo: ['home', 'freight', 'setup', 'options'],
    exemptSitePrep: true
  },
  'WI': {
    stateRate: 0.05,
    appliesTo: ['home', 'freight', 'setup', 'options', 'sitePrep'],
    exemptSitePrep: false
  },
  'IL': {
    stateRate: 0.0625,
    appliesTo: ['home', 'freight', 'setup', 'options'],
    exemptSitePrep: false
  },
  'KY': {
    stateRate: 0.06,
    appliesTo: ['home', 'freight', 'setup', 'options'],
    exemptSitePrep: false
  }
};

export function calculateSalesTax(calc: TaxCalculation): {
  stateTax: number;
  countyTax: number;
  totalTax: number;
  effectiveRate: number;
} {
  const rules = stateTaxRules[calc.state];
  
  let taxableAmount = 0;
  if (rules.appliesTo.includes('home')) taxableAmount += calc.homePrice;
  if (rules.appliesTo.includes('freight')) taxableAmount += calc.freightCost;
  if (rules.appliesTo.includes('setup')) taxableAmount += calc.setupCost;
  if (rules.appliesTo.includes('options')) taxableAmount += calc.optionsPrice;
  if (rules.appliesTo.includes('sitePrep') && !rules.exemptSitePrep) {
    taxableAmount += calc.sitePrepPrice;
  }
  
  const stateTax = taxableAmount * rules.stateRate;
  let countyTax = 0;
  
  if (calc.county && 'countyRates' in rules && rules.countyRates?.[calc.county]) {
    countyTax = taxableAmount * rules.countyRates[calc.county];
  }
  
  return {
    stateTax,
    countyTax,
    totalTax: stateTax + countyTax,
    effectiveRate: (stateTax + countyTax) / taxableAmount
  };
}
```

---

## 5. Post-Sale Operations

### 5.1 Delivery Management

```sql
-- Deliveries
CREATE TABLE deliveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_id UUID REFERENCES deals(id),
    contractor_id UUID REFERENCES contractors(id),
    
    -- Scheduling
    requested_date DATE,
    scheduled_date DATE,
    scheduled_time TIME,
    actual_delivery_date DATE,
    
    -- Logistics
    transport_company TEXT,
    driver_name TEXT,
    driver_phone TEXT,
    truck_number TEXT,
    route_permit_required BOOLEAN DEFAULT false,
    route_permit_number TEXT,
    escort_required BOOLEAN DEFAULT false,
    
    -- Crane
    crane_required BOOLEAN DEFAULT false,
    crane_company TEXT,
    crane_cost DECIMAL(10,2),
    
    -- Conditions
    weather_conditions TEXT,
    site_accessible BOOLEAN DEFAULT true,
    site_notes TEXT,
    
    -- Completion
    delivery_completed BOOLEAN DEFAULT false,
    sections_delivered INTEGER,
    setup_completed BOOLEAN DEFAULT false,
    customer_satisfaction INTEGER CHECK (customer_satisfaction BETWEEN 1 AND 10),
    customer_signature_url TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Punch List Items
CREATE TABLE punch_list_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_id UUID REFERENCES deals(id),
    category TEXT CHECK (category IN ('cosmetic', 'functional', 'appliance', 'structural')),
    description TEXT NOT NULL,
    severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'blocking')),
    reported_by UUID REFERENCES profiles(id),
    reported_date TIMESTAMPTZ DEFAULT NOW(),
    assigned_to UUID REFERENCES profiles(id),
    scheduled_date DATE,
    completed_date DATE,
    photos TEXT[] DEFAULT '{}',
    customer_approved BOOLEAN DEFAULT false
);
```

### 5.2 Title Work Tracking

```sql
-- Title Work
CREATE TABLE title_work (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_id UUID REFERENCES deals(id),
    
    title_type TEXT CHECK (title_type IN ('chattel', 'real_property')),
    title_company TEXT,
    
    -- Chattel Title
    chattel_title_number TEXT,
    chattel_title_state TEXT,
    lienholder_name TEXT,
    lienholder_address TEXT,
    
    -- Land-Home Title
    property_deed_number TEXT,
    property_legal_description TEXT,
    survey_required BOOLEAN DEFAULT false,
    survey_completed BOOLEAN DEFAULT false,
    survey_date DATE,
    
    -- Status
    title_ordered_date DATE,
    title_received_date DATE,
    title_clear BOOLEAN DEFAULT false,
    title_issues TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 6. Service & Warranty Module

### 6.1 Warranty Tracking

```sql
-- Warranties
CREATE TABLE warranties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_id UUID REFERENCES deals(id),
    home_id UUID REFERENCES home_inventory(id),
    
    warranty_type TEXT CHECK (warranty_type IN ('manufacturer', 'dealer', 'extended', 'structural')),
    provider TEXT,
    start_date DATE,
    end_date DATE,
    duration_months INTEGER,
    coverage_summary TEXT,
    coverage_details JSONB DEFAULT '{}',
    deductible DECIMAL(10,2) DEFAULT 0,
    warranty_document_url TEXT,
    registration_completed BOOLEAN DEFAULT false
);

-- Service Requests
CREATE TABLE service_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id),
    deal_id UUID REFERENCES deals(id),
    warranty_id UUID REFERENCES warranties(id),
    
    request_number TEXT UNIQUE NOT NULL,
    issue_category TEXT CHECK (issue_category IN ('plumbing', 'electrical', 'hvac', 'structural', 'cosmetic', 'appliance', 'other')),
    issue_description TEXT NOT NULL,
    priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'emergency')) DEFAULT 'medium',
    
    status TEXT CHECK (status IN ('open', 'scheduled', 'in_progress', 'waiting_parts', 'completed', 'closed')) DEFAULT 'open',
    
    reported_date TIMESTAMPTZ DEFAULT NOW(),
    scheduled_date DATE,
    completed_date DATE,
    
    resolution_notes TEXT,
    parts_used JSONB DEFAULT '[]',
    labor_hours DECIMAL(5,2),
    total_cost DECIMAL(10,2),
    customer_charged BOOLEAN DEFAULT false,
    customer_satisfied BOOLEAN,
    follow_up_required BOOLEAN DEFAULT false,
    
    assigned_to UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 6.2 Warranty Periods by Component

| Component | Manufacturer Warranty | Dealer Warranty | Notes |
|-----------|----------------------|-----------------|-------|
| **Structure** | 1 year | 1 year | HUD requirement |
| **Plumbing** | 1 year | 90 days | 
| **Electrical** | 1 year | 90 days |
| **HVAC** | 1-5 years | 90 days | Varies by manufacturer |
| **Appliances** | 1 year | 30 days | Per manufacturer |
| **Roof** | 20-30 years | 1 year | Shingle/manufacturer dependent |

---

## 7. Used Home Trade-In Module

### 7.1 Trade-In Inventory

```sql
-- Trade-In Inventory
CREATE TABLE trade_in_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id),
    source_deal_id UUID REFERENCES deals(id),
    acquired_date DATE NOT NULL,
    acquisition_cost DECIMAL(12,2),
    
    -- Home Details
    manufacturer TEXT NOT NULL,
    model_name TEXT,
    year INTEGER,
    serial_number TEXT,
    hud_label_number TEXT,
    category TEXT,
    square_feet INTEGER,
    bedrooms INTEGER,
    bathrooms DECIMAL(3,1),
    
    -- Condition
    condition_rating INTEGER CHECK (condition_rating BETWEEN 1 AND 10),
    condition_notes TEXT,
    needed_repairs JSONB DEFAULT '[]',
    repair_cost_estimate DECIMAL(10,2),
    
    -- Valuation
    book_value DECIMAL(12,2),
    market_value DECIMAL(12,2),
    retail_value DECIMAL(12,2),
    
    -- Status
    status TEXT CHECK (status IN ('acquired', 'in_repair', 'ready_for_sale', 'sold', 'wholesaled')) DEFAULT 'acquired',
    location TEXT,
    lot_space_number TEXT,
    photos JSONB DEFAULT '[]',
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 8. Implementation Priority

### Phase 1: Foundation (Weeks 1-3)
- [ ] Core database schema (organizations, profiles, leads, deals)
- [ ] Authentication & authorization
- [ ] Basic lead management
- [ ] Home inventory tracking

### Phase 2: Sales Process (Weeks 4-6)
- [ ] Intelligent lead routing
- [ ] Desking matrix with three scenarios
- [ ] Credit application workflow
- [ ] Lender integration

### Phase 3: Operations (Weeks 7-9)
- [ ] Site prep workflow
- [ ] Permit tracking
- [ ] Delivery scheduling
- [ ] Punch list management

### Phase 4: Compliance & Post-Sale (Weeks 10-12)
- [ ] HUD compliance tracking
- [ ] Title work management
- [ ] Warranty tracking
- [ ] Service request system

### Phase 5: Advanced Features (Weeks 13-16)
- [ ] Multi-state tax configuration
- [ ] Trade-in management
- [ ] Advanced reporting
- [ ] Mobile app

---

## Summary of Gaps Addressed

| Gap | Solution |
|-----|----------|
| **HUD Compliance** | Full tracking table + verification workflows |
| **State-Specific Rules** | Configuration table for all 6 states |
| **Credit Tier Routing** | Lender programs with tiered rates |
| **Site Prep Workflow** | Contractor management + permit tracking |
| **Multi-State Taxes** | Configurable tax calculator |
| **Delivery Management** | Scheduling + logistics tracking |
| **Punch Lists** | Item tracking with severity levels |
| **Title Work** | Separate chattel vs land-home tracking |
| **Warranty** | Multi-tier warranty tracking |
| **Service** | Full ticketing system |
| **Trade-Ins** | Used home inventory management |

This supplement, combined with the original blueprint, creates a **truly enterprise-grade** manufactured housing DMS that addresses every major operational requirement for Factory Direct Homes Center.