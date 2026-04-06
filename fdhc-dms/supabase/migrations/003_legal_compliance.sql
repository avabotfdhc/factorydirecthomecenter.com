-- Enhanced Purchase Agreement Schema with Legal Compliance

-- State Compliance Configuration
CREATE TABLE state_compliance_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    state_code TEXT NOT NULL UNIQUE,
    state_name TEXT NOT NULL,
    
    -- HUD Compliance
    hud_installation_code TEXT NOT NULL,
    hud_inspection_required BOOLEAN DEFAULT true,
    hud_warranty_period_months INTEGER DEFAULT 12,
    
    -- Tax Configuration
    sales_tax_rate DECIMAL(5,4) NOT NULL,
    sales_tax_applies_to_home BOOLEAN DEFAULT true,
    sales_tax_applies_to_freight BOOLEAN DEFAULT true,
    sales_tax_applies_to_setup BOOLEAN DEFAULT true,
    sales_tax_applies_to_options BOOLEAN DEFAULT true,
    sales_tax_applies_to_site_prep BOOLEAN DEFAULT false,
    
    -- Title & Registration
    title_type TEXT CHECK (title_type IN ('chattel', 'real_property', 'both')),
    title_transfer_days INTEGER DEFAULT 30,
    registration_required BOOLEAN DEFAULT true,
    
    -- Required Disclosures
    requires_cooling_off_period BOOLEAN DEFAULT true,
    cooling_off_period_days INTEGER DEFAULT 3,
    requires_asbestos_disclosure BOOLEAN DEFAULT false,
    requires_lead_paint_disclosure BOOLEAN DEFAULT false,
    requires_formaldehyde_disclosure BOOLEAN DEFAULT true,
    
    -- Contract Requirements
    requires_notarization BOOLEAN DEFAULT false,
    requires_witness_signatures BOOLEAN DEFAULT false,
    max_deposit_percent DECIMAL(5,2) DEFAULT 25.00,
    
    -- Default Legal Templates
    default_agreement_template_id UUID,
    default_addendum_template_id UUID,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert state configurations for all 6 states
INSERT INTO state_compliance_requirements (
    state_code, state_name, hud_installation_code, sales_tax_rate, 
    title_type, requires_cooling_off_period, cooling_off_period_days,
    requires_formaldehyde_disclosure, max_deposit_percent
) VALUES
('IN', 'Indiana', 'Indiana Modular', 0.0700, 'chattel', true, 3, true, 25.00),
('OH', 'Ohio', 'Ohio Basic', 0.0575, 'both', true, 3, true, 25.00),
('MI', 'Michigan', 'Michigan Modular', 0.0600, 'both', true, 3, true, 25.00),
('WI', 'Wisconsin', 'Wisconsin UDC', 0.0500, 'real_property', true, 3, true, 25.00),
('IL', 'Illinois', 'Illinois Modular', 0.0625, 'both', true, 3, true, 25.00),
('KY', 'Kentucky', 'Kentucky', 0.0600, 'chattel', true, 3, true, 25.00);

-- Enhanced Purchase Agreement Templates with Legal Content
CREATE TABLE purchase_agreement_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id),
    name TEXT NOT NULL,
    description TEXT,
    
    -- Template Type
    template_type TEXT CHECK (template_type IN ('MASTER_AGREEMENT', 'ADDENDUM_A', 'HUD_DISCLOSURE', 'STATE_DISCLOSURE', 'FEDERAL_DISCLOSURE')) DEFAULT 'MASTER_AGREEMENT',
    
    -- State Specific
    state_code TEXT REFERENCES state_compliance_requirements(state_code),
    is_default BOOLEAN DEFAULT false,
    
    -- Template Content
    header_content TEXT,
    body_content TEXT NOT NULL,
    footer_content TEXT,
    
    -- Legal Disclaimers
    required_disclaimers TEXT[] DEFAULT '{}',
    optional_disclaimers TEXT[] DEFAULT '{}',
    
    -- Version Control
    version TEXT DEFAULT '1.0',
    effective_date DATE DEFAULT CURRENT_DATE,
    expiration_date DATE,
    
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(org_id, template_type, state_code)
);

