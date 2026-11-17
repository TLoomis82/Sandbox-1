import { useEffect, useRef, useState } from "react";
import type { Profile } from "../data/types";
import { PlayIcon } from "./icons";

const WIN_MS = 6000;

type Props = {
  profile: Profile;
  visible: boolean;
  onTour: () => void;
  onExplore: () => void;
  onResume: () => void;
  onServices: () => void;
  /** Mobile: true once the text has scrolled out of the way of the globe. */
  onGlobeView: (inView: boolean) => void;
};

export function Intro({ profile, visible, onTour, onExplore, onResume, onServices, onGlobeView }: Props) {
  const tab = visible ? 0 : -1;
  const scroller = useRef<HTMLElement>(null);

  // Mobile scrolls the text up and away, leaving the whole Earth to play with.
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    if (!visible) {
      el.scrollTop = 0;
      onGlobeView(false);
      return;
    }
    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      onGlobeView(max > 40 && el.scrollTop > max - 60);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [visible, onGlobeView]);

  const toGlobe = () => {
    const el = scroller.current;
    el?.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  };
  const toTop = () => scroller.current?.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <section ref={scroller} className={`intro ${visible ? "" : "intro--hidden"}`} aria-hidden={!visible}>
      <div className="intro__content">
        <div className="intro__who">
          <img className="intro__photo" src="/profile.jpg" alt="" />
          <p className="intro__eyebrow">{profile.eyebrow}</p>
        </div>
        <h1 className="intro__name">{profile.name}</h1>
        <p className="intro__headline">{profile.headline}</p>
        <p className="intro__tagline">{profile.tagline}</p>
        <div className="intro__actions">
          <button className="btn btn--primary btn--large" onClick={onTour} tabIndex={tab}>
            <PlayIcon /> Take the tour
          </button>
          <button className="btn btn--glass btn--large" onClick={onExplore} tabIndex={tab}>
            Explore the map
          </button>
          <button className="btn btn--link" onClick={onResume} tabIndex={tab}>
            Resume
          </button>
          <button className="btn btn--link" onClick={onServices} tabIndex={tab}>
            Services
          </button>
        </div>
        <dl className="intro__stats">
          {profile.stats.map((s) => (
            <div key={s.label}>
              <dt>{s.value}</dt>
              <dd>{s.label}</dd>
            </div>
          ))}
        </dl>
        <DataWins wins={profile.dataWins} active={visible} />
        <button className="intro__to-globe" onClick={toGlobe} tabIndex={tab}>
          Scroll down to spin the Earth
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      {/* Mobile only: an empty screen's worth of scroll that leaves the globe in full view. */}
      <div className="intro__globe-space" aria-hidden>
        <button className="intro__to-top" onClick={toTop} tabIndex={-1}>
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden>
            <path d="M6 15l6-6 6 6" stroke="currentColor" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to top
        </button>
      </div>
    </section>
  );
}

/** "What sets me apart": one data accomplishment at a time, auto-advancing. */
function DataWins({ wins, active }: { wins: Profile["dataWins"]; active: boolean }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!active || paused || wins.length < 2) return;
    const t = setTimeout(() => setIndex((i) => (i + 1) % wins.length), WIN_MS);
    return () => clearTimeout(t);
  }, [index, active, paused, wins.length]);

  const win = wins[index];
  if (!win) return null;
  return (
    <section
      className="wins glass"
      aria-label="What sets me apart"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <p className="wins__label">What sets me apart</p>
      <div className="wins__body" key={index} aria-live="polite">
        <h2>{win.title}</h2>
        <p>{win.detail}</p>
      </div>
      <div className="wins__dots" role="tablist" aria-label="Accomplishments">
        {wins.map((w, i) => (
          <button
            key={w.title}
            role="tab"
            aria-selected={i === index}
            aria-label={w.title}
            tabIndex={active ? 0 : -1}
            onClick={() => setIndex(i)}
          >
            {i === index && !paused && active && (
              <span className="wins__timer" style={{ animationDuration: `${WIN_MS}ms` }} />
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
