import { generateMetadata as genMeta, StructuredData } from "@/lib/seo";
import { businessRef } from "@/lib/business";
import ContactForm from "./ContactForm";

export const metadata = genMeta({
  title: "Contact Us | Auburn, IN",
  description: "Contact Factory Direct Homes Center in Auburn, Indiana. Visit our showroom, call (260) 308-1457, or send a message. We're here to help with your manufactured home questions.",
  url: "/contact-us",
});

export default function ContactPage() {
  return (
    <>
      {/* The page a buyer lands on to get in touch carried no structured data
          at all. ContactPage tells Google (and an answer engine asked "how do
          I contact Factory Direct Homes Center?") that this is the contact
          endpoint, and `mainEntity` points at the one canonical business node
          rather than restating the address as a second entity. */}
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contact Factory Direct Homes Center",
          url: "https://factorydirecthomescenter.com/contact-us",
          description:
            "Contact Factory Direct Homes Center in Auburn, Indiana — showroom address, phone, and enquiry form.",
          // A reference, not a copy. Spreading the full `businessJsonLd()`
          // here published the identity node a second time on this page, and
          // Semrush counts its markup error once per node (2026-10-09 crawl).
          // `businessRef()` carries the canonical @id and an address, so
          // Google merges it with the node the root layout already published.
          mainEntity: businessRef(),
        }}
      />      <ContactForm />
    </>
  );
}
