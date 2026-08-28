import Link from "next/link";
import { generateMetadata as genMeta } from "@/lib/seo";
import { CityLocationTemplate, type CityLocationData } from "../CityLocationTemplate";

export const metadata = genMeta({
  title: "Manufactured & Modular Homes in Huntertown, IN",
  description:
    "Champion manufactured and modular homes delivered to Huntertown and northern Allen County, Indiana. Factory-direct pricing from our nearby Auburn showroom — single wides, double wides & modular homes.",
  keywords: [
    "manufactured homes huntertown indiana",
    "modular homes huntertown in",
    "mobile homes northern allen county",
    "manufactured homes north fort wayne",
    "champion homes huntertown",
  ],
  url: "/locations/huntertown",
});

const data: CityLocationData = {
  city: "Huntertown",
  county: "Allen County",
  slug: "huntertown",
  heroImage: "/images/paramount/timberlake-exterior.webp",
  distanceMi: 18,
  driveMin: 25,
  lat: 41.2314,
  lng: -85.1719,
  tagline:
    "Champion manufactured & modular homes delivered to Huntertown and northern Allen County — factory-direct from our Auburn showroom just up the road.",
  intro: [
    "Huntertown is one of the fastest-growing communities north of Fort Wayne, and it's only about 18 miles from our Auburn showroom. For buyers who want new construction in the Carroll school area or on nearby rural land without a site-built price tag, a factory-direct Champion home is an excellent option.",
    "We deliver Champion single wides, double wides, and IRC-code modular homes throughout Huntertown, Leo-Cedarville, and northern Allen County. Modular homes on permanent foundations are especially popular here for buyers who want site-built quality with factory precision and pricing.",
    <>
      Browse our <Link href="/floor-plans" className="text-[var(--color-teal)] underline">floor plans</Link>, review{" "}
      <Link href="/financing" className="text-[var(--color-teal)] underline">financing</Link>, or{" "}
      <Link href="/contact-us" className="text-[var(--color-teal)] underline">contact us</Link> for a
      factory-direct quote for your Huntertown-area property.
    </>,
  ],
  nearby: [
    { name: "Fort Wayne", href: "/locations/fort-wayne" },
    { name: "Auburn", href: "/locations/auburn" },
    { name: "Leo-Cedarville" },
    { name: "Carroll area" },
    { name: "Churubusco" },
    { name: "Whitley County", href: "/locations/whitley-county" },
  ],
  faqs: [
    {
      question: "Do you deliver manufactured homes to Huntertown, Indiana?",
      answer:
        "Yes. Huntertown and northern Allen County are only about 18 miles from our Auburn showroom, making it one of our closest and lowest-cost delivery areas. We arrange delivery to private land and approved lots, and you hire your own contractors for setup and installation — ask us for our referral list of licensed and insured crews past customers have used.",
    },
    {
      question: "Can I place a modular home on land near Huntertown?",
      answer:
        "In many parts of northern Allen County, yes — modular homes on permanent foundations are treated much like site-built homes. Placement rules vary by zoning district, so you or your contractor should verify the requirements for your parcel and pull permits before installation — we can point you to the right county offices.",
    },
    {
      question: "Why buy factory-direct near Huntertown?",
      answer:
        "You skip the traditional dealer markup and buy directly from the factory through us, with transparent line-item pricing. With the Champion factory and our showroom both nearby, Huntertown buyers also get some of the shortest delivery times in the region.",
    },
    {
      question: "What homes can I buy near Huntertown?",
      answer:
        "We carry Champion single wides, double wides, and modular homes from efficient layouts up to spacious 3–4 bedroom family homes. We'll help you match a floor plan to your land, budget, and timeline.",
    },
  ],
};

export default function HuntertownLocationPage() {
  return <CityLocationTemplate data={data} />;
}
