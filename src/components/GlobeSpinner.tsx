import { useEffect, useRef, useState } from "react";
import type { Map as MapboxMap } from "mapbox-gl";

/**
 * Idle drift, in degrees of longitude per second. Negative moves the camera
 * west, so the surface turns west to east like the real thing.
 */
const IDLE = 2.1;
/** Fastest a fling can spin the globe, deg/s (five turns a second). */
const MAX = 1800;
/** How quickly a fling winds back down to the idle drift. */
const FRICTION_S = 1.1;
/** A dizzy-making spin coasts at nearly full speed this long after release… */
const HOLD_MS = 1600;
const HOLD_FRICTION_S = 12;
/** …then brakes hard into the dizzy face (about a second from top speed). */
const BRAKE_S = 0.38;
/** A spin that peaks above this leaves the Earth dizzy when it slows down. */
const DIZZY_AT = 380;
/** The face appears once a dizzy-making spin has slowed to this. */
const SETTLED = 120;
const DIZZY_MS = 3600;
const SHAKE_MS = 750;

/** What the Earth says when it comes out of a dizzy spin. */
const QUIPS = [
  "I just saw every sunrise of the year at once.",
  "Please keep your continents inside the ride.",
  "My poles are all over the place.",
  "4.5 billion years and nobody has ever done that.",
  "Hold on. Which way is north?",
  "The Moon is going to hear about this.",
  "I think I left Australia back there somewhere.",
  "Even my tectonic plates feel that one.",
  "My oceans are still sloshing.",
  "Is it Tuesday? It feels like every day at once.",
  "Give me a minute. Maybe a millennium.",
  "Let me just find my equator real quick.",
  "So that's how a fidget spinner feels.",
  "I've crossed the date line 40 times. What year is it?",
  "Okay, who is in charge of gravity today?",
  "Again! No wait, not again.",
];

type Globe = { x: number; y: number; r: number };
type Phase = "idle" | "dizzy" | "shake";

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Where the globe sits on screen: its center and radius in pixels. */
function measure(m: MapboxMap): Globe {
  const c = m.getCenter();
  const a = m.project(c);
  // Near the center, 1° of arc spans r·π/180 pixels.
  const b = m.project([c.lng, Math.min(89, c.lat + 1)]);
  const r = (Math.hypot(a.x - b.x, a.y - b.y) * 180) / Math.PI;
  const rect = m.getContainer().getBoundingClientRect();
  return { x: rect.left + a.x, y: rect.top + a.y, r };
}

/**
 * The home-screen globe as a toy: drag or fling it to spin it on its axis.
 * Harder flings spin faster, and a hard enough spin leaves it dizzy.
 */
