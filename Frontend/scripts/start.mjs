import { createReadStream, existsSync, statSync } from "node:fs";
import { spawn } from "node:child_process";
import { extname, join, normalize } from "node:path";
import { createServer } from "node:http";

const DIST_DIR = join(process.cwd(), "out");
const INDEX_FILE = join(DIST_DIR, "index.html");
const HOST = process.env.HOST || "127.0.0.1";
const PORT = Number(process.env.PORT || 3000);

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".xml": "application/xml; charset=utf-8",
};

function ensureBuild() {
  if (existsSync(INDEX_FILE)) {
    return Promise.resolve();
  }

  console.log("No static export found in ./out. Building the frontend first...");

  return new Promise((resolve, reject) => {
    const command = process.platform === "win32" ? "npm.cmd" : "npm";
    const child = spawn(command, ["run", "build"], {
      cwd: process.cwd(),
      stdio: "inherit",
      env: process.env,
    });

    child.on("exit", (code) => {
      if (code === 0 && existsSync(INDEX_FILE)) {
        resolve();
        return;
      }

      reject(new Error(`Build failed with exit code ${code ?? "unknown"}.`));
    });

    child.on("error", reject);
  });
}

function resolveRequestPath(urlPath) {
  const sanitizedPath = normalize(decodeURIComponent(urlPath).replace(/^\/+/, ""));
  const candidatePaths = [];

  if (!sanitizedPath || sanitizedPath === ".") {
    candidatePaths.push(INDEX_FILE);
  } else {
    const directPath = join(DIST_DIR, sanitizedPath);
    candidatePaths.push(directPath);
    candidatePaths.push(join(DIST_DIR, sanitizedPath, "index.html"));
    candidatePaths.push(join(DIST_DIR, `${sanitizedPath}.html`));
  }

  for (const candidatePath of candidatePaths) {
    if (!candidatePath.startsWith(DIST_DIR)) {
      continue;
    }

    if (existsSync(candidatePath) && statSync(candidatePath).isFile()) {
      return candidatePath;
    }
  }

  return null;
}

function getContentType(filePath) {
  return MIME_TYPES[extname(filePath).toLowerCase()] || "application/octet-stream";
}

function startStaticServer() {
  const server = createServer((request, response) => {
    const parsedUrl = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
    const requestPath = resolveRequestPath(parsedUrl.pathname);

    if (!requestPath) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }

    response.writeHead(200, { "Content-Type": getContentType(requestPath) });
    createReadStream(requestPath).pipe(response);
  });

  server.on("error", (error) => {
    console.error(`Failed to start static server: ${error.message}`);
    process.exit(1);
  });

  server.listen(PORT, HOST, () => {
    console.log(`Static frontend ready at http://localhost:${PORT}`);
  });
}

ensureBuild()
  .then(startStaticServer)
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
