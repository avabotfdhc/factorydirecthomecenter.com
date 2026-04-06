# FDHC DMS - Manufactured Housing Dealership Management System

Complete DMS for Factory Direct Homes Center built with Next.js 15, Supabase, and Tailwind CSS.

## Features

- **Intelligent Lead Routing** - Round-robin assignment with land-home complexity detection
- **Desking Matrix** - Three-scenario financing comparison (Chattel vs Land-Home)
- **Home Inventory** - Track factory orders, arrivals, and lot status
- **Activity Logging** - Outcome-based follow-up automation
- **Deal Management** - Full deal workflow from prospect to funded
- **Multi-State Support** - Configured for IN, OH, MI, WI, IL, KY

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (PostgreSQL + Auth)
- Lucide React Icons

## Project Structure

```
app/
├── actions/          # Server actions
├── components/       # React components
├── lib/             # Utilities
│   ├── supabase/    # Supabase clients
│   ├── utils/       # Helper functions
│   └── financing/   # Financing calculations
├── types/           # TypeScript types
└── api/             # API routes

supabase/
└── migrations/      # Database schema
```

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.local.example .env.local
   # Edit with your Supabase credentials
   ```

3. **Run database migrations in Supabase:**
   - Copy contents of `supabase/migrations/001_initial_schema.sql`
   - Run in Supabase SQL Editor

4. **Start development server:**
   ```bash
   npm run dev
   ```

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DEFAULT_ORG_ID=your-organization-uuid
```

## Key Components

### DeskingMatrix
Three-scenario financing comparison tool showing:
- Chattel financing (5% and 10% down)
- Land-Home FHA/Conventional (20% down)
- Real-time monthly payment calculations

### Lead Routing
Intelligent round-robin assignment that:
- Detects land-home vs chattel complexity
- Routes to qualified reps
- Falls back to manager queue

## Database Schema

See `supabase/migrations/001_initial_schema.sql` for complete schema including:
- organizations
- profiles
- leads
- deals
- home_inventory
- activities
- ledger

## License

Private - Factory Direct Homes Center
