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
            Free calculators for the numbers behind owning and driving a car. Everything is worked
            out in your browser, so nothing you type leaves your device.
          </p>
          <p className="mt-6 max-w-sm text-sm text-white/60">
            Results are estimates. Prices, rates and real-world efficiency vary, so treat the
            answers as a guide, not a quote.
          </p>
        </div>
        <nav aria-label="Calculators" className="md:col-span-7">
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
