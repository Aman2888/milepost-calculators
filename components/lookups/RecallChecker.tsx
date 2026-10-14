"use client";

import { useState } from "react";
import { formatDate, prettyComponent, prettyName, type Recall, type RecallResult } from "@/lib/nhtsa";
import { CalcLayout, Sign, SignNote } from "@/components/ui";
import VehiclePicker, { type Vehicle } from "./VehiclePicker";
import { Card, Pill, SourceNote, useLookup } from "./shared";

const PAGE = 8;

/** NHTSA writes components as "AIR BAGS:FRONTAL:DRIVER SIDE". Split into a title and the detail. */
function splitComponent(raw: string) {
  const [main, ...rest] = raw.split(":").map((x) => x.trim()).filter(Boolean);
  return {
    title: main ? prettyComponent(main) : "Recall",
    detail: rest.map(prettyComponent).join(" › "),
  };
}

function RecallCard({ r }: { r: Recall }) {
  const part = splitComponent(r.component);
  return (
    <article className="rounded-2xl border border-ink/15 bg-white/60 p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
        <div>
          <h3 className="font-display text-lg font-bold leading-snug">{part.title}</h3>
          {part.detail && <p className="text-sm text-ink-soft">{part.detail}</p>}
        </div>
        <p className="text-sm text-ink-soft">
          {r.date && <span>{formatDate(r.date)}</span>}
          {r.date && r.campaign && <span aria-hidden="true"> · </span>}
          {r.campaign && <span>Campaign {r.campaign}</span>}
        </p>
      </div>

      {(r.parkIt || r.parkOutside || r.ota) && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {r.parkIt && <Pill tone="red">Do not drive</Pill>}
          {r.parkOutside && <Pill tone="yellow">Park outside</Pill>}
          {r.ota && <Pill tone="blue">Fixed by software update</Pill>}
        </div>
      )}

      {r.summary && <p className="mt-3 leading-relaxed">{r.summary}</p>}

      {(r.consequence || r.remedy || r.notes) && (
        <details className="group mt-3">
          <summary className="cursor-pointer text-sm font-semibold underline-offset-4 hover:underline">
            What could happen and how it is fixed
          </summary>
          <dl className="mt-3 space-y-3 text-sm leading-relaxed">
            {r.consequence && (
              <div>
                <dt className="font-semibold">What could happen</dt>
                <dd className="text-ink-soft">{r.consequence}</dd>
              </div>
            )}
            {r.remedy && (
              <div>
                <dt className="font-semibold">The fix</dt>
                <dd className="text-ink-soft">{r.remedy}</dd>
              </div>
            )}
            {r.notes && (
              <div>
                <dt className="font-semibold">Notes</dt>
                <dd className="text-ink-soft">{r.notes}</dd>
              </div>
            )}
          </dl>
        </details>
      )}
    </article>
  );
}

export default function RecallChecker() {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [shown, setShown] = useState(PAGE);
  const [state, run] = useLookup<RecallResult>();

  const search = (v: Vehicle) => {
    setVehicle(v);
    setShown(PAGE);
    void run({ op: "recalls", ...v });
  };

  const busy = state.status === "loading";
  const label = vehicle ? `${vehicle.year} ${prettyName(vehicle.make)} ${prettyName(vehicle.model)}` : "";

  let sign;
  if (state.status === "error") {
    sign = <Sign tone="yellow" label="Recall checker" value={null} empty={state.message} />;
  } else if (busy) {
    sign = <Sign label="Recall checker" value={null} empty="Checking NHTSA’s recall records…" />;
  } else if (state.status === "done") {
    const { count, items } = state.data;
    const latest = items.find((i) => i.date)?.date ?? null;
    sign = (
      <Sign
        tone={count > 0 ? "yellow" : "green"}
        label={`Recalls for the ${label}`}
        value={String(count)}
        unit={count === 1 ? "recall" : "recalls"}
        rows={
          count > 0
            ? [
                { label: "Do not drive warnings", value: String(items.filter((i) => i.parkIt).length) },
                { label: "Park outside warnings", value: String(items.filter((i) => i.parkOutside).length) },
                { label: "Fixed by software update", value: String(items.filter((i) => i.ota).length) },
                ...(latest ? [{ label: "Most recent", value: formatDate(latest) }] : []),
              ]
            : []
        }
        extra={
          <SignNote>
            {count === 0
              ? "NHTSA has no recalls on file for this model year. "
              : "These are the recalls issued for this model year. "}
            They do not say whether one particular car has already been repaired. To check a single
            car, enter its VIN at nhtsa.gov/recalls.
          </SignNote>
        }
      />
    );
  } else {
    sign = (
      <Sign label="Recall checker" value={null} empty="Pick a year, make and model to see its safety recalls." />
    );
  }

  const done = state.status === "done" ? state.data : null;

  return (
    <div className="space-y-7">
      <CalcLayout sign={sign}>
        <VehiclePicker kind="recalls" busy={busy} onSubmit={search} button="Check recalls" />
      </CalcLayout>

      {done && done.count > 0 && (
        <Card
          title={`${done.count} ${done.count === 1 ? "recall" : "recalls"}, newest first`}
          aside={<SourceNote>Source: NHTSA</SourceNote>}
        >
          <div className="space-y-4">
            {done.items.slice(0, shown).map((r, i) => (
              <RecallCard key={`${r.campaign}-${i}`} r={r} />
            ))}
          </div>
          {shown < done.count && (
            <button
              type="button"
              onClick={() => setShown((n) => n + PAGE)}
              className="mt-5 rounded-full border-2 border-ink px-5 py-2.5 font-semibold transition-colors hover:bg-ink hover:text-white"
            >
              Show more ({done.count - shown} left)
            </button>
          )}
        </Card>
      )}

      {done && (
        <p className="text-sm text-ink-soft">
          Own one of these cars? The free{" "}
          <a
            href="https://www.nhtsa.gov/recalls"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline underline-offset-4"
          >
            NHTSA VIN recall search
          </a>{" "}
          shows which recalls are still open on your exact vehicle.
        </p>
      )}
    </div>
  );
}
