import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { abs, breadcrumbLd, graph, organizationLd, pageMetadata } from "@/lib/seo";
import { CONTENT_UPDATED, NHTSA_URL, SITE_CONTACT_EMAIL, SITE_NAME } from "@/lib/site";
import { formatDate } from "@/lib/nhtsa";
import { tools } from "@/lib/tools";

export const metadata: Metadata = pageMetadata({
  title: "About these car calculators",
  description:
    `Who ${SITE_NAME} is for, where its calculator formulas and NHTSA vehicle data come from, how accurate the results are, and how to report a mistake.`,
  path: "/about",
  shareImage: "/opengraph-image",
});

const calculators = tools.filter((t) => t.kind !== "lookup");
const lookups = tools.filter((t) => t.kind === "lookup");

function ToolLinks({ list }: { list: typeof tools }) {
  return (
    <ul className="mt-3 grid gap-x-8 gap-y-1.5 sm:grid-cols-2">
      {list.map((t) => (
        <li key={t.slug}>
          <Link href={`/${t.slug}`} className="font-semibold underline underline-offset-4 hover:text-sign">
            {t.name}
          </Link>
          <span className="text-ink-soft">: {t.get}</span>
        </li>
      ))}
    </ul>
  );
}

export default function About() {
  return (
    <main className="mx-auto max-w-3xl px-5 pb-8">
      <JsonLd
        data={graph(
          {
            "@type": "AboutPage",
            "@id": `${abs("/about")}#page`,
            url: abs("/about"),
            name: `About ${SITE_NAME}`,
            dateModified: CONTENT_UPDATED,
            about: { "@id": `${abs("")}/#organization` },
          },
          organizationLd(),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
        )}
      />

      <nav aria-label="Breadcrumb" className="pt-6 text-sm text-ink-soft">
        <Link href="/" className="underline-offset-4 hover:underline">
          Home
        </Link>
        <span aria-hidden="true"> / </span>
        <span>About</span>
      </nav>

      <h1 className="mt-5 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
        About {SITE_NAME}
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-ink-soft">
        {SITE_NAME} is a free set of tools for the numbers behind owning and driving a car: what a
        trip costs, what a loan will cost, how new tires change your speedometer, and what the
        U.S. government has on file about a vehicle. There is no sign-up and nothing to install.
      </p>

      <h2 className="mt-12 font-display text-2xl font-bold">What you can do here</h2>
      <h3 className="mt-4 font-display text-lg font-bold">Calculators</h3>
      <ToolLinks list={calculators} />
      <h3 className="mt-6 font-display text-lg font-bold">Vehicle lookups</h3>
      <ToolLinks list={lookups} />

      <h2 className="mt-12 font-display text-2xl font-bold">Where the numbers come from</h2>
      <p className="mt-3 leading-relaxed">
        The calculators use standard, published formulas, such as the loan payment formula, the
        tire diameter formula and the unit conversions between hp, kW and PS. Each tool page shows
        its formula and a worked example so you can check the result by hand.
      </p>
      <p className="mt-3 leading-relaxed">
        The four vehicle lookups use the free public data of the U.S. National Highway Traffic
        Safety Administration (NHTSA): the vPIC database for VINs, and its recall, 5-Star Safety
        Rating and consumer complaint data. You can read about these datasets on{" "}
        <a
          href={`${NHTSA_URL}/nhtsa-datasets-and-apis`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline underline-offset-4"
        >
          NHTSA’s datasets and APIs page
        </a>
        . {SITE_NAME} is independent and is not affiliated with or endorsed by NHTSA.
      </p>

      <h2 className="mt-12 font-display text-2xl font-bold">How accurate is it?</h2>
      <ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
        <li>
          The maths in the calculators is exact, but the results are estimates. Real fuel prices,
          MPG, interest rates and resale values change, so treat answers as a guide, not a quote.
        </li>
        <li>
          Recalls are listed per year, make and model. They cannot show whether one particular car
          has already been repaired. For that, use the VIN search at nhtsa.gov/recalls.
        </li>
        <li>
          Complaints are unverified reports from owners, and safety ratings exist only for the
          vehicles NHTSA has tested.
        </li>
        <li>
          Lookup results are only as complete and current as NHTSA’s data, which can lag behind
          real events.
        </li>
      </ul>

      <h2 className="mt-12 font-display text-2xl font-bold">How the content is kept correct</h2>
      <p className="mt-3 leading-relaxed">
        Every worked example on the site is produced by the same formulas the calculators use. The
        written content on the tool pages was last reviewed on{" "}
        <time dateTime={CONTENT_UPDATED}>{formatDate(CONTENT_UPDATED)}</time>.
      </p>

      {SITE_CONTACT_EMAIL && (
        <>
          <h2 className="mt-12 font-display text-2xl font-bold">Found a mistake?</h2>
          <p className="mt-3 leading-relaxed">
            Please tell us at{" "}
            <a href={`mailto:${SITE_CONTACT_EMAIL}`} className="font-semibold underline underline-offset-4">
              {SITE_CONTACT_EMAIL}
            </a>{" "}
            and we will look into it.
          </p>
        </>
      )}

      <p className="mt-12 text-sm text-ink-soft">
        Read how your data is handled on the{" "}
        <Link href="/privacy" className="underline underline-offset-4">
          privacy page
        </Link>
        .
      </p>
    </main>
  );
}
