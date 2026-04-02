# Changelog

## 0.1.0

Initial release.

- **Core:** `firstName`, `lastName`, `email`, `username`, `creditCard` generators.
- **Random:** `pickRandom`, pluggable RNG via `seed` / `resetSeed` (LCG when seeded; `Math.random` when reset).
- **Names:** Locale-oriented data pools (`NAME_POOLS`) with merged `FIRST_NAMES` / `LAST_NAMES` for backward compatibility.
- **Subpath exports:** `nanofake/person`, `nanofake/internet`, `nanofake/finance`.
- **Playground:** Local UI to pick fields, generate JSON, filter, and copy (builds `playground/app.js` from `playground/app.ts`).
- **Tooling:** TypeScript (strict), Vitest, ESLint (flat `eslint.config.mjs`), Prettier, `@vitest/coverage-v8`.
