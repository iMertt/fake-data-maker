import { pickRandom } from "../utils/random";

/** Visa + Mastercard IIN ranges (plausible test numbers only; not real cards). */
const ISSUER_PREFIXES = ["4", "51", "52", "53", "54", "55"] as const;

/**
 * Computes the Luhn check digit for the first 15 digits of a PAN.
 * Iterates from right to left over `digits`; the rightmost body digit is doubled first,
 * matching the usual card numbering weighting for a 16-digit PAN.
 */
const calculateLuhnCheckDigit = (digits: string): string => {
  let sum = 0;
  let shouldDouble = true;

  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let digit = Number(digits[i]);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return String((10 - (sum % 10)) % 10);
};

/**
 * Generates a plausible 16-digit credit card number.
 *
 * @returns A 16-digit credit card number string.
 */
export const creditCard = (): string => {
  const prefix = pickRandom(ISSUER_PREFIXES);
  let body = prefix;

  while (body.length < 15) {
    body += ((Math.random() * 10) | 0).toString();
  }

  return `${body}${calculateLuhnCheckDigit(body)}`;
};
