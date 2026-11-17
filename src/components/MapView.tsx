import { useEffect, useMemo, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Job } from "../data/types";
import { jobStart } from "../lib/dates";
import { careerPath } from "../lib/geo";
import { clearFloorHighlight, installFloorHighlight, showFloorHighlight } from "../lib/floorHighlight";
import { logoUrl } from "./CompanyLogo";
import { groupByPlace, isLocated, type Located, type Place } from "../lib/places";
import { GlobeSpinner } from "./GlobeSpinner";

const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;
const PATH_LAYERS = ["career-glow", "career-line"];
const PATH_GRADIENT: mapboxgl.ExpressionSpecification = [
  "interpolate",
  ["linear"],
  ["line-progress"],
  0,
  "#64D2FF",
  0.5,
  "#5E5CE6",
  1,
  "#FF375F",
];

type Props = {
  jobs: Job[];
  visibleIds: Set<string>;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  dark: boolean;
  /** While true the globe spins behind the intro and the career path is hidden. */
  intro: boolean;
};

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isDesktop = () => window.innerWidth > 900;

export function MapView({ jobs, visibleIds, selectedId, onSelect, dark, intro }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<{ place: Place; marker: mapboxgl.Marker; el: HTMLElement }[]>([]);
  const frame = useRef<number | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Marker click handlers are created once per pin; read current props through a ref.
  const latest = useRef({ visibleIds, selectedId, onSelect });
  latest.current = { visibleIds, selectedId, onSelect };

  const located = useMemo(() => jobs.filter(isLocated), [jobs]);
  const places = useMemo(() => groupByPlace(located), [located]);

  function stopFrame() {
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = null;
  }

  function syncMarkers() {
    const { visibleIds, selectedId } = latest.current;
    for (const { place, el } of markers.current) {
      const shown = place.jobs.filter((j) => visibleIds.has(j.id));
      el.classList.toggle("marker--hidden", shown.length === 0);
      el.classList.toggle("marker--active", place.jobs.some((j) => j.id === selectedId));
      const badge = el.querySelector<HTMLElement>(".pin-badge");
      if (badge) {
        badge.textContent = String(shown.length);
        badge.hidden = shown.length < 2;
      }
    }
  }

  // Create the map once.
  useEffect(() => {
    if (!TOKEN || !container.current) return;
    mapboxgl.accessToken = TOKEN;
    let m: mapboxgl.Map;
    try {
      m = new mapboxgl.Map({
        container: container.current,
        style: "mapbox://styles/mapbox/standard",
        projection: "globe",
        center: [-70, 28],
        zoom: 1.6,
        attributionControl: false,
        config: {
          basemap: {
            lightPreset: dark ? "dusk" : "day",
            showPointOfInterestLabels: false,
            showTransitLabels: false,
          },
        },
      });
    } catch (err) {
      setError(`The map could not start: ${(err as Error).message}`);
      return;
    }
    m.on("error", (e) => {
      const status = (e.error as { status?: number } | undefined)?.status;
      if (status === 401) setError("Mapbox rejected the token (401). Check that VITE_MAPBOX_TOKEN is a valid public pk. token.");
      else if (status === 403) setError("Mapbox blocked this URL (403). Add this site's URL to the token's URL restrictions.");
      else console.error("Mapbox error", e.error);
    });
    m.addControl(new mapboxgl.AttributionControl({ compact: true }), "bottom-left");
    m.on("style.load", () => {
      installFloorHighlight(m);
      setReady(true);
    });
    m.on("click", (e) => {
      // Dev only: Option/Alt-click copies "lat, lng" for placing pins precisely.
      if (import.meta.env.DEV && e.originalEvent.altKey) {
        const text = `${e.lngLat.lat.toFixed(6)}, ${e.lngLat.lng.toFixed(6)}`;
        navigator.clipboard?.writeText(text).catch(() => {});
        new mapboxgl.Popup({ closeButton: false, className: "coords-popup" })
          .setLngLat(e.lngLat)
          .setHTML(`<strong>Copied</strong><br>${text}`)
          .addTo(m);
        console.info("Map coordinates (lat, lng):", text);
        return;
      }
      if (!(e.originalEvent.target as HTMLElement).closest(".marker")) latest.current.onSelect(null);
    });
    // Company labels only appear once pins are spread out enough not to collide.
    const onZoom = () => container.current?.classList.toggle("map--far", m.getZoom() < 7);
    m.on("zoom", onZoom);
    onZoom();
    map.current = m;

    return () => {
      stopFrame();
      markers.current.forEach(({ marker }) => marker.remove());
      markers.current = [];
      m.remove();
      map.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Light preset follows system theme.
  useEffect(() => {
    if (ready) map.current?.setConfigProperty("basemap", "lightPreset", dark ? "dusk" : "day");
  }, [dark, ready]);

  // One pin per building. Rebuilt when geocoded coordinates arrive.
  useEffect(() => {
    const m = map.current;
    if (!m) return;
    markers.current.forEach(({ marker }) => marker.remove());
    markers.current = places.map((place) => {
      const lead = place.jobs[0];
      // Mapbox owns the marker element's transform, so visuals live on children.
      const el = document.createElement("button");
      el.className = "marker";
      el.style.setProperty("--pin", lead.color);
      el.setAttribute("aria-label", `${place.jobs.map((j) => j.company).join(" and ")}, ${lead.location.city}`);
      // Show the monogram first and swap in the logo only once it loads, so a
      // missing logo file never shows a broken image.
      const pin = document.createElement("div");
      pin.className = "pin";
      const monogram = document.createElement("span");
      monogram.textContent = lead.monogram;
      pin.append(monogram);
      const logo = new Image();
      logo.alt = "";
      logo.onload = () => {
        pin.replaceChildren(logo);
        pin.classList.add("pin--logo");
      };
      logo.src = logoUrl(lead);
      const label = document.createElement("div");
      label.className = "pin-label";
      label.textContent = place.jobs.map((j) => j.company).join(" · ");
      el.append(pin, label);
      if (place.jobs.length > 1) {
        const badge = document.createElement("span");
        badge.className = "pin-badge";
        el.append(badge);
      }
      el.addEventListener("click", (ev) => {
        ev.stopPropagation();
        const target = place.jobs.find((j) => latest.current.visibleIds.has(j.id)) ?? lead;
        latest.current.onSelect(target.id);
      });
      const marker = new mapboxgl.Marker({ element: el, anchor: "bottom" }).setLngLat(place.lngLat).addTo(m);
      return { place, marker, el };
    });
    syncMarkers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [places]);

  useEffect(syncMarkers, [visibleIds, selectedId]);

  // Career path: a glowing great-circle line through every office in date order.
  useEffect(() => {
    const m = map.current;
    if (!m || !ready) return;
    const stops: [number, number][] = [];
    for (const j of [...located].sort((a, b) => jobStart(a) - jobStart(b))) {
      const p: [number, number] = [j.location.lng, j.location.lat];
      const last = stops[stops.length - 1];
      if (!last || Math.abs(last[0] - p[0]) > 1e-3 || Math.abs(last[1] - p[1]) > 1e-3) stops.push(p);
    }
    if (stops.length < 2) return;
    const data = {
      type: "Feature" as const,
      properties: {},
      geometry: { type: "LineString" as const, coordinates: careerPath(stops) },
    };
    const source = m.getSource("career") as mapboxgl.GeoJSONSource | undefined;
    if (source) {
      source.setData(data);
      return;
    }
    m.addSource("career", { type: "geojson", data, lineMetrics: true });
    const hidden: [number, number] = intro ? [0, 1] : [0, 0];
    m.addLayer({
      id: "career-glow",
      type: "line",
      source: "career",
      slot: "middle",
      layout: { "line-cap": "round", "line-join": "round" },
      paint: { "line-width": 12, "line-blur": 10, "line-opacity": 0.5, "line-gradient": PATH_GRADIENT, "line-trim-offset": hidden },
    });
    m.addLayer({
      id: "career-line",
      type: "line",
      source: "career",
      slot: "middle",
      layout: { "line-cap": "round", "line-join": "round" },
      paint: { "line-width": 2.5, "line-gradient": PATH_GRADIENT, "line-trim-offset": hidden },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [located, ready]);

  // Intro: spin the globe off to the side. After: draw the path in.
  useEffect(() => {
    const m = map.current;
    if (!m || !ready) return;
    stopFrame();
    if (intro) {
      // Desktop: the globe sits beside the text. Mobile: centered, revealed by
      // scrolling the text away. Either way the whole Earth fits on screen.
      const frameGlobe = (duration: number) => {
        m.setPadding(isDesktop() ? { left: introTextRight(), right: 0, top: 0, bottom: 0 } : { left: 0, right: 0, top: 0, bottom: 0 });
        const far = m.getZoom() > 2.5 || m.getPitch() > 0;
        // Coming back home from a building: pull out first, then fit.
        const zoom = far ? 1.6 : fitGlobeZoom(m);
        m.easeTo({ center: [m.getCenter().lng, 28], zoom, pitch: 0, bearing: 0, duration: reducedMotion() ? 0 : duration });
        if (far) m.once("moveend", () => m.easeTo({ zoom: fitGlobeZoom(m), duration: reducedMotion() ? 0 : 600 }));
      };
      frameGlobe(1800);
      let t = 0;
      const onResize = () => {
        clearTimeout(t);
        t = window.setTimeout(() => frameGlobe(400), 150);
      };
      window.addEventListener("resize", onResize);
      // GlobeSpinner drives the spin from here.
      return () => {
        clearTimeout(t);
        window.removeEventListener("resize", onResize);
      };
    }
    m.setPadding({ left: 0, right: 0, top: 0, bottom: 0 });
    const t0 = performance.now();
    const DURATION = reducedMotion() ? 1 : 3200;
    const draw = (t: number) => {
      const p = Math.min(1, (t - t0) / DURATION);
      const eased = 1 - Math.pow(1 - p, 3);
      for (const id of PATH_LAYERS) {
        if (m.getLayer(id)) m.setPaintProperty(id, "line-trim-offset", [Math.min(eased, 0.99999), 1]);
      }
      if (p < 1) frame.current = requestAnimationFrame(draw);
    };
    frame.current = requestAnimationFrame(draw);
    return stopFrame;
  }, [intro, ready]);

  // With nothing selected, frame the visible pins.
  useEffect(() => {
    const m = map.current;
    if (!m || !ready || intro || selectedId) return;
    const visible = located.filter((j) => visibleIds.has(j.id));
    if (visible.length === 0) return;
    const bounds = new mapboxgl.LngLatBounds();
    mainCluster(visible).forEach((j) => bounds.extend([j.location.lng, j.location.lat]));
    m.fitBounds(bounds, { padding: fitPadding(), maxZoom: 10, pitch: 0, bearing: 0, duration: 2600 });
  }, [visibleIds, selectedId, located, intro, ready]);

  // Fly into the building on selection, then slowly orbit it.
  useEffect(() => {
    const m = map.current;
    if (!m || !ready) return;
    const job = located.find((j) => j.id === selectedId);
    clearFloorHighlight(m);
    if (!job) return;
    stopFrame();
    m.flyTo({
      center: [job.location.lng, job.location.lat],
      zoom: 16.6,
      pitch: 62,
      bearing: -20,
      offset: isDesktop() ? [-236, -70] : [0, -window.innerHeight * 0.25],
      duration: 3600,
      curve: 1.5,
      essential: true,
    });
    const orbit = () => {
      if (reducedMotion()) return;
      const spin = () => {
        m.setBearing(m.getBearing() + 0.035);
        frame.current = requestAnimationFrame(spin);
      };
      frame.current = requestAnimationFrame(spin);
    };
    m.once("moveend", orbit);
    // Once the camera has landed and the building tiles are in, light up the floor.
    const { floor } = job.location;
    const highlight = () => {
      if (floor) showFloorHighlight(m, [job.location.lng, job.location.lat], floor, job.color);
    };
    const onLanded = () => m.once("idle", highlight);
    if (floor) m.once("moveend", onLanded);
    // Any user gesture stops the orbit.
    const interrupt = () => stopFrame();
    m.on("mousedown", interrupt);
    m.on("touchstart", interrupt);
    m.on("wheel", interrupt);
    return () => {
      stopFrame();
      m.off("moveend", orbit);
      m.off("moveend", onLanded);
      m.off("idle", highlight);
      m.off("mousedown", interrupt);
      m.off("touchstart", interrupt);
      m.off("wheel", interrupt);
    };
  }, [selectedId, located, ready]);

  if (!TOKEN) {
    return (
      <div className="map-missing">
        <div className="glass map-missing__card">
          <h2>Add a Mapbox token</h2>
          <p>
            Copy <code>.env.example</code> to <code>.env.local</code> and set <code>VITE_MAPBOX_TOKEN</code> to your
            public token, then restart the dev server.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div ref={container} className="map" />
      <GlobeSpinner map={ready ? map.current : null} active={intro && !error} />
      {error && (
        <div className="map-missing">
          <div className="glass map-missing__card">
            <h2>Map unavailable</h2>
            <p>{error}</p>
          </div>
        </div>
      )}
    </>
  );
}

/**
 * Fitting pins on opposite sides of the globe (the US plus India) centers the
 * camera on an ocean. Frame the hemisphere with the most pins instead; the
 * career path still leads the eye to the rest.
 */
function mainCluster(jobs: Located[]): Located[] {
  const americas = jobs.filter((j) => j.location.lng < -30);
  const rest = jobs.filter((j) => j.location.lng >= -30);
  if (!americas.length || !rest.length) return jobs;
  return americas.length >= rest.length ? americas : rest;
}

/**
 * The zoom at which the whole globe fits its share of the screen. At globe
 * zooms the on-screen radius doubles with each zoom level, so measure the
 * current radius and scale from there.
 */
function fitGlobeZoom(m: mapboxgl.Map): number {
  const c = m.getCenter();
  const a = m.project(c);
  const b = m.project([c.lng, Math.min(89, c.lat + 1)]);
  const r = (Math.hypot(a.x - b.x, a.y - b.y) * 180) / Math.PI;
  const w = window.innerWidth;
  const h = window.innerHeight;
  // Room for the glow, the hint under the globe, and the top bar.
  const target = isDesktop() ? Math.min((w - introTextRight()) * 0.44, (h - 120) * 0.42) : Math.min(w * 0.44, (h - 160) * 0.4);
  if (!(r > 0)) return m.getZoom();
  return Math.max(0.2, Math.min(2.4, m.getZoom() + Math.log2(target / r)));
}

function fitPadding() {
  return isDesktop()
    ? { top: 140, bottom: 240, left: 100, right: 100 }
    : { top: 120, bottom: 260, left: 40, right: 40 };
}

/** Where the home screen's text block ends, so the globe gets the space to its right. */
function introTextRight(): number {
  const el = document.querySelector(".intro__content");
  const right = el ? el.getBoundingClientRect().right : window.innerWidth * 0.42;
  return Math.min(window.innerWidth * 0.62, right + 24);
}
