"use client";

import { useState } from "react";
import { prettyName, type Rating, type RatingResult } from "@/lib/nhtsa";
import { CalcLayout, Sign, SignNote } from "@/components/ui";
import VehiclePicker, { type Vehicle } from "./VehiclePicker";
import { Card, Notice, Pill, SourceNote, Stars, useLookup } from "./shared";

/** "4 stars", or "4 to 5 stars" when the versions of one model differ. */
function range(values: (number | null)[]) {
  const v = values.filter((x): x is number => x !== null);
  if (v.length === 0) return null;
  const lo = Math.min(...v);
  const hi = Math.max(...v);
  return lo === hi ? `${lo} ${lo === 1 ? "star" : "stars"}` : `${lo} to ${hi} stars`;
}

function Row({ label, value, sub }: { label: string; value: number | null; sub?: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-t border-ink/10 py-3 first:border-t-0 first:pt-0">
      <div>
        <p className="font-semibold">{label}</p>
        {sub && <p className="text-xs text-ink-soft">{sub}</p>}
      </div>
      <Stars value={value} />
    </div>
  );
}

function feature(v: string) {
  if (!v) return null;
  const t = v.toLowerCase();
  if (t.includes("standard")) return <Pill tone="blue">Standard</Pill>;
  if (t.includes("optional")) return <Pill tone="yellow">Optional</Pill>;
  return <Pill>{v}</Pill>;
}

function VariantCard({ r }: { r: Rating }) {
  const feats = [
    { label: "Electronic stability control", v: r.esc },
    { label: "Forward collision warning", v: r.fcw },
    { label: "Lane departure warning", v: r.ldw },
  ].filter((f) => f.v);

  const sideDetail =
    r.sideDriver !== null || r.sidePassenger !== null
      ? `Driver ${r.sideDriver ?? "n/a"}, passenger ${r.sidePassenger ?? "n/a"}`
      : undefined;
  const frontDetail =
    r.frontDriver !== null || r.frontPassenger !== null
      ? `Driver ${r.frontDriver ?? "n/a"}, passenger ${r.frontPassenger ?? "n/a"}`
      : undefined;

  return (
    <Card title={prettyName(r.description) || "Vehicle"}>
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <div className="rounded-2xl bg-paper-deep/60 p-4">
            <Row label="Overall" value={r.overall} />
          </div>
          <div className="mt-4">
            <Row label="Frontal crash" value={r.front} sub={frontDetail} />
            <Row label="Side crash" value={r.side} sub={sideDetail} />
            {r.pole !== null && <Row label="Side pole crash" value={r.pole} />}
            <Row
              label="Rollover"
              value={r.rollover}
              sub={
                r.rolloverChance !== null
                  ? `About ${(r.rolloverChance * 100).toFixed(1)}% chance of rolling over in a single-vehicle crash`
                  : undefined
              }
            />
          </div>
        </div>

        <div className="space-y-5">
          {feats.length > 0 && (
            <div>
              <h3 className="font-display text-lg font-bold">Recommended safety technology</h3>
              <ul className="mt-2">
                {feats.map((f) => (
                  <li
                    key={f.label}
                    className="flex items-center justify-between gap-3 border-t border-ink/10 py-2.5 first:border-t-0"
                  >
                    <span>{f.label}</span>
                    {feature(f.v)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(r.recalls !== null || r.complaints !== null || r.investigations !== null) && (
            <div>
              <h3 className="font-display text-lg font-bold">On file with NHTSA</h3>
              <dl className="mt-2">
                {[
                  { label: "Recalls", v: r.recalls },
                  { label: "Owner complaints", v: r.complaints },
                  { label: "Investigations", v: r.investigations },
                ]
                  .filter((x) => x.v !== null)
                  .map((x) => (
                    <div
                      key={x.label}
                      className="flex justify-between gap-3 border-t border-ink/10 py-2.5 first:border-t-0"
                    >
                      <dt>{x.label}</dt>
                      <dd className="font-semibold tabular-nums">{x.v}</dd>
                    </div>
                  ))}
              </dl>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

export default function SafetyRatings() {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [state, run] = useLookup<RatingResult>();

  const search = (v: Vehicle) => {
    setVehicle(v);
    void run({ op: "ratings", ...v });
  };

  const busy = state.status === "loading";
  const label = vehicle ? `${vehicle.year} ${prettyName(vehicle.make)} ${prettyName(vehicle.model)}` : "";
  const done = state.status === "done" ? state.data : null;

  let sign;
  if (state.status === "error") {
    sign = <Sign tone="yellow" label="Safety ratings" value={null} empty={state.message} />;
  } else if (busy) {
    sign = <Sign label="Safety ratings" value={null} empty="Checking NHTSA’s crash-test results…" />;
  } else if (done) {
    const overall = range(done.items.map((i) => i.overall));
    if (!overall) {
      sign = (
        <Sign
          tone="yellow"
          label={label}
          value={null}
          empty="NHTSA has not given this vehicle an overall star rating."
        />
      );
    } else {
      const best = Math.max(...done.items.map((i) => i.overall ?? 0));
      sign = (
        <Sign
          tone={best >= 4 ? "green" : "yellow"}
          label={`NHTSA overall rating, ${label}`}
          value={overall}
          rows={[
            { label: "Frontal crash", value: range(done.items.map((i) => i.front)) ?? "Not rated" },
            { label: "Side crash", value: range(done.items.map((i) => i.side)) ?? "Not rated" },
            { label: "Rollover", value: range(done.items.map((i) => i.rollover)) ?? "Not rated" },
          ]}
          extra={
            <SignNote>
              Five stars is best. Compare cars of a similar size and weight, because the crash
              ratings are not meant to be compared across very different vehicles.
            </SignNote>
          }
        />
      );
    }
  } else {
    sign = (
      <Sign label="Safety ratings" value={null} empty="Pick a year, make and model to see its crash-test stars." />
    );
  }

  return (
    <div className="space-y-7">
      <CalcLayout sign={sign}>
        <VehiclePicker kind="ratings" busy={busy} onSubmit={search} button="Show ratings" />
      </CalcLayout>

      {done && done.items.length === 0 && (
        <Notice title="No ratings found">
          NHTSA has not published star ratings for this vehicle. Many trucks, vans, older models and
          low-volume cars are never tested. Car Recall Check and Car Complaints by Model may still
          have information.
        </Notice>
      )}

      {done && done.items.length > 1 && (
        <p className="text-sm text-ink-soft">
          NHTSA rates each version of this model separately (for example two-door, four-door or
          all-wheel drive), so there are {done.items.length} cards below.
        </p>
      )}

      {done?.items.map((r) => <VariantCard key={r.id} r={r} />)}

      {done && done.items.length > 0 && (
        <SourceNote>
          Ratings come from NHTSA’s New Car Assessment Program (NCAP) five-star program. A blank
          rating means that test was not done for this vehicle.
        </SourceNote>
      )}
    </div>
  );
}
