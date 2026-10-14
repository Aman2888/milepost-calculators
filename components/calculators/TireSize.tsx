"use client";

import { useState } from "react";
import { parseTireSize, tireCompare } from "@/lib/calc";
import { fixed, num, signed } from "@/lib/format";
import {
  CalcLayout,
  Field,
  Sign,
  SignNote,
  useNum,
  type NumState,
} from "@/components/ui";

function TireBlock({
  title,
  width,
  aspect,
  rim,
}: {
  title: string;
  width: NumState;
  aspect: NumState;
  rim: NumState;
}) {
  const [paste, setPaste] = useState("");

  function onPaste(text: string) {
    setPaste(text);
    const t = parseTireSize(text);
    if (t) {
      width.setS(String(t.width));
      aspect.setS(String(t.aspect));
      rim.setS(String(t.rim));
    }
  }

  const bad = paste.trim() !== "" && !parseTireSize(paste);

  return (
    <fieldset className="space-y-4 rounded-2xl bg-paper-deep/60 p-4">
      <legend className="px-1 font-display text-lg font-bold">{title}</legend>
      <Field
        label="Type or paste a size"
        value={paste}
        onChange={onPaste}
        placeholder="225/45R17"
        numeric={false}
        hint={bad ? "Use a format like 225/45R17" : "Or fill in the three boxes below"}
      />
      <div className="grid grid-cols-3 gap-3">
        <Field label="Width" value={width.s} onChange={width.setS} unit="mm" />
        <Field label="Aspect" value={aspect.s} onChange={aspect.setS} unit="%" />
        <Field label="Rim" value={rim.s} onChange={rim.setS} unit="in" />
      </div>
    </fieldset>
  );
}

export default function TireSize() {
  const ow = useNum("225");
  const oa = useNum("45");
  const orim = useNum("17");
  const nw = useNum("235");
  const na = useNum("40");
  const nrim = useNum("18");
  const speed = useNum("60");

  const r = tireCompare(
    { width: ow.n, aspect: oa.n, rim: orim.n },
    { width: nw.n, aspect: na.n, rim: nrim.n },
    speed.n,
  );

  const withinLimit = r ? Math.abs(r.diffPct) <= 3 : true;

  return (
    <CalcLayout
      sign={
        <Sign
          tone={withinLimit ? "green" : "yellow"}
          label="Overall diameter change"
          value={r ? `${signed(r.diffPct, 1)}%` : null}
          empty="Fill in every size box with a number above zero."
          rows={
            r
              ? [
                  {
                    label: "Current diameter",
                    value: `${fixed(r.old.diameterIn, 1)} in (${num(r.old.diameter, 0)} mm)`,
                  },
                  {
                    label: "New diameter",
                    value: `${fixed(r.next.diameterIn, 1)} in (${num(r.next.diameter, 0)} mm)`,
                  },
                  { label: "Difference", value: `${signed(r.diffMm, 1)} mm` },
                  {
                    label: `Real speed when it reads ${num(speed.n, 0)}`,
                    value: `${fixed(r.actualSpeed, 1)} mph`,
                  },
                  { label: "Sidewall height", value: `${signed(r.sidewallDiff, 1)} mm` },
                  { label: "Tire width", value: `${signed(r.widthDiff, 0)} mm` },
                ]
              : []
          }
          extra={
            r ? (
              <SignNote>
                {withinLimit
                  ? "Within about 3%, so the speedometer and gearing should stay close to stock."
                  : "More than 3% off. Expect a noticeable speedometer error, and check that the tire clears the fender and suspension."}
              </SignNote>
            ) : null
          }
        />
      }
    >
      <div className="grid gap-4 md:grid-cols-2">
        <TireBlock title="Current tire" width={ow} aspect={oa} rim={orim} />
        <TireBlock title="New tire" width={nw} aspect={na} rim={nrim} />
      </div>
      <Field
        label="Speedometer reading to check"
        value={speed.s}
        onChange={speed.setS}
        unit="mph"
        hint="We show your real speed when the dash says this"
      />
    </CalcLayout>
  );
}
