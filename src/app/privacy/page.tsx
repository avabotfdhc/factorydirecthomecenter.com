import { generateMetadata as genMeta } from "@/lib/seo";
import { H2 } from "@/components/Heading";

// NOTE: This Privacy Policy merges the company's original policy (from the CMS)
// with the newer site-specific disclosures (actual tracking tools, data fields).
// Legal content — Kyle/Ken should have counsel review before/at launch.

export const metadata = genMeta({
  title: "Privacy Policy",
  description:
    "Factory Direct Homes Center privacy policy. How we collect, use, share, and protect your personal information.",
  url: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <section className="relative pt-32 pb-12 lg:pt-40 lg:pb-16 bg-[var(--color-charcoal)] grain-overlay text-white">
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8">
          <h1 className="font-serif text-4xl lg:text-5xl font-light tracking-tight">
            Privacy <span className="italic text-[var(--color-teal-light)]">Policy</span>
          </h1>
          <p className="mt-4 text-sm text-white/50">Last updated: July 6, 2026</p>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 prose prose-lg prose-gray">
          <p className="text-[var(--color-gray)] mb-8 leading-relaxed">
            Factory Direct Homes Center LLC (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) respects your privacy
            and knows that you care about protecting your personal information. This Privacy Policy explains what information
            we collect when you use{" "}
            <a href="https://factorydirecthomescenter.com" className="text-[var(--color-teal)] underline">factorydirecthomescenter.com</a>{" "}
            (the &ldquo;Site,&rdquo; including all subdomains) and the services made available on it (the &ldquo;Services&rdquo;),
            and how we use and share that information. This policy applies to information we collect on the Site, through the
            Services, and in email, text, and other electronic correspondence. It does not apply to information collected
            offline or by any third party you reach through links on the Site.
          </p>
          <p className="text-[var(--color-gray)] mb-8 leading-relaxed text-sm bg-[var(--color-cream-dark)] p-4 rounded-lg">
            Please read this Privacy Policy carefully. By using this Site and the related Services, you agree to the terms of
            this Privacy Policy. If you do not agree, please do not access or use the Site or the Services. We may update this
            policy from time to time as our practices change; your continued use of the Site after changes are posted
            constitutes your acceptance of those changes.
          </p>

          <H2 className="font-serif text-2xl font-light mb-4">Information We Collect</H2>
          <p className="text-[var(--color-gray)] mb-4 leading-relaxed">
            When you contact us through our website, request a quote, or visit our showroom, we may collect personal
            information including your name, email address, phone number, mailing address, and details about your
            home-buying preferences such as budget, timeline, land status, and financing needs.
          </p>
          <p className="text-[var(--color-gray)] mb-4 leading-relaxed">
            We also automatically collect certain information when you visit our website, including your IP address, browser
            type, pages viewed, and time spent on our site. This information is collected through cookies and similar
            tracking technologies including Google Analytics, Google Tag Manager, Meta Pixel, and Microsoft Clarity.
          </p>
          <p className="text-[var(--color-gray)] mb-8 leading-relaxed">
            You are not required to provide personal information to browse the Site, but some Services (such as requesting a
            quote or financing assistance) cannot be provided without it.
          </p>

          <H2 className="font-serif text-2xl font-light mb-4">How We Use Your Information</H2>
          <p className="text-[var(--color-gray)] mb-4 leading-relaxed">We use the information we collect to:</p>
          <ul className="text-[var(--color-gray)] mb-8 space-y-2 list-disc pl-6">
            <li>Respond to your inquiries and provide information about our homes</li>
            <li>Connect you with financing partners at your request</li>
            <li>Schedule showroom visits and home deliveries</li>
            <li>Process and fulfill your requests, orders, and transactions</li>
            <li>Improve our website and user experience</li>
            <li>Send you relevant information about homes, pricing, and promotions (with your consent)</li>
            <li>Analyze website usage to improve our services</li>
            <li>Comply with our legal obligations and enforce our terms</li>
          </ul>

          <H2 className="font-serif text-2xl font-light mb-4">Cookies &amp; Tracking Technologies</H2>
          <p className="text-[var(--color-gray)] mb-4 leading-relaxed">
            We and our service providers use cookies, web beacons (also called pixel tags or clear GIFs), and similar
            technologies to operate the Site, remember your preferences, understand how the Site is used, and measure and
            improve our advertising. Cookies are small files stored on your device; web beacons are small graphics that let
            us count visitors and understand engagement.
          </p>
          <p className="text-[var(--color-gray)] mb-4 leading-relaxed">
            Our website uses the following analytics and advertising services:
          </p>
          <ul className="text-[var(--color-gray)] mb-4 space-y-2 list-disc pl-6">
            <li><strong>Google Analytics 4</strong> &mdash; tracks page views, user behavior, and conversion events</li>
            <li><strong>Google Tag Manager</strong> &mdash; manages tracking tags on our website</li>
            <li><strong>Meta (Facebook) Pixel</strong> &mdash; measures advertising effectiveness and delivers relevant ads</li>
            <li><strong>Microsoft Clarity</strong> &mdash; provides session recordings and heatmaps to improve usability</li>
          </ul>
          <p className="text-[var(--color-gray)] mb-4 leading-relaxed">
            You can opt out of Google Analytics by installing the{" "}
            <a href="https://tools.google.com/dlpage/gaoptout" className="text-[var(--color-teal)] underline" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out Browser Add-on</a>,
            and you can manage interest-based advertising through the{" "}
            <a href="https://optout.aboutads.info" className="text-[var(--color-teal)] underline" target="_blank" rel="noopener noreferrer">Digital Advertising Alliance</a>{" "}
            and your Google and Meta account settings. Most browsers also let you refuse or delete cookies; note that some
            parts of the Site may not function properly without them.
          </p>
          <p className="text-[var(--color-gray)] mb-8 leading-relaxed">
            Some browsers offer a &ldquo;Do Not Track&rdquo; (DNT) signal. Because there is no common industry standard for
            DNT, our Site does not currently respond differently to DNT signals.
          </p>

          <H2 className="font-serif text-2xl font-light mb-4">Information Sharing</H2>
          <p className="text-[var(--color-gray)] mb-4 leading-relaxed">
            We do not sell your personal information. We may share your information with financing partners (such as 21st
            Mortgage, Triad Financial, and Credit Human) only when you request financing assistance. We may also share
            information with service providers who assist us in operating our website and conducting our business, provided
            they agree to keep your information confidential and use it only for the services they perform for us.
          </p>
          <p className="text-[var(--color-gray)] mb-8 leading-relaxed">
            We may also disclose information when required by law, to enforce our agreements, to protect the rights, property,
            or safety of Factory Direct Homes Center, our customers, or others, or in connection with a business transfer
            such as a merger or sale of assets.
          </p>

          <H2 className="font-serif text-2xl font-light mb-4">User Contributions</H2>
          <p className="text-[var(--color-gray)] mb-8 leading-relaxed">
            If you post reviews, comments, or other content to public areas of the Site (&ldquo;User Contributions&rdquo;),
            you do so at your own risk. Although we take reasonable measures to protect the Site, we cannot guarantee that
            such information is fully secure, and we cannot control how other visitors or third parties may use content you
            make public. Please exercise caution before disclosing personal information in any public area.
          </p>

          <H2 className="font-serif text-2xl font-light mb-4">Third-Party Links &amp; Services</H2>
          <p className="text-[var(--color-gray)] mb-8 leading-relaxed">
            Our Site may contain links to third-party websites, including financing partners, Champion Homes, and government
            resources. This Privacy Policy does not apply to those sites, and we are not responsible for their content or
            privacy practices. We encourage you to review the privacy policy of any third-party site you visit.
          </p>

          <H2 className="font-serif text-2xl font-light mb-4">Data Security</H2>
          <p className="text-[var(--color-gray)] mb-8 leading-relaxed">
            We implement reasonable security measures to protect your personal information. Our website uses HTTPS encryption
            for all data transmission. However, no method of transmission over the Internet or electronic storage is 100%
            secure, and we cannot guarantee absolute security.
          </p>

          <H2 className="font-serif text-2xl font-light mb-4">Data Retention</H2>
          <p className="text-[var(--color-gray)] mb-8 leading-relaxed">
            We retain personal information for as long as necessary to fulfill the purposes described in this policy, to
            provide our Services, and to comply with our legal, tax, and accounting obligations, after which we take
            reasonable steps to delete or de-identify it.
          </p>

          <H2 className="font-serif text-2xl font-light mb-4">Children&rsquo;s Privacy</H2>
          <p className="text-[var(--color-gray)] mb-8 leading-relaxed">
            The Site and Services are intended for adults and are not directed to children under 16. We do not knowingly
            collect personal information from children. If you believe a child has provided us with personal information,
            please contact us and we will take steps to delete it.
          </p>

          <H2 className="font-serif text-2xl font-light mb-4">Your Rights &amp; Choices</H2>
          <p className="text-[var(--color-gray)] mb-4 leading-relaxed">
            You may request access to, correction of, or deletion of your personal information at any time by contacting us
            at <a href="mailto:info@factorydirecthomescenter.com" className="text-[var(--color-teal)] underline">info@factorydirecthomescenter.com</a>{" "}
            or by calling <a href="tel:+12603081457" className="text-[var(--color-teal)] underline">(260) 308-1457</a>. You may
            also opt out of marketing communications at any time by following the unsubscribe instructions in our emails or
            by contacting us directly.
          </p>
          <p className="text-[var(--color-gray)] mb-8 leading-relaxed">
            Depending on where you live, you may have additional rights under state privacy laws (for example, the California
            Consumer Privacy Act), including the right to know what personal information we collect, to request deletion, and
            to opt out of the &ldquo;sale&rdquo; or &ldquo;sharing&rdquo; of personal information. We do not sell your
            personal information, and we will not discriminate against you for exercising your privacy rights. To make a
            request, contact us using the details above.
          </p>

          <H2 className="font-serif text-2xl font-light mb-4">Changes to This Policy</H2>
          <p className="text-[var(--color-gray)] mb-8 leading-relaxed">
            We may update this Privacy Policy from time to time to reflect changes in our practices or for legal reasons. We
            will post the updated policy on this page and revise the &ldquo;Last updated&rdquo; date above. Please check back
            periodically. Your continued use of the Site after changes are posted constitutes your acceptance of the updated
            policy.
          </p>

          <H2 className="font-serif text-2xl font-light mb-4">Contact Us</H2>
          <p className="text-[var(--color-gray)] leading-relaxed">
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
