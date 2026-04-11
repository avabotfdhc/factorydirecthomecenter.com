import { LocationPageTemplate } from "../LocationPageTemplate";
import { generateLocationMetadata } from "../locationMetadata";

const locationData = {
  city: "Garrett",
  state: "Indiana",
  stateAbbr: "IN",
  distance: "5 miles",
  deliveryCost: "$1,800",
  description: "Located just down the road from our Auburn showroom, Garrett is prime territory for Champion manufactured homes. We provide factory-direct pricing to all neighborhoods within the DeKalb County area.",
  counties: ["DeKalb"],
};

export const metadata = generateLocationMetadata({ city: locationData.city, state: locationData.state });

export default function GarrettPage() {
  return <LocationPageTemplate {...locationData} />;
}
