import type { CSSProperties, RefObject } from "react";

export type SceneKind =
  | "gas"
  | "tree"
  | "pine"
  | "billboard"
  | "house"
  | "light"
  | "ev"
  | "lamp"
  | "hill"
  | "cloud";

export type SceneItem = {
  id: number;
  kind: SceneKind;
  top: number; // % of the layer
  side: "left" | "right";
  edge: number; // % in from the screen edge
  width: number; // px on desktop
};

/** native width (px) of each piece of scenery before random scaling */
const WIDTH: Record<SceneKind, number> = {
  gas: 150,
  tree: 70,
  pine: 60,
  billboard: 120,
  house: 110,
  light: 36,
  ev: 56,
  lamp: 38,
  hill: 280,
  cloud: 160,
};

/** a tiny seeded random generator, so server and browser draw the same scene */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Spread `count` pieces of scenery down the layer, alternating sides at random. */
export function makeScene(count: number, kinds: SceneKind[], seed: number): SceneItem[] {
  const rnd = mulberry32(seed);
  const offset = Math.floor(rnd() * kinds.length);
  return Array.from({ length: count }, (_, i) => {
    const kind = kinds[(i + offset) % kinds.length];
    const slot = 100 / count;
    return {
      id: i,
      kind,
      top: i * slot + rnd() * slot * 0.6,
      side: rnd() < 0.5 ? "left" : "right",
      edge: rnd() * 16,
      width: Math.round(WIDTH[kind] * (0.85 + rnd() * 0.4)),
    };
  });
}

