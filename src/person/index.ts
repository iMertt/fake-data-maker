import { pickRandom } from "../utils/random";

const FIRST_NAMES = [
  "Ahmet",
  "Mehmet",
  "Ayse",
  "Fatma",
  "Can",
  "Elif",
  "John",
  "Emma",
  "Noah",
  "Sophia"
] as const;

const LAST_NAMES = [
  "Yilmaz",
  "Kaya",
  "Demir",
  "Sahin",
  "Cetin",
  "Aydin",
  "Smith",
  "Johnson",
  "Brown",
  "Davis"
] as const;

/**
 * Generates a random first name.
 *
 * @returns A random first name string.
 */
export const firstName = (): string => pickRandom(FIRST_NAMES);

/**
 * Generates a random last name.
 *
 * @returns A random last name string.
 */
export const lastName = (): string => pickRandom(LAST_NAMES);
