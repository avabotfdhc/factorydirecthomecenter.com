# OpenClaw Configuration Guide

## Current Optimized Config

### Model Aliases
| Alias | Model | Use Case |
|-------|-------|----------|
| `Kimi` | moonshot/kimi-k2.5 | Chat, general tasks, interactive |
| `Kimi-NV` | nvidia/kimi-k2.5 | Cron jobs, research, batch tasks |

### Performance Settings
- **Max Concurrent Agents**: 3 (up from 2)
- **Max Concurrent Subagents**: 5 (up from 3)
- **Thinking Mode**: Disabled by default (faster responses)
- **Memory Update Interval**: 2 minutes (faster sync)
- **Max Memory Results**: 10 (better context)

### Channels Configured

#### Telegram (Active)
- **Bot**: Enabled
- **DM Policy**: Allowlist (only 8353870817)
- **Group Policy**: Open
- **Streaming**: Off

#### Slack (Disabled)
- Configured but not active
- Ready to enable for team use

### Skills Enabled

| Skill | Purpose | Status |
|-------|---------|--------|
| agent-browser | Website automation, scraping | ✅ Active |
| agentmail | Email sending/receiving | ✅ Active |
| nano-banana-pro | Image generation | ✅ Active |
| summarize | Content summarization | ✅ Active |
| clawhub | Skill management | ✅ Active |
| model-usage | Cost tracking | ✅ Active |
| healthcheck | System monitoring | ✅ Active |

### Gateway Settings
- **Port**: 18789
- **Mode**: Local
- **Tailscale**: Enabled (for remote access)
- **Auto-restart**: Enabled (max 3/hour)

### Memory Configuration
- **Backend**: qmd (semantic search)
- **Paths**: 
  - `~/.openclaw/workspace/**/*.md`
  - `~/.openclaw/workspace/memory/**/*.md`
- **Update**: Every 2 minutes
- **Citations**: Auto-enabled

## Environment Variables

### AgentMail
```bash
AGENTMAIL_API_KEY=am_us_4966f926fb2b75aa5bcd3f7a94ee9b57ab11a189ce023ce8cefec1cc74c716bf
AGENTMAIL_INBOX=lonelysalt605@agentmail.to
```

### Nano Banana Pro
```bash
NANO_BANANA_API_KEY=AIzaSyBO0pO7T0b0rBW3bCNd7bDGhFODgF343RY
```

## Commands Reference

```bash
# Check gateway status
openclaw gateway status

# Restart gateway
openclaw gateway restart

# View logs
openclaw logs

# Test configuration
openclaw config validate
```

## Next Improvements
1. [ ] Add webhook endpoint for lead notifications
2. [ ] Configure WhatsApp Business channel
3. [ ] Set up ACP harness for website development
4. [ ] Add more model providers (Claude, GPT-4o)
