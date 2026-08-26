export const ROLES = Object.freeze({
  client: "client",
  candidate: "client",
  employer: "employer",
  administrator: "administrator",
  interviewer: "interviewer",
  recruiter: "recruiter",
});

export const ROLE_META = Object.freeze({
  client: { label: "Cliente", entry: "portal", permissions: ["portal"] },
  employer: { label: "Empresa", entry: "dashboard", permissions: ["dashboard", "vacancies", "applications"] },
  administrator: { label: "Administrador", entry: "dashboard", permissions: ["dashboard", "all"] },
  interviewer: { label: "Entrevistador", entry: "dashboard", permissions: ["dashboard", "interviews", "applications"] },
  recruiter: { label: "Reclutador", entry: "dashboard", permissions: ["dashboard", "all"] },
});

export function normalizeRole(role) {
  return role === "candidate" ? ROLES.client : ROLE_META[role] ? role : ROLES.recruiter;
}

export function getRoleMeta(role) {
  return ROLE_META[normalizeRole(role)];
}

export function canAccess(role, permission) {
  const permissions = getRoleMeta(role).permissions;
  return permissions.includes("all") || permissions.includes(permission);
}