import Link from "next/link";
import { generateMetadata as genMeta } from "@/lib/seo";
import { CityLocationTemplate, type CityLocationData } from "../CityLocationTemplate";

export const metadata = genMeta({
  title: "Manufactured & Modular Homes in Churubusco, IN",
  description:
    "Champion manufactured and modular homes delivered to Churubusco, Indiana and the Whitley/Allen County line. Factory-direct pricing from our nearby Auburn showroom.",
  keywords: [
    "manufactured homes churubusco indiana",
    "modular homes churubusco in",
    "mobile homes churubusco",
    "champion homes churubusco",
  ],
  url: "/locations/churubusco",
});

const data: CityLocationData = {
  city: "Churubusco",
  county: "Whitley County",
  slug: "churubusco",
  heroImage: "/images/paramount/lincoln-exterior.webp",
  distanceMi: 22,
  driveMin: 30,
  lat: 41.2306,
  lng: -85.3197,
  tagline:
    "Champion manufactured & modular homes delivered to Churubusco — factory-direct from our Auburn showroom just up the road, with local delivery and contractor referrals for setup.",
  intro: [
    "Churubusco — \"Turtle Town USA\" — sits right between Auburn and Fort Wayne, only about 22 miles from our showroom. Its small-town charm and quick access to Fort Wayne make it a great spot for a new home, and factory-direct pricing keeps that home affordable.",
    "We deliver Champion single wides, double wides, and modular homes throughout the Churubusco area and the surrounding Whitley and Allen County countryside. With both our showroom and the Champion factory nearby, this is one of our shortest, lowest-cost delivery zones.",
    <>
      Browse our <Link href="/floor-plans" className="text-[var(--color-teal)] underline">floor plans</Link>, review{" "}
      <Link href="/financing" className="text-[var(--color-teal)] underline">financing</Link>, or{" "}
      <Link href="/contact-us" className="text-[var(--color-teal)] underline">contact us</Link> for a factory-direct
      quote near Churubusco.
    </>,
  ],
  nearby: [
    { name: "Columbia City", href: "/locations/columbia-city" },
    { name: "Huntertown", href: "/locations/huntertown" },
    { name: "Fort Wayne", href: "/locations/fort-wayne" },
    { name: "Auburn", href: "/locations/auburn" },
    { name: "Whitley County", href: "/locations/whitley-county" },
  ],
  faqs: [
    {
      question: "Do you deliver manufactured homes to Churubusco, Indiana?",
      answer:
        "Yes. Churubusco is only about 22 miles from our Auburn showroom — one of our closest delivery areas — so freight costs are low and delivery is fast. We arrange delivery to private land and approved lots, and you hire your own contractors for setup and installation — ask us for our referral list of licensed and insured crews past customers have used.",
    },
    {
      question: "Can I place a manufactured home on land near Churubusco?",
      answer:
        "In much of the rural Whitley and northern Allen County area around Churubusco, yes. You or your contractor verify the specific zoning, setback, and utility requirements for your parcel and pull permits so your home is installed to code — we can point you to the right county offices.",
    },
    {
      question: "How far is Churubusco from your showroom?",
      answer:
        "About a 30-minute drive. Our Auburn showroom at 1211 State Road 8 is easy to reach from Churubusco, so you can tour model homes in person before you buy.",
    },
    {
      question: "What kinds of homes can I buy near Churubusco?",
      answer:
        "We carry Champion single wides, double wides, and IRC-code modular homes in a range of sizes and layouts, from efficient starter homes to larger family plans. We'll help you match a home to your land and budget.",
    },
  ],
};

export default function ChurubuscoLocationPage() {
  return <CityLocationTemplate data={data} />;
}
