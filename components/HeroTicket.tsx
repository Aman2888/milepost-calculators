"use client";

import Link from "next/link";
import { useState } from "react";
import Odometer from "@/components/Odometer";
import { money, num, parse } from "@/lib/format";

/** A live mini fuel calculator. The cost rolls on odometer reels as you drag. */
export default function HeroTicket() {
  const [distance, setDistance] = useState(320);
  const [mpg, setMpg] = useState(28);
  const [price, setPrice] = useState("3.45");

  const p = parse(price);
  const validPrice = Number.isFinite(p) && p >= 0;
  const cost = validPrice ? (distance / mpg) * p : 0;

  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="overflow-hidden rounded-[28px] border-2 border-ink bg-card shadow-[0_10px_0_var(--color-ink)]">
        <div className="flex items-center justify-between bg-ink px-5 py-3 text-white">
          <span className="font-display text-lg font-bold">Trip ticket</span>
          <span className="text-sm text-white/70">Fuel only</span>
        </div>

        <div className="px-5 pb-6 pt-5 sm:px-6">
          <p className="text-sm text-ink-soft">This drive will cost about</p>
          <div className="mt-2 text-[2.9rem] sm:text-6xl">
            <Odometer value={cost} />
          </div>

          <div className="relative -mx-5 my-6 border-t-2 border-dashed border-ink/30 sm:-mx-6" aria-hidden="true">
            <span className="absolute -left-3 -top-3 h-6 w-6 rounded-full border-2 border-ink bg-paper" />
            <span className="absolute -right-3 -top-3 h-6 w-6 rounded-full border-2 border-ink bg-paper" />
          </div>

          <div className="space-y-5">
            <label className="block">
              <span className="flex items-baseline justify-between text-sm">
                <span className="font-semibold">Distance</span>
                <span className="tabular-nums">{num(distance, 0)} miles</span>
              </span>
              <input
                type="range"
                min={10}
                max={1500}
                step={10}
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                className="mt-2 w-full accent-sign"
              />
            </label>

            <label className="block">
              <span className="flex items-baseline justify-between text-sm">
                <span className="font-semibold">Fuel economy</span>
                <span className="tabular-nums">{mpg} MPG</span>
              </span>
              <input
                type="range"
                min={10}
                max={60}
                step={1}
                value={mpg}
                onChange={(e) => setMpg(Number(e.target.value))}
                className="mt-2 w-full accent-sign"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold">Price per gallon</span>
              <span className="mt-1.5 flex items-center rounded-xl border-2 border-ink/25 bg-white/70 focus-within:border-sign focus-within:bg-white focus-within:ring-4 focus-within:ring-sign/20">
                <span className="pl-3.5 text-ink-soft">$</span>
                <input
                  value={price}
                  inputMode="decimal"
                  autoComplete="off"
                  onChange={(e) => setPrice(e.target.value.replace(/[^\d.]/g, ""))}
                  className="min-w-0 flex-1 bg-transparent px-2 py-2.5 text-lg font-medium tabular-nums outline-none"
                />
              </span>
            </label>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-ink/15 pt-4 text-sm">
            <span className="text-ink-soft">
              {validPrice ? `${money(p / mpg, 3)} per mile, ${num(distance / mpg, 1)} gal` : "Enter a price"}
            </span>
            <Link
              href="/fuel-cost-calculator"
              className="rounded-full bg-hwy px-4 py-2 font-semibold text-ink transition-colors hover:bg-ink hover:text-white"
            >
              Open full calculator
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
