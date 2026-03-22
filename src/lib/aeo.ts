// AEO (Answer Engine Optimization) Content Helpers
// Following Button Block standards for AI search visibility

interface FAQItem {
  question: string;
  answer: string;
}

// Generate FAQ content with 40-60 word answers per Button Block standards
export function generateFAQ(
  topic: string,
  questions: Array<{ q: string; a: string }>
): FAQItem[] {
  return questions.map(({ q, a }) => ({
    question: q,
    answer: optimizeAnswerLength(a),
  }));
}

// Ensure answer is 40-60 words for optimal AI extraction
function optimizeAnswerLength(answer: string): string {
  const words = answer.trim().split(/\s+/);
  
  if (words.length < 40) {
    // Too short - expand with relevant details
    console.warn(`Answer too short (${words.length} words). Minimum 40 words recommended for AEO.`);
  }
  
  if (words.length > 60) {
    // Too long - truncate but keep complete sentences
    let truncated = words.slice(0, 60).join(" ");
    const lastPeriod = truncated.lastIndexOf(".");
    if (lastPeriod > 0) {
      truncated = truncated.slice(0, lastPeriod + 1);
    }
    return truncated;
  }
  
  return answer;
}

// Structure content for AI extraction
export function structureForAEO(content: {
  question: string;
  directAnswer: string; // 1 sentence
  supportingDetails: string[]; // 2-3 sentences
  additionalContext?: string;
}) {
  const fullAnswer = [
    content.directAnswer,
    ...content.supportingDetails,
  ].join(" ");

  return {
    question: content.question,
    answer: optimizeAnswerLength(fullAnswer),
    structured: {
      directAnswer: content.directAnswer,
      supportingDetails: content.supportingDetails,
      additionalContext: content.additionalContext,
    },
  };
}

// Generate question-based headers
export function generateQuestionHeaders(topic: string): string[] {
  const templates = [
    `What is ${topic}?`,
    `How does ${topic} work?`,
    `Why choose ${topic}?`,
    `What are the benefits of ${topic}?`,
    `How much does ${topic} cost?`,
    `Where can I find ${topic}?`,
    `What should I know about ${topic}?`,
    `How do I get started with ${topic}?`,
  ];
  
  return templates;
}

// Create topic cluster content structure
export function createTopicCluster(
  pillarTopic: string,
  subtopics: string[]
) {
  return {
    pillar: {
      title: `Complete Guide to ${pillarTopic}`,
      url: `/guides/${slugify(pillarTopic)}`,
      description: `Everything you need to know about ${pillarTopic}`,
    },
    clusters: subtopics.map((subtopic) => ({
      title: subtopic,
      url: `/guides/${slugify(subtopic)}`,
      description: `Learn about ${subtopic} and how it relates to ${pillarTopic}`,
    })),
  };
}

// Generate hyperlocal content for Fort Wayne market
export function generateHyperlocalContent(
  service: string,
  location: string
) {
  return {
    title: `${service} in ${location}`,
    headings: [
      `What is ${service}?`,
      `Why choose ${service} in ${location}?`,
      `How much does ${service} cost in ${location}?`,
      `Where to find ${service} in ${location}`,
      `${service} regulations in ${location}`,
    ],
    localContext: [
      `Mention ${location} neighborhoods`,
      `Reference local landmarks`,
      `Include nearby cities (New Haven, Huntertown, Leo-Cedarville)`,
      `Mention Allen County specifics`,
      `Reference local weather/climate factors`,
    ],
  };
}

// Create E-E-A-T (Experience, Expertise, Authoritativeness, Trust) content
export function createEEATContent(type: "guide" | "service" | "product") {
  const elements = {
    experience: [
      "First-hand knowledge",
      "Case studies",
      "Customer testimonials",
      "Before/after examples",
    ],
    expertise: [
      "Author credentials",
      "Industry certifications",
      "Years in business",
      "Specialized knowledge",
    ],
    authoritativeness: [
      "Industry partnerships",
      "Media mentions",
      "Awards and recognition",
      "Professional affiliations",
    ],
    trust: [
      "Transparent pricing",
      "Clear processes",
      "Customer reviews",
      "Warranty information",
    ],
  };

  return elements;
}

// Generate voice search optimized content
export function optimizeForVoiceSearch(text: string): string {
  // Voice searches tend to be:
  // 1. Conversational
  // 2. Question-based
  // 3. Local-focused
  // 4. Action-oriented
  
  return text
    .replace(/\butilize\b/g, "use")
    .replace(/\bpurchase\b/g, "buy")
    .replace(/\bapproximately\b/g, "about")
    .replace(/\bassistance\b/g, "help")
    .replace(/\bregarding\b/g, "about");
}

// Create content for featured snippets
export function createSnippetContent(data: {
  type: "paragraph" | "list" | "table";
  title: string;
  content: string | string[];
}) {
  switch (data.type) {
    case "paragraph":
      return {
        "@type": "Answer",
        text: typeof data.content === "string" ? data.content : data.content.join(" "),
      };
    
    case "list":
      return {
        "@type": "ItemList",
        itemListElement: (data.content as string[]).map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item,
        })),
      };
    
    case "table":
      // Return table structured data
      return {
        "@type": "Table",
        about: data.title,
      };
    
    default:
      return data.content;
  }
}

// Generate internal linking structure
export function generateInternalLinks(
  currentPage: string,
  relatedPages: Array<{ title: string; url: string; relevance: number }>
) {
  // Sort by relevance and return top 3-5
  return relatedPages
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 5)
    .map((page) => ({
      ...page,
      anchorText: generateAnchorText(currentPage, page.title),
    }));
}

function generateAnchorText(source: string, target: string): string {
  // Generate natural anchor text
  if (target.toLowerCase().includes("guide")) {
    return `learn more about ${target.toLowerCase().replace(" guide", "")}`;
  }
  if (target.toLowerCase().includes("pricing")) {
    return `see ${target.toLowerCase()}`;
  }
  return `read about ${target.toLowerCase()}`;
}

// Helper function to create URL slugs
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Validate content meets AEO standards
export function validateAEOContent(content: {
  question: string;
  answer: string;
}): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  // Check question format
  if (!content.question.endsWith("?")) {
    issues.push("Question should end with a question mark");
  }
  
  if (!content.question.match(/^(What|How|Why|Where|When|Who|Can|Do|Is|Are)/i)) {
    issues.push("Question should start with a question word (What, How, Why, etc.)");
  }
  
  // Check answer length
  const wordCount = content.answer.split(/\s+/).length;
  if (wordCount < 40) {
    issues.push(`Answer too short (${wordCount} words). Minimum 40 words recommended.`);
  }
  if (wordCount > 60) {
    issues.push(`Answer too long (${wordCount} words). Maximum 60 words recommended.`);
  }
  
  // Check answer starts with direct response
  const firstSentence = content.answer.split(".")[0];
  if (firstSentence.length > 100) {
    issues.push("First sentence too long. Direct answer should be concise.");
  }
  
  return {
    valid: issues.length === 0,
    issues,
  };
}

// Export all AEO utilities
export const aeo = {
  generateFAQ,
  structureForAEO,
  generateQuestionHeaders,
  createTopicCluster,
  generateHyperlocalContent,
  createEEATContent,
  optimizeForVoiceSearch,
  createSnippetContent,
  generateInternalLinks,
  validateAEOContent,
};
