"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { submitLead } from "@/app/actions/leads";
import { trackLeadFormStart, trackLeadFormSubmit } from "@/lib/analytics";

// Instant line-item quote request. Opened from the floor-plan cards ("Get
// Pricing" replaces the old "Call for pricing" label) and the mobile action
// bar. Posts through the submitLead server action, which writes the lead to
// Supabase and fans it out to email/CRM (src/app/actions/leads.ts).

interface Props {
  isOpen: boolean;
  onClose: () => void;
  modelName: string;
  series?: string;
}

// Stored (English) values; labels are translated for display.
const TIMEFRAMES = [
  { value: "Immediately", key: "now" },
  { value: "1–3 months", key: "short" },
  { value: "3–6 months", key: "mid" },
  { value: "Just researching", key: "research" },
] as const;

export default function PriceQuoteModal({ isOpen, onClose, modelName, series = "Champion" }: Props) {
  const t = useTranslations("quote");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [started, setStarted] = useState(false);
  const [contact, setContact] = useState("");
  const firstFieldRef = useRef<HTMLInputElement>(null);

  const close = useCallback(() => onClose(), [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    firstFieldRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, close]);

  if (!isOpen) return null;

  const onFirstInput = () => {
    if (!started) {
      setStarted(true);
      trackLeadFormStart("instant_quote");
    }
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = (data.get("name")?.toString() || "").trim();
    const contactValue = (data.get("contact")?.toString() || "").trim();
    const county = (data.get("county")?.toString() || "").trim();
    const timeframe = data.get("timeframe")?.toString() || TIMEFRAMES[1].value;

    const looksLikeContact = /@/.test(contactValue) || contactValue.replace(/\D/g, "").length >= 10;
    if (!name || !county || !looksLikeContact) {
      setError(t("error"));
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setError("");
    const res = await submitLead({
      name,
      contact: contactValue,
      county,
      timeframe,
      modelName,
      series,
      sourcePage: window.location.pathname,
    });
    if (res.success) {
      setContact(contactValue);
      const isEmail = /@/.test(contactValue);
      trackLeadFormSubmit("instant_quote", {
        name,
        email: isEmail ? contactValue : "",
        phone: isEmail ? "" : contactValue,
        interest: modelName,
      });
      setStatus("done");
    } else {
      setError(res.error || t("error"));
      setStatus("error");
    }
  }

  const inputCls =
    "w-full px-3.5 py-2.5 bg-[var(--color-cream-dark)] border border-[var(--color-charcoal)]/10 rounded-lg text-[var(--color-charcoal)] focus:outline-none focus:border-[var(--color-teal)] focus:ring-2 focus:ring-[var(--color-teal)]/30";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={t("title", { model: modelName })}
    >
      <div className="absolute inset-0 bg-[var(--color-charcoal)]/60 backdrop-blur-sm" onClick={close} />
      <div className="relative w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-4 bg-[var(--color-teal)] text-white p-5 sm:rounded-t-2xl">
          <div>
            <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold tracking-[0.2em] uppercase">
              {t("badge")}
            </span>
            <h2 className="font-serif text-xl font-light leading-snug mt-2">
              {t("title", { model: modelName })}
            </h2>
          </div>
          <button type="button" onClick={close} aria-label={t("close")} className="flex-none -mr-1 -mt-1 p-1 text-white/80 hover:text-white">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {status === "done" ? (
          <div className="p-8 text-center">
            <div className="w-14 h-14 bg-[var(--color-lime)] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-serif text-2xl font-semibold mb-2">{t("successTitle")}</h3>
            <p className="text-[var(--color-gray)] mb-4">
              {t("successBody", { model: modelName, contact })}
            </p>
            <button
              type="button"
              onClick={close}
              className="w-full px-6 py-3 bg-[var(--color-cream-dark)] text-[var(--color-charcoal)] font-semibold rounded-lg hover:bg-[var(--color-charcoal)]/10 transition-colors"
            >
              {t("continue")}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4" onFocus={onFirstInput}>
            <p className="text-sm text-[var(--color-gray)]">{t("intro")}</p>
            <label className="block">
              <span className="block text-sm font-semibold text-[var(--color-charcoal)] mb-1.5">{t("name")} <span className="text-red-500">*</span></span>
              <input ref={firstFieldRef} name="name" type="text" required autoComplete="name" placeholder="Jane Smith" className={inputCls} />
            </label>
            <label className="block">
              <span className="block text-sm font-semibold text-[var(--color-charcoal)] mb-1.5">{t("contact")} <span className="text-red-500">*</span></span>
              <input name="contact" type="text" required autoComplete="tel" inputMode="email" placeholder="(260) 000-0000 or you@email.com" className={inputCls} />
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="block text-sm font-semibold text-[var(--color-charcoal)] mb-1.5">{t("county")} <span className="text-red-500">*</span></span>
                <input name="county" type="text" required placeholder="DeKalb County, IN" className={inputCls} />
              </label>
              <label className="block">
                <span className="block text-sm font-semibold text-[var(--color-charcoal)] mb-1.5">{t("timeframe")}</span>
                <select name="timeframe" defaultValue={TIMEFRAMES[1].value} className={inputCls}>
                  {TIMEFRAMES.map((tf) => (
                    <option key={tf.value} value={tf.value}>{t(`timeframes.${tf.key}`)}</option>
                  ))}
                </select>
              </label>
            </div>

            {status === "error" && error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full px-6 py-3.5 bg-[var(--color-lime)] text-white font-bold tracking-wide rounded-lg hover:bg-[var(--color-lime-dark)] hover:text-white transition-colors disabled:opacity-60"
            >
              {status === "submitting" ? t("submitting") : t("submit")}
            </button>

            {/* TCPA consent — required wording, do not paraphrase. */}
            <p className="text-[11px] leading-relaxed text-[var(--color-gray)]">
              {t("tcpa")}{" "}
              <Link href="/privacy" className="underline hover:text-[var(--color-teal)]">{t("privacy")}</Link>.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
