"use client";

import { useState } from "react";
import { costPerMile } from "@/lib/calc";
import { money } from "@/lib/format";
import { CalcLayout, Field, FieldRow, Segmented, Sign, StackBar, useNum } from "@/components/ui";

type Period = "year" | "month";

export default function CostPerMile() {
  const [period, setPeriod] = useState<Period>("year");
  const miles = useNum("12000");
  const fuel = useNum("1800");
  const insurance = useNum("1500");
  const maintenance = useNum("700");
  const other = useNum("300");

  /** Switching period converts what is already typed, so the car stays the same. */
  function switchPeriod(next: Period) {
    if (next === period) return;
    const k = next === "month" ? 1 / 12 : 12;
    for (const f of [miles, fuel, insurance, maintenance, other]) {
      if (Number.isFinite(f.n)) f.setS(String(Math.round(f.n * k * 100) / 100));
    }
    setPeriod(next);
  }

  const blank = (s: string) => s.trim() === "";
  const r = costPerMile({
    miles: miles.n,
    fuel: blank(fuel.s) ? 0 : fuel.n,
    insurance: blank(insurance.s) ? 0 : insurance.n,
    maintenance: blank(maintenance.s) ? 0 : maintenance.n,
    other: blank(other.s) ? 0 : other.n,
    perMonth: period === "month",
  });

  const per = period === "month" ? "month" : "year";

  return (
    <CalcLayout
      sign={
        <Sign
          label="What each mile really costs"
          value={r ? money(r.perMile, 2) : null}
          unit="per mile"
          empty="Enter the miles you drive, above zero."
          rows={
            r
              ? [
                  { label: "Per year", value: money(r.yearly, 0) },
                  { label: "Per month", value: money(r.monthly, 0) },
                ]
              : []
          }
          extra={
            r ? (
              <StackBar
                parts={[
                  { label: "Fuel", value: r.parts.fuel, display: `${money(r.parts.fuel, 3)} / mi` },
                  {
                    label: "Insurance",
                    value: r.parts.insurance,
                    display: `${money(r.parts.insurance, 3)} / mi`,
                  },
                  {
                    label: "Maintenance",
                    value: r.parts.maintenance,
                    display: `${money(r.parts.maintenance, 3)} / mi`,
                  },
                  { label: "Other", value: r.parts.other, display: `${money(r.parts.other, 3)} / mi` },
                ]}
              />
            ) : null
          }
        />
      }
    >
      <Segmented
        label="I know my costs per"
        value={period}
        onChange={switchPeriod}
        options={[
          { value: "year", label: "Year" },
          { value: "month", label: "Month" },
        ]}
      />
      <Field label={`Miles driven per ${per}`} value={miles.s} onChange={miles.setS} unit="miles" />
      <FieldRow>
        <Field label={`Fuel per ${per}`} value={fuel.s} onChange={fuel.setS} prefix="$" />
        <Field
          label={`Insurance per ${per}`}
          value={insurance.s}
          onChange={insurance.setS}
          prefix="$"
        />
      </FieldRow>
      <FieldRow>
        <Field
          label={`Maintenance per ${per}`}
          value={maintenance.s}
          onChange={maintenance.setS}
          prefix="$"
          hint="Oil, tires, repairs"
        />
        <Field
          label={`Other per ${per}`}
          value={other.s}
          onChange={other.setS}
          prefix="$"
          hint="Registration, parking, tolls, payments"
        />
      </FieldRow>
    </CalcLayout>
  );
}
