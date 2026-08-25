import { execFileSync } from "node:child_process";
import { readFile, readdir, stat } from "node:fs/promises";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { jobsSeed } from "../src/portal/data/jobs.seed.js";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const portalRoot = resolve(projectRoot, "src", "portal");
const errors = [];

const requiredFiles = Object.freeze([
  "portal.html",
  "scripts/check-portal.mjs",
  "src/portal/app.js",
  "src/portal/main.js",
  "src/portal/config/portal.config.js",
  "src/portal/config/routes.config.js",
  "src/portal/core/portal-router.js",
  "src/portal/core/portal-session.js",
  "src/portal/core/portal-validators.js",
  "src/portal/core/jobs-repository.js",
  "src/portal/core/saved-jobs-repository.js",
  "src/portal/core/applications-repository.js",
  "src/portal/data/jobs.seed.js",
  "src/portal/layout/portal-header.js",
  "src/portal/layout/portal-footer.js",
  "src/portal/layout/portal-shell.js",
  "src/portal/components/portal-loader.js",
  "src/portal/components/portal-search.js",
  "src/portal/components/portal-social-links.js",
  "src/portal/components/combination-lock.js",
  "src/portal/components/save-job-button.js",
  "src/portal/components/delete-job-button.js",
  "src/portal/components/portal-confirm-dialog.js",
  "src/portal/components/portal-toast.js",
  "src/portal/components/portal-empty-state.js",
  "src/portal/components/portal-skeleton.js",
  "src/portal/components/application-modal.js",
  "src/portal/pages/home-page.js",
  "src/portal/pages/jobs-page.js",
  "src/portal/pages/job-detail-page.js",
  "src/portal/pages/auth-page.js",
  "src/portal/pages/profile-page.js",
  "src/portal/pages/saved-jobs-page.js",
  "src/portal/pages/applications-page.js",
  "src/portal/pages/employer-jobs-page.js",
  "src/portal/pages/employer-job-form-page.js",
  "src/portal/pages/employer-applicants-page.js",
  "src/portal/features/job-card.js",
  "src/portal/features/job-filters.js",
  "src/portal/features/application-form.js",
  "src/portal/styles/portal-base.css",
  "src/portal/styles/portal-layout.css",
  "src/portal/styles/portal-components.css",
  "src/portal/styles/portal-pages.css",
  "src/portal/styles/portal-uiverse.css",
  "src/portal/styles/portal-responsive.css",
]);

const expectedPortalFiles = new Set(
  requiredFiles.filter((file) => file.startsWith("src/portal/")),
);

const requiredRoutes = Object.freeze([
  "#/inicio",
  "#/empleos",
  "#/empleo",
  "#/login",
  "#/registro",
  "#/perfil",
  "#/guardados",
  "#/postulaciones",
  "#/empresa/ofertas",
  "#/empresa/publicar",
  "#/empresa/editar",
  "#/empresa/postulantes",
]);

const requiredStorageKeys = Object.freeze([
  "jc.portal.jobs",
  "jc.portal.savedJobs",
  "jc.portal.applications",
  "jc.portal.session",
  "jc.portal.profile",
  "jc.portal.notifications",
]);

const allowedChangedPaths = Object.freeze([
  "portal.html",
  "scripts/check-portal.mjs",
]);

const requiredSeedFields = Object.freeze([
  "id",
  "slug",
  "title",
  "company",
  "location",
  "workMode",
  "contractType",
  "category",
  "salary",
  "experienceLevel",
  "publishedAt",
  "expiresAt",
  "description",
  "responsibilities",
  "requirements",
  "skills",
  "benefits",
  "featured",
  "status",
  "applicantsCount",
  "createdBy",
]);

const allowedWorkModes = new Set(["remote", "hybrid", "onsite"]);
const allowedContractTypes = new Set(["full-time", "part-time", "temporary", "internship"]);
const allowedExperienceLevels = new Set(["entry", "junior", "mid", "senior"]);
const allowedJobStatuses = new Set(["active", "paused", "closed"]);

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
    const entryPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectFiles(entryPath)));
    } else {
      files.push(entryPath);
    }
  }

  return files;
}

