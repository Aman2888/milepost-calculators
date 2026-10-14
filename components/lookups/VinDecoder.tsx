"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { prettyName, type VinResult } from "@/lib/nhtsa";
import { CalcLayout, Chips, Field, Sign, SignNote } from "@/components/ui";
import { Card, Loading, Notice, PrimaryButton, SourceNote, useLookup } from "./shared";

const VIN_OK = /^[A-HJ-NPR-Z0-9]{17}$/;
const EXAMPLE = "1HGCM82633A004352";

type Row = { key: string; label: string; fmt?: (v: string) => string };

const litres = (v: string) => (Number.isFinite(Number(v)) ? `${Number(v).toFixed(1)} L` : v);

/** What to show, in what order. Rows NHTSA left empty are skipped. */
const GROUPS: { title: string; rows: Row[] }[] = [
  {
    title: "Vehicle",
    rows: [
      { key: "ModelYear", label: "Model year" },
      { key: "Make", label: "Make", fmt: prettyName },
      { key: "Model", label: "Model" },
      { key: "Trim", label: "Trim" },
      { key: "Series", label: "Series" },
      { key: "VehicleType", label: "Vehicle type", fmt: prettyName },
      { key: "BodyClass", label: "Body type" },
      { key: "Doors", label: "Doors" },
      { key: "Seats", label: "Seats" },
      { key: "GVWR", label: "Gross weight class" },
    ],
  },
  {
    title: "Engine and fuel",
    rows: [
      { key: "DisplacementL", label: "Engine size", fmt: litres },
      { key: "EngineCylinders", label: "Cylinders" },
      { key: "EngineConfiguration", label: "Layout" },
      { key: "EngineHP", label: "Power", fmt: (v) => `${v} hp` },
      { key: "EngineModel", label: "Engine model" },
      { key: "Turbo", label: "Turbo" },
      { key: "FuelTypePrimary", label: "Fuel" },
      { key: "FuelTypeSecondary", label: "Second fuel" },
      { key: "ElectrificationLevel", label: "Electrification" },
    ],
  },
  {
    title: "Drivetrain",
    rows: [
      { key: "DriveType", label: "Drive" },
      { key: "TransmissionStyle", label: "Transmission" },
      { key: "TransmissionSpeeds", label: "Gears" },
    ],
  },
  {
    title: "Safety equipment",
    rows: [
      { key: "ABS", label: "Anti-lock brakes" },
      { key: "ESC", label: "Stability control" },
      { key: "TractionControl", label: "Traction control" },
      { key: "TPMS", label: "Tire pressure monitor" },
      { key: "AirBagLocFront", label: "Front airbags" },
      { key: "AirBagLocSide", label: "Side airbags" },
      { key: "AirBagLocCurtain", label: "Curtain airbags" },
      { key: "AirBagLocKnee", label: "Knee airbags" },
      { key: "ForwardCollisionWarning", label: "Forward collision warning" },
      { key: "LaneDepartureWarning", label: "Lane departure warning" },
      { key: "BlindSpotMon", label: "Blind spot monitor" },
      { key: "AdaptiveCruiseControl", label: "Adaptive cruise control" },
      { key: "RearVisibilitySystem", label: "Rear camera" },
    ],
  },
  {
    title: "Built by",
    rows: [
      { key: "Manufacturer", label: "Manufacturer" },
      { key: "PlantCompanyName", label: "Plant" },
      { key: "PlantCity", label: "City", fmt: prettyName },
      { key: "PlantState", label: "State", fmt: prettyName },
      { key: "PlantCountry", label: "Country", fmt: prettyName },
    ],
  },
];

