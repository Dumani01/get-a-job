import { PORTAL_ROLES } from "./portal.config.js";

export const PORTAL_ROUTES = Object.freeze([
  { path: "/inicio", hash: "#/inicio", page: "home", roles: [] },
  { path: "/empleos", hash: "#/empleos", page: "jobs", roles: [] },
  { path: "/empleo", hash: "#/empleo", page: "job-detail", roles: [] },
  { path: "/login", hash: "#/login", page: "login", roles: [] },
  { path: "/registro", hash: "#/registro", page: "register", roles: [] },
  { path: "/perfil", hash: "#/perfil", page: "profile", roles: [PORTAL_ROLES.candidate] },
  { path: "/guardados", hash: "#/guardados", page: "saved-jobs", roles: [PORTAL_ROLES.candidate] },
  { path: "/postulaciones", hash: "#/postulaciones", page: "applications", roles: [PORTAL_ROLES.candidate] },
  { path: "/empresa/ofertas", hash: "#/empresa/ofertas", page: "employer-jobs", roles: [PORTAL_ROLES.employer] },
  { path: "/empresa/publicar", hash: "#/empresa/publicar", page: "employer-job-create", roles: [PORTAL_ROLES.employer] },
  { path: "/empresa/editar", hash: "#/empresa/editar", page: "employer-job-edit", roles: [PORTAL_ROLES.employer] },
  { path: "/empresa/postulantes", hash: "#/empresa/postulantes", page: "employer-applicants", roles: [PORTAL_ROLES.employer] },
]);
