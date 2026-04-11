# FDHC Website Development Skill

**Skill for:** Building and maintaining Factory Direct Homes Center website  
**Created:** March 25, 2026  
**Context:** Next.js 15, React, TypeScript, Tailwind CSS, Static Site Generation

---

## How to Interpret Tasks

### When Kyle Says...

**"Push live" / "Deploy"**
- Check git status first
- Ensure all changes are committed
- Run build locally to verify no errors
- Push to GitHub (origin main)
- Verify deployment on Vercel (auto-deploys on push to main)
- Report deployment status

**"Fix [issue]"**
- Ask for clarification if issue is vague
- Check current site vs. requirements
- Identify root cause before fixing
- Test fix locally before committing
- Verify fix after deployment

**"Add [feature]"**
- Clarify scope and requirements
- Check if similar feature exists elsewhere
- Follow existing patterns/code style
- Ensure mobile responsiveness
- Add to appropriate page/section

**"Run reports" / "Check [thing]"**
- Use browser automation when possible
- Document findings clearly
- Prioritize critical issues
- Suggest actionable fixes

---

## How to Approach Common Tasks

### Website Structure

**Location Pages**
- Must include: LocalBusiness schema, FAQPage schema (5-8 FAQs), Service schema
- AEO content: 40-60 word answers, question-based headers
- Include: nearby cities, landmarks, zoning info, counties served
- Canonical URL required

**Product/Model Pages**
- Must include: Product schema, ImageObject schema
- Specifications table
- Pricing (if available)
- Related models section
- Lead capture CTA

**Guide Pages**
- Must include: Article schema, HowTo schema (if applicable)
- Step-by-step content
- Internal linking to related pages
- Downloadable resources (if applicable)

### SEO Requirements

**Every Page Must Have:**
1. Unique title tag (50-60 chars)
2. Meta description (150-160 chars)
3. One H1 tag
4. Canonical URL
5. Open Graph tags
6. Breadcrumb navigation
7. Minimum 5 FAQs with FAQPage schema

**Schema Types to Include:**
- LocalBusiness (with geo coordinates)
- WebSite
- BreadcrumbList
- Article/Product/Service (contextual)
- FAQPage
- ImageObject

### Git Workflow

**CRITICAL RULES:**
1. ALWAYS pull before push
2. Commit after significant changes
3. Use descriptive commit messages
4. Never force push
5. Check build succeeds before pushing

**Commit Message Format:**
- `FEATURE: [description]` - New features
- `FIX: [description]` - Bug fixes
- `SEO: [description]` - SEO improvements
- `DOC: [description]` - Documentation
- `DEPLOY: [description]` - Deployment triggers

### Design Standards

**Colors:**
- Primary: #1B6B7D (teal)
- Accent: #8AC540 (lime)
- Background: #F8F7F4 (cream)
- Text: #2A2A2A (charcoal)

**Typography:**
- Headings: Cormorant Garamond (serif)
- Body: Plus Jakarta Sans (sans-serif)

**Hero Section:**
- Height: 280-380px (responsive)
- Dark overlay on background image
- Location text: "Factory Direct Homes Center — Auburn, Indiana"
- H1: Clear, concise value proposition

---

## Previous Mistakes & Solutions

### Mistake 1: Confused Repository URLs
**What Happened:** Changed git remote to wrong URL, broke pushes
**Solution:** Always verify exact repository name with user before changing remotes
**Prevention:** Ask "What is the exact GitHub repository URL?" before any remote changes

### Mistake 2: Client Component with Metadata
**What Happened:** Tried to export metadata from "use client" component
**Solution:** Separate into server component (page.tsx) for metadata + client component for interactive parts
**Pattern:**
```tsx
// page.tsx - Server component
export const metadata = { ... }
export default function Page() { return <ClientComponent /> }

// ClientComponent.tsx - Client component
"use client"
export default function ClientComponent() { ... }
```

