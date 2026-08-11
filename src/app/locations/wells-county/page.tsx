import { generateLocationMetadata } from "../locationMetadata";
import { LocationPageTemplate } from "../LocationPageTemplate";

const locationData = {
  city: "Wells County",
  state: "Indiana",
  stateAbbr: "IN",
  distance: "50 miles",
  deliveryCost: "$4,200",
  description: "Serving all of Wells County with affordable, high-quality Champion manufactured homes. We deliver to Bluffton, Ossian, Markle, and rural agricultural land with fully transparent delivery timelines.",
  counties: ["Wells"],
};

export const metadata = generateLocationMetadata({ city: locationData.city, state: locationData.state });

export default function WellsCountyPage() {
  return <LocationPageTemplate {...locationData} />;
}
