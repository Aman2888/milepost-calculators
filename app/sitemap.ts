import type { MetadataRoute } from "next";
import { tools } from "@/lib/tools";
import { CONTENT_UPDATED, SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  // only moves when the content is reviewed (see lib/site.ts), not on every build
  const lastModified = new Date(CONTENT_UPDATED);
  return [
    { url: `${SITE_URL}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    ...tools.map((t) => ({
      url: `${SITE_URL}/${t.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: `${SITE_URL}/about`, lastModified, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE_URL}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.2 },
  ];
}
