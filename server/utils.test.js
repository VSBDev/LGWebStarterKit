import { describe, it, expect } from 'vitest';
import { calculateOffset, normalizeVelocity } from './utils.js';

describe('LG Utilities', () => {
  it('should calculate correct screen offsets', () => {
    expect(calculateOffset(1, 1080)).toBe(0);
    expect(calculateOffset(2, 1080)).toBe(1080);
    expect(calculateOffset(3, 1080)).toBe(2160);
  });

  it('should handle bezel compensation in offsets', () => {
    const bezel = 50;
    expect(calculateOffset(2, 1080, bezel)).toBe(1130);
  });

  it('should normalize 3D velocity vectors', () => {
    const { vx, vy, vz } = normalizeVelocity(10, 0, 0, 5);
    expect(vx).toBe(5);
    expect(vy).toBe(0);
    expect(vz).toBe(0);
  });

  it('should handle zero velocity normalization', () => {
    const { vx, vy, vz } = normalizeVelocity(0, 0, 0, 5);
    expect(vx).toBe(5);
    expect(vy).toBe(0);
    expect(vz).toBe(0);
  });
});
