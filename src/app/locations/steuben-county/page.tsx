import { generateLocationMetadata } from "../locationMetadata";
import { LocationPageTemplate } from "../LocationPageTemplate";

const locationData = {
  city: "Steuben County",
  state: "Indiana",
  stateAbbr: "IN",
  distance: "25 miles",
  deliveryCost: "$2,800",
  description: "Steuben County's lakes and rural properties are perfect for a new Champion home. We deliver to Angola, Fremont, Ashley, and everywhere in between, providing you with full line-item pricing transparency.",
  counties: ["Steuben"],
};

export const metadata = generateLocationMetadata({ city: locationData.city, state: locationData.state });

export default function SteubenCountyPage() {
  return <LocationPageTemplate {...locationData} />;
}
