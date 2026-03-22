import { LocationPageTemplate, generateLocationMetadata } from "./LocationPageTemplate";

export const metadata = generateLocationMetadata({
  city: "Indianapolis",
  state: "Indiana",
});

export default function IndianapolisPage() {
  return (
    <LocationPageTemplate
      city="Indianapolis"
      state="Indiana"
      stateAbbr="IN"
      distance="110 miles"
      deliveryCost="$4,200"
      description="Indianapolis families trust Factory Direct for Champion manufactured and modular homes. We may not be the closest dealer, but we're the most transparent — with line-item pricing and the freedom to choose your own contractors."
      counties={[
        "Marion",
        "Hamilton",
        "Johnson",
        "Hendricks",
        "Boone",
        "Shelby",
        "Morgan",
        "Hancock",
        "Madison",
        "Delaware",
      ]}
    />
  );
}
