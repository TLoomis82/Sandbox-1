import { useEffect, useState } from "react";
import type { Job, PortfolioItem } from "../data/types";
import { ArrowIcon, CloseIcon } from "./icons";
import { Media } from "./Media";

type Props = {
  item: PortfolioItem | null;
  job: Job | null;
  email: string;
  onClose: () => void;
};

/** All images in a piece, in order; a single `image` is a one-item gallery. */
export function galleryOf(item: PortfolioItem): string[] {
  if (item.gallery?.length) return item.gallery;
  return item.image ? [item.image] : [];
}

export function Lightbox({ item, job, email, onClose }: Props) {
  const images = item && !item.confidential ? galleryOf(item) : [];
  const [index, setIndex] = useState(0);

  // Open on the cover image.
  useEffect(() => {
    if (item) setIndex(Math.max(0, galleryOf(item).indexOf(item.image ?? "")));
  }, [item]);

  const count = images.length;
  const go = (delta: number) => setIndex((i) => Math.min(count - 1, Math.max(0, i + delta)));

  useEffect(() => {
    if (!item) return;
    const onKey = (e: KeyboardEvent) => {
      // Capture phase + stopImmediatePropagation keeps these keys away from the
      // tour and panel handlers while the lightbox is open.
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight" && count > 1) setIndex((i) => Math.min(count - 1, i + 1));
      else if (e.key === "ArrowLeft" && count > 1) setIndex((i) => Math.max(0, i - 1));
      else return;
      e.preventDefault();
      e.stopImmediatePropagation();
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [item, count, onClose]);

  if (!item || !job) return null;
  const src = images[index] ?? item.image;

  return (
    <div className="lightbox" onClick={onClose} role="dialog" aria-modal aria-label={item.title}>
      {/* Pinned to the screen corner: on phones the card fills the screen and its Close button sits below a tall image. */}
      <button className="icon-btn lightbox__close" onClick={onClose} aria-label="Close">
        <CloseIcon size={18} />
      </button>
      <div className="lightbox__card" onClick={(e) => e.stopPropagation()}>
        <div className="lightbox__stage">
          {/* Keyed by image so each one opens scrolled to the top. */}
          <Media
            key={src}
            src={src}
            alt={count > 1 ? `${item.title}, image ${index + 1} of ${count}` : item.title}
            label={item.title}
            accent={job.color}
            locked={item.confidential}
            className="lightbox__media"
          />
          {count > 1 && (
            <>
              <button
                className="lightbox__nav lightbox__nav--prev"
                onClick={() => go(-1)}
                disabled={index === 0}
                aria-label="Previous image"
              >
                <Chevron dir="left" />
              </button>
              <button
                className="lightbox__nav lightbox__nav--next"
                onClick={() => go(1)}
                disabled={index === count - 1}
                aria-label="Next image"
              >
                <Chevron dir="right" />
              </button>
              <span className="lightbox__counter">
                {index + 1} / {count}
                {item.captions?.[index] && <span className="lightbox__caption"> · {item.captions[index]}</span>}
              </span>
            </>
          )}
        </div>

        <div className="lightbox__text">
          {src && !item.confidential && (
            <p className="lightbox__hint">
              Scroll the image to see the full design{count > 1 ? ". Use ← → to flip pages." : "."}
            </p>
          )}
          <p className="eyebrow">{job.company}</p>
          <h2>{item.title}</h2>
          <p>{item.description}</p>

          {item.caseStudy && <CaseStudy study={item.caseStudy} />}

          {count > 1 && (
            <div className="thumbs" role="tablist" aria-label="Images">
              {images.map((img, i) => (
                <button
                  key={img}
                  role="tab"
                  aria-selected={i === index}
                  aria-label={item.captions?.[i] ?? `Image ${i + 1}`}
                  title={item.captions?.[i]}
                  className="thumb"
                  onClick={() => setIndex(i)}
                >
                  <img src={img} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          )}

          {item.confidential && (
            <p className="muted">
              This project is confidential, so I can't publish screens here. I'm happy to talk through my approach and
              what I learned.
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

function CaseStudy({ study }: { study: NonNullable<PortfolioItem["caseStudy"]> }) {
  return (
    <div className="case">
      <section>
        <h3 className="eyebrow">The problem</h3>
        <p>{study.problem}</p>
      </section>
      <section>
        <h3 className="eyebrow">What I did</h3>
        <ul>
          {study.approach.map((a, i) => (
            <li key={i}>{a}</li>
          ))}
        </ul>
      </section>
      <section>
        <h3 className="eyebrow">The solution</h3>
        <ul>
          {study.solution.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </section>
      {study.outcome && (
        <section className="case__outcome">
          <h3 className="eyebrow">The outcome</h3>
          <p>{study.outcome}</p>
        </section>
      )}
    </div>
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
      <path
        d={dir === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}
        stroke="currentColor"
        strokeWidth="2.6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
