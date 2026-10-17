/**
 * Push website leads that never reached DealerTide back into the CRM, from the
 * durable copy in Supabase `public.leads`.
 *
 *   vercel env run -- npm run dealertide-replay -- --since=2026-10-10T02:24:00Z            # dry run: lists what would be sent
 *   vercel env run -- npm run dealertide-replay -- --since=2026-10-10T02:24:00Z --apply    # sends them
 *
 * Options:
 *   --since=<ISO>        required; first lead to replay (inclusive)
 *   --until=<ISO>        optional; last lead to replay (exclusive)
 *   --apply              actually POST to DealerTide (default is a dry run)
 *   --exclude=<id,id>    lead ids to skip
 *   --include-tests      also replay rows that look like our own test submissions
 *
 * Needs NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (the leads table is
 * admin-only since 2026-10-11) and DEALERTIDE_API_KEY — all Vercel-only, hence
 * `vercel env run`. Safe to run twice: DealerTide answers 202 for a contact it
 * already has, reported here as "already in DealerTide". Exits non-zero if any
 * lead was refused, so the failure cannot be missed.
 *
 * Why this exists: 2026-10-09 → 2026-10-17, DealerTide rejected the partner key
 * on every lead ("Invalid or revoked API key"); 17 buyers were in Supabase and
 * not in the CRM. See AGENTS.md.
 */
import { pushLeadToDealertide, probeDealertideKey } from "../src/lib/dealertide";
import { looksLikeTestLead, replayPayload, type StoredLeadRow } from "../src/lib/lead-replay";

const args = new Map<string, string>();
for (const a of process.argv.slice(2)) {
  const m = a.match(/^--([^=]+)(?:=(.*))?$/);
  if (m) args.set(m[1], m[2] ?? "true");
}
const since = args.get("since");
const until = args.get("until");
const apply = args.get("apply") === "true";
const includeTests = args.get("include-tests") === "true";
const exclude = new Set((args.get("exclude") ?? "").split(",").map((s) => s.trim()).filter(Boolean));

if (!since || Number.isNaN(Date.parse(since))) {
  console.error("Usage: --since=<ISO instant> [--until=<ISO>] [--apply] [--exclude=id,id] [--include-tests]");
  process.exit(2);
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required (run under `vercel env run --`).");
  process.exit(2);
}

const COLUMNS =
  "id,created_at,full_name,contact_info,target_county,timeline,model_interest,series_interest,source_page," +
  "utm_source,utm_medium,utm_campaign,utm_term,click_id,click_id_type,landing_page,referrer," +
  "first_touch_source,first_touch_medium,first_touch_campaign,touch_count";

async function fetchRows(): Promise<StoredLeadRow[]> {
  const q = new URLSearchParams({ select: COLUMNS, order: "created_at.asc", limit: "500" });
  q.append("created_at", `gte.${since}`);
  if (until) q.append("created_at", `lt.${until}`);
  const res = await fetch(`${SUPABASE_URL}/rest/v1/leads?${q}`, {
    headers: { apikey: SERVICE_KEY!, Authorization: `Bearer ${SERVICE_KEY}` },
  });
  if (!res.ok) throw new Error(`Supabase leads read HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return (await res.json()) as StoredLeadRow[];
}

const pad = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1) + "…" : s.padEnd(n));

async function main() {
  const key = await probeDealertideKey();
  console.log(`DealerTide key: ${key.verdict} (${key.detail})`);
  if (apply && key.verdict !== "ok") {
    console.error("Refusing to replay: DealerTide does not accept the key this environment carries. Fix DEALERTIDE_API_KEY first.");
    process.exit(1);
  }

  const rows = await fetchRows();
  const skipped: { row: StoredLeadRow; why: string }[] = [];
  const todo: StoredLeadRow[] = [];
  for (const row of rows) {
    if (exclude.has(row.id)) skipped.push({ row, why: "excluded" });
    else if (!includeTests && looksLikeTestLead(row)) skipped.push({ row, why: "looks like a test submission" });
    else todo.push(row);
  }

  console.log(`\n${rows.length} lead(s) since ${since}${until ? ` until ${until}` : ""}; ${todo.length} to replay, ${skipped.length} skipped.\n`);
  for (const { row, why } of skipped) {
    console.log(`  skip  ${row.id}  ${pad(row.full_name, 22)}  ${why}`);
  }
  console.log("");
  for (const row of todo) {
    const p = replayPayload(row);
    const contact = [p.phone, p.email].filter(Boolean).join(" · ");
    console.log(`  ${apply ? "send" : "would send"}  ${row.id}  ${row.created_at.slice(0, 16)}  ${pad(`${p.first_name} ${p.last_name}`, 22)}  ${pad(contact, 42)}  ${row.model_interest ?? ""}`);
  }

  if (!apply) {
    console.log("\nDry run — nothing sent. Add --apply to push these into DealerTide.");
    return;
  }

  let created = 0, duplicate = 0, failed = 0;
  for (const row of todo) {
    const r = await pushLeadToDealertide(replayPayload(row));
    const label = r.ok ? (r.status === 202 ? "already in DealerTide" : "created") : `FAILED ${r.detail}`;
    if (!r.ok) failed++;
    else if (r.status === 202) duplicate++;
    else created++;
    console.log(`  ${r.ok ? " ok " : "FAIL"}  ${row.id}  ${pad(row.full_name, 22)}  ${label}`);
    await new Promise((res) => setTimeout(res, 300));
  }
  console.log(`\nDone: ${created} created, ${duplicate} already in DealerTide, ${failed} failed.`);
  if (failed) process.exit(1);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