-- Addendum A for Optional Upgrades
CREATE TABLE addendum_a_upgrades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agreement_id UUID REFERENCES purchase_agreements(id) ON DELETE CASCADE,
    
    -- Upgrade Details
    item_number TEXT NOT NULL,
    category TEXT NOT NULL, -- 'appliance', 'interior', 'exterior', 'structural', 'other'
    description TEXT NOT NULL,
    manufacturer TEXT,
    model_number TEXT,
    
    -- Pricing
    retail_price DECIMAL(12,2) NOT NULL,
    dealer_cost DECIMAL(12,2),
    
    -- Installation
    installed_by TEXT, -- 'factory', 'dealer', 'third_party'
    installation_cost DECIMAL(12,2) DEFAULT 0,
    
    -- Warranty
    warranty_period_months INTEGER,
    warranty_description TEXT,
    
    -- Status
    is_included_in_base_price BOOLEAN DEFAULT false,
    is_customer_selected BOOLEAN DEFAULT true,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enhanced Purchase Agreements Table
ALTER TABLE purchase_agreements ADD COLUMN IF NOT EXISTS delivery_state TEXT;
ALTER TABLE purchase_agreements ADD COLUMN IF NOT EXISTS delivery_state_tax_rate DECIMAL(5,4);
ALTER TABLE purchase_agreements ADD COLUMN IF NOT EXISTS sales_tax_amount DECIMAL(12,2) DEFAULT 0;
ALTER TABLE purchase_agreements ADD COLUMN IF NOT EXISTS total_with_tax DECIMAL(12,2);

-- HUD Compliance Fields
ALTER TABLE purchase_agreements ADD COLUMN IF NOT EXISTS hud_label_number TEXT;
ALTER TABLE purchase_agreements ADD COLUMN IF NOT EXISTS hud_installation_standards TEXT;
ALTER TABLE purchase_agreements ADD COLUMN IF NOT EXISTS hud_warranty_start_date DATE;
ALTER TABLE purchase_agreements ADD COLUMN IF NOT EXISTS hud_warranty_end_date DATE;

-- Legal Compliance Fields
ALTER TABLE purchase_agreements ADD COLUMN IF NOT EXISTS cooling_off_period_end DATE;
ALTER TABLE purchase_agreements ADD COLUMN IF NOT EXISTS cooling_off_period_waived BOOLEAN DEFAULT false;
ALTER TABLE purchase_agreements ADD COLUMN IF NOT EXISTS cooling_off_waiver_signed_at TIMESTAMPTZ;

-- Required Disclosures Acknowledged
ALTER TABLE purchase_agreements ADD COLUMN IF NOT EXISTS asbestos_disclosure_acknowledged BOOLEAN DEFAULT false;
ALTER TABLE purchase_agreements ADD COLUMN IF NOT EXISTS lead_paint_disclosure_acknowledged BOOLEAN DEFAULT false;
ALTER TABLE purchase_agreements ADD COLUMN IF NOT EXISTS formaldehyde_disclosure_acknowledged BOOLEAN DEFAULT false;
ALTER TABLE purchase_agreements ADD COLUMN IF NOT EXISTS mold_disclosure_acknowledged BOOLEAN DEFAULT false;

-- Addendum A Reference
ALTER TABLE purchase_agreements ADD COLUMN IF NOT EXISTS addendum_a_included BOOLEAN DEFAULT false;
ALTER TABLE purchase_agreements ADD COLUMN IF NOT EXISTS addendum_a_total DECIMAL(12,2) DEFAULT 0;

-- Document Storage
ALTER TABLE purchase_agreements ADD COLUMN IF NOT EXISTS master_agreement_url TEXT;
ALTER TABLE purchase_agreements ADD COLUMN IF NOT EXISTS addendum_a_url TEXT;
ALTER TABLE purchase_agreements ADD COLUMN IF NOT EXISTS hud_disclosure_url TEXT;
ALTER TABLE purchase_agreements ADD COLUMN IF NOT EXISTS state_disclosure_url TEXT;

-- Enable RLS on new tables
ALTER TABLE state_compliance_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_agreement_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE addendum_a_upgrades ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view state compliance" ON state_compliance_requirements
    FOR SELECT USING (true);

CREATE POLICY "Users can view org templates" ON purchase_agreement_templates
    FOR SELECT USING (org_id IN (
        SELECT org_id FROM profiles WHERE id = auth.uid()
    ));

CREATE POLICY "Managers can manage templates" ON purchase_agreement_templates
    FOR ALL USING (
        org_id IN (SELECT org_id FROM profiles WHERE id = auth.uid())
        AND EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'manager')
        )
    );

