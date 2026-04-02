import { getRng } from "../utils/random";

const randomByte = (rng: () => number): number => Math.floor(rng() * 256);

/**
 * RFC 4122 version-4 UUID (random), using `crypto.getRandomValues` when available.
 *
 * @returns A lowercase UUID string.
 */
export const uuid = (): string => {
  const bytes = new Uint8Array(16);
  if (typeof globalThis.crypto !== "undefined" && globalThis.crypto.getRandomValues) {
    globalThis.crypto.getRandomValues(bytes);
  } else {
    const rng = getRng();
    for (let i = 0; i < 16; i += 1) {
      bytes[i] = randomByte(rng);
    }
  }
  bytes[6] = (bytes[6]! & 0x0f) | 0x40;
  bytes[8] = (bytes[8]! & 0x3f) | 0x80;
  const h = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
};

const NANO_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-" as const;

/**
 * URL-safe random identifier (nanoid-style).
 *
 * @param size - Length in characters (default 21).
 * @returns A random string from the URL-safe alphabet.
 */
export const nanoid = (size = 21): string => {
  const rng = getRng();
  let out = "";
  for (let i = 0; i < size; i += 1) {
    out += NANO_ALPHABET[(rng() * NANO_ALPHABET.length) | 0]!;
  }
  return out;
};
