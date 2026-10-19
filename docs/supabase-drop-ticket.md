# Supabase support ticket: every DROP times out on `mvetqzhjszlullttfkwa`

**Status:** not yet submitted. Kyle submits it — `supabase.com` and
`api.supabase.com` are both refused by the agent sandbox's network policy
(403 to CONNECT), and the Supabase MCP has no support-ticket tool, so an agent
session cannot file this.

**Where to submit:** https://supabase.com/dashboard/support/new
(signed in as the org owner). Severity: the project is healthy and serving
traffic, so this is not an outage — but no schema object can be removed, which
blocks ordinary maintenance. Paste the body below.

**Re-verify before sending.** This was last reproduced **2026-10-19**. If it has
since cleared, don't send it. The check is in "How to reproduce" below; it costs
one 60-second timeout and leaves nothing behind (it rolls back, and the probe
table count was 0 afterwards each time).

---

## Subject

Every DROP statement times out at 60s on project mvetqzhjszlullttfkwa (CREATE and ALTER are instant)

## Body

**Project ref:** `mvetqzhjszlullttfkwa` ("supabase-purple-queen")
**Org:** `cyvioiymhvhmpnkyekir` (Factory Direct Homes Center), Pro plan
**Region:** us-east-1
**Postgres:** 17.6.1.063 (engine 17, GA channel)
**Project status:** ACTIVE_HEALTHY — the app is serving normally
**First seen:** 2026-10-11. **Still reproducing:** 2026-10-19.

### Summary

Every `DROP` statement on this project hangs and times out at 60 seconds.
`CREATE` and `ALTER` of the same object types return in milliseconds. This is
not specific to one object or one client.

### How to reproduce

Run this in the dashboard SQL editor. It creates a throwaway table and drops it
inside a transaction that rolls back, so nothing persists either way:

```sql
begin;
create table public._drop_probe(id int);
drop table public._drop_probe;
rollback;
```

The `create` returns immediately. The `drop` never returns and the statement
times out. The same happens for `DROP POLICY` on an existing table.

### What we have already ruled out

These were each measured on the live project, not assumed:

1. **Not client-specific.** It reproduces identically in the dashboard SQL
   editor and through a separate API client. Two independent clients, same
   failure.
2. **Not specific to policies.** First seen on `DROP POLICY`, but a `DROP TABLE`
   on a table created seconds earlier — no rows, no dependencies, no other
   session touching it — fails the same way. So it is not a dependency scan and
   not contention on a busy table.
3. **Not lock contention.** `ACCESS EXCLUSIVE` on the target table was acquired
   in **6 ms**. `pg_stat_activity` showed no long-running statements and no
   `idle in transaction` backends. There are only ~8 client backends total.
4. **Not a full async-notification queue** (the usual cause of a blocking
   `NOTIFY`): `pg_notification_queue_usage()` returns **0**.

### The one lead we have, which we could not confirm

`DROP` is the only command class that fires `sql_drop` event triggers, and this
project has two enabled, both owned by `supabase_admin`:

| event | trigger | function |
|---|---|---|
| `sql_drop` | `pgrst_drop_watch` | `extensions.pgrst_drop_watch` |
| `sql_drop` | `issue_graphql_placeholder` | `extensions.set_graphql_placeholder` |

`CREATE` and `ALTER` fire only `ddl_command_end` triggers, which work fine. That
asymmetry matches the symptom exactly.

But reading the two function bodies does not support it: both are ordinary
catalog work, and `pgrst_drop_watch`'s `object_type` filter list does not
include `policy`, so a `DROP POLICY` never reaches its `NOTIFY` — yet
`DROP POLICY` hangs too. So we are not claiming this is the cause.

We did **not** disable those triggers to test, because `pgrst_drop_watch` is
PostgREST's schema-reload watcher on a live project and that seemed like
something to ask you about rather than do.

### One other observation, probably unrelated

A PostgREST backend has been sitting `idle` holding `LISTEN "pgrst"` for
**46+ days** (`application_name = postgrest`, `wait_event = ClientRead`).
The notification queue is empty, so we don't think it is blocking anything —
noting it only in case it is a symptom of the same underlying thing.

### Questions

1. What is blocking `DROP` here, and can you clear it?
2. Is it safe for us to disable `pgrst_drop_watch` and
   `issue_graphql_placeholder` temporarily to confirm the cause, or would that
   leave PostgREST serving a stale schema cache?

### Impact

Not an outage — the site is up and the database is serving reads and writes
normally. But nothing can be removed: no column, no stale table, no view, no
policy. We have been working around it with `ALTER` (narrowing policies in place
rather than dropping and recreating them), which reaches the same end state but
leaves redundant objects behind that we cannot clean up.

---

## Context for us, not for the ticket

- The workaround is recorded in `AGENTS.md` under "Supabase security
  2026-10-10/11" and in the header of
  `supabase/migrations/20261010_tighten_leads_rls_and_storage.sql`: use
  `ALTER POLICY`, never `DROP POLICY`.
- The concrete thing waiting on this: `public.leads` carries two SELECT and two
  UPDATE policies with identical admin expressions (the `Admins may…` pair and
  the narrowed `Allow authenticated staff…` pair). Harmless, because permissive
  policies are ORed and both say the same thing, but they cannot be collapsed to
  one pair until `DROP POLICY` works.
- Do not let a reply that simply restates the workaround close this. The
  question is why `DROP` blocks, not how to avoid it.
