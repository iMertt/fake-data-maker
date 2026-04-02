import { FIRST_NAMES, LAST_NAMES } from "../internal/names";
import { pickRandom, random } from "../utils/random";

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

const GENDERS = ["Male", "Female", "Non-binary", "Prefer not to say"] as const;

const PREFIXES = ["Mr.", "Mrs.", "Ms.", "Dr.", "Prof."] as const;

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

/**
 * Full name combining {@link firstName} and {@link lastName}.
 *
 * @returns A full name string.
 */
export const fullName = (): string => `${firstName()} ${lastName()}`;

/**
 * Random gender label.
 *
 * @returns A gender string.
 */
export const gender = (): string => pickRandom(GENDERS);

/**
 * Random integer age between 18 and 80 (inclusive).
 *
 * @returns An age in years.
 */
export const age = (): number => 18 + ((random() * 63) | 0);

/**
 * Random name prefix / title.
 *
 * @returns A prefix string.
 */
export const prefix = (): string => pickRandom(PREFIXES);

/**
 * Random ABO/Rh blood type label.
 *
 * @returns A blood type string such as `O+` or `AB-`.
 */
export const bloodType = (): string => pickRandom(BLOOD_TYPES);
