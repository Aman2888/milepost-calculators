import Link from "next/link";
import { tools } from "@/lib/tools";
import { SITE_NAME } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="mt-24 bg-ink text-white">
      <div className="centerline" aria-hidden="true" />
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="font-display text-2xl font-extrabold">{SITE_NAME}</p>
          <p className="mt-3 max-w-sm text-white/75">
            Free calculators and vehicle lookups for the numbers behind owning and driving a car.
            Calculators work out everything in your browser. Lookups send only the VIN or vehicle
            you search for to NHTSA.
          </p>
          <p className="mt-6 max-w-sm text-sm text-white/60">
            Calculator results are estimates. Prices, rates and real-world efficiency vary, so
            treat the answers as a guide, not a quote.
          </p>
          <p className="mt-3 max-w-sm text-sm text-white/60">
            Vehicle data comes from the U.S. National Highway Traffic Safety Administration
            (NHTSA). Milepost is not affiliated with or endorsed by NHTSA.
          </p>
          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <li>
              <Link href="/about" className="text-white/85 underline-offset-4 hover:text-hwy hover:underline">
                About
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="text-white/85 underline-offset-4 hover:text-hwy hover:underline">
                Privacy
              </Link>
            </li>
            <li>
              <a href="/sitemap.xml" className="text-white/85 underline-offset-4 hover:text-hwy hover:underline">
                Sitemap
              </a>
            </li>
            <li>
              <a href="/llms.txt" className="text-white/85 underline-offset-4 hover:text-hwy hover:underline">
                llms.txt
              </a>
            </li>
          </ul>
        </div>
        <nav aria-label="Tools" className="md:col-span-7">
          <ul className="grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
            {tools.map((t) => (
              <li key={t.slug}>
                <Link
                  href={`/${t.slug}`}
                  className="text-white/85 underline-offset-4 hover:text-hwy hover:underline"
                >
                  {t.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
