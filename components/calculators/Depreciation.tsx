"use client";

import { depreciation } from "@/lib/calc";
import { fixed, money, num } from "@/lib/format";
import { CalcLayout, Chips, Field, FieldRow, Sign, useNum } from "@/components/ui";

type Point = { year: number; value: number };

/** Value over time. Past years are faint, today is yellow, the forecast is solid white. */
function ValueBars({ points, currentIndex }: { points: Point[]; currentIndex: number }) {
  const max = points[0]?.value || 1;
  const last = points[points.length - 1];
  return (
    <div className="mt-6">
      <div
        className="flex h-24 items-end gap-[3px]"
        role="img"
        aria-label="Bar chart of the car's value over time"
      >
        {points.map((p, i) => (
          <span
            key={i}
            title={`Year ${fixed(p.year, 1)}: ${money(p.value, 0)}`}
            className="flex-1 rounded-t-sm transition-[height] duration-500"
            style={{
              height: `${Math.max(4, (p.value / max) * 100)}%`,
              background:
                i === currentIndex
                  ? "#f3b32a"
                  : i > currentIndex
                    ? "rgba(255,255,255,0.95)"
                    : "rgba(255,255,255,0.4)",
            }}
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between text-xs text-white/80">
        <span>When new</span>
        <span>In {num(last.year, 1)} years from purchase</span>
      </div>
    </div>
  );
}

export default function Depreciation() {
  const price = useNum("28000");
  const age = useNum("3");
  const rate = useNum("15");
  const ahead = useNum("2");

  const r = depreciation(price.n, age.n, rate.n, ahead.n);

  return (
    <CalcLayout
      sign={
        <Sign
          label="Estimated value today"
          value={r ? money(r.current, 0) : null}
          empty="Enter a price above zero and a yearly rate below 100%."
          rows={
            r
              ? [
                  {
                    label: `Value in ${num(ahead.n, 1)} ${ahead.n === 1 ? "year" : "years"}`,
                    value: money(r.future, 0),
                  },
                  { label: "Lost so far", value: money(r.lostSoFar, 0) },
                  {
                    label: "Lost by then",
                    value: `${money(r.lostByThen, 0)} (${fixed(r.lostByThenPct, 0)}%)`,
                  },
                ]
              : []
          }
          extra={r ? <ValueBars points={r.points} currentIndex={r.currentIndex} /> : null}
        />
      }
    >
      <Field label="Purchase price" value={price.s} onChange={price.setS} prefix="$" />
      <FieldRow>
        <Field label="Age of the car" value={age.s} onChange={age.setS} unit="years" />
        <Field
          label="Years to look ahead"
          value={ahead.s}
          onChange={ahead.setS}
          unit="years"
        />
      </FieldRow>
      <Field
        label="Yearly depreciation"
        value={rate.s}
        onChange={rate.setS}
        unit="% per year"
        hint="The share of its value the car loses each year"
      />
      <Chips
        label="Quick picks"
        onPick={rate.setS}
        options={[
          { label: "Slow, 10%", value: "10" },
          { label: "Typical, 15%", value: "15" },
          { label: "Fast, 20%", value: "20" },
        ]}
      />
    </CalcLayout>
  );
}
