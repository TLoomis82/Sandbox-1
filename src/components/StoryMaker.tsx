import { useEffect, useRef, useState } from "react";
import { ArrowIcon, CloseIcon } from "./icons";

/**
 * One still and its camera move. The image fills the screen ("cover"), then
 * the camera only scales it about a fixed point and slides it a little, so
 * nothing is re-aimed or edge-clamped mid-move. That is what keeps it steady.
 */
type Shot = {
  src: string;
  kicker: string;
  line?: string;
  /** Zoom at the start and end of the shot. */
  start: number;
  end: number;
  /** object-position, in percent. */
  position: [number, number];
  /** The point the camera zooms toward, in percent. */
  origin: [number, number];
  /** Slide over the shot, in vw and vh. */
  shift: [number, number];
  /** Share of the shot after which the next one fades in. */
  fade: number;
  /** Black and white on entry or exit (the photograph on the dash). */
  grayIn?: boolean;
  grayOut?: boolean;
  /**
   * Portrait phones see only about a quarter of the frame's width, so a shot
   * can re-aim there: frame the subject (position) and zoom about the screen
   * center (origin) rather than the spot it occupies on a wide screen.
   */
  phone?: { position?: number; origin?: [number, number]; shift?: [number, number] };
};

const SHOTS: Shot[] = [
  {
    src: "/side/story/1-sky.webp",
    kicker: "1918 · The Western Front",
    line: "The sky over France is full of planes.",
    start: 1.06, end: 1.46, position: [50, 49], origin: [51, 56], shift: [0, -1], fade: 0.66,
  },
  {
    src: "/side/story/2-plane.webp",
    kicker: "One of them",
    line: "One pilot flies with a photograph tucked into the dash.",
    start: 1.05, end: 1.68, position: [50, 46], origin: [49, 38], shift: [0, 10], fade: 0.6,
  },
  {
    src: "/side/story/3-cockpit.webp",
    kicker: "The photograph",
    line: "His son, at the window. Waiting.",
    start: 1.04, end: 3, position: [52, 50], origin: [68, 73], shift: [-17, -19], fade: 0.8,
    grayOut: true,
    // The photo sits about 69% across the image: center it, then push straight in.
    phone: { position: 75, origin: [50, 72], shift: [0, -19] },
  },
  {
    src: "/side/story/4-room.webp",
    kicker: "Home",
    line: "He still watches the sky for his father. His mother can't bear to.",
    start: 1.05, end: 1.42, position: [66, 50], origin: [73, 54], shift: [-6, 0], fade: 0.73,
    grayIn: true,
    // Open on the boy, matching the photograph, before the pan finds his mother.
    phone: { position: 80, origin: [50, 54], shift: [0, 0] },
  },
  {
    src: "/side/story/5-window.webp",
    kicker: "Across the road",
    line: "Past the fence, a path runs into the woods.",
    start: 1.07, end: 1.76, position: [68, 49], origin: [77, 47], shift: [-16, 0], fade: 0.7,
  },
  {
    src: "/side/story/6-woods.webp",
    kicker: "The woods",
    line: "Something in the woods is watching him too.",
    start: 1.05, end: 1.73, position: [66, 50], origin: [69, 39], shift: [-12, 7], fade: 0.74,
  },
  {
    src: "/side/story/7-wolf.webp",
    kicker: "The wolf",
    start: 1.02, end: 1.17, position: [65, 50], origin: [64, 45], shift: [0, 0], fade: 1,
  },
];

const ROOM = 3;
/** Scroll per shot, in screen heights. */
const SCREENS_PER_SHOT = 1.25;
const TOTAL = SHOTS.length;

