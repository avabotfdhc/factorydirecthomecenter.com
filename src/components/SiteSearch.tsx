"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// Site-wide search box backed by /api/search (floor plans, brochures, guides).

interface Result {
  id: string;
  title: string;
  category: string;
  url: string;
  content: string;
}

export function SiteSearch({ placeholder = "Search homes, series, model numbers, guides…" }: { placeholder?: string }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) {
      setResults([]);
      return;
    }
    const controller = new AbortController();
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`, { signal: controller.signal });
        const json = (await res.json()) as { results?: Result[] };
        setResults(json.results || []);
        setOpen(true);
      } catch {
        /* aborted or offline — keep the last results */
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [q]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const external = (url: string) => /^https?:\/\//.test(url);

  return (
    <div ref={boxRef} className="relative">
      <label htmlFor="site-search" className="sr-only">Search the site</label>
      <div className="flex items-center gap-2 bg-white border border-[var(--color-charcoal)]/15 rounded-lg px-4 min-h-12 focus-within:border-[var(--color-teal)] focus-within:ring-2 focus-within:ring-[var(--color-teal)]/30">
        <svg className="w-5 h-5 text-[var(--color-gray)] flex-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
        </svg>
        <input
          id="site-search"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => results.length && setOpen(true)}
          placeholder={placeholder}
          autoComplete="off"
          className="flex-1 py-3 bg-transparent text-sm text-[var(--color-charcoal)] focus:outline-none"
        />
        {loading && <span className="text-xs text-[var(--color-gray)]">Searching…</span>}
      </div>

      {open && q.trim().length >= 2 && (
        <div className="absolute left-0 right-0 top-full mt-2 z-30 bg-white rounded-xl shadow-2xl border border-[var(--color-charcoal)]/10 max-h-96 overflow-y-auto">
          {results.length === 0 && !loading ? (
            <p className="p-4 text-sm text-[var(--color-gray)]">
              No matches. Try a model number, series (Prime, Aspire, Paramount) or a topic like &ldquo;financing&rdquo;.
            </p>
          ) : (
            <ul role="listbox">
              {results.map((r) => (
                <li key={`${r.category}-${r.id}`}>
                  {external(r.url) ? (
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="block px-4 py-3 hover:bg-[var(--color-cream)]">
                      <ResultRow r={r} />
                    </a>
                  ) : (
                    <Link href={r.url} className="block px-4 py-3 hover:bg-[var(--color-cream)]" onClick={() => setOpen(false)}>
                      <ResultRow r={r} />
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function ResultRow({ r }: { r: Result }) {
  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <span className="font-semibold text-[var(--color-charcoal)]">{r.title}</span>
        <span className="text-[10px] font-bold tracking-wider uppercase text-[var(--color-teal)] whitespace-nowrap">{r.category}</span>
      </div>
      {r.content && <p className="text-xs text-[var(--color-gray)] line-clamp-2 mt-0.5">{r.content}</p>}
    </>
  );
}
