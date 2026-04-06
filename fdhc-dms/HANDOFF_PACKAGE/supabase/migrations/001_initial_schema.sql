-- supabase/migrations/001_initial_schema.sql
-- Manufactured Housing DMS - Initial Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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

-- Row Level Security Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE ledger ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read their own org's profiles
CREATE POLICY "Users can view org profiles" ON profiles
    FOR SELECT USING (org_id IN (
        SELECT org_id FROM profiles WHERE id = auth.uid()
    ));

-- Profiles: Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (id = auth.uid());

-- Leads: Users can view leads in their org
CREATE POLICY "Users can view org leads" ON leads
    FOR SELECT USING (org_id IN (
        SELECT org_id FROM profiles WHERE id = auth.uid()
    ));

-- Leads: Users can create leads in their org
CREATE POLICY "Users can create org leads" ON leads
    FOR INSERT WITH CHECK (org_id IN (
        SELECT org_id FROM profiles WHERE id = auth.uid()
    ));

-- Leads: Users can update leads they own or are assigned
CREATE POLICY "Users can update assigned leads" ON leads
    FOR UPDATE USING (
        org_id IN (SELECT org_id FROM profiles WHERE id = auth.uid())
        AND (assigned_to = auth.uid() OR assigned_to IS NULL)
    );

-- Deals: Same pattern as leads
CREATE POLICY "Users can view org deals" ON deals
    FOR SELECT USING (org_id IN (
        SELECT org_id FROM profiles WHERE id = auth.uid()
    ));

CREATE POLICY "Users can create org deals" ON deals
    FOR INSERT WITH CHECK (org_id IN (
        SELECT org_id FROM profiles WHERE id = auth.uid()
    ));

CREATE POLICY "Users can update assigned deals" ON deals
    FOR UPDATE USING (
        org_id IN (SELECT org_id FROM profiles WHERE id = auth.uid())
        AND (assigned_to = auth.uid() OR assigned_to IS NULL)
    );

-- Activities: Users can view activities for their org
CREATE POLICY "Users can view org activities" ON activities
    FOR SELECT USING (org_id IN (
        SELECT org_id FROM profiles WHERE id = auth.uid()
    ));

-- Activities: Users can create activities
CREATE POLICY "Users can create activities" ON activities
    FOR INSERT WITH CHECK (
        org_id IN (SELECT org_id FROM profiles WHERE id = auth.uid())
        AND user_id = auth.uid()
    );

-- Home Inventory: Viewable by all org users
CREATE POLICY "Users can view org inventory" ON home_inventory
    FOR SELECT USING (org_id IN (
        SELECT org_id FROM profiles WHERE id = auth.uid()
    ));

-- Ledger: Viewable by managers and admins
CREATE POLICY "Managers can view ledger" ON ledger
    FOR SELECT USING (
        org_id IN (SELECT org_id FROM profiles WHERE id = auth.uid())
        AND EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'manager')
        )
    );

-- Functions
CREATE OR REPLACE FUNCTION increment_contact_attempts(lead_id UUID)
RETURNS INTEGER AS $$
DECLARE
    current_attempts INTEGER;
BEGIN
    SELECT contact_attempts INTO current_attempts FROM leads WHERE id = lead_id;
    RETURN COALESCE(current_attempts, 0) + 1;
END;
$$ LANGUAGE plpgsql;

-- Trigger for activity outcome automation
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
        
        -- Rule: No Answer -> Schedule follow-up in 2 hours
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
        END IF;
        
        -- Rule: Appointment Set -> Update lead
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

-- Indexes for performance
CREATE INDEX idx_leads_org_id ON leads(org_id);
CREATE INDEX idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_deals_org_id ON deals(org_id);
CREATE INDEX idx_deals_lead_id ON deals(lead_id);
CREATE INDEX idx_activities_lead_id ON activities(lead_id);
CREATE INDEX idx_activities_user_id ON activities(user_id);
CREATE INDEX idx_home_inventory_org_id ON home_inventory(org_id);
CREATE INDEX idx_home_inventory_status ON home_inventory(status);
