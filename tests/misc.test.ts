import { describe, expect, it } from "vitest";
import {
  animal,
  domain,
  emoji,
  fileExtension,
  hashtag,
  language,
  mimeType,
  semver,
  timezone,
} from "../src/misc";
import { latitude, longitude } from "../src/utils/random";

const FOOD_EMOJIS = new Set(["🍕", "🍔", "🍣", "🍎", "🥑", "🍪", "🧀", "🍩"]);

const runMany = (name: string, fn: () => string): void => {
  it(`${name} runs 20x without throwing and returns non-empty string`, () => {
    for (let i = 0; i < 20; i += 1) {
      const s = fn();
      expect(typeof s).toBe("string");
      expect(s.length).toBeGreaterThan(0);
    }
  });
};

describe("misc", () => {
  runMany("animal", animal);
  runMany("emoji()", () => emoji());
  runMany("emoji(food)", () => emoji("food"));
  runMany("emoji(nature)", () => emoji("nature"));
  runMany("emoji(face)", () => emoji("face"));
  runMany("mimeType", mimeType);
  runMany("fileExtension()", () => fileExtension());
  runMany("fileExtension(image)", () => fileExtension("image"));
  runMany("fileExtension(document)", () => fileExtension("document"));
  runMany("fileExtension(video)", () => fileExtension("video"));
  runMany("language", language);
  runMany("timezone", timezone);
  runMany("semver", semver);
  runMany("domain", domain);
  runMany("hashtag", hashtag);

  it('emoji("food") uses only the food pool', () => {
    for (let i = 0; i < 40; i += 1) {
      expect(FOOD_EMOJIS.has(emoji("food"))).toBe(true);
    }
  });

  it("latitude is between -90 and 90", () => {
    for (let i = 0; i < 30; i += 1) {
      const lat = latitude();
      expect(lat).toBeGreaterThanOrEqual(-90);
      expect(lat).toBeLessThanOrEqual(90);
    }
  });

  it("longitude is between -180 and 180", () => {
    for (let i = 0; i < 30; i += 1) {
      const lon = longitude();
      expect(lon).toBeGreaterThanOrEqual(-180);
      expect(lon).toBeLessThanOrEqual(180);
    }
  });
});
