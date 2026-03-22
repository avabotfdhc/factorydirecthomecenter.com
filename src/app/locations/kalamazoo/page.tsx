import { LocationPageTemplate, generateLocationMetadata } from "./LocationPageTemplate";

export const metadata = generateLocationMetadata({
  city: "Kalamazoo",
  state: "Michigan",
});

export default function KalamazooPage() {
  return (
    <LocationPageTemplate
      city="Kalamazoo"
      state="Michigan"
      stateAbbr="MI"
      distance="95 miles"
      deliveryCost="$3,800"
      description="Kalamazoo families choose Factory Direct for Champion manufactured and modular homes. From our Auburn, Indiana location, we serve southwest Michigan with transparent pricing and partnership-based service."
      counties={[
        "Kalamazoo",
        "Calhoun",
        "Branch",
        "St. Joseph",
        "Cass",
        "Van Buren",
        "Allegan",
        "Barry",
        "Eaton",
      ]}
    />
  );
}
