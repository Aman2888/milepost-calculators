import { NextRequest, NextResponse } from "next/server";
import type {
  Complaint,
  ComplaintResult,
  NameList,
  Rating,
  RatingResult,
  Recall,
  RecallResult,
  VinResult,
} from "@/lib/nhtsa";

/**
 * A small, locked-down proxy in front of NHTSA's free public APIs.
 *
 * Why a proxy instead of calling NHTSA from the browser:
 *  - it works no matter what CORS headers NHTSA sends,
 *  - the big make/model lists are cached on the server, so they load fast,
 *  - the replies are trimmed to what the pages show.
 *
 * It is not an open proxy. Every operation builds its own fixed NHTSA URL from
 * inputs that are checked first, so nothing a visitor sends can point it at
 * another host.
 *
 * The two base URLs can be overridden with environment variables (handy for
 * tests that use a fake NHTSA server).
 */

const API = process.env.NHTSA_API_BASE ?? "https://api.nhtsa.gov";
const VPIC = process.env.NHTSA_VPIC_BASE ?? "https://vpic.nhtsa.dot.gov/api/vehicles";

const HOUR = 60 * 60;
const DAY = 24 * HOUR;

type Json = Record<string, unknown>;

class BadRequest extends Error {}
class Upstream extends Error {}

/* ------------------------------------------------------------------ */
/* Input checks                                                        */
/* ------------------------------------------------------------------ */

const bad = (msg: string): never => {
  throw new BadRequest(msg);
};

function yearOf(p: URLSearchParams) {
  const y = p.get("year") ?? "";
  return /^(19|20)\d{2}$/.test(y) ? y : bad("Pick a model year.");
}

// letters, digits, spaces and the punctuation real model names use ("F-150", "C/K 1500")
const NAME = /^[\w\s\-./&'()+,#]{1,60}$/;

function nameOf(p: URLSearchParams, key: "make" | "model") {
  const v = (p.get(key) ?? "").trim();
  return NAME.test(v) ? v : bad(`Pick a ${key}.`);
}

function kindOf(p: URLSearchParams) {
  const k = p.get("kind");
  return k === "recalls" || k === "complaints" || k === "ratings" ? k : bad("Unknown list.");
}

/* ------------------------------------------------------------------ */
/* Talking to NHTSA                                                    */
/* ------------------------------------------------------------------ */

async function upstream(url: string, revalidate: number): Promise<Json> {
  let res: Response;
  try {
    res = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate },
      signal: AbortSignal.timeout(20_000),
    });
  } catch {
    throw new Upstream("Could not reach NHTSA. Please try again in a moment.");
  }
  if (!res.ok) throw new Upstream(`NHTSA returned an error (${res.status}). Please try again later.`);
  try {
    return (await res.json()) as Json;
  } catch {
    throw new Upstream("NHTSA sent a reply that could not be read. Please try again later.");
  }
}

const enc = encodeURIComponent;

/** NHTSA is not consistent about letter case in its keys, so look in both. */
function list(data: Json, ...keys: string[]): Json[] {
  for (const k of keys) {
    const v = data[k];
    if (Array.isArray(v)) return v as Json[];
  }
  return [];
}

const str = (v: unknown): string =>
  typeof v === "string" ? v.trim() : typeof v === "number" ? String(v) : "";

const flag = (v: unknown): boolean =>
  v === true || (typeof v === "string" && /^(y|yes|true|1)$/i.test(v.trim()));

const int = (v: unknown): number => {
  const n = Number.parseInt(String(v ?? ""), 10);
  return Number.isFinite(n) ? n : 0;
};

const stars = (v: unknown): number | null => {
  const n = Number.parseInt(String(v ?? ""), 10);
  return n >= 1 && n <= 5 ? n : null;
};

const count = (v: unknown): number | null => {
  const n = Number.parseInt(String(v ?? ""), 10);
  return Number.isFinite(n) ? n : null;
};

const clip = (s: string, max: number) => (s.length > max ? `${s.slice(0, max).trimEnd()}…` : s);

/* ------------------------------------------------------------------ */
/* Dates                                                               */
/* ------------------------------------------------------------------ */

type Order = "dmy" | "mdy";

/**
 * NHTSA's slash dates are day-first in some datasets and month-first in
 * others. Look through the whole list for a day above 12 to tell which, and
 * fall back to the usual order for that dataset when every date is ambiguous.
 */
function detectOrder(dates: string[], fallback: Order): Order {
  for (const d of dates) {
    const m = /^(\d{1,2})\/(\d{1,2})\/\d{4}/.exec(d);
    if (!m) continue;
    if (Number(m[1]) > 12) return "dmy";
    if (Number(m[2]) > 12) return "mdy";
  }
  return fallback;
}

