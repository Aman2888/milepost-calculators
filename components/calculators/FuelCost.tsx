"use client";

import { fuelCost } from "@/lib/calc";
import { money, num } from "@/lib/format";
import { CalcLayout, Chips, Field, FieldRow, Sign, useNum } from "@/components/ui";

export default function FuelCost() {
  const distance = useNum("300");
  const mpg = useNum("28");
  const price = useNum("3.45");

  const r = fuelCost(distance.n, mpg.n, price.n);

  return (
    <CalcLayout
      sign={
        <Sign
          label="Fuel for this trip"
          value={r ? money(r.cost) : null}
          rows={
            r
              ? [
                  { label: "Fuel needed", value: `${num(r.gallons, 1)} gal` },
                  { label: "Cost per mile", value: money(r.perMile, 3) },
                  { label: "Cost per 100 miles", value: money(r.per100) },
                ]
              : []
          }
        />
      }
    >
      <FieldRow>
        <Field label="Trip distance" value={distance.s} onChange={distance.setS} unit="miles" />
        <Field label="Fuel economy" value={mpg.s} onChange={mpg.setS} unit="MPG" />
      </FieldRow>
      <Field
        label="Fuel price"
        value={price.s}
        onChange={price.setS}
        prefix="$"
        unit="per gallon"
      />
      <Chips
        label="Not sure of your MPG? Start from a typical one"
        onPick={mpg.setS}
        options={[
          { label: "Compact car, 32", value: "32" },
          { label: "Sedan, 28", value: "28" },
          { label: "SUV, 22", value: "22" },
          { label: "Pickup, 18", value: "18" },
        ]}
      />
    </CalcLayout>
  );
}
