# Vercel environment variables — what is set, what is missing, how to add it

Verified against production on **2026-09-28** by reading `GET /api/health` (which
reports `Boolean(process.env[NAME])` from inside the running function) and by
driving the live build in a real browser.

**Do not put any of these in the repo.** `.env*` files are excluded from Vercel
uploads by `.vercelignore`, and a local `.env.local` with placeholder values
breaks `npm run dev`. The two exceptions already in source are explained below.

---

## Already working — nothing to do

| What | How it works today |
|---|---|
| **Google Analytics 4** | `G-6PMB9SZX4H`, committed as the default in `src/lib/analytics.tsx` |
| **Microsoft Clarity** | `tjh2nfoq85`, committed the same way |
| **Supabase catalogue / admin / leads** | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` all set |
| **DealerTide CRM** | `DEALERTIDE_API_KEY` set — website leads reach the CRM |

GA4 and Clarity IDs are **public values** that ship in the page source on every
request, so committing them is safe and deliberate. An env var of the same name
still overrides them if you ever set one.

**Why they look absent if you check the HTML.** `AnalyticsProvider` renders
`null` until *two* gates pass: the visitor accepts cookies, **and** they interact
with the page (scripts are deferred past first interaction for speed). So
`curl`ing the page, or viewing source before accepting the banner, shows no
tracking scripts even though tracking is working. Verify in a browser: accept the
banner, click/scroll, then watch the network panel for `googletagmanager.com` and
`clarity.ms`. Do not conclude from raw HTML that tracking is broken — that
mistake was made on 2026-09-28.

---

## Missing — add these

Listed in the order they are worth doing.

### 1. `ANTHROPIC_API_KEY` — turns Ava on

The biggest functional gap. Without an AI key `POST /api/chat` returns **503**
and the chat widget silently falls back to canned scripted replies, so Ava is
not doing the job she was built for (discovery, plan lookup, quote and
showroom-visit capture).

- Value: an Anthropic API key (`sk-ant-…`) from
  <https://console.anthropic.com/settings/keys>. Set a monthly spend limit in
  the same console (Settings → Limits).
- Model: Claude Haiku 5.5 (`claude-haiku-5-5`). Optional override:
  `ANTHROPIC_CHAT_MODEL`.
- Cost: at ~500 chats a month, a few dollars. Ava's instructions and catalogue
  (~17k tokens) go with every message, but they are prompt-cached, so repeats
  within a few minutes bill at a tenth of the input price.
- **Fallback:** `OPENAI_API_KEY` (optional `OPENAI_CHAT_MODEL`, default
  `gpt-4o-mini`) is used only when `ANTHROPIC_API_KEY` is unset. Keep it set
  while switching over; it can be removed once Claude is confirmed working.

### 2. `RESEND_API_KEY` — lead alert emails

Leads already reach Supabase and DealerTide, so **nothing is being lost** — but
nobody gets an email when one arrives.

- `RESEND_API_KEY` from <https://resend.com/api-keys>
- `LEAD_EMAIL_TO` — optional, defaults to `leads@factorydirecthomescenter.com`

With the key set, `/api/leads` also emails you when DealerTide rejects a lead,
skips it as a duplicate, or the Supabase copy fails.

### 3. `NEXT_PUBLIC_FB_PIXEL_ID` — only if you run Meta ads

Defaults to empty, so the Pixel does not load at all today. Add it only if you
advertise on Facebook/Instagram; it is the Pixel ID from Meta Events Manager
(a long number). Public value, like GA4.

### 4. `NEXT_PUBLIC_GTM_ID` — only if you actually use a GTM container

Also empty today. GA4 already runs **directly**, so Tag Manager is optional and
adding an empty container gains nothing. Add it only if you have a container you
use (`GTM-XXXXXXX`).

### 5. `LEAD_WEBHOOK_SECRET` — Supabase → email webhook

Lets the Supabase Database Webhook on `leads` INSERT post to
`/api/webhooks/new-lead`. Any long random string, set identically in the Supabase
webhook's `x-webhook-secret` header. Optional `LEAD_ALERT_EMAIL_TO` (defaults to
sales@). Needs `RESEND_API_KEY` to be useful.

### 6. `GOOGLE_SHEETS_ID` + `GOOGLE_SERVICE_ACCOUNT_KEY` — spreadsheet copy of leads

Both must be set or the channel is skipped. Only worth it if you want leads in a
Sheet as well as the CRM.

### 7. `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` — spam protection

Cloudflare Turnstile is wired but **deliberately inert** until both exist. The
honeypot and fill-timer still run without it. Real visitors see no widget
(`appearance: "interaction-only"`), and verification fails open — Cloudflare
being unreachable never costs you a lead.

---

## How to add one

Dashboard (easiest):

1. <https://vercel.com/kyle-dudgeons-projects/factorydirecthomescenter> →
   **Settings** → **Environment Variables**
2. **Key** = the name exactly as spelled above; **Value** = the value
3. Tick **Production** (tick Preview and Development too if you want the
   previews to behave the same). *A variable ticked only for Preview does not
   reach the live site* — that is the most common way this goes wrong.
4. **Save**

Or from a terminal with the Vercel CLI: `vercel env add ANTHROPIC_API_KEY production`

## Then redeploy, then verify

**Env var changes only reach deployments created after the change.** Adding a
variable does not alter the running deployment. Either push a commit, or use
**Deployments → ⋯ → Redeploy** in the dashboard.

Afterwards, open <https://factorydirecthomescenter.com/api/health>. It reports
booleans only — never values — so it is safe to read and safe to paste. The
variable you added should flip to `true`.
