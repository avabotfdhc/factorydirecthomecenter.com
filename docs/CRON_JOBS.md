# Cron Jobs & Automation Schedule

## Active Jobs

### 1. Nightly Industry Research
- **ID**: `ce09d900-7f92-46db-b2b2-c3c286bbbe33`
- **Schedule**: Daily at 2:00 AM EST
- **Model**: Kimi-NV (nvidia/kimi-k2.5)
- **Purpose**: Research manufactured housing industry news, trends, regulations
- **Output**: Telegram message to 8353870817
- **Status**: ✅ Active (last run successful)

### 2. Weekly Memory Review
- **ID**: `132f7e4a-5abc-44f2-aae0-2a9ae43e73f8`
- **Schedule**: Sundays at 9:00 AM EST
- **Model**: Kimi-NV
- **Purpose**: Distill daily notes into MEMORY.md, archive old info
- **Output**: Telegram confirmation
- **Status**: ✅ Active

### 3. Weekly Competitor Intelligence
- **ID**: `e96c2f1c-4bc8-41ea-877c-a682e39d05c6`
- **Schedule**: Mondays at 10:00 AM EST
- **Model**: Kimi-NV
- **Purpose**: Track competitor activities, pricing, marketing
- **Competitors**: Clayton, Champion, Cavco, Skyline, regional dealers
- **Output**: Competitive intel report via Telegram
- **Status**: ✅ Active

### 4. Weekly Website Health Check
- **ID**: `764615f0-c839-40ce-8758-b2860c7d2063`
- **Schedule**: Tuesdays at 11:00 AM EST
- **Model**: Kimi-NV
- **Purpose**: Site performance, SEO, broken links, mobile testing
- **Output**: Health report with fix recommendations
- **Status**: ✅ Active

## Disabled Jobs

### Daily Email Report (Disabled)
- **ID**: `91c80e0c-936c-4a93-9ea1-a640f6ec901d`
- **Reason**: HTTP 404 errors, needs debugging
- **Action Required**: Fix AgentMail integration or switch to different delivery method

## Proposed Additional Jobs

### Lead Response Automation
```json
{
  "name": "lead-inbox-monitor",
  "schedule": "*/30 * * * *",
  "purpose": "Check AgentMail inbox every 30 min for new leads",
  "action": "Send Telegram alert with lead summary"
}
```

### Content Generation
```json
{
  "name": "weekly-content-ideas",
  "schedule": "0 14 * * 3",
  "purpose": "Generate blog post ideas, social content based on industry news",
  "output": "Content calendar suggestions"
}
```

### Market Report
```json
{
  "name": "monthly-market-report",
  "schedule": "0 9 1 * *",
  "purpose": "Comprehensive monthly market analysis",
  "output": "PDF report with trends, forecasts, recommendations"
}
```

## Management Commands

```bash
# List all jobs
openclaw cron list

# View job runs
openclaw cron runs <job-id>

# Disable a job
openclaw cron update <job-id> --enabled false

# Run job immediately
openclaw cron run <job-id>

# Check job status
curl http://localhost:18789/cron/status
```

## Resource Allocation

| Time (EST) | Job | Duration | CPU Impact |
|------------|-----|----------|------------|
| 02:00 | Nightly Research | ~2 min | Low |
| 09:00 Sun | Memory Review | ~3 min | Low |
| 10:00 Mon | Competitor Intel | ~3 min | Medium |
| 11:00 Tue | Website Health | ~5 min | Medium |

All jobs use isolated sessions to avoid blocking main agent.
