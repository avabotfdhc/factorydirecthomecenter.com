import Link from "next/link";

interface CTABlockProps {
  text: string;
  href: string;
  label: string;
  variant?: "primary" | "secondary";
}

export function CTABlock({ text, href, label, variant = "primary" }: CTABlockProps) {
  const isPrimary = variant === "primary";

  return (
    <div className={`rounded-lg p-8 text-center ${isPrimary ? "bg-[var(--color-teal)] text-white" : "bg-[var(--color-cream-dark)] border border-[var(--color-charcoal)]/10"}`}>
      <p className={`text-lg mb-4 ${isPrimary ? "text-white/90" : "text-[var(--color-charcoal)]"}`}>
        {text}
      </p>
      <Link
        href={href}
        className={`inline-flex items-center gap-2 px-8 py-3 text-sm font-bold tracking-widest uppercase rounded transition-colors duration-300 ${
          isPrimary
            ? "bg-white text-[var(--color-teal)] hover:bg-[var(--color-cream)]"
            : "btn-primary bg-[var(--color-teal)] text-white hover:bg-[var(--color-teal-dark)]"
        }`}
      >
        {label}
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" focusable="false">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </Link>
    </div>
  );
}
