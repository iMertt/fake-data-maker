import { getRng, pickRandom } from "../utils/random";

/** Function that returns a generated value for one schema field. */
export type GeneratorFn = () => unknown;

/** Map of field names to generator functions. */
export type SchemaDefinition = Record<string, GeneratorFn>;

/** Options for {@link schema}. */
export interface GenerateOptions {
  /** Number of records to generate (default 1). */
  count?: number;
  /** Global probability [0, 1] that any given field is null (default 0). */
  nullable?: number;
}

/**
 * Generates an array of objects from a schema definition.
 *
 * @param definition - Field names mapped to generator functions.
 * @param options - Count and optional global null probability.
 * @returns An array of generated records.
 */
export const schema = <T extends SchemaDefinition>(
  definition: T,
  options: GenerateOptions = {},
): Array<{ [K in keyof T]: ReturnType<T[K]> | null }> => {
  const count = options.count ?? 1;
  const nullableProb = options.nullable ?? 0;
  const rng = getRng();
  const keys = Object.keys(definition) as (keyof T)[];
  const out: Array<{ [K in keyof T]: ReturnType<T[K]> | null }> = [];

  for (let i = 0; i < count; i += 1) {
    const row = {} as { [K in keyof T]: ReturnType<T[K]> | null };
    for (const key of keys) {
      const fn = definition[key]!;
      const value = fn() as ReturnType<T[typeof key]>;
      if (nullableProb > 0 && rng() < nullableProb) {
        row[key] = null;
      } else {
        row[key] = value;
      }
    }
    out.push(row);
  }

  return out;
};

/**
 * Wraps a generator so it sometimes returns null.
 *
 * @param fn - Source generator.
 * @param probability - Chance of null in [0, 1] (default 0.1).
 * @returns A generator that may yield null.
 */
export const nullable =
  <T>(fn: () => T, probability = 0.1): (() => T | null) =>
  () =>
    getRng()() < probability ? null : fn();

/**
 * Weighted random choice over string keys. Weights need not sum to 1; zero weights are skipped.
 *
 * @param map - Keys with non-negative numeric weights.
 * @returns A generator that yields keys by weight.
 */
export const weighted = <T extends string>(map: Record<T, number>): (() => T) => {
  const entries = (Object.keys(map) as T[])
    .map((k) => [k, map[k] ?? 0] as const)
    .filter(([, w]) => w > 0);
  if (entries.length === 0) {
    throw new Error("weighted: at least one positive weight is required.");
  }
  const total = entries.reduce((s, [, w]) => s + w, 0);

  return () => {
    const rng = getRng()();
    const target = rng * total;
    let acc = 0;
    for (const [k, w] of entries) {
      acc += w;
      if (target < acc) return k;
    }
    return entries[entries.length - 1]![0];
  };
};

/**
 * Monotonic numeric sequence generator.
 *
 * @param start - First value (default 1).
 * @param step - Increment (default 1).
 * @returns A function that returns the next number on each call.
 */
export const sequence = (start = 1, step = 1): (() => number) => {
  let current = start - step;
  return () => {
    current += step;
    return current;
  };
};

/**
 * Typed {@link pickRandom} as a zero-arg generator factory.
 *
 * @param values - Non-empty list of choices.
 * @returns A generator that picks from values.
 */
export const fromList = <T>(values: readonly T[]): (() => T) => () => pickRandom(values);

/**
 * Builds a generator that returns a fixed-length array by calling `fn` repeatedly.
 *
 * @param fn - Element generator.
 * @param length - Array length.
 * @returns A generator of arrays.
 */
export const array = <T>(fn: () => T, length: number): (() => T[]) => () =>
  Array.from({ length }, fn);

/* ─── regex (limited subset) ─── */

type Gen = () => string;

const DIGITS = "0123456789";
const WORD_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_";
const SPACE_CHARS = " \t\n\r";

const randU = (chars: string): Gen => {
  const rng = getRng();
  return () => chars[(rng() * chars.length) | 0]!;
};

const repeatGen = (gen: Gen, count: number): Gen => () =>
  Array.from({ length: count }, () => gen()).join("");

const concatGens = (gens: Gen[]): Gen => () => gens.map((g) => g()).join("");

type Quant =
  | { kind: "none" }
  | { kind: "star" }
  | { kind: "plus" }
  | { kind: "optional" }
  | { kind: "exact"; n: number }
  | { kind: "range"; min: number; max: number };

const applyQuant = (gen: Gen, q: Quant): Gen => {
  const rng = getRng();
  if (q.kind === "none") return gen;
  if (q.kind === "optional") {
    return () => (rng() < 0.5 ? "" : gen());
  }
  if (q.kind === "star") {
    const n = (rng() * 11) | 0;
    return repeatGen(gen, n);
  }
  if (q.kind === "plus") {
    const n = 1 + ((rng() * 10) | 0);
    return repeatGen(gen, n);
  }
  if (q.kind === "exact") {
    return repeatGen(gen, q.n);
  }
  if (q.kind === "range") {
    const span = Math.max(0, q.max - q.min);
    const n = q.min + ((rng() * (span + 1)) | 0);
    return repeatGen(gen, n);
  }
  return gen;
};

const splitTopLevel = (s: string, sep: string): string[] => {
  const parts: string[] = [];
  let depth = 0;
  let buf = "";
  for (let i = 0; i < s.length; i += 1) {
    const c = s[i]!;
    if (c === "(") depth += 1;
    else if (c === ")") depth -= 1;
    if (c === sep && depth === 0) {
      parts.push(buf);
      buf = "";
    } else {
      buf += c;
    }
  }
  parts.push(buf);
  return parts;
};

