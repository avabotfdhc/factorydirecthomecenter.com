"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore } from "react";
import { NextIntlClientProvider } from "next-intl";
import en from "../../messages/en.json";
import es from "../../messages/es.json";
import my from "../../messages/my.json";
import { DEFAULT_LOCALE, LOCALE_COOKIE, LOCALE_QUERY, isLocale, type Locale } from "./config";

// Client-side locale for the UI chrome (header, hero, cards, quote modal,
// mobile bar, search). Every page keeps rendering in English on the server so
// nothing loses static prerendering; the visitor's choice is applied after
// hydration from a ?lang= query parameter or the NEXT_LOCALE cookie, and the
// switcher persists it in the cookie. English is the SEO-facing content.
//
// The locale is an external store (query string + cookie) read through
// useSyncExternalStore: the server snapshot is always English, the client
// snapshot is the visitor's choice, and React reconciles the two on hydration.

const MESSAGES: Record<Locale, typeof en> = { en, es, my };

const listeners = new Set<() => void>();
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function readLocale(): Locale {
  try {
    const fromQuery = new URLSearchParams(window.location.search).get(LOCALE_QUERY);
    if (isLocale(fromQuery)) return fromQuery;
    const m = document.cookie.match(new RegExp(`(?:^|; )${LOCALE_COOKIE}=([^;]+)`));
    const v = m ? decodeURIComponent(m[1]) : "";
    return isLocale(v) ? v : DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
}

function writeLocale(l: Locale) {
  try {
    document.cookie = `${LOCALE_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`;
  } catch {
    /* storage blocked */
  }
  // Drop a ?lang= override from the URL so the cookie is the single source.
  try {
    const url = new URL(window.location.href);
    if (url.searchParams.has(LOCALE_QUERY)) {
      url.searchParams.delete(LOCALE_QUERY);
      window.history.replaceState(window.history.state, "", url.toString());
    }
  } catch {
    /* ignore */
  }
  listeners.forEach((cb) => cb());
}

const getServerSnapshot = (): Locale => DEFAULT_LOCALE;

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue>({ locale: DEFAULT_LOCALE, setLocale: () => {} });

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore(subscribe, readLocale, getServerSnapshot);

  // Persist a ?lang= arrival in the cookie and mirror the locale on <html>.
  useEffect(() => {
    document.documentElement.lang = locale;
    try {
      const fromQuery = new URLSearchParams(window.location.search).get(LOCALE_QUERY);
      if (isLocale(fromQuery)) writeLocale(fromQuery);
    } catch {
      /* ignore */
    }
  }, [locale]);

  const setLocale = useCallback((l: Locale) => writeLocale(l), []);
  const ctx = useMemo(() => ({ locale, setLocale }), [locale, setLocale]);

  return (
    <LocaleContext.Provider value={ctx}>
      <NextIntlClientProvider locale={locale} messages={MESSAGES[locale]} timeZone="America/Indiana/Indianapolis">
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
