import { createServer } from "node:http";
import { readFile, readdir } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { cwd } from "node:process";
import { URL } from "node:url";

const PORT = Number(process.env.PORT ?? 4173);
const ROOT = cwd();

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8"
};

const safePath = (urlPath) => {
  const normalized = normalize(urlPath).replace(/^([/\\])+/, "");
  return join(ROOT, normalized);
};

const getFieldDefinitions = async () => {
  const sourceRoot = safePath("src");
  const entries = await readdir(sourceRoot, { withFileTypes: true });
  const fieldDefinitions = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (entry.name === "utils") continue;

    const modulePath = join(sourceRoot, entry.name, "index.ts");

    try {
      const content = await readFile(modulePath, "utf8");
      const matches = content.matchAll(/export const\s+([a-zA-Z0-9_]+)\s*=\s*\(/g);

      for (const match of matches) {
        fieldDefinitions.push({
          module: entry.name,
          field: match[1],
          label: match[1].replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())
        });
      }
    } catch {
      continue;
    }
  }

  return fieldDefinitions.sort((a, b) => a.field.localeCompare(b.field));
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

createServer(async (request, response) => {
  const requestUrl = request.url ?? "/";
  const url = new URL(requestUrl, `http://localhost:${PORT}`);

  if (url.pathname === "/api/fields") {
    try {
      const fields = await getFieldDefinitions();
      response.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      response.end(JSON.stringify({ fields }));
    } catch {
      response.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
      response.end(JSON.stringify({ fields: [], error: "Failed to scan fields." }));
    }
    return;
  }

  if (url.pathname === "/" || url.pathname === "/index.html") {
    await serveFile(safePath("playground/index.html"), response);
    return;
  }

  if (url.pathname.startsWith("/playground/") || url.pathname.startsWith("/dist/")) {
    await serveFile(safePath(url.pathname), response);
    return;
  }

  response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  response.end("Not found");
}).listen(PORT, () => {
  console.log(`nanofake playground is running on http://localhost:${PORT}`);
});
