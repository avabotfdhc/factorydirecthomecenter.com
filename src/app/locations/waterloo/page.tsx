import { LocationPageTemplate } from "../LocationPageTemplate";
import { generateLocationMetadata } from "../locationMetadata";

const locationData = {
  city: "Waterloo",
  state: "Indiana",
  stateAbbr: "IN",
  distance: "6 miles",
  deliveryCost: "$1,900",
  description: "Whether you own acreage in Waterloo or are looking to place a home in a friendly local community, Factory Direct Homes Center delivers customized multi-sectional and single-wide homes right to your lot.",
  counties: ["DeKalb"],
};

export const metadata = generateLocationMetadata({ city: locationData.city, state: locationData.state });

export default function WaterlooPage() {
  return <LocationPageTemplate {...locationData} />;
}
