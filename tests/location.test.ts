import { describe, expect, it } from "vitest";
import { city, country, streetAddress, zipCode } from "../src/location";

describe("location", () => {
  it("streetAddress city country are non-empty strings", () => {
    for (let i = 0; i < 30; i += 1) {
      expect(streetAddress().length).toBeGreaterThan(0);
      expect(city().length).toBeGreaterThan(0);
      expect(country().length).toBeGreaterThan(0);
    }
  });

  it("runs 30 iterations without throwing", () => {
    for (let i = 0; i < 30; i += 1) {
      streetAddress();
      city();
      country();
      zipCode();
    }
  });

  it("zipCode is five digits", () => {
    for (let i = 0; i < 30; i += 1) {
      expect(zipCode()).toMatch(/^\d{5}$/);
    }
  });
});
