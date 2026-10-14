"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api, matchName, prettyName, type NameList, type VehicleKind } from "@/lib/nhtsa";
import { Loading, Notice, PrimaryButton, Select } from "./shared";

export type Vehicle = { year: string; make: string; model: string };

const FIRST_YEAR = 1990;

/**
 * Year, make and model dropdowns that fill in one after the other from NHTSA's
 * own lists, so only vehicles that really have data can be picked.
 *
 * A link like /recall-checker?year=2018&make=HONDA&model=CIVIC fills the
 * dropdowns and runs the lookup straight away.
 */
export default function VehiclePicker({
  kind,
  busy,
  onSubmit,
  button = "Look up",
}: {
  kind: VehicleKind;
  busy: boolean;
  onSubmit: (v: Vehicle) => void;
  button?: string;
}) {
  const [years, setYears] = useState<string[]>([]);
  const [year, setYear] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [makes, setMakes] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [loading, setLoading] = useState<"makes" | "models" | null>(null);
  const [problem, setProblem] = useState("");

  const cache = useRef(new Map<string, string[]>());
  const seq = useRef({ makes: 0, models: 0 });

  // built after mount so the page never disagrees with the server-rendered HTML
  useEffect(() => {
    const top = new Date().getFullYear() + 1;
    setYears(Array.from({ length: top - FIRST_YEAR + 1 }, (_, i) => String(top - i)));
  }, []);

  const fetchList = useCallback(
    async (what: "makes" | "models", y: string, mk = ""): Promise<string[]> => {
      const key = `${what}|${kind}|${y}|${mk}`;
      const hit = cache.current.get(key);
      if (hit) return hit;
      const params: Record<string, string> = { op: what, kind, year: y };
      if (what === "models") params.make = mk;
      const { items } = await api<NameList>(params);
      cache.current.set(key, items);
      return items;
    },
    [kind],
  );

  const loadMakes = useCallback(
    async (y: string) => {
      const mine = ++seq.current.makes;
      setProblem("");
      setLoading("makes");
      let items: string[] = [];
      try {
        items = await fetchList("makes", y);
      } catch (e) {
        if (mine === seq.current.makes) setProblem(e instanceof Error ? e.message : "Could not load makes.");
      }
      if (mine !== seq.current.makes) return items;
      setMakes(items);
      setLoading(null);
      if (items.length === 0) setProblem((p) => p || `NHTSA has no ${y} vehicles for this lookup.`);
      return items;
    },
    [fetchList],
  );

  const loadModels = useCallback(
    async (y: string, mk: string) => {
      const mine = ++seq.current.models;
      setProblem("");
      setLoading("models");
      let items: string[] = [];
      try {
        items = await fetchList("models", y, mk);
      } catch (e) {
        if (mine === seq.current.models) setProblem(e instanceof Error ? e.message : "Could not load models.");
      }
      if (mine !== seq.current.models) return items;
      setModels(items);
      setLoading(null);
      return items;
    },
    [fetchList],
  );

  const pickYear = (y: string) => {
    seq.current.models++;
    setYear(y);
    setMake("");
    setModel("");
    setMakes([]);
    setModels([]);
    setProblem("");
    if (y) void loadMakes(y);
  };

  const pickMake = (m: string) => {
    setMake(m);
    setModel("");
    setModels([]);
    setProblem("");
    if (m) void loadModels(year, m);
  };

  // arrive from another tool (or a shared link) with a vehicle already chosen
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const y = q.get("year");
    const wantMake = q.get("make");
    const wantModel = q.get("model");
    if (!y || !wantMake || !wantModel || !/^(19|20)\d{2}$/.test(y)) return;

    let cancelled = false;
    (async () => {
      setYear(y);
      const mk = matchName(await loadMakes(y), wantMake);
      if (cancelled || !mk) return;
      setMake(mk);
      const md = matchName(await loadModels(y, mk), wantModel);
      if (cancelled || !md) return;
      setModel(md);
      onSubmit({ year: y, make: mk, model: md });
    })();
    return () => {
      cancelled = true;
    };
    // only on arrival; the handlers above are stable for a given kind
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ready = Boolean(year && make && model);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
        <Select
          label="Year"
          value={year}
          onChange={pickYear}
          placeholder="Select year"
          options={years.map((y) => ({ value: y, label: y }))}
        />
        <Select
          label="Make"
          value={make}
          onChange={pickMake}
          placeholder={loading === "makes" ? "Loading…" : "Select make"}
          disabled={!year || loading === "makes" || makes.length === 0}
          options={makes.map((m) => ({ value: m, label: prettyName(m) }))}
        />
        <Select
          label="Model"
          value={model}
          onChange={setModel}
          placeholder={loading === "models" ? "Loading…" : "Select model"}
          disabled={!make || loading === "models" || models.length === 0}
          options={models.map((m) => ({ value: m, label: prettyName(m) }))}
        />
      </div>

      {loading && <Loading>Getting the list from NHTSA…</Loading>}
      {problem && <Notice tone="warn">{problem}</Notice>}

      <div className="flex flex-wrap items-center gap-3">
        <PrimaryButton disabled={!ready || busy} onClick={() => onSubmit({ year, make, model })}>
          {busy ? "Looking up…" : button}
        </PrimaryButton>
      </div>
    </>
  );
}
