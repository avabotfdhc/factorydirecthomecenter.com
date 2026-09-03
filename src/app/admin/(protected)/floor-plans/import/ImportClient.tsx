"use client";

import { useState } from "react";
import { prepareImport, finalizeImport, type PlannedUpload } from "./actions";

interface PlanRef { slug: string; model_number: string }
interface LitRef { id: string; box_filename: string; title: string; category: string }

const MODEL_RE = /(\d{4}[HM]\d{2}[A-Z0-9]{3})/i;
const IMG_RE = /\.(jpe?g|png|webp|gif|avif)$/i;
const PDF_RE = /\.pdf$/i;

function norm(s: string): string { return s.toLowerCase().replace(/\s+/g, " ").trim(); }
function safeName(s: string): string { return s.replace(/[^a-z0-9._-]+/gi, "-").replace(/-+/g, "-"); }

function litCategory(name: string): string | null {
  const n = name.toLowerCase();
  if (/standard/.test(n)) return "standards";
  if (/exterior/.test(n)) return "exteriors";
  if (/\bcab|cabinet|island/.test(n)) return "cabinets";
  if (/perfect options|options brochure/.test(n)) return "options";
  if (/brochure/.test(n)) return "brochure";
  if (/fireplace|dormer|study desk|option/.test(n)) return "options";
  return null;
}

/** Pure classifier: decide what each dropped file is and where it goes. */
export function planFiles(files: File[], plans: PlanRef[], lit: LitRef[]) {
  const byModel = new Map(plans.map((p) => [p.model_number.toUpperCase(), p.slug]));
  const litByName = new Map(lit.map((l) => [norm(l.box_filename), l]));
  const planned: (PlannedUpload & { file: File })[] = [];
  const skipped: string[] = [];
  const unmatched: string[] = [];

  for (const f of files) {
    const name = f.name;
    const m = name.match(MODEL_RE);
    if (m) {
      const slug = byModel.get(m[1].toUpperCase());
      if (!slug) { unmatched.push(`${name} (model ${m[1]} not in catalog)`); continue; }
      if (PDF_RE.test(name) && /sales/i.test(name)) {
        planned.push({ file: f, name, role: "brochure", slug, path: `${slug}/sales-${m[1].toLowerCase()}.pdf` });
      } else if (IMG_RE.test(name)) {
        planned.push({ file: f, name, role: "gallery", slug, path: `${slug}/gallery-${safeName(name)}` });
      } else {
        skipped.push(`${name} (CB/PB/other variant — only SALES sheets + photos are loaded)`);
      }
      continue;
    }
    // No model number → literature
    const known = litByName.get(norm(name));
    const cat = known?.category ?? litCategory(name);
    if (!cat) { unmatched.push(name); continue; }
    planned.push({
      file: f, name, role: "literature", path: `literature/${safeName(name)}`,
      litId: known?.id, litTitle: known ? undefined : name.replace(/\.[^.]+$/, ""), litCategory: cat,
    });
  }
  return { planned, skipped, unmatched };
}

