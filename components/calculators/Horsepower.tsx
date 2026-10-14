"use client";

import { useState } from "react";
import { convertPower, type PowerUnit } from "@/lib/calc";
import { fixed } from "@/lib/format";
import { CalcLayout, Chips, Field, Segmented, Sign, useNum } from "@/components/ui";

const LABEL: Record<PowerUnit, string> = { hp: "hp", kw: "kW", ps: "PS" };
const NAME: Record<PowerUnit, string> = {
  hp: "Horsepower (hp)",
  kw: "Kilowatts (kW)",
  ps: "Metric horsepower (PS)",
};
const ORDER: PowerUnit[] = ["hp", "kw", "ps"];

export default function Horsepower() {
  const value = useNum("300");
  const [unit, setUnit] = useState<PowerUnit>("hp");

  const r = convertPower(value.n, unit);
  const others = ORDER.filter((u) => u !== unit);

  return (
    <CalcLayout
      sign={
        <Sign
          label={r ? `${fixed(value.n, 1)} ${LABEL[unit]} equals` : "Converted power"}
          value={r ? fixed(r[others[0]], 1) : null}
          unit={LABEL[others[0]]}
          empty="Enter a power figure of zero or more."
          rows={r ? [{ label: NAME[others[1]], value: `${fixed(r[others[1]], 1)} ${LABEL[others[1]]}` }] : []}
        />
      }
    >
      <Segmented
        label="Convert from"
        value={unit}
        onChange={setUnit}
        options={ORDER.map((u) => ({ value: u, label: NAME[u] }))}
      />
      <Field label="Power" value={value.s} onChange={value.setS} unit={LABEL[unit]} />
      <Chips
        label="Common figures"
        onPick={value.setS}
        options={["100", "150", "200", "300", "500"].map((v) => ({
          label: `${v} ${LABEL[unit]}`,
          value: v,
        }))}
      />
    </CalcLayout>
  );
}
