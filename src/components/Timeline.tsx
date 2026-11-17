import { useEffect, useMemo, useRef, useState } from "react";
import type { Job } from "../data/types";
import type { Filters } from "../lib/filters";
import { currentYear, jobEnd, jobRangeLabel, jobStart } from "../lib/dates";
import { NextIcon, PauseIcon, PlayIcon, PrevIcon } from "./icons";
import { formatSeconds } from "../lib/readingTime";

const LANE_HEIGHT = 30;

export type TourControls = {
  /** Index into the (chronological) jobs list, or null when no tour is running. */
  step: number | null;
  paused: boolean;
  /** Time spent at each stop before advancing. */
  stepMs: number;
  onStart: () => void;
  onPrev: () => void;
  onNext: () => void;
  onTogglePause: () => void;
  onStop: () => void;
};

type Props = {
  jobs: Job[];
  visibleIds: Set<string>;
  selectedId: string | null;
  onSelect: (id: string) => void;
  filters: Filters;
  bounds: [number, number];
  onFiltersChange: (f: Filters) => void;
  tour: TourControls;
};

/** Greedy lane packing so overlapping roles stack instead of colliding. */
function assignLanes(jobs: Job[]): Map<string, number> {
  const ends: number[] = [];
  const lanes = new Map<string, number>();
  for (const j of [...jobs].sort((a, b) => jobStart(a) - jobStart(b))) {
    let lane = ends.findIndex((end) => end <= jobStart(j) + 0.001);
    if (lane === -1) lane = ends.push(0) - 1;
    ends[lane] = jobEnd(j);
    lanes.set(j.id, lane);
  }
  return lanes;
}

