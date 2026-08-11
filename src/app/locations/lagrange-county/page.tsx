import { generateLocationMetadata } from "../locationMetadata";
import { LocationPageTemplate } from "../LocationPageTemplate";

const locationData = {
  city: "LaGrange County",
  state: "Indiana",
  stateAbbr: "IN",
  distance: "30 miles",
  deliveryCost: "$3,000",
  description: "LaGrange County provides a peaceful, rural setting ideal for your new manufactured home. Delivered directly from the Topeka, IN Champion factory, enjoy incredibly low delivery costs in LaGrange, Shipshewana, and Howe.",
  counties: ["LaGrange"],
};

export const metadata = generateLocationMetadata({ city: locationData.city, state: locationData.state });

export default function LaGrangeCountyPage() {
  return <LocationPageTemplate {...locationData} />;
}
