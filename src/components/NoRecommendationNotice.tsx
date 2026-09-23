import {
  CONTRACTOR_NO_RECOMMENDATION,
  LENDER_NO_RECOMMENDATION,
} from "@/lib/referrals";

// The notice that has to sit beside either list. Kyle, 2026-09-23: "We do not
// make decisions for anything not a lender or contractor — we provide
// information so the client can choose. No recommendations disclaimers are
// important and should be present every place that matters."
//
// A page that names the lender sheet or the contractor referral list renders
// this; tests/disclaimers.test.ts fails the build when one does not. The
// footer carries the one-line version sitewide, but a disclosure works where
// the claim is, not three screens below it.
//
// Contrast: /70 on cream is 8.25:1 and /75 on a dark surface is 5.71:1, both
// measured in a browser with the alpha composited. Do not swap in
// --color-gray or --color-gray-light; that is what failed WCAG AA before.

type Subject = "lenders" | "contractors" | "both";

const TEXT: Record<Subject, string[]> = {
  lenders: [LENDER_NO_RECOMMENDATION],
  contractors: [CONTRACTOR_NO_RECOMMENDATION],
  both: [LENDER_NO_RECOMMENDATION, CONTRACTOR_NO_RECOMMENDATION],
};

export function NoRecommendationNotice({
  subject = "both",
  tone = "light",
  className = "",
}: {
  subject?: Subject;
  tone?: "light" | "dark";
  className?: string;
}) {
  const colour =
    tone === "dark" ? "text-white/75" : "text-[var(--color-charcoal)]/70";

  return (
    <div className={`space-y-2 ${className}`} data-no-recommendation={subject}>
      {TEXT[subject].map((line) => (
        <p key={line} className={`text-xs leading-relaxed ${colour}`}>
          {line}
        </p>
      ))}
    </div>
  );
}
