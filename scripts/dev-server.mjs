import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { dirname, extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const host = "127.0.0.1";
const port = Number.parseInt(process.env.PORT ?? "4173", 10);

const mimeTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".map", "application/json; charset=utf-8"],
  [".mjs", "text/javascript; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml; charset=utf-8"],
  [".webp", "image/webp"],
]);

function sendText(response, statusCode, message) {
  response.writeHead(statusCode, {
    "Cache-Control": "no-store",
    "Content-Type": "text/plain; charset=utf-8",
    "X-Content-Type-Options": "nosniff",
  });
  response.end(message);
}

function resolveRequestPath(requestUrl) {
  const pathname = decodeURIComponent(new URL(requestUrl, `http://${host}`).pathname);
  const relativePath = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const filePath = resolve(projectRoot, relativePath);
  const isInsideProject = filePath === projectRoot || filePath.startsWith(`${projectRoot}${sep}`);

  if (!isInsideProject) {
    throw new Error("Ruta fuera del proyecto");
  }

  return filePath;
}

const server = createServer(async (request, response) => {
  if (!request.url || !["GET", "HEAD"].includes(request.method ?? "")) {
    sendText(response, 405, "Método no permitido");
    return;
  }

  let filePath;

  try {
    filePath = resolveRequestPath(request.url);
    const fileStats = await stat(filePath);

    if (!fileStats.isFile()) {
      sendText(response, 404, "Archivo no encontrado");
      return;
    }
  } catch (error) {
    const statusCode = error instanceof URIError || error.message === "Ruta fuera del proyecto" ? 403 : 404;
    sendText(response, statusCode, statusCode === 403 ? "Ruta no permitida" : "Archivo no encontrado");
    return;
  }

  response.writeHead(200, {
    "Cache-Control": "no-store",
    "Content-Type": mimeTypes.get(extname(filePath).toLowerCase()) ?? "application/octet-stream",
    "X-Content-Type-Options": "nosniff",
  });

  if (request.method === "HEAD") {
    response.end();
    return;
  }

  createReadStream(filePath).pipe(response);
});

server.listen(port, host, () => {
  console.log(`JobConnect disponible en http://${host}:${port}`);
});

server.on("error", (error) => {
  console.error("No se pudo iniciar el servidor de JobConnect.", error.message);
  process.exitCode = 1;
});

