import { PORTAL_CONFIG } from "./config/portal.config.js";
import { PORTAL_ROUTES } from "./config/routes.config.js";
import { jobsRepository } from "./core/jobs-repository.js";
import { createPortalRouter } from "./core/portal-router.js";
import { portalSession } from "./core/portal-session.js";
import { createPortalShell } from "./layout/portal-shell.js";
import { createApplicationsPage } from "./pages/applications-page.js";
import { createAuthPage } from "./pages/auth-page.js";
import { createEmployerApplicantsPage } from "./pages/employer-applicants-page.js";
import { createEmployerJobFormPage } from "./pages/employer-job-form-page.js";
import { createEmployerJobsPage } from "./pages/employer-jobs-page.js";
import { createHomePage } from "./pages/home-page.js";
import { createJobDetailPage } from "./pages/job-detail-page.js";
import { createJobsPage } from "./pages/jobs-page.js";
import { createProfilePage } from "./pages/profile-page.js";
import { createSavedJobsPage } from "./pages/saved-jobs-page.js";
import { getEntryRoute, getCurrentUser } from "../core/auth-service.js";
import { applyPreferences } from "../core/preferences.js";

function createPage(routeState) {
  switch (routeState.route.page) {
    case "home":
      return createHomePage();
    case "jobs":
      return createJobsPage();
    case "job-detail":
      return createJobDetailPage();
    case "login":
      return createAuthPage({ mode: "login" });
    case "register":
      return createAuthPage({ mode: "register" });
    case "profile":
      return createProfilePage();
    case "saved-jobs":
      return createSavedJobsPage();
    case "applications":
      return createApplicationsPage();
    case "employer-jobs":
      return createEmployerJobsPage();
    case "employer-job-create":
      return createEmployerJobFormPage({ mode: "create" });
    case "employer-job-edit":
      return createEmployerJobFormPage({ mode: "edit" });
    case "employer-applicants":
      return createEmployerApplicantsPage();
    default:
      return createHomePage();
  }
}

export function createPortalApp(root) {
  if (!(root instanceof HTMLElement)) {
    throw new TypeError("No se encontró el contenedor del portal.");
  }

  jobsRepository.seed();

  if (getEntryRoute(getCurrentUser()) === "dashboard") {
    window.location.href = "/index.html#/dashboard";
    return Object.freeze({ router: null, destroy() { root.replaceChildren(); } });
  }

  const shell = createPortalShell();
  root.replaceChildren(shell.element);

  const router = createPortalRouter({
    routes: PORTAL_ROUTES,
    session: portalSession,
    onRoute(routeState) {
      shell.main.replaceChildren(createPage(routeState));
      applyPreferences();
      shell.main.focus({ preventScroll: true });
      shell.statusRegion.textContent = `Sección cargada: ${routeState.route.page}`;
      document.title = `${PORTAL_CONFIG.appName} | Portal de empleos`;
    },
  });

  router.start();

  return Object.freeze({
    router,
    destroy() {
      router.stop();
      root.replaceChildren();
    },
  });
}
