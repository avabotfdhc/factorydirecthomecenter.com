import { generateMetadata as genMeta } from "@/lib/seo";
import { H2 } from "@/components/Heading";

// NOTE: Legal content — Kyle/Ken should have counsel review before/at launch.
// The original site had no Terms page; this is built from the site's prior draft
// with standard home-dealer clauses added (no-offer, changes, privacy reference).

export const metadata = genMeta({
  title: "Terms of Use",
  description:
    "Terms and conditions for using the Factory Direct Homes Center website.",
  url: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <section className="relative pt-32 pb-12 lg:pt-40 lg:pb-16 bg-[var(--color-charcoal)] grain-overlay text-white">
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8">
          <h1 className="font-serif text-4xl lg:text-5xl font-light tracking-tight">
            Terms of <span className="italic text-[var(--color-teal-light)]">Use</span>
          </h1>
          <p className="mt-4 text-sm text-white/50">Last updated: July 6, 2026</p>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 prose prose-lg prose-gray">
          <H2 className="font-serif text-2xl font-light mb-4">Agreement to Terms</H2>
          <p className="text-[var(--color-gray)] mb-8 leading-relaxed">
            By accessing and using the Factory Direct Homes Center website (factorydirecthomescenter.com), you agree to be
            bound by these Terms of Use and by our{" "}
            <a href="/privacy" className="text-[var(--color-teal)] underline">Privacy Policy</a>, which is incorporated by
            reference. If you do not agree to these terms, please do not use our website.
          </p>

          <H2 className="font-serif text-2xl font-light mb-4">Use of Website</H2>
          <p className="text-[var(--color-gray)] mb-4 leading-relaxed">
            This website is provided for informational purposes to help you explore manufactured and modular home options.
            You agree to use the website only for lawful purposes and in a manner that does not infringe upon or restrict
            anyone else&rsquo;s use of the website.
          </p>
          <p className="text-[var(--color-gray)] mb-8 leading-relaxed">
            You may not use this website to transmit harmful, threatening, or unlawful material, or to interfere with the
            website&rsquo;s operation.
          </p>

          <H2 className="font-serif text-2xl font-light mb-4">Pricing and Availability</H2>
          <p className="text-[var(--color-gray)] mb-8 leading-relaxed">
            All prices, floor plans, specifications, and availability shown on this website are subject to change without
            notice. Prices displayed are base prices and do not include delivery, setup, site work, permits, utility
            connections, or other costs associated with home placement. Final pricing is determined at the time of purchase
            and will be provided in a written purchase agreement. Images and renderings are for illustration purposes and
            may not represent exact features, colors, or options of the home as delivered.
          </p>

          <H2 className="font-serif text-2xl font-light mb-4">No Offer; Purchases Governed by Written Agreement</H2>
          <p className="text-[var(--color-gray)] mb-8 leading-relaxed">
            Nothing on this website constitutes a binding offer to sell, a price quote, or a contract. Home descriptions,
            pricing, promotions, and availability are provided for general information only. Any purchase of a home is
            governed solely by a separate written purchase agreement signed by you and Factory Direct Homes Center LLC, and
            the terms of that agreement will control in the event of any conflict with information on this website.
          </p>

          <H2 className="font-serif text-2xl font-light mb-4">Intellectual Property</H2>
          <p className="text-[var(--color-gray)] mb-8 leading-relaxed">
            All content on this website &mdash; including text, images, floor plan diagrams, renderings, logos, and design
            &mdash; is the property of Factory Direct Homes Center LLC or its licensors (including Champion Homes) and is
            protected by copyright and trademark laws. You may not reproduce, distribute, or create derivative works from our
            content without written permission.
          </p>

          <H2 className="font-serif text-2xl font-light mb-4">Third-Party Links</H2>
          <p className="text-[var(--color-gray)] mb-8 leading-relaxed">
            Our website may contain links to third-party websites, including financing partners, Champion Homes, and
            government resources. These links are provided for your convenience. We do not endorse or assume responsibility
            for the content, privacy policies, or practices of third-party websites.
          </p>

          <H2 className="font-serif text-2xl font-light mb-4">Disclaimer of Warranties</H2>
          <p className="text-[var(--color-gray)] mb-8 leading-relaxed">
            This website and its content are provided &ldquo;as is&rdquo; without warranties of any kind, either express or
            implied. Factory Direct Homes Center does not warrant that the website will be uninterrupted, error-free, or free
            of viruses or other harmful components. We make every effort to ensure accuracy but do not guarantee that all
            information is current or complete.
          </p>

          <H2 className="font-serif text-2xl font-light mb-4">Limitation of Liability</H2>
          <p className="text-[var(--color-gray)] mb-8 leading-relaxed">
            Factory Direct Homes Center LLC shall not be liable for any direct, indirect, incidental, consequential, or
            punitive damages arising from your use of or inability to use this website, or from any information obtained
            through the website.
          </p>

          <H2 className="font-serif text-2xl font-light mb-4">Changes to These Terms</H2>
          <p className="text-[var(--color-gray)] mb-8 leading-relaxed">
            We may update these Terms of Use from time to time. When we do, we will revise the &ldquo;Last updated&rdquo;
            date above and post the updated terms on this page. Your continued use of the website after changes are posted
            constitutes your acceptance of the updated terms.
          </p>

          <H2 className="font-serif text-2xl font-light mb-4">Governing Law</H2>
          <p className="text-[var(--color-gray)] mb-8 leading-relaxed">
            These terms are governed by the laws of the State of Indiana. Any disputes arising from these terms or your use
            of the website shall be resolved in the courts of DeKalb County, Indiana.
          </p>

          <H2 className="font-serif text-2xl font-light mb-4">Contact Us</H2>
          <p className="text-[var(--color-gray)] leading-relaxed">
            If you have questions about these terms, contact us at:<br /><br />
            Factory Direct Homes Center LLC<br />
            1211 State Road 8, Auburn, Indiana 46706<br />
            Phone: <a href="tel:+12603081457" className="text-[var(--color-teal)] underline">(260) 308-1457</a><br />
            Email: <a href="mailto:info@factorydirecthomescenter.com" className="text-[var(--color-teal)] underline">info@factorydirecthomescenter.com</a>
          </p>
        </div>
      </section>
    </>
  );
}
