import { describe, expect, it } from "vitest";
import { paragraph, sentence, word, words } from "../src/lorem";

describe("lorem", () => {
  it("returns non-empty strings", () => {
    for (let i = 0; i < 30; i += 1) {
      expect(word().length).toBeGreaterThan(0);
      expect(sentence().length).toBeGreaterThan(0);
      expect(paragraph().length).toBeGreaterThan(0);
      expect(words(5).length).toBeGreaterThan(0);
    }
  });

  it("runs 30 iterations without throwing", () => {
    for (let i = 0; i < 30; i += 1) {
      word();
      sentence(3);
      paragraph(2);
      words(4);
    }
  });

  it("sentence ends with a period and words() joins tokens", () => {
    for (let i = 0; i < 30; i += 1) {
      expect(sentence()).toMatch(/\.$/);
      expect(words(3).split(" ").length).toBe(3);
    }
  });
});
