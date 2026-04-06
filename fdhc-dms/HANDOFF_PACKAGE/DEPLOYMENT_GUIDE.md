# FDHC DMS - Complete Deployment Guide
## Step-by-Step Instructions to Launch Your System

---

## PHASE 1: PREPARE YOUR ENVIRONMENT (15 minutes)

### Step 1.1: Install Required Software

**Check if you have Node.js installed:**
```bash
node --version
```
Should show v18 or higher. If not, download from https://nodejs.org/

**Check if you have Git installed:**
```bash
git --version
```
If not, download from https://git-scm.com/

### Step 1.2: Open Terminal/Command Prompt

**Mac:** Open Terminal (Applications > Utilities > Terminal)
**Windows:** Open Command Prompt or PowerShell
**Linux:** Open your terminal

### Step 1.3: Navigate to the Project

```bash
cd /Users/ava/.openclaw/workspace/fdhc-dms
```

---

## PHASE 2: SET UP SUPABASE (30 minutes)

### Step 2.1: Create Supabase Account

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with your email or GitHub
4. Verify your email

### Step 2.2: Create New Project

1. Click "New Project"
2. **Organization:** Choose or create your organization
3. **Project Name:** `fdhc-dms`
4. **Database Password:** Create a strong password (SAVE THIS!)
5. **Region:** Choose closest to your location (e.g., `us-east-1` for East Coast)
6. Click "Create new project"
7. Wait 2-3 minutes for project to be created

### Step 2.3: Get Your Credentials

