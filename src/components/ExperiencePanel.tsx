import { useEffect, useRef, useState } from "react";
import type { Job, PortfolioItem, Position } from "../data/types";
import { duration, formatMonth, formatRange, jobRangeLabel } from "../lib/dates";
import { CompanyLogo } from "./CompanyLogo";
import { ArrowIcon, CloseIcon, PromotedIcon, RemoteIcon } from "./icons";
import { Media } from "./Media";

type Props = {
  job: Job | null;
  /** Other companies in the same building. */
  siblings: Job[];
  email: string;
  onSelect: (id: string) => void;
  onClose: () => void;
  onOpenItem: (item: PortfolioItem, job: Job) => void;
};

type Snap = "peek" | "half" | "full";
const SNAPS: Snap[] = ["peek", "half", "full"];
const isPhone = () => window.innerWidth <= 900;
function snapPx(s: Snap) {
  const h = window.innerHeight;
  return s === "peek" ? Math.round(h * 0.42) : s === "half" ? Math.round(h * 0.62) : h - 64;
}
/** Phones open short so the map stays in view; desktop's side panel ignores this. */
const openSnap = (): Snap => (isPhone() ? "peek" : "half");

export function ExperiencePanel({ job, siblings, email, onSelect, onClose, onOpenItem }: Props) {
  // Keep the last job rendered while the panel animates out.
  const [shown, setShown] = useState<Job | null>(job);
  const panel = useRef<HTMLElement>(null);
  const [snap, setSnap] = useState<Snap>(openSnap);

  useEffect(() => {
    if (job) setShown(job);
  }, [job]);

  // Each new company opens at the starting height.
  useEffect(() => setSnap(openSnap()), [job?.id]);

  // Phone bottom sheet: swipe up for more, down to see more map, down again to close.
  useEffect(() => {
    const el = panel.current;
    if (!el) return;
    let y0 = 0;
    let t0 = 0;
    let start = 0;
    let mode: "undecided" | "sheet" | "scroll" = "scroll";
    let atTop = true;
    let inBody = false;
    let lastH = 0;

    const onStart = (e: TouchEvent) => {
      if (!isPhone()) return;
      y0 = e.touches[0].clientY;
      t0 = performance.now();
      start = el.getBoundingClientRect().height;
      lastH = start;
      const body = el.querySelector<HTMLElement>(".panel__body");
      inBody = !!body && body.contains(e.target as Node);
      atTop = !body || body.scrollTop <= 0;
      mode = "undecided";
    };
    const onMove = (e: TouchEvent) => {
      if (mode === "scroll") return;
      const dy = e.touches[0].clientY - y0;
      if (mode === "undecided") {
        if (Math.abs(dy) < 6) return;
        const full = start >= snapPx("full") - 4;
        // Drag the sheet from its header, when pulling down at the top of the
        // content, or when pushing up before it's full; otherwise just scroll.
        mode = !inBody || (dy > 0 && atTop) || (dy < 0 && !full) ? "sheet" : "scroll";
        if (mode === "scroll") return;
        el.classList.add("panel--dragging");
      }
      e.preventDefault();
      lastH = Math.max(80, Math.min(snapPx("full"), start - dy));
      el.style.height = `${lastH}px`;
    };
    const onEnd = (e: TouchEvent) => {
      if (mode !== "sheet") return;
      mode = "scroll";
      el.classList.remove("panel--dragging");
      el.style.height = "";
      const dy = e.changedTouches[0].clientY - y0;
      const v = dy / Math.max(1, performance.now() - t0); // px per ms, positive is down
      const peek = snapPx("peek");
      if (lastH < peek * 0.7 || (v > 0.9 && start <= peek + 4)) {
        onClose();
        return;
      }
      let target: Snap;
      if (Math.abs(v) > 0.5) {
        // A flick moves one stop in its direction.
        const from = SNAPS.reduce((a, b) => (Math.abs(snapPx(b) - start) < Math.abs(snapPx(a) - start) ? b : a));
        const i = SNAPS.indexOf(from) + (v < 0 ? 1 : -1);
        target = SNAPS[Math.max(0, Math.min(SNAPS.length - 1, i))];
      } else {
        target = SNAPS.reduce((a, b) => (Math.abs(snapPx(b) - lastH) < Math.abs(snapPx(a) - lastH) ? b : a));
      }
      setSnap(target);
    };

    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: false });
    el.addEventListener("touchend", onEnd);
    el.addEventListener("touchcancel", onEnd);
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onEnd);
      el.removeEventListener("touchcancel", onEnd);
    };
  }, [onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const meta = shown ? [shown.location.city, jobRangeLabel(shown)].filter(Boolean).join(" · ") : "";
  const promotions = shown?.positions.filter((p) => p.promotion).length ?? 0;
  const roles = shown?.positions.length ?? 0;

  return (
    <aside
      ref={panel}
      className={`panel glass panel--${snap} ${job ? "panel--open" : ""}`}
      aria-hidden={!job}
      aria-label="Experience"
    >
      {shown && (
        <>
          {/* Sibling keys must differ: a shared key leaves stale headers stacked in the panel. */}
          <header
            className="panel__hero"
            style={{ "--job": shown.color } as React.CSSProperties}
            key={`hero-${shown.id}`}
          >
            {/* Tap the grabber to step through peek, half, and full. */}
            <button
              className="panel__grabber"
              aria-label={snap === "full" ? "Show more map" : "Show more details"}
              onClick={() => setSnap((s) => (s === "full" ? "peek" : SNAPS[SNAPS.indexOf(s) + 1]))}
            />
            <button className="icon-btn panel__close" onClick={onClose} aria-label="Close">
              <CloseIcon />
            </button>
            <CompanyLogo job={shown} className="panel__logo" />
            <p className="panel__meta">{meta}</p>
            <h2>{shown.company}</h2>
            {(roles > 1 || promotions > 0 || shown.location.remote) && (
              <p className="panel__chips">
                {shown.location.remote && (
                  <span className="chip-static">
                    <RemoteIcon size={12} />
                    Remote
                  </span>
                )}
                {roles > 1 && <span className="chip-static">{roles} roles</span>}
                {promotions > 0 && (
                  <span className="chip-static chip-static--promoted">
                    <PromotedIcon size={12} />
                    {promotions === 1 ? "Promoted" : `Promoted ${promotions}×`}
                  </span>
                )}
              </p>
            )}
            {siblings.length > 0 && (
              <p className="panel__siblings">
                Same building:{" "}
                {siblings.map((s) => (
                  <button key={s.id} onClick={() => onSelect(s.id)}>
                    {s.company}
                  </button>
                ))}
              </p>
            )}
          </header>

          {/* Every role on one page, newest first, so career growth reads top to bottom. */}
          <div className="panel__body" key={`body-${shown.id}`}>
            <ol className={`roles ${roles > 1 ? "roles--ladder" : ""}`} style={{ "--job": shown.color } as React.CSSProperties}>
              {shown.positions.map((p, i) => (
                <li key={p.id} className="roles__item">
                  <Role position={p} job={shown} email={email} onOpenItem={onOpenItem} />
                  {i < roles - 1 && <Step position={p} fromTitle={shown.positions[i + 1].title} />}
                </li>
              ))}
            </ol>

            {shown.press && shown.press.length > 0 && (
              <section className="press">
                <h4 className="eyebrow">In the news</h4>
                {shown.press.map((p) => (
                  <a key={p.url} className="press__item" href={p.url} target="_blank" rel="noopener">
                    <span className="press__meta">
                      {p.outlet} · {formatMonth(p.date)}
                    </span>
                    <strong>{p.title}</strong>
                    <span className="press__arrow" aria-hidden>
                      <ArrowIcon size={14} />
                    </span>
                  </a>
                ))}
              </section>
            )}
          </div>
        </>
      )}
    </aside>
  );
}

