"use client";

import { useTranslations } from "next-intl";

// Homepage hero eyebrow + H1, translated on the client (see src/i18n).
export function HeroCopy() {
  const t = useTranslations("hero");
  return (
    <>
      <p className="text-xs sm:text-sm font-bold tracking-wider uppercase text-[var(--color-lime-light)] mb-2">
        {t("eyebrow")}
      </p>
      <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl font-light text-white leading-tight">
        {t("title")}
      </h1>
    </>
  );
}
