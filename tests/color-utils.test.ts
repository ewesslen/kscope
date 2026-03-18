import { describe, it, expect } from "vitest";
import { rgbToHex, rgbToHsl, getColorName, buildBrandColor } from "../src/color-utils";

describe("rgbToHex", () => {
  it("converts black", () => {
    expect(rgbToHex(0, 0, 0)).toBe("#000000");
  });

  it("converts white", () => {
    expect(rgbToHex(255, 255, 255)).toBe("#ffffff");
  });

  it("converts a color", () => {
    expect(rgbToHex(255, 87, 51)).toBe("#ff5733");
  });

  it("clamps out-of-range values", () => {
    expect(rgbToHex(300, -10, 128)).toBe("#ff0080");
  });
});

describe("rgbToHsl", () => {
  it("converts pure red", () => {
    const hsl = rgbToHsl(255, 0, 0);
    expect(hsl.h).toBe(0);
    expect(hsl.s).toBe(100);
    expect(hsl.l).toBe(50);
  });

  it("converts pure green", () => {
    const hsl = rgbToHsl(0, 128, 0);
    expect(hsl.h).toBe(120);
    expect(hsl.s).toBe(100);
    expect(hsl.l).toBe(25);
  });

  it("converts gray", () => {
    const hsl = rgbToHsl(128, 128, 128);
    expect(hsl.h).toBe(0);
    expect(hsl.s).toBe(0);
    expect(hsl.l).toBe(50);
  });
});

describe("getColorName", () => {
  it("identifies red", () => {
    expect(getColorName({ h: 0, s: 100, l: 50 })).toBe("red");
  });

  it("identifies blue", () => {
    expect(getColorName({ h: 240, s: 100, l: 50 })).toBe("blue");
  });

  it("identifies black", () => {
    expect(getColorName({ h: 0, s: 0, l: 5 })).toBe("black");
  });

  it("identifies white", () => {
    expect(getColorName({ h: 0, s: 0, l: 95 })).toBe("white");
  });

  it("identifies dark green", () => {
    expect(getColorName({ h: 120, s: 80, l: 20 })).toBe("dark green");
  });
});

describe("buildBrandColor", () => {
  it("builds a complete color object", () => {
    const color = buildBrandColor([255, 0, 0], 0.5);
    expect(color.hex).toBe("#ff0000");
    expect(color.rgb).toEqual({ r: 255, g: 0, b: 0 });
    expect(color.hsl.h).toBe(0);
    expect(color.name).toBe("red");
    expect(color.dominance).toBe(50);
  });
});
