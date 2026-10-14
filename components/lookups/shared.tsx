"use client";

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { api } from "@/lib/nhtsa";

/* ------------------------------------------------------------------ */
/* Loading a lookup                                                    */
/* ------------------------------------------------------------------ */

export type LookupState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "done"; data: T };

/** Runs one lookup at a time. Starting a new one cancels the one still running. */
export function useLookup<T>() {
  const [state, setState] = useState<LookupState<T>>({ status: "idle" });
  const ctl = useRef<AbortController | null>(null);

  const run = useCallback(async (params: Record<string, string>) => {
    ctl.current?.abort();
    const c = new AbortController();
    ctl.current = c;
    setState({ status: "loading" });
    try {
      const data = await api<T>(params, c.signal);
      if (!c.signal.aborted) setState({ status: "done", data });
    } catch (e) {
      if (c.signal.aborted) return;
      setState({
        status: "error",
        message: e instanceof Error ? e.message : "Something went wrong. Please try again.",
      });
    }
  }, []);

  useEffect(() => () => ctl.current?.abort(), []);
  return [state, run] as const;
}

/* ------------------------------------------------------------------ */
/* Inputs and small pieces                                             */
/* ------------------------------------------------------------------ */

export function Select({
  label,
  value,
  onChange,
  options,
  placeholder,
  disabled,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  disabled?: boolean;
  hint?: string;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      <div
        className={`mt-1.5 rounded-xl border-2 border-ink/25 bg-white/70 transition-colors focus-within:border-sign focus-within:bg-white focus-within:ring-4 focus-within:ring-sign/20 ${
          disabled ? "opacity-55" : ""
        }`}
      >
        <select
          id={id}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="w-full cursor-pointer bg-transparent px-3 py-3 text-lg font-medium outline-none disabled:cursor-not-allowed"
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      {hint && <p className="mt-1 text-xs text-ink-soft">{hint}</p>}
    </div>
  );
}

export function PrimaryButton({
  children,
  disabled,
  onClick,
  type = "button",
}: {
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="rounded-full bg-ink px-6 py-3 font-semibold text-white transition-colors hover:bg-sign disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:bg-ink"
    >
      {children}
    </button>
  );
}

export function Notice({
  tone = "info",
  title,
  children,
}: {
  tone?: "info" | "warn";
  title?: string;
  children: ReactNode;
}) {
  const box =
    tone === "warn"
      ? "border-hwy bg-hwy/15"
      : "border-ink/20 bg-paper-deep/60";
  return (
    <div role={tone === "warn" ? "alert" : undefined} className={`rounded-2xl border-2 p-4 text-sm leading-relaxed ${box}`}>
      {title && <p className="font-semibold">{title}</p>}
      <div className={title ? "mt-1" : ""}>{children}</div>
    </div>
  );
}

/** A white card that holds a block of results below the form and sign. */
export function Card({
  title,
  aside,
  children,
}: {
  title?: string;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-ink/20 bg-card p-5 sm:p-7">
      {(title || aside) && (
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          {title && <h2 className="font-display text-2xl font-bold">{title}</h2>}
          {aside}
        </div>
      )}
      {children}
    </section>
  );
}

export function SourceNote({ children }: { children: ReactNode }) {
  return <p className="text-sm leading-relaxed text-ink-soft">{children}</p>;
}

export function Pill({
  children,
  tone = "plain",
}: {
  children: ReactNode;
  tone?: "plain" | "red" | "yellow" | "blue";
}) {
  const cls = {
    plain: "bg-paper-deep text-ink",
    red: "bg-route text-white",
    yellow: "bg-hwy text-ink",
    blue: "bg-sign text-white",
  }[tone];
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}>
      {children}
    </span>
  );
}

/** Star rating, filled stars in highway yellow. `null` means not rated. */
export function Stars({ value, max = 5 }: { value: number | null; max?: number }) {
  if (value === null) return <span className="text-sm text-ink-soft">Not rated</span>;
  return (
    <span className="inline-flex items-center gap-0.5" role="img" aria-label={`${value} out of ${max} stars`}>
      {Array.from({ length: max }, (_, i) => (
        <svg key={i} viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path
            d="M12 3.2l2.7 5.5 6 .9-4.4 4.2 1 6L12 17l-5.3 2.8 1-6L3.3 9.6l6-.9z"
            fill={i < value ? "#f3b32a" : "transparent"}
            stroke="#1e2b37"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </span>
  );
}

export function Loading({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-center gap-2 text-sm text-ink-soft" role="status">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink/20 border-t-ink" aria-hidden="true" />
      {children}
    </p>
  );
}
