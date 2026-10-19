import { Children, Fragment, isValidElement, type ReactNode } from "react";
import { GlyphPaths, SHIELD_FILL, SHIELD_PATH } from "@/components/glyphs";
import { SITE_LOGO_URL, SITE_NAME } from "@/lib/site";
import type { GlyphName, ShieldTone } from "@/lib/tools";

/** The share-image renderer only accepts plain elements inside an <svg>, so fragments are opened up. */
function unwrap(node: ReactNode): ReactNode[] {
  const out: ReactNode[] = [];
  Children.forEach(node, (child) => {
    if (isValidElement(child) && child.type === Fragment) {
      out.push(...unwrap((child.props as { children?: ReactNode }).children));
    } else {
      out.push(child);
    }
  });
  return out;
}

/** The route-shield badge from the site, drawn with plain SVG elements. */
export function OgShield({ glyph, tone, size }: { glyph: GlyphName; tone: ShieldTone; size: number }) {
  const glyphColor = tone === "yellow" ? "#1e2b37" : "#ffffff";
  return (
    <svg viewBox="0 0 48 54" width={size} height={(size * 54) / 48}>
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
        {unwrap(GlyphPaths({ name: glyph }))}
      </g>
    </svg>
  );
}

/** The frame shared by every share image: paper background, a road-line strip and the site name. */
export function OgFrame({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#e7edda",
        color: "#1e2b37",
        padding: "56px 72px 0 72px",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {SITE_LOGO_URL ? (
            <img src={SITE_LOGO_URL} alt="" width={40} height={54} style={{ objectFit: "contain" }} />
          ) : (
            <svg width="40" height="54" viewBox="0 0 28 38">
              <rect x="3" y="2" width="22" height="34" rx="5" fill="#f7f9ef" stroke="#1e2b37" strokeWidth="2.5" />
              <path d="M3 13V7a5 5 0 0 1 5-5h12a5 5 0 0 1 5 5v6z" fill="#f3b32a" stroke="#1e2b37" strokeWidth="2.5" />
              <path d="M9 22h10M9 28h6" stroke="#1e2b37" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          )}
          <div style={{ fontSize: 40, fontWeight: 800 }}>{SITE_NAME}</div>
        </div>
        {label && <div style={{ fontSize: 28, color: "#4a5966" }}>{label}</div>}
      </div>

      <div style={{ display: "flex", flex: 1, alignItems: "center" }}>{children}</div>

      <div style={{ display: "flex", height: 26, alignItems: "center", gap: 22, marginLeft: -72, marginRight: -72 }}>
        {Array.from({ length: 22 }, (_, i) => (
          <div key={i} style={{ width: 34, height: 8, background: "#f3b32a", flexShrink: 0 }} />
        ))}
      </div>
    </div>
  );
}
