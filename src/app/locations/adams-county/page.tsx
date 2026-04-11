import { generateLocationMetadata, LocationPageTemplate } from "../LocationPageTemplate";

const locationData = {
  city: "Adams County",
  state: "Indiana",
  stateAbbr: "IN",
  distance: "55 miles",
  deliveryCost: "$4,400",
  description: "Building in Adams County is easy with Factory Direct Homes. We deliver spacious sectionals and durable single wides to Decatur, Berne, Geneva, and rural acreages across the county.",
  counties: ["Adams"],
};

export const metadata = generateLocationMetadata({ city: locationData.city, state: locationData.state });

export default function AdamsCountyPage() {
  return <LocationPageTemplate {...locationData} />;
}
