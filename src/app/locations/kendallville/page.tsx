import Link from "next/link";
import { generateMetadata as genMeta } from "@/lib/seo";
import { CityLocationTemplate, type CityLocationData } from "../CityLocationTemplate";

export const metadata = genMeta({
  title: "Manufactured & Modular Homes in Kendallville, IN",
  description:
    "Champion manufactured and modular homes delivered to Kendallville and Noble County, Indiana. Factory-direct pricing from our Auburn showroom — single wides, double wides & modular homes with zoning-friendly rural placement.",
  keywords: [
    "manufactured homes kendallville indiana",
    "modular homes kendallville in",
    "mobile homes noble county",
    "manufactured homes noble county indiana",
    "champion homes kendallville",
  ],
  url: "/locations/kendallville",
});

const data: CityLocationData = {
  city: "Kendallville",
  county: "Noble County",
  slug: "kendallville",
  heroImage: "/images/paramount/summit-exterior.webp",
  distanceMi: 20,
  driveMin: 25,
  lat: 41.4414,
  lng: -85.2655,
  tagline:
    "Champion manufactured & modular homes delivered to Kendallville and Noble County — factory-direct from our Auburn showroom about 20 miles east.",
  intro: [
    "Kendallville is the largest city in Noble County and just a 20-mile drive west from our Auburn showroom. Noble County is known for zoning-friendly, rural placement rules, which makes it one of the easier areas in northeast Indiana to put a manufactured or modular home on your own land.",
    "We deliver Champion single wides, double wides, and modular homes throughout the Kendallville area. You hire your own licensed contractors for setup and site work — most buyers save money that way — and we'll share a referral list of licensed and insured contractors past customers have used.",
    <>
      Browse our <Link href="/floor-plans" className="text-[var(--color-teal)] underline">floor plans</Link>, learn about{" "}
      <Link href="/financing" className="text-[var(--color-teal)] underline">financing</Link>, or{" "}
      <Link href="/contact-us" className="text-[var(--color-teal)] underline">contact us</Link> for a
      factory-direct quote for your Kendallville or Noble County property.
    </>,
  ],
  nearby: [
    { name: "Noble County", href: "/locations/noble-county" },
    { name: "Auburn", href: "/locations/auburn" },
    { name: "Garrett", href: "/locations/garrett" },
    { name: "Avilla" },
    { name: "Rome City" },
    { name: "Albion" },
    { name: "Ligonier" },
  ],
  faqs: [
    {
      question: "Do you deliver manufactured homes to Kendallville, Indiana?",
      answer:
        "Yes. Kendallville and Noble County are about 20 miles west of our Auburn showroom, so it's a close, low-cost delivery area. We arrange delivery to private land, rural acreage, or in-town lots, and you hire your own contractors for setup — ask us for our referral list of licensed and insured crews past customers have used.",
    },
    {
      question: "Is it easy to place a manufactured home on land in Noble County?",
      answer:
        "Noble County — including areas around Kendallville, Albion, and Ligonier — generally has zoning-friendly rules for manufactured and modular homes on private land. You or your contractor verify the specific requirements for your parcel and pull permits before installation — we can point you to the right county offices.",
    },
    {
      question: "What's the closest showroom to Kendallville?",
      answer:
        "Our Auburn showroom at 1211 State Road 8 is only about a 25-minute drive from Kendallville. You can walk through model homes in person, then we deliver and set up your chosen home to your Noble County site.",
    },
    {
      question: "What homes can I buy near Kendallville?",
      answer:
        "We carry Champion single wides, double wides, and IRC-code modular homes — from efficient starter homes to larger 3–4 bedroom family layouts. Modular homes on permanent foundations are popular for rural Noble County properties.",
    },
  ],
};

export default function KendallvilleLocationPage() {
  return <CityLocationTemplate data={data} />;
}
