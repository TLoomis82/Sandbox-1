import type { Job } from "../data/types";

/** Average adult silent-reading speed for non-fiction (Brysbaert, 2019). */
const WORDS_PER_MINUTE = 238;
/** The camera's fly-in to the building, before anyone starts reading. */
const FLY_MS = 3600;
/** A glance at each portfolio thumbnail. */
const PER_CARD_MS = 2500;
/** Bounds so a near-empty stop doesn't flash by and a long one doesn't stall the tour. */
const MIN_MS = 8000;
const MAX_MS = 90000;

const words = (text: string | undefined) => (text ? text.trim().split(/\s+/).filter(Boolean).length : 0);

/** Every word the experience panel shows for a job. */
function panelWords(job: Job): number {
  let n = words(job.company) + words(job.location.city);
  for (const p of job.positions) {
    n += words(p.title) + words(p.summary);
    if (typeof p.promotion === "string") n += words(p.promotion);
    for (const m of p.metrics ?? []) n += words(m.value) + words(m.label);
    for (const h of p.highlights) n += words(h);
    for (const item of p.portfolio) n += words(item.title) + words(item.description);
  }
  for (const press of job.press ?? []) n += words(press.title) + words(press.outlet);
  return n;
}

/** How long the tour should stay on a job: time to fly in, read, and glance at the work. */
export function tourStopMs(job: Job): number {
  const cards = job.positions.reduce((n, p) => n + p.portfolio.length, 0);
  const readMs = (panelWords(job) / WORDS_PER_MINUTE) * 60_000;
  const total = FLY_MS + readMs + cards * PER_CARD_MS;
  return Math.round(Math.min(MAX_MS, Math.max(MIN_MS, total)));
}

/** "45s" or "1:05". */
export function formatSeconds(ms: number): string {
  const s = Math.round(ms / 1000);
  return s < 60 ? `${s}s` : `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
