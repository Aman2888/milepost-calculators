import type { GlyphName, ShieldTone } from "@/lib/tools";

/** Simple 24px line icons, drawn once and reused in shields and headings. */
export function GlyphPaths({ name }: { name: GlyphName }) {
  switch (name) {
    case "pump":
      return (
        <>
          <path d="M5 20V5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v15" />
          <path d="M4 20h11M7 8h5" />
          <path d="M14 9h2.5a1.5 1.5 0 0 1 1.5 1.5V16a1.5 1.5 0 0 0 3 0V9l-2-2" />
        </>
      );
    case "gauge":
      return (
        <>
          <path d="M4 17a8 8 0 1 1 16 0" />
          <path d="M12 17l4-5" />
          <circle cx="12" cy="17" r="1" />
        </>
      );
    case "plug":
      return (
        <>
          <path d="M9 3v4M15 3v4" />
          <path d="M7 7h10v4a5 5 0 0 1-10 0V7z" />
          <path d="M12 16v5" />
        </>
      );
    case "route":
      return (
        <>
          <circle cx="6" cy="18" r="2" />
          <circle cx="18" cy="6" r="2" />
          <path d="M8 18h6a3 3 0 0 0 0-6h-4a3 3 0 0 1 0-6h6" />
        </>
      );
    case "tire":
      return (
        <>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="3.5" />
          <path d="M12 3v5.5M12 15.5V21M3 12h5.5M15.5 12H21" />
        </>
      );
    case "trend":
      return (
        <>
          <path d="M3 7l6 6 4-4 7 7" />
          <path d="M15 16h5v-5" />
        </>
      );
    case "offset":
      return (
        <>
          <path d="M4 4v16M20 4v16M4 12h16" />
          <path d="M8 8l-4 4 4 4M16 8l4 4-4 4" />
        </>
      );
    case "bolt":
      return <path d="M13 3L5 13h6l-1 8 8-10h-6z" />;
    case "coin":
      return (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 6.5v11" />
          <path d="M14.8 9.2c0-1-1.2-1.7-2.8-1.7s-2.8.7-2.8 1.9c0 2.6 5.6 1.4 5.6 4 0 1.2-1.3 1.9-2.8 1.9s-2.8-.8-2.8-1.9" />
        </>
      );
    case "key":
      return (
        <>
          <circle cx="8" cy="15" r="4" />
          <path d="M11 12l8-8M16 7l3 3M14 9l2 2" />
        </>
      );
    case "scan":
      return (
        <>
          <path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3" />
          <path d="M8 9v6M11 9v6M13.5 9v6M16 9v6" />
        </>
      );
    case "alert":
      return (
        <>
          <path d="M12 4l9 16H3z" />
          <path d="M12 10v4.5M12 17.4h.01" />
        </>
      );
    case "star":
      return <path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 17l-5.2 2.7 1-5.9-4.3-4.1 5.9-.8z" />;
    case "chat":
      return (
        <>
          <path d="M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-8l-4 4v-4H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />
          <path d="M12 8.5v3.5M12 14.2h.01" />
        </>
      );
  }
}

export function Glyph({ name, className }: { name: GlyphName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <GlyphPaths name={name} />
    </svg>
  );
}

export const SHIELD_FILL: Record<ShieldTone, string> = {
  blue: "#175089",
  red: "#cc4437",
  yellow: "#f3b32a",
  green: "#5e9a5b",
  ink: "#1e2b37",
};

export const SHIELD_PATH =
  "M24 2.5c-5.2 3.2-12.6 4.4-20.5 3.3C3.2 28 6.5 42 24 51.5 41.5 42 44.8 28 44.5 5.8 36.6 6.9 29.2 5.7 24 2.5z";

/** A route-shield badge, like the ones on highway signs. */
export function Shield({
  glyph,
  tone,
  size = 56,
}: {
  glyph: GlyphName;
  tone: ShieldTone;
  size?: number;
}) {
  const glyphColor = tone === "yellow" ? "#1e2b37" : "#ffffff";
  return (
    <svg
      viewBox="0 0 48 54"
      width={size}
      height={(size * 54) / 48}
      aria-hidden="true"
      className="shrink-0"
    >
      <path d={SHIELD_PATH} fill="#1e2b37" stroke="#1e2b37" strokeWidth="5" strokeLinejoin="round" />
      <path d={SHIELD_PATH} fill={SHIELD_FILL[tone]} stroke="#ffffff" strokeWidth="2" strokeLinejoin="round" />
      <g
        transform="translate(12 13.5)"
        fill="none"
        stroke={glyphColor}
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <GlyphPaths name={glyph} />
      </g>
    </svg>
  );
}

/** The site mark: a roadside milepost. */
export function MilepostMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 38" className={className} aria-hidden="true">
      <rect x="3" y="2" width="22" height="34" rx="5" fill="#f7f9ef" stroke="#1e2b37" strokeWidth="2.5" />
      <path d="M3 13V7a5 5 0 0 1 5-5h12a5 5 0 0 1 5 5v6z" fill="#f3b32a" stroke="#1e2b37" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M9 22h10M9 28h6" stroke="#1e2b37" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
