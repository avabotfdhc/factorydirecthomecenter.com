import Link from "next/link";
import { generateMetadata as genMeta } from "@/lib/seo";
import { CityLocationTemplate, type CityLocationData } from "../CityLocationTemplate";

export const metadata = genMeta({
  title: "Manufactured & Modular Homes in Angola, IN | Factory Direct Homes Center",
  description:
    "Champion manufactured and modular homes delivered to Angola and Steuben County, Indiana. Factory-direct pricing from our nearby Auburn showroom — single wides, double wides & modular homes for lake and rural lots.",
  keywords: [
    "manufactured homes angola indiana",
    "modular homes angola in",
    "mobile homes steuben county",
    "manufactured homes steuben county indiana",
    "champion homes angola in",
  ],
  url: "/locations/angola",
});

const data: CityLocationData = {
  city: "Angola",
  county: "Steuben County",
  slug: "angola",
  distanceMi: 25,
  driveMin: 30,
  lat: 41.635,
  lng: -84.9994,
  tagline:
    "Champion manufactured & modular homes delivered to Angola and Steuben County — from our Auburn showroom just up I-69, with factory-direct pricing and local setup.",
  intro: [
    "Angola is the heart of Indiana's northeast lake country, and it's an easy 25-mile run up I-69 from our Auburn showroom. That proximity keeps delivery times short and freight costs low for Steuben County buyers — whether your home is going on a lake lot near Lake James and Pokagon State Park, in town, or out on rural acreage.",
    "We carry Champion single wides, double wides, and IRC-code modular homes to fit a range of budgets and lots. Because Champion's Topeka factory is only about 40 miles away, Angola sits in one of the tightest delivery zones we serve.",
    <>
      Explore our <Link href="/floor-plans" className="text-[var(--color-teal)] underline">floor plans</Link>, review{" "}
      <Link href="/financing" className="text-[var(--color-teal)] underline">financing options</Link>, or{" "}
      <Link href="/contact-us" className="text-[var(--color-teal)] underline">contact us</Link> for a
      factory-direct quote for your Angola-area property.
    </>,
  ],
  nearby: [
    { name: "Steuben County", href: "/locations/steuben-county" },
    { name: "Auburn", href: "/locations/auburn" },
    { name: "Fremont" },
    { name: "Hamilton" },
    { name: "Orland" },
    { name: "Pleasant Lake" },
    { name: "Ashley" },
  ],
  faqs: [
    {
      question: "Do you deliver manufactured homes to Angola, Indiana?",
      answer:
        "Yes. Angola and Steuben County are about 25 miles from our Auburn showroom, straight up I-69, so it's one of our closest delivery areas. We handle delivery, setup, and installation for homes going on lake lots, in-town lots, or rural land.",
    },
    {
      question: "Can I put a manufactured home on a lake lot near Angola?",
      answer:
        "Often, yes — but lake-area and shoreline lots can have specific setback, septic, and flood requirements. We help verify Steuben County zoning and permitting for your specific parcel before installation so everything is done to code.",
    },
    {
      question: "How much does home delivery cost in the Angola area?",
      answer:
        "Because Angola is close to both our showroom and the Champion factory, delivery costs here are among the lowest in our region. Exact delivery and setup pricing depends on your site — we provide clear, line-item numbers with your quote.",
    },
    {
      question: "What types of homes can I buy near Angola?",
      answer:
        "We offer Champion single wides, double wides, and modular homes ranging from efficient starter layouts to spacious 3–4 bedroom sectionals. Modular homes on permanent foundations are a popular choice for lake and rural properties in Steuben County.",
    },
  ],
};

export default function AngolaLocationPage() {
  return <CityLocationTemplate data={data} />;
}
