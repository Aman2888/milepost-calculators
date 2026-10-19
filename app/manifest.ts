import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION, SITE_LOGO, SITE_NAME } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#e7edda",
    theme_color: "#e7edda",
    icons: SITE_LOGO
      ? [{ src: SITE_LOGO, sizes: "512x512", type: "image/png" }]
      : [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
