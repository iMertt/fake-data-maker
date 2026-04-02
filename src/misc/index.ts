import { word } from "../lorem";
import { getRng, pickRandom } from "../utils/random";

const ANIMALS = [
  "dog",
  "cat",
  "elephant",
  "tiger",
  "penguin",
  "dolphin",
  "eagle",
  "rabbit",
  "fox",
  "bear",
  "giraffe",
  "zebra",
  "kangaroo",
  "panda",
  "wolf",
  "owl",
  "flamingo",
  "octopus",
  "narwhal",
  "capybara",
  "axolotl",
  "lynx",
  "lemur",
  "tapir",
  "quokka",
  "sloth",
  "orca",
  "hedgehog",
  "mongoose",
  "ibex",
] as const;

const EMOJI_FOOD = ["🍕", "🍔", "🍣", "🍎", "🥑", "🍪", "🧀", "🍩"] as const;
const EMOJI_NATURE = ["🌲", "🌸", "🍂", "🌊", "⛰️", "🌙", "🌈", "🦋"] as const;
const EMOJI_FACE = ["😀", "😎", "🤔", "😴", "🥳", "😇", "🤖", "👻"] as const;
const EMOJI_ALL = [...EMOJI_FOOD, ...EMOJI_NATURE, ...EMOJI_FACE] as const;

const MIME_TYPES = [
  "application/json",
  "text/html",
  "text/plain",
  "image/png",
  "image/jpeg",
  "image/webp",
  "application/pdf",
  "application/xml",
  "text/css",
  "application/javascript",
  "font/woff2",
  "video/mp4",
  "audio/mpeg",
  "multipart/form-data",
  "application/octet-stream",
  "application/vnd.ms-excel",
  "text/csv",
  "application/zip",
  "image/svg+xml",
  "application/graphql",
] as const;

const EXT_IMAGE = ["png", "jpg", "webp", "gif", "svg", "ico"] as const;
const EXT_DOCUMENT = ["pdf", "docx", "txt", "md", "csv", "xlsx"] as const;
const EXT_VIDEO = ["mp4", "webm", "mov", "mkv"] as const;
const EXT_ALL = [...EXT_IMAGE, ...EXT_DOCUMENT, ...EXT_VIDEO] as const;

const LANGUAGES = [
  "English",
  "Turkish",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Russian",
  "Japanese",
  "Korean",
  "Mandarin",
  "Arabic",
  "Hindi",
  "Dutch",
  "Swedish",
  "Polish",
  "Ukrainian",
  "Greek",
  "Hebrew",
  "Vietnamese",
] as const;

const TIMEZONES = [
  "UTC",
  "Europe/Istanbul",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "America/New_York",
  "America/Los_Angeles",
  "America/Chicago",
  "America/Sao_Paulo",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Australia/Sydney",
  "Pacific/Auckland",
  "Africa/Johannesburg",
  "America/Toronto",
  "Europe/Madrid",
  "Europe/Rome",
  "America/Mexico_City",
  "Asia/Singapore",
  "Asia/Seoul",
  "Europe/Amsterdam",
  "America/Denver",
  "Africa/Cairo",
] as const;

const DOMAIN_TLDS = ["com", "net", "org", "io", "dev", "app", "co"] as const;

/**
 * Random animal name from a fixed pool.
 *
 * @returns A lowercase animal name.
 */
export const animal = (): string => pickRandom(ANIMALS);

/**
 * Random emoji, optionally limited to a thematic pool.
 *
 * @param category - Pool theme: food, nature, face, or all (default).
 * @returns A single emoji character.
 */
export const emoji = (category: "food" | "nature" | "face" | "all" = "all"): string => {
  if (category === "food") return pickRandom(EMOJI_FOOD);
  if (category === "nature") return pickRandom(EMOJI_NATURE);
  if (category === "face") return pickRandom(EMOJI_FACE);
  return pickRandom(EMOJI_ALL);
};

/**
 * Random common MIME type string.
 *
 * @returns A MIME type such as `application/json`.
 */
export const mimeType = (): string => pickRandom(MIME_TYPES);

/**
 * Random file extension, optionally scoped to a category.
 *
 * @param category - image, document, video, or all (default).
 * @returns A file extension without a leading dot.
 */
export const fileExtension = (category: "image" | "document" | "video" | "all" = "all"): string => {
  if (category === "image") return pickRandom(EXT_IMAGE);
  if (category === "document") return pickRandom(EXT_DOCUMENT);
  if (category === "video") return pickRandom(EXT_VIDEO);
  return pickRandom(EXT_ALL);
};

/**
 * Random human-readable language name.
 *
 * @returns A language label such as `English`.
 */
export const language = (): string => pickRandom(LANGUAGES);

/**
 * Random IANA-style timezone identifier.
 *
 * @returns A timezone string such as `Europe/Istanbul`.
 */
export const timezone = (): string => pickRandom(TIMEZONES);

/**
 * Random semantic version string `major.minor.patch` with bounded ranges.
 *
 * @returns A semver-like string.
 */
export const semver = (): string => {
  const rng = getRng();
  const major = 1 + ((rng() * 5) | 0);
  const minor = (rng() * 21) | 0;
  const patch = (rng() * 31) | 0;
  return `${major}.${minor}.${patch}`;
};

/**
 * Random domain-like host using a lorem word and a TLD suffix.
 *
 * @returns A domain string such as `lorem.io`.
 */
export const domain = (): string => `${word()}.${pickRandom(DOMAIN_TLDS)}`;

/**
 * Random hashtag built from a lorem word.
 *
 * @returns A string starting with `#`.
 */
export const hashtag = (): string => `#${word()}`;
