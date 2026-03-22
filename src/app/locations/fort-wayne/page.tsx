import { LocationPageTemplate, generateLocationMetadata } from "./LocationPageTemplate";

export const metadata = generateLocationMetadata({
  city: "Fort Wayne",
  state: "Indiana",
});

export default function FortWaynePage() {
  return (
    <LocationPageTemplate
      city="Fort Wayne"
      state="Indiana"
      stateAbbr="IN"
      distance="30 miles"
      deliveryCost="$2,800"
      description="Fort Wayne's closest Champion Homes dealer. Just 30 minutes from our Auburn showroom, we deliver manufactured and modular homes throughout Allen County and northeast Indiana with factory-direct pricing and line-item transparency."
      counties={[
        "Allen",
        "Whitley",
        "Noble",
        "DeKalb",
        "Steuben",
        "LaGrange",
        "Huntington",
        "Wells",
        "Adams",
      ]}
    />
  );
}
