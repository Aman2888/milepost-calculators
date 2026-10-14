import type { Metadata } from "next";
import Link from "next/link";
import Faq from "@/components/Faq";
import HeroTicket from "@/components/HeroTicket";
import JsonLd from "@/components/JsonLd";
import RouteList from "@/components/RouteList";
import { homeFaq } from "@/lib/content";
import { faqLd, graph, itemListLd, organizationLd, pageMetadata, websiteLd } from "@/lib/seo";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "@/lib/site";
import { tools } from "@/lib/tools";

export const metadata: Metadata = pageMetadata({
  title: `${SITE_NAME}: ${SITE_TAGLINE}`,
  description: SITE_DESCRIPTION,
  path: "/",
  absoluteTitle: true,
});

export default function Home() {
  return (
    <main className="overflow-x-clip">
      <JsonLd data={graph(organizationLd(), websiteLd(), itemListLd(tools), faqLd(homeFaq))} />
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-12 lg:grid-cols-12 lg:gap-8 lg:pt-20">
        <div className="lg:col-span-6">
          <h1 className="font-display text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
            Know what the drive will cost before you turn the key.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-soft">
            Ten free calculators for fuel, charging, road trips, tires, wheels and car loans, plus
            four vehicle lookups for VINs, recalls, safety ratings and owner complaints, using
            official NHTSA data. No sign-up. The calculators run in your browser, and a lookup
            sends only the VIN or vehicle you search for.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/fuel-cost-calculator"
              className="rounded-full bg-ink px-6 py-3 font-semibold text-white transition-colors hover:bg-sign"
            >
              Start with fuel cost
            </Link>
            <Link
              href="#tools"
              className="rounded-full border-2 border-ink px-6 py-3 font-semibold transition-colors hover:bg-ink hover:text-white"
            >
              Browse all {tools.length}
            </Link>
          </div>
        </div>
        <div className="lg:col-span-6">
          <HeroTicket />
        </div>
      </section>

      <section id="tools" className="mx-auto max-w-6xl scroll-mt-6 px-5 pt-8">
        <div className="mb-8 max-w-xl">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Pick a tool
          </h2>
          <p className="mt-2 text-lg text-ink-soft">
            Each one tells you what to enter and what you will get back, and shows how the answer
            is worked out.
          </p>
        </div>
        <RouteList tools={tools} />
      </section>

      <div className="mx-auto max-w-6xl px-5 pb-4">
        <Faq items={homeFaq} title="Questions about Milepost" />
      </div>
    </main>
  );
}
