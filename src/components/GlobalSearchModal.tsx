"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

// Site-wide command palette. Opens from the header search button or ⌘K / Ctrl+K,
// queries /api/search (debounced 250 ms), groups results by category, and is
// fully keyboard-driven: ↑/↓ to move, Enter to open, Escape to close.

interface Result {
  id: string;
  title: string;
  category: string;
  url: string;
  content: string;
}

const CATEGORY_ORDER = ["Floor Plan", "Guide & Resource", "Brochure"];

export function GlobalSearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTranslations("search");
  const router = useRouter();
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset and focus on open; lock page scroll while open.
  useEffect(() => {
    if (!open) return;
    setQ("");
    setResults([]);
    setActive(0);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => inputRef.current?.focus(), 20);
    return () => {
      document.body.style.overflow = prev;
      clearTimeout(t);
    };
  }, [open]);

  // Debounced fetch.
  useEffect(() => {
    if (!open) return;
    const term = q.trim();
    if (term.length < 2) {
      setResults([]);
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`, { signal: controller.signal });
        const json = (await res.json()) as { results?: Result[] };
        setResults(json.results || []);
        setActive(0);
      } catch {
        /* aborted */
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [q, open]);

  const grouped = useMemo(() => {
    const byCat = new Map<string, Result[]>();
    for (const r of results) byCat.set(r.category, [...(byCat.get(r.category) || []), r]);
    const cats = [...byCat.keys()].sort(
      (a, b) => (CATEGORY_ORDER.indexOf(a) + 1 || 99) - (CATEGORY_ORDER.indexOf(b) + 1 || 99),
    );
    return cats.map((c) => ({ category: c, items: byCat.get(c) || [] }));
  }, [results]);
  const flat = useMemo(() => grouped.flatMap((g) => g.items), [grouped]);

  const go = useCallback(
    (r: Result) => {
      onClose();
      if (/^https?:\/\//.test(r.url)) window.open(r.url, "_blank", "noopener,noreferrer");
      else router.push(r.url);
    },
    [onClose, router],
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, Math.max(flat.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && flat[active]) {
      e.preventDefault();
      go(flat[active]);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-start justify-center p-4 pt-[10vh] sm:pt-[15vh]"
      role="dialog"
      aria-modal="true"
      aria-label={t("title")}
      onKeyDown={onKeyDown}
    >
      <div className="absolute inset-0 bg-[var(--color-charcoal)]/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[var(--color-charcoal)]/10 overflow-hidden">
        <div className="flex items-center gap-3 px-4 border-b border-[var(--color-charcoal)]/10">
          <svg className="w-5 h-5 text-[var(--color-gray)] flex-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
          </svg>
          <input
            ref={inputRef}
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("placeholder")}
            aria-label={t("title")}
            autoComplete="off"
            className="flex-1 py-4 bg-transparent text-base text-[var(--color-charcoal)] focus:outline-none"
          />
          <kbd className="hidden sm:inline-block text-[10px] font-semibold text-[var(--color-gray)] border border-[var(--color-charcoal)]/15 rounded px-1.5 py-0.5">
            ESC
          </kbd>
        </div>

        <div className="max-h-[60vh] overflow-y-auto" role="listbox" aria-label={t("results")}>
          {q.trim().length < 2 ? (
            <p className="p-5 text-sm text-[var(--color-gray)]">{t("hint")}</p>
          ) : loading && results.length === 0 ? (
            <p className="p-5 text-sm text-[var(--color-gray)]">{t("searching")}</p>
          ) : flat.length === 0 ? (
            <p className="p-5 text-sm text-[var(--color-gray)]">{t("empty")}</p>
          ) : (
            grouped.map((g) => (
              <div key={g.category}>
                <p className="px-5 pt-4 pb-1 text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--color-gray)]">
                  {g.category}
                </p>
                <ul>
                  {g.items.map((r) => {
                    const idx = flat.indexOf(r);
                    const isActive = idx === active;
                    return (
                      <li key={`${r.category}-${r.id}`} role="option" aria-selected={isActive}>
                        <button
                          type="button"
                          onMouseEnter={() => setActive(idx)}
                          onClick={() => go(r)}
                          className={`w-full text-left px-5 py-3 flex items-start justify-between gap-4 transition-colors ${
                            isActive ? "bg-[var(--color-teal)]/10" : "hover:bg-[var(--color-cream)]"
                          }`}
                        >
                          <span className="min-w-0">
                            <span className="block font-semibold text-[var(--color-charcoal)] truncate">{r.title}</span>
                            {r.content && (
                              <span className="block text-xs text-[var(--color-gray)] line-clamp-1 mt-0.5">{r.content}</span>
                            )}
                          </span>
                          <span className="flex-none text-[10px] font-bold tracking-wider uppercase text-[var(--color-teal)] mt-1">
                            {r.category}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          )}
        </div>

        <div className="px-5 py-2.5 border-t border-[var(--color-charcoal)]/10 text-[11px] text-[var(--color-gray)] flex gap-4">
          <span>↑↓ {t("navigate")}</span>
          <span>↵ {t("open")}</span>
          <span>esc {t("close")}</span>
        </div>
      </div>
    </div>
  );
}

/** Registers ⌘K / Ctrl+K to open the palette; returns open state + controls. */
export function useGlobalSearch() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return { open, openSearch: () => setOpen(true), closeSearch: () => setOpen(false) };
}
