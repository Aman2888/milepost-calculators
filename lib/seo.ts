import type { Metadata } from "next";
import type { Tool } from "@/lib/tools";
import type { Faq, ToolContent } from "@/lib/content";
import {
  CONTENT_UPDATED,
  NHTSA_URL,
  SITE_CONTACT_EMAIL,
  SITE_DESCRIPTION,
  SITE_LOGO_URL,
  SITE_NAME,
  SITE_SOCIALS,
  SITE_URL,
} from "@/lib/site";

export const abs = (path: string) => `${SITE_URL}${path}`;

/**
 * Metadata for one page: title, description, canonical link, Open Graph and
 * Twitter cards. Pages that sit next to an opengraph-image file get their
 * share image from it automatically.
 */
export function pageMetadata(o: {
  title: string;
  description: string;
  path: string;
  /** true when the title already contains the site name */
  absoluteTitle?: boolean;
  /**
   * Path of a share image, for pages that have no opengraph-image file of
   * their own. (A page that sets its own openGraph does not inherit the
   * image of the root file, so it has to be named here.)
   */
  shareImage?: string;
}): Metadata {
  const images = o.shareImage ? [{ url: o.shareImage, width: 1200, height: 630 }] : undefined;
  const shown = o.absoluteTitle ? o.title : `${o.title} | ${SITE_NAME}`;
  return {
    title: o.absoluteTitle ? { absolute: o.title } : o.title,
    description: o.description,
    alternates: { canonical: o.path },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "en_US",
      url: o.path,
      title: shown,
      description: o.description,
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: shown,
      description: o.description,
      ...(images ? { images } : {}),
    },
  };
}

/* ------------------------------------------------------------------ */
/* schema.org structured data (JSON-LD)                                */
/* ------------------------------------------------------------------ */

const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;

export const organizationLd = () => ({
  "@type": "Organization",
  "@id": ORG_ID,
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  logo: { "@type": "ImageObject", url: SITE_LOGO_URL || `${SITE_URL}/icon.svg` },
  description: SITE_DESCRIPTION,
  ...(SITE_SOCIALS.length ? { sameAs: SITE_SOCIALS } : {}),
  ...(SITE_CONTACT_EMAIL
    ? { contactPoint: { "@type": "ContactPoint", contactType: "customer support", email: SITE_CONTACT_EMAIL } }
    : {}),
});

export const websiteLd = () => ({
  "@type": "WebSite",
  "@id": SITE_ID,
  url: `${SITE_URL}/`,
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  inLanguage: "en",
  publisher: { "@id": ORG_ID },
});

export const breadcrumbLd = (items: { name: string; path: string }[]) => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    item: abs(it.path),
  })),
});

export const faqLd = (faq: Faq[]) => ({
  "@type": "FAQPage",
  mainEntity: faq.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
});

export const itemListLd = (tools: Tool[]) => ({
  "@type": "ItemList",
  name: `${SITE_NAME} calculators and vehicle lookups`,
  itemListElement: tools.map((t, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: t.name,
    url: abs(`/${t.slug}`),
  })),
});

export const webAppLd = (tool: Tool, c: ToolContent) => ({
  "@type": "WebApplication",
  "@id": `${abs(`/${tool.slug}`)}#app`,
  name: tool.name,
  url: abs(`/${tool.slug}`),
  description: tool.description,
  applicationCategory: c.category,
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript",
  isAccessibleForFree: true,
  inLanguage: "en",
  dateModified: CONTENT_UPDATED,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  publisher: { "@id": ORG_ID },
  ...(tool.kind === "lookup" ? { isBasedOn: `${NHTSA_URL}/nhtsa-datasets-and-apis` } : {}),
});

/** One <script> worth of data: several entities in a single @graph. */
export const graph = (...nodes: object[]) => ({ "@context": "https://schema.org", "@graph": nodes });
