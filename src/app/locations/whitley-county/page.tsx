import { generateLocationMetadata } from "../locationMetadata";
import { LocationPageTemplate } from "../LocationPageTemplate";

const locationData = {
  city: "Whitley County",
  state: "Indiana",
  stateAbbr: "IN",
  distance: "35 miles",
  deliveryCost: "$3,200",
  description: "Whether you're setting up a home in Columbia City, South Whitley, Churubusco, or on rural acreage, Whitley County is an excellent location for a Champion manufactured or modular home. Enjoy factory-direct pricing to your property.",
  counties: ["Whitley"],
};

export const metadata = generateLocationMetadata({ city: locationData.city, state: locationData.state });

export default function WhitleyCountyPage() {
  return <LocationPageTemplate {...locationData} />;
}
