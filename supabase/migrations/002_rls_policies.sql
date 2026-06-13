-- =====================================================
-- Factory Direct Homes Center - Row Level Security (RLS)
-- Migration 002: Security Policies
-- =====================================================

-- =====================================================
-- ENABLE RLS ON ALL TABLES
-- =====================================================
ALTER TABLE floor_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE specials ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- CREATE ADMIN ROLE HELPER
-- =====================================================
-- This function checks if the current user has admin privileges
-- In production, this would check against an admin_users table or claims

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    -- Check for admin claim in JWT
    -- For Supabase Auth: auth.jwt() -> 'app_metadata' -> 'role' = 'admin'
    RETURN (
        auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
        OR auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
    );
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FLOOR PLANS POLICIES
-- =====================================================

-- Anyone can read active floor plans
CREATE POLICY "Floor plans are viewable by everyone" 
ON floor_plans FOR SELECT 
USING (is_active = TRUE);

-- Only admins can insert
CREATE POLICY "Only admins can insert floor plans" 
ON floor_plans FOR INSERT 
WITH CHECK (is_admin());

-- Only admins can update
CREATE POLICY "Only admins can update floor plans" 
ON floor_plans FOR UPDATE 
USING (is_admin())
WITH CHECK (is_admin());

-- Only admins can delete
CREATE POLICY "Only admins can delete floor plans" 
ON floor_plans FOR DELETE 
USING (is_admin());

-- =====================================================
-- IMAGES POLICIES
-- =====================================================

-- Anyone can read images for active floor plans
CREATE POLICY "Images are viewable by everyone" 
ON images FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM floor_plans 
        WHERE floor_plans.id = images.floor_plan_id 
        AND floor_plans.is_active = TRUE
    )
);

-- Only admins can insert images
CREATE POLICY "Only admins can insert images" 
ON images FOR INSERT 
WITH CHECK (is_admin());

-- Only admins can update images
CREATE POLICY "Only admins can update images" 
ON images FOR UPDATE 
USING (is_admin())
WITH CHECK (is_admin());

-- Only admins can delete images
CREATE POLICY "Only admins can delete images" 
ON images FOR DELETE 
USING (is_admin());

-- =====================================================
-- SPECIALS POLICIES
-- =====================================================

-- Anyone can read active specials within date range
CREATE POLICY "Specials are viewable by everyone" 
ON specials FOR SELECT 
USING (
    is_active = TRUE 
    AND (start_date IS NULL OR start_date <= CURRENT_DATE)
    AND (end_date IS NULL OR end_date >= CURRENT_DATE)
);

-- Only admins can insert specials
CREATE POLICY "Only admins can insert specials" 
ON specials FOR INSERT 
WITH CHECK (is_admin());

-- Only admins can update specials
CREATE POLICY "Only admins can update specials" 
ON specials FOR UPDATE 
USING (is_admin())
WITH CHECK (is_admin());

-- Only admins can delete specials
CREATE POLICY "Only admins can delete specials" 
ON specials FOR DELETE 
USING (is_admin());

-- =====================================================
-- FAQS POLICIES
-- =====================================================

-- Anyone can read FAQs for active floor plans
CREATE POLICY "FAQs are viewable by everyone" 
ON faqs FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM floor_plans 
        WHERE floor_plans.id = faqs.floor_plan_id 
        AND floor_plans.is_active = TRUE
    )
);

-- Only admins can insert FAQs
CREATE POLICY "Only admins can insert FAQs" 
ON faqs FOR INSERT 
WITH CHECK (is_admin());

-- Only admins can update FAQs
CREATE POLICY "Only admins can update FAQs" 
ON faqs FOR UPDATE 
USING (is_admin())
WITH CHECK (is_admin());

-- Only admins can delete FAQs
CREATE POLICY "Only admins can delete FAQs" 
ON faqs FOR DELETE 
USING (is_admin());

-- =====================================================
-- STORAGE BUCKET POLICIES
-- =====================================================

-- Note: Storage bucket policies are created via Supabase Dashboard or API
-- Below are the SQL equivalents for documentation

-- For 'floor-plan-images' bucket (public read, admin write):
-- CREATE POLICY "Public can view floor plan images"
-- ON storage.objects FOR SELECT
-- USING (bucket_id = 'floor-plan-images');

-- CREATE POLICY "Admins can upload floor plan images"
-- ON storage.objects FOR INSERT
-- WITH CHECK (
    -- bucket_id = 'floor-plan-images' 
    -- AND is_admin()
-- );

-- CREATE POLICY "Admins can update floor plan images"
-- ON storage.objects FOR UPDATE
-- USING (bucket_id = 'floor-plan-images' AND is_admin());

-- CREATE POLICY "Admins can delete floor plan images"
-- ON storage.objects FOR DELETE
-- USING (bucket_id = 'floor-plan-images' AND is_admin());

-- =====================================================
-- API KEY MANAGEMENT (Optional - for service-to-service auth)
-- =====================================================

-- Table for API keys (if needed for external integrations)
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    key_hash VARCHAR(255) NOT NULL,
    permissions TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    last_used_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Only admins can manage API keys
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can manage API keys"
ON api_keys FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- =====================================================
-- AUDIT LOG (Optional - for tracking changes)
-- =====================================================

CREATE TABLE IF NOT EXISTS audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(20) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    old_data JSONB,
    new_data JSONB,
    performed_by UUID REFERENCES auth.users(id),
    performed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Only admins can read audit logs
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can read audit logs"
ON audit_log FOR SELECT
USING (is_admin());

-- Function to log changes
CREATE OR REPLACE FUNCTION log_audit()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO audit_log (table_name, record_id, action, old_data, performed_by)
        VALUES (TG_TABLE_NAME, OLD.id, 'DELETE', row_to_json(OLD), auth.uid());
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_log (table_name, record_id, action, old_data, new_data, performed_by)
        VALUES (TG_TABLE_NAME, NEW.id, 'UPDATE', row_to_json(OLD), row_to_json(NEW), auth.uid());
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO audit_log (table_name, record_id, action, new_data, performed_by)
        VALUES (TG_TABLE_NAME, NEW.id, 'INSERT', row_to_json(NEW), auth.uid());
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach audit triggers to main tables
CREATE TRIGGER floor_plans_audit
    AFTER INSERT OR UPDATE OR DELETE ON floor_plans
    FOR EACH ROW EXECUTE FUNCTION log_audit();

CREATE TRIGGER specials_audit
    AFTER INSERT OR UPDATE OR DELETE ON specials
    FOR EACH ROW EXECUTE FUNCTION log_audit();
