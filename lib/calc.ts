/**
 * Pure calculation helpers. No React, no formatting: each function returns
 * raw numbers, or null when the inputs can't produce a sensible answer.
 */

const finite = (...n: number[]) => n.every((x) => Number.isFinite(x));

/* 1. Fuel cost -------------------------------------------------------- */
export function fuelCost(distance: number, mpg: number, price: number) {
  if (!finite(distance, mpg, price) || distance < 0 || mpg <= 0 || price < 0) return null;
  const gallons = distance / mpg;
  const cost = gallons * price;
  const perMile = price / mpg;
  return { gallons, cost, perMile, per100: perMile * 100 };
}

/* 2. MPG -------------------------------------------------------------- */
export function mpgCalc(miles: number, gallons: number) {
  if (!finite(miles, gallons) || miles < 0 || gallons <= 0) return null;
  const mpg = miles / gallons;
  return {
    mpg,
    lPer100km: mpg > 0 ? 235.214583 / mpg : 0,
    kmPerL: mpg * 0.425144,
  };
}

/* 3. EV charging ------------------------------------------------------ */
export function evCharge(o: {
  battery: number;
  rate: number;
  from: number;
  to: number;
  eff: number;
  milesPerKwh: number;
}) {
  const { battery, rate, from, to, eff, milesPerKwh } = o;
  if (!finite(battery, rate, from, to, eff, milesPerKwh)) return null;
  if (battery <= 0 || rate < 0 || from < 0 || to > 100 || to <= from) return null;
  if (eff <= 0 || eff > 100 || milesPerKwh < 0) return null;

  const added = (battery * (to - from)) / 100; // kWh that ends up in the battery
  const drawn = added / (eff / 100); // kWh pulled from the wall
  return {
    added,
    drawn,
    cost: drawn * rate,
    rangeAdded: added * milesPerKwh,
    costPerMile: milesPerKwh > 0 ? rate / ((eff / 100) * milesPerKwh) : null,
    fullCost: (battery / (eff / 100)) * rate, // 0 to 100%
  };
}

/* 4. Road trip -------------------------------------------------------- */
export function roadTrip(o: {
  miles: number;
  mpg: number;
  gas: number;
  tolls: number;
  other: number;
  travelers: number;
  roundTrip: boolean;
}) {
  const { miles, mpg, gas, tolls, other, travelers, roundTrip } = o;
  if (!finite(miles, mpg, gas, tolls, other, travelers)) return null;
  if (miles <= 0 || mpg <= 0 || gas < 0 || tolls < 0 || other < 0) return null;

  const legs = roundTrip ? 2 : 1;
  const people = Math.max(1, Math.round(travelers));
  const totalMiles = miles * legs;
  const gallons = totalMiles / mpg;
  const fuel = gallons * gas;
  const tollsTotal = tolls * legs;
  const total = fuel + tollsTotal + other;
  return {
    totalMiles,
    gallons,
    fuel,
    tollsTotal,
    other,
    total,
    people,
    perPerson: total / people,
    perMile: total / totalMiles,
  };
}

/* 5. Tire size -------------------------------------------------------- */
export type Tire = { width: number; aspect: number; rim: number };

export function tireDims(t: Tire) {
  const sidewall = (t.width * t.aspect) / 100; // mm
  const diameter = t.rim * 25.4 + 2 * sidewall; // mm
  const circumference = Math.PI * diameter;
  return {
    sidewall,
    diameter,
    diameterIn: diameter / 25.4,
    circumference,
    revsPerMile: 1_609_344 / circumference,
  };
}

export function tireCompare(a: Tire, b: Tire, indicatedSpeed: number) {
  const all = [a.width, a.aspect, a.rim, b.width, b.aspect, b.rim, indicatedSpeed];
  if (!finite(...all) || all.some((x) => x <= 0)) return null;
  const A = tireDims(a);
  const B = tireDims(b);
  const ratio = B.diameter / A.diameter;
  return {
    old: A,
    next: B,
    diffMm: B.diameter - A.diameter,
    diffPct: (ratio - 1) * 100,
    actualSpeed: indicatedSpeed * ratio,
    widthDiff: b.width - a.width,
    sidewallDiff: B.sidewall - A.sidewall,
  };
}

/** Reads "225/45R17", "225/45 ZR17", "225/45-17" and similar. */
export function parseTireSize(text: string): Tire | null {
  const m = text.trim().match(/^(\d{3})\s*\/\s*(\d{2})\s*[A-Za-z-]*\s*(\d{2})$/);
  if (!m) return null;
  return { width: Number(m[1]), aspect: Number(m[2]), rim: Number(m[3]) };
}

