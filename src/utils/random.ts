let _rng: () => number = Math.random;
let _seed = 0;

/**
 * Seeds the internal PRNG (LCG) for repeatable random sequences.
 * Call {@link resetSeed} to restore `Math.random`-backed behavior.
 */
export function seed(s: number): void {
  _seed = s >>> 0;
  _rng = () => {
    _seed = (_seed * 1664525 + 1013904223) >>> 0;
    return _seed / 0x100000000;
  };
}

/** Restores the RNG to use `Math.random` (non-deterministic across runs). */
export function resetSeed(): void {
  _rng = Math.random;
}

/** Returns the current RNG function (LCG when seeded, otherwise `Math.random`). */
export function getRng(): () => number {
  return _rng;
}

/** Random float in [0, 1) using the current RNG (seeded LCG or `Math.random`). */
export function random(): number {
  return _rng();
}

/**
 * Returns a random item from a non-empty list.
 *
 * @typeParam T - Item type in the source array.
 * @param items - Source list of items.
 * @returns One randomly selected item.
 */
export const pickRandom = <T>(items: readonly T[]): T => {
  if (items.length === 0) {
    throw new Error("Cannot pick a random item from an empty array.");
  }

  const index = (_rng() * items.length) | 0;
  return items[index]!;
};

/**
 * Returns true with the given probability (default 0.5) using the current RNG.
 *
 * @param trueProbability - Probability of true in [0, 1]. Defaults to 0.5.
 * @returns A random boolean.
 */
export function boolean(trueProbability = 0.5): boolean {
  return _rng() < trueProbability;
}

/**
 * Returns a function that yields incrementing integers starting at 1 on each call.
 *
 * @returns A factory function; each invocation returns the next counter value.
 */
export function rowCounter(): () => number {
  let n = 0;
  return () => {
    n += 1;
    return n;
  };
}

/**
 * Random percentage-like number between min and max with a fixed decimal precision.
 *
 * @param min - Lower bound (default 0).
 * @param max - Upper bound (default 100).
 * @param decimals - Decimal places (default 2).
 * @returns A number in [min, max] rounded to `decimals` places.
 */
export function percentage(min = 0, max = 100, decimals = 2): number {
  const rng = _rng();
  const v = min + rng * (max - min);
  return Number(v.toFixed(decimals));
}

/**
 * Random latitude in [-90, 90] with six decimal places.
 *
 * @returns A latitude in degrees.
 */
export function latitude(): number {
  return Number((_rng() * 180 - 90).toFixed(6));
}

/**
 * Random longitude in [-180, 180] with six decimal places.
 *
 * @returns A longitude in degrees.
 */
export function longitude(): number {
  return Number((_rng() * 360 - 180).toFixed(6));
}