/** Marker between a role and the one before it (or the earlier title, if that isn't listed). */
function Step({ position, fromTitle, inline }: { position: Position; fromTitle: string; inline?: boolean }) {
  if (!position.promotion) {
    return (
      <div className="step">
        <span className="step__label">Previously</span>
      </div>
    );
  }
  return (
    <div className={`step step--promoted ${inline ? "step--inline" : ""}`}>
      <span className="step__badge">
        <PromotedIcon size={12} /> Promoted from {fromTitle}
      </span>
      {typeof position.promotion === "string" && <p className="step__reason">{position.promotion}</p>}
    </div>
  );
}

function Role({
  position,
  job,
  email,
  onOpenItem,
}: {
  position: Position;
  job: Job;
  email: string;
  onOpenItem: (item: PortfolioItem, job: Job) => void;
}) {
  const hasNda = position.portfolio.some((i) => i.confidential);
  return (
    <section className="role">
      <span className="role__dot" aria-hidden />
      <h3>{position.title}</h3>
      <p className="muted panel__dates">
        {formatRange(position)} · {duration(position)}
      </p>
      {position.promotion && position.promotedFrom && (
        <Step position={position} fromTitle={position.promotedFrom} inline />
      )}
      {position.summary && <p className="panel__summary">{position.summary}</p>}

      {position.metrics && (
        <div className="metrics" style={{ "--job": job.color } as React.CSSProperties}>
          {position.metrics.map((m) => (
            <div key={m.label} className="metric">
              <strong>{m.value}</strong>
              <span>{m.label}</span>
            </div>
          ))}
        </div>
      )}

      {position.highlights.length > 0 && (
        <ul className="highlights">
          {position.highlights.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
      )}

      {position.skills && (
        <div className="tags">
          {position.skills.map((s) => (
            <span key={s} className="tag">
              {s}
            </span>
          ))}
        </div>
      )}

      {position.portfolio.length > 0 && (
        <section className="work">
          <h4 className="eyebrow">Selected work</h4>
          {hasNda && (
            <p className="nda-note">
              Some of this work is under NDA, so details are generalized.{" "}
              <a href={`mailto:${email}?subject=Portfolio walkthrough`}>Ask for a walkthrough</a>
            </p>
          )}
          <div className="work__grid">
            {position.portfolio.map((item) => (
              <button key={item.id} className="work-card" onClick={() => onOpenItem(item, job)}>
                <Media
                  src={item.image}
                  alt=""
                  label={item.title}
                  accent={job.color}
                  locked={item.confidential}
                  className="work-card__media"
                />
                {(item.gallery?.length ?? 0) > 1 && (
                  <span className="work-card__count">{item.gallery!.length} images</span>
                )}
                <div className="work-card__text">
                  <strong>{item.title}</strong>
                  <span>{item.description}</span>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}
    </section>
  );
}
