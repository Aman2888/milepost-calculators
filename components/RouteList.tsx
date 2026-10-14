// "use client";

// import Link from "next/link";
// import { useEffect, useRef, useState } from "react";
// import { Shield } from "@/components/glyphs";
// import type { Tool } from "@/lib/tools";

// const CAR_H = 46;

// /** A little car seen from above, nose pointing down the road. */
// function Car() {
//   return (
//     <svg viewBox="0 0 24 46" width="24" height={CAR_H} aria-hidden="true" className="drop-shadow-[0_3px_3px_rgba(0,0,0,0.35)]">
//       {/* wheels */}
//       <rect x="0.5" y="8" width="3" height="9" rx="1.2" fill="#0b141c" />
//       <rect x="20.5" y="8" width="3" height="9" rx="1.2" fill="#0b141c" />
//       <rect x="0.5" y="30" width="3" height="9" rx="1.2" fill="#0b141c" />
//       <rect x="20.5" y="30" width="3" height="9" rx="1.2" fill="#0b141c" />
//       {/* body */}
//       <rect x="2.5" y="1.5" width="19" height="43" rx="8" fill="#cc4437" stroke="#fff" strokeWidth="1.5" />
//       {/* windscreen (front, bottom) and rear window (top) */}
//       <path d="M5.5 28h13l-1.6 6.5H7.1z" fill="#bfe3f5" stroke="#1e2b37" strokeWidth="1" strokeLinejoin="round" />
//       <path d="M7 9h10l1.2 4.5H5.8z" fill="#bfe3f5" stroke="#1e2b37" strokeWidth="1" strokeLinejoin="round" />
//       {/* roof */}
//       <rect x="6" y="15" width="12" height="12" rx="3" fill="#a8362b" />
//       {/* headlights (front) and tail lights */}
//       <circle cx="6.5" cy="41" r="1.8" fill="#f3b32a" />
//       <circle cx="17.5" cy="41" r="1.8" fill="#f3b32a" />
//       <rect x="5" y="3.5" width="4" height="1.8" rx="0.9" fill="#fff" opacity="0.85" />
//       <rect x="15" y="3.5" width="4" height="1.8" rx="0.9" fill="#fff" opacity="0.85" />
//     </svg>
//   );
// }

// /**
//  * The calculators as stops along one road. On wide screens the stops
//  * alternate left and right of the road; on phones the road runs down the
//  * left edge and every stop sits to its right. A car drives down the road as
//  * the page scrolls and the stop it is passing lights up.
//  */
// export default function RouteList({ tools }: { tools: Tool[] }) {
//   const listRef = useRef<HTMLOListElement>(null);
//   const carRef = useRef<HTMLDivElement>(null);
//   const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
//   const [active, setActive] = useState(0);

//   useEffect(() => {
//     let frame = 0;

//     const update = () => {
//       frame = 0;
//       const list = listRef.current;
//       const car = carRef.current;
//       if (!list || !car) return;

//       const rect = list.getBoundingClientRect();
//       // the car "reads" the page at a point a bit below the middle of the screen
//       const anchor = window.innerHeight * 0.55;
//       const y = Math.min(Math.max(anchor - rect.top - CAR_H / 2, 0), rect.height - CAR_H);
//       car.style.transform = `translateY(${y}px)`;

//       const carMid = rect.top + y + CAR_H / 2;
//       let best = 0;
//       let bestDist = Infinity;
//       itemRefs.current.forEach((el, i) => {
//         if (!el) return;
//         const r = el.getBoundingClientRect();
//         const d = Math.abs(r.top + r.height / 2 - carMid);
//         if (d < bestDist) {
//           bestDist = d;
//           best = i;
//         }
//       });
//       setActive(best);
//     };

//     const onScroll = () => {
//       if (!frame) frame = requestAnimationFrame(update);
//     };

//     update();
//     window.addEventListener("scroll", onScroll, { passive: true });
//     window.addEventListener("resize", onScroll);
//     return () => {
//       window.removeEventListener("scroll", onScroll);
//       window.removeEventListener("resize", onScroll);
//       if (frame) cancelAnimationFrame(frame);
//     };
//   }, []);

//   return (
//     <ol ref={listRef} className="relative">
//       {/* the road */}
//       <div
//         aria-hidden="true"
//         className="road absolute bottom-0 top-0 left-7 -translate-x-1/2 md:left-1/2"
//       />

