import Link from "next/link";
import HeroTicket from "@/components/HeroTicket";
import RouteList from "@/components/RouteList";
import { tools } from "@/lib/tools";

export default function Home() {
  return (
    <main>
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-12 lg:grid-cols-12 lg:gap-8 lg:pt-20">
        <div className="lg:col-span-6">
          <h2 className="font-display text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
            Know what the drive will cost before you turn the key.
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-soft">
            Ten free calculators for fuel, charging, road trips, tires, wheels, car loans and the
            everyday cost of keeping a car on the road. No sign-up, and nothing you type leaves
            your browser.
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
              Browse all ten
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
            Pick a calculator
          </h2>
          <p className="mt-2 text-lg text-ink-soft">
            Each one tells you what to enter and what you will get back, and shows how the answer
            is worked out.
          </p>
        </div>
        <RouteList tools={tools} />
      </section>
    </main>
  );
}
