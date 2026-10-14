import { content, homeFaq } from "@/lib/content";
import { tools } from "@/lib/tools";
import { CONTENT_UPDATED, NHTSA_URL, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

const calculators = tools.filter((t) => t.kind !== "lookup");
const lookups = tools.filter((t) => t.kind === "lookup");

const link = (t: (typeof tools)[number]) => `- [${t.name}](${SITE_URL}/${t.slug}): ${t.description}`;

/**
 * /llms.txt: a short, plain-text map of the site for AI assistants, following
 * the llms.txt convention (https://llmstxt.org).
 */
export function llmsTxt() {
  return `# ${SITE_NAME}

> ${SITE_DESCRIPTION}

Key facts
- ${calculators.length} calculators and ${lookups.length} vehicle lookups. Free to use, no sign-up.
- The calculators run in the visitor's browser and send nothing to a server.
- The lookups (VIN decoder, recalls, safety ratings, complaints) use the free public APIs of the U.S. National Highway Traffic Safety Administration (NHTSA). ${SITE_NAME} is independent and not affiliated with NHTSA.
- Calculator results are estimates. The recall list is per model year and cannot say whether one specific car has been repaired; NHTSA's VIN search at nhtsa.gov/recalls does that.
- Content last reviewed: ${CONTENT_UPDATED}.

## Calculators
${calculators.map(link).join("\n")}

## Vehicle lookups (official NHTSA data)
${lookups.map(link).join("\n")}

## About
- [About ${SITE_NAME}](${SITE_URL}/about): who runs the site, where the numbers come from and how accurate they are.
- [Privacy](${SITE_URL}/privacy): what is and is not sent when you use a tool.

## Optional
- [Full text of every tool page](${SITE_URL}/llms-full.txt): quick answers, formulas, worked examples and FAQs in one file.
- [XML sitemap](${SITE_URL}/sitemap.xml)
- [NHTSA datasets and APIs](${NHTSA_URL}/nhtsa-datasets-and-apis): the source of the vehicle lookups.
`;
}

/** /llms-full.txt: everything an assistant needs to answer questions about the tools, in one file. */
export function llmsFullTxt() {
  const parts = tools.map((t) => {
    const c = content[t.slug];
    const lookup = t.kind === "lookup";
    return [
      `## ${t.name}`,
      `URL: ${SITE_URL}/${t.slug}`,
      `Type: ${lookup ? "vehicle lookup (official NHTSA data)" : "calculator"}`,
      `You enter: ${t.enter}`,
      `You get: ${t.get}`,
      "",
      `Quick answer: ${c.quick}`,
      "",
      `${lookup ? "Where the data comes from" : "How it is worked out"}: ${t.formula}`,
      ...(c.worked ? ["", `Worked example: ${c.worked}`] : []),
      "",
      "Tips:",
      ...t.tips.map((x) => `- ${x}`),
      "",
      "Frequently asked questions:",
      ...c.faq.flatMap((f) => [`Q: ${f.q}`, `A: ${f.a}`, ""]),
    ].join("\n");
  });

  return `# ${SITE_NAME}: full content

> ${SITE_DESCRIPTION}

Site: ${SITE_URL}/
Content last reviewed: ${CONTENT_UPDATED}
Data source for the lookups: NHTSA (${NHTSA_URL}). ${SITE_NAME} is not affiliated with NHTSA.

${parts.join("\n")}
## About ${SITE_NAME}
${homeFaq.flatMap((f) => [`Q: ${f.q}`, `A: ${f.a}`, ""]).join("\n")}`;
}
