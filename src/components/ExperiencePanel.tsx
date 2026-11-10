import { useEffect, useState } from "react";
import type { Job, PortfolioItem } from "../data/types";
import { duration, formatRange, jobRangeLabel } from "../lib/dates";
import { CloseIcon } from "./icons";
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

export function ExperiencePanel({ job, siblings, email, onSelect, onClose, onOpenItem }: Props) {
  // Keep the last job rendered while the panel animates out.
  const [shown, setShown] = useState<Job | null>(job);
  const [positionId, setPositionId] = useState<string | null>(null);

  useEffect(() => {
    if (job) {
      setShown(job);
      setPositionId(job.positions[0]?.id ?? null);
    }
  }, [job]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const position = shown?.positions.find((p) => p.id === positionId) ?? shown?.positions[0];
  const hasNda = position?.portfolio.some((i) => i.confidential);
  const meta = shown ? [shown.location.city, jobRangeLabel(shown)].filter(Boolean).join(" · ") : "";

  return (
    <aside className={`panel glass ${job ? "panel--open" : ""}`} aria-hidden={!job} aria-label="Experience">
      {shown && position && (
        <>
          <header className="panel__hero" style={{ "--job": shown.color } as React.CSSProperties} key={shown.id}>
            <div className="panel__grabber" />
            <button className="icon-btn panel__close" onClick={onClose} aria-label="Close">
              <CloseIcon />
            </button>
            <div className="panel__logo">{shown.logo ? <img src={shown.logo} alt="" /> : shown.monogram}</div>
            <p className="panel__meta">{meta}</p>
            <h2>{shown.company}</h2>
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

          {shown.positions.length > 1 && (
            <div className="role-tabs" role="tablist" aria-label="Positions">
              {shown.positions.map((p) => (
                <button
                  key={p.id}
                  role="tab"
                  aria-selected={p.id === position.id}
                  onClick={() => setPositionId(p.id)}
                >
                  {p.title}
                </button>
              ))}
            </div>
          )}

          <div className="panel__body" key={position.id}>
            <h3>{position.title}</h3>
            <p className="muted panel__dates">
              {formatRange(position)} · {duration(position)}
            </p>
            {position.summary && <p className="panel__summary">{position.summary}</p>}

            {position.metrics && (
              <div className="metrics" style={{ "--job": shown.color } as React.CSSProperties}>
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
                    <button key={item.id} className="work-card" onClick={() => onOpenItem(item, shown)}>
                      <Media
                        src={item.image}
                        alt=""
                        label={item.title}
                        accent={shown.color}
                        locked={item.confidential}
                        className="work-card__media"
                      />
                      <div className="work-card__text">
                        <strong>{item.title}</strong>
                        <span>{item.description}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )}
          </div>
        </>
      )}
    </aside>
  );
}