export default function ImportClient({ plans, lit }: { plans: PlanRef[]; lit: LitRef[] }) {
  const [files, setFiles] = useState<File[]>([]);
  const [log, setLog] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<{ ok: number; failed: string[] } | null>(null);

  const preview = files.length ? planFiles(files, plans, lit) : null;

  async function run() {
    if (!preview) return;
    setBusy(true); setDone(null); setLog([]);
    const items = preview.planned;
    const strip = ({ file: _f, ...rest }: (typeof items)[number]): PlannedUpload => { void _f; return rest; };
    try {
      setLog((l) => [...l, `Requesting ${items.length} upload URLs…`]);
      const urls = await prepareImport(items.map(strip));
      let n = 0;
      const uploaded: PlannedUpload[] = [];
      const failed: string[] = [];
      // Upload directly to Supabase Storage, a few at a time.
      const queue = [...items];
      const worker = async () => {
        while (queue.length) {
          const it = queue.shift()!;
          try {
            const r = await fetch(urls[it.path], {
              method: "PUT",
              headers: { "Content-Type": it.file.type || "application/octet-stream", "x-upsert": "true" },
              body: it.file,
            });
            if (!r.ok) throw new Error(`${r.status}`);
            uploaded.push(strip(it));
          } catch (e) {
            failed.push(`${it.name}: upload ${e instanceof Error ? e.message : e}`);
          }
          n++;
          if (n % 10 === 0 || queue.length === 0) setLog((l) => [...l, `Uploaded ${n}/${items.length}`]);
        }
      };
      await Promise.all([worker(), worker(), worker(), worker()]);
      setLog((l) => [...l, `Recording ${uploaded.length} files in the CMS…`]);
      const res = await finalizeImport(uploaded);
      setDone({ ok: res.ok, failed: [...failed, ...res.failed] });
    } catch (e) {
      setDone({ ok: 0, failed: [e instanceof Error ? e.message : String(e)] });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="bg-white rounded-xl border border-black/10 p-6 space-y-3">
        <p className="text-sm text-black/70">
          Select your downloaded Box <strong>“2026 Aspire”</strong> folder (the whole tree). Files are matched
          automatically: each <code>…SALES.pdf</code> attaches to its model by model number, photos go to that
          model’s gallery, and standards/brochures/options/exteriors/cabinets file into the literature library.
          Files upload straight from your browser to storage.
        </p>
        <input
          type="file"
          multiple
          // @ts-expect-error — non-standard but universally supported directory picker
          webkitdirectory=""
          disabled={busy}
          onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
          className="text-sm"
        />
      </div>

      {preview && (
        <div className="bg-white rounded-xl border border-black/10 p-6 space-y-3 text-sm">
          <div className="grid grid-cols-3 gap-3">
            <Stat label="Will load" value={preview.planned.length} tone="ok" />
            <Stat label="Skipped variants" value={preview.skipped.length} tone="muted" />
            <Stat label="Unmatched" value={preview.unmatched.length} tone={preview.unmatched.length ? "warn" : "muted"} />
          </div>
          <details><summary className="cursor-pointer text-black/60">What will load</summary>
            <ul className="mt-2 max-h-48 overflow-auto text-xs font-mono">
              {preview.planned.map((p) => <li key={p.path}>{p.role}: {p.name} → {p.path}</li>)}
            </ul>
          </details>
          {preview.unmatched.length > 0 && (
            <details><summary className="cursor-pointer text-amber-700">Unmatched files (not loaded)</summary>
              <ul className="mt-2 max-h-40 overflow-auto text-xs font-mono">{preview.unmatched.map((u) => <li key={u}>{u}</li>)}</ul>
            </details>
          )}
          <button
            onClick={run}
            disabled={busy || preview.planned.length === 0}
            className="px-5 py-2 rounded-lg bg-[var(--color-teal)] text-white font-medium disabled:opacity-50"
          >
            {busy ? "Importing…" : `Import ${preview.planned.length} files`}
          </button>
        </div>
      )}

      {(log.length > 0 || done) && (
        <div className="bg-white rounded-xl border border-black/10 p-6 text-sm space-y-2">
          {log.map((l, i) => <div key={i} className="text-black/60">{l}</div>)}
          {done && (
            <div className={done.failed.length ? "text-amber-800" : "text-emerald-800"}>
              <strong>Done — {done.ok} recorded.</strong>
              {done.failed.length > 0 && (
                <ul className="mt-1 text-xs font-mono list-disc pl-5">{done.failed.map((f) => <li key={f}>{f}</li>)}</ul>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone: "ok" | "warn" | "muted" }) {
  const cls = tone === "ok" ? "bg-emerald-50 text-emerald-900" : tone === "warn" ? "bg-amber-50 text-amber-900" : "bg-black/[0.03] text-black/60";
  return <div className={`rounded-lg p-3 ${cls}`}><div className="text-xs">{label}</div><div className="text-xl font-semibold">{value}</div></div>;
}
