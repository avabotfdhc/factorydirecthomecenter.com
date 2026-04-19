# GitHub & AWS Setup Checklist

## Information Needed from Kyle

### GitHub Repository
- [ ] Repository URL
- [ ] Branch name for production (main, master, production?)
- [ ] Should I fork and PR, or will I be added as collaborator?

### AWS Infrastructure
- [ ] AWS service being used:
  - [ ] EC2 (with Nginx/Apache?)
  - [ ] Elastic Beanstalk
  - [ ] Amplify
  - [ ] S3 + CloudFront
  - [ ] ECS/Fargate
  - [ ] Lambda (serverless)
  - [ ] Other: ___________

### AWS Access
Preferred methods (in order):
1. [ ] AWS CLI credentials (Access Key ID + Secret Access Key)
2. [ ] IAM role to assume
3. [ ] AWS Console login (username/password)

### Application Details
- [ ] Node.js version used
- [ ] Build command (npm run build?)
- [ ] Start command (npm start?)
- [ ] Environment variables needed (.env.example)
- [ ] Is there a staging environment?

### Deployment Process
- [ ] Current deployment method:
  - [ ] Manual deploy
  - [ ] GitHub Actions
  - [ ] AWS CodePipeline
  - [ ] Other CI/CD: ___________
- [ ] Any special deployment steps?

## My Implementation Plan

Once I have access:

1. **Clone & Setup** (15 min)
   - Clone GitHub repo
   - Install dependencies
   - Verify local build works

2. **Create Feature Branch** (5 min)
   - `git checkout -b fix/website-issues-march-2026`

3. **Implement Fixes** (3-4 hours)
   - Phase 1: Meta tags & SEO
   - Phase 2: Content fixes (typos, links)
   - Phase 3: Schema markup
   - Phase 4: Component fixes

4. **Test Locally** (30 min)
   - Run dev server
   - Verify all pages load
   - Check console for errors

5. **Commit & Push** (15 min)
   - Commit with descriptive messages
   - Push branch to GitHub

6. **Deploy** (30 min)
   - Deploy to staging (if available)
   - Test on staging
   - Deploy to production

7. **Post-Deploy** (15 min)
   - Verify live site
   - Run Google Rich Results test
   - Submit sitemap to Search Console

## Security Notes

- I will not commit AWS credentials to GitHub
- I will use environment variables for all secrets
- I can provide my public SSH key if needed for server access
- All changes will be in version control (no manual server edits)
