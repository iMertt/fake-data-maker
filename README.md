# nanofake

[![CI](https://github.com/your-org/nanofake/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/nanofake/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/nanofake.svg)](https://www.npmjs.com/package/nanofake)
[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

A modern, zero-dependency, tree-shakable fake data generator for TypeScript and JavaScript.

## Why this library?

- Zero runtime dependencies.
- Fully tree-shakable architecture.
- Tiny API built from pure standalone functions.
- TypeScript-first with generated type declarations.
- ESM-first package output with CommonJS compatibility.

## Installation

```bash
npm install nanofake
```

## Usage

```ts
import { firstName, lastName, email, username, creditCard } from "nanofake";

const user = {
  firstName: firstName(),
  lastName: lastName(),
  username: username(),
  email: email(),
  creditCard: creditCard()
};

console.log(user);
```

### Tree-shakable imports

```ts
import { firstName } from "nanofake/person";
import { email } from "nanofake/internet";
```

## API

- `firstName(): string`
- `lastName(): string`
- `email(): string`
- `username(): string`
- `creditCard(): string`

`creditCard()` returns **synthetic** 16-digit numbers that pass the Luhn check. They are **not** real payment card numbers, are not issued by any bank, and must not be used where real PANs are expected. Treat them like any other fake test data in logs and APIs (PCI scanners may still flag long digit strings).

## Development

```bash
npm install
npm run lint
npm run build
npm run test
```

## Local Playground UI

You can run a local browser UI to generate records with count, field selection, and text filtering.

```bash
npm run playground
```

Then open `http://localhost:4173` in your browser.

Playground features:

- Record count input
- Field selection checkboxes
- Text filter input
- JSON output + copy button

## License

MIT