function Art({ kind }: { kind: SceneKind }) {
  const common = "block h-auto w-full";
  switch (kind) {
    case "gas":
      return (
        <svg viewBox="0 0 120 80" className={common}>
          <rect x="8" y="6" width="104" height="14" rx="4" fill="#cc4437" />
          <rect x="8" y="16" width="104" height="4" fill="#a8362b" />
          <rect x="20" y="20" width="5" height="52" fill="#4a5966" />
          <rect x="95" y="20" width="5" height="52" fill="#4a5966" />
          <rect x="48" y="34" width="24" height="38" rx="4" fill="#f7f9ef" stroke="#1e2b37" strokeWidth="2.5" />
          <rect x="53" y="40" width="14" height="9" rx="2" fill="#5e9a5b" />
          <path d="M72 46h6a4 4 0 0 1 4 4v14" fill="none" stroke="#1e2b37" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="2" y="72" width="116" height="5" rx="2" fill="#4a5966" />
        </svg>
      );
    case "tree":
      return (
        <svg viewBox="0 0 60 90" className={common}>
          <rect x="26" y="52" width="8" height="36" rx="2" fill="#7a5a3a" />
          <circle cx="30" cy="28" r="24" fill="#5e9a5b" />
          <circle cx="16" cy="42" r="15" fill="#4d8a4a" />
          <circle cx="44" cy="42" r="15" fill="#4d8a4a" />
        </svg>
      );
    case "pine":
      return (
        <svg viewBox="0 0 50 90" className={common}>
          <polygon points="25,3 44,38 6,38" fill="#3f7a4a" />
          <polygon points="25,20 47,56 3,56" fill="#3f7a4a" />
          <polygon points="25,38 49,76 1,76" fill="#356b40" />
          <rect x="22" y="76" width="6" height="12" fill="#7a5a3a" />
        </svg>
      );
    case "billboard":
      return (
        <svg viewBox="0 0 110 100" className={common}>
          <rect x="30" y="50" width="6" height="48" fill="#4a5966" />
          <rect x="74" y="50" width="6" height="48" fill="#4a5966" />
          <rect x="8" y="8" width="94" height="46" rx="5" fill="#175089" stroke="#1e2b37" strokeWidth="3" />
          <rect x="20" y="20" width="46" height="7" rx="2" fill="#f3b32a" />
          <rect x="20" y="33" width="70" height="4" rx="2" fill="#fff" opacity="0.85" />
          <rect x="20" y="41" width="50" height="4" rx="2" fill="#fff" opacity="0.85" />
        </svg>
      );
    case "house":
      return (
        <svg viewBox="0 0 100 90" className={common}>
          <rect x="14" y="40" width="72" height="46" fill="#f7f9ef" stroke="#1e2b37" strokeWidth="3" />
          <polygon points="6,42 50,8 94,42" fill="#cc4437" stroke="#1e2b37" strokeWidth="3" strokeLinejoin="round" />
          <rect x="43" y="58" width="15" height="28" fill="#175089" />
          <rect x="20" y="52" width="14" height="14" fill="#f3b32a" />
          <rect x="66" y="52" width="14" height="14" fill="#f3b32a" />
        </svg>
      );
    case "light":
      return (
        <svg viewBox="0 0 40 100" className={common}>
          <rect x="17" y="50" width="6" height="48" fill="#1e2b37" />
          <rect x="8" y="4" width="24" height="50" rx="6" fill="#1e2b37" />
          <circle cx="20" cy="16" r="6" fill="#cc4437" />
          <circle cx="20" cy="29" r="6" fill="#f3b32a" />
          <circle cx="20" cy="42" r="6" fill="#5e9a5b" />
        </svg>
      );
    case "ev":
      return (
        <svg viewBox="0 0 60 100" className={common}>
          <rect x="14" y="8" width="32" height="72" rx="7" fill="#f7f9ef" stroke="#1e2b37" strokeWidth="3" />
          <rect x="20" y="16" width="20" height="14" rx="2" fill="#5e9a5b" />
          <path d="M33 40L24 57h7l-2 13 10-17h-7z" fill="#f3b32a" />
          <rect x="8" y="80" width="44" height="7" rx="2" fill="#4a5966" />
        </svg>
      );
    case "lamp":
      return (
        <svg viewBox="0 0 40 100" className={common}>
          <rect x="17" y="12" width="5" height="86" fill="#4a5966" />
          <path d="M19.5 14Q19.5 5 30 5h6" fill="none" stroke="#4a5966" strokeWidth="4" strokeLinecap="round" />
          <rect x="30" y="4" width="10" height="7" rx="2" fill="#f3b32a" />
        </svg>
      );
    case "hill":
      return (
        <svg viewBox="0 0 200 80" className={common}>
          <path d="M0 80C30 18 70 18 100 50 130 24 170 30 200 80Z" fill="#8fb48a" />
        </svg>
      );
    case "cloud":
      return (
        <svg viewBox="0 0 120 50" className={common}>
          <ellipse cx="60" cy="36" rx="52" ry="13" fill="#fff" />
          <circle cx="40" cy="26" r="16" fill="#fff" />
          <circle cx="68" cy="20" r="20" fill="#fff" />
        </svg>
      );
  }
}

/**
 * One layer of blurred roadside scenery. It is taller than the road by
 * `drift` so it can slide slower than the page (parallax) and still fill
 * the whole height. The parent moves it with `layerRef` on scroll.
 */
export function SceneLayer({
  layerRef,
  items,
  height,
  drift,
  blur,
  opacity,
}: {
  layerRef: RefObject<HTMLDivElement | null>;
  items: SceneItem[];
  height: number;
  drift: number;
  blur: number;
  opacity: number;
}) {
  return (
    <div
      ref={layerRef}
      className="absolute inset-x-0 will-change-transform"
      style={{ top: -drift * height, height: (1 + drift) * height, opacity }}
    >
      {items.map((it) => (
        <div
          key={it.id}
          className="absolute w-[calc(var(--w)*0.7)] md:w-[var(--w)]"
          style={
            {
              top: `${it.top}%`,
              [it.side]: `${it.edge}%`,
              "--w": `${it.width}px`,
              filter: `blur(${blur}px)`,
            } as CSSProperties
          }
        >
          <Art kind={it.kind} />
        </div>
      ))}
    </div>
  );
}
