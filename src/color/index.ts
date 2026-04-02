import { getRng, pickRandom } from "../utils/random";

const HEX = "0123456789ABCDEF" as const;

const COLOR_NAMES = [
  "Red",
  "Blue",
  "Green",
  "Yellow",
  "Orange",
  "Purple",
  "Pink",
  "Brown",
  "Black",
  "White",
  "Gray",
  "Cyan",
  "Magenta",
  "Teal",
  "Navy",
  "Maroon",
  "Olive",
  "Lime",
  "Indigo",
  "Violet",
] as const;

/**
 * Random 6-digit hex color in uppercase.
 *
 * @returns A string like `#A1B2C3`.
 */
export const hexColor = (): string => {
  const rng = getRng();
  let s = "#";
  for (let i = 0; i < 6; i += 1) {
    s += HEX[(rng() * HEX.length) | 0]!;
  }
  return s;
};

/**
 * Random RGB color string.
 *
 * @returns A string like `rgb(12, 200, 45)`.
 */
export const rgbColor = (): string => {
  const rng = getRng();
  const r = (rng() * 256) | 0;
  const g = (rng() * 256) | 0;
  const b = (rng() * 256) | 0;
  return `rgb(${r}, ${g}, ${b})`;
};

/**
 * Random common color name.
 *
 * @returns A color name string.
 */
export const colorName = (): string => pickRandom(COLOR_NAMES);
