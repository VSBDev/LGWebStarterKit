/**
 * Logic for calculating camera view offsets in Liquid Galaxy.
 */
export function calculateOffset(screenId, width, bezelPixels = 0) {
  return (screenId - 1) * (width + bezelPixels);
}

/**
 * Normalizes a 3D velocity vector to a specific speed.
 */
export function normalizeVelocity(vx, vy, vz, targetSpeed) {
  const mag = Math.sqrt(vx * vx + vy * vy + vz * vz);
  if (mag === 0) return { vx: targetSpeed, vy: 0, vz: 0 };
  return {
    vx: (vx / mag) * targetSpeed,
    vy: (vy / mag) * targetSpeed,
    vz: (vz / mag) * targetSpeed
  };
}
