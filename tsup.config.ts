import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "person/index": "src/person/index.ts",
    "internet/index": "src/internet/index.ts",
    "finance/index": "src/finance/index.ts",
    "location/index": "src/location/index.ts",
    "phone/index": "src/phone/index.ts",
    "date/index": "src/date/index.ts",
    "id/index": "src/id/index.ts",
    "color/index": "src/color/index.ts",
    "company/index": "src/company/index.ts",
    "lorem/index": "src/lorem/index.ts",
    "misc/index": "src/misc/index.ts",
    "schema/index": "src/schema/index.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  minify: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  target: "es2020",
  outDir: "dist",
});
