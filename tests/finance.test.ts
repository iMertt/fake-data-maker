import { describe, expect, it } from "vitest";
import { creditCard } from "../src/finance";

/** Standard Luhn validation on full PAN (including check digit). */
const isValidLuhnPan = (pan: string): boolean => {
  if (!/^\d+$/.test(pan)) return false;
  let sum = 0;
  let shouldDouble = false;
  for (let i = pan.length - 1; i >= 0; i -= 1) {
    let digit = Number(pan[i]);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
};

describe("finance", () => {
  it("creditCard returns exactly 16 digits", () => {
    for (let i = 0; i < 50; i += 1) {
      expect(creditCard()).toMatch(/^\d{16}$/);
    }
  });

  it("creditCard passes Luhn check", () => {
    for (let i = 0; i < 100; i += 1) {
      expect(isValidLuhnPan(creditCard())).toBe(true);
    }
  });

  it("creditCard uses a plausible issuer prefix", () => {
    for (let i = 0; i < 50; i += 1) {
      const pan = creditCard();
      const ok =
        pan.startsWith("4") ||
        pan.startsWith("51") ||
        pan.startsWith("52") ||
        pan.startsWith("53") ||
        pan.startsWith("54") ||
        pan.startsWith("55");
      expect(ok).toBe(true);
    }
  });
});
