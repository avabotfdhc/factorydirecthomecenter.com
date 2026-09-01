# product-drop-monitor

Watches one product page, survives a virtual waiting room, adds to cart the moment
stock appears, drives to the checkout page, and then **stops and pages you** so you
confirm the payment yourself.

One session. One account. One queue slot. It waits its real turn.

---

## What it does and doesn't do

**Does**

- Polls a product page on a sane schedule and honours `429` / `Retry-After`
- Recognises a virtual waiting room (Queue-It and friends) and waits it out **without refreshing**
- Reports queue position as it moves, straight from the DOM — zero extra requests
- Adds to cart and navigates to checkout using explicit waits, no blind timeouts
- Alerts you on Discord, Slack, and SMS at every stage, with full-page screenshots
- Reuses a login you performed by hand, so the browser it hands you is already signed in
- On a crash, CAPTCHA, or failed selector: screenshots, alerts, and freezes the browser for you

**Doesn't**

- **No stealth/fingerprint-spoofing plugin.** It runs a persistent real Chromium profile instead.
  That isn't a hedge — a real profile with real cookies, canvas, and TLS is materially more
  reliable than a patched headless one, and it survives across runs.
- **No CAPTCHA solving.** If a challenge appears, it stops touching the site and gets you.
- **No proxies, no account rotation, no multi-session queue farming.** One of you, one slot.
- **No auto-payment.** It stops on the checkout form. The card is yours to confirm.

---

## Setup

```bash
npm install
npx playwright install chromium     # one time
cp config.example.json config.json
```

