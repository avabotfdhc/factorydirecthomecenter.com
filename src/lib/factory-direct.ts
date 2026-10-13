// What "factory direct" means at this dealership, in the only words the site
// uses to explain it. The homepage section and FAQ, /about and Ava all read
// these, so the explanation cannot drift between pages.
//
// The facts, from Kyle (2026-10-13):
//   - Champion sells only to dealers; a buyer cannot order from the plant.
//   - We are that dealer. We buy each home directly from Champion for the buyer.
//   - It is built to order at a Champion plant in Indiana (Topeka for Aspire
//     and Redman, Decatur for Prime) and ships straight from the plant to the
//     buyer's land. It does not go through our lot first. Do not write
//     "Topeka" alone here: Prime is not built there.
//   - There is no wholesaler or distributor between Champion and us.
//
// What this never says (tests/disclaimers.test.ts holds it): that the BUYER
// buys from the factory, that there is no dealer, no dealer markup or no
// middleman. We are the dealer, and our margin is in the price.

export const FACTORY_DIRECT_STEPS: ReadonlyArray<{ title: string; body: string }> = [
  {
    title: "We buy it from Champion for you",
    body: "Champion sells its homes only to authorized dealers, so a buyer can’t order one from the plant directly. We’re the authorized dealer: once you choose a plan and options, we place the order with Champion on your behalf.",
  },
  {
    title: "Built to order in Indiana",
    body: "Your home is built for you, with the options you picked, at a Champion plant in Indiana: Topeka, 30 miles from our Auburn showroom, for Aspire and Redman, or Decatur for Prime.",
  },
  {
    title: "Shipped straight from the plant to your land",
    body: "When it’s finished, the home travels from the factory directly to your site. It doesn’t sit on a sales lot first, and there’s no wholesaler or distributor between Champion and us.",
  },
];

export const FACTORY_DIRECT_FAQ = {
  q: "What does “factory direct” mean if you’re a dealer?",
  a: "Champion sells its homes only to authorized dealers, so you can’t buy one from the plant yourself. We are that dealer, and we buy your home directly from Champion for you. It’s built to order at Champion’s Indiana plants (Topeka, 30 miles from our showroom, for Aspire and Redman; Decatur for Prime) and ships straight from the factory to your land. There’s no wholesaler or distributor between Champion and us, so the price carries one dealer’s margin, ours, and our quote lists the home, each option and delivery line by line.",
};
