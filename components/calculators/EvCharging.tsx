"use client";

import { evCharge } from "@/lib/calc";
import { money, num } from "@/lib/format";
import { CalcLayout, Chips, Field, FieldRow, Sign, useNum } from "@/components/ui";

export default function EvCharging() {
  const battery = useNum("60");
  const rate = useNum("0.16");
  const from = useNum("0");
  const to = useNum("100");
  const eff = useNum("90");
  const mikwh = useNum("3.5");

  const r = evCharge({
    battery: battery.n,
    rate: rate.n,
    from: from.n,
    to: to.n,
    eff: eff.n,
    milesPerKwh: mikwh.n,
  });

  const isFull = from.n === 0 && to.n === 100;

  return (
    <CalcLayout
      sign={
        <Sign
          label={isFull ? "Cost of a full charge" : "Cost of this charge"}
          value={r ? money(r.cost) : null}
          empty="Start % must be lower than end %, and efficiency has to be between 1 and 100."
          rows={
            r
              ? [
                  { label: "Added to the battery", value: `${num(r.added, 1)} kWh` },
                  { label: "Drawn from the wall", value: `${num(r.drawn, 1)} kWh` },
                  { label: "Range added", value: `${num(r.rangeAdded, 0)} miles` },
                  {
                    label: "Cost per mile",
                    value: r.costPerMile === null ? "n/a" : money(r.costPerMile, 3),
                  },
                  ...(isFull ? [] : [{ label: "0 to 100% would cost", value: money(r.fullCost) }]),
                ]
              : []
          }
        />
      }
    >
      <FieldRow>
        <Field label="Battery size" value={battery.s} onChange={battery.setS} unit="kWh" />
        <Field
          label="Electricity rate"
          value={rate.s}
          onChange={rate.setS}
          prefix="$"
          unit="per kWh"
        />
      </FieldRow>
      <Chips
        label="Typical rates"
        onPick={rate.setS}
        options={[
          { label: "Home, $0.16", value: "0.16" },
          { label: "Public Level 2, $0.30", value: "0.30" },
          { label: "DC fast charger, $0.48", value: "0.48" },
        ]}
      />
      <FieldRow>
        <Field label="Start charge" value={from.s} onChange={from.setS} unit="%" />
        <Field label="End charge" value={to.s} onChange={to.setS} unit="%" />
      </FieldRow>
      <FieldRow>
        <Field
          label="Charging efficiency"
          value={eff.s}
          onChange={eff.setS}
          unit="%"
          hint="Energy that reaches the battery. 85 to 95% is common."
        />
        <Field
          label="Driving efficiency"
          value={mikwh.s}
          onChange={mikwh.setS}
          unit="miles per kWh"
          hint="Used for range and cost per mile"
        />
      </FieldRow>
    </CalcLayout>
  );
}