//       {/* the car, driven by scroll position */}
//       <div
//         aria-hidden="true"
//         className="pointer-events-none absolute left-7 top-0 z-20 -translate-x-1/2 md:left-1/2"
//       >
//         <div ref={carRef} className="will-change-transform" style={{ height: CAR_H }}>
//           <Car />
//         </div>
//       </div>

//       {tools.map((tool, i) => {
//         const onLeft = i % 2 === 0;
//         const isActive = i === active;
//         return (
//           <li
//             key={tool.slug}
//             ref={(el) => {
//               itemRefs.current[i] = el;
//             }}
//             className="relative"
//           >
//             <Link
//               href={`/${tool.slug}`}
//               className="group grid grid-cols-[56px_1fr] items-center gap-x-5 py-5 md:grid-cols-[1fr_96px_1fr] md:gap-x-4 md:py-7"
//             >
//               <span
//                 className={`relative z-10 col-start-1 row-start-1 justify-self-center rounded-full bg-paper p-1.5 transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-110 md:col-start-2 ${
//                   isActive ? "scale-110" : ""
//                 }`}
//               >
//                 <Shield glyph={tool.glyph} tone={tool.tone} size={52} />
//               </span>

//               <span
//                 className={`col-start-2 row-start-1 block transition-opacity duration-300 ${
//                   onLeft ? "md:col-start-1 md:text-right" : "md:col-start-3"
//                 } ${isActive ? "opacity-100" : "opacity-60 group-hover:opacity-100"}`}
//               >
//                 <span
//                   className={`block font-display text-2xl font-bold leading-tight underline-offset-[6px] decoration-2 decoration-hwy group-hover:underline sm:text-3xl ${
//                     isActive ? "underline" : ""
//                   }`}
//                 >
//                   {tool.name}
//                 </span>
//                 <span className="mt-1.5 block max-w-md text-ink-soft md:inline-block">
//                   {tool.short}
//                 </span>
//                 <span className="mt-3 block text-sm">
//                   <span className="font-semibold">You enter</span>{" "}
//                   <span className="text-ink-soft">{tool.enter}.</span>{" "}
//                   <span className="font-semibold">You get</span>{" "}
//                   <span className="text-ink-soft">{tool.get}.</span>
//                 </span>
//               </span>
//             </Link>
//           </li>
//         );
//       })}
//     </ol>
//   );
// }
"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Shield } from "@/components/glyphs";
import { SceneLayer, makeScene, type SceneKind } from "@/components/Scenery";
import type { Tool } from "@/lib/tools";

const CAR_W = 30;
const CAR_H = 57.5;
const ROAD_W = 38;

// parallax: the far layer slides slowest, the near layer a little faster
const FAR_DRIFT = 0.5;
const NEAR_DRIFT = 0.25;
const FAR_KINDS: SceneKind[] = ["hill", "cloud", "pine", "tree", "cloud", "pine"];
const NEAR_KINDS: SceneKind[] = ["gas", "tree", "billboard", "pine", "house", "ev", "light", "tree", "lamp"];

/** A little car seen from above, nose pointing down the road. */
function Car() {
  return (
    <svg
      viewBox="0 0 24 46"
      width={CAR_W}
      height={CAR_H}
      aria-hidden="true"
      className="block drop-shadow-[0_3px_3px_rgba(0,0,0,0.4)]"
    >
      {/* wheels */}
      <rect x="0.5" y="8" width="3" height="9" rx="1.2" fill="#0b141c" />
      <rect x="20.5" y="8" width="3" height="9" rx="1.2" fill="#0b141c" />
      <rect x="0.5" y="30" width="3" height="9" rx="1.2" fill="#0b141c" />
      <rect x="20.5" y="30" width="3" height="9" rx="1.2" fill="#0b141c" />
      {/* body */}
      <rect x="2.5" y="1.5" width="19" height="43" rx="8" fill="#cc4437" stroke="#fff" strokeWidth="1.5" />
      {/* windscreen (front, bottom) and rear window (top) */}
      <path d="M5.5 28h13l-1.6 6.5H7.1z" fill="#bfe3f5" stroke="#1e2b37" strokeWidth="1" strokeLinejoin="round" />
      <path d="M7 9h10l1.2 4.5H5.8z" fill="#bfe3f5" stroke="#1e2b37" strokeWidth="1" strokeLinejoin="round" />
      {/* roof */}
      <rect x="6" y="15" width="12" height="12" rx="3" fill="#a8362b" />
      {/* headlights (front) and tail lights */}
      <circle cx="6.5" cy="41" r="1.8" fill="#f3b32a" />
      <circle cx="17.5" cy="41" r="1.8" fill="#f3b32a" />
      <rect x="5" y="3.5" width="4" height="1.8" rx="0.9" fill="#fff" opacity="0.85" />
      <rect x="15" y="3.5" width="4" height="1.8" rx="0.9" fill="#fff" opacity="0.85" />
    </svg>
  );
}

