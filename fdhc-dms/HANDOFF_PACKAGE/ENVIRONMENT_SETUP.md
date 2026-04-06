# Environment Variables Setup

## Required Variables

Copy this template to `.env.local` and fill in your values:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Organization
DEFAULT_ORG_ID=your-organization-uuid
```

## How to Get These Values

### 1. NEXT_PUBLIC_SUPABASE_URL
- Go to Supabase Dashboard
- Click Settings (gear icon)
- Click API
- Copy "Project URL"

### 2. NEXT_PUBLIC_SUPABASE_ANON_KEY
- Same location as above
- Copy "anon public" key
- This is safe to expose to client

### 3. SUPABASE_SERVICE_ROLE_KEY
- Same location as above
- Click "Reveal" next to service_role secret
- Copy the key
- **NEVER expose this to client-side code**
- Only use in server actions/API routes

### 4. DEFAULT_ORG_ID
After running migrations:
1. Go to Supabase Table Editor
2. Click "organizations" table
3. Copy the "id" from the row
4. Paste here

## Example (DO NOT USE - Replace with your values):

```env
NEXT_PUBLIC_SUPABASE_URL=https://abc123def456.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DEFAULT_ORG_ID=550e8400-e29b-41d4-a716-446655440000
```

## Security Notes

- Never commit `.env.local` to Git
- Add `.env.local` to `.gitignore`
- Service role key has admin privileges - keep it secret
- Anon key is safe for client-side use (RLS policies protect data)

## Vercel Deployment

When deploying to Vercel, add these as Environment Variables:
1. Go to Vercel Dashboard
2. Select your project
3. Click Settings > Environment Variables
4. Add each variable from above
5. Redeploy
