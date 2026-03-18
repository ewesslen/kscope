/**
 * K-means clustering for RGB color vectors.
 */

export type RGB = [number, number, number];

interface ClusterResult {
  centroids: RGB[];
  assignments: number[];
  counts: number[];
}

function distance(a: RGB, b: RGB): number {
  const dr = a[0] - b[0];
  const dg = a[1] - b[1];
  const db = a[2] - b[2];
  return dr * dr + dg * dg + db * db;
}

/** Pick k initial centroids using k-means++ seeding. */
function initCentroids(pixels: RGB[], k: number): RGB[] {
  const centroids: RGB[] = [];
  const n = pixels.length;

  // First centroid: random
  centroids.push([...pixels[Math.floor(Math.random() * n)]]);

  for (let c = 1; c < k; c++) {
    const distances = new Float64Array(n);
    let totalDist = 0;
    for (let i = 0; i < n; i++) {
      let minDist = Infinity;
      for (const centroid of centroids) {
        minDist = Math.min(minDist, distance(pixels[i], centroid));
      }
      distances[i] = minDist;
      totalDist += minDist;
    }

    // Weighted random selection
    let threshold = Math.random() * totalDist;
    for (let i = 0; i < n; i++) {
      threshold -= distances[i];
      if (threshold <= 0) {
        centroids.push([...pixels[i]]);
        break;
      }
    }

    if (centroids.length <= c) {
      centroids.push([...pixels[Math.floor(Math.random() * n)]]);
    }
  }

  return centroids;
}

export function kmeans(
  pixels: RGB[],
  k: number,
  maxIterations = 20
): ClusterResult {
  const n = pixels.length;
  if (n === 0) return { centroids: [], assignments: [], counts: [] };
  if (k >= n) {
    return {
      centroids: pixels.map((p) => [...p] as RGB),
      assignments: pixels.map((_, i) => i),
      counts: pixels.map(() => 1),
    };
  }

  const centroids = initCentroids(pixels, k);
  const assignments = new Int32Array(n);

  for (let iter = 0; iter < maxIterations; iter++) {
    // Assignment step
    let changed = false;
    for (let i = 0; i < n; i++) {
      let bestCluster = 0;
      let bestDist = distance(pixels[i], centroids[0]);
      for (let c = 1; c < k; c++) {
        const d = distance(pixels[i], centroids[c]);
        if (d < bestDist) {
          bestDist = d;
          bestCluster = c;
        }
      }
      if (assignments[i] !== bestCluster) {
        assignments[i] = bestCluster;
        changed = true;
      }
    }

    if (!changed) break;

    // Update step
    const sums = Array.from({ length: k }, () => [0, 0, 0]);
    const counts = new Int32Array(k);

    for (let i = 0; i < n; i++) {
      const c = assignments[i];
      sums[c][0] += pixels[i][0];
      sums[c][1] += pixels[i][1];
      sums[c][2] += pixels[i][2];
      counts[c]++;
    }

    for (let c = 0; c < k; c++) {
      if (counts[c] > 0) {
        centroids[c][0] = Math.round(sums[c][0] / counts[c]);
        centroids[c][1] = Math.round(sums[c][1] / counts[c]);
        centroids[c][2] = Math.round(sums[c][2] / counts[c]);
      }
    }
  }

  // Final counts
  const counts = new Int32Array(k);
  for (let i = 0; i < n; i++) {
    counts[assignments[i]]++;
  }

  return {
    centroids,
    assignments: Array.from(assignments),
    counts: Array.from(counts),
  };
}