function toProjectPath(filePath) {
  return relative(projectRoot, filePath).replaceAll("\\", "/");
}

function extractImportSpecifiers(content) {
  const specifiers = [];
  const fromImports = content.matchAll(/\bfrom\s+["']([^"']+)["']/g);
  const sideEffectImports = content.matchAll(/\bimport\s+["']([^"']+)["']/g);

  for (const match of fromImports) {
    specifiers.push(match[1]);
  }

  for (const match of sideEffectImports) {
    specifiers.push(match[1]);
  }

  return specifiers;
}

function resolveImport(filePath, specifier) {
  const candidate = resolve(dirname(filePath), specifier);
  return extname(candidate) ? candidate : `${candidate}.js`;
}

function collectWorkingTreeChanges() {
  const commands = [
    ["diff", "--name-only"],
    ["diff", "--cached", "--name-only"],
    ["ls-files", "--others", "--exclude-standard"],
  ];

  const paths = new Set();

  for (const args of commands) {
    const output = execFileSync("git", args, {
      cwd: projectRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });

    output
      .split(/\r?\n/)
      .map((value) => value.trim())
      .filter(Boolean)
      .forEach((value) => paths.add(value.replaceAll("\\", "/")));
  }

  return [...paths];
}

for (const file of requiredFiles) {
  if (!(await exists(resolve(projectRoot, file)))) {
    errors.push(`Falta el archivo obligatorio: ${file}`);
  }
}

if (await exists(portalRoot)) {
  const actualPortalFiles = (await collectFiles(portalRoot)).map(toProjectPath);

  for (const file of actualPortalFiles) {
    if (!expectedPortalFiles.has(file)) {
      errors.push(`Archivo extra no permitido dentro de src/portal: ${file}`);
    }
  }
}

const portalSourceFiles = (await exists(portalRoot))
  ? (await collectFiles(portalRoot)).filter((file) => [".js", ".css"].includes(extname(file)))
  : [];

for (const file of portalSourceFiles) {
  const projectPath = toProjectPath(file);
  const content = await readFile(file, "utf8");

  if (/#[\da-f]{3,8}\b/i.test(content)) {
    errors.push(`Color hexadecimal no permitido en ${projectPath}`);
  }

  if (extname(file) === ".js") {
    for (const specifier of extractImportSpecifiers(content)) {
      if (!specifier.startsWith("./") && !specifier.startsWith("../")) {
        errors.push(`Import externo no permitido en ${projectPath}: ${specifier}`);
        continue;
      }

      const resolvedImport = resolveImport(file, specifier);

      if (!(await exists(resolvedImport))) {
        errors.push(`Import relativo roto en ${projectPath}: ${specifier}`);
      }
    }
  }

  if (extname(file) === ".css") {
    const classNames = [...content.matchAll(/\.([a-zA-Z_][\w-]*)/g)].map((match) => match[1]);

    for (const className of classNames) {
      if (!className.startsWith("jc-portal-")) {
        errors.push(`Clase CSS sin prefijo jc-portal- en ${projectPath}: .${className}`);
      }
    }
  }
}

const portalHtmlPath = resolve(projectRoot, "portal.html");