const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (t: number) => {
  t = clamp(t);
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** On a phone only a slice of the frame fits, so the room pans to find his mother, then back to the boy. */
function objectX(i: number, u: number, portrait: boolean) {
  const x = (portrait && SHOTS[i].phone?.position) || SHOTS[i].position[0];
  if (!portrait || i !== ROOM) return x;
  // Hold on the boy while the color comes in, then find his mother, then back to the boy.
  if (u < 0.3) return x;
  if (u < 0.48) return lerp(x, 22, ease((u - 0.3) / 0.18));
  if (u < 0.6) return 22;
  return lerp(22, 80, ease((u - 0.6) / 0.32));
}

type Props = { email: string; onClose: () => void };

/** How quickly the camera catches up to the scroll position (seconds to close most of the gap). */
const GLIDE_S = 0.16;

type Frame = {
  k: number;
  stills: { i: number; transform: string; origin: string; position: string; opacity: number; filter: string }[];
  beat: number;
  cta: number;
  drift: number;
};

/** Everything on screen for one position along the story. Pure, so it can run every frame. */
function frameAt(pos: number, portrait: boolean, reduce: boolean): Frame {
  const k = Math.min(SHOTS.length - 1, Math.floor(pos));
  const u = clamp(pos - k);
  const last = k === SHOTS.length - 1;
  // The next shot fades in on top while the current one keeps moving underneath.
  const fade = last ? 0 : ease((u - SHOTS[k].fade) / (1 - SHOTS[k].fade));
  const stills: Frame["stills"] = [];

  const still = (i: number, opacity: number) => {
    const s = SHOTS[i];
    const origin = (portrait && s.phone?.origin) || s.origin;
    const shift = (portrait && s.phone?.shift) || s.shift;
    const local = reduce ? 0 : clamp(pos - i);
    const zoom = lerp(s.start, s.end, ease(local));
    const gray = s.grayOut ? ease((local - s.fade) / (1 - s.fade)) : s.grayIn ? 1 - ease(local / 0.25) : 0;
    stills.push({
      i,
      transform: `translate3d(${(shift[0] * local).toFixed(3)}vw, ${(shift[1] * local).toFixed(3)}vh, 0) scale(${zoom.toFixed(5)})`,
      origin: `${origin[0]}% ${origin[1]}%`,
      position: `${objectX(i, local, portrait).toFixed(2)}% ${s.position[1]}%`,
      opacity,
      filter: filters(gray),
    });
  };
  still(k, 1);
  if (fade > 0) still(k + 1, fade);

  const cta = last ? ease((u - 0.45) / 0.35) : 0;
  const beat = ease(u / 0.08) * (last ? 1 - cta : 1 - ease((u - SHOTS[k].fade + 0.08) / 0.1));
  return { k, stills, beat, cta, drift: pos / TOTAL };
}

/**
 * "The Story Maker": seven cinematic stills joined by slow push-ins and
 * crossfades (the cockpit, the photo on the dash, the boy, the woods, the
 * wolf). Native scroll drives it, so scrolling up plays it backward. The
 * camera glides toward the scroll position each frame instead of jumping with
 * each wheel step, and styles are written straight to the DOM so React never
 * re-renders mid-move.
 */
export function StoryMaker({ email, onClose }: Props) {
  const scroller = useRef<HTMLDivElement>(null);
  const imgs = useRef<(HTMLImageElement | null)[]>([]);
  const beatEl = useRef<HTMLDivElement>(null);
  const ctaEl = useRef<HTMLDivElement>(null);
  const mistEl = useRef<HTMLDivElement>(null);
  const dustEl = useRef<HTMLDivElement>(null);
  // Only things that change a few times per story go through React.
  const [k, setK] = useState(0);
  const [started, setStarted] = useState(false);
  const [ctaLive, setCtaLive] = useState(false);
  const [loaded, setLoaded] = useState(0);

  // Preload every still so a push never lands on a blank frame.
  useEffect(() => {
    let alive = true;
    SHOTS.forEach((s) => {
      const img = new Image();
      img.onload = img.onerror = () => alive && setLoaded((n) => n + 1);
      img.src = s.src;
    });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let target = 0;
    let pos = -1;
    let last = performance.now();
    let raf = 0;
    let shown = new Set<number>();
    let lastK = -1;

    const readScroll = () => {
      const max = Math.max(1, el.scrollHeight - el.clientHeight);
      target = clamp(el.scrollTop / max) * TOTAL;
    };

    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      const dt = Math.min(0.1, (t - last) / 1000);
      last = t;
      const before = pos;
      pos = pos < 0 || reduce ? target : pos + (target - pos) * (1 - Math.exp(-dt / GLIDE_S));
      if (Math.abs(target - pos) < 1e-4) pos = target;
      if (pos === before) return; // settled: nothing to repaint

      const f = frameAt(pos, window.innerHeight > window.innerWidth * 1.1, reduce);
      const now = new Set<number>();
      f.stills.forEach((st, z) => {
        const img = imgs.current[st.i];
        if (!img) return;
        now.add(st.i);
        img.style.transform = st.transform;
        img.style.transformOrigin = st.origin;
        img.style.objectPosition = st.position;
        img.style.opacity = String(st.opacity);
        img.style.filter = st.filter;
        img.style.zIndex = String(1 + z);
        img.style.visibility = "visible";
      });
      shown.forEach((i) => {
        if (!now.has(i) && imgs.current[i]) imgs.current[i]!.style.visibility = "hidden";
      });
      shown = now;
      if (beatEl.current) beatEl.current.style.opacity = String(f.beat);
      if (ctaEl.current) ctaEl.current.style.opacity = String(f.cta);
      if (mistEl.current) mistEl.current.style.transform = `translate3d(${(f.drift * -240).toFixed(1)}px, ${(f.drift * -80).toFixed(1)}px, 0)`;
      if (dustEl.current) dustEl.current.style.transform = `translate3d(${(f.drift * -600).toFixed(1)}px, ${(f.drift * -1400).toFixed(1)}px, 0)`;
      if (f.k !== lastK) {
        lastK = f.k;
        setK(f.k);
      }
      setStarted(pos > 0.04);
      setCtaLive(f.cta > 0.6);
    };

    const repaint = () => {
      pos = -1; // force a full redraw at the new size
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    el.addEventListener("scroll", readScroll, { passive: true });
    window.addEventListener("resize", repaint);
    window.addEventListener("keydown", onKey);
    el.focus();
    readScroll();
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", readScroll);
      window.removeEventListener("resize", repaint);
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const beat = SHOTS[k];

  return (
    <div className="sm" role="dialog" aria-label="The Story Maker">
      <div className="sm__scroll" ref={scroller} tabIndex={-1}>
        <div style={{ height: `${TOTAL * SCREENS_PER_SHOT * 100 + 100}svh` }} />
      </div>

      <div className="sm__stage" aria-hidden>
        {SHOTS.map((s, i) => (
          <img
            key={s.src}
            ref={(el) => (imgs.current[i] = el)}
            className="sm__still"
            src={s.src}
            alt=""
            draggable={false}
            decoding="async"
            style={{ visibility: "hidden" }}
          />
        ))}
        <div className="sm__mist" ref={mistEl} />
        <div className="sm__dust" ref={dustEl} />
        <div className="sm__grain" />
        <div className="sm__vignette" />
        {loaded < SHOTS.length && <div className="sm__loading">Loading the reel…</div>}
      </div>

      <div className="sm__beat" key={k} ref={beatEl}>
        <p className="sm__kicker">{beat.kicker}</p>
        {beat.line && <p className="sm__line">{beat.line}</p>}
      </div>

      {!started && (
        <div className="sm__hint">
          <span>Scroll to begin</span>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}

      <ol className="sm__dots" aria-hidden>
        {SHOTS.map((s, i) => (
          <li key={s.src} className={i === k ? "is-on" : i < k ? "is-past" : ""} />
        ))}
      </ol>

      <div className="sm__cta" ref={ctaEl} style={{ opacity: 0, pointerEvents: ctaLive ? "auto" : "none" }}>
        <p className="sm__kicker">An original screenplay by Tyler Grant Loomis</p>
        <h2>The Story Maker</h2>
        <p className="sm__logline">
          An imaginative young boy, reeling from the loss of his father, finds solace in a giant wolf that stalks the
          woods beside his home.
        </p>
        <p className="sm__comps">
          <em>Pete's Dragon</em> meets <em>Bridge to Terabithia</em>.
        </p>
        <a
          className="btn btn--primary btn--large"
          href={`mailto:${email}?subject=${encodeURIComponent("The Story Maker screenplay")}&body=${encodeURIComponent(
            "Hi Tyler,\n\nI'd like to know more about The Story Maker.\n\n",
          )}`}
          tabIndex={ctaLive ? 0 : -1}
        >
          Want to know more about the script? <ArrowIcon />
        </a>
      </div>

      <button className="icon-btn sm__close" onClick={onClose} aria-label="Close The Story Maker">
        <CloseIcon />
      </button>
    </div>
  );
}

/** Black and white for the photograph. Blur is left out on purpose: re-blurring a
 * full-screen image every frame is what made the camera stutter. */
function filters(gray: number) {
  if (gray < 0.01) return "";
  const g = Math.round(gray * 50) / 50; // coarse steps, so the filter isn't recomputed every frame
  return `grayscale(${g}) sepia(${(g * 0.18).toFixed(3)}) contrast(${(1 + g * 0.12).toFixed(3)})`;
}
