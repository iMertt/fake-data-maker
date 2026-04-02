import { getRng } from "../utils/random";

const MS_PER_DAY = 86_400_000;

const toIsoDate = (d: Date): string => d.toISOString().slice(0, 10);

/**
 * Random ISO 8601 calendar date between 1990-01-01 and today (UTC).
 *
 * @returns A date string `YYYY-MM-DD`.
 */
export const pastDate = (): string => {
  const rng = getRng();
  const start = Date.UTC(1990, 0, 1);
  const end = Date.now();
  const t = start + Math.floor(rng() * (end - start + 1));
  return toIsoDate(new Date(t));
};

/**
 * Random ISO 8601 calendar date between tomorrow and 2035-12-31 (UTC).
 *
 * @returns A date string `YYYY-MM-DD`.
 */
export const futureDate = (): string => {
  const rng = getRng();
  const tomorrow = new Date();
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  tomorrow.setUTCHours(0, 0, 0, 0);
  const start = tomorrow.getTime();
  const end = Date.UTC(2035, 11, 31);
  const t = start + Math.floor(rng() * (end - start + 1));
  return toIsoDate(new Date(t));
};

/**
 * Random birth date yielding an age between 18 and 80 (inclusive), relative to today (UTC).
 *
 * @returns A date string `YYYY-MM-DD`.
 */
export const birthDate = (): string => {
  const rng = getRng();
  const today = new Date();
  const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  const minAge = 18;
  const maxAge = 80;
  const oldestBirth = todayUtc - maxAge * 365.25 * MS_PER_DAY;
  const youngestBirth = todayUtc - minAge * 365.25 * MS_PER_DAY;
  const t = oldestBirth + Math.floor(rng() * (youngestBirth - oldestBirth + MS_PER_DAY));
  return toIsoDate(new Date(t));
};
