import { describe, expect, it } from "vitest";
import { companyName, department, jobTitle } from "../src/company";

describe("company", () => {
  it("returns non-empty strings", () => {
    for (let i = 0; i < 30; i += 1) {
      expect(companyName().length).toBeGreaterThan(0);
      expect(department().length).toBeGreaterThan(0);
      expect(jobTitle().length).toBeGreaterThan(0);
    }
  });

  it("runs 30 iterations without throwing", () => {
    for (let i = 0; i < 30; i += 1) {
      companyName();
      department();
      jobTitle();
    }
  });

  it("department is from the fixed pool", () => {
    const pool = new Set([
      "Engineering",
      "Marketing",
      "Finance",
      "HR",
      "Sales",
      "Legal",
      "Design",
      "Operations",
      "Product",
      "Data",
    ]);
    for (let i = 0; i < 30; i += 1) {
      expect(pool.has(department())).toBe(true);
    }
  });
});
