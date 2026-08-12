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
      answer: "Manufactured homes are built to federal HUD standards on a permanent chassis, making them more affordable and faster to deliver. Modular homes are built to state IRC codes like site-built homes, placed on permanent foundations, and qualify for conventional mortgages. Both are built in factories with quality control that exceeds site-built construction.",
    },
    {
      question: "How much does a manufactured home cost in Indiana?",
      answer: "Manufactured homes in Indiana typically range from $50,000 to $150,000 depending on size and features. Single wides start around $50,000, double wides from $80,000, and modular homes from $100,000. Factory Direct offers line-item pricing so you see exactly what you're paying for.",
    },
    {
      question: "Do you offer financing for manufactured homes?",
      answer: "Yes, we work with multiple lenders including 21st Mortgage, Triad Financial, Credit Human, and Lake Michigan Credit Union. We specialize in chattel loans for home-only purchases and can also arrange land-home packages. Cash buyers receive preferred pricing discounts.",
    },
    {
      question: "How long does it take to get a manufactured home delivered?",
      answer: "From order to move-in typically takes 8-12 weeks. Manufacturing takes 6-8 weeks at our Topeka, IN factory just 20 miles away. Site preparation and permitting add 2-4 weeks. Because we're local, our delivery times are faster than dealers located farther from the factory.",
    },
    {
      question: "Can I put a manufactured home on my own land?",
      answer: "Yes, manufactured homes can be placed on private land in most areas of Indiana, Ohio, and Michigan. Rural counties like Noble, DeKalb, and Whitley have zoning-friendly regulations. You or your contractor verify zoning compliance for your specific property and pull the permits — we can point you to the right county offices.",
    },
    {
      question: "What areas do you serve?",
      answer: "We deliver manufactured and modular homes throughout Indiana, Ohio, and Michigan. Our Auburn, Indiana location is centrally located just 20 miles from the Champion factory, allowing us to serve the entire region with lower delivery costs.",
    },
    {
      question: "Do manufactured homes hold their value?",
      answer: "Modern manufactured homes built to HUD or IRC codes hold value well, especially when placed on permanent foundations. Modular homes appreciate similarly to site-built homes. Key factors include location, foundation type, and home quality. Champion homes come with comprehensive warranties.",
    },
    {
      question: "What is included in the price of a manufactured home?",
      answer: "Our line-item pricing shows exactly what you're paying for: the home itself and delivery from the factory. Setup, installation, and site work are separate — you hire your own contractors for those, and unlike dealers who bundle everything, that's how most of our buyers save thousands. Ask us for our referral list of licensed and insured contractors.",
    },
  ],

  financing: [
    {
      question: "What credit score do I need to finance a manufactured home?",
      answer: "Our lending partners work with a range of credit profiles. Generally, 575+ for chattel loans, but we have options for various situations. The best rates go to buyers with 650+ credit scores. We can help you understand your options regardless of your credit history.",
    },
    {
      question: "How much down payment is required for a manufactured home?",
      answer: "Chattel loans typically require 5-10% down. Land-home packages may require more. Conventional financing for modular homes on permanent foundations generally starts around 5% down. We also offer preferred payment discounts for cash buyers.",
    },
    {
      question: "Can I finance just the home without land?",
      answer: "Yes! That's what chattel loans are for. 21st Mortgage and Triad Financial specialize in home-only financing. You can place the home on your land, leased land, or in a community. This is our most popular financing option.",
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
      answer: "Yes, site preparation includes clearing, grading, foundation, and utility connections. This happens while your home is being built (6-8 weeks). You hire your own contractors for this work — ask us for our referral list of licensed and insured crews past customers have used. Proper site prep is essential for a smooth installation.",
    },
    {
      question: "What happens on delivery day?",
      answer: "Your home sections are transported from our Topeka factory to your site. The setup crew you've hired places the home on the foundation, levels and secures it, connects utilities, and completes finishing work. This takes 1-3 days depending on complexity. You'll do a final walkthrough before move-in.",
    },
  ],
};
