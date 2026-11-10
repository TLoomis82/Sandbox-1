import { useEffect } from "react";
import type { Job, PortfolioItem } from "../data/types";
import { ArrowIcon } from "./icons";
import { Media } from "./Media";

type Props = {
  item: PortfolioItem | null;
  job: Job | null;
  email: string;
  onClose: () => void;
};

export function Lightbox({ item, job, email, onClose }: Props) {
  useEffect(() => {
    if (!item) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopImmediatePropagation();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [item, onClose]);

  if (!item || !job) return null;

  return (
    <div className="lightbox" onClick={onClose} role="dialog" aria-modal aria-label={item.title}>
      <div className="lightbox__card" onClick={(e) => e.stopPropagation()}>
        <Media
          src={item.image}
          alt={item.title}
          label={item.title}
          accent={job.color}
          locked={item.confidential}
          className="lightbox__media"
        />
        <div className="lightbox__text">
          <p className="eyebrow">{job.company}</p>
          <h2>{item.title}</h2>
          <p>{item.description}</p>
          {item.confidential && (
            <p className="muted">
              This project is under NDA, so I can't publish screens here. I'm happy to walk through the problem, my
              approach, and the outcome live.
            </p>
          )}
          {item.tags && (
            <div className="tags">
              {item.tags.map((t) => (
                <span key={t} className="tag">
                  {t}
                </span>
              ))}
            </div>
          )}
          <div className="lightbox__actions">
            {item.link && (
              <a className="btn btn--primary" href={item.link} target="_blank" rel="noopener">
                View project <ArrowIcon />
              </a>
            )}
            {item.confidential && (
              <a className="btn btn--primary" href={`mailto:${email}?subject=Walkthrough: ${item.title}`}>
                Request a walkthrough
              </a>
            )}
            <button className="btn btn--plain" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
