export const APP_NAME = "JobConnect";

export const STORAGE_KEYS = Object.freeze({
  accessToken: "jobconnect.accessToken",
  refreshToken: "jobconnect.refreshToken",
  authUser: "jobconnect.authUser",
  uiState: "jobconnect.uiState",
  localAccounts: "jobconnect.localAccounts",
});

export const ROUTES = Object.freeze({
  login: "#/login",
  register: "#/register",
  dashboard: "#/dashboard",
  candidates: "#/candidatos",
  vacancies: "#/vacantes",
  companies: "#/empresas",
  applications: "#/postulaciones",
  interviews: "#/entrevistas",
  tasks: "#/tareas",
});

export const NAVIGATION_ITEMS = Object.freeze([
  { key: "dashboard", label: "Dashboard", route: ROUTES.dashboard },
  { key: "candidates", label: "Candidatos", route: ROUTES.candidates },
  { key: "vacancies", label: "Vacantes", route: ROUTES.vacancies },
  { key: "companies", label: "Empresas", route: ROUTES.companies },
  { key: "applications", label: "Postulaciones", route: ROUTES.applications },
  { key: "interviews", label: "Entrevistas", route: ROUTES.interviews },
  { key: "tasks", label: "Tareas", route: ROUTES.tasks },
]);

export const PRIVATE_ROUTES = Object.freeze([
  ROUTES.dashboard,
  ROUTES.candidates,
  ROUTES.vacancies,
  ROUTES.companies,
  ROUTES.applications,
  ROUTES.interviews,
  ROUTES.tasks,
]);

export default {
  name: APP_NAME,
  storageKeys: STORAGE_KEYS,
  routes: ROUTES,
  navigationItems: NAVIGATION_ITEMS,
  privateRoutes: PRIVATE_ROUTES,
};

