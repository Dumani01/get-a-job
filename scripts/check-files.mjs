import { readFile, readdir, stat } from "node:fs/promises";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const requiredFiles = [
  ".editorconfig",
  ".gitignore",
  "README.md",
  "index.html",
  "package.json",
  "scripts/check-files.mjs",
  "scripts/dev-server.mjs",
  "src/app.js",
  "src/main.js",
  "src/assets/jobconnect-logo.svg",
  "src/components/app-loader.js",
  "src/components/app-shell.js",
  "src/components/combination-lock.js",
  "src/components/confirm-dialog.js",
  "src/components/crud-view.js",
  "src/components/form-modal.js",
  "src/components/search-bar.js",
  "src/components/social-links.js",
  "src/components/toast.js",
  "src/config/api.config.js",
  "src/config/app.config.js",
  "src/config/modules.config.js",
  "src/core/api-client.js",
  "src/core/auth-service.js",
  "src/core/crud-service.js",
  "src/core/router.js",
  "src/core/session-store.js",
  "src/core/validators.js",
  "src/pages/auth-page.js",
  "src/pages/dashboard-page.js",
  "src/styles/auth.css",
  "src/styles/base.css",
  "src/styles/components.css",
  "src/styles/layout.css",
  "src/styles/reset.css",
  "src/styles/responsive.css",
  "src/styles/tokens.css",
  "docs/notebooklm-bitacora.md",
  "docs/planificacion.md",
  "docs/reflexion-notebooklm.md",
];

const moduleKeys = ["candidates", "vacancies", "companies", "applications", "interviews", "tasks"];

for (const moduleKey of moduleKeys) {
  requiredFiles.push(
    `src/modules/${moduleKey}/${moduleKey}.config.js`,
    `src/modules/${moduleKey}/${moduleKey}.mapper.js`,
    `src/modules/${moduleKey}/index.js`,
  );
}

const forbiddenDirectories = ["component", "componentes", "service", "servicios", "utils", "views"];
const errors = [];

async function exists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if ([".git", "node_modules"].includes(entry.name)) {
      continue;
    }

    const entryPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectFiles(entryPath)));
    } else {
      files.push(entryPath);
    }
  }

  return files;
}

for (const file of requiredFiles) {
  if (!(await exists(resolve(projectRoot, file)))) {
    errors.push(`Falta el archivo obligatorio: ${file}`);
  }
}

for (const directory of forbiddenDirectories) {
  if (await exists(resolve(projectRoot, "src", directory))) {
    errors.push(`Carpeta no permitida: src/${directory}`);
  }
}

const packageJson = JSON.parse(await readFile(resolve(projectRoot, "package.json"), "utf8"));
const expectedScripts = {
  start: "node scripts/dev-server.mjs",
  dev: "node scripts/dev-server.mjs",
  check: "node scripts/check-files.mjs",
};

if (JSON.stringify(packageJson.scripts) !== JSON.stringify(expectedScripts)) {
  errors.push("Los scripts de package.json no coinciden con el contrato.");
}

if (packageJson.dependencies || packageJson.devDependencies) {
  errors.push("package.json no debe declarar dependencias.");
}

const projectFiles = await collectFiles(projectRoot);
const sourceFiles = projectFiles.filter((file) => [".html", ".js", ".mjs", ".css"].includes(extname(file)));

for (const file of sourceFiles) {
  const projectPath = relative(projectRoot, file).replaceAll("\\", "/");
  const content = await readFile(file, "utf8");

  if (projectPath.endsWith(".css") && projectPath !== "src/styles/tokens.css" && /#[\da-f]{3,8}\b/i.test(content)) {
    errors.push(`Color hexadecimal fuera de tokens.css: ${projectPath}`);
  }

  if (projectPath.endsWith(".html") && /\son[a-z]+\s*=/i.test(content)) {
    errors.push(`Manejador inline no permitido: ${projectPath}`);
  }

  if (projectPath !== "scripts/check-files.mjs" && /\b(axios|jquery|react|vue|angular|tailwind|bootstrap)\b/i.test(content)) {
    errors.push(`Tecnología no permitida encontrada en: ${projectPath}`);
  }

  if ([".js", ".mjs"].includes(extname(file))) {
    const imports = [...content.matchAll(/from\s+["'](\.[^"']+)["']/g)].map((match) => match[1]);

    for (const importPath of imports) {
      const resolvedImport = resolve(dirname(file), importPath);
      if (!(await exists(resolvedImport))) {
        errors.push(`Import roto en ${projectPath}: ${importPath}`);
      }
    }
  }
}

if (errors.length > 0) {
  console.error("La verificación de JobConnect encontró problemas:\n");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log(`Verificación correcta: ${requiredFiles.length} archivos obligatorios presentes.`);
  console.log("Sin dependencias, imports rotos, carpetas duplicadas ni colores CSS fuera de tokens.css.");
}
