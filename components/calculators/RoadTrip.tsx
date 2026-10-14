"use client";

import { useState } from "react";
import { roadTrip } from "@/lib/calc";
import { money, num } from "@/lib/format";
import { CalcLayout, Field, FieldRow, Segmented, Sign, StackBar, useNum } from "@/components/ui";

export default function RoadTrip() {
  const miles = useNum("500");
  const mpg = useNum("28");
  const gas = useNum("3.45");
  const tolls = useNum("12");
  const other = useNum("150");
  const travelers = useNum("2");
  const [roundTrip, setRoundTrip] = useState(true);

  const r = roadTrip({
    miles: miles.n,
    mpg: mpg.n,
    gas: gas.n,
    tolls: Number.isNaN(tolls.n) && tolls.s.trim() === "" ? 0 : tolls.n,
    other: Number.isNaN(other.n) && other.s.trim() === "" ? 0 : other.n,
    travelers: Number.isNaN(travelers.n) ? 1 : travelers.n,
    roundTrip,
  });

  return (
    <CalcLayout
      sign={
        <Sign
          label={roundTrip ? "Total for the round trip" : "Total for the trip"}
          value={r ? money(r.total) : null}
          rows={
            r
              ? [
                  {
                    label: r.people > 1 ? `Each of ${r.people} people` : "Per person",
                    value: money(r.perPerson),
                  },
                  { label: "Distance", value: `${num(r.totalMiles, 0)} miles` },
                  { label: "Fuel used", value: `${num(r.gallons, 1)} gal` },
                  { label: "All-in cost per mile", value: money(r.perMile, 3) },
                ]
              : []
          }
          extra={
            r ? (
              <StackBar
                parts={[
                  { label: "Fuel", value: r.fuel, display: money(r.fuel) },
                  { label: "Tolls", value: r.tollsTotal, display: money(r.tollsTotal) },
                  { label: "Other costs", value: r.other, display: money(r.other) },
                ]}
              />
            ) : null
          }
        />
      }
    >
      <Segmented
        label="Trip type"
        value={roundTrip ? "round" : "one"}
        onChange={(v) => setRoundTrip(v === "round")}
        options={[
          { value: "one", label: "One way" },
          { value: "round", label: "Round trip" },
        ]}
      />
      <FieldRow>
        <Field
          label="One-way distance"
          value={miles.s}
          onChange={miles.setS}
          unit="miles"
        />
        <Field label="Fuel economy" value={mpg.s} onChange={mpg.setS} unit="MPG" />
      </FieldRow>
      <FieldRow>
        <Field label="Gas price" value={gas.s} onChange={gas.setS} prefix="$" unit="per gallon" />
        <Field
          label="Tolls, one way"
          value={tolls.s}
          onChange={tolls.setS}
          prefix="$"
          hint="Doubled automatically for a round trip"
        />
      </FieldRow>
      <FieldRow>
        <Field
          label="Other costs"
          value={other.s}
          onChange={other.setS}
          prefix="$"
          hint="Food, lodging, parking"
        />
        <Field label="People sharing the cost" value={travelers.s} onChange={travelers.setS} />
      </FieldRow>
    </CalcLayout>
  );
}
