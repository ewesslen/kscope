import { describe, it, expect } from "vitest";
import { kmeans, RGB } from "../src/kmeans";

describe("kmeans", () => {
  it("returns empty for empty input", () => {
    const result = kmeans([], 3);
    expect(result.centroids).toHaveLength(0);
  });

  it("handles k >= n", () => {
    const pixels: RGB[] = [[255, 0, 0], [0, 255, 0]];
    const result = kmeans(pixels, 5);
    expect(result.centroids).toHaveLength(2);
  });

  it("clusters two distinct color groups", () => {
    const reds: RGB[] = Array.from({ length: 50 }, () => [
      200 + Math.floor(Math.random() * 55),
      Math.floor(Math.random() * 30),
      Math.floor(Math.random() * 30),
    ] as RGB);
    const blues: RGB[] = Array.from({ length: 50 }, () => [
      Math.floor(Math.random() * 30),
      Math.floor(Math.random() * 30),
      200 + Math.floor(Math.random() * 55),
    ] as RGB);

    const result = kmeans([...reds, ...blues], 2);
    expect(result.centroids).toHaveLength(2);

    // Each centroid should be clearly red or blue
    const sorted = result.centroids.sort((a, b) => b[0] - a[0]);
    expect(sorted[0][0]).toBeGreaterThan(150); // red centroid
    expect(sorted[1][2]).toBeGreaterThan(150); // blue centroid
  });

  it("returns correct count totals", () => {
    const pixels: RGB[] = Array.from({ length: 100 }, (_, i) =>
      i < 50 ? [255, 0, 0] as RGB : [0, 0, 255] as RGB
    );
    const result = kmeans(pixels, 2);
    const total = result.counts.reduce((a, b) => a + b, 0);
    expect(total).toBe(100);
  });
});
