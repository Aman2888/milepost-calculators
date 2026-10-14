"use client";

import { useState } from "react";
import {
  formatDate,
  prettyComponent,
  prettyName,
  type Complaint,
  type ComplaintResult,
} from "@/lib/nhtsa";
import { num } from "@/lib/format";
import { CalcLayout, Sign, SignNote } from "@/components/ui";
import VehiclePicker, { type Vehicle } from "./VehiclePicker";
import { Card, Pill, SourceNote, useLookup } from "./shared";

const PAGE = 10;
const TOP_AREAS = 10;

function ComplaintCard({ c }: { c: Complaint }) {
  const [open, setOpen] = useState(false);
  const long = c.summary.length > 220;
  return (
    <article className="rounded-2xl border border-ink/15 bg-white/60 p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-sm text-ink-soft">
        <span>
          {c.filed ? `Filed ${formatDate(c.filed)}` : "Filed date unknown"}
          {c.incident && c.incident !== c.filed ? ` · Happened ${formatDate(c.incident)}` : ""}
        </span>
        <span className="flex flex-wrap gap-1.5">
          {c.crash && <Pill tone="red">Crash</Pill>}
          {c.fire && <Pill tone="red">Fire</Pill>}
          {c.injuries > 0 && <Pill tone="yellow">{c.injuries} injured</Pill>}
          {c.deaths > 0 && <Pill tone="red">{c.deaths} died</Pill>}
        </span>
      </div>

      {c.components.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {c.components.map((n) => (
            <Pill key={n}>{prettyComponent(n)}</Pill>
          ))}
        </div>
      )}

      {c.summary && (
        <p className={`mt-3 leading-relaxed ${long && !open ? "line-clamp-3" : ""}`}>{c.summary}</p>
      )}
      {long && (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="mt-1 text-sm font-semibold underline underline-offset-4"
        >
          {open ? "Show less" : "Read more"}
        </button>
      )}
    </article>
  );
}

export default function Complaints() {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [shown, setShown] = useState(PAGE);
  const [state, run] = useLookup<ComplaintResult>();

  const search = (v: Vehicle) => {
    setVehicle(v);
    setShown(PAGE);
    void run({ op: "complaints", ...v });
  };

  const busy = state.status === "loading";
  const label = vehicle ? `${vehicle.year} ${prettyName(vehicle.make)} ${prettyName(vehicle.model)}` : "";
  const done = state.status === "done" ? state.data : null;

  let sign;
  if (state.status === "error") {
    sign = <Sign tone="yellow" label="Common problems" value={null} empty={state.message} />;
  } else if (busy) {
    sign = <Sign label="Common problems" value={null} empty="Reading NHTSA’s complaint records…" />;
  } else if (done) {
    const top = done.components[0];
    sign = (
      <Sign
        tone={done.total === 0 ? "green" : "yellow"}
        label={`Owner complaints, ${label}`}
        value={num(done.total, 0)}
        unit={done.total === 1 ? "complaint" : "complaints"}
        rows={
          done.total > 0
            ? [
                ...(top ? [{ label: "Most reported area", value: prettyComponent(top.name) }] : []),
                { label: "Involved a crash", value: num(done.crashes, 0) },
                { label: "Involved a fire", value: num(done.fires, 0) },
                { label: "Injuries reported", value: num(done.injuries, 0) },
              ]
            : []
        }
        extra={
          <SignNote>
            {done.total === 0
              ? "No complaints are on file with NHTSA for this model year. "
              : "These are reports from owners, not confirmed defects. "}
            Newer and more popular cars collect more complaints, so a bigger number does not always
            mean a worse car.
          </SignNote>
        }
      />
    );
  } else {
    sign = (
      <Sign label="Common problems" value={null} empty="Pick a year, make and model to see what owners report." />
    );
  }

  const areas = done?.components.slice(0, TOP_AREAS) ?? [];
  const max = areas[0]?.count ?? 1;

  return (
    <div className="space-y-7">
      <CalcLayout sign={sign}>
        <VehiclePicker kind="complaints" busy={busy} onSubmit={search} button="Find common problems" />
      </CalcLayout>

      {done && areas.length > 0 && (
        <Card
          title="Where owners report problems"
          aside={<SourceNote>Number of complaints that mention each area</SourceNote>}
        >
          <ol className="space-y-3">
            {areas.map((a) => (
              <li key={a.name}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-semibold">{prettyComponent(a.name)}</span>
                  <span className="shrink-0 text-sm tabular-nums text-ink-soft">
                    {num(a.count, 0)} · {Math.round((a.count / done.total) * 100)}%
                  </span>
                </div>
                <div className="mt-1 h-2.5 rounded-full bg-paper-deep">
                  <div
                    className="h-full rounded-full bg-sign transition-[width] duration-500"
                    style={{ width: `${Math.max(3, (a.count / max) * 100)}%` }}
                  />
                </div>
              </li>
            ))}
          </ol>
          {done.components.length > TOP_AREAS && (
            <div className="mt-4">
              <SourceNote>
                Showing the top {TOP_AREAS} of {done.components.length} problem areas. One complaint
                can mention more than one area.
              </SourceNote>
            </div>
          )}
        </Card>
      )}

      {done && done.latest.length > 0 && (
        <Card
          title="Latest complaints"
          aside={<SourceNote>Written by owners, shown as filed with NHTSA</SourceNote>}
        >
          <div className="space-y-4">
            {done.latest.slice(0, shown).map((c, i) => (
              <ComplaintCard key={`${c.id}-${i}`} c={c} />
            ))}
          </div>
          {shown < done.latest.length && (
            <button
              type="button"
              onClick={() => setShown((n) => n + PAGE)}
              className="mt-5 rounded-full border-2 border-ink px-5 py-2.5 font-semibold transition-colors hover:bg-ink hover:text-white"
            >
              Show more
            </button>
          )}
          {done.total > done.latest.length && (
            <div className="mt-4">
              <SourceNote>
                Showing the {done.latest.length} most recent of {num(done.total, 0)} complaints.
              </SourceNote>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
