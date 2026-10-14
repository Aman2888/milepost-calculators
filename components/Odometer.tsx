const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

/** One wheel of the odometer: the digits sit in a column that slides into place. */
function Reel({ digit }: { digit: number }) {
  return (
    <span
      aria-hidden="true"
      className="relative inline-block overflow-hidden rounded-[0.14em] bg-ink text-card"
      style={{ height: "1.1em", width: "0.66em" }}
    >
      <span
        className="flex flex-col"
        style={{
          transform: `translateY(-${digit * 1.1}em)`,
          transition: "transform 750ms cubic-bezier(0.2, 0.8, 0.2, 1)",
        }}
      >
        {DIGITS.map((d) => (
          <span
            key={d}
            className="block text-center"
            style={{ height: "1.1em", lineHeight: "1.1em" }}
          >
            {d}
          </span>
        ))}
      </span>
    </span>
  );
}

/**
 * A money value shown on rolling odometer reels. Reels are keyed from the
 * right, so the cents wheel stays the cents wheel when the number grows.
 */
export default function Odometer({
  value,
  decimals = 2,
  prefix = "$",
}: {
  value: number;
  decimals?: number;
  prefix?: string;
}) {
  const safe = Number.isFinite(value) && value >= 0 ? value : 0;
  const [whole, frac = ""] = safe.toFixed(decimals).split(".");

  // right to left so each reel keeps its place value
  const fracReels = frac.split("").map((c, i) => ({ key: `f${i}`, digit: Number(c) }));
  const wholeReels = whole
    .split("")
    .reverse()
    .map((c, i) => ({ key: `w${i}`, digit: Number(c), comma: i > 0 && i % 3 === 0 }))
    .reverse();

  const label = `${prefix}${safe.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;

  return (
    <span
      role="img"
      aria-label={label}
      className="inline-flex items-center gap-[0.06em] font-display font-bold tabular-nums leading-none"
    >
      <span aria-hidden="true" className="mr-[0.08em]">
        {prefix}
      </span>
      {wholeReels.map((r) => (
        <span key={r.key} aria-hidden="true" className="inline-flex items-end gap-[0.06em]">
          {r.comma && <span className="px-[0.03em] pb-[0.05em]">,</span>}
          <Reel digit={r.digit} />
        </span>
      ))}
      {decimals > 0 && (
        <>
          <span aria-hidden="true" className="pb-[0.05em]">
            .
          </span>
          {fracReels.map((r) => (
            <Reel key={r.key} digit={r.digit} />
          ))}
        </>
      )}
    </span>
  );
}
