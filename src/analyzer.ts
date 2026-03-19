import sharp from "sharp";
import { kmeans, RGB } from "./kmeans";
import { BrandColor, buildBrandColor } from "./color-utils";

export interface AnalyzeOptions {
  /** Number of brand colors to extract (default: 5) */
  maxColors?: number;
  /** Downsample long edge to this size for performance (default: 400) */
  resizeTo?: number;
}

/**
 * Analyze an image buffer and extract dominant brand colors.
 */
export async function analyzeImage(
  imageBuffer: Buffer,
  options: AnalyzeOptions = {}
): Promise<BrandColor[]> {
  const { maxColors = 5, resizeTo = 400 } = options;

  // Downscale for performance, using nearest-neighbor to preserve
  // sharp color boundaries instead of blending them away
  const { data, info } = await sharp(imageBuffer)
    .resize(resizeTo, resizeTo, { fit: "inside", kernel: "nearest" })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixelCount = info.width * info.height;
  const pixels: RGB[] = new Array(pixelCount);

  for (let i = 0; i < pixelCount; i++) {
    const offset = i * 3;
    pixels[i] = [data[offset], data[offset + 1], data[offset + 2]];
  }

  const { centroids, counts } = kmeans(pixels, maxColors);

  // Build brand colors sorted by dominance (descending)
  const colors: BrandColor[] = centroids
    .map((centroid, i) => buildBrandColor(centroid, counts[i] / pixelCount))
    .sort((a, b) => b.dominance - a.dominance);

  return colors;
}
