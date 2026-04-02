import { createServer } from "node:http";
import { readFile, readdir } from "node:fs/promises";
import { extname, normalize, relative, resolve } from "node:path";
import { cwd } from "node:process";
import { URL } from "node:url";

const PREFERRED_PORT = Number(process.env.PORT ?? 4173);
const MAX_PORT_TRY = 30;
const ROOT = cwd();
const ROOT_RESOLVED = resolve(ROOT);

const SCAN_PATH_RE = /^[a-zA-Z0-9_\-/.]+$/;

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
};

/** Resolves a path under project root; rejects traversal outside ROOT. */
const safePath = (urlPath) => {
  const normalized = normalize(urlPath).replace(/^([/\\])+/, "");
  const resolved = resolve(ROOT, normalized);
  const rel = relative(ROOT_RESOLVED, resolved);
  if (rel.startsWith("..") || rel === "..") {
    const err = new Error("Path traversal detected");
    err.code = "EPATHTRAVERSAL";
    throw err;
  }
  return resolved;
};

const fieldCache = new Map();

const relPosix = (absPath) => relative(ROOT, absPath).replace(/\\/g, "/");

const pathToModule = (relPath) => {
  const parts = relPath.split("/").filter(Boolean);
  if (parts.length >= 2) return parts[parts.length - 2];
  return parts[0] ?? "unknown";
};

const parseExports = (content, moduleName) => {
  const fieldDefinitions = [];
  const constMatches = content.matchAll(/export const\s+([a-zA-Z0-9_]+)\s*=\s*\(/g);
  for (const match of constMatches) {
    fieldDefinitions.push({
      module: moduleName,
      field: match[1],
      label: match[1].replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()),
    });
  }
  return fieldDefinitions;
};

const parseFunctionExports = (content, moduleName) => {
  const skip = new Set(["seed", "resetSeed", "getRng", "pickRandom", "random"]);
  const fieldDefinitions = [];
  const fnMatches = content.matchAll(/export function\s+([a-zA-Z0-9_]+)\s*\(/g);
  for (const match of fnMatches) {
    const name = match[1];
    if (skip.has(name)) continue;
    fieldDefinitions.push({
      module: moduleName,
      field: name,
      label: name.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()),
    });
  }
  return fieldDefinitions;
};

/** Recursively collect index.ts paths under rootDir; max depth 2 from rootDir. */
const collectIndexTs = async (rootDir, currentDepth, maxDepth) => {
  const out = [];
  const idx = resolve(rootDir, "index.ts");
  try {
    await readFile(idx);
    out.push(relPosix(idx));
  } catch {
    // no index.ts here
  }
  if (currentDepth >= maxDepth) return out;
  let entries;
  try {
    entries = await readdir(rootDir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    if (e.isDirectory()) {
      out.push(...(await collectIndexTs(resolve(rootDir, e.name), currentDepth + 1, maxDepth)));
    }
  }
  return out;
};

const scanDefaultSrc = async () => {
  const sourceRoot = safePath("src");
  const entries = await readdir(sourceRoot, { withFileTypes: true });
  const scannedFiles = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (entry.name === "utils" || entry.name === "internal") continue;
    const modulePath = resolve(sourceRoot, entry.name, "index.ts");
    try {
      await readFile(modulePath);
      scannedFiles.push(relPosix(modulePath));
    } catch {
      continue;
    }
  }
  const utilsRandom = safePath("src/utils/random.ts");
  try {
    await readFile(utilsRandom);
    scannedFiles.push(relPosix(utilsRandom));
  } catch {
    // ignore
  }
  return scannedFiles.sort();
};

const buildFieldsFromFiles = async (scannedFiles) => {
  const fieldDefinitions = [];
  for (const rel of scannedFiles) {
    const modulePath = safePath(rel);
    const mod = pathToModule(rel);
    const content = await readFile(modulePath, "utf8");
    if (rel.replace(/\\/g, "/").endsWith("utils/random.ts")) {
      fieldDefinitions.push(...parseFunctionExports(content, "random"));
    } else {
      fieldDefinitions.push(...parseExports(content, mod));
    }
  }
  return fieldDefinitions.sort((a, b) => a.field.localeCompare(b.field));
};

