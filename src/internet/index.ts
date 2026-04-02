import { firstName, lastName } from "../person";
import { pickRandom } from "../utils/random";

const DOMAINS = ["example.com", "mail.com", "nanofake.dev", "test.org"] as const;

/**
 * Generates a random username.
 *
 * @returns A lowercase username string.
 */
export const username = (): string => {
  const first = firstName().toLowerCase();
  const last = lastName().toLowerCase();
  const suffix = ((Math.random() * 900) | 0) + 100;

  return `${first}.${last}${suffix}`.replace(/[^a-z0-9.]/g, "");
};

/**
 * Generates a random email address.
 *
 * @returns A plausible email string.
 */
export const email = (): string => `${username()}@${pickRandom(DOMAINS)}`;
