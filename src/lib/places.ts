import type { Job } from "../data/types";

export type Located = Job & { location: { lng: number; lat: number } };

export const isLocated = (j: Job): j is Located => j.location.lng != null && j.location.lat != null;

/** Jobs within ~100 m of each other share a key and render as one pin. */
export const placeKey = (j: Located) => `${j.location.lng.toFixed(3)},${j.location.lat.toFixed(3)}`;

export type Place = { key: string; jobs: Located[]; lngLat: [number, number] };

/** Groups jobs by building, keeping data order (most recent first) within each group. */
export function groupByPlace(jobs: Located[]): Place[] {
  const places = new Map<string, Place>();
  for (const j of jobs) {
    const key = placeKey(j);
    const place = places.get(key) ?? { key, jobs: [], lngLat: [j.location.lng, j.location.lat] };
    place.jobs.push(j);
    places.set(key, place);
  }
  return [...places.values()];
}