const normalizeScanPathArg = (scanPathRaw) => {
  if (scanPathRaw === undefined || scanPathRaw === null) return undefined;
  const s = String(scanPathRaw).trim();
  if (s === "" || s === "default") return undefined;
  return s;
};

const getFieldDefinitions = async (cacheKey, scanPathRaw) => {
  if (fieldCache.has(cacheKey)) {
    const cached = fieldCache.get(cacheKey);
    const resolvedScanPath = cached.scanPath ?? "src";
    const files = Array.isArray(cached.scannedFiles) ? cached.scannedFiles : [];
    return { ...cached, scanPath: resolvedScanPath, scannedFiles: files };
  }

  const effective = normalizeScanPathArg(scanPathRaw);

  let scannedFiles;
  let responseScanPath;

  if (!effective) {
    scannedFiles = await scanDefaultSrc();
    responseScanPath = "src";
  } else {
    const resolvedRoot = safePath(effective);
    scannedFiles = (await collectIndexTs(resolvedRoot, 0, 2)).sort();
    responseScanPath = effective.replace(/\\/g, "/");
  }

  const fields = await buildFieldsFromFiles(scannedFiles);
  const resolvedScanPath = responseScanPath ?? "src";
  const payload = {
    fields,
    scanPath: resolvedScanPath,
    scannedFiles: scannedFiles ?? [],
  };
  fieldCache.set(cacheKey, payload);
  return payload;
};

const serveFile = async (path, response) => {
  try {
    const content = await readFile(path);
    const contentType = MIME_TYPES[extname(path)] ?? "application/octet-stream";

    response.writeHead(200, { "Content-Type": contentType });
    response.end(content);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
};

const createApp = (listenPort) => async (request, response) => {
  const requestUrl = request.url ?? "/";
  const url = new URL(requestUrl, `http://localhost:${listenPort}`);

  if (url.pathname === "/api/fields") {
    if (url.searchParams.get("bust") === "1") {
      fieldCache.clear();
    }

    const scanPathParam = url.searchParams.get("scanPath")?.trim();

    let cacheKey = "default";
    let scanPathForFetch = undefined;

    if (scanPathParam) {
      if (!SCAN_PATH_RE.test(scanPathParam) || scanPathParam.includes("..")) {
        response.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
        response.end(JSON.stringify({ error: "Invalid scanPath" }));
        return;
      }
      cacheKey = scanPathParam;
      scanPathForFetch = scanPathParam;
    }

    try {
      const payload = await getFieldDefinitions(cacheKey, scanPathForFetch);
      response.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      response.end(JSON.stringify(payload));
    } catch (error) {
      if (error?.code === "EPATHTRAVERSAL") {
        response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
        response.end("Forbidden");
      } else {
        response.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
        response.end(
          JSON.stringify({
            fields: [],
            scannedFiles: [],
            scanPath: "src",
            error: "Failed to scan fields.",
          }),
        );
      }
    }
    return;
  }

  try {
    if (url.pathname === "/" || url.pathname === "/index.html") {
      await serveFile(safePath("playground/index.html"), response);
      return;
    }

    if (url.pathname.startsWith("/playground/") || url.pathname.startsWith("/dist/")) {
      await serveFile(safePath(url.pathname), response);
      return;
    }
  } catch (error) {
    if (error?.code === "EPATHTRAVERSAL") {
      response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Forbidden");
      return;
    }
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Internal error");
    return;
  }

  response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  response.end("Not found");
};

const tryListen = (port) => {
  if (port > PREFERRED_PORT + MAX_PORT_TRY) {
    console.error(
      `Could not bind to any port from ${PREFERRED_PORT} to ${PREFERRED_PORT + MAX_PORT_TRY}.`,
    );
    console.error("Stop the other process or set PORT, e.g. PORT=4174 npm run playground");
    process.exit(1);
  }

  const server = createServer(createApp(port));

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      server.close(() => tryListen(port + 1));
    } else {
      console.error(err);
      process.exit(1);
    }
  });

  server.listen(port, () => {
    if (port !== PREFERRED_PORT) {
      console.warn(`Port ${PREFERRED_PORT} was busy; using ${port} instead.`);
    }
    console.log(`nanofake playground is running on http://localhost:${port}`);
  });
};

tryListen(PREFERRED_PORT);
