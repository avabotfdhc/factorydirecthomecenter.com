"use client";

import { useState } from "react";
import { StructuredData } from "@/lib/seo";

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title: string;
  subtitle?: string;
  faqs: FAQ[];
  showSchema?: boolean;
}

export function FAQSection({ title, subtitle, faqs, showSchema = true }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <section className="py-20 lg:py-28 bg-[var(--color-cream-dark)]" aria-labelledby="faq-heading">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <header className="text-center mb-14">
            <h2 id="faq-heading" className="text-2xl lg:text-3xl font-bold tracking-tight uppercase mb-3">
              {title}
            </h2>
            <div className="w-16 h-1 bg-[var(--color-lime)] mx-auto" />
            {subtitle && (
              <p className="text-base text-[var(--color-gray)] mt-4 max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </header>

          <div className="space-y-4" role="list">
            {faqs.map((faq, idx) => (
              <details
                key={idx}
                className="bg-white rounded-lg border border-[var(--color-charcoal)]/5 overflow-hidden group"
                open={openIndex === idx}
                onToggle={(e) => {
                  setOpenIndex(e.currentTarget.open ? idx : null);
                }}
                role="listitem"
              >
                <summary
                  className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-[var(--color-cream)] transition-colors"
                  aria-expanded={openIndex === idx}
                >
                  <span className="font-semibold text-[var(--color-charcoal)] pr-8">
                    {faq.question}
                  </span>
                  <span
                    className="text-[var(--color-teal)] text-xl transition-transform duration-300"
                    aria-hidden="true"
                    style={{
                      transform: openIndex === idx ? "rotate(45deg)" : "rotate(0)",
                    }}
                  >
                    +
                  </span>
                </summary>
                <div className="px-6 pb-6 text-[var(--color-gray)] leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {showSchema && (
        <StructuredData
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          }}
        />
      )}
    </>
  );
}

// Pre-built FAQ sets for common pages
// FAQ data lives in a plain module so server components can import it too.
// Re-exported here for backward compatibility with existing client imports.
export { commonFAQs } from "@/lib/faqs";
