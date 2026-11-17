import type { GeoJSONSource, Map as MapboxMap } from "mapbox-gl";

// Highlights one floor of the 3D building at a location: finds the building's
// footprint and height in Mapbox Streets data, then extrudes a glowing band
// between that floor's base and top, pushed just outside the walls so it
// wraps the facade instead of flickering against it. The top floor is drawn
// as a solid block that also covers the roof.

const STREETS = "floor-streets";
const PROBE = "floor-probe";
const SOURCE = "floor-highlight";
const LAYER = "floor-highlight";
/** Typical commercial floor-to-floor height. */
const FLOOR_M = 4;
/** How far to look for a building when the address point falls outside one. */
const SEARCH_M = 60;
/** Gap between the highlight and the walls, so it never flickers against them. */
const OUTSET_M = 0.6;
/** How far the top-floor highlight rises above the roof to cap it cleanly. */
const ROOF_M = 0.4;

type Ring = [number, number][];
type Poly = Ring[];

const EMPTY = { type: "FeatureCollection" as const, features: [] };

/** Adds the sources and layers once the style has loaded. */
export function installFloorHighlight(m: MapboxMap) {
  if (m.getSource(SOURCE)) return;
  // Mapbox Streets has building footprints with heights. An invisible layer
  // makes the map load those tiles so we can read them.
  m.addSource(STREETS, { type: "vector", url: "mapbox://mapbox.mapbox-streets-v8" });
  m.addLayer({
    id: PROBE,
    type: "fill",
    source: STREETS,
    "source-layer": "building",
    minzoom: 14,
    paint: { "fill-opacity": 0 },
  });
  m.addSource(SOURCE, { type: "geojson", data: EMPTY });
  m.addLayer({
    id: LAYER,
    type: "fill-extrusion",
    source: SOURCE,
    slot: "top",
    paint: {
      "fill-extrusion-color": ["get", "color"],
      "fill-extrusion-base": ["get", "base"],
      "fill-extrusion-height": ["get", "top"],
      "fill-extrusion-opacity": 0.82,
      // Glows instead of taking the scene's shading, so it reads at dusk too.
      "fill-extrusion-emissive-strength": 1,
    },
  });
}

export function clearFloorHighlight(m: MapboxMap) {
  (m.getSource(SOURCE) as GeoJSONSource | undefined)?.setData(EMPTY);
}

/** Draws the band. Returns false when no building footprint was found nearby. */
export function showFloorHighlight(m: MapboxMap, lngLat: [number, number], floor: number, color: string): boolean {
  const source = m.getSource(SOURCE) as GeoJSONSource | undefined;
  if (!source) return false;

  // Mapbox's feature type doesn't expose GeoJSON geometry, so describe what we read.
  type Building = {
    geometry: { type: string; coordinates: unknown };
    properties?: { height?: number | string } | null;
  };
  const buildings = m.querySourceFeatures(STREETS, { sourceLayer: "building" }) as unknown as Building[];
  let best: { poly: Poly; height: number; dist: number } | null = null;
  for (const f of buildings) {
    const g = f.geometry;
    const polys: Poly[] =
      g.type === "Polygon" ? [g.coordinates as Poly] : g.type === "MultiPolygon" ? (g.coordinates as Poly[]) : [];
    const height = Number(f.properties?.height) || 0;
    for (const poly of polys) {
      const dist = contains(poly[0], lngLat) ? 0 : metres(lngLat, centroid(poly[0]));
      if (dist <= SEARCH_M && (!best || dist < best.dist || (dist === best.dist && height > best.height))) {
        best = { poly, height, dist };
      }
    }
  }
  if (!best) {
    clearFloorHighlight(m);
    return false;
  }

  // Spread the building's real height across its floors when we know it.
  const height = best.height || floor * FLOOR_M;
  const floors = Math.max(floor, Math.round(height / FLOOR_M));
  const floorM = height / floors;
  const isTop = floor >= floors;
  // The top floor is drawn as a solid block that also caps the roof; any
  // other floor is a band. Either way it sits just outside the walls.
  const base = (floor - 1) * floorM;
  const top = isTop ? height + ROOF_M : floor * floorM;
  source.setData({
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { color, base, top },
        geometry: { type: "Polygon", coordinates: best.poly.map((ring) => outset(ring, OUTSET_M)) },
      },
    ],
  });
  return true;
}

function contains(ring: Ring, [x, y]: [number, number]): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function centroid(ring: Ring): [number, number] {
  let x = 0;
  let y = 0;
  for (const [px, py] of ring) {
    x += px;
    y += py;
  }
  return [x / ring.length, y / ring.length];
}

/**
 * Pushes every wall of a ring outward by `d` metres. Unlike scaling around the
 * centre, this keeps an even gap on L-shaped and other concave footprints,
 * where scaling would pull the inner corners into the building.
 */
function outset(ring: Ring, d: number): Ring {
  const closed = ring.length > 1 && ring[0][0] === ring[ring.length - 1][0] && ring[0][1] === ring[ring.length - 1][1];
  const pts = closed ? ring.slice(0, -1) : ring;
  const n = pts.length;
  if (n < 3) return ring;

  // Work in local metres around the centroid.
  const [cx, cy] = centroid(pts);
  const kx = (Math.PI / 180) * 6371000 * Math.cos((cy * Math.PI) / 180);
  const ky = (Math.PI / 180) * 6371000;
  const local = pts.map(([x, y]) => [(x - cx) * kx, (y - cy) * ky]);

  // Outward is to the right of each edge for counter-clockwise rings.
  let area = 0;
  for (let i = 0; i < n; i++) {
    const [x1, y1] = local[i];
    const [x2, y2] = local[(i + 1) % n];
    area += x1 * y2 - x2 * y1;
  }
  const side = area > 0 ? 1 : -1;

  const normal = (a: number[], b: number[]) => {
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const len = Math.hypot(dx, dy) || 1;
    return [(side * dy) / len, (-side * dx) / len];
  };

  const out: Ring = [];
  for (let i = 0; i < n; i++) {
    const prev = local[(i - 1 + n) % n];
    const cur = local[i];
    const next = local[(i + 1) % n];
    const n1 = normal(prev, cur);
    const n2 = normal(cur, next);
    // Miter: move along the bisector far enough that both walls end up `d` out,
    // capped so sharp corners don't spike.
    let mx = n1[0] + n2[0];
    let my = n1[1] + n2[1];
    const mlen = Math.hypot(mx, my) || 1;
    mx /= mlen;
    my /= mlen;
    const cos = mx * n1[0] + my * n1[1];
    const reach = Math.min(d / Math.max(cos, 0.25), d * 3);
    out.push([cx + (cur[0] + mx * reach) / kx, cy + (cur[1] + my * reach) / ky]);
  }
  out.push(out[0]);
  return out;
}

function metres([lng1, lat1]: [number, number], [lng2, lat2]: [number, number]): number {
  const k = Math.PI / 180;
  const dx = (lng2 - lng1) * k * Math.cos(((lat1 + lat2) / 2) * k);
  const dy = (lat2 - lat1) * k;
  return Math.hypot(dx, dy) * 6371000;
}