### Mistake 3: Hero Section Too Large
**What Happened:** Made hero 85vh, took up entire screen on mobile
**Solution:** Fixed height 280-380px, compact text, separate search bar section
**Lesson:** Mobile-first design, test visual appearance

### Mistake 4: Confused Live Site vs. New Site
**What Happened:** Reported issues from current live site as if they were on new site
**Solution:** Always clarify which site is being referenced
**Prevention:** Ask "Are we fixing the current live site or the new site we're building?"

### Mistake 5: Cron Job Model Errors
**What Happened:** Used nvidia/kimi-k2.5 which returned 404 errors
**Solution:** Changed to moonshot/kimi-k2.5 for all cron jobs
**Lesson:** Verify model availability before setting cron jobs

### Mistake 6: Long Telegram Messages
**What Happened:** Research reports exceeded Telegram's message limit
**Solution:** Add character limits to cron job instructions, use email for long reports
**Pattern:** "Keep email under 4000 characters"

---

## Business Context

### Company Info
- **Name:** Factory Direct Homes Center
- **Location:** Auburn, IN 46706
- **Phone:** (260) 308-1457
- **Email:** sales@factorydirecthomescenter.com
- **Service Area:** Indiana, Ohio, Michigan, Wisconsin, Kentucky

### Key Differentiators
- Factory-direct pricing (no middlemen)
- Line-item transparency
- Customer chooses own contractors
- 20 miles from Champion factory (Topeka, IN)
- No site work/setup provided (customer arranges)

### Home Series
- **Aspire Series** (Topeka, IN) - Single wide, double wide, modular
- **Paramount Series** (Topeka, IN) - Double wide
- **PRIME Series** (Decatur, IN) - Double wide
- **Dutch Series** (Topeka, IN) - Single wide

### Financing Partners
- 21st Mortgage
- Triad Financial Services
- Credit Human
- Lake Michigan Credit Union

---

## API & Tool Usage

### AgentMail (Email)
- Inbox: lonelysalt605@agentmail.to
- Use for: Sending reports, notifications
- Command: Use agentmail skill/scripts

### Cron Jobs
- Always use model: moonshot/kimi-k2.5
- Delivery: Email to kdudgeon@factorydirecthomescenter.com
- Timeout: 300 seconds default

### GitHub
- Repository: factorydirecthomecenter.com (no 's' in homes)
- Branch: main
- Always pull before push

### Vercel
- Project: factorydirecthomecenter-com (avabotfdhcs-projects)
- Live URL: https://factorydirecthomescenter-com.vercel.app
- Auto-deploys from GitHub `main`
- Migrated from Netlify on 2026-04-11 (Netlify was paused due to usage limits)

---

## File Organization

**Website Code:** `/factorydirecthomescenter.com/`
**Documentation:** `/factorydirecthomescenter.com/docs/`
**Pricing Sheets:** `/factorydirecthomescenter.com/docs/RETAIL_PRICING_SHEET.*`
**Project Status:** `/factorydirecthomescenter.com/PROJECT_STATUS.md`

---

## Communication Preferences

### With Kyle (Navigator)
- Preferred name: "Navigator" or "Kyle"
- Email: kdudgeon@factorydirecthomescenter.com
- Direct, efficient communication
- No fluff or filler
- Ask clarifying questions when needed

### When to Ask vs. Act
- **Ask:** External actions (emails, public posts), destructive changes, uncertain requirements
- **Act:** Internal improvements, code changes, content updates within scope

---

## Success Metrics

**Website Goals:**
- 24 pages with maximum SEO/AEO
- 11 schema types per page
- 80+ FAQs across site
- <3 second load time
- Mobile responsive
- Conversion-focused design

**Content Goals:**
- Clear, honest information
- Line-item transparency messaging
- Local SEO optimization
- Champion Homes partnership emphasis

---

*Last Updated: March 25, 2026*
