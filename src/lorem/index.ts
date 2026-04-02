import { getRng, pickRandom } from "../utils/random";

const LOREM_WORDS = [
  "lorem",
  "ipsum",
  "dolor",
  "sit",
  "amet",
  "consectetur",
  "adipiscing",
  "elit",
  "sed",
  "do",
  "eiusmod",
  "tempor",
  "incididunt",
  "ut",
  "labore",
  "et",
  "dolore",
  "magna",
  "aliqua",
  "enim",
  "minim",
  "veniam",
  "quis",
  "nostrud",
  "exercitation",
  "ullamco",
  "laboris",
  "nisi",
  "aliquip",
  "ex",
  "ea",
  "commodo",
  "consequat",
  "duis",
  "aute",
  "irure",
  "in",
  "reprehenderit",
  "voluptate",
] as const;

const capitalize = (s: string): string => (s.length === 0 ? s : s[0]!.toUpperCase() + s.slice(1));

/**
 * Random lorem-style word.
 *
 * @returns A single word.
 */
export const word = (): string => pickRandom(LOREM_WORDS);

/**
 * Random sentence built from lorem words.
 *
 * @param wordCount - Words in the sentence (default 8).
 * @returns Sentence with capitalized first word and trailing period.
 */
export const sentence = (wordCount = 8): string => {
  const rng = getRng();
  const n = Math.max(1, wordCount | 0);
  const parts: string[] = [];
  for (let i = 0; i < n; i += 1) {
    parts.push(LOREM_WORDS[(rng() * LOREM_WORDS.length) | 0]!);
  }
  const text = capitalize(parts.join(" "));
  return `${text}.`;
};

/**
 * Random paragraph of lorem sentences.
 *
 * @param sentenceCount - Number of sentences (default 4).
 * @returns Paragraph text.
 */
export const paragraph = (sentenceCount = 4): string => {
  const rng = getRng();
  const n = Math.max(1, sentenceCount | 0);
  const sentences: string[] = [];
  for (let i = 0; i < n; i += 1) {
    const wc = 4 + ((rng() * 8) | 0);
    sentences.push(sentence(wc));
  }
  return sentences.join(" ");
};

/**
 * N random lorem words joined by spaces.
 *
 * @param n - Number of words.
 * @returns Space-separated words.
 */
export const words = (n: number): string => {
  const rng = getRng();
  const count = Math.max(0, n | 0);
  const parts: string[] = [];
  for (let i = 0; i < count; i += 1) {
    parts.push(LOREM_WORDS[(rng() * LOREM_WORDS.length) | 0]!);
  }
  return parts.join(" ");
};
