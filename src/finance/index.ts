import { getRng, pickRandom, random } from "../utils/random";

/** Visa + Mastercard IIN ranges (plausible test numbers only; not real cards). */
const ISSUER_PREFIXES = ["4", "51", "52", "53", "54", "55"] as const;

const CURRENCIES = ["USD", "EUR", "TRY", "GBP", "JPY", "CHF", "CAD", "AUD"] as const;

const BTC_CHARS = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

/**
 * Computes the Luhn check digit for the first 15 digits of a PAN.
 * Uses a 16-digit string `body15 + "0"` and iterates right-to-left with `shouldDouble`
 * starting as `false` on the placeholder check digit, matching full-PAN validation.
 */
const calculateLuhnCheckDigit = (body15: string): string => {
  const pan = `${body15}0`;
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
    body += ((random() * 10) | 0).toString();
  }

  return `${body}${calculateLuhnCheckDigit(body)}`;
};

/**
 * Fake Turkish IBAN-style string (not validated against real banks).
 *
 * @returns A string starting with `TR` followed by 24 digits.
 */
export const iban = (): string => {
  const rng = getRng();
  let digits = "";
  for (let i = 0; i < 24; i += 1) {
    digits += String((rng() * 10) | 0);
  }
  return `TR${digits}`;
};

/**
 * Random monetary amount between 1.00 and 99999.99 with two decimal places.
 *
 * @returns A formatted decimal string.
 */
export const amount = (): string => {
  const rng = getRng();
  const v = 1 + rng() * (99_999.99 - 1);
  return v.toFixed(2);
};

/**
 * Random ISO 4217-style currency code from a small pool.
 *
 * @returns A three-letter currency code.
 */
export const currency = (): string => pickRandom(CURRENCIES);

/**
 * Fake Bitcoin-style address (not real; not valid on-chain).
 *
 * @returns A string starting with `1`, `3`, or `bc1q` plus random alphanumeric tail.
 */
export const bitcoinAddress = (): string => {
  const rng = getRng();
  const prefix = pickRandom(["1", "3", "bc1q"] as const);
  const tailLen = 25 + ((rng() * 9) | 0);
  let tail = "";
  for (let i = 0; i < tailLen; i += 1) {
    tail += BTC_CHARS[(rng() * BTC_CHARS.length) | 0]!;
  }
  return `${prefix}${tail}`;
};
