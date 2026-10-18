// DealerTide inventory sync, run on the website (Vercel) instead of inside
// Supabase.
//
// The Supabase edge function `dealertide-sync` does the same job, but it reads
// the feed token from Supabase's secrets store, and that secret was never set:
// Kyle keeps every key in Vercel (2026-10-18: "I believe I already pasted
// inventory key in vercel"), and the agent session cannot read Vercel env vars
// to move it. So this module reads the token where it actually lives —
// `DEALERTIDE_INVENTORY_TOKEN`, or the `token=` inside `DEALERTIDE_FEED_URL`,
// the feed URL the site has carried since August — and writes the same staging
// tables with the service role. Same steps as the edge function, from
// DealerTide's own re-import note (2026-10-09):
//   1. pull every page of /public/inventory (available + available_to_order);
//   2. match homes on "id";
//   3. compare each home's photo and floor-plan lists with what is stored
//      (photos can change without updated_at changing) and flag differences;
//   4. a home missing from the list is marked removed only after its detail
//      call answers 410 Gone.
// Read-only towards DealerTide; writes nothing the website reads. Copying
// media into the catalogue is the separate, reviewed step in
// docs/dealertide-inventory-sync.md.
//
// The token rides in DealerTide's URL, so no URL is ever logged or returned,
// and no summary field carries it.

const DEFAULT_API = "https://api.dealertide.com/public/inventory";
const PER_PAGE = 50;
const MAX_PAGES = 40;
// Champion model codes: 2852H32169, 2852M32171, 1456H22P01, 2852H32A1C.
// DealerTide sends the code in `identifier` (measured 2026-10-18: all 242
// homes), with the family name in `model` and the series in `trim`.
// Two older records spell the code with spaces ("2842 H32388", "2868 H42 P01").
const MODEL_RE = /\b(\d{4}\s?[HM]\d{2}\s?[0-9A-Z]{3})\b/i;

export type Row = Record<string, unknown>;

/** `token=` out of a feed URL, or "" when there is none. */
export function tokenFromFeedUrl(feedUrl: string | undefined): string {
  if (!feedUrl) return "";
  try {
    return new URL(feedUrl.trim()).searchParams.get("token")?.trim() ?? "";
  } catch {
    return "";
  }
}

type Env = Record<string, string | undefined>;

// The names a feed token may have been pasted under, most specific first.
// Matched case-insensitively: production carries `Dealertide_Inventory_Key`
// (measured 2026-10-18), and Linux `process.env` is case-sensitive. The
// partner (lead) key and the API base are never candidates: the lead key is a
// different credential, and a feed token pasted over it is exactly what took
// leads down in October 2026.
const TOKEN_NAMES = [
  "DEALERTIDE_INVENTORY_TOKEN",
  "DEALERTIDE_INVENTORY_KEY",
  "DEALERTIDE_INVENTORY_API_KEY",
  "DEALERTIDE_FEED_TOKEN",
  "DEALERTIDE_PUBLIC_TOKEN",
  "DEALERTIDE_TOKEN",
  "DEALERTIDE_INVENTORY_URL",
  "DEALERTIDE_INVENTORY_FEED_URL",
  "DEALERTIDE_PUBLIC_INVENTORY_URL",
  "DEALERTIDE_FEED_URL",
];
const NEVER_A_TOKEN = /API_KEY|API_BASE|LEAD/i;

