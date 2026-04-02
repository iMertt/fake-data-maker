import { describe, expect, it } from "vitest";
import { FIRST_NAMES, LAST_NAMES } from "../src/internal/names";
import { age, bloodType, firstName, fullName, gender, lastName, prefix } from "../src/person";

const firstSet = new Set<string>(FIRST_NAMES);
const lastSet = new Set<string>(LAST_NAMES);

const BLOOD = new Set(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]);

describe("person", () => {
  it("firstName returns a non-empty string from the known pool", () => {
    const value = firstName();

    expect(typeof value).toBe("string");
    expect(value.length).toBeGreaterThan(0);
    expect(firstSet.has(value)).toBe(true);
  });

  it("lastName returns a non-empty string from the known pool", () => {
    const value = lastName();

    expect(typeof value).toBe("string");
    expect(value.length).toBeGreaterThan(0);
    expect(lastSet.has(value)).toBe(true);
  });

  it("bloodType returns a known ABO/Rh label", () => {
    for (let i = 0; i < 20; i += 1) {
      expect(BLOOD.has(bloodType())).toBe(true);
    }
  });

  it("fullName gender age prefix", () => {
    const genders = new Set(["Male", "Female", "Non-binary", "Prefer not to say"]);
    const prefs = new Set(["Mr.", "Mrs.", "Ms.", "Dr.", "Prof."]);
    for (let i = 0; i < 30; i += 1) {
      expect(fullName().includes(" ")).toBe(true);
      expect(genders.has(gender())).toBe(true);
      const a = age();
      expect(typeof a).toBe("number");
      expect(a).toBeGreaterThanOrEqual(18);
      expect(a).toBeLessThanOrEqual(80);
      expect(prefs.has(prefix())).toBe(true);
    }
  });
});
