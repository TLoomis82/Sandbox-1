import type { Job, Position } from "../data/types";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const currentYear = new Date().getFullYear();

export function yearOf(ym: string | null): number {
  return ym ? Number(ym.slice(0, 4)) : currentYear;
}

/** "YYYY-MM" as fractional years. `end` measures to the end of that month. */
export function toYears(ym: string | null, end = false): number {
  if (!ym) {
    const now = new Date();
    return now.getFullYear() + (now.getMonth() + 1) / 12;
  }
  const [y, m] = ym.split("-").map(Number);
  return y + (end ? m : m - 1) / 12;
}

export const jobStart = (job: Job) => Math.min(...job.positions.map((p) => toYears(p.start)));
export const jobEnd = (job: Job) => Math.max(...job.positions.map((p) => toYears(p.end, true)));

export function formatMonth(ym: string | null): string {
  if (!ym) return "Present";
  const [y, m] = ym.split("-");
  return `${MONTHS[Number(m) - 1]} ${y}`;
}

export function formatRange(p: Position): string {
  return `${formatMonth(p.start)} – ${formatMonth(p.end)}`;
}

/** Earliest start and latest end year across all positions at a job. */
export function jobSpan(job: Job): [number, number] {
  const starts = job.positions.map((p) => yearOf(p.start));
  const ends = job.positions.map((p) => yearOf(p.end));
  return [Math.min(...starts), Math.max(...ends)];
}

export function jobRangeLabel(job: Job): string {
  const [s, e] = jobSpan(job);
  const current = job.positions.some((p) => p.end === null);
  return `${s} – ${current ? "Present" : e}`;
}

/** Duration like "2 yrs 4 mos". */
export function duration(p: Position): string {
  const total = Math.round((toYears(p.end, true) - toYears(p.start)) * 12);
  const yrs = Math.floor(total / 12);
  const mos = total % 12;
  const parts = [];
  if (yrs) parts.push(`${yrs} yr${yrs > 1 ? "s" : ""}`);
  if (mos) parts.push(`${mos} mo${mos > 1 ? "s" : ""}`);
  return parts.join(" ") || "1 mo";
}