/* 6. Depreciation ----------------------------------------------------- */
export function depreciation(price: number, age: number, ratePct: number, yearsAhead: number) {
  if (!finite(price, age, ratePct, yearsAhead)) return null;
  if (price <= 0 || age < 0 || ratePct < 0 || ratePct >= 100 || yearsAhead < 0) return null;

  const keep = 1 - ratePct / 100;
  const current = price * keep ** age;
  const future = current * keep ** yearsAhead;

  const total = age + yearsAhead;
  const steps = Math.max(1, Math.min(40, Math.round(total)));
  const points = Array.from({ length: steps + 1 }, (_, i) => {
    const year = (total * i) / steps;
    return { year, value: price * keep ** year };
  });
  const currentIndex = total > 0 ? Math.round((age / total) * steps) : 0;

  return {
    current,
    future,
    lostSoFar: price - current,
    lostByThen: price - future,
    lostByThenPct: ((price - future) / price) * 100,
    points,
    currentIndex,
  };
}

/* 7. Wheel offset ----------------------------------------------------- */
export type Wheel = { widthIn: number; offsetMm: number };

function wheelEdges(w: Wheel) {
  const half = (w.widthIn * 25.4) / 2;
  // Distances from the hub mounting face: inner lip toward the suspension,
  // outer lip toward the fender. Positive offset pushes the wheel inward.
  return { inner: half + w.offsetMm, outer: half - w.offsetMm };
}

export function wheelOffset(a: Wheel, b: Wheel) {
  if (!finite(a.widthIn, a.offsetMm, b.widthIn, b.offsetMm)) return null;
  if (a.widthIn <= 0 || b.widthIn <= 0) return null;
  const A = wheelEdges(a);
  const B = wheelEdges(b);
  return {
    old: A,
    next: B,
    innerShift: B.inner - A.inner, // + means closer to the suspension
    outerShift: B.outer - A.outer, // + means sticks out more
    widthChangeIn: b.widthIn - a.widthIn,
  };
}

/* 8. Horsepower converter -------------------------------------------- */
export type PowerUnit = "hp" | "kw" | "ps";
const KW_PER: Record<PowerUnit, number> = {
  hp: 0.745699872, // mechanical horsepower
  kw: 1,
  ps: 0.73549875, // metric horsepower (PS, CV, pk)
};

export function convertPower(value: number, from: PowerUnit) {
  if (!finite(value) || value < 0) return null;
  const kw = value * KW_PER[from];
  return { hp: kw / KW_PER.hp, kw, ps: kw / KW_PER.ps } as Record<PowerUnit, number>;
}

/* 9. Cost per mile ---------------------------------------------------- */
export function costPerMile(o: {
  miles: number;
  fuel: number;
  insurance: number;
  maintenance: number;
  other: number;
  perMonth: boolean;
}) {
  const { miles, fuel, insurance, maintenance, other, perMonth } = o;
  if (!finite(miles, fuel, insurance, maintenance, other)) return null;
  if (miles <= 0 || fuel < 0 || insurance < 0 || maintenance < 0 || other < 0) return null;

  const total = fuel + insurance + maintenance + other;
  const toYear = perMonth ? 12 : 1;
  return {
    total,
    perMile: total / miles,
    yearly: total * toYear,
    monthly: (total * toYear) / 12,
    parts: {
      fuel: fuel / miles,
      insurance: insurance / miles,
      maintenance: maintenance / miles,
      other: other / miles,
    },
  };
}

/* 10. Auto loan ------------------------------------------------------- */
export function autoLoan(o: {
  price: number;
  down: number;
  trade: number;
  taxPct: number;
  apr: number;
  months: number;
}) {
  const { price, down, trade, taxPct, apr, months } = o;
  if (!finite(price, down, trade, taxPct, apr, months)) return null;
  if (price <= 0 || down < 0 || trade < 0 || taxPct < 0 || apr < 0 || months < 1) return null;

  const n = Math.round(months);
  const tax = (price * taxPct) / 100;
  const financed = Math.max(0, price + tax - down - trade);
  const r = apr / 1200;
  const monthly =
    financed === 0 ? 0 : r === 0 ? financed / n : (financed * r) / (1 - (1 + r) ** -n);
  const totalPaid = monthly * n;
  return {
    tax,
    financed,
    monthly,
    totalPaid,
    interest: totalPaid - financed,
    months: n,
  };
}
