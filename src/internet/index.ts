import { FIRST_NAMES, LAST_NAMES } from "../internal/names";
import { pickRandom } from "../utils/random";

const DOMAINS = ["example.com", "mail.com", "nanofake.dev", "test.org"] as const;

/**
 * Generates a random username.
 *
 * @returns A lowercase username string.
 */
export const username = (): string => {
  const first = pickRandom(FIRST_NAMES).toLowerCase();
  const last = pickRandom(LAST_NAMES).toLowerCase();
  const suffix = ((Math.random() * 900) | 0) + 100;

  return `${first}.${last}${suffix}`.replace(/[^a-z0-9.]/g, "");
};

/**
 * Generates a random email address.
 *
 * @returns A plausible email string.
 */
export const email = (): string => `${username()}@${pickRandom(DOMAINS)}`;