export default function VinDecoder() {
  const [vin, setVin] = useState("");
  const [state, run] = useLookup<VinResult>();

  const valid = VIN_OK.test(vin);
  const busy = state.status === "loading";

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    if (valid) void run({ op: "vin", vin });
  };

  const pick = (v: string) => {
    setVin(v);
    void run({ op: "vin", vin: v });
  };

  const data = state.status === "done" ? state.data : null;
  const f = data?.fields ?? {};
  const decoded = Boolean(data && f.Make && (f.Model || f.ModelYear));

  const title = decoded ? [f.ModelYear, prettyName(f.Make), f.Model].filter(Boolean).join(" ") : null;

  const engine = [
    f.DisplacementL ? litres(f.DisplacementL) : "",
    f.EngineCylinders ? `${f.EngineCylinders}-cyl` : "",
    f.EngineHP ? `${f.EngineHP} hp` : "",
  ]
    .filter(Boolean)
    .join(" · ");

  const rows = [
    f.BodyClass && { label: "Body type", value: f.BodyClass },
    engine && { label: "Engine", value: engine },
    f.FuelTypePrimary && { label: "Fuel", value: f.FuelTypePrimary },
    f.DriveType && { label: "Drive", value: f.DriveType },
  ].filter((r): r is { label: string; value: string } => Boolean(r));

  const notes = (data?.errorText ?? "")
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);
  const hasProblem = Boolean(data && data.errorCode.split(",").some((c) => c.trim() && c.trim() !== "0"));

  const groups = GROUPS.map((g) => ({
    title: g.title,
    rows: g.rows
      .filter((r) => f[r.key])
      .map((r) => ({ label: r.label, value: r.fmt ? r.fmt(f[r.key]) : f[r.key] })),
  })).filter((g) => g.rows.length > 0);

  const here = decoded && f.ModelYear && f.Make && f.Model;
  const qs = here
    ? new URLSearchParams({ year: f.ModelYear, make: f.Make, model: f.Model }).toString()
    : "";

  let sign;
  if (state.status === "error") {
    sign = <Sign tone="yellow" label="VIN decoder" value={null} empty={state.message} />;
  } else if (busy) {
    sign = <Sign label="VIN decoder" value={null} empty="Asking NHTSA…" />;
  } else if (data && !decoded) {
    sign = (
      <Sign
        tone="yellow"
        label="VIN decoder"
        value={null}
        empty="NHTSA could not match this VIN to a vehicle."
      />
    );
  } else if (data) {
    sign = (
      <Sign
        label="This VIN is a"
        value={title}
        compact
        rows={rows}
        extra={<SignNote>{f.Trim ? `Trim: ${f.Trim}. ` : ""}Decoded from NHTSA’s vPIC database.</SignNote>}
      />
    );
  } else {
    sign = <Sign label="VIN decoder" value={null} empty="Enter a 17-character VIN to see what it says." />;
  }

  return (
    <div className="space-y-7">
      <CalcLayout sign={sign}>
        <form onSubmit={submit} className="space-y-5">
          <Field
            label="Vehicle identification number (VIN)"
            value={vin}
            onChange={(v) => setVin(v.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 17))}
            numeric={false}
            placeholder="17 letters and numbers"
            unit={`${vin.length}/17`}
            hint="Find it on the dashboard by the windshield, on the driver’s door jamb sticker, or on your registration and insurance card."
          />
          {vin.length === 17 && !valid && (
            <Notice tone="warn">
              VINs never contain the letters I, O or Q. Check for a 1 or 0 that was typed as a
              letter.
            </Notice>
          )}
          <div className="flex flex-wrap items-center gap-3">
            <PrimaryButton type="submit" disabled={!valid || busy}>
              {busy ? "Decoding…" : "Decode VIN"}
            </PrimaryButton>
            {busy && <Loading>Asking NHTSA…</Loading>}
          </div>
        </form>
        <Chips
          label="Just want to see how it works?"
          onPick={pick}
          options={[{ label: `Try an example: ${EXAMPLE}`, value: EXAMPLE }]}
        />
      </CalcLayout>

      {data && hasProblem && notes.length > 0 && (
        <Notice tone={decoded ? "info" : "warn"} title="Notes from NHTSA about this VIN">
          <ul className="list-disc space-y-1 pl-5">
            {notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </Notice>
      )}

      {decoded && (
        <>
          <div className="grid gap-5 md:grid-cols-2">
            {groups.map((g) => (
              <Card key={g.title} title={g.title}>
                <dl>
                  {g.rows.map((r) => (
                    <div
                      key={r.label}
                      className="flex items-baseline justify-between gap-4 border-t border-ink/10 py-2.5 first:border-t-0 first:pt-0"
                    >
                      <dt className="text-ink-soft">{r.label}</dt>
                      <dd className="text-right font-semibold">{r.value}</dd>
                    </div>
                  ))}
                </dl>
              </Card>
            ))}
          </div>

          {here && (
            <Card title="More about this vehicle">
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { href: "/recall-checker", label: "Check recalls" },
                  { href: "/vehicle-safety-ratings", label: "See crash-test ratings" },
                  { href: "/common-problems-lookup", label: "Read owner complaints" },
                ].map((l) => (
                  <Link
                    key={l.href}
                    href={`${l.href}?${qs}`}
                    className="rounded-full border-2 border-ink px-5 py-3 text-center font-semibold transition-colors hover:bg-ink hover:text-white"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
              <div className="mt-4">
                <SourceNote>
                  Recalls, ratings and complaints are looked up by year, make and model, so they
                  cover every {title} and not only this one car.
                </SourceNote>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
