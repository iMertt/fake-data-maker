import { describe, expect, it } from "vitest";
import { email, username } from "../src/internet";

describe("internet", () => {
  it("username returns a non-empty string", () => {
    const value = username();

    expect(typeof value).toBe("string");
    expect(value.length).toBeGreaterThan(0);
  });

  it("email returns a non-empty string", () => {
    const value = email();

    expect(typeof value).toBe("string");
    expect(value.length).toBeGreaterThan(0);
    expect(value.includes("@")).toBe(true);
  });
});
