import { describe, expect, it } from "vitest";
import { nanoid, uuid } from "../src/id";

describe("id", () => {
  it("uuid and nanoid are non-empty strings", () => {
    for (let i = 0; i < 30; i += 1) {
      expect(uuid().length).toBeGreaterThan(0);
      expect(nanoid().length).toBeGreaterThan(0);
      expect(nanoid(10).length).toBe(10);
    }
  });

  it("runs 30 iterations without throwing", () => {
    for (let i = 0; i < 30; i += 1) {
      uuid();
      nanoid();
    }
  });

  it("uuid matches v4-style pattern", () => {
    const re = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
    for (let i = 0; i < 30; i += 1) {
      expect(uuid()).toMatch(re);
    }
  });
});