1. In your Supabase dashboard, click the **Settings** icon (gear) in left sidebar
2. Click **API** in the menu
3. Copy these values (you'll need them in Step 3):
   - **Project URL** (looks like: `https://xxxxxxxxxxxx.supabase.co`)
   - **anon public** key (long string)
   - **service_role secret** key (click "Reveal" to see it)

### Step 2.4: Run Database Migrations

1. In Supabase dashboard, click **SQL Editor** in left sidebar
2. Click **New query**
3. Copy the entire contents of this file:
   ```
   /Users/ava/.openclaw/workspace/fdhc-dms/supabase/migrations/001_initial_schema.sql
   ```
4. Paste into SQL Editor
5. Click **Run** (top right)
6. Wait for "Success" message
7. **Repeat for migration 002:**
   - Copy `/Users/ava/.openclaw/workspace/fdhc-dms/supabase/migrations/002_purchase_agreements.sql`
   - Paste and run
8. **Repeat for migration 003:**
   - Copy `/Users/ava/.openclaw/workspace/fdhc-dms/supabase/migrations/003_legal_compliance.sql`
   - Paste and run

### Step 2.5: Set Up Authentication

1. In Supabase dashboard, click **Authentication** in left sidebar
2. Click **Providers** in the menu
3. Find **Email** provider and click it
4. Make sure it's **Enabled**
5. Turn OFF "Confirm email" (for easier testing)
6. Click **Save**

### Step 2.6: Create Your First User (Admin)

1. In Supabase dashboard, click **Table Editor** in left sidebar
2. Click **profiles** table
3. Click **Insert** > **Row**
4. Fill in:
   - **id:** (leave blank, will auto-generate)
   - **email:** your email address
   - **full_name:** Your Name
   - **role:** `admin`
   - **is_active:** true
   - **handles_land_home:** true
   - All other fields can be left as default
5. Click **Save**

---

## PHASE 3: CONFIGURE ENVIRONMENT VARIABLES (10 minutes)

### Step 3.1: Create Environment File

1. In your terminal, make sure you're in the project directory:
   ```bash
   cd /Users/ava/.openclaw/workspace/fdhc-dms
   ```

2. Create the environment file:
   ```bash
   cp .env.local.example .env.local
   ```

3. Open the file for editing:
   **Mac:**
   ```bash
   open -e .env.local
   ```
   **Windows:**
   ```bash
   notepad .env.local
   ```
   **Or use VS Code:**
   ```bash
   code .env.local
   ```

### Step 3.2: Fill in Your Credentials

Replace the placeholder values with your actual Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key
DEFAULT_ORG_ID=00000000-0000-0000-0000-000000000000
```

**To get your DEFAULT_ORG_ID:**
1. Go to Supabase Table Editor
2. Click **organizations** table
3. Copy the **id** value from the row
4. Paste it in .env.local

### Step 3.3: Save the File

Save and close the editor.

---

## PHASE 4: INSTALL DEPENDENCIES (10 minutes)

### Step 4.1: Install Node Packages

In your terminal (in the project directory):

```bash
npm install
```

This will download all required packages. Wait for it to complete (may take 2-5 minutes).

You should see a message like:
```
added XXX packages in XXs
```

---

## PHASE 5: RUN THE DEVELOPMENT SERVER (5 minutes)

### Step 5.1: Start the Server

```bash
npm run dev
```

### Step 5.2: Open in Browser

1. Wait for the message:
   ```
   Ready on http://localhost:3000
   ```

2. Open your web browser
3. Go to: http://localhost:3000

You should see the FDHC DMS landing page!

---

## PHASE 6: INITIAL SETUP & TESTING (20 minutes)

### Step 6.1: Create Your Organization

1. In Supabase Table Editor, click **organizations**
2. Click **Insert** > **Row**
3. Fill in:
   - **name:** Factory Direct Homes Center
   - **slug:** fdhc
   - **settings:** {} (empty curly braces)
4. Click **Save**
5. Copy the **id** that was generated
6. Update your `.env.local` with this ID as DEFAULT_ORG_ID
7. Restart the dev server (Ctrl+C, then `npm run dev` again)

### Step 6.2: Create a Test Lead

1. In your browser, go to http://localhost:3000/dashboard/leads
2. Click **New Lead**
3. Fill in test data:
   - First Name: John
   - Last Name: Test
   - Phone: (555) 123-4567
   - Email: john@test.com
   - Source: Website
   - Land Status: Owns Land
4. Click **Create Lead**

### Step 6.3: Create a Test Deal

1. Go to http://localhost:3000/dashboard/deals
2. Click **New Deal**
3. Select the lead you just created
4. Fill in test financial data
5. Save

### Step 6.4: Test the Desking Matrix

1. Go to http://localhost:3000/desking
2. Play with the cost inputs
3. Verify the three scenarios calculate correctly

### Step 6.5: Create a Purchase Agreement

1. Go to http://localhost:3000/dashboard/agreements
2. Click **New Agreement**
3. Select your test client
4. Select your test deal
5. Choose a delivery state
6. Add a deposit amount
7. Acknowledge required disclosures
8. Submit

---

## PHASE 7: BUILD FOR PRODUCTION (15 minutes)

### Step 7.1: Create Production Build

Stop the dev server (Ctrl+C), then:

```bash
npm run build
```

This creates an optimized production build. Wait for completion.

### Step 7.2: Test Production Build Locally

```bash
npm start
```

Open http://localhost:3000 and verify everything works.

---

## PHASE 8: DEPLOY TO VERCEL (20 minutes)

### Step 8.1: Create Vercel Account

1. Go to https://vercel.com
2. Sign up with your GitHub account (recommended)
3. Verify your email

### Step 8.2: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 8.3: Login to Vercel

```bash
vercel login
```
Follow the prompts to authenticate.

### Step 8.4: Deploy

In your project directory:

```bash
vercel
```

Follow the prompts:
- **Set up "fdhc-dms"?** Yes
- **Which scope?** Select your account
- **Link to existing project?** No
- **What's your project name?** fdhc-dms (or your preference)

Wait for deployment to complete. You'll get a URL like:
`https://fdhc-dms.vercel.app`

### Step 8.5: Add Environment Variables to Vercel

1. Go to https://vercel.com/dashboard
2. Click your project
3. Click **Settings** tab
4. Click **Environment Variables** in left menu
5. Add each variable from your `.env.local`:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
   - DEFAULT_ORG_ID
6. Click **Save**

### Step 8.6: Redeploy

```bash
vercel --prod
```

Your DMS is now live!

---

## PHASE 9: POST-DEPLOYMENT SETUP (30 minutes)

### Step 9.1: Configure Supabase Authentication

1. In Supabase, go to **Authentication** > **URL Configuration**
2. Set **Site URL** to your Vercel URL (e.g., `https://fdhc-dms.vercel.app`)
3. Add your Vercel URL to **Redirect URLs**
4. Click **Save**

### Step 9.2: Set Up Email Templates (Optional)

1. In Supabase, go to **Authentication** > **Email Templates**
2. Customize the email templates if desired
3. Or leave as default

### Step 9.3: Create Additional Users

1. In Supabase Table Editor, open **profiles**
2. Add your sales team members:
   - sales_rep role for regular salespeople
   - manager role for managers
   - Set handles_land_home based on their expertise

### Step 9.4: Add Home Inventory

1. In Supabase Table Editor, open **home_inventory**
2. Add your current inventory
3. Include serial numbers, HUD labels, pricing

### Step 9.5: Test Everything

1. Log in with different user roles
2. Create test leads and deals
3. Generate purchase agreements
4. Verify all features work

---

## PHASE 10: CUSTOMIZE (Optional - 1-2 hours)

### Step 10.1: Update Branding

Edit `app/layout.tsx`:
- Change page title
- Update metadata

Edit `app/components/Sidebar.tsx`:
- Update logo/text if desired

### Step 10.2: Customize Legal Templates

1. In Supabase SQL Editor, run:
```sql
SELECT * FROM purchase_agreement_templates;
```

2. Update templates with your specific legal language:
```sql
UPDATE purchase_agreement_templates
SET body_content = 'YOUR CUSTOM CONTENT'
WHERE name = 'Master Purchase Agreement - Standard';
```

### Step 10.3: Configure State Settings

Verify state tax rates and requirements:
```sql
SELECT * FROM state_compliance_requirements;
```

Update if needed for your specific jurisdictions.

---

## TROUBLESHOOTING

### Issue: "Cannot find module"
**Solution:** Run `npm install` again

### Issue: "Failed to connect to Supabase"
**Solution:** Check your .env.local credentials are correct

### Issue: "RLS policy violation"
**Solution:** Make sure you've created a profile for your user in the profiles table

### Issue: "Build failed"
**Solution:** Check for TypeScript errors with `npm run build` locally

### Issue: "Cannot login"
**Solution:** 
1. Check Supabase Auth settings
2. Verify Site URL is configured
3. Make sure user exists in profiles table

---

## NEXT STEPS AFTER DEPLOYMENT

1. **Train Your Team**
   - Schedule training sessions
   - Create user guides
   - Set up standard operating procedures

2. **Import Existing Data**
   - Export from current CRM
   - Format for Supabase
   - Bulk import via SQL or CSV

3. **Integrate External Services**
   - Email (Gmail/Outlook OAuth)
   - Phone (Twilio)
   - Calendar (Google/Outlook)
   - E-signature (DocuSign)

4. **Set Up Backups**
   - Supabase has daily backups
   - Consider additional backup strategy

5. **Monitor & Optimize**
   - Check Vercel analytics
   - Monitor Supabase usage
   - Gather user feedback

---

## SUPPORT

If you encounter issues:

1. Check the error message carefully
2. Review this guide for the relevant phase
3. Check Supabase logs in dashboard
4. Check Vercel deployment logs
5. Contact your developer for assistance

---

## SUMMARY CHECKLIST

- [ ] Node.js installed
- [ ] Supabase account created
- [ ] Project created in Supabase
- [ ] All 3 SQL migrations run
- [ ] Authentication configured
- [ ] Environment variables set
- [ ] Dependencies installed
- [ ] Dev server running
- [ ] Test data created
- [ ] Production build successful
- [ ] Deployed to Vercel
- [ ] Environment variables in Vercel
- [ ] Site URL configured in Supabase
- [ ] Team members added
- [ ] Inventory imported
- [ ] Everything tested

**Estimated Total Time: 2-3 hours**

---

*Your FDHC DMS will be fully operational once you complete these steps!*
