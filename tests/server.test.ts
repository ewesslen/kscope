import { describe, it, expect } from "vitest";
import request from "supertest";
import sharp from "sharp";
import { app } from "../src/server";

async function createTestImage(): Promise<Buffer> {
  return sharp({
    create: { width: 50, height: 50, channels: 3, background: { r: 255, g: 87, b: 51 } },
  })
    .png()
    .toBuffer();
}

describe("GET /health", () => {
  it("returns ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});

describe("POST /analyze", () => {
  it("returns brand colors for an uploaded image", async () => {
    const image = await createTestImage();
    const res = await request(app)
      .post("/analyze")
      .attach("image", image, "test.png");

    expect(res.status).toBe(200);
    expect(res.body.filename).toBe("test.png");
    expect(res.body.totalColors).toBeGreaterThanOrEqual(1);
    expect(res.body.colors[0]).toHaveProperty("hex");
    expect(res.body.colors[0]).toHaveProperty("rgb");
    expect(res.body.colors[0]).toHaveProperty("hsl");
    expect(res.body.colors[0]).toHaveProperty("name");
    expect(res.body.colors[0]).toHaveProperty("dominance");
  });

  it("returns 400 when no file is provided", async () => {
    const res = await request(app).post("/analyze");
    expect(res.status).toBe(400);
    expect(res.body.error).toContain("No image");
  });

  it("accepts custom maxColors", async () => {
    const image = await createTestImage();
    const res = await request(app)
      .post("/analyze")
      .attach("image", image, "test.png")
      .field("maxColors", "3");

    expect(res.status).toBe(200);
    expect(res.body.totalColors).toBeLessThanOrEqual(3);
  });
});
