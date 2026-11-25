import type { ReactNode } from "react";
import { H2 } from "@/components/Heading";

// The homepage's section header: a letter-spaced eyebrow, a serif H2 and an
// optional lede, with an optional link set to the right on wide screens.
// It replaced the uppercase-bold-title-plus-green-bar pattern (2026-11
// elegant redesign). The H2 still comes from <H2>, so each section keeps the
// id slugged from its title text and every existing #anchor still resolves.
// The eyebrow is a <p>, not a heading: it adds no level to the outline.
export function SectionHeading({
  eyebrow,
  title,
  id,
  lede,
  aside,
  align = "left",
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  id?: string;
  lede?: ReactNode;
  aside?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  const centered = align === "center";
  return (
    <header
      className={`mb-10 lg:mb-14 flex flex-col gap-6 ${
        centered ? "items-center text-center" : "md:flex-row md:items-end md:justify-between"
      } ${className}`}
    >
      <div className="max-w-3xl">
        {eyebrow && <p className="lux-eyebrow">{eyebrow}</p>}
        <H2 id={id} className={`lux-title ${eyebrow ? "mt-4" : ""}`}>
          {title}
        </H2>
        {lede && <p className={`lux-lede mt-5 max-w-2xl ${centered ? "mx-auto" : ""}`}>{lede}</p>}
      </div>
      {aside && <div className="shrink-0">{aside}</div>}
    </header>
  );
}
