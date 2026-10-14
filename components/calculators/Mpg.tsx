"use client";

import { mpgCalc } from "@/lib/calc";
import { fixed } from "@/lib/format";
import { CalcLayout, Field, FieldRow, Meter, Sign, useNum } from "@/components/ui";

export default function Mpg() {
  const miles = useNum("420");
  const gallons = useNum("13.5");

  const r = mpgCalc(miles.n, gallons.n);

  return (
    <CalcLayout
      sign={
        <Sign
          label="Your fuel economy"
          value={r ? fixed(r.mpg, 1) : null}
          unit="MPG"
          rows={
            r
              ? [
                  { label: "Litres per 100 km", value: fixed(r.lPer100km, 1) },
                  { label: "Kilometres per litre", value: fixed(r.kmPerL, 1) },
                ]
              : []
          }
          extra={
            r ? (
              <Meter value={r.mpg} min={10} max={60} minLabel="10 MPG" maxLabel="60 MPG" />
            ) : null
          }
        />
      }
    >
      <FieldRow>
        <Field
          label="Miles driven"
          value={miles.s}
          onChange={miles.setS}
          unit="miles"
          hint="Since your last fill-up"
        />
        <Field
          label="Fuel added"
          value={gallons.s}
          onChange={gallons.setS}
          unit="gallons"
          hint="What the pump says at the next fill-up"
        />
      </FieldRow>
      <p className="rounded-2xl bg-paper-deep/70 p-4 text-sm text-ink-soft">
        Fill the tank, reset the trip meter, drive as usual, then fill up again. Enter the trip
        meter reading and the gallons you just added.
      </p>
    </CalcLayout>
  );
}