function toIso(raw: string, order: Order): string | null {
  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(raw);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(raw);
  if (!m) return null;
  const day = Number(order === "dmy" ? m[1] : m[2]);
  const month = Number(order === "dmy" ? m[2] : m[1]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  return `${m[3]}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/** Newest first; undated entries sink to the bottom. */
const byDateDesc = (a: string | null, b: string | null) => (b ?? "").localeCompare(a ?? "");

/* ------------------------------------------------------------------ */
/* Operations                                                          */
/* ------------------------------------------------------------------ */

async function vin(p: URLSearchParams): Promise<VinResult> {
  const v = (p.get("vin") ?? "").toUpperCase();
  if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(v)) {
    bad("A VIN has 17 letters and numbers. The letters I, O and Q are never used.");
  }
  const data = await upstream(`${VPIC}/DecodeVinValues/${v}?format=json`, 7 * DAY);
  const row = (list(data, "Results", "results")[0] ?? {}) as Json;

  const fields: Record<string, string> = {};
  for (const [k, val] of Object.entries(row)) {
    const s = str(val);
    if (s && s !== "Not Applicable") fields[k] = s;
  }
  const { ErrorCode, ErrorText } = fields;
  delete fields.ErrorCode;
  delete fields.ErrorText;
  return { fields, errorCode: ErrorCode ?? "", errorText: ErrorText ?? "" };
}

async function names(p: URLSearchParams, what: "makes" | "models"): Promise<NameList> {
  const kind = kindOf(p);
  const year = yearOf(p);
  const make = what === "models" ? nameOf(p, "make") : "";

  let rows: Json[];
  if (kind === "ratings") {
    const url =
      what === "makes"
        ? `${API}/SafetyRatings/modelyear/${year}?format=json`
        : `${API}/SafetyRatings/modelyear/${year}/make/${enc(make)}?format=json`;
    rows = list(await upstream(url, DAY), "Results", "results");
  } else {
    const issue = kind === "recalls" ? "r" : "c";
    const url =
      what === "makes"
        ? `${API}/products/vehicle/makes?modelYear=${year}&issueType=${issue}`
        : `${API}/products/vehicle/models?modelYear=${year}&make=${enc(make)}&issueType=${issue}`;
    rows = list(await upstream(url, DAY), "results", "Results");
  }

  const key = what === "makes" ? "make" : "model";
  const seen = new Set<string>();
  for (const r of rows) {
    const v = str(r[key] ?? r[key.charAt(0).toUpperCase() + key.slice(1)]);
    if (v) seen.add(v);
  }
  return { items: [...seen].sort((a, b) => a.localeCompare(b)) };
}

async function recalls(p: URLSearchParams): Promise<RecallResult> {
  const year = yearOf(p);
  const make = nameOf(p, "make");
  const model = nameOf(p, "model");
  const data = await upstream(
    `${API}/recalls/recallsByVehicle?make=${enc(make)}&model=${enc(model)}&modelYear=${year}`,
    HOUR,
  );
  const rows = list(data, "results", "Results");
  const order = detectOrder(rows.map((r) => str(r.ReportReceivedDate)), "dmy");

  const items: Recall[] = rows.map((r) => ({
    campaign: str(r.NHTSACampaignNumber),
    date: toIso(str(r.ReportReceivedDate), order),
    component: str(r.Component),
    summary: str(r.Summary),
    consequence: str(r.Consequence ?? r.Conequence),
    remedy: str(r.Remedy),
    notes: str(r.Notes),
    parkIt: flag(r.parkIt),
    parkOutside: flag(r.parkOutSide),
    ota: flag(r.overTheAirUpdate),
  }));
  items.sort((a, b) => byDateDesc(a.date, b.date));
  return { count: items.length, items };
}

/** Joins the few NHTSA component names that contain a comma back together. */
const COMMA_TAILS = new Set(["GASOLINE", "DIESEL", "OTHER", "AIR", "ELECTRIC", "HYDRAULIC"]);
const COMMA_HEADS = new Set(["FUEL SYSTEM", "SERVICE BRAKES"]);

function splitComponents(raw: string): string[] {
  const out: string[] = [];
  for (const token of raw.split(",")) {
    // "ELECTRICAL SYSTEM:IGNITION:SWITCH" -> the top level, "ELECTRICAL SYSTEM"
    const head = token.split(":")[0].trim();
    if (!head) continue;
    const prev = out[out.length - 1];
    if (prev && COMMA_HEADS.has(prev.toUpperCase()) && COMMA_TAILS.has(head.toUpperCase())) {
      out[out.length - 1] = `${prev}, ${head}`;
    } else {
      out.push(head);
    }
  }
  return [...new Set(out)];
}

async function complaints(p: URLSearchParams): Promise<ComplaintResult> {
  const year = yearOf(p);
  const make = nameOf(p, "make");
  const model = nameOf(p, "model");
  const data = await upstream(
    `${API}/complaints/complaintsByVehicle?make=${enc(make)}&model=${enc(model)}&modelYear=${year}`,
    HOUR,
  );
  const rows = list(data, "results", "Results");
  const order = detectOrder(
    rows.flatMap((r) => [str(r.dateComplaintFiled), str(r.dateOfIncident)]),
    "mdy",
  );

  const all: Complaint[] = rows.map((r) => ({
    id: str(r.odiNumber),
    filed: toIso(str(r.dateComplaintFiled), order),
    incident: toIso(str(r.dateOfIncident), order),
    components: splitComponents(str(r.components)),
    summary: clip(str(r.summary), 600),
    crash: flag(r.crash),
    fire: flag(r.fire),
    injuries: int(r.numberOfInjuries),
    deaths: int(r.numberOfDeaths),
  }));

  const tally = new Map<string, number>();
  for (const c of all) for (const name of c.components) tally.set(name, (tally.get(name) ?? 0) + 1);

  all.sort((a, b) => byDateDesc(a.filed, b.filed));
  return {
    total: all.length,
    crashes: all.filter((c) => c.crash).length,
    fires: all.filter((c) => c.fire).length,
    injuries: all.reduce((s, c) => s + c.injuries, 0),
    deaths: all.reduce((s, c) => s + c.deaths, 0),
    components: [...tally.entries()]
      .map(([name, n]) => ({ name, count: n }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)),
    latest: all.slice(0, 50),
  };
}

async function ratings(p: URLSearchParams): Promise<RatingResult> {
  const year = yearOf(p);
  const make = nameOf(p, "make");
  const model = nameOf(p, "model");
  const variants = list(
    await upstream(
      `${API}/SafetyRatings/modelyear/${year}/make/${enc(make)}/model/${enc(model)}?format=json`,
      DAY,
    ),
    "Results",
    "results",
  );

  // one model year often has several versions (2 door, 4 door, AWD ...)
  const ids = [...new Set(variants.map((v) => str(v.VehicleId)).filter((id) => /^\d+$/.test(id) && id !== "0"))].slice(0, 8);

  const details = await Promise.all(
    ids.map((id) => upstream(`${API}/SafetyRatings/VehicleId/${id}?format=json`, DAY)),
  );

  const items: Rating[] = [];
  details.forEach((d, i) => {
    const r = list(d, "Results", "results")[0];
    if (!r) return;
    const chance = Number.parseFloat(String(r.RolloverPossibility ?? ""));
    items.push({
      id: ids[i],
      description: str(r.VehicleDescription),
      overall: stars(r.OverallRating),
      front: stars(r.OverallFrontCrashRating),
      frontDriver: stars(r.FrontCrashDriversideRating),
      frontPassenger: stars(r.FrontCrashPassengersideRating),
      side: stars(r.OverallSideCrashRating),
      sideDriver: stars(r.SideCrashDriversideRating),
      sidePassenger: stars(r.SideCrashPassengersideRating),
      pole: stars(r.SidePoleCrashRating),
      rollover: stars(r.RolloverRating),
      rolloverChance: Number.isFinite(chance) && chance > 0 ? (chance > 1 ? chance / 100 : chance) : null,
      esc: str(r.NHTSAElectronicStabilityControl),
      fcw: str(r.NHTSAForwardCollisionWarning),
      ldw: str(r.NHTSALaneDepartureWarning),
      recalls: count(r.RecallsCount),
      complaints: count(r.ComplaintsCount),
      investigations: count(r.InvestigationCount),
    });
  });
  return { items };
}

/* ------------------------------------------------------------------ */
/* Route                                                               */
/* ------------------------------------------------------------------ */

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  try {
    let body: unknown;
    switch (p.get("op")) {
      case "vin":
        body = await vin(p);
        break;
      case "makes":
        body = await names(p, "makes");
        break;
      case "models":
        body = await names(p, "models");
        break;
      case "recalls":
        body = await recalls(p);
        break;
      case "complaints":
        body = await complaints(p);
        break;
      case "ratings":
        body = await ratings(p);
        break;
      default:
        bad("Unknown request.");
    }
    return NextResponse.json(body);
  } catch (e) {
    if (e instanceof BadRequest) return NextResponse.json({ error: e.message }, { status: 400 });
    if (e instanceof Upstream) return NextResponse.json({ error: e.message }, { status: 502 });
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
