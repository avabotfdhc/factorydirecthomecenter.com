import Link from "next/link";
import { generateMetadata as genMeta } from "@/lib/seo";
import { CityLocationTemplate, type CityLocationData } from "../CityLocationTemplate";

export const metadata = genMeta({
  title: "Manufactured & Modular Homes in New Haven, IN",
  description:
    "Champion manufactured and modular homes delivered to New Haven and eastern Allen County, Indiana. Factory-direct pricing from our nearby Auburn showroom — single wides, double wides & modular homes.",
  keywords: [
    "manufactured homes new haven indiana",
    "modular homes new haven in",
    "mobile homes allen county",
    "manufactured homes east fort wayne",
    "champion homes new haven",
  ],
  url: "/locations/new-haven",
});

const data: CityLocationData = {
  city: "New Haven",
  county: "Allen County",
  slug: "new-haven",
  distanceMi: 28,
  driveMin: 35,
  lat: 41.07,
  lng: -85.0147,
  tagline:
    "Champion manufactured & modular homes delivered to New Haven and eastern Allen County — factory-direct from our Auburn showroom with local delivery and contractor referrals for setup.",
  intro: [
    "New Haven sits just east of Fort Wayne in Allen County, and it's an easy drive from our Auburn showroom. For families who want to stay close to the Fort Wayne area but stretch their budget further, a factory-direct Champion home is a smart alternative to the rising cost of site-built houses.",
    "We deliver Champion single wides, double wides, and modular homes throughout New Haven and the surrounding communities of Woodburn, Monroeville, and greater Allen County. Because we buy directly from the Champion factory, you get transparent line-item pricing without the dealer markup.",
    <>
      See our <Link href="/floor-plans" className="text-[var(--color-teal)] underline">floor plans</Link>, explore{" "}
      <Link href="/financing" className="text-[var(--color-teal)] underline">financing options</Link>, or{" "}
      <Link href="/contact-us" className="text-[var(--color-teal)] underline">contact us</Link> for a
      factory-direct quote for your New Haven or Allen County property.
    </>,
  ],
  nearby: [
    { name: "Fort Wayne", href: "/locations/fort-wayne" },
    { name: "Auburn", href: "/locations/auburn" },
    { name: "Woodburn" },
    { name: "Monroeville" },
    { name: "Harlan" },
    { name: "Grabill" },
  ],
  faqs: [
    {
      question: "Do you deliver manufactured homes to New Haven, Indiana?",
      answer:
        "Yes. New Haven and eastern Allen County are within easy reach of our Auburn showroom. We arrange delivery to private land or approved lots throughout the area, and you hire your own contractors for setup and installation — ask us for our referral list of licensed and insured crews past customers have used.",
    },
    {
      question: "Can I put a manufactured home on land near New Haven?",
      answer:
        "In many parts of Allen County, yes — though placement rules near Fort Wayne and New Haven vary by zoning district. You or your contractor should verify the requirements for your specific parcel and pull permits so your home is installed to code — we can point you to the right county offices.",
    },
    {
      question: "How is buying factory-direct different near Fort Wayne?",
      answer:
        "Instead of paying a traditional dealer markup, you buy directly from the factory through us. That means line-item pricing — you see exactly what you're paying for the home and delivery, and you hire your own contractor for setup — and shorter delivery times because the Champion factory is close by.",
    },
    {
      question: "What homes can I buy near New Haven?",
      answer:
        "We carry Champion single wides, double wides, and IRC-code modular homes in a range of sizes and layouts. Modular homes on permanent foundations are a popular option for buyers who want site-built quality at factory-direct pricing.",
    },
  ],
};

export default function NewHavenLocationPage() {
  return <CityLocationTemplate data={data} />;
}
