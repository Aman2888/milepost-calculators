/** Avoid printing "-0" or "-0.0" after rounding. */
const clean = (n: number, d: number) => (Math.abs(n) < 0.5 * 10 ** -d ? 0 : n);

export const money = (n: number, d = 2) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  }).format(clean(n, d));

/** Up to `d` decimals, no trailing zeros. */
export const num = (n: number, d = 1) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: d }).format(clean(n, d));

/** Exactly `d` decimals. */
export const fixed = (n: number, d = 1) =>
  new Intl.NumberFormat("en-US", {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  }).format(clean(n, d));

export const signed = (n: number, d = 1) => {
  const v = clean(n, d);
  return `${v > 0 ? "+" : v < 0 ? "−" : ""}${fixed(Math.abs(v), d)}`;
};

/** Turns what someone typed into a number. Empty or half-typed input gives NaN. */
export function parse(s: string) {
  const t = s.replace(/,/g, "").trim();
  if (t === "" || t === "." || t === "-" || t === "-.") return NaN;
  return Number(t);
}
