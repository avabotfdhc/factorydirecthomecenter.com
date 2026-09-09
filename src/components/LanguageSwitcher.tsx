"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "@/i18n/LocaleProvider";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/i18n/config";

// English / Español / မြန်မာ picker for the header. Fort Wayne's Burmese
// community is one of the largest in the country, so Burmese sits alongside
// Spanish.
export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useLocale();
  const t = useTranslations("header");
  return (
    <label className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className="sr-only">{t("language")}</span>
      <svg className="w-4 h-4 text-[var(--color-gray)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18zm0 0c2.5-2.5 3.5-5.5 3.5-9S14.5 5.5 12 3m0 18c-2.5-2.5-3.5-5.5-3.5-9S9.5 5.5 12 3M3.5 9h17M3.5 15h17" />
      </svg>
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as Locale)}
        aria-label={t("language")}
        className="bg-transparent text-xs font-semibold text-[var(--color-charcoal)] py-2 pr-1 min-h-11 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-teal)] rounded"
      >
        {LOCALES.map((l) => (
          <option key={l} value={l}>
            {LOCALE_LABELS[l].native}
          </option>
        ))}
      </select>
    </label>
  );
}