/** A value that is either the bare token or a URL carrying it as `token=`. */
function tokenFromValue(v: string | undefined): string {
  const t = v?.trim() ?? "";
  if (!t) return "";
  if (/^https?:\/\//i.test(t)) return tokenFromFeedUrl(t);
  if (/[\s/?&=]/.test(t)) return ""; // not a URL, not a bare token
  return t;
}

/** The feed token this deployment carries, under whichever name it was given. */
export function inventoryToken(env: Env = process.env): string {
  const byUpper = new Map<string, string | undefined>();
  for (const [k, v] of Object.entries(env)) byUpper.set(k.toUpperCase(), v);
  for (const name of TOKEN_NAMES) {
    const t = tokenFromValue(byUpper.get(name));
    if (t) return t;
  }
  // Any other DealerTide variable whose value is a feed URL with ?token=
  // (production has one named DEALERTIDE_FEED_UR, last letter missing).
  for (const [k, v] of byUpper) {
    if (!k.startsWith("DEALERTIDE") || NEVER_A_TOKEN.test(k)) continue;
    if (v && /^https?:\/\//i.test(v.trim())) {
      const t = tokenFromFeedUrl(v);
      if (t) return t;
    }
  }
  return "";
}

/** Which DealerTide-related variable names this deployment has (names only, never values). */
export function dealertideEnvNames(env: Env = process.env): string[] {
  return Object.keys(env)
    .filter((k) => /DEALER|TIDE|RENTER|INVENTORY/i.test(k))
    .sort();
}

export function inventorySyncConfigured(env: Env = process.env): boolean {
  return Boolean(inventoryToken(env) && env.NEXT_PUBLIC_SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY);
}

/** A list of URLs, whether the feed sends strings or { url } objects. */
export function urlList(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((x) => (typeof x === "string" ? x : x && typeof x === "object" ? String((x as Row).url ?? "") : ""))
    .filter((u) => /^https?:\/\//.test(u));
}

export function modelCodeOf(h: Row): string | null {
  const nested = (h.catalog_model ?? h.model_info ?? {}) as Row;
  const fields = [
    h.identifier,
    h.model_number,
    h.model,
    h.catalog_model_number,
    nested.model_number,
    nested.model,
    h.display_name,
    h.title,
    h.name,
    h.description,
  ];
  for (const f of fields) {
    const m = typeof f === "string" ? f.match(MODEL_RE) : null;
    if (m) return m[1].replace(/\s/g, "").toUpperCase();
  }
  return null;
}

const text = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : null);
export const sameList = (a: string[], b: string[]) => a.length === b.length && a.every((x, i) => x === b[i]);

/** The homes inside one page of the feed, whatever envelope it uses. */
export function homesOf(body: unknown): Row[] {
  if (Array.isArray(body)) return body as Row[];
  const b = body as Row;
  for (const k of ["data", "inventory", "items", "results", "homes"]) if (Array.isArray(b?.[k])) return b[k] as Row[];
  return [];
}

export interface SyncSummary extends Row {
  ok: boolean;
  pages?: number;
  homes?: number;
  declared_total?: number | null;
  added?: number;
  media_changed?: number;
  removed?: number;
  note?: string | null;
  with_model_code?: number;
  sample_fields?: string[];
  error?: string;
}

export interface SyncOptions {
  token: string;
  supabaseUrl: string;
  serviceKey: string;
  /** Override for tests. */
  api?: string;
  fetchImpl?: typeof fetch;
}

interface StoredRow {
  id: string;
  image_urls: string[] | null;
  floor_plan_images: string[] | null;
  media_changed_at: string | null;
  removed_at: string | null;
}

/**
 * Run one sync. Resolves to the same JSON summary the edge function returns,
 * with an HTTP status for the route to send. Never throws for a feed or
 * database failure — those come back as `{ ok: false, error }` and are written
 * to the run row, because a sync that fails silently is the thing this exists
 * to stop.
 */
export async function runInventorySync(opts: SyncOptions): Promise<{ status: number; summary: SyncSummary }> {
  const api = (opts.api ?? DEFAULT_API).replace(/\/$/, "");
  const f = opts.fetchImpl ?? fetch;
  const base = opts.supabaseUrl.replace(/\/$/, "");
  const auth = { apikey: opts.serviceKey, Authorization: `Bearer ${opts.serviceKey}` };

  const rest = (path: string, init: RequestInit & { prefer?: string } = {}) =>
    f(`${base}/rest/v1/${path}`, {
      ...init,
      cache: "no-store",
      headers: {
        ...auth,
        "Content-Type": "application/json",
        ...(init.prefer ? { Prefer: init.prefer } : {}),
        ...(init.headers ?? {}),
      },
    });

  // A run row first, so a crash still leaves a trace.
  let runId: number | null = null;
  {
    const res = await rest("dealertide_sync_runs", {
      method: "POST",
      prefer: "return=representation",
      body: JSON.stringify([{ started_at: new Date().toISOString() }]),
    });
    if (res.ok) runId = ((await res.json()) as { id?: number }[])[0]?.id ?? null;
  }
  const finish = async (summary: SyncSummary, status = 200) => {
    if (runId != null) {
      await rest(`dealertide_sync_runs?id=eq.${runId}`, {
        method: "PATCH",
        prefer: "return=minimal",
        body: JSON.stringify({
          finished_at: new Date().toISOString(),
          ok: summary.ok === true,
          pages: summary.pages ?? null,
          homes: summary.homes ?? null,
          added: summary.added ?? null,
          media_changed: summary.media_changed ?? null,
          removed: summary.removed ?? null,
          note: summary.error ? String(summary.error) : summary.note ? String(summary.note) : null,
        }),
      }).catch(() => undefined);
    }
    return { status, summary };
  };

  // 1. Every page. The URL carries the token, so it is never logged or returned.
  const feed: Row[] = [];
  let totalPages = 1;
  let declaredTotal: number | null = null;
  let pages = 0;
  for (let page = 1; page <= totalPages; page++) {
    if (page > MAX_PAGES) return finish({ ok: false, error: `more than ${MAX_PAGES} pages — stopped`, pages }, 502);
    const url = `${api}?token=${encodeURIComponent(opts.token)}&statuses=available,available_to_order&per_page=${PER_PAGE}&page=${page}`;
    let res: Response;
    try {
      res = await f(url, { headers: { accept: "application/json" }, cache: "no-store", signal: AbortSignal.timeout(20_000) });
    } catch (err) {
      return finish({ ok: false, error: `page ${page}: ${err instanceof Error ? err.message : String(err)}`, pages }, 502);
    }
    if (!res.ok) return finish({ ok: false, error: `page ${page}: HTTP ${res.status}`, pages }, 502);
    const body = (await res.json().catch(() => null)) as unknown;
    const meta = ((body as Row)?.meta ?? {}) as Row;
    totalPages = Number(meta.total_pages ?? (body as Row)?.total_pages ?? 1) || 1;
    const total = Number(meta.total ?? meta.total_count ?? (body as Row)?.total_count);
    if (Number.isFinite(total) && total > 0) declaredTotal = total;
    feed.push(...homesOf(body));
    pages = page;
  }
  const homes = feed.filter((h) => h && h.id != null);
  if (homes.length === 0) return finish({ ok: false, error: "the feed returned no homes", pages }, 502);
  const complete = declaredTotal == null || homes.length >= declaredTotal;

  // 2–3. Match on id; flag photo / floor-plan list changes.
  const storedRes = await rest("dealertide_inventory?select=id,image_urls,floor_plan_images,media_changed_at,removed_at", {
    headers: { Range: "0-9999" },
  });
  if (!storedRes.ok) return finish({ ok: false, error: `read staging: HTTP ${storedRes.status}`, pages }, 500);
  const stored = (await storedRes.json()) as StoredRow[];
  const prev = new Map(stored.map((r) => [String(r.id), r]));
  const now = new Date().toISOString();
  let added = 0;
  let mediaChanged = 0;

  const rows = homes.map((h) => {
    const id = String(h.id);
    const photos = urlList(h.image_urls);
    const plans = urlList(h.floor_plan_images);
    const old = prev.get(id);
    let changedAt = old?.media_changed_at ?? null;
    if (!old) added++;
    else if (old.removed_at || !sameList(old.image_urls ?? [], photos) || !sameList(old.floor_plan_images ?? [], plans)) {
      mediaChanged++;
      changedAt = now;
    }
    return {
      id,
      model_code: modelCodeOf(h),
      title: text(h.display_name) ?? text(h.title) ?? text(h.name),
      status: text(h.status),
      image_urls: photos,
      floor_plan_images: plans,
      feed_updated_at: text(h.updated_at),
      raw: h,
      last_seen_at: now,
      media_changed_at: changedAt,
      removed_at: null,
    };
  });
  for (let i = 0; i < rows.length; i += 100) {
    const res = await rest("dealertide_inventory?on_conflict=id", {
      method: "POST",
      prefer: "resolution=merge-duplicates,return=minimal",
      body: JSON.stringify(rows.slice(i, i + 100)),
    });
    if (!res.ok) {
      const detail = (await res.text().catch(() => "")).slice(0, 200);
      return finish({ ok: false, error: `write staging: HTTP ${res.status} ${detail}`, pages, homes: homes.length }, 500);
    }
  }

  // 4. Gone from the list → removed, but only on a complete pull and a 410.
  const seen = new Set(rows.map((r) => r.id));
  const missing = [...prev.values()].filter((r) => !r.removed_at && !seen.has(String(r.id))).map((r) => String(r.id));
  const removed: string[] = [];
  const kept: string[] = [];
  if (complete) {
    for (const id of missing) {
      try {
        const res = await f(`${api}/${encodeURIComponent(id)}?token=${encodeURIComponent(opts.token)}`, {
          headers: { accept: "application/json" },
          cache: "no-store",
          signal: AbortSignal.timeout(15_000),
        });
        if (res.status === 410) removed.push(id);
        else kept.push(`${id} (HTTP ${res.status})`);
      } catch {
        kept.push(`${id} (no response)`);
      }
    }
    if (removed.length) {
      const list = removed.map((id) => `"${id.replace(/"/g, "")}"`).join(",");
      await rest(`dealertide_inventory?id=in.(${encodeURIComponent(list)})`, {
        method: "PATCH",
        prefer: "return=minimal",
        body: JSON.stringify({ removed_at: now }),
      });
    }
  }

  return finish({
    ok: true,
    pages,
    homes: homes.length,
    declared_total: declaredTotal,
    added,
    media_changed: mediaChanged,
    removed: removed.length,
    note: complete ? (kept.length ? `missing but not 410: ${kept.join(", ")}` : null) : "incomplete pull — removals skipped",
    with_model_code: rows.filter((r) => r.model_code).length,
    // Field names only (no values), so the matcher can be adjusted to the real shape.
    sample_fields: Object.keys(homes[0]).sort(),
  });
}
