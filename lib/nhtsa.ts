/**
 * Types and small helpers shared by the NHTSA proxy route (server) and the
 * lookup tools (browser). Nothing in here touches the network except `api`.
 */

/* ------------------------------------------------------------------ */
/* Response shapes returned by /api/nhtsa                              */
/* ------------------------------------------------------------------ */

export type VehicleKind = "recalls" | "complaints" | "ratings";

export type NameList = { items: string[] };

export type VinResult = {
  /** every field NHTSA filled in, keyed by its vPIC name (ModelYear, Make, ...) */
  fields: Record<string, string>;
  errorCode: string;
  errorText: string;
};

export type Recall = {
  campaign: string;
  /** ISO date (YYYY-MM-DD) or null when NHTSA gave something unreadable */
  date: string | null;
  component: string;
  summary: string;
  consequence: string;
  remedy: string;
  notes: string;
  parkIt: boolean;
  parkOutside: boolean;
  ota: boolean;
};

export type RecallResult = { count: number; items: Recall[] };

export type Complaint = {
  id: string;
  filed: string | null;
  incident: string | null;
  components: string[];
  summary: string;
  crash: boolean;
  fire: boolean;
  injuries: number;
  deaths: number;
};

export type ComplaintResult = {
  total: number;
  crashes: number;
  fires: number;
  injuries: number;
  deaths: number;
  /** problem areas, most reported first */
  components: { name: string; count: number }[];
  /** newest first, capped by the server */
  latest: Complaint[];
};

export type Rating = {
  id: string;
  description: string;
  overall: number | null;
  front: number | null;
  frontDriver: number | null;
  frontPassenger: number | null;
  side: number | null;
  sideDriver: number | null;
  sidePassenger: number | null;
  pole: number | null;
  rollover: number | null;
  /** chance of rollover in a single-vehicle crash, 0 to 1 */
  rolloverChance: number | null;
  /** "Standard", "Optional", "No" and so on, straight from NHTSA */
  esc: string;
  fcw: string;
  ldw: string;
  recalls: number | null;
  complaints: number | null;
  investigations: number | null;
};

export type RatingResult = { items: Rating[] };

/* ------------------------------------------------------------------ */
/* Browser side fetch                                                  */
/* ------------------------------------------------------------------ */

/** Calls our own /api/nhtsa route. Throws an Error with a message safe to show. */
export async function api<T>(params: Record<string, string>, signal?: AbortSignal): Promise<T> {
  const qs = new URLSearchParams(params).toString();
  let res: Response;
  try {
    res = await fetch(`/api/nhtsa?${qs}`, { signal });
  } catch (e) {
    if (signal?.aborted) throw e;
    throw new Error("Could not connect. Check your internet connection and try again.");
  }
  const body = (await res.json().catch(() => null)) as { error?: string } | null;
  if (!res.ok) throw new Error(body?.error ?? "Something went wrong. Please try again.");
  return body as T;
}

/* ------------------------------------------------------------------ */
/* Formatting                                                          */
/* ------------------------------------------------------------------ */

/**
 * NHTSA lists makes and models in capitals ("HONDA", "CIVIC"). This makes them
 * easier on the eye while leaving codes like "CR-V", "F-150", "RAV4" and short
 * acronyms such as "AWD", "BMW" or "(USA)" alone. Names that already have
 * lower case letters are returned as they are.
 */
export function prettyName(s: string): string {
  if (!s || /[a-z]/.test(s)) return s;
  return s.replace(/[A-Z0-9]+/g, (w) =>
    /\d/.test(w) || w.length <= 3 ? w : w.charAt(0) + w.slice(1).toLowerCase(),
  );
}

const ACRONYMS = new Set(["ESC", "ABS", "LDW", "FCW", "EV", "LED"]);

/** "FUEL SYSTEM, GASOLINE" becomes "Fuel system, gasoline". */
export function prettyComponent(s: string): string {
  return s.toLowerCase().replace(/[a-z]+/g, (w, i: number) => {
    if (ACRONYMS.has(w.toUpperCase())) return w.toUpperCase();
    return i === 0 ? w.charAt(0).toUpperCase() + w.slice(1) : w;
  });
}

/** "2018-03-04" becomes "Mar 4, 2018". Shows nothing for a missing date. */
export function formatDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);
}

/** Case and punctuation insensitive match, used to carry a vehicle between tools. */
export function matchName(list: string[], wanted: string): string | null {
  const norm = (s: string) => s.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const w = norm(wanted);
  if (!w) return null;
  const exact = list.find((x) => norm(x) === w);
  if (exact) return exact;
  const near = list.filter((x) => {
    const n = norm(x);
    return n.startsWith(w) || w.startsWith(n);
  });
  return near.length === 1 ? near[0] : null;
}