CREATE POLICY "Users can view agreement upgrades" ON addendum_a_upgrades
    FOR SELECT USING (
        agreement_id IN (
            SELECT id FROM purchase_agreements 
            WHERE org_id IN (SELECT org_id FROM profiles WHERE id = auth.uid())
        )
    );

CREATE POLICY "Users can manage agreement upgrades" ON addendum_a_upgrades
    FOR ALL USING (
        agreement_id IN (
            SELECT id FROM purchase_agreements 
            WHERE org_id IN (SELECT org_id FROM profiles WHERE id = auth.uid())
        )
    );

-- Function to calculate sales tax based on delivery state
CREATE OR REPLACE FUNCTION calculate_sales_tax(
    p_agreement_id UUID
) RETURNS DECIMAL(12,2) AS $$
DECLARE
    v_state_code TEXT;
    v_tax_rate DECIMAL(5,4);
    v_taxable_amount DECIMAL(12,2) := 0;
    v_tax_amount DECIMAL(12,2) := 0;
    v_agreement RECORD;
    v_state_config RECORD;
BEGIN
    -- Get agreement details
    SELECT * INTO v_agreement FROM purchase_agreements WHERE id = p_agreement_id;
    
    -- Get state configuration
    SELECT * INTO v_state_config 
    FROM state_compliance_requirements 
    WHERE state_code = v_agreement.delivery_state;
    
    IF v_state_config IS NULL THEN
        RETURN 0;
    END IF;
    
    -- Calculate taxable amount based on state rules
    IF v_state_config.sales_tax_applies_to_home THEN
        v_taxable_amount := v_taxable_amount + v_agreement.base_home_price;
    END IF;
    
    IF v_state_config.sales_tax_applies_to_options THEN
        v_taxable_amount := v_taxable_amount + v_agreement.factory_options_price;
    END IF;
    
    IF v_state_config.sales_tax_applies_to_freight THEN
        v_taxable_amount := v_taxable_amount + v_agreement.freight_cost;
    END IF;
    
    IF v_state_config.sales_tax_applies_to_setup THEN
        v_taxable_amount := v_taxable_amount + v_agreement.setup_cost;
    END IF;
    
    IF v_state_config.sales_tax_applies_to_site_prep THEN
        v_taxable_amount := v_taxable_amount + v_agreement.site_prep_price;
    END IF;
    
    -- Calculate tax
    v_tax_amount := v_taxable_amount * v_state_config.sales_tax_rate;
    
    RETURN v_tax_amount;
END;
$$ LANGUAGE plpgsql;

-- Function to set cooling off period
CREATE OR REPLACE FUNCTION set_cooling_off_period()
RETURNS TRIGGER AS $$
DECLARE
    v_state_config RECORD;
BEGIN
    -- Get state configuration
    SELECT * INTO v_state_config 
    FROM state_compliance_requirements 
    WHERE state_code = NEW.delivery_state;
    
    IF v_state_config IS NOT NULL AND v_state_config.requires_cooling_off_period THEN
        NEW.cooling_off_period_end := NEW.agreement_date + v_state_config.cooling_off_period_days;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_cooling_off_period_trigger
    BEFORE INSERT ON purchase_agreements
    FOR EACH ROW
    EXECUTE FUNCTION set_cooling_off_period();

-- Function to calculate totals with tax
CREATE OR REPLACE FUNCTION calculate_agreement_totals()
RETURNS TRIGGER AS $$
DECLARE
    v_base_total DECIMAL(12,2);
    v_tax_amount DECIMAL(12,2);
    v_state_config RECORD;
BEGIN
    -- Calculate base total
    v_base_total := NEW.base_home_price + 
                    NEW.factory_options_price + 
                    NEW.freight_cost + 
                    NEW.setup_cost + 
                    NEW.site_prep_price - 
                    NEW.trade_in_value;
    
    -- Calculate tax
    v_tax_amount := calculate_sales_tax(NEW.id);
    
    -- Update totals
    NEW.sales_tax_amount := v_tax_amount;
    NEW.total_with_tax := v_base_total + v_tax_amount;
    
    -- Set state tax rate
    SELECT sales_tax_rate INTO NEW.delivery_state_tax_rate
    FROM state_compliance_requirements 
    WHERE state_code = NEW.delivery_state;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_agreement_totals_trigger
    BEFORE INSERT OR UPDATE ON purchase_agreements
    FOR EACH ROW
    EXECUTE FUNCTION calculate_agreement_totals();

