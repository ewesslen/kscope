import { describe, it, expect } from "vitest";
import sharp from "sharp";
import { analyzeImage } from "../src/analyzer";

async function createTestImage(
  color: { r: number; g: number; b: number },
  width = 100,
  height = 100
): Promise<Buffer> {
  return sharp({
    create: {
      width,
      height,
      channels: 3,
      background: color,
    },
  })
    .jpeg()
    .toBuffer();
}

describe("analyzeImage", () => {
  it("extracts a single dominant color from a solid image", async () => {
    const redImage = await createTestImage({ r: 255, g: 0, b: 0 });
    const colors = await analyzeImage(redImage, { maxColors: 3 });

    expect(colors.length).toBeGreaterThanOrEqual(1);
    // The most dominant color should be close to red
    const top = colors[0];
    expect(top.rgb.r).toBeGreaterThan(200);
    expect(top.rgb.g).toBeLessThan(50);
    expect(top.rgb.b).toBeLessThan(50);
    expect(top.name).toContain("red");
  });

  it("returns colors sorted by dominance", async () => {
    const image = await createTestImage({ r: 0, g: 0, b: 255 });
    const colors = await analyzeImage(image, { maxColors: 5 });

    for (let i = 1; i < colors.length; i++) {
      expect(colors[i - 1].dominance).toBeGreaterThanOrEqual(colors[i].dominance);
    }
  });

  it("dominance percentages sum close to 100", async () => {
    const image = await createTestImage({ r: 100, g: 200, b: 50 });
    const colors = await analyzeImage(image, { maxColors: 3 });

    const total = colors.reduce((sum, c) => sum + c.dominance, 0);
    expect(total).toBeGreaterThan(95);
    expect(total).toBeLessThanOrEqual(100.1);
  });
});