export function Timeline({
  jobs,
  visibleIds,
  selectedId,
  onSelect,
  filters,
  bounds,
  onFiltersChange,
  tour,
}: Props) {
  const [min, maxYear] = bounds;
  const max = maxYear + 1;
  const pct = (x: number) => ((x - min) / (max - min)) * 100;
  const lanes = useMemo(() => assignLanes(jobs), [jobs]);
  const laneCount = Math.max(0, ...lanes.values()) + 1;
  const [from, to] = filters.years;
  const isDefault = filters.companies.size === 0 && from === min && to === maxYear;

  const [open, setOpen] = useState(false);
  const popover = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!popover.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  function toggleCompany(id: string) {
    const next = new Set(filters.companies);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onFiltersChange({ ...filters, companies: next });
  }

  const ticks: number[] = [];
  for (let y = min; y <= max; y += 2) ticks.push(y);

  const tourStep = tour.step;
  const touring = tourStep !== null;
  const companyLabel =
    filters.companies.size === 0
      ? "All companies"
      : `${filters.companies.size} ${filters.companies.size === 1 ? "company" : "companies"}`;

  return (
    <section className={`timeline glass ${touring ? "timeline--touring" : ""}`} aria-label="Career timeline">
      {touring && (
        <div className="tour">
          <div className="tour__controls" role="group" aria-label="Tour controls">
            <button
              className="icon-btn"
              onClick={tour.onPrev}
              disabled={tourStep === 0}
              aria-label="Previous company"
              title="Previous (←)"
            >
              <PrevIcon />
            </button>
            <button
              className="icon-btn icon-btn--primary"
              onClick={tour.onTogglePause}
              aria-label={tour.paused ? "Resume tour" : "Pause tour"}
              title={tour.paused ? "Resume (space)" : "Pause (space)"}
            >
              {tour.paused ? <PlayIcon /> : <PauseIcon />}
            </button>
            <button className="icon-btn" onClick={tour.onNext} aria-label="Next company" title="Next (→)">
              <NextIcon />
            </button>
          </div>
          <div className="tour__label" aria-live="polite">
            <span className="tour__count">
              {tourStep + 1} / {jobs.length}
            </span>
            <span className="tour__company">{jobs[tourStep]?.company}</span>
            {tour.paused ? (
              <span className="tour__paused">Paused · press play to continue</span>
            ) : (
              <span className="tour__time" title="Estimated time to read this stop">
                {formatSeconds(tour.stepMs)} read
              </span>
            )}
          </div>
          <button className="btn btn--plain btn--small" onClick={tour.onStop}>
            End tour
          </button>
          {/* The fill's animation is the step timer: it ends, the tour advances. */}
          <div className="tour__progress">
            <div
              key={tourStep}
              className="tour__fill"
              style={
                {
                  "--tour-ms": `${tour.stepMs}ms`,
                  animationPlayState: tour.paused ? "paused" : "running",
                } as React.CSSProperties
              }
              onAnimationEnd={tour.onNext}
            />
          </div>
        </div>
      )}

      <div className={`timeline__head ${touring ? "timeline__head--hidden" : ""}`}>
        <button className="btn btn--small btn--primary" onClick={tour.onStart}>
          <PlayIcon size={12} /> Play my career
        </button>

        <div className="popover-anchor" ref={popover}>
          <button className="btn btn--plain btn--small" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            {companyLabel}
            <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden>
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.4" fill="none" strokeLinecap="round" />
            </svg>
          </button>
          {open && (
            <div className="popover glass" role="group" aria-label="Filter by company">
              {jobs.map((j) => (
                <label key={j.id} className="popover__row">
                  <input type="checkbox" checked={filters.companies.has(j.id)} onChange={() => toggleCompany(j.id)} />
                  <span className="dot" style={{ background: j.color }} />
                  <span className="popover__name">{j.company}</span>
                  <span className="muted">{jobRangeLabel(j)}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <span className="timeline__range">
          {from} – {to >= currentYear ? "Now" : to}
        </span>
        <span className="timeline__count">
          {visibleIds.size} of {jobs.length}
        </span>
        {!isDefault && (
          <button
            className="btn btn--plain btn--small"
            onClick={() => onFiltersChange({ companies: new Set(), years: bounds })}
          >
            Reset
          </button>
        )}
      </div>

      <div className="timeline__scroll">
        <div className="timeline__chart">
          <div className="timeline__bars" style={{ height: laneCount * LANE_HEIGHT }}>
            {ticks.map((y) => (
              <span key={y} className="tl-grid" style={{ left: `${pct(y)}%` }} />
            ))}
            {jobs.map((j) => {
              const s = jobStart(j);
              const classes = [
                "tl-bar",
                visibleIds.has(j.id) ? "" : "tl-bar--dim",
                selectedId === j.id ? "tl-bar--active" : "",
              ].join(" ");
              return (
                <button
                  key={j.id}
                  className={classes}
                  style={
                    {
                      left: `${pct(s)}%`,
                      width: `${pct(jobEnd(j)) - pct(s)}%`,
                      top: lanes.get(j.id)! * LANE_HEIGHT,
                      "--job": j.color,
                    } as React.CSSProperties
                  }
                  onClick={() => onSelect(j.id)}
                  title={`${j.company} · ${jobRangeLabel(j)}`}
                >
                  <span>{j.company}</span>
                </button>
              );
            })}
            <div className="tl-mask" style={{ left: 0, width: `${pct(from)}%` }} />
            <div className="tl-mask" style={{ left: `${pct(to + 1)}%`, right: 0 }} />
          </div>

          <div className="timeline__axis">
            {ticks.map((y) => (
              <span key={y} style={{ left: `${pct(y)}%` }}>
                {y}
              </span>
            ))}
          </div>

          <div className="range">
            <div className="range__track" />
            <div className="range__fill" style={{ left: `${pct(from)}%`, right: `${100 - pct(to + 1)}%` }} />
            <input
              type="range"
              min={min}
              max={max}
              value={from}
              aria-label="From year"
              onChange={(e) =>
                onFiltersChange({ ...filters, years: [Math.min(Number(e.target.value), to), to] })
              }
            />
            <input
              type="range"
              min={min}
              max={max}
              value={to + 1}
              aria-label="To year"
              onChange={(e) =>
                onFiltersChange({ ...filters, years: [from, Math.max(Number(e.target.value) - 1, from)] })
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}
