// Shared FAQ content. Kept in a plain (non-"use client") module so it can be
// imported by BOTH server components (floor-plans, blog) and client components
// (FAQSection). Exporting a non-component value from a "use client" module turns
// it into an opaque client-reference on the server, which breaks server imports.

export interface FAQ {
  question: string;
  answer: string;
}

export const commonFAQs: Record<"homepage" | "financing" | "process", FAQ[]> = {
  homepage: [
    {
      question: "What is the difference between manufactured and modular homes?",
      answer: "A manufactured home is built to the federal HUD code on a steel frame. That keeps the price lower and delivery faster. A modular home is built to the same state building code (the IRC) as a site-built house. It sits on a permanent foundation and can use a conventional mortgage. Both are built indoors in a factory, with inspections at every step.",
    },
    {
      question: "How much does a manufactured home cost in Indiana?",
      answer: "The price depends on the size, the series and the options you choose. So we quote every home line by line: the home, each option and delivery, each as its own number. Nothing is hidden. Buying factory direct keeps these among the most affordable new homes in Indiana. Call (260) 308-1457 or request a quote online for current pricing on any floor plan.",
    },
    {
      question: "Do you offer financing for manufactured homes?",
      answer: "No. We are not a lender. We do not arrange or broker financing, and we do not pull credit. You choose your own lender. We hand you a list of lenders our customers have used before, with no recommendation attached. Buyers use chattel loans for the home only, land-home packages, or conventional mortgages. Cash buyers receive preferred pricing discounts.",
    },
    {
      question: "How long does it take to get a manufactured home delivered?",
      answer: "Order to move-in usually takes 8 to 12 weeks. The factory build takes 6 to 8 weeks at Champion's Indiana plants (Topeka for Aspire, Dutch and Redman; Decatur for Prime). Site prep and permits add 2 to 4 weeks. Topeka is 30 miles from our Auburn showroom, so delivery is quick.",
    },
    {
      question: "Can I put a manufactured home on my own land?",
      answer: "Yes. In most of Indiana, Ohio and Michigan you can place a manufactured home on your own land. Rural counties such as Noble, DeKalb and Whitley are friendly to them. You or your contractor check the zoning for your parcel and pull the permits. We can point you to the right county office.",
    },
    {
      question: "What areas do you serve?",
      answer: "We deliver manufactured and modular homes across Indiana, Ohio and Michigan. Our showroom is in Auburn, Indiana, 30 miles from Champion's Topeka plant. That short trip keeps delivery costs down for the whole region.",
    },
    {
      question: "Do manufactured homes hold their value?",
      answer: "Yes. A modern manufactured home holds its value well, and best on a permanent foundation. A modular home gains value much like a site-built house. Location, foundation type and the home's quality matter most. Every Champion home comes with a factory warranty.",
    },
    {
      question: "What is included in the price of a manufactured home?",
      answer: "Our quote lists each item: the home itself and delivery from the factory. Setup, installation and site work are separate. You hire your own contractors for those, and that is how most of our buyers save money. Ask us for our list of licensed and insured contractors past customers have used.",
    },
  ],

  financing: [
    {
      question: "What credit score do I need to finance a manufactured home?",
      answer: "Lenders on our list work with a range of credit profiles — generally 575+ for chattel loans, with stronger rates above 650. Each one sets its own standards, so ask them directly. We are not a lender, we do not pull credit, and we do not recommend one lender over another.",
    },
    {
      question: "How much down payment is required for a manufactured home?",
      answer: "Chattel loans typically require 5-10% down. Land-home packages may require more. Conventional financing for modular homes on permanent foundations generally starts around 5% down. We also offer preferred payment discounts for cash buyers.",
    },
    {
      question: "Can I finance just the home without land?",
      answer: "Yes! That's what chattel loans are for — several lenders on the list we hand you specialize in home-only financing. You can place the home on your land, leased land, or in a community. This is our most popular financing option.",
    },
    {
      question: "How long does loan approval take?",
      answer: "Pre-qualification can happen in minutes. Full approval typically takes 3-7 business days once all documentation is submitted. Much faster than traditional mortgages. We work with lenders who understand manufactured homes and can move quickly.",
    },
  ],

  process: [
    {
      question: "What is the first step in buying a manufactured home?",
      answer: "Start by browsing our floor plans online or visiting our Auburn showroom. Get pre-qualified for financing so you know your budget. Then choose your home model and customization options. We'll guide you through every step from there.",
    },
    {
      question: "Do I need to prepare my land before the home arrives?",
      answer: "Yes, site preparation includes clearing, grading, foundation, and utility connections. This happens while your home is being built (6-8 weeks). You hire your own contractors for this work — ask us for our list of licensed and insured crews past customers have used. Proper site prep is essential for a smooth installation.",
    },
    {
      question: "What happens on delivery day?",
      answer: "Your home sections are transported from Champion's Indiana plant (Topeka or Decatur) to your site. The setup crew you've hired places the home on the foundation, levels and secures it, connects utilities, and completes finishing work. This takes 1-3 days depending on complexity. You'll do a final walkthrough before move-in.",
    },
  ],
};
