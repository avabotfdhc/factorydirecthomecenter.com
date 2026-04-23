import { generateMetadata as genMeta } from "@/lib/seo";
import { H2 } from "@/components/Heading";

export const metadata = genMeta({
  title: "Privacy Policy",
  description:
    "Factory Direct Homes Center privacy policy. How we collect, use, and protect your personal information.",
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
          <p className="mt-4 text-sm text-white/50">
            Last updated: April 2026
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 prose prose-lg prose-gray">
          <H2 className="font-serif text-2xl font-light mb-4">Information We Collect</H2>
          <p className="text-[var(--color-gray)] mb-4 leading-relaxed">
            When you contact us through our website, request a quote, or visit our showroom, we may collect personal information including your name, email address, phone number, mailing address, and details about your home-buying preferences such as budget, timeline, land status, and financing needs.
          </p>
          <p className="text-[var(--color-gray)] mb-8 leading-relaxed">
            We also automatically collect certain information when you visit our website, including your IP address, browser type, pages viewed, and time spent on our site. This information is collected through cookies and similar tracking technologies including Google Analytics, Google Tag Manager, Meta Pixel, and Microsoft Clarity.
          </p>

          <H2 className="font-serif text-2xl font-light mb-4">How We Use Your Information</H2>
          <p className="text-[var(--color-gray)] mb-4 leading-relaxed">
            We use the information we collect to:
          </p>
          <ul className="text-[var(--color-gray)] mb-8 space-y-2 list-disc pl-6">
            <li>Respond to your inquiries and provide information about our homes</li>
            <li>Connect you with financing partners at your request</li>
            <li>Schedule showroom visits and home deliveries</li>
            <li>Improve our website and user experience</li>
            <li>Send you relevant information about homes, pricing, and promotions (with your consent)</li>
            <li>Analyze website usage to improve our services</li>
          </ul>

          <H2 className="font-serif text-2xl font-light mb-4">Analytics and Tracking</H2>
          <p className="text-[var(--color-gray)] mb-4 leading-relaxed">
            Our website uses the following analytics services:
          </p>
          <ul className="text-[var(--color-gray)] mb-8 space-y-2 list-disc pl-6">
            <li><strong>Google Analytics 4</strong> &mdash; tracks page views, user behavior, and conversion events</li>
            <li><strong>Google Tag Manager</strong> &mdash; manages tracking tags on our website</li>
            <li><strong>Meta (Facebook) Pixel</strong> &mdash; measures advertising effectiveness and delivers relevant ads</li>
            <li><strong>Microsoft Clarity</strong> &mdash; provides session recordings and heatmaps to improve usability</li>
          </ul>
          <p className="text-[var(--color-gray)] mb-8 leading-relaxed">
            You can opt out of Google Analytics by installing the{" "}
            <a href="https://tools.google.com/dlpage/gaoptout" className="text-[var(--color-teal)] underline" target="_blank" rel="noopener noreferrer">
              Google Analytics Opt-out Browser Add-on
            </a>. You can manage your ad preferences through your Facebook and Google account settings.
          </p>

          <H2 className="font-serif text-2xl font-light mb-4">Information Sharing</H2>
          <p className="text-[var(--color-gray)] mb-8 leading-relaxed">
            We do not sell your personal information. We may share your information with financing partners (such as 21st Mortgage, Triad Financial, and Credit Human) only when you request financing assistance. We may also share information with service providers who assist us in operating our website and conducting our business, provided they agree to keep your information confidential.
          </p>

          <H2 className="font-serif text-2xl font-light mb-4">Data Security</H2>
          <p className="text-[var(--color-gray)] mb-8 leading-relaxed">
            We implement reasonable security measures to protect your personal information. Our website uses HTTPS encryption for all data transmission. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
          </p>

          <H2 className="font-serif text-2xl font-light mb-4">Your Rights</H2>
          <p className="text-[var(--color-gray)] mb-8 leading-relaxed">
            You may request access to, correction of, or deletion of your personal information at any time by contacting us at{" "}
            <a href="mailto:info@factorydirecthomescenter.com" className="text-[var(--color-teal)] underline">info@factorydirecthomescenter.com</a>{" "}
            or by calling <a href="tel:+12603081457" className="text-[var(--color-teal)] underline">(260) 308-1457</a>.
          </p>

          <H2 className="font-serif text-2xl font-light mb-4">Contact Us</H2>
          <p className="text-[var(--color-gray)] leading-relaxed">
            Factory Direct Homes Center LLC<br />
            Auburn, Indiana 46706<br />
            Phone: <a href="tel:+12603081457" className="text-[var(--color-teal)] underline">(260) 308-1457</a><br />
            Email: <a href="mailto:info@factorydirecthomescenter.com" className="text-[var(--color-teal)] underline">info@factorydirecthomescenter.com</a>
          </p>
        </div>
      </section>
    </>
  );
}
