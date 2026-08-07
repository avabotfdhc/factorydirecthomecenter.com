# DealerTide → factorydirecthomescenter.com — Inventory Feed API Spec

**Prepared for:** DealerTide / Renter Insight engineering
**On behalf of:** Kyle Dudgeon, Factory Direct Homes Center LLC (Auburn, IN)
**Purpose:** Power the dealer's website (and future listing partners) directly from DealerTide inventory — homes, photos, floor plans, videos, options — plus push website leads into the CRM.

---

## 1. Authentication

- HTTPS only.
- `Authorization: Bearer <api-key>` on every request.
- Keys scoped **read-only** for inventory endpoints; a separate key (or scope) for lead writes.
- Keys revocable/regenerable by the dealer in the DealerTide UI.

## 2. Inventory list — `GET /v1/inventory`

Query params:

| Param | Type | Notes |
|---|---|---|
| `status` | string | `available` (default), `pending`, `sold`, `all` |
| `updated_since` | ISO 8601 | Incremental sync; return only records changed after this time |
| `page`, `per_page` | int | Pagination; `per_page` max 200. Response includes `total_count`, `total_pages` |

Response: `{ "data": [ <Home>, ... ], "total_count": n, "total_pages": n }`

## 3. Inventory detail — `GET /v1/inventory/{id}`

Full `<Home>` object (list may return a slimmed version; detail returns everything).

## 4. The `Home` object

**Required fields** (site cannot render a card without these):

| Field | Type | Example |
|---|---|---|
| `id` | string | stable unique ID |
| `slug` | string | URL-safe, stable — `"aspire-4614-05"` |
| `title` | string | `"Champion Aspire 4614-05"` |
| `manufacturer` | string | `"Champion Home Builders"` |
| `home_type` | enum | `single_wide` \| `double_wide` \| `modular` \| `park_model` |
| `status` | enum | `available` \| `pending` \| `sold` |
| `beds`, `baths` | number | baths may be decimal (2.5) |
| `sqft` | number | |
| `updated_at` | ISO 8601 | drives incremental sync |

**Pricing** (all optional — site hides price cleanly when absent):

| Field | Type | Notes |
|---|---|---|
| `price.msrp` | number | cents or dollars — specify which, be consistent |
| `price.sale` | number | current advertised price |
| `price.display_mode` | enum | `show` \| `contact_for_price` — dealer-controlled per home |

**Specs** (optional): `model_number`, `series`, `length_ft`, `width_ft`, `sections`, `year`, `location` (lot/community), `condition` (`new` \| `used`).

**Content** (optional): `description` (plain text or limited HTML — specify), `features` (string array).

**Media** — the part that matters most. All URLs absolute HTTPS, publicly fetchable (no auth), stable:

```json
"media": {
  "photos":      [ { "url": "...", "caption": "", "sort": 1 } ],
  "floor_plans": [ { "url": "...", "caption": "", "sort": 1 } ],
  "videos":      [ { "url": "...", "type": "youtube|vimeo|mp4", "title": "" } ],
  "virtual_tour": "https://my.matterport.com/...",
  "brochure_pdf": "https://..."
}
```

- Photos vs floor-plan drawings **must be separate arrays** (the current CMS mixes them, which forces guesswork).
- Prefer serving originals; the website handles resizing. If you serve renditions, include the largest.

**Options / customization** (optional now, wanted soon — powers a "build & quote" flow):

```json
"options": [
  { "group": "Exterior Color", "type": "color", "choices": [ { "name": "Clay", "swatch_hex": "#B66A50", "image_url": null } ] },
  { "group": "Upgrades", "type": "addon", "choices": [ { "name": "Deluxe Kitchen Package", "description": "", "price_delta": 4500 } ] }
]
```

## 5. Webhooks

Dealer registers an HTTPS endpoint + shared secret in DealerTide.

- Events: `inventory.created`, `inventory.updated`, `inventory.deleted`, `inventory.status_changed`
- Payload: `{ "event": "...", "id": "...", "occurred_at": "..." }` — ID-only is fine; the site re-fetches the record
- Sign each delivery: `X-Signature: hmac-sha256(body, secret)`
- Retry with backoff on non-2xx (at least 3 attempts)

This lets the website update within seconds of a change in DealerTide instead of polling.

## 6. Website leads → CRM — `POST /v1/leads`

```json
{
  "first_name": "…", "last_name": "…",
  "email": "…", "phone": "…",
  "message": "…",
  "interest_home_id": "…",            // optional: the home they asked about
  "source": "website",
  "page_url": "https://factorydirecthomescenter.com/floor-plans/…",
  "utm": { "source": "…", "medium": "…", "campaign": "…" }
}
```

- Respond `201` with the created lead ID.
- Accept-and-dedupe on email+phone within a short window is a plus.

## 7. Operational

- **Versioned base path** (`/v1/`) so future changes don't break the site.
- **Rate limits:** the website fetches server-side and caches ~5 min, so traffic is light (a few requests/min worst case). Anything ≥ 60 req/min per key is ample.
- **Sandbox:** a test key + a couple of dummy homes lets us integrate before production data is exposed.
- **CORS not required** — all calls are server-to-server.

## 8. Nice-to-haves (not blockers)

- `GET /v1/inventory/{id}` accepts slug as well as ID
- A `deleted_since` list (or `status: removed` in `updated_since` results) so removed homes disappear from the site
- Listing-partner syndication (MHVillage etc.) can consume this same feed — nothing extra needed from us

---

*Integration contact: the dealer's website pulls this feed server-side (Next.js on Vercel) through a single adapter module; once endpoints exist we can be live against sandbox in a day.*
