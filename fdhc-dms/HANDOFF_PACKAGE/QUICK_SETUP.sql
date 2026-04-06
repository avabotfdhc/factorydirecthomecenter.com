-- QUICK SETUP SCRIPT FOR FDHC DMS
-- Run this in Supabase SQL Editor after creating your project

-- Step 1: Create organization
INSERT INTO organizations (name, slug, settings)
VALUES ('Factory Direct Homes Center', 'fdhc', '{}')
RETURNING id;

-- Note: Copy the returned UUID for your .env.local DEFAULT_ORG_ID

-- Step 2: Create admin user (run this after creating auth user)
-- First, sign up a user in Supabase Auth (Authentication > Users > Add User)
-- Then run this with the auth user's UUID:
-- INSERT INTO profiles (id, org_id, email, full_name, role, is_active, handles_land_home)
-- VALUES ('AUTH_USER_UUID_HERE', 'YOUR_ORG_ID', 'admin@factorydirect.com', 'Admin User', 'admin', true, true);

-- Step 3: Verify state compliance is loaded
SELECT state_code, state_name, sales_tax_rate, hud_installation_code
FROM state_compliance_requirements
ORDER BY state_code;

-- Should show 6 states: IN, OH, MI, WI, IL, KY

-- Step 4: Verify templates are loaded
SELECT name, template_type, state_code, is_default
FROM purchase_agreement_templates;

-- Should show 4 templates

-- Step 5: Test query to verify everything is working
SELECT 
    'Organizations' as table_name, 
    COUNT(*) as count 
FROM organizations
UNION ALL
SELECT 'Profiles', COUNT(*) FROM profiles
UNION ALL
SELECT 'State Compliance', COUNT(*) FROM state_compliance_requirements
UNION ALL
SELECT 'Templates', COUNT(*) FROM purchase_agreement_templates;

-- Expected results:
-- Organizations: 1
-- Profiles: 0 (until you add admin)
-- State Compliance: 6
-- Templates: 4
