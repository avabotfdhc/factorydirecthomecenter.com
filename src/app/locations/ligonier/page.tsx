import Link from "next/link";
import { generateMetadata as genMeta } from "@/lib/seo";
import { CityLocationTemplate, type CityLocationData } from "../CityLocationTemplate";

export const metadata = genMeta({
  title: "Manufactured Homes in Ligonier, IN",
  description:
    "Champion manufactured and modular homes delivered to Ligonier and western Noble County, Indiana. Factory-direct pricing from our Auburn showroom — great for rural and country properties.",
  keywords: [
    "manufactured homes ligonier indiana",
    "modular homes ligonier in",
    "mobile homes noble county",
    "champion homes ligonier",
  ],
  url: "/locations/ligonier",
});

const data: CityLocationData = {
  city: "Ligonier",
  county: "Noble County",
  slug: "ligonier",
  heroImage: "/images/paramount/odyssey-exterior-b.webp",
  distanceMi: 32,
  driveMin: 42,
  lat: 41.467,
  lng: -85.5875,
  tagline:
    "Champion manufactured & modular homes delivered to Ligonier and western Noble County — factory-direct from our Auburn showroom, built for country living.",
  intro: [
    "Ligonier sits in the heart of northern Indiana's Amish country, where wide-open rural land makes it a natural fit for a factory-built home on acreage. From our Auburn showroom, we deliver Champion homes throughout the Ligonier area with the short lead times that come from being close to the factory.",
    "We offer single wides, double wides, and IRC-code modular homes to suit country lots, family farms, and in-town parcels. Noble County's zoning-friendly rules make placing a manufactured or modular home on your own land more straightforward here than in many areas.",
    <>
      Explore our <Link href="/floor-plans" className="text-[var(--color-teal)] underline">floor plans</Link>, learn about{" "}
      <Link href="/financing" className="text-[var(--color-teal)] underline">financing</Link>, or{" "}
      <Link href="/contact-us" className="text-[var(--color-teal)] underline">contact us</Link> for a factory-direct
      quote for your Ligonier or Noble County property.
    </>,
  ],
  nearby: [
    { name: "Noble County", href: "/locations/noble-county" },
    { name: "Kendallville", href: "/locations/kendallville" },
    { name: "Auburn", href: "/locations/auburn" },
    { name: "Cromwell" },
    { name: "Millersburg" },
    { name: "Albion", href: "/locations/albion" },
  ],
  faqs: [
    {
      question: "Do you deliver manufactured homes to Ligonier, Indiana?",
      answer:
        "Yes. Ligonier and western Noble County are about 32 miles from our Auburn showroom. We arrange delivery to rural land, farms, or in-town lots throughout the area, and you hire your own contractors for setup and installation — ask us for our referral list of licensed and insured crews past customers have used.",
    },
    {
      question: "Is it easy to place a home on rural land near Ligonier?",
      answer:
        "Generally, yes. Noble County has zoning-friendly rules for manufactured and modular homes on private land, which makes rural Ligonier-area properties a good fit. You or your contractor verify the requirements for your specific parcel and pull the permits — we can point you to the right county offices.",
    },
    {
      question: "What homes work best for country properties?",
      answer:
        "For acreage and rural lots, many Ligonier-area buyers choose double wides or IRC-code modular homes on permanent foundations for the space and long-term value. We'll help you match a floor plan to your land and budget.",
    },
    {
      question: "How far is Ligonier from your showroom?",
      answer:
        "About a 40-minute drive. You're welcome to tour model homes at our Auburn showroom, then we'll deliver and set up your chosen home to your Noble County site.",
    },
  ],
};

export default function LigonierLocationPage() {
  return <CityLocationTemplate data={data} />;
}