type Geom = { d: string; w: number; h: number; vw: number; left: number };
type Pt = { x: number; y: number };

/**
 * The calculators as stops along one winding road. The road passes through
 * every stop and swings left and right in between. A car drives along it as
 * the page scrolls, and the stop it is passing is lifted into a light box.
 */
export default function RouteList({ tools }: { tools: Tool[] }) {
  const listRef = useRef<HTMLOListElement>(null);
  const carRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const farRef = useRef<HTMLDivElement>(null);
  const nearRef = useRef<HTMLDivElement>(null);
  const shieldRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const samples = useRef<Pt[]>([]);
  const stopYs = useRef<number[]>([]);
  const [geom, setGeom] = useState<Geom | null>(null);
  const [active, setActive] = useState(0);
  const far = useMemo(() => makeScene(Math.round(tools.length * 1.2), FAR_KINDS, 11), [tools.length]);
  const near = useMemo(() => makeScene(Math.round(tools.length * 1.8), NEAR_KINDS, 5), [tools.length]);

  // 1. measure where each stop sits and draw a curve through all of them
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const measure = () => {
      const lr = list.getBoundingClientRect();
      const pts: Pt[] = [];
      shieldRefs.current.forEach((el) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        pts.push({ x: r.left - lr.left + r.width / 2, y: r.top - lr.top + r.height / 2 });
      });
      if (!pts.length) return;

      const wide = window.matchMedia("(min-width: 768px)").matches;
      const amp = wide ? 24 : 12; // how far the road swings sideways
      const x = pts[0].x;
      const nodes: Pt[] = [{ x, y: 0 }, ...pts, { x, y: lr.height }];

      let d = `M ${x} 0`;
      for (let i = 1; i < nodes.length; i++) {
        const prev = nodes[i - 1];
        const cur = nodes[i];
        const dy = cur.y - prev.y;
        const side = i % 2 ? 1 : -1;
        const k = ((amp * Math.min(1, dy / 160)) / 0.75) * side;
        d += ` C ${x + k} ${prev.y + dy / 3}, ${x + k} ${cur.y - dy / 3}, ${x} ${cur.y}`;
      }

      stopYs.current = pts.map((p) => p.y);
      // the scenery is as wide as the real viewport (no scrollbar), starting at the page's left edge
      const vw = document.documentElement.clientWidth;
      const left = -(lr.left + window.scrollX);
      setGeom((g) =>
        g && g.d === d && g.h === lr.height && g.vw === vw && g.left === left
          ? g
          : { d, w: lr.width, h: lr.height, vw, left },
      );
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [tools]);

  // 2. sample the curve once, then move the car along it on scroll
  useEffect(() => {
    const path = pathRef.current;
    if (!geom || !path) return;

    const total = path.getTotalLength();
    const pts: Pt[] = [];
    for (let l = 0; l < total; l += 4) {
      const p = path.getPointAtLength(l);
      pts.push({ x: p.x, y: p.y });
    }
    const end = path.getPointAtLength(total);
    pts.push({ x: end.x, y: end.y });
    samples.current = pts;

    let frame = 0;
    const update = () => {
      frame = 0;
      const list = listRef.current;
      const car = carRef.current;
      const s = samples.current;
      if (!list || !car || !s.length) return;

      const rect = list.getBoundingClientRect();
      // the car sits a little below the middle of the screen
      const anchor = window.innerHeight * 0.55;
      const y = Math.min(Math.max(anchor - rect.top, CAR_H / 2), rect.height - CAR_H / 2);

      // slide the scenery layers against the scroll so they trail behind the page
      const progress = Math.min(Math.max(anchor - rect.top, 0), rect.height);
      if (farRef.current) farRef.current.style.transform = `translateY(${progress * FAR_DRIFT}px)`;
      if (nearRef.current) nearRef.current.style.transform = `translateY(${progress * NEAR_DRIFT}px)`;

      let lo = 0;
      let hi = s.length - 1;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (s[mid].y < y) lo = mid + 1;
        else hi = mid;
      }
      const a = s[Math.max(lo - 1, 0)];
      const b = s[Math.min(lo + 1, s.length - 1)];
      const p = s[lo];
      // the car art faces down, so turn it to follow the road's direction
      const angle = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI - 90;
      car.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%) rotate(${angle}deg)`;
      car.style.opacity = "1";

      let best = 0;
      let bestDist = Infinity;
      stopYs.current.forEach((sy, i) => {
        const dist = Math.abs(sy - p.y);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      setActive(best);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [geom]);

  return (
    <ol ref={listRef} className="relative">
      {/* blurred roadside scenery, behind everything and clipped to the road's length */}
      {geom && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 overflow-hidden"
          style={{ left: geom.left, width: geom.vw }}
        >
          <SceneLayer layerRef={farRef} items={far} height={geom.h} drift={FAR_DRIFT} blur={5} opacity={0.3} />
          <SceneLayer layerRef={nearRef} items={near} height={geom.h} drift={NEAR_DRIFT} blur={3} opacity={0.42} />
        </div>
      )}

      {/* the road: a plain straight one until the curve has been measured */}
      {geom ? (
        <svg
          aria-hidden="true"
          width={geom.w}
          height={geom.h}
          className="pointer-events-none absolute left-0 top-0"
        >
          <path d={geom.d} fill="none" stroke="#1e2b37" strokeWidth={ROAD_W} strokeLinecap="round" />
          <path
            ref={pathRef}
            d={geom.d}
            fill="none"
            stroke="#f3b32a"
            strokeWidth="3"
            strokeDasharray="14 14"
          />
        </svg>
      ) : (
        <div
          aria-hidden="true"
          className="road absolute bottom-0 top-0 left-7 -translate-x-1/2 md:left-1/2"
        />
      )}

      {/* the car, driven by scroll position */}
      <div
        ref={carRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-20 opacity-0 will-change-transform"
      >
        <Car />
      </div>

      {tools.map((tool, i) => {
        const onLeft = i % 2 === 0;
        const isActive = i === active;
        return (
          <li key={tool.slug} className="relative">
            <Link
              href={`/${tool.slug}`}
              className="group grid grid-cols-[56px_1fr] items-center gap-x-5 py-4 md:grid-cols-[1fr_96px_1fr] md:gap-x-4 md:py-6"
            >
              <span
                ref={(el) => {
                  shieldRefs.current[i] = el;
                }}
                className={`relative z-10 col-start-1 row-start-1 justify-self-center rounded-full bg-paper p-1.5 transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-110 md:col-start-2 ${
                  isActive ? "scale-110" : ""
                }`}
              >
                <Shield glyph={tool.glyph} tone={tool.tone} size={52} />
              </span>

              {/* the text; it lifts into a light box while the car is at this stop */}
              <span
                className={`col-start-2 row-start-1 block rounded-2xl border-2 px-4 py-3 transition-all duration-300 ${
                  onLeft ? "md:col-start-1 md:text-right" : "md:col-start-3"
                } ${
                  isActive
                    ? "border-ink/20 bg-card opacity-100 shadow-[0_10px_28px_-10px_rgba(30,43,55,0.45)]"
                    : "border-transparent opacity-55 group-hover:opacity-100"
                }`}
              >
                <span
                  className={`block font-display text-2xl font-bold leading-tight underline-offset-[6px] decoration-2 decoration-hwy group-hover:underline sm:text-3xl ${
                    isActive ? "underline" : ""
                  }`}
                >
                  {tool.name}
                </span>
                <span className="mt-1.5 block max-w-md text-ink-soft md:inline-block">
                  {tool.short}
                </span>
                <span className="mt-3 block text-sm">
                  <span className="font-semibold">You enter</span>{" "}
                  <span className="text-ink-soft">{tool.enter}.</span>{" "}
                  <span className="font-semibold">You get</span>{" "}
                  <span className="text-ink-soft">{tool.get}.</span>
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}