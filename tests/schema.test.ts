import { afterEach, describe, expect, it } from "vitest";
import { age, firstName } from "../src/person";
import {
  array,
  fromList,
  nullable,
  regex,
  schema,
  sequence,
  weighted,
} from "../src/schema";

afterEach(() => {
  // tests use default Math.random unless seeded elsewhere
});

describe("schema", () => {
  it("schema returns count records with generated keys", () => {
    const rows = schema(
      {
        name: firstName,
        age: () => String(age()),
      },
      { count: 5 },
    );
    expect(rows).toHaveLength(5);
    for (const row of rows) {
      expect(typeof row.name).toBe("string");
      expect(row.name!.length).toBeGreaterThan(0);
      expect(typeof row.age).toBe("string");
    }
  });

  it("nullable(firstName, 1) always returns null", () => {
    const gen = nullable(firstName, 1);
    for (let i = 0; i < 20; i += 1) {
      expect(gen()).toBeNull();
    }
  });

  it("nullable(firstName, 0) never returns null", () => {
    const gen = nullable(firstName, 0);
    for (let i = 0; i < 20; i += 1) {
      expect(gen()).not.toBeNull();
    }
  });

  it('weighted({ a: 100, b: 0 }) always returns "a"', () => {
    const pick = weighted({ a: 100, b: 0 });
    for (let i = 0; i < 30; i += 1) {
      expect(pick()).toBe("a");
    }
  });

  it("sequence(10, 5) yields 10, 15, 20", () => {
    const next = sequence(10, 5);
    expect(next()).toBe(10);
    expect(next()).toBe(15);
    expect(next()).toBe(20);
  });

  it("fromList only returns values from the list", () => {
    const pick = fromList(["x", "y", "z"]);
    for (let i = 0; i < 40; i += 1) {
      expect(["x", "y", "z"]).toContain(pick());
    }
  });

  it("array(firstName, 3)() returns length 3", () => {
    const gen = array(firstName, 3);
    const out = gen();
    expect(out).toHaveLength(3);
    expect(out.every((s) => typeof s === "string" && s.length > 0)).toBe(true);
  });

  it('regex("\\\\d{4}") matches /^\\d{4}$/', () => {
    const gen = regex("\\d{4}");
    for (let i = 0; i < 20; i += 1) {
      const s = gen();
      expect(s).toMatch(/^\d{4}$/);
    }
  });

  it('regex("(foo|bar)") returns foo or bar', () => {
    const gen = regex("(foo|bar)");
    for (let i = 0; i < 30; i += 1) {
      const s = gen();
      expect(s === "foo" || s === "bar").toBe(true);
    }
  });
});
