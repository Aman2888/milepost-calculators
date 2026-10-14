import type { MetadataRoute } from "next";
import { tools } from "@/lib/tools";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE_URL, lastModified: now },
    ...tools.map((t) => ({ url: `${SITE_URL}/${t.slug}`, lastModified: now })),
  ];
}