export function GlobeSpinner({ map, active }: { map: MapboxMap | null; active: boolean }) {
  const [globe, setGlobe] = useState<Globe | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [hint, setHint] = useState("Drag the Earth to spin it");
  const fx = useRef<HTMLDivElement>(null);
  /** The current release handler, for window-level listeners set up once. */
  const endDrag = useRef<() => void>(() => {});
  const st = useRef({
    v: IDLE,
    peak: 0,
    angle: 0,
    dragging: false,
    lastX: 0,
    samples: [] as { t: number; lng: number }[],
    vBeforeGrab: 0,
    touched: false,
    releasedAt: 0,
    quip: -1,
    phase: "idle" as Phase,
    globe: null as Globe | null,
  });

  const setPhaseBoth = (p: Phase) => {
    st.current.phase = p;
    setPhase(p);
  };

  // The physics loop: drift, fling, friction, and the speed effects.
  useEffect(() => {
    if (!map || !active || reducedMotion()) return;
    const s = st.current;
    s.v = -IDLE;
    s.peak = 0;
    let raf = 0;
    let last = performance.now();
    let wasEasing = true;
    let lastHint = "";
    const container = map.getContainer();
    // On the home screen the globe is a toy, not a map: no panning or zooming.
    const handlers = [map.dragPan, map.dragRotate, map.scrollZoom, map.doubleClickZoom, map.touchZoomRotate, map.keyboard];
    handlers.forEach((h) => h.disable());

    const remeasure = () => {
      const g = measure(map);
      const old = s.globe;
      // Skip no-op updates so this can run often without re-rendering.
      if (old && Math.abs(old.x - g.x) < 1 && Math.abs(old.y - g.y) < 1 && Math.abs(old.r - g.r) < 1) return;
      s.globe = g;
      setGlobe(g);
    };
    window.addEventListener("resize", remeasure);
    // Backstop for a lost release (let go outside the window, a cancelled
    // gesture): without it the globe would think it's still held and never slow.
    const release = () => endDrag.current();
    window.addEventListener("pointerup", release);
    window.addEventListener("blur", release);
    let sinceMeasure = 0;

    const tick = (t: number) => {
      // Real elapsed time, so a slow frame rate never turns the spin into slow motion.
      const dt = Math.min(0.25, (t - last) / 1000);
      last = t;
      const easing = map.isEasing();
      // Keep the grab area and speed ring matched to the globe as the camera
      // refits it (first load, resize, coming home from a building).
      sinceMeasure += dt;
      if ((wasEasing && !easing) || sinceMeasure > 0.5) {
        sinceMeasure = 0;
        remeasure();
      }
      wasEasing = easing;

      if (!s.dragging && !easing) {
        const dir = Math.sign(s.v) || -1;
        const rest = s.phase === "idle" ? IDLE * dir : IDLE * dir * 0.4;
        // A spin hard enough to get dizzy: enjoy the speed, then brake into the face.
        const headedForDizzy = s.phase === "idle" && s.peak >= DIZZY_AT;
        const friction = headedForDizzy ? (t - s.releasedAt < HOLD_MS ? HOLD_FRICTION_S : BRAKE_S) : FRICTION_S;
        s.v = rest + (s.v - rest) * Math.exp(-dt / friction);
        const c = map.getCenter();
        map.setCenter([c.lng + s.v * dt, c.lat]);
      }

      // Effects hit full strength at a hard human fling, well under the cap.
      const speed = Math.min(1, Math.abs(s.v) / 600);
      // Only the spin after letting go counts; a jerky drag alone shouldn't make it dizzy.
      if (!s.dragging) s.peak = Math.max(s.peak, Math.abs(s.v));
      s.angle = (s.angle + s.v * dt * 1.4) % 360;
      // Speed effects live on the overlay; filtering the WebGL canvas tanks the frame rate.
      const el = fx.current;
      if (el) {
        el.style.setProperty("--spin", speed.toFixed(3));
        el.style.setProperty("--angle", `${s.angle.toFixed(1)}deg`);
      }

      // Hint text: how long a day lasts at this speed.
      const v = Math.abs(s.v);
      const text =
        s.phase !== "idle"
          ? QUIPS[s.quip]
          : v >= 40
            ? `A day now lasts ${(360 / v).toFixed(v > 360 ? 2 : 1)} seconds`
            : s.touched
              ? ""
              : "Drag the Earth to spin it";
      if (text !== lastHint) {
        lastHint = text;
        setHint(text);
      }

      if (s.phase === "idle" && !s.dragging && s.peak >= DIZZY_AT && v < SETTLED) {
        s.peak = 0;
        // A new line each time, never the same one twice in a row.
        let next = Math.floor(Math.random() * (QUIPS.length - 1));
        if (next >= s.quip) next += 1;
        s.quip = next;
        remeasure();
        setPhaseBoth("dizzy");
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", remeasure);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("blur", release);
      handlers.forEach((h) => h.enable());
      s.dragging = false;

      container.classList.remove("map--dizzy", "map--shake");
      s.phase = "idle";
      setPhase("idle");
    };
  }, [map, active]);

  // Dizzy, then shake it off, then ready to spin again.
  useEffect(() => {
    const container = map?.getContainer();
    if (!container) return;
    // Rock around the globe itself, which sits off to one side of the screen.
    const g = st.current.globe;
    container.style.transformOrigin = g ? `${g.x}px ${g.y}px` : "";
    container.classList.toggle("map--dizzy", phase === "dizzy");
    container.classList.toggle("map--shake", phase === "shake");
    if (phase === "dizzy") {
      const id = setTimeout(() => setPhaseBoth("shake"), DIZZY_MS);
      return () => clearTimeout(id);
    }
    if (phase === "shake") {
      const id = setTimeout(() => setPhaseBoth("idle"), SHAKE_MS);
      return () => clearTimeout(id);
    }
  }, [phase, map]);

  if (!map || !active || reducedMotion()) return null;

  const onGlobe = (x: number, y: number) => {
    const g = st.current.globe;
    return !!g && Math.hypot(x - g.x, y - g.y) <= g.r * 1.02;
  };

  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = st.current;
    if (s.phase !== "idle" || map.isEasing() || !onGlobe(e.clientX, e.clientY)) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    s.dragging = true;
    s.vBeforeGrab = s.v;
    // Catching the globe ends that spin; the next release starts a fresh one.
    s.peak = 0;
    s.lastX = e.clientX;
    s.samples = [{ t: performance.now(), lng: map.getCenter().lng }];
    s.touched = true;
  };

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = st.current;
    if (!s.dragging) return;
    // The button is already up: the release event never arrived, so end it here.
    if (e.pointerType === "mouse" && e.buttons === 0) return onUp();
    const r = s.globe?.r ?? 250;
    // The point under the finger follows it: drag right, the surface moves right.
    const dLng = -((e.clientX - s.lastX) / r) * (180 / Math.PI);
    s.lastX = e.clientX;
    const c = map.getCenter();
    const lng = c.lng + dLng;
    map.setCenter([lng, c.lat]);
    const now = performance.now();
    // Unwrapped longitude, so velocity survives crossing the antimeridian.
    const prev = s.samples[s.samples.length - 1];
    s.samples.push({ t: now, lng: prev.lng + dLng });
    // Keep the last ~120 ms of movement, but always at least two points to measure from.
    const recent = s.samples.filter((p) => now - p.t < 120);
    s.samples = recent.length >= 2 ? recent : s.samples.slice(-2);
    s.v = dLng / Math.max(0.008, (now - prev.t) / 1000);
  };

  const onUp = () => {
    const s = st.current;
    if (!s.dragging) return;
    s.dragging = false;
    s.releasedAt = performance.now();
    const first = s.samples[0];
    const lastS = s.samples[s.samples.length - 1];
    const dt = (lastS.t - first.t) / 1000;
    // Fling speed from the last moments of the drag; holding still before
    // letting go fades it out instead of cutting it to zero.
    const stale = performance.now() - lastS.t;
    let v = (dt > 0.005 ? (lastS.lng - first.lng) / dt : 0) * Math.exp(-stale / 150);
    // Flinging the way it is already going builds on the spin: keep pumping it.
    if (Math.sign(v) === Math.sign(s.vBeforeGrab)) v += s.vBeforeGrab * 0.6;
    s.v = Math.max(-MAX, Math.min(MAX, v * 1.5)) || -IDLE;
  };
  endDrag.current = onUp;

  if (!globe) return null;
  const place = { left: globe.x, top: globe.y, "--r": `${globe.r}px` } as React.CSSProperties;
  return (
    <>
      {/* The grab target is the globe's disc, so the home screen's buttons stay clickable. */}
      <div
        className="globe-toy"
        style={place}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onLostPointerCapture={onUp}
        aria-hidden
      />
      <div ref={fx} className={`globe-fx globe-fx--${phase}`} style={place} aria-hidden>
        <span className="globe-fx__lines" />
        <span className="globe-fx__glow" />
        {phase !== "idle" && <DizzyFace />}
        {hint && (
          <span key={phase === "idle" ? "hint" : "quip"} className={`globe-fx__hint ${phase !== "idle" ? "globe-fx__hint--quip" : ""}`}>
            {hint}
          </span>
        )}
      </div>
    </>
  );
}

