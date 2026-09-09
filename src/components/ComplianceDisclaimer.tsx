import Link from "next/link";

// Regulation Z (Truth in Lending) and HUD-code disclosures.
//
// The payment calculator publishes an interest rate and a monthly figure, which
// is a "triggering term" under Regulation Z (12 CFR 1026.24): it must be
// accompanied by the terms of repayment and the APR, and must not be read as an
// offer of credit from a dealer who is not the lender. The HUD line makes clear
// which building code the homes are built to and that on-site work is outside
// the factory's certification.

export function RegZDisclaimer({ className = "" }: { className?: string }) {
  return (
    <p className={`text-[11px] leading-relaxed text-[var(--color-gray)] ${className}`}>
      <strong>Financing disclosure.</strong> Payment figures are estimates for illustration only, based on
      the price, down payment, annual percentage rate (APR) and term you entered, and assume a fixed-rate,
      fully amortizing loan with equal monthly payments. They exclude taxes, insurance, site work, delivery,
      set-up and any lender fees. Factory Direct Homes Center LLC is not a lender and does not offer,
      arrange or approve credit; financing is provided by independent lenders, subject to their credit
      approval, and your actual rate, APR, term and payment may differ. This is not a commitment to lend.
      Ask your lender for a Truth in Lending disclosure before you sign.
    </p>
  );
}

export function HudDisclaimer({ className = "" }: { className?: string }) {
  return (
    <p className={`text-[11px] leading-relaxed text-[var(--color-gray)] ${className}`}>
      <strong>HUD notice.</strong> Manufactured homes are built to the U.S. Department of Housing and Urban
      Development (HUD) Manufactured Home Construction and Safety Standards (24 CFR 3280) and carry a HUD
      certification label; modular homes are built to the state-adopted residential building code (IRC).
      Floor plans, renderings, dimensions, square footage and standard features are Champion Home Builders&rsquo;
      published specifications, are approximate, and may change without notice. Site work, foundations,
      utilities and installation are performed by independent contractors under local permits and are not
      part of the factory&rsquo;s certification. See our{" "}
      <Link href="/terms" className="underline underline-offset-2 hover:text-[var(--color-charcoal)]">
        terms
      </Link>{" "}
      for full details.
    </p>
  );
}

export function ComplianceDisclaimers({ className = "" }: { className?: string }) {
  return (
    <div className={`space-y-3 ${className}`}>
      <RegZDisclaimer />
      <HudDisclaimer />
    </div>
  );
}
