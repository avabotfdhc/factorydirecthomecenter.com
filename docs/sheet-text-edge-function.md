# `sheet-text` — reading Champion sales sheets as text (parked)

Supabase edge function on the wired project (`mvetqzhjszlullttfkwa`). Version 1
(2026-10-16) fetched a sales sheet from the public `floor-plans` bucket, ran
`unpdf` over it and returned the text of every page as JSON. It exists because
neither the agent sandbox (every outbound host answers 403) nor `pg_net` from SQL
(its `content` column is text, so a PDF body is cut off at the first NUL) can
carry PDF bytes — but both can carry JSON. Version 2 is a 410 stub.

It was run once, over the 42 Aspire singles whose CMS `name` is the bare model
code, to find out whether Champion gives them a family name. **It does not**: all
41 sheets with a text layer carry a title block of model code, box size, bed and
bath count and "LITERATURE PLAN", nothing else (the one remaining sheet,
`1432H11214`, is an image-only PDF). See AGENTS.md, "Code-named singles stay
code-named".

## Running it again

Redeploy v1 with `verify_jwt: true` (the anon key is the bearer), then call it
from SQL so the answer lands in `net._http_response`:

```sql
select net.http_get(
  'https://mvetqzhjszlullttfkwa.supabase.co/functions/v1/sheet-text?paths=aspire/1676H32107/plans/112AP-1676H32107-SALES.pdf',
  '{}'::jsonb,
  '{"Authorization":"Bearer <anon key>"}'::jsonb,
  120000);
-- then: select content from net._http_response where id = <request id>;
```

`paths` takes up to 12 comma-separated bucket paths; only
`<series>/<MODEL>/plans/<file>.pdf` is accepted. Pages are capped at 6,000
characters each.

## Version 1 source

```ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { extractText, getDocumentProxy } from "npm:unpdf";

const SAFE = /^[a-z]+\/[A-Za-z0-9]+\/plans\/[A-Za-z0-9._-]+\.pdf$/;

async function readSheet(path: string) {
  if (!SAFE.test(path)) return { path, error: "path not allowed" };
  const src = `${Deno.env.get("SUPABASE_URL")}/storage/v1/object/public/floor-plans/${path}`;
  const r = await fetch(src);
  if (!r.ok) return { path, error: `storage ${r.status}` };
  const bytes = new Uint8Array(await r.arrayBuffer());
  const pdf = await getDocumentProxy(bytes);
  const { totalPages, text } = await extractText(pdf, { mergePages: false });
  return { path, totalPages, pages: (text as string[]).map((t) => t.slice(0, 6000)) };
}

Deno.serve(async (req: Request) => {
  const url = new URL(req.url);
  const paths = (url.searchParams.get("paths") || url.searchParams.get("path") || "")
    .split(",").map((s) => s.trim()).filter(Boolean).slice(0, 12);
  if (!paths.length) {
    return new Response(JSON.stringify({ error: "give ?path= or ?paths=a,b" }), {
      status: 400, headers: { "Content-Type": "application/json" },
    });
  }
  const out = [];
  for (const p of paths) {
    try { out.push(await readSheet(p)); } catch (e) { out.push({ path: p, error: String(e) }); }
  }
  return new Response(JSON.stringify(out), {
    headers: { "Content-Type": "application/json", "Connection": "keep-alive" },
  });
});
```
