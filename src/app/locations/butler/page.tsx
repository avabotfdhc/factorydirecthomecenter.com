import { LocationPageTemplate } from "../LocationPageTemplate";
import { generateLocationMetadata } from "../locationMetadata";

const locationData = {
  city: "Butler",
  state: "Indiana",
  stateAbbr: "IN",
  distance: "12 miles",
  deliveryCost: "$2,200",
  description: "Enjoy affordable factory-direct pricing for your new Champion home in Butler, Indiana. We offer streamlined delivery and complete line-item transparency on all models.",
  counties: ["DeKalb"],
};

export const metadata = generateLocationMetadata({ city: locationData.city, state: locationData.state });

export default function ButlerPage() {
  return <LocationPageTemplate {...locationData} />;
}
