import { FIRST_NAMES, LAST_NAMES } from "../internal/names";
import { pickRandom } from "../utils/random";

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
