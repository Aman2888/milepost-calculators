"use client";

import { useId, useState, type ReactNode } from "react";
import { parse } from "@/lib/format";

/* ------------------------------------------------------------------ */
/* State                                                               */
/* ------------------------------------------------------------------ */

/** Keeps the raw text (so people can clear a field) and the parsed number. */
export function useNum(initial: string) {
  const [s, setS] = useState(initial);
  return { s, setS, n: parse(s) };
}
export type NumState = ReturnType<typeof useNum>;

/* ------------------------------------------------------------------ */
/* Inputs                                                              */
/* ------------------------------------------------------------------ */

type FieldProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  unit?: string;
  prefix?: string;
  hint?: string;
  placeholder?: string;
  /** false for free text such as a tire size */
  numeric?: boolean;
};

export function Field({
  label,
  value,
  onChange,
  unit,
  prefix,
  hint,
  placeholder,
  numeric = true,
}: FieldProps) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      <div className="mt-1.5 flex items-center rounded-xl border-2 border-ink/25 bg-white/70 transition-colors focus-within:border-sign focus-within:bg-white focus-within:ring-4 focus-within:ring-sign/20">
        {prefix && <span className="pl-3.5 text-ink-soft">{prefix}</span>}
        <input
          id={id}
          value={value}
          placeholder={placeholder}
          inputMode={numeric ? "decimal" : "text"}
          autoComplete="off"
          onChange={(e) =>
            onChange(numeric ? e.target.value.replace(/[^\d.,-]/g, "") : e.target.value)
          }
          className="min-w-0 flex-1 bg-transparent px-3.5 py-3 text-lg font-medium tabular-nums outline-none placeholder:text-ink-soft/60"
        />
        {unit && <span className="whitespace-nowrap pr-3.5 text-sm text-ink-soft">{unit}</span>}
      </div>
      {hint && <p className="mt-1 text-xs text-ink-soft">{hint}</p>}
    </div>
  );
}

