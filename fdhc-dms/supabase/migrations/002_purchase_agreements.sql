-- Add Purchase Agreement tables to the DMS schema

-- Purchase Agreement Templates
CREATE TABLE purchase_agreement_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id),
    name TEXT NOT NULL,
    description TEXT,
    content TEXT NOT NULL,
    is_default BOOLEAN DEFAULT false,
    state_specific TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Purchase Agreements
CREATE TABLE purchase_agreements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id),
    deal_id UUID REFERENCES deals(id) NOT NULL,
    lead_id UUID REFERENCES leads(id) NOT NULL,
    agreement_number TEXT UNIQUE NOT NULL,
    status TEXT CHECK (status IN ('DRAFT', 'PENDING_SIGNATURE', 'SIGNED', 'CANCELLED', 'EXPIRED')) DEFAULT 'DRAFT',
    
    -- Client Info (auto-populated from lead)
    client_first_name TEXT NOT NULL,
    client_last_name TEXT NOT NULL,
    client_email TEXT,
    client_phone TEXT NOT NULL,
    client_address TEXT,
    client_city TEXT,
    client_state TEXT,
    client_zip TEXT,
    
    -- Home Info (auto-populated from deal/home)
    home_id UUID REFERENCES home_inventory(id),
    manufacturer TEXT,
    model_name TEXT,
    serial_number TEXT,
    year INTEGER,
    
    -- Financial Terms (auto-populated from deal)
    base_home_price DECIMAL(12,2) NOT NULL DEFAULT 0,
    factory_options_price DECIMAL(12,2) DEFAULT 0,
    freight_cost DECIMAL(12,2) DEFAULT 0,
    setup_cost DECIMAL(12,2) DEFAULT 0,
    site_prep_price DECIMAL(12,2) DEFAULT 0,
    trade_in_value DECIMAL(12,2) DEFAULT 0,
    down_payment DECIMAL(12,2) DEFAULT 0,
    loan_amount DECIMAL(12,2) DEFAULT 0,
    monthly_payment DECIMAL(10,2) DEFAULT 0,
    
    -- Agreement Terms
    deposit_amount DECIMAL(12,2) DEFAULT 0,
    deposit_paid BOOLEAN DEFAULT false,
    deposit_paid_date DATE,
    deposit_payment_method TEXT,
    
    -- Important Dates
    agreement_date DATE NOT NULL DEFAULT CURRENT_DATE,
    expiration_date DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '30 days'),
    expected_delivery_date DATE,
    
    -- Site Information
    site_address TEXT,
    site_city TEXT,
    site_state TEXT,
    site_zip TEXT,
    
    -- Special Terms & Notes
    special_terms TEXT,
    included_options TEXT[] DEFAULT '{}',
    excluded_items TEXT[] DEFAULT '{}',
    
    -- Signatures
    client_signature_url TEXT,
    client_signed_at TIMESTAMPTZ,
    sales_rep_signature_url TEXT,
    sales_rep_signed_at TIMESTAMPTZ,
    manager_signature_url TEXT,
    manager_signed_at TIMESTAMPTZ,
    
    -- Document
    document_url TEXT,
    document_generated_at TIMESTAMPTZ,
    
    created_by UUID REFERENCES profiles(id) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE purchase_agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_agreement_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Purchase Agreements
CREATE POLICY "Users can view org purchase agreements" ON purchase_agreements
    FOR SELECT USING (org_id IN (
        SELECT org_id FROM profiles WHERE id = auth.uid()
    ));

CREATE POLICY "Users can create org purchase agreements" ON purchase_agreements
    FOR INSERT WITH CHECK (org_id IN (
        SELECT org_id FROM profiles WHERE id = auth.uid()
    ));

CREATE POLICY "Users can update assigned purchase agreements" ON purchase_agreements
    FOR UPDATE USING (
        org_id IN (SELECT org_id FROM profiles WHERE id = auth.uid())
    );

-- RLS Policies for Templates
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

-- Function to generate agreement number
CREATE OR REPLACE FUNCTION generate_agreement_number()
RETURNS TEXT AS $$
DECLARE
    year TEXT;
    sequence_num INTEGER;
    new_number TEXT;
