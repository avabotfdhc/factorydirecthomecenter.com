import Link from "next/link";
import { generateMetadata as genMeta } from "@/lib/seo";
import { CityLocationTemplate, type CityLocationData } from "../CityLocationTemplate";

export const metadata = genMeta({
  title: "Manufactured & Modular Homes in Columbia City, IN",
  description:
    "Champion manufactured and modular homes delivered to Columbia City and Whitley County, Indiana. Factory-direct pricing from our Auburn showroom — single wides, double wides & modular homes.",
  keywords: [
    "manufactured homes columbia city indiana",
    "modular homes columbia city in",
    "mobile homes whitley county",
    "manufactured homes whitley county indiana",
    "champion homes columbia city",
  ],
  url: "/locations/columbia-city",
});

const data: CityLocationData = {
  city: "Columbia City",
  county: "Whitley County",
  slug: "columbia-city",
  distanceMi: 30,
  driveMin: 40,
  lat: 41.1573,
  lng: -85.4886,
  tagline:
    "Champion manufactured & modular homes delivered to Columbia City and Whitley County — factory-direct from our Auburn showroom, with local delivery and contractor referrals for setup.",
  intro: [
    "Columbia City, the seat of Whitley County, has become a popular, growing choice for buyers who want a small-town feel within an easy commute of Fort Wayne. That growth is driving strong demand for affordable new housing — and a factory-direct Champion home is one of the best values in the county.",
    "We deliver single wides, double wides, and IRC-code modular homes throughout Columbia City, South Whitley, Larwill, and the surrounding Whitley County countryside. Because we buy directly from the nearby Champion factory, you get transparent, line-item pricing and short delivery times because the Champion factory is nearby.",
    <>
      See our <Link href="/floor-plans" className="text-[var(--color-teal)] underline">floor plans</Link>, explore{" "}
      <Link href="/financing" className="text-[var(--color-teal)] underline">financing</Link>, or{" "}
      <Link href="/contact-us" className="text-[var(--color-teal)] underline">contact us</Link> for a factory-direct
      quote for your Columbia City or Whitley County property.
    </>,
  ],
  nearby: [
    { name: "Whitley County", href: "/locations/whitley-county" },
    { name: "Fort Wayne", href: "/locations/fort-wayne" },
    { name: "Auburn", href: "/locations/auburn" },
    { name: "Churubusco", href: "/locations/churubusco" },
    { name: "South Whitley" },
    { name: "Larwill" },
  ],
  faqs: [
    {
      question: "Do you deliver manufactured homes to Columbia City, Indiana?",
      answer:
        "Yes. Columbia City and Whitley County are about 30 miles from our Auburn showroom. We arrange delivery to private land, rural acreage, or approved lots throughout the county, and you hire your own contractors for setup and installation — ask us for our referral list of licensed and insured crews past customers have used.",
    },
    {
      question: "Can I put a manufactured home on land in Whitley County?",
      answer:
        "In many parts of Whitley County, yes. Rural areas around Columbia City are generally friendly to manufactured and modular homes on private land. You or your contractor verify the zoning and setback rules for your specific parcel and pull permits before installation — we can point you to the right county offices.",
    },
    {
      question: "Is factory-direct cheaper than a traditional Columbia City dealer?",
      answer:
        "Buying factory-direct means no traditional dealer markup — you buy straight from the factory through us, with transparent line-item pricing. You see exactly what you're paying for the home and delivery, and you hire your own contractors for setup and site work — which is how most buyers save even more.",
    },
    {
      question: "What's the closest showroom to Columbia City?",
      answer:
        "Our Auburn showroom at 1211 State Road 8 is about a 40-minute drive from Columbia City. You can walk through model homes in person, then we deliver and set up your chosen home to your Whitley County site.",
    },
  ],
};

export default function ColumbiaCityLocationPage() {
  return <CityLocationTemplate data={data} />;
}