const parseCharClass = (inner: string): Gen => {
  let neg = false;
  let i = 0;
  if (inner[0] === "^") {
    neg = true;
    i = 1;
  }
  const chars = new Set<string>();
  while (i < inner.length) {
    const a = inner[i]!;
    const b = inner[i + 1];
    const c = inner[i + 2];
    if (b === "-" && c !== undefined && c !== "]") {
      const start = a.codePointAt(0)!;
      const end = c.codePointAt(0)!;
      const lo = Math.min(start, end);
      const hi = Math.max(start, end);
      for (let cp = lo; cp <= hi; cp += 1) {
        chars.add(String.fromCodePoint(cp));
      }
      i += 3;
    } else {
      chars.add(a);
      i += 1;
    }
  }
  const list = [...chars];
  if (list.length === 0) {
    throw new Error("regex: empty character class");
  }
  if (neg) {
    throw new Error("regex: negated character classes are not supported");
  }
  return () => pickRandom(list);
};

interface PState {
  readonly s: string;
  i: number;
}

const peek = (p: PState): string | undefined => p.s[p.i];
const eat = (p: PState): string | undefined => p.s[p.i++];

const readQuantifier = (p: PState): Quant => {
  const c = peek(p);
  if (c === "?") {
    eat(p);
    return { kind: "optional" };
  }
  if (c === "*") {
    eat(p);
    return { kind: "star" };
  }
  if (c === "+") {
    eat(p);
    return { kind: "plus" };
  }
  if (c === "{") {
    eat(p);
    let num = "";
    while (peek(p) && /[0-9]/.test(peek(p)!)) {
      num += eat(p);
    }
    if (!num) throw new Error("regex: invalid quantifier {n}");
    const n = Number(num);
    if (peek(p) === "}") {
      eat(p);
      return { kind: "exact", n };
    }
    if (peek(p) === ",") {
      eat(p);
      let num2 = "";
      while (peek(p) && /[0-9]/.test(peek(p)!)) {
        num2 += eat(p)!;
      }
      if (peek(p) !== "}") throw new Error("regex: invalid quantifier {n,m}");
      eat(p);
      const max = num2 === "" ? n + 10 : Number(num2);
      return { kind: "range", min: n, max: max };
    }
    throw new Error("regex: invalid quantifier");
  }
  return { kind: "none" };
};

const parseAtom = (p: PState): Gen => {
  const c = peek(p);
  if (c === undefined) {
    throw new Error("regex: unexpected end of pattern");
  }
  if (c === ")") {
    throw new Error("regex: unexpected ')'");
  }
  if (c === "|") {
    throw new Error("regex: unexpected '|' (use parentheses for alternation)");
  }

  if (c === "(") {
    eat(p);
    let depth = 1;
    let inner = "";
    while (peek(p) !== undefined && depth > 0) {
      const ch = eat(p)!;
      if (ch === "(") {
        depth += 1;
        inner += ch;
      } else if (ch === ")") {
        depth -= 1;
        if (depth > 0) inner += ch;
      } else {
        inner += ch;
      }
    }
    if (depth !== 0) throw new Error("regex: unclosed '('");
    const options = splitTopLevel(inner, "|").map((part) => compileExpr(part));
    const gen: Gen = () => pickRandom(options)();
    const q = readQuantifier(p);
    return applyQuant(gen, q);
  }

  if (c === "[") {
    eat(p);
    let inner = "";
    while (peek(p) !== undefined && peek(p) !== "]") {
      inner += eat(p)!;
    }
    if (peek(p) !== "]") throw new Error("regex: unclosed '['");
    eat(p);
    const gen = parseCharClass(inner);
    const q = readQuantifier(p);
    return applyQuant(gen, q);
  }

  if (c === "\\") {
    eat(p);
    const esc = eat(p);
    if (esc === undefined) throw new Error("regex: dangling escape");
    let base: Gen;
    if (esc === "d") base = randU(DIGITS);
    else if (esc === "w") base = randU(WORD_CHARS);
    else if (esc === "s") base = randU(SPACE_CHARS);
    else if (esc === "n") base = () => "\n";
    else if (esc === "t") base = () => "\t";
    else if (esc === "r") base = () => "\r";
    else if (esc === "(" || esc === ")" || esc === "[" || esc === "]" || esc === "{" || esc === "}" || esc === "\\" || esc === "|" || esc === "*" || esc === "+" || esc === "?" || esc === ".")
      base = () => esc;
    else throw new Error(`regex: unsupported escape \\${esc}`);
    const q = readQuantifier(p);
    return applyQuant(base, q);
  }

  eat(p);
  const lit: Gen = () => c;
  const q = readQuantifier(p);
  return applyQuant(lit, q);
};

const compileExpr = (pattern: string): Gen => {
  const p: PState = { s: pattern, i: 0 };
  const parts: Gen[] = [];
  while (peek(p) !== undefined) {
    if (peek(p) === "|") {
      throw new Error("regex: top-level '|' must be inside a group");
    }
    parts.push(parseAtom(p));
  }
  return concatGens(parts);
};

/**
 * Builds a generator that yields strings matching a small regex subset.
 *
 * Supports: literals, `.`, `\\d` `\\w` `\\s`, character classes `[a-z]`, groups `(a|b)`,
 * and quantifiers `?` `*` `+` `{n}` `{n,m}`.
 *
 * @param pattern - Regex source string or RegExp (`.source` is used).
 * @returns A generator function.
 */
export const regex = (pattern: string | RegExp): (() => string) => {
  const src = typeof pattern === "string" ? pattern : pattern.source;
  try {
    const gen = compileExpr(src);
    return () => gen();
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(`regex: ${msg}`, { cause: e });
  }
};
