import type { Job } from "../data/types";
import { jobSpan } from "./dates";

export type Filters = {
  /** Empty set means "all companies". */
  companies: Set<string>;
  years: [number, number];
};

export function yearBounds(jobs: Job[]): [number, number] {
  const spans = jobs.map(jobSpan);
  return [Math.min(...spans.map((s) => s[0])), Math.max(...spans.map((s) => s[1]))];
}

export function applyFilters(jobs: Job[], f: Filters): Job[] {
  return jobs.filter((job) => {
    if (f.companies.size && !f.companies.has(job.id)) return false;
    const [s, e] = jobSpan(job);
    return s <= f.years[1] && e >= f.years[0];
  });
}
