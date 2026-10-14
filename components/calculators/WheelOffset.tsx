"use client";

import { wheelOffset } from "@/lib/calc";
import { fixed, signed } from "@/lib/format";
import {
  CalcLayout,
  Field,
  Sign,
  SignNote,
  useNum,
  type NumState,
} from "@/components/ui";

type Edges = { inner: number; outer: number };

/** Top-down sketch: the hub face is the dashed line, the fender side is on the right. */
function OffsetDiagram({ current, next }: { current: Edges; next: Edges }) {
  const W = 360;
  const left = Math.max(current.inner, next.inner, 10);
  const right = Math.max(current.outer, next.outer, 10);
  const scale = Math.min(150 / left, 130 / right, 1.6);
  const x0 = (W - (left + right) * scale) / 2 + left * scale;

  const rect = (e: Edges) => ({ x: x0 - e.inner * scale, w: (e.inner + e.outer) * scale });
  const a = rect(current);
  const b = rect(next);

  return (
    <figure className="rounded-2xl bg-paper-deep/60 p-4">
      <svg
        viewBox={`0 0 ${W} 150`}
        role="img"
        aria-label="Top-down view comparing where the current and new wheel sit relative to the hub face"
        className="h-auto w-full"
      >
        <line x1={x0} x2={x0} y1="8" y2="118" stroke="#1e2b37" strokeWidth="1.5" strokeDasharray="5 4" />
        <text x={x0 + 6} y="16" fontSize="11" className="fill-ink-soft">
          Hub face
        </text>

        <text x={a.x} y="34" fontSize="11" className="fill-ink-soft">
          Current
        </text>
        <rect x={a.x} y="40" width={a.w} height="26" rx="6" fill="none" stroke="#1e2b37" strokeWidth="2" strokeDasharray="6 4" />

        <text x={b.x} y="84" fontSize="11" className="fill-ink">
          New
        </text>
        <rect x={b.x} y="90" width={b.w} height="26" rx="6" fill="#f3b32a" stroke="#1e2b37" strokeWidth="2" />

        <text x="4" y="142" fontSize="11" className="fill-ink-soft">
          Suspension side
        </text>
        <text x={W - 4} y="142" fontSize="11" textAnchor="end" className="fill-ink-soft">
          Fender side
        </text>
      </svg>
    </figure>
  );
}

function WheelBlock({
  title,
  width,
  offset,
}: {
  title: string;
  width: NumState;
  offset: NumState;
}) {
  return (
    <fieldset className="space-y-4 rounded-2xl bg-paper-deep/60 p-4">
      <legend className="px-1 font-display text-lg font-bold">{title}</legend>
      <Field label="Wheel width" value={width.s} onChange={width.setS} unit="inches" />
      <Field
        label="Offset (ET)"
        value={offset.s}
        onChange={offset.setS}
        unit="mm"
        hint="Printed on the back of the wheel"
      />
    </fieldset>
  );
}

export default function WheelOffset() {
  const ow = useNum("8");
  const oo = useNum("35");
  const nw = useNum("9");
  const no = useNum("30");

  const r = wheelOffset(
    { widthIn: ow.n, offsetMm: oo.n },
    { widthIn: nw.n, offsetMm: no.n },
  );

  const big = r ? Math.max(Math.abs(r.outerShift), Math.abs(r.innerShift)) > 12.7 : false;

  const outerUnit = !r || Math.abs(r.outerShift) < 0.05 ? "mm" : r.outerShift > 0 ? "mm out" : "mm in";
  const innerText = !r
    ? ""
    : Math.abs(r.innerShift) < 0.05
      ? "No change"
      : r.innerShift > 0
        ? `${fixed(r.innerShift, 1)} mm closer to the suspension`
        : `${fixed(-r.innerShift, 1)} mm more clearance`;

  return (
    <CalcLayout
      sign={
        <Sign
          tone={big ? "yellow" : "blue"}
          label="Outer edge of the wheel moves"
          value={r ? fixed(Math.abs(r.outerShift), 1) : null}
          unit={r ? outerUnit : undefined}
          empty="Enter a width above zero and an offset for both wheels."
          rows={
            r
              ? [
                  { label: "Same shift in inches", value: `${fixed(Math.abs(r.outerShift) / 25.4, 2)} in` },
                  { label: "Inner edge", value: innerText },
                  {
                    label: "Backspacing",
                    value: `${fixed(r.old.inner / 25.4, 2)} to ${fixed(r.next.inner / 25.4, 2)} in`,
                  },
                  { label: "Wheel width", value: `${signed(r.widthChangeIn, 1)} in` },
                ]
              : []
          }
          extra={
            r && big ? (
              <SignNote>
                A shift of more than half an inch can rub on the fender or suspension. Check
                clearance before you buy.
              </SignNote>
            ) : null
          }
        />
      }
    >
      <div className="grid gap-4 md:grid-cols-2">
        <WheelBlock title="Current wheel" width={ow} offset={oo} />
        <WheelBlock title="New wheel" width={nw} offset={no} />
      </div>
      {r && <OffsetDiagram current={r.old} next={r.next} />}
      <p className="text-sm text-ink-soft">
        Lower offset moves the wheel out toward the fender. Higher offset pulls it in toward the
        suspension. The tire is not included in this sketch.
      </p>
    </CalcLayout>
  );
}
