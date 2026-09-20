import { generateMetadata as genMeta, StructuredData } from "@/lib/seo";
import { businessJsonLd } from "@/lib/business";
import ContactForm from "./ContactForm";

export const metadata = genMeta({
  title: "Contact Us | Auburn, IN",
  description: "Contact Factory Direct Homes Center in Auburn, Indiana. Visit our showroom, call (260) 308-1457, or send a message. We're here to help with your manufactured home questions.",
  url: "/contact-us",
});

export default function ContactPage() {
  // Nested nodes must not repeat @context — the enclosing document already
  // declares it, and a second one is redundant at best.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { "@context": _ctx, ...business } = businessJsonLd();
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
          mainEntity: business,
        }}
      />      <ContactForm />
    </>
  );
}
