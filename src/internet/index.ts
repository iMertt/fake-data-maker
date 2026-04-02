import { FIRST_NAMES, LAST_NAMES } from "../internal/names";
import { getRng, pickRandom, random } from "../utils/random";

const DOMAINS = ["example.com", "mail.com", "nanofake.dev", "test.org"] as const;

const TLDS = ["com", "net", "org", "io", "dev", "app", "co", "tech", "ai", "cloud"] as const;

const BASE_HOSTS = [
  "demo",
  "sample",
  "portal",
  "api",
  "cdn",
  "static",
  "www",
  "app",
  "hub",
  "labs",
] as const;

/** Small pool of realistic browser User-Agent strings (Chrome, Safari, Firefox, Edge, Android). */
const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
  "Mozilla/5.0 (Windows NT 10.0; Win64; rv:124.0) Gecko/20100101 Firefox/124.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; rv:123.0) Gecko/20100101 Firefox/123.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.2365.92",
  "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.6261.64 Mobile Safari/537.36",
] as const;

const PASSWORD_UPPER = "ABCDEFGHJKLMNPQRSTUVWXYZ";
const PASSWORD_LOWER = "abcdefghijkmnopqrstuvwxyz";
const PASSWORD_DIGIT = "23456789";
const PASSWORD_SYMBOL = "!@#$%^&*";

/**
 * Generates a random username.
 *
 * @returns A lowercase username string.
 */
export const username = (): string => {
  const first = pickRandom(FIRST_NAMES).toLowerCase();
  const last = pickRandom(LAST_NAMES).toLowerCase();
  const suffix = ((random() * 9000) | 0) + 1000;

  return `${first}.${last}${suffix}`.replace(/[^a-z0-9.]/g, "");
};

/**
 * Generates a random email address.
 *
 * @returns A plausible email string.
 */
export const email = (): string => `${username()}@${pickRandom(DOMAINS)}`;

/**
 * Random HTTPS URL with optional subdomain and TLD from a fixed pool.
 *
 * @returns A URL string.
 */
export const url = (): string => {
  const rng = getRng();
  const host = pickRandom(BASE_HOSTS);
  const tld = pickRandom(TLDS);
  const sub = rng() < 0.45 ? `${pickRandom(["api", "www", "cdn", "app", "static"] as const)}.` : "";
  return `https://${sub}${host}.${tld}`;
};

/**
 * Random plausible IPv4 (RFC-style; first octet 1–223).
 *
 * @returns An IPv4 string.
 */
export const ipv4 = (): string => {
  const rng = getRng();
  const a = 1 + ((rng() * 223) | 0);
  const b = (rng() * 256) | 0;
  const c = (rng() * 256) | 0;
  const d = (rng() * 256) | 0;
  return `${a}.${b}.${c}.${d}`;
};

/**
 * Random MAC address in uppercase hex pairs.
 *
 * @returns MAC string like `AA:BB:CC:DD:EE:FF`.
 */
export const macAddress = (): string => {
  const rng = getRng();
  const parts: string[] = [];
  for (let i = 0; i < 6; i += 1) {
    const v = (rng() * 256) | 0;
    parts.push(v.toString(16).toUpperCase().padStart(2, "0"));
  }
  return parts.join(":");
};

/**
 * Random realistic browser User-Agent string from a fixed pool.
 *
 * @returns A User-Agent header value.
 */
export const userAgent = (): string => pickRandom(USER_AGENTS);

/**
 * Random password with mixed character classes.
 *
 * @param length - Total length (default 12).
 * @returns A password string.
 */
export const password = (length = 12): string => {
  const rng = getRng();
  const len = Math.max(8, length | 0);
  const all = PASSWORD_UPPER + PASSWORD_LOWER + PASSWORD_DIGIT + PASSWORD_SYMBOL;
  const pick = (s: string) => s[(rng() * s.length) | 0]!;
  let out =
    pick(PASSWORD_UPPER) + pick(PASSWORD_LOWER) + pick(PASSWORD_DIGIT) + pick(PASSWORD_SYMBOL);
  for (let i = out.length; i < len; i += 1) {
    out += pick(all);
  }
  const arr = out.split("");
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = (rng() * (i + 1)) | 0;
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
  return arr.join("");
};