-- Indexes
CREATE INDEX idx_addendum_a_upgrades_agreement_id ON addendum_a_upgrades(agreement_id);
CREATE INDEX idx_purchase_agreements_delivery_state ON purchase_agreements(delivery_state);
CREATE INDEX idx_purchase_agreement_templates_state ON purchase_agreement_templates(state_code);

-- Insert default legal templates
INSERT INTO purchase_agreement_templates (
    name,
    description,
    template_type,
    state_code,
    is_default,
    body_content,
    required_disclaimers,
    version
) VALUES (
    'Master Purchase Agreement - Standard',
    'Standard master purchase agreement template',
    'MASTER_AGREEMENT',
    NULL,
    true,
    'PURCHASE AGREEMENT

This Purchase Agreement ("Agreement") is entered into on {agreement_date} between:

SELLER:
Factory Direct Homes Center
{dealer_address}
Phone: {dealer_phone}

BUYER:
{client_first_name} {client_last_name}
{client_address}
{city}, {state} {zip}
Phone: {client_phone}

1. PROPERTY DESCRIPTION
Manufacturer: {manufacturer}
Model: {model_name}
Year: {year}
Serial Number: {serial_number}
HUD Label Number: {hud_label_number}

2. PURCHASE PRICE
Base Home Price: {base_home_price}
Factory Options: {factory_options_price}
Freight & Setup: {freight_setup}
Site Preparation: {site_prep_price}
Trade-In Value: {trade_in_value}
Sales Tax ({tax_rate}%): {sales_tax}
TOTAL PURCHASE PRICE: {total_price}

3. PAYMENT TERMS
Deposit Amount: {deposit_amount}
Deposit Paid: {deposit_status}
Down Payment: {down_payment}
Loan Amount: {loan_amount}
Monthly Payment: {monthly_payment}

4. DELIVERY
Expected Delivery Date: {expected_delivery_date}
Delivery Address: {site_address}

5. WARRANTIES
Manufacturer Warranty: Per manufacturer terms
Dealer Warranty: 1 year from date of delivery
HUD Installation Standards: {hud_standards}

6. COOLING-OFF PERIOD
You have until {cooling_off_date} to cancel this agreement without penalty.

7. GOVERNING LAW
This agreement is governed by the laws of {state}.

BUYER SIGNATURE: _________________________ Date: _______
SELLER SIGNATURE: _________________________ Date: _______',
    ARRAY['cooling_off_notice', 'warranty_disclaimer', 'governing_law'],
    '1.0'
);

INSERT INTO purchase_agreement_templates (
    name,
    description,
    template_type,
    state_code,
    is_default,
    body_content,
    version
) VALUES (
    'Addendum A - Optional Upgrades',
    'Addendum for optional upgrades and customizations',
    'ADDENDUM_A',
    NULL,
    true,
    'ADDENDUM A - OPTIONAL UPGRADES

This Addendum A is part of Purchase Agreement #{agreement_number} dated {agreement_date}.

The following optional upgrades have been selected by the Buyer:

{upgrade_table}

UPGRADE TOTAL: {addendum_a_total}

These upgrades {are/are_not} included in the base purchase price.

Installation: Upgrades will be installed by {installation_party}.

Warranty: Each upgrade carries the manufacturer warranty as specified.

Buyer acknowledges these upgrades are optional and have been selected at their discretion.

BUYER INITIALS: _______ Date: _______',
    '1.0'
);

INSERT INTO purchase_agreement_templates (
    name,
    description,
    template_type,
    state_code,
    is_default,
    body_content,
    version
) VALUES (
    'HUD Installation Standards Disclosure',
    'Required HUD disclosure for manufactured housing',
    'HUD_DISCLOSURE',
    NULL,
    true,
    'HUD INSTALLATION STANDARDS DISCLOSURE

Federal law requires that manufactured homes be installed according to HUD standards (24 CFR 3285).

INSTALLATION REQUIREMENTS:
- Home must be installed on a proper foundation
- Tie-downs and anchoring must meet HUD specifications
- Site preparation must comply with local and federal codes
- Installation must be performed by qualified installers

BUYER ACKNOWLEDGMENT:
I understand that proper installation is required for:
1. Safety and structural integrity
2. Warranty coverage
3. Compliance with federal law
4. Insurance coverage

INSTALLER CERTIFICATION:
This home will be installed by installers certified to HUD standards.

BUYER SIGNATURE: _________________________ Date: _______',
    '1.0'
);