/** Spiral eyes, rosy cheeks, a wobbly grin, and stars circling overhead. */
function DizzyFace() {
  const spiral = SPIRAL;
  return (
    <div className="dizzy">
      <svg className="dizzy__face" viewBox="-100 -100 200 200">
        <g className="dizzy__eye" transform="translate(-38 -14)">
          <circle r="26" fill="#fff" />
          <g className="dizzy__spiral">
            <path d={spiral} fill="none" stroke="#1d1d1f" strokeWidth="3.4" strokeLinecap="round" />
          </g>
        </g>
        <g className="dizzy__eye" transform="translate(38 -14)">
          <circle r="26" fill="#fff" />
          <g className="dizzy__spiral dizzy__spiral--rev">
            <path d={spiral} fill="none" stroke="#1d1d1f" strokeWidth="3.4" strokeLinecap="round" />
          </g>
        </g>
        <ellipse cx="-62" cy="24" rx="15" ry="9" fill="#ff6b9a" opacity="0.75" />
        <ellipse cx="62" cy="24" rx="15" ry="9" fill="#ff6b9a" opacity="0.75" />
        <path
          className="dizzy__mouth"
          d="M-30 38 q8 -10 15 0 t15 0 t15 0 t15 0"
          fill="none"
          stroke="#1d1d1f"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M6 41 q6 16 14 2" fill="#ff5c7a" stroke="#1d1d1f" strokeWidth="3.5" strokeLinejoin="round" />
      </svg>
      <div className="dizzy__stars">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} style={{ "--i": i } as React.CSSProperties}>
            {i % 2 ? "✦" : "★"}
          </span>
        ))}
      </div>
    </div>
  );
}

/** An open Archimedean spiral (three turns out to r = 20), with gaps wide enough to read at small sizes. */
const SPIRAL = (() => {
  const turns = 3;
  const steps = 90;
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * turns * 2 * Math.PI;
    const r = (i / steps) * 20;
    pts.push(`${(r * Math.cos(a)).toFixed(2)} ${(r * Math.sin(a)).toFixed(2)}`);
  }
  return `M${pts.join(" L")}`;
})();
