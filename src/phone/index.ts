import { getRng, pickRandom } from "../utils/random";

const digit = (rng: () => number, min = 0, max = 9): number =>
  min + ((rng() * (max - min + 1)) | 0);

/**
 * Generates a plausible international phone number (TR / US / UK formats).
 *
 * @returns A formatted phone number string.
 */
export const phoneNumber = (): string => {
  const rng = getRng();
  const fmt = pickRandom(["tr", "us", "uk"] as const);

  if (fmt === "tr") {
    const d = () => digit(rng);
    return `+90 5${d()}${d()} ${d()}${d()}${d()} ${d()}${d()} ${d()}${d()}`;
  }

  if (fmt === "us") {
    const areaFirst = digit(rng, 1, 9);
    const areaRest = `${digit(rng)}${digit(rng)}`;
    const ex = `${digit(rng)}${digit(rng)}${digit(rng)}`;
    const last = `${digit(rng)}${digit(rng)}${digit(rng)}${digit(rng)}`;
    return `+1 (${areaFirst}${areaRest}) ${ex}-${last}`;
  }

  const d = () => digit(rng);
  return `+44 7${d()}${d()}${d()} ${d()}${d()}${d()}${d()}${d()}${d()}`;
};
