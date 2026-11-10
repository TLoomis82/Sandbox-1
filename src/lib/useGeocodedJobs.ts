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
  const url =
    "https://api.mapbox.com/search/geocode/v6/forward" +
    `?q=${encodeURIComponent(address)}&limit=1&types=address&access_token=${TOKEN}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  return data.features?.[0]?.geometry?.coordinates ?? null;
}

/** Fills in lng/lat for jobs that only have a street address. */
export function useGeocodedJobs(jobs: Job[]): Job[] {
  const [cache, setCache] = useState<Record<string, Coords>>(readCache);

  useEffect(() => {
    if (!TOKEN) return;
    const missing = jobs
      .filter((j) => j.location.lng == null && j.location.address && !cache[j.location.address])
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
        if (location.lng != null && location.lat != null) return job;
        const coords = location.address ? cache[location.address] : undefined;
        return coords ? { ...job, location: { ...location, lng: coords[0], lat: coords[1] } } : job;
      }),
    [jobs, cache],
  );
}
