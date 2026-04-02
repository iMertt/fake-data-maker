import { describe, expect, it } from "vitest";
import { colorName, hexColor, rgbColor } from "../src/color";

describe("color", () => {
  it("returns non-empty strings", () => {
    for (let i = 0; i < 30; i += 1) {
      expect(hexColor().length).toBeGreaterThan(0);
      expect(rgbColor().length).toBeGreaterThan(0);
      expect(colorName().length).toBeGreaterThan(0);
    }
  });

  it("runs 30 iterations without throwing", () => {
    for (let i = 0; i < 30; i += 1) {
      hexColor();
      rgbColor();
      colorName();
    }
  });

  it("hexColor is uppercase #RRGGBB", () => {
    for (let i = 0; i < 30; i += 1) {
      expect(hexColor()).toMatch(/^#[0-9A-F]{6}$/);
    }
  });
});