export function FieldRow({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

export function Segmented<T extends string | number>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div>
      <p className="text-sm font-semibold">{label}</p>
      <div
        role="radiogroup"
        aria-label={label}
        className="mt-1.5 inline-flex flex-wrap gap-1 rounded-xl bg-paper-deep p-1"
      >
        {options.map((o) => {
          const on = o.value === value;
          return (
            <button
              key={String(o.value)}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => onChange(o.value)}
              className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors ${
                on ? "bg-ink text-white" : "text-ink hover:bg-white/60"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Chips({
  label,
  options,
  onPick,
}: {
  label: string;
  options: { label: string; value: string }[];
  onPick: (v: string) => void;
}) {
  return (
    <div>
      <p className="text-sm font-semibold">{label}</p>
      <div className="mt-1.5 flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.label}
            type="button"
            onClick={() => onPick(o.value)}
            className="rounded-full border-2 border-ink/20 bg-white/60 px-3 py-1.5 text-sm transition-colors hover:border-ink hover:bg-white"
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Layout                                                              */
/* ------------------------------------------------------------------ */

export function CalcLayout({ children, sign }: { children: ReactNode; sign: ReactNode }) {
  return (
    <div className="grid items-start gap-7 lg:grid-cols-12 lg:gap-9">
      <div className="space-y-5 rounded-3xl border border-ink/20 bg-card p-5 sm:p-7 lg:col-span-7">
        {children}
      </div>
      <div className="lg:sticky lg:top-6 lg:col-span-5">{sign}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Result sign                                                         */
/* ------------------------------------------------------------------ */

type SignTone = "blue" | "yellow" | "green";

const SIGN: Record<SignTone, { box: string; border: string; sub: string; line: string }> = {
  blue: {
    box: "bg-sign text-white shadow-[0_10px_0_var(--color-sign-deep)]",
    border: "border-white",
    sub: "text-white/80",
    line: "border-white/25",
  },
  yellow: {
    box: "bg-hwy text-ink shadow-[0_10px_0_#b98614]",
    border: "border-ink",
    sub: "text-ink/75",
    line: "border-ink/25",
  },
  green: {
    box: "bg-[#1f7a4d] text-white shadow-[0_10px_0_#145636]",
    border: "border-white",
    sub: "text-white/80",
    line: "border-white/25",
  },
};

export type SignRow = { label: string; value: string };

/**
 * The result panel, styled like a highway sign. Yellow is used as a warning,
 * green when everything looks fine, blue otherwise.
 */
export function Sign({
  tone = "blue",
  label,
  value,
  unit,
  rows = [],
  extra,
  empty = "Enter valid numbers to see your result.",
}: {
  tone?: SignTone;
  label: string;
  value: string | null;
  unit?: string;
  rows?: SignRow[];
  extra?: ReactNode;
  empty?: string;
}) {
  const t = SIGN[tone];
  return (
    <section
      aria-live="polite"
      className={`rounded-[30px] p-2.5 transition-colors duration-300 ${t.box}`}
    >
      <div className={`rounded-[22px] border-[3px] px-5 py-6 sm:px-7 ${t.border}`}>
        <p className={`text-base font-medium ${t.sub}`}>{label}</p>
        {value === null ? (
          <p className="mt-3 font-display text-2xl font-semibold leading-snug">{empty}</p>
        ) : (
          <>
            <p className="mt-1 break-words font-display text-5xl font-bold leading-none tracking-tight tabular-nums sm:text-6xl">
              {value}
              {unit && <span className={`ml-2 text-xl font-semibold ${t.sub}`}>{unit}</span>}
            </p>
            {rows.length > 0 && (
              <dl className="mt-6">
                {rows.map((r) => (
                  <div
                    key={r.label}
                    className={`flex items-baseline justify-between gap-4 border-t py-2.5 ${t.line}`}
                  >
                    <dt className={t.sub}>{r.label}</dt>
                    <dd className="text-right font-semibold tabular-nums">{r.value}</dd>
                  </div>
                ))}
              </dl>
            )}
            {extra}
          </>
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Small visuals that live inside the sign                             */
/* ------------------------------------------------------------------ */

/** Red-to-green scale with a marker. Used for MPG. */
export function Meter({
  value,
  min,
  max,
  minLabel,
  maxLabel,
}: {
  value: number;
  min: number;
  max: number;
  minLabel: string;
  maxLabel: string;
}) {
  const pct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  return (
    <div className="mt-6">
      <div
        className="relative h-3 rounded-full"
        style={{ background: "linear-gradient(90deg,#cc4437,#f3b32a 50%,#5e9a5b)" }}
      >
        <span
          className="absolute top-1/2 h-6 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded bg-white ring-2 ring-ink transition-[left] duration-500"
          style={{ left: `${pct}%` }}
        />
      </div>
      <div className="mt-2 flex justify-between text-xs text-white/80">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}

export const SIGN_COLORS = ["#f3b32a", "#ffffff", "#8cc4ff", "#7fd18b"];

/** One bar split into labelled parts, with a legend underneath. */
export function StackBar({
  parts,
}: {
  parts: { label: string; value: number; display: string }[];
}) {
  const total = parts.reduce((s, p) => s + p.value, 0);
  if (total <= 0) return null;
  return (
    <div className="mt-6">
      <div className="flex h-3.5 overflow-hidden rounded-full bg-white/20">
        {parts.map((p, i) =>
          p.value > 0 ? (
            <span
              key={p.label}
              className="transition-[width] duration-500"
              style={{
                width: `${(p.value / total) * 100}%`,
                background: SIGN_COLORS[i % SIGN_COLORS.length],
              }}
            />
          ) : null,
        )}
      </div>
      <ul className="mt-3 grid gap-1.5 text-sm">
        {parts.map((p, i) => (
          <li key={p.label} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <i
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: SIGN_COLORS[i % SIGN_COLORS.length] }}
              />
              {p.label}
            </span>
            <span className="tabular-nums">{p.display}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SignNote({ children }: { children: ReactNode }) {
  return <p className="mt-5 text-sm leading-relaxed opacity-90">{children}</p>;
}
