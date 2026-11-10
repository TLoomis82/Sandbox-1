type LngLat = [number, number];

const RAD = Math.PI / 180;

function toVec([lng, lat]: LngLat): [number, number, number] {
  const λ = lng * RAD;
  const φ = lat * RAD;
  return [Math.cos(φ) * Math.cos(λ), Math.cos(φ) * Math.sin(λ), Math.sin(φ)];
}

/** Points along the great circle from a to b. */
function greatCircle(a: LngLat, b: LngLat): LngLat[] {
  const va = toVec(a);
  const vb = toVec(b);
  const dot = Math.min(1, Math.max(-1, va[0] * vb[0] + va[1] * vb[1] + va[2] * vb[2]));
  const d = Math.acos(dot);
  if (d < 1e-7) return [a];
  const steps = Math.max(8, Math.ceil(d / RAD / 1.5));
  const pts: LngLat[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const A = Math.sin((1 - t) * d) / Math.sin(d);
    const B = Math.sin(t * d) / Math.sin(d);
    const x = A * va[0] + B * vb[0];
    const y = A * va[1] + B * vb[1];
    const z = A * va[2] + B * vb[2];
    pts.push([Math.atan2(y, x) / RAD, Math.atan2(z, Math.hypot(x, y)) / RAD]);
  }
  return pts;
}

/** One continuous line through every stop, with longitudes unwrapped so it never jumps across the antimeridian. */
export function careerPath(stops: LngLat[]): LngLat[] {
  const out: LngLat[] = [];
  for (let i = 0; i < stops.length - 1; i++) {
    const seg = greatCircle(stops[i], stops[i + 1]);
    out.push(...(i === 0 ? seg : seg.slice(1)));
  }
  for (let i = 1; i < out.length; i++) {
    let lng = out[i][0];
    while (lng - out[i - 1][0] > 180) lng -= 360;
    while (lng - out[i - 1][0] < -180) lng += 360;
    out[i] = [lng, out[i][1]];
  }
  return out;
}
