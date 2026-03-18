import type { RGB } from "./kmeans";

export interface HSL {
  h: number;
  s: number;
  l: number;
}

export function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b].map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0")).join("")
  );
}

export function rgbToHsl(r: number, g: number, b: number): HSL {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) {
    return { h: 0, s: 0, l: Math.round(l * 100) };
  }

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

  let h: number;
  if (max === r) {
    h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  } else if (max === g) {
    h = ((b - r) / d + 2) / 6;
  } else {
    h = ((r - g) / d + 4) / 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/** CSS-style named colors mapped to approximate ranges. */
const COLOR_NAMES: Array<{ name: string; ranges: { h: [number, number]; s: [number, number]; l: [number, number] } }> = [
  { name: "black", ranges: { h: [0, 360], s: [0, 100], l: [0, 10] } },
  { name: "white", ranges: { h: [0, 360], s: [0, 100], l: [90, 100] } },
  { name: "gray", ranges: { h: [0, 360], s: [0, 10], l: [10, 90] } },
  { name: "red", ranges: { h: [0, 15], s: [30, 100], l: [10, 90] } },
  { name: "red", ranges: { h: [345, 360], s: [30, 100], l: [10, 90] } },
  { name: "orange", ranges: { h: [15, 40], s: [30, 100], l: [10, 90] } },
  { name: "yellow", ranges: { h: [40, 70], s: [30, 100], l: [10, 90] } },
  { name: "green", ranges: { h: [70, 165], s: [10, 100], l: [10, 90] } },
  { name: "cyan", ranges: { h: [165, 195], s: [10, 100], l: [10, 90] } },
  { name: "blue", ranges: { h: [195, 265], s: [10, 100], l: [10, 90] } },
  { name: "purple", ranges: { h: [265, 290], s: [10, 100], l: [10, 90] } },
  { name: "pink", ranges: { h: [290, 345], s: [10, 100], l: [10, 90] } },
];

export function getColorName(hsl: HSL): string {
  for (const entry of COLOR_NAMES) {
    const { h, s, l } = entry.ranges;
    if (
      hsl.h >= h[0] && hsl.h <= h[1] &&
      hsl.s >= s[0] && hsl.s <= s[1] &&
      hsl.l >= l[0] && hsl.l <= l[1]
    ) {
      // Refine with lightness qualifiers
      let prefix = "";
      if (hsl.l < 30 && entry.name !== "black") prefix = "dark ";
      else if (hsl.l > 70 && entry.name !== "white") prefix = "light ";
      return prefix + entry.name;
    }
  }
  return "unknown";
}

export interface BrandColor {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  name: string;
  dominance: number; // percentage 0-100
}

export function buildBrandColor(rgb: RGB, dominance: number): BrandColor {
  const [r, g, b] = rgb;
  const hsl = rgbToHsl(r, g, b);
  return {
    hex: rgbToHex(r, g, b),
    rgb: { r, g, b },
    hsl,
    name: getColorName(hsl),
    dominance: Math.round(dominance * 1000) / 10, // one decimal place
  };
}
