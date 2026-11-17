import { useEffect, useMemo, useState } from "react";
import type { Job } from "../data/types";

const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;
const CACHE_KEY = "geocode-cache-v1";

type Coords = [number, number];

function readCache(): Record<string, Coords> {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function writeCache(cache: Record<string, Coords>) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Storage unavailable; we just geocode again next visit.
  }
}

async function geocode(address: string): Promise<Coords | null> {
  // Street-level first; if that finds nothing (common outside the US), retry
  // as a general place search, which still lands on the right neighbourhood.
  for (const types of ["&types=address", ""]) {
    const url =
      "https://api.mapbox.com/search/geocode/v6/forward" +
      `?q=${encodeURIComponent(address)}&limit=1${types}&access_token=${TOKEN}`;
    const res = await fetch(url);
    if (!res.ok) continue;
    const data = await res.json();
    const coords = data.features?.[0]?.geometry?.coordinates;
    if (coords) return coords;
  }
  return null;
}

/**
 * Places jobs that have a street address at its geocoded position. Any lng/lat
 * given alongside the address is a fallback, used until (or if) geocoding fails.
 */
export function useGeocodedJobs(jobs: Job[]): Job[] {
  const [cache, setCache] = useState<Record<string, Coords>>(readCache);

  useEffect(() => {
    if (!TOKEN) return;
    const missing = jobs
      .filter((j) => j.location.address && !cache[j.location.address])
      .map((j) => j.location.address!);
    const unique = [...new Set(missing)];
    if (!unique.length) return;

    let cancelled = false;
    Promise.all(unique.map(async (a) => [a, await geocode(a).catch(() => null)] as const)).then((results) => {
      if (cancelled) return;
      const next = { ...cache };
      for (const [address, coords] of results) {
        if (coords) next[address] = coords;
        else console.warn(`Could not geocode "${address}"`);
      }
      writeCache(next);
      setCache(next);
    });
    return () => {
      cancelled = true;
    };
  }, [jobs, cache]);

  // Memoized so the map doesn't refit on every render.
  return useMemo(
    () =>
      jobs.map((job) => {
        const { location } = job;
        const coords = location.address ? cache[location.address] : undefined;
        return coords ? { ...job, location: { ...location, lng: coords[0], lat: coords[1] } } : job;
      }),
    [jobs, cache],
  );
}
