import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { breadcrumbLd, graph, pageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/nhtsa";
import { CONTENT_UPDATED, SITE_CONTACT_EMAIL, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "What the calculators collect",
  description:
    `What ${SITE_NAME} does and does not collect: calculators run in your browser, and the vehicle lookups send only the VIN or vehicle you search for to NHTSA.`,
  path: "/privacy",
  shareImage: "/opengraph-image",
});

export default function Privacy() {
  return (
    <main className="mx-auto max-w-3xl px-5 pb-8">
      <JsonLd
        data={graph(
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Privacy", path: "/privacy" },
          ]),
        )}
      />
      <nav aria-label="Breadcrumb" className="pt-6 text-sm text-ink-soft">
        <Link href="/" className="underline-offset-4 hover:underline">
          Home
        </Link>
        <span aria-hidden="true"> / </span>
        <span>Privacy</span>
      </nav>

      <h1 className="mt-5 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">Privacy</h1>
      <p className="mt-3 text-sm text-ink-soft">
        Last updated <time dateTime={CONTENT_UPDATED}>{formatDate(CONTENT_UPDATED)}</time>
      </p>
      <p className="mt-4 text-lg leading-relaxed text-ink-soft">
        {SITE_NAME} has no accounts and does not ask for personal details. Here is exactly what
        happens when you use it.
      </p>

      <h2 className="mt-10 font-display text-2xl font-bold">The calculators</h2>
      <p className="mt-3 leading-relaxed">
        The ten calculators work out their answers in your browser. The numbers you type are not
        sent to {SITE_NAME} or anyone else.
      </p>

      <h2 className="mt-10 font-display text-2xl font-bold">The vehicle lookups</h2>
      <p className="mt-3 leading-relaxed">
        The VIN decoder, Car Recall Check, Vehicle Safety Ratings and Car Complaints by Model need
        data from the U.S. National Highway Traffic Safety Administration (NHTSA). When you use
        one, your browser sends the VIN, or the year, make and model you picked, to {SITE_NAME}’s
        server. The server asks NHTSA for the answer and passes it back to you.
      </p>
      <ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
        <li>VINs are not saved or cached by {SITE_NAME}.</li>
        <li>
          Lists of makes and models, and results for a year, make and model, may be cached for
          anything from an hour to a day to make pages load faster. They are not linked to you.
        </li>
        <li>
          NHTSA receives the request from {SITE_NAME}’s server, not from your device, so it does
          not see your IP address. NHTSA’s own privacy policy covers what it does with requests.
        </li>
      </ul>

      <h2 className="mt-10 font-display text-2xl font-bold">Cookies, analytics and ads</h2>
      <p className="mt-3 leading-relaxed">
        {SITE_NAME} does not set cookies, run analytics or show advertising. The fonts are served
        from this site, so your browser does not contact Google to load them.
      </p>

      <h2 className="mt-10 font-display text-2xl font-bold">Server logs</h2>
      <p className="mt-3 leading-relaxed">
        Like almost every website, the company that hosts {SITE_NAME} may keep standard server logs
        (the time, the page requested and the visitor’s IP address) for security and operations.
        A VIN you look up is part of the address that is requested, so it can appear in those
        logs. A VIN identifies a vehicle, not a person, but you may prefer not to look up a VIN
        you would not want others to connect to you.
      </p>

      {SITE_CONTACT_EMAIL && (
        <>
          <h2 className="mt-10 font-display text-2xl font-bold">Questions</h2>
          <p className="mt-3 leading-relaxed">
            Email{" "}
            <a href={`mailto:${SITE_CONTACT_EMAIL}`} className="font-semibold underline underline-offset-4">
              {SITE_CONTACT_EMAIL}
            </a>
            .
          </p>
        </>
      )}
    </main>
  );
}
