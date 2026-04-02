import { afterEach, describe, expect, it, vi } from "vitest";
import { pickRandom, random, resetSeed, seed } from "../src/utils/random";

afterEach(() => {
  resetSeed();
});

describe("random", () => {
  it("pickRandom throws on empty array", () => {
    expect(() => pickRandom([])).toThrow("Cannot pick a random item from an empty array.");
  });

  it("seed(42) yields five identical pickRandom draws on replay", () => {
    const pool = ["a", "b", "c", "d", "e", "f"] as const;
    seed(42);
    const seq = Array.from({ length: 5 }, () => pickRandom(pool));
    resetSeed();
    seed(42);
    const seq2 = Array.from({ length: 5 }, () => pickRandom(pool));
    expect(seq2).toEqual(seq);
  });

  it("resetSeed restores Math.random-backed RNG", () => {
    seed(1);
    random();
    resetSeed();

    const spy = vi.spyOn(Math, "random").mockReturnValue(0.42);
    resetSeed();
    expect(random()).toBe(0.42);
    spy.mockRestore();
  });

  it("unseeded runs produce different random sequences", () => {
    resetSeed();
    const a = Array.from({ length: 50 }, () => random());
    resetSeed();
    const b = Array.from({ length: 50 }, () => random());
    expect(a.join(",")).not.toBe(b.join(","));
  });
});
