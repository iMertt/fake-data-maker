import { describe, expect, it } from "vitest";
import { firstName, lastName } from "../src/person";

describe("person", () => {
  it("firstName returns a non-empty string", () => {
    const value = firstName();

    expect(typeof value).toBe("string");
    expect(value.length).toBeGreaterThan(0);
  });

  it("lastName returns a non-empty string", () => {
    const value = lastName();

    expect(typeof value).toBe("string");
    expect(value.length).toBeGreaterThan(0);
  });
});
