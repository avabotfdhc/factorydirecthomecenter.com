# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

## Email (AgentMail)

- **Inbox:** `lonelysalt605@agentmail.to`
- **API Key:** Stored in `~/.openclaw/openclaw.json`
- **Environment Variables:**
  - `AGENTMAIL_API_KEY=am_us_4966f926fb2b75aa5bcd3f7a94ee9b57ab11a189ce023ce8cefec1cc74c716bf`
  - `AGENTMAIL_INBOX=lonelysalt605@agentmail.to`
- **Send Command:** `python ~/.openclaw/skills/agentmail/scripts/send_email.py --inbox "lonelysalt605@agentmail.to" --to "recipient@example.com" --subject "Subject" --text "Body"`
- **Kyle's Email:** `kdudgeon@factorydirecthomescenter.com`

---

## Cron Jobs

- **Always** use `--model nvidia/kimi-k2.5` (alias `Kimi-NV`) when creating cron jobs
- The Nvidia endpoint is reserved for scheduled/research tasks
- Interactive chat uses `moonshot/kimi-k2.5` (alias `Kimi`) — don't use Nvidia for that
- Deliver results to Telegram user `8353870817`

---

## Google Workspace (via `gog` CLI + MCP)

Ava has two paths for Google Workspace: `gog` CLI for sending/writing, MCP tools for reading.

### gog CLI (avabotfdhc@gmail.com) — PRIMARY for sending
- **Account:** `avabotfdhc@gmail.com`
- **Env vars:** `GOG_ACCOUNT` and `GOG_KEYRING_PASSWORD` are set in `~/.zshrc`
- **Send email (plain):** `gog gmail send --to a@b.com --subject "Hi" --body "Hello"`
- **Send email (multi-line):** `gog gmail send --to a@b.com --subject "Hi" --body-file - <<'EOF'\n...\nEOF`
- **Send email (HTML):** `gog gmail send --to a@b.com --subject "Hi" --body-html "<p>Hello</p>"`
- **Create draft:** `gog gmail drafts create --to a@b.com --subject "Hi" --body "Hello"`
- **Send draft:** `gog gmail drafts send <draftId>`
- **Reply:** `gog gmail send --to a@b.com --subject "Re: Hi" --body "Reply" --reply-to-message-id <msgId>`
- **Search:** `gog gmail search 'newer_than:7d' --max 10`
- **Calendar:** `gog calendar events <calendarId> --from <iso> --to <iso>`
- **Drive:** `gog drive search "query" --max 10`
- **Sheets:** `gog sheets get <sheetId> "Tab!A1:D10" --json`
- **Docs:** `gog docs cat <docId>`

### Gmail MCP (factorydirecthomescenter@gmail.com) — READ-ONLY
- **Search:** `mcp__claude_ai_Gmail__gmail_search_messages` — full Gmail query syntax
- **Read message:** `mcp__claude_ai_Gmail__gmail_read_message` — by message ID
- **Read thread:** `mcp__claude_ai_Gmail__gmail_read_thread` — full conversation
- **Create draft:** `mcp__claude_ai_Gmail__gmail_create_draft` — to/cc/bcc, plain or HTML
- **List drafts:** `mcp__claude_ai_Gmail__gmail_list_drafts`
- **List labels:** `mcp__claude_ai_Gmail__gmail_list_labels`
- **NOTE:** MCP Gmail has NO send capability — use `gog` for sending

### Google Calendar MCP (avabotfdhc@gmail.com)
- **List events:** `mcp__claude_ai_Google_Calendar__gcal_list_events`
- **Create event:** `mcp__claude_ai_Google_Calendar__gcal_create_event`
- **Update event:** `mcp__claude_ai_Google_Calendar__gcal_update_event`
- **Delete event:** `mcp__claude_ai_Google_Calendar__gcal_delete_event`
- **Find free time:** `mcp__claude_ai_Google_Calendar__gcal_find_my_free_time`
- **Find meeting times:** `mcp__claude_ai_Google_Calendar__gcal_find_meeting_times`

### Box (File Storage)
- **Search files:** `mcp__claude_ai_Box__search_files_keyword`
- **Search folders:** `mcp__claude_ai_Box__search_folders_by_name`
- **Create folder:** `mcp__claude_ai_Box__create_folder`
- **Upload file:** `mcp__claude_ai_Box__upload_file`
- **Get file content:** `mcp__claude_ai_Box__get_file_content`
- **Get file details:** `mcp__claude_ai_Box__get_file_details`
- **List folder contents:** `mcp__claude_ai_Box__list_folder_content_by_folder_id`

### Key Notes
- **Send emails via `gog`** (avabotfdhc@gmail.com), read via MCP (factorydirecthomescenter@gmail.com)
- **Kyle's Email:** `kdudgeon@factorydirecthomescenter.com`
- **Credentials backup:** `~/.config/gws/credentials.json`

---

Add whatever helps you do your job. This is your cheat sheet.