BEGIN
    year := TO_CHAR(CURRENT_DATE, 'YYYY');
    
    -- Get the next sequence number for this year
    SELECT COUNT(*) + 1 INTO sequence_num
    FROM purchase_agreements
    WHERE agreement_number LIKE year || '-%';
    
    new_number := year || '-' || LPAD(sequence_num::TEXT, 4, '0');
    
    RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-populate purchase agreement from deal/lead
CREATE OR REPLACE FUNCTION populate_purchase_agreement()
RETURNS TRIGGER AS $$
DECLARE
    deal_record RECORD;
    lead_record RECORD;
    home_record RECORD;
BEGIN
    -- Get deal info
    SELECT * INTO deal_record FROM deals WHERE id = NEW.deal_id;
    
    -- Get lead info
    SELECT * INTO lead_record FROM leads WHERE id = NEW.lead_id;
    
    -- Get home info if available
    IF deal_record.home_id IS NOT NULL THEN
        SELECT * INTO home_record FROM home_inventory WHERE id = deal_record.home_id;
    END IF;
    
    -- Auto-populate client info from lead
    NEW.client_first_name := lead_record.first_name;
    NEW.client_last_name := lead_record.last_name;
    NEW.client_email := lead_record.email;
    NEW.client_phone := lead_record.phone;
    NEW.client_address := lead_record.custom_fields->>'address';
    NEW.client_city := lead_record.custom_fields->>'city';
    NEW.client_state := lead_record.custom_fields->>'state';
    NEW.client_zip := lead_record.custom_fields->>'zip';
    
    -- Auto-populate home info
    IF home_record IS NOT NULL THEN
        NEW.home_id := home_record.id;
        NEW.manufacturer := home_record.manufacturer;
        NEW.model_name := home_record.model_name;
        NEW.serial_number := home_record.serial_number;
        NEW.year := home_record.year;
    END IF;
    
    -- Auto-populate financial terms from deal
    NEW.base_home_price := COALESCE(deal_record.base_home_price, 0);
    NEW.factory_options_price := COALESCE(deal_record.factory_options_price, 0);
    NEW.freight_cost := COALESCE(deal_record.freight_cost, 0);
    NEW.setup_cost := COALESCE(deal_record.setup_cost, 0);
    NEW.site_prep_price := COALESCE(deal_record.site_prep_price, 0);
    NEW.trade_in_value := COALESCE(deal_record.trade_in_value, 0);
    NEW.down_payment := COALESCE(deal_record.down_payment, 0);
    NEW.loan_amount := COALESCE(deal_record.loan_amount, 0);
    NEW.monthly_payment := COALESCE(deal_record.monthly_payment, 0);
    
    -- Generate agreement number if not provided
    IF NEW.agreement_number IS NULL THEN
        NEW.agreement_number := generate_agreement_number();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER populate_purchase_agreement_trigger
    BEFORE INSERT ON purchase_agreements
    FOR EACH ROW
    EXECUTE FUNCTION populate_purchase_agreement();

-- Indexes
CREATE INDEX idx_purchase_agreements_org_id ON purchase_agreements(org_id);
CREATE INDEX idx_purchase_agreements_deal_id ON purchase_agreements(deal_id);
CREATE INDEX idx_purchase_agreements_lead_id ON purchase_agreements(lead_id);
CREATE INDEX idx_purchase_agreements_status ON purchase_agreements(status);
CREATE INDEX idx_purchase_agreements_agreement_number ON purchase_agreements(agreement_number);

-- Insert default template
INSERT INTO purchase_agreement_templates (org_id, name, description, content, is_default)
VALUES (
    (SELECT id FROM organizations LIMIT 1),
    'Standard Purchase Agreement',
    'Default purchase agreement template for manufactured housing sales',
    'PURCHASE AGREEMENT

This Purchase Agreement ("Agreement") is entered into on {agreement_date} between:

SELLER: Factory Direct Homes Center
BUYER: {client_first_name} {client_last_name}

PROPERTY:
Manufacturer: {manufacturer}
Model: {model_name}
Year: {year}
Serial Number: {serial_number}

PURCHASE PRICE: {total_price}

TERMS:
- Deposit: {deposit_amount}
- Down Payment: {down_payment}
- Loan Amount: {loan_amount}
- Monthly Payment: {monthly_payment}

The parties agree to the terms and conditions set forth in this Agreement.

_______________________
Buyer Signature

_______________________
Seller Representative
',
    true
);
