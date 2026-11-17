import { useEffect, useRef, useState } from "react";
import { roles, stalls, type RoleId } from "../data/services";

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Run `fn` once, the first time `el` scrolls into view. */
function useOnceVisible(ref: React.RefObject<Element>, fn: () => void) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) return fn();
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          io.disconnect();
          fn();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
    // Fires once per mount by design.
  }, []);
}

// ── Where I come in ─────────────────────────────────────────────────────────

const CIRCLES: Exclude<RoleId, "all">[] = ["design", "data", "code"];

/** Three overlapping circles; each one alone falls short, the middle is me. */
export function RoleVenn() {
  const [active, setActive] = useState<RoleId>("all");
  const role = roles[active];
  const bind = (id: RoleId) => ({
    "aria-pressed": active === id,
    onMouseEnter: () => setActive(id),
    onFocus: () => setActive(id),
    onClick: () => setActive(id),
  });

  return (
    <div className="venn-wrap">
      <div className={`venn venn--${active}`} onMouseLeave={() => setActive("all")}>
        {CIRCLES.map((id) => (
          <button key={id} className={`venn__circle venn__circle--${id}`} {...bind(id)}>
            <span>{roles[id].label}</span>
          </button>
        ))}
        <button className="venn__center" aria-label="All three" {...bind("all")}>
          <img src="/profile.jpg" alt="" />
        </button>
      </div>
      <div className="venn__detail" aria-live="polite">
        <div key={active} className="venn__detail-inner">
          <p className="eyebrow">{active === "all" ? "Where I come in" : "What goes missing"}</p>
          <h3>{role.title}</h3>
          <p>{role.detail}</p>
          {active !== "all" && (
            <button className="btn btn--plain btn--small" onClick={() => setActive("all")}>
              Now add the other two
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Where projects stall ────────────────────────────────────────────────────

/** A project line from idea to growth; drag or pick a stage to see the stall and the fix. */
export function StallTrack() {
  const [i, setI] = useState(0);
  const rail = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const last = stalls.length - 1;
  const s = stalls[i];

  const pickAt = (clientX: number) => {
    const r = rail.current!.getBoundingClientRect();
    const t = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    setI(Math.round(t * last));
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") setI((n) => Math.min(last, n + 1));
    else if (e.key === "ArrowLeft") setI((n) => Math.max(0, n - 1));
    else return;
    e.preventDefault();
  };

  return (
    <div className="stall" style={{ "--n": stalls.length, "--p": `${(i / last) * 100}%` } as React.CSSProperties}>
      <div
        className="stall__rail"
        ref={rail}
        onPointerDown={(e) => {
          dragging.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          pickAt(e.clientX);
        }}
        onPointerMove={(e) => dragging.current && pickAt(e.clientX)}
        onPointerUp={() => (dragging.current = false)}
        onPointerCancel={() => (dragging.current = false)}
        aria-hidden
      >
        <span className="stall__line" />
        <span className="stall__fill" />
        <span className="stall__knob" />
      </div>
      <div className="stall__stops" role="tablist" aria-label="Project stage" onKeyDown={onKey}>
        {stalls.map((x, j) => (
          <button
            key={x.stage}
            role="tab"
            aria-selected={j === i}
            tabIndex={j === i ? 0 : -1}
            className={`stall__stop ${j <= i ? "is-past" : ""}`}
            onClick={() => setI(j)}
          >
            {x.stage}
          </button>
        ))}
      </div>
      <div className="stall__cards" key={i}>
        <article className="stall__card stall__card--problem">
          <p className="eyebrow">Where it stalls</p>
          <p>{s.stall}</p>
        </article>
        <article className="stall__card stall__card--fix">
          <p className="eyebrow">Where I come in</p>
          <p>{s.fix}</p>
          <p className="stall__proof">{s.proof}</p>
        </article>
      </div>
    </div>
  );
}

// ── Less, on purpose ────────────────────────────────────────────────────────

const CLUTTER = [
  "Leads", "Views", "Saves", "Shares", "Calls", "Emails", "Texts", "Tasks",
  "Open houses", "Price changes", "Days on market", "Bounce rate", "Sessions", "CTR", "Referrals", "Docs",
  "Impressions", "Clicks", "Avg. price", "Showings", "Offers", "Closings", "Ad spend", "Followers",
];
const ALERTS = ["3 sync errors", "Profile 64% complete", "12 unread", "New report available", "Update billing"];
const CLUTTER_ROWS = ["Contact", "Source", "Stage", "Owner", "Score", "Updated", "Tags", "Notes"];

/** Drag-to-compare: a dashboard that shows everything vs. one that shows what users asked for. */
export function ClarityCompare() {
  const [pos, setPos] = useState(50);
  const box = useRef<HTMLDivElement>(null);

  // A one-time nudge so visitors see that it moves.
  useOnceVisible(box, () => {
    if (reducedMotion()) return;
    const keys = [50, 72, 30, 50];
    const t0 = performance.now();
    const D = 1800;
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / D) * (keys.length - 1);
      const k = Math.min(keys.length - 2, Math.floor(p));
      const f = p - k;
      const ease = f < 0.5 ? 2 * f * f : 1 - Math.pow(-2 * f + 2, 2) / 2;
      setPos(keys[k] + (keys[k + 1] - keys[k]) * ease);
      if (p < keys.length - 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });

  return (
    <figure className="clarity-fig">
      <div className="clarity" ref={box} style={{ "--pos": `${pos}%` } as React.CSSProperties}>
        <div className="clarity__pane clarity__pane--before" aria-hidden>
          <div className="mock-tabs">
            {["Overview", "Leads", "Listings", "Reports", "Marketing", "Docs", "Settings", "More"].map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
          <div className="mock-alerts">
            {ALERTS.map((a) => (
              <span key={a}>{a}</span>
            ))}
          </div>
          <div className="mock-tiles">
            {CLUTTER.map((label, n) => (
              <div key={label} className="mock-tile">
                <span>{label}</span>
                <strong>{(n * 37 + 12) % 900}</strong>
                <i style={{ width: `${20 + ((n * 23) % 70)}%` }} />
              </div>
            ))}
          </div>
          <div className="mock-table">
            {CLUTTER_ROWS.map((r) => (
              <span key={r}>{r}</span>
            ))}
            {Array.from({ length: 96 }, (_, n) => (
              <i key={n} style={{ width: `${40 + ((n * 17) % 55)}%` }} />
            ))}
          </div>
        </div>

        <div className="clarity__pane clarity__pane--after" aria-hidden>
          <p className="mock-hello">Good morning. Here's your day.</p>
          <div className="mock-kpis">
            <div>
              <strong>12</strong>
              <span>leads to call today</span>
            </div>
            <div>
              <strong>3</strong>
              <span>listings need photos</span>
            </div>
            <div>
              <strong>4 min</strong>
              <span>your reply time</span>
            </div>
          </div>
          <div className="mock-next">
            <span>Next up</span>
            <p>Call the Parkers about Saturday's showing</p>
            <p>Send the offer summary for Elm Ave</p>
          </div>
        </div>

        <span className="clarity__tag clarity__tag--before">Everything we could show</span>
        <span className="clarity__tag clarity__tag--after">What agents asked for</span>
        <div className="clarity__handle" aria-hidden>
          <span>
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
        <input
          className="clarity__range"
          type="range"
          min={0}
          max={100}
          step={0.5}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label="Drag to compare the cluttered and simplified dashboards"
        />
      </div>
      <figcaption className="muted">An illustration of the approach behind the agent CRM redesign. Sample data.</figcaption>
    </figure>
  );
}

// ── Results band ────────────────────────────────────────────────────────────

/** "300%" counts up from 0% the first time it scrolls into view. */
export function CountUp({ value }: { value: string }) {
  const match = value.match(/^(\d+)(.*)$/);
  const target = match ? Number(match[1]) : 0;
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(match && !reducedMotion() ? 0 : target);

  useOnceVisible(ref, () => {
    if (!match || reducedMotion()) return setN(target);
    const t0 = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / 1400);
      setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });

  return <span ref={ref}>{match ? `${n}${match[2]}` : value}</span>;
}
