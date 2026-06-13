-- =====================================================
-- Factory Direct Homes Center - Website Database Schema
-- Migration 001: Core Tables
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- FLOOR PLANS TABLE
-- =====================================================
CREATE TABLE floor_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    series VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('Single Wide', 'Double Wide', 'Modular')),
    code VARCHAR(10) NOT NULL CHECK (code IN ('HUD', 'IRC')),
    sqft INTEGER NOT NULL,
    beds INTEGER NOT NULL,
    baths INTEGER NOT NULL,
    sections VARCHAR(50) NOT NULL,
    price VARCHAR(50) NOT NULL,
    price_numeric INTEGER NOT NULL,
    sku VARCHAR(50) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    hero_image VARCHAR(500) NOT NULL,
    hero_image_alt VARCHAR(300) NOT NULL,
    pdf_url VARCHAR(500),
    features TEXT[] DEFAULT '{}',
    specs JSONB DEFAULT '{}',
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for floor_plans
CREATE INDEX idx_floor_plans_slug ON floor_plans(slug);
CREATE INDEX idx_floor_plans_type ON floor_plans(type);
CREATE INDEX idx_floor_plans_code ON floor_plans(code);
CREATE INDEX idx_floor_plans_beds ON floor_plans(beds);
CREATE INDEX idx_floor_plans_price ON floor_plans(price_numeric);
CREATE INDEX idx_floor_plans_featured ON floor_plans(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_floor_plans_active ON floor_plans(is_active) WHERE is_active = TRUE;

-- =====================================================
-- IMAGES TABLE (Floor Plan Galleries)
-- =====================================================
CREATE TABLE images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    floor_plan_id UUID NOT NULL REFERENCES floor_plans(id) ON DELETE CASCADE,
    url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(300) NOT NULL,
    caption VARCHAR(300),
    sort_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for images
CREATE INDEX idx_images_floor_plan_id ON images(floor_plan_id);
CREATE INDEX idx_images_primary ON images(is_primary) WHERE is_primary = TRUE;

-- =====================================================
-- SPECIALS TABLE (Featured/Promotional Items)
-- =====================================================
CREATE TABLE specials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    subtitle VARCHAR(300),
    description TEXT,
    floor_plan_id UUID REFERENCES floor_plans(id) ON DELETE SET NULL,
    
    -- Pricing
    original_price INTEGER NOT NULL,
    sale_price INTEGER NOT NULL,
    savings_amount INTEGER GENERATED ALWAYS AS (original_price - sale_price) STORED,
    
    -- Display
    badge_text VARCHAR(50),
    badge_color VARCHAR(20) DEFAULT 'red',
    hero_image VARCHAR(500),
    hero_image_alt VARCHAR(300),
    
    -- Availability
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Sorting
    display_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for specials
CREATE INDEX idx_specials_active ON specials(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_specials_dates ON specials(start_date, end_date);
CREATE INDEX idx_specials_floor_plan ON specials(floor_plan_id);

-- =====================================================
-- FAQs TABLE (Floor Plan Specific FAQs)
-- =====================================================
CREATE TABLE faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    floor_plan_id UUID NOT NULL REFERENCES floor_plans(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for faqs
CREATE INDEX idx_faqs_floor_plan_id ON faqs(floor_plan_id);

-- =====================================================
-- STORAGE BUCKETS (via SQL - to be enabled in UI)
-- Note: Actual bucket creation happens via Supabase UI or API
-- This documents the required buckets
-- =====================================================

-- Required Storage Buckets:
-- 1. 'floor-plan-images' - Public bucket for floor plan photos
-- 2. 'specials-images' - Public bucket for promotional images  
-- 3. 'floor-plan-pdfs' - Public bucket for PDF floor plans
-- 4. 'documents' - Private bucket for internal documents

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_floor_plans_updated_at
    BEFORE UPDATE ON floor_plans
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_specials_updated_at
    BEFORE UPDATE ON specials
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================
COMMENT ON TABLE floor_plans IS 'Manufactured home floor plans from Champion Homes';
COMMENT ON TABLE images IS 'Gallery images for floor plans';
COMMENT ON TABLE specials IS 'Featured/promotional home listings with was/now pricing';
COMMENT ON TABLE faqs IS 'Frequently asked questions per floor plan';

COMMENT ON COLUMN floor_plans.slug IS 'URL-friendly identifier (e.g., brighton-2856)';
COMMENT ON COLUMN floor_plans.price_numeric IS 'Price as integer for sorting/filtering';
COMMENT ON COLUMN floor_plans.specs IS 'JSON object with width, length, ceiling, etc.';
COMMENT ON COLUMN specials.savings_amount IS 'Auto-calculated: original_price - sale_price';
