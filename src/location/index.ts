import { getRng, pickRandom } from "../utils/random";

const STREETS = [
  "742 Evergreen Terrace",
  "221B Baker Street",
  "1600 Pennsylvania Avenue",
  "350 Fifth Avenue",
  "10 Downing Street",
  "1313 Mockingbird Lane",
  "124 Conch Street",
  "1640 Riverside Drive",
  "633 Stag Trail Road",
  "7 Savile Row",
] as const;

const CITIES = [
  "Istanbul",
  "Ankara",
  "Izmir",
  "London",
  "Paris",
  "Berlin",
  "Tokyo",
  "New York",
  "Sydney",
  "Toronto",
  "Madrid",
  "Rome",
  "Amsterdam",
  "Dubai",
  "Singapore",
  "Seoul",
  "Mumbai",
  "São Paulo",
  "Mexico City",
  "Cairo",
] as const;

const COUNTRIES = [
  "Turkey",
  "United States",
  "United Kingdom",
  "Germany",
  "France",
  "Japan",
  "Canada",
  "Australia",
  "Brazil",
  "India",
  "Italy",
  "Spain",
  "Netherlands",
  "South Korea",
  "Mexico",
  "Argentina",
  "Sweden",
  "Norway",
  "Switzerland",
  "Poland",
] as const;

/**
 * Generates a plausible street address line.
 *
 * @returns A street address string.
 */
export const streetAddress = (): string => pickRandom(STREETS);

/**
 * Generates a random city name.
 *
 * @returns A city name string.
 */
export const city = (): string => pickRandom(CITIES);

/**
 * Generates a random country name.
 *
 * @returns A country name string.
 */
export const country = (): string => pickRandom(COUNTRIES);

/**
 * Generates a 5-digit numeric zip/postal code string.
 *
 * @returns A five-digit string.
 */
export const zipCode = (): string => {
  const rng = getRng();
  let s = "";
  for (let i = 0; i < 5; i += 1) {
    s += String((rng() * 10) | 0);
  }
  return s;
};
