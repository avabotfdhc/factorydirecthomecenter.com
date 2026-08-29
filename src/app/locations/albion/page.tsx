import Link from "next/link";
import { generateMetadata as genMeta } from "@/lib/seo";
import { CityLocationTemplate, type CityLocationData } from "../CityLocationTemplate";

export const metadata = genMeta({
  title: "Manufactured Homes in Albion, IN",
  description:
    "Champion manufactured and modular homes delivered to Albion and Noble County, Indiana. Factory-direct pricing from our Auburn showroom — ideal for lake and rural properties near Chain O'Lakes.",
  keywords: [
    "manufactured homes albion indiana",
    "modular homes albion in",
    "mobile homes noble county",
    "champion homes albion",
  ],
  url: "/locations/albion",
});

const data: CityLocationData = {
  city: "Albion",
  county: "Noble County",
  slug: "albion",
  heroImage: "/images/paramount/alberta-exterior.webp",
  distanceMi: 25,
  driveMin: 32,
  lat: 41.3945,
  lng: -85.4247,
  tagline:
    "Champion manufactured & modular homes delivered to Albion and central Noble County — factory-direct from our Auburn showroom, great for lake and rural lots.",
  intro: [
    "Albion, the seat of Noble County, sits near Chain O'Lakes State Park in a scenic, lake-dotted part of northeast Indiana. It's about 25 miles from our Auburn showroom, and the surrounding rural and lake properties make it a great area for a factory-built home.",
    "We deliver Champion single wides, double wides, and IRC-code modular homes throughout Albion and central Noble County. With zoning-friendly rules for private land and our factory-direct pricing, you get a quality new home without the site-built price tag.",
    <>
      Browse our <Link href="/floor-plans" className="text-[var(--color-teal)] underline">floor plans</Link>, review{" "}
      <Link href="/financing" className="text-[var(--color-teal)] underline">financing</Link>, or{" "}
      <Link href="/contact-us" className="text-[var(--color-teal)] underline">contact us</Link> for a factory-direct
      quote for your Albion or Noble County property.
    </>,
  ],
  nearby: [
    { name: "Noble County", href: "/locations/noble-county" },
    { name: "Kendallville", href: "/locations/kendallville" },
    { name: "Auburn", href: "/locations/auburn" },
    { name: "Avilla" },
    { name: "Rome City" },
    { name: "Ligonier", href: "/locations/ligonier" },
  ],
  faqs: [
    {
      question: "Do you deliver manufactured homes to Albion, Indiana?",
      answer:
        "Yes. Albion and central Noble County are about 25 miles from our Auburn showroom, so it's a close, low-cost delivery area. We arrange delivery to rural land, lake lots, and in-town parcels, and you hire your own contractors for setup and installation — ask us for our referral list of licensed and insured crews past customers have used.",
    },
    {
      question: "Can I put a home on a lake or rural lot near Albion?",
      answer:
        "Often, yes — though lake-area lots near Chain O'Lakes can have specific setback and septic requirements. You or your contractor verify Noble County zoning and permitting for your parcel before installation — we can point you to the right county offices.",
    },
    {
      question: "Is Noble County friendly to manufactured homes?",
      answer:
        "Yes. Noble County — including the Albion, Kendallville, and Ligonier areas — generally has zoning-friendly rules for manufactured and modular homes on private land, which makes placing a home here more straightforward than in many areas.",
    },
    {
      question: "What's the closest showroom to Albion?",
      answer:
        "Our Auburn showroom at 1211 State Road 8 is about a 32-minute drive from Albion. Tour model homes in person, then we deliver and set up your chosen home to your Noble County site.",
    },
  ],
};

export default function AlbionLocationPage() {
  return <CityLocationTemplate data={data} />;
}
