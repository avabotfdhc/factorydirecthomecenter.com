"use client";

import { useTranslations } from "next-intl";

// Homepage hero eyebrow + H1, translated on the client (see src/i18n).
// Styling lives in globals.css (.lux-eyebrow, .lux-hero-title): the 2026-11
// elegant redesign set the H1 large, in the serif, over the photograph.
export function HeroCopy() {
  const t = useTranslations("hero");
  return (
    <>
      <p className="lux-eyebrow">{t("eyebrow")}</p>
      <h1 className="lux-hero-title mt-5 text-white">{t("title")}</h1>
    </>
  );
}