if (await exists(portalHtmlPath)) {
  const portalHtml = await readFile(portalHtmlPath, "utf8");
  const htmlClasses = [...portalHtml.matchAll(/\bclass=["']([^"']+)["']/g)]
    .flatMap((match) => match[1].split(/\s+/))
    .filter(Boolean);

  for (const className of htmlClasses) {
    if (!className.startsWith("jc-portal-")) {
      errors.push(`Clase HTML sin prefijo jc-portal-: ${className}`);
    }
  }

  const cssOrder = [
    "/src/styles/tokens.css",
    "/src/portal/styles/portal-base.css",
    "/src/portal/styles/portal-layout.css",
    "/src/portal/styles/portal-components.css",
    "/src/portal/styles/portal-pages.css",
    "/src/portal/styles/portal-uiverse.css",
    "/src/portal/styles/portal-responsive.css",
  ];

  let previousIndex = -1;

  for (const stylesheet of cssOrder) {
    const currentIndex = portalHtml.indexOf(stylesheet);

    if (currentIndex < 0) {
      errors.push(`portal.html no enlaza la hoja requerida: ${stylesheet}`);
    } else if (currentIndex <= previousIndex) {
      errors.push(`Orden incorrecto de hojas de estilo en portal.html: ${stylesheet}`);
    }

    previousIndex = currentIndex;
  }

  if (!portalHtml.includes('lang="es"')) {
    errors.push('portal.html debe declarar lang="es".');
  }

  if (!portalHtml.includes('id="portal-app"')) {
    errors.push("portal.html debe contener #portal-app.");
  }

  if (!portalHtml.includes('href="#portal-main"')) {
    errors.push("portal.html debe incluir el enlace para saltar al contenido.");
  }

  if (!portalHtml.includes('/src/portal/main.js')) {
    errors.push("portal.html debe cargar /src/portal/main.js como módulo.");
  }

  if (/\son[a-z]+\s*=/i.test(portalHtml)) {
    errors.push("portal.html no puede usar manejadores inline.");
  }
}

const routesPath = resolve(projectRoot, "src/portal/config/routes.config.js");

if (await exists(routesPath)) {
  const routesSource = await readFile(routesPath, "utf8");

  for (const route of requiredRoutes) {
    if (!routesSource.includes(route)) {
      errors.push(`Falta la ruta contractual: ${route}`);
    }
  }
}

const portalConfigPath = resolve(projectRoot, "src/portal/config/portal.config.js");

if (await exists(portalConfigPath)) {
  const configSource = await readFile(portalConfigPath, "utf8");

  for (const storageKey of requiredStorageKeys) {
    if (!configSource.includes(storageKey)) {
      errors.push(`Falta la clave de localStorage contractual: ${storageKey}`);
    }
  }
}

if (!Array.isArray(jobsSeed) || jobsSeed.length < 24) {
  errors.push("jobs.seed.js debe exportar al menos 24 ofertas.");
} else {
  jobsSeed.forEach((job, index) => {
    for (const field of requiredSeedFields) {
      if (!(field in job)) {
        errors.push(`Oferta semilla ${index + 1} sin campo obligatorio: ${field}`);
      }
    }

    if (!allowedWorkModes.has(job.workMode)) {
      errors.push(`Oferta semilla ${job.id ?? index + 1} con workMode inválido.`);
    }

    if (!allowedContractTypes.has(job.contractType)) {
      errors.push(`Oferta semilla ${job.id ?? index + 1} con contractType inválido.`);
    }

    if (!allowedExperienceLevels.has(job.experienceLevel)) {
      errors.push(`Oferta semilla ${job.id ?? index + 1} con experienceLevel inválido.`);
    }

    if (!allowedJobStatuses.has(job.status)) {
      errors.push(`Oferta semilla ${job.id ?? index + 1} con status inválido.`);
    }
  });
}

try {
  const changedPaths = collectWorkingTreeChanges();

  for (const changedPath of changedPaths) {
    const allowed = allowedChangedPaths.includes(changedPath) || changedPath.startsWith("src/portal/");

    if (!allowed) {
      errors.push(`Cambio fuera del alcance de Berny detectado: ${changedPath}`);
    }
  }
} catch (error) {
  errors.push(`No se pudo comprobar el alcance Git del portal: ${error.message}`);
}

if (errors.length > 0) {
  console.error("La verificación del portal encontró problemas:\n");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log(`Verificación correcta del portal: ${requiredFiles.length} archivos obligatorios presentes.`);
  console.log(`Ofertas semilla verificadas: ${jobsSeed.length}.`);
  console.log("Imports relativos, rutas, almacenamiento, clases CSS y alcance Git correctos.");
}
