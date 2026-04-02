import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "person/index": "src/person/index.ts",
    "internet/index": "src/internet/index.ts",
    "finance/index": "src/finance/index.ts"
  },
  format: ["esm", "cjs"],
  dts: true,
  minify: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  target: "es2020",
  outDir: "dist"
});
