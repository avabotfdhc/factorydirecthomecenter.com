import { LocationPageTemplate, generateLocationMetadata } from "./LocationPageTemplate";

export const metadata = generateLocationMetadata({
  city: "Toledo",
  state: "Ohio",
});

export default function ToledoPage() {
  return (
    <LocationPageTemplate
      city="Toledo"
      state="Ohio"
      stateAbbr="OH"
      distance="75 miles"
      deliveryCost="$3,500"
      description="Toledo's source for Champion manufactured and modular homes. Just across the Indiana border in Auburn, we deliver to Lucas County and northwest Ohio with factory-direct pricing that beats the big chains."
      counties={[
        "Lucas",
        "Wood",
        "Fulton",
        "Williams",
        "Henry",
        "Defiance",
        "Paulding",
        "Putnam",
        "Hancock",
      ]}
    />
  );
}
