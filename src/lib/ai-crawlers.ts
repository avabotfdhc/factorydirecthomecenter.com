// Every AI crawler, search indexer and answer-time fetcher the site welcomes,
// by its robots.txt token. One list, read by src/app/robots.ts.
//
// They are already allowed by the "*" group; naming them makes the welcome
// explicit and survives the day somebody tightens "*". Three kinds:
//   training crawlers     (GPTBot, ClaudeBot, CCBot…) feed a model's knowledge
//   search indexers       (OAI-SearchBot, Claude-SearchBot, PerplexityBot…)
//                         build the index an assistant searches
//   user-triggered fetch  (ChatGPT-User, Claude-User, Perplexity-User…) read a
//                         page while a person waits for the answer
// Google-Extended and Applebot-Extended are not crawlers: they are the tokens
// Google and Apple read to decide whether Gemini / Apple Intelligence may use
// what Googlebot and Applebot already fetched.
//
// Only tokens an operator documents, plus the three seen in logs that have no
// published page (Bytespider, cohere-ai, GrokBot). Checked 2026-11-11.
export const AI_CRAWLER_TOKENS = [
  // OpenAI — ChatGPT
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  // Anthropic — Claude
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  // Perplexity
  "PerplexityBot",
  "Perplexity-User",
  // Google — Gemini, AI Overviews and AI Mode ride on Googlebot
  "Google-Extended",
  "GoogleOther",
  "Google-CloudVertexBot",
  // Microsoft — Copilot rides on bingbot
  "bingbot",
  // Apple — Siri, Spotlight, Apple Intelligence
  "Applebot",
  "Applebot-Extended",
  // Meta AI
  "meta-externalagent",
  "meta-webindexer",
  "meta-externalfetcher",
  // Amazon — Alexa
  "Amazonbot",
  "Amzn-SearchBot",
  "Amzn-User",
  // Mistral — Le Chat
  "MistralAI-Index",
  "MistralAI-User",
  "MistralAI-Training",
  // DuckDuckGo, You.com
  "DuckAssistBot",
  "YouBot",
  // Common Crawl — the public archive most models are trained from
  "CCBot",
  // Seen in logs, no operator documentation
  "GrokBot",
  "Bytespider",
  "cohere-ai",
] as const;
