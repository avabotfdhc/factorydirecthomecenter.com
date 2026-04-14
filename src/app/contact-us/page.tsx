import { generateMetadata as genMeta } from "@/lib/seo";
import ContactForm from "./ContactForm";

export const metadata = genMeta({
  title: "Contact Us | Auburn, IN",
  description: "Contact Factory Direct Homes Center in Auburn, Indiana. Visit our showroom, call (260) 308-1457, or send a message. We're here to help with your manufactured home questions.",
  url: "/contact",
});

export default function ContactPage() {
  return <ContactForm />;
}
