import { describe, expect, it } from "vitest";
import { phoneNumber } from "../src/phone";

describe("phone", () => {
  it("returns non-empty string", () => {
    for (let i = 0; i < 30; i += 1) {
      const v = phoneNumber();
      expect(typeof v).toBe("string");
      expect(v.length).toBeGreaterThan(0);
    }
  });

  it("runs 30 iterations without throwing", () => {
    for (let i = 0; i < 30; i += 1) {
      phoneNumber();
    }
  });

  it("matches one of the supported international prefixes", () => {
    const re = /^\+90 |^\+1 |^\+44 /;
    for (let i = 0; i < 30; i += 1) {
      expect(phoneNumber()).toMatch(re);
    }
  });
});