Then edit `config.json` (see [Configuration](#configuration)).

> `config.json`, `.auth/`, `.profile/`, and `artifacts/` are all gitignored. Your webhook
> URLs, Twilio token, and login cookies never leave your machine.

---

## The three commands you'll actually use

### 1. Log in once, by hand

```bash
npm run login
```

Opens a real browser on the target site and the Playwright Inspector. **Sign in yourself** —
type your password, finish 2FA, land on a logged-in page. No credentials are ever stored in
or read by this project.

When you're logged in, click **▶ Resume** in the Inspector. Cookies, `localStorage`, and
`sessionStorage` are snapshotted to `.auth/state.json`, and the persistent profile in
`.profile/` keeps the session for every later run.

Re-run this whenever the site logs you out.

### 2. Check your selectors before you trust it

```bash
npm run probe
```

Loads the product page and prints exactly what each configured selector matches:

```
selectors.inStock
  ✗ button[data-test='add-to-cart']:not([disabled])  → no match
selectors.outOfStock
  ✓ [data-test='sold-out']  → 1 match(es), visible=true, enabled=true, text="Sold out"

VERDICT
  Stock:   out-of-stock  (selector matched: [data-test='sold-out'])
  Queue:   false  (no queue signal)
  Blocked: false  (no challenge detected)
```

It leaves the browser open so you can fix selectors against the live DOM. **Run this on drop
day before the drop.** A wrong selector is the difference between an alert and silence.

### 3. Watch

```bash
npm run monitor              # headed — recommended
npm run monitor:headless     # no window
```

Headed is strongly recommended: when it hits checkout it hands you that exact window, already
logged in, cart loaded. Headless has no window to hand over — it holds the session open and
tells you to restart headed, which costs you the thing you were waiting for.

Also: `npm run test-notify` fires one test alert down every enabled channel. Do this first.

---

## Configuration

Everything lives in `config.json`. Copy `config.example.json` and fill it in.

### `target`

| Key | Meaning |
|---|---|
| `name` | Label used in alerts |
| `productUrl` | The page to watch |
| `pollIntervalMs` | Base interval. **Minimum 15000**, enforced. Default 60000. |
| `jitterMs` | Random 0–N ms added per cycle so restarts don't sync up |
| `navigationTimeoutMs` | Per-navigation ceiling |
| `respectRobotsTxt` | Warn (not block) if the path is disallowed |

Going faster than ~60s buys you almost nothing and is the quickest way to get the IP and the
account blocked outright — which costs you the drop entirely.

### `selectors` — the part that actually matters

| Key | What it is |
|---|---|
| `inStock` | Array. Any match ⇒ in stock. Must be **visible and enabled**. |
| `outOfStock` | Array. Checked **first** — see below. |
| `addToCart` | The button to click |
| `cartConfirmation` | Proof the add worked (drawer, cart badge) |
| `goToCart` | Optional link to the cart page |
| `checkoutButton` | Required when `autoProceedToCheckout` is on |
| `checkoutConfirmation` | Proof you're on checkout (payment form) |

**How to find them:** open the product page while it's sold out, right-click the disabled
button → Inspect. Prefer stable attributes (`data-test`, `data-testid`, `id`) over generated
class names, which change on every deploy.

**The disabled-button trap.** Most sites render the add-to-cart button all the time and merely
disable it. `#add-to-cart` alone therefore matches while sold out. Use
`button#add-to-cart:not([disabled])` for `inStock`. The detector also independently requires
the element to be visible *and* enabled, so you have two layers of protection here.

**Why `outOfStock` is checked first:** a page can legitimately contain both "Sold out" and
"Add to cart" — related products, other size variants, a sticky footer. A false negative costs
you one poll cycle; a false positive wakes you at 3am for nothing.

### `stockText`

Case-insensitive phrase fallback against the page body, used only when no selector matched.
For sites that swap copy instead of element state. Out-of-stock phrases win.

### `queue`

| Key | Meaning |
|---|---|
| `urlPatterns` | Substrings that mean "waiting room" — e.g. `queue-it.net`, `/waitingroom` |
| `selectors` | Elements that mean the same, for in-place waiting rooms |
| `positionSelector` | Where the position/ETA text lives, for progress alerts |
| `progressPollMs` | How often to *read the DOM* for position. No network cost. |
| `maxWaitMs` | Ceiling before giving up and restarting the cycle. Default 3 hours. |

**The bot never refreshes a queue page.** Queue-It and every system like it hold your place
with a token bound to the live page and advance you themselves. A manual refresh at best does
nothing and at worst invalidates the token and drops you to the back of the line. So the bot
waits on a real navigation *away* from the queue and reads position out of the
already-loaded DOM in the meantime.

### `blockers`

URL patterns, selectors, and body text that indicate a CAPTCHA or bot challenge. Defaults
cover reCAPTCHA, hCaptcha, PerimeterX, and Cloudflare. On a match the bot **stops polling**,
screenshots, alerts you, and freezes the browser so you can answer it. It never tries to
solve one.

### `behavior`

| Key | Default | Meaning |
|---|---|---|
| `autoAddToCart` | `true` | `false` ⇒ alert and hand over on stock, don't click |
| `autoProceedToCheckout` | `true` | `false` ⇒ stop at the cart |
| `pauseAtCheckout` | `true` | Freeze for manual takeover |
| `headless` | `false` | Headed strongly recommended |
| `maxConsecutiveErrors` | `5` | Failures before it pages you and freezes |

### `notify`

Enable any combination. At least one is required — config validation rejects a run with none.

```jsonc
"discord": {
  "enabled": true,
  "webhookUrl": "https://discord.com/api/webhooks/...",   // Server Settings → Integrations → Webhooks
  "mentionOnUrgent": "@here"                              // pings only on urgent
}
```

```jsonc
"slack": {
  "enabled": true,
  "webhookUrl": "https://hooks.slack.com/services/...",   // text
  "botToken": "xoxb-...",                                 // optional, needed for screenshots
  "channel": "C0123456789"                                // channel ID, with botToken
}
```
A webhook alone sends text; screenshots need a bot token with `files:write`. Without one you
still get every alert, just no image.

```jsonc
"sms": {
  "enabled": true,
  "accountSid": "AC...",        // twilio.com/console
  "authToken": "...",
  "from": "+1...",              // your Twilio number
  "to": "+1...",                // your phone
  "urgentOnly": true            // only urgent + error, so you aren't billed per poll
}
```
SMS carries no image — the rich channels carry the screenshot, this one carries the interrupt.
Leave `urgentOnly` on unless you enjoy paying for status updates.

---

## What you'll get pinged for

| Alert | Severity | When |
|---|---|---|
| Monitor started | info | Startup, confirms channels work |
| In the queue | info | Waiting room detected |
| Queue progress | info | Position changed |
| **THROUGH THE QUEUE** | **urgent** | Out of the waiting room |
| **IN STOCK** | **urgent** | Stock found, going for the cart |
| **🛒 AT CHECKOUT — GO NOW** | **urgent** | Checkout is open and logged in. Move. |
| Rate limited | warn | `429`/`503`, backing off |
| Can't read stock state | warn | No selector matched — check `npm run probe` |
| Blocked — needs you | error | CAPTCHA. Browser frozen for you. |
| Cart flow failed | error | In stock but a step broke. Browser is open on the page — go manually. |
| Monitor is stuck / crashed | error | Repeated failures or a fatal. Screenshot attached. |

Every `error` and every urgent stage carries a full-page screenshot on Discord/Slack.

---

## Try it before the drop

A fixture storefront simulates the whole sequence so you can watch it work end to end without
touching a real retailer:

```bash
node test/fixture-server.mjs                  # terminal 1
MONITOR_CONFIG=test/config.fixture.json \
  npm run monitor:headless                    # terminal 2
```

It walks waiting room → sold out → in stock → cart → checkout in about 30 seconds, posting
every alert to a mock webhook the fixture logs. `curl localhost:8787/__hits` shows the request
count — a healthy run hits `/waitingroom` exactly **once**, which is how you confirm it isn't
refreshing the queue.

Set `BLOCK=1` on the fixture to serve a CAPTCHA instead and watch the blocked path.

---

## Notes

- **`CHROME_PATH`** — set it to a real Google Chrome binary to run in your actual browser build
  rather than Playwright's bundled Chromium. Optional; a stock consumer Chrome is the most
  ordinary-looking client there is.
- **`LOG_LEVEL=debug`** for per-cycle detail.
- **`MONITOR_CONFIG=path.json`** to use a config other than `config.json`.
- **Ctrl-C** is instant — the poll delay is abort-aware rather than a blocking sleep.
- The only deliberate delay in the codebase is the gap between polls, which is inherent to
  polling. Every wait on a *page condition* is an explicit Playwright wait.

## Before you point this at a real site

Automating purchases is against the terms of service of most retailers, and the account and
payment method you use are the ones that get banned if they object. For ticketed inventory the
US BOTS Act is also in play. Running one session at your real turn in line is the version of
this that stays on the right side of the line — don't add proxies, extra accounts, or
CAPTCHA-solving services to it, which is where it turns into something else entirely.
