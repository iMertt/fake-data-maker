import { describe, expect, it } from "vitest";
import { birthDate, futureDate, pastDate } from "../src/date";

const isoDate = /^\d{4}-\d{2}-\d{2}$/;

describe("date", () => {
  it("returns ISO date strings", () => {
    for (let i = 0; i < 30; i += 1) {
      expect(pastDate()).toMatch(isoDate);
      expect(futureDate()).toMatch(isoDate);
      expect(birthDate()).toMatch(isoDate);
    }
  });

  it("runs 30 iterations without throwing", () => {
    for (let i = 0; i < 30; i += 1) {
      pastDate();
      futureDate();
      birthDate();
    }
  });

  it("pastDate is on or after 1990-01-01", () => {
    const min = Date.UTC(1990, 0, 1);
    for (let i = 0; i < 30; i += 1) {
      const t = Date.parse(pastDate() + "T00:00:00.000Z");
      expect(t).toBeGreaterThanOrEqual(min);
      expect(t).toBeLessThanOrEqual(Date.now());
    }
  });
});
