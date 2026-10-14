import type { MetadataRoute } from "next";
import { ALLOW_AI_CRAWLERS, SITE_URL } from "@/lib/site";

/**
 * Crawlers used by AI assistants and AI search. They are welcome by default,
 * because being readable by them is how a site gets quoted in AI answers.
 * Set ALLOW_AI_CRAWLERS=false to ask them to stay away.
 */
const AI_CRAWLERS = [
  "GPTBot", // OpenAI: model training
  "OAI-SearchBot", // OpenAI: ChatGPT search
  "ChatGPT-User", // OpenAI: a person asked ChatGPT to open a page
  "ClaudeBot", // Anthropic: model training
  "Claude-SearchBot", // Anthropic: search
  "Claude-User", // Anthropic: a person asked Claude to open a page
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended", // Google: Gemini training and grounding
  "Applebot-Extended",
  "Amazonbot",
  "meta-externalagent",
  "CCBot", // Common Crawl, a dataset many AI models learn from
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // the API route is for the page's own use, not for search results
      { userAgent: "*", allow: "/", disallow: ["/api/"] },
      ...AI_CRAWLERS.map((userAgent) =>
        ALLOW_AI_CRAWLERS
          ? { userAgent, allow: "/", disallow: ["/api/"] }
          : { userAgent, disallow: "/" },
      ),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
