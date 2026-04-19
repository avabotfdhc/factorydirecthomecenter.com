# Website Development Workflow

## ACP Harness Setup

### What is ACP?
Agent Coding Protocol (ACP) allows spawning isolated coding sessions with specialized agents like Codex, Claude Code, or Gemini for website development.

### Current Capabilities
- **Runtime**: ACP sessions available
- **Modes**: One-shot (`run`) or persistent (`session`)
- **Threading**: Discord-style thread support for complex projects

### Configuration
```json
{
  "acp": {
    "defaultAgent": "codex",
    "allowedAgents": ["codex", "claude-code", "gemini"]
  }
}
```

## Website Project Types

### 1. FDHC Corporate Site
**Current**: factorydirecthomescenter.com
**Stack**: Likely WordPress/custom
**Priority**: Maintenance, SEO, content updates

### 2. Landing Pages
**Purpose**: Campaign-specific lead capture
**Stack**: Static HTML or lightweight framework
**Examples**: 
- Financing special offers
- New model launches
- Event promotions

### 3. Microsites
**Purpose**: Specific product lines or locations
**Examples**:
- Modular homes showcase
- Location-specific sites
- Trade-in program

## Development Workflow

### Phase 1: Requirements Gathering
```
User Request → Clarification Questions → Scope Definition
```

Questions to ask:
- What's the goal? (leads, info, sales)
- Who's the audience?
- What's the timeline?
- Any design preferences?
- Integration requirements?

### Phase 2: Design & Planning
```
Wireframes → Content Outline → Tech Stack Decision → Task Breakdown
```

Tools:
- Browser automation for competitor research
- Image generation for mockups
- Markdown for documentation

### Phase 3: Development (ACP Session)
```
Spawn ACP Agent → Iterative Development → Testing → Review
```

Example command:
```
Spawn ACP session with task:
"Build a landing page for FDHC's spring financing special. 
Include: hero section with CTA, financing calculator, 
testimonials, contact form. Mobile-first, fast loading."
```

### Phase 4: Deployment
```
Staging Review → Kyle Approval → Production Deploy → Monitoring
```

## Current FDHC Site Status

### Known Issues (from previous analysis)
- [ ] SEO meta tags need optimization
- [ ] Schema markup incomplete
- [ ] Mobile performance could improve
- [ ] Content updates needed

### File Inventory
```
fdhc-site/
├── seo-fix-plan.md
├── website-content-fixes.md
├── website-fix-plan.md
├── website-implementation-guide.md
├── website-schema-markup.md
└── website-seo-meta-tags.md
```

## ACP Agent Selection

| Task | Best Agent | Why |
|------|-----------|-----|
| React/Next.js app | Codex | Fast, modern framework expertise |
| WordPress customization | Claude Code | PHP, theme development |
| Static site/Bootstrap | Either | Simple, straightforward |
| Complex animations | Gemini | Creative coding |
| Debugging/fixes | Claude Code | Thorough analysis |

## Project Management

### Active Projects File
Location: `~/.openclaw/workspace/projects/`

Template:
```markdown
# Project: [Name]

## Status: [Planning/In Progress/Review/Live]
## Priority: [High/Medium/Low]
## Due: [Date]

### Requirements
- [ ] Requirement 1
- [ ] Requirement 2

### Tasks
- [ ] Task 1 → Assigned to: [Agent]
- [ ] Task 2 → Assigned to: [Agent]

### Notes
[Development notes, decisions]

### Assets
- [Design file]
- [Content doc]
- [Images]
```

## Quality Checklist

Before any site goes live:
- [ ] Mobile responsive (test on real devices)
- [ ] Page speed < 3 seconds
- [ ] All links working
- [ ] Forms tested and connected
- [ ] SEO meta tags complete
- [ ] Analytics installed
- [ ] SSL certificate active
- [ ] Backup created

## Integration with Lead System

Every website project should:
1. Connect to lead capture forms
2. Trigger notifications to Kyle
3. Log in lead database
4. Support tracking/analytics

## Next Website Priorities

1. [ ] Fix current FDHC site SEO issues
2. [ ] Build financing landing page
3. [ ] Create model showcase pages
4. [ ] Set up A/B testing framework
5. [ ] Implement chat widget
