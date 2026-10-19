/** Change the name here and it updates everywhere. */
export const SITE_NAME = "Milepost";
export const SITE_TAGLINE = "Free car calculators and vehicle lookups";
// kept under about 155 characters so search results show it in full
export const SITE_DESCRIPTION =
  "Free car calculators for fuel, MPG, EV charging, road trips, tires and loans, plus VIN, recall, safety rating and owner complaint lookups from NHTSA data.";

/** Set NEXT_PUBLIC_SITE_URL (for example https://yoursite.com) before you deploy. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/+$/, "");

/**
 * The date the written content (formulas, tips, FAQs) was last reviewed. It is
 * shown on tool pages and used as the sitemap "last modified" date. Change it
 * when you edit the content, not on every build: search engines trust a
 * lastmod that only moves when something really changed.
 */
export const CONTENT_UPDATED = "2026-10-19";

/** Optional. Shown on the About page and in structured data when set. */
export const SITE_CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "";

/** Optional comma-separated profile URLs (X, YouTube, LinkedIn, GitHub...). Used as "sameAs". */
export const SITE_SOCIALS = (process.env.NEXT_PUBLIC_SOCIAL_URLS ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

/** Optional. Paste the verification codes from Google Search Console and Bing Webmaster Tools. */
export const VERIFICATION = {
  google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? "",
  bing: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ?? "",
};

/** Set ALLOW_AI_CRAWLERS=false to ask AI crawlers (GPTBot, ClaudeBot and others) to stay out. */
export const ALLOW_AI_CRAWLERS = process.env.ALLOW_AI_CRAWLERS !== "false";

export const NHTSA_URL = "https://www.nhtsa.gov";
