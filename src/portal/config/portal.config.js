export const PORTAL_CONFIG = Object.freeze({
  appName: "JobConnect",
  defaultRoute: "#/inicio",
  pageSize: 12,
  locale: "es-CR",
  currency: "CRC",
  demoNotice: "Contenido demostrativo. Las empresas, vacantes y salarios mostrados no representan ofertas reales.",
});

export const PORTAL_STORAGE_KEYS = Object.freeze({
  jobs: "jc.portal.jobs",
  savedJobs: "jc.portal.savedJobs",
  applications: "jc.portal.applications",
  session: "jc.portal.session",
  profile: "jc.portal.profile",
  notifications: "jc.portal.notifications",
});

export const PORTAL_EVENTS = Object.freeze({
  routeChange: "jc:portal:route-change",
  sessionChange: "jc:portal:session-change",
  jobsChange: "jc:portal:jobs-change",
  savedChange: "jc:portal:saved-change",
  applicationsChange: "jc:portal:applications-change",
  jobSelected: "jc:portal:job-selected",
});

export const PORTAL_ROLES = Object.freeze({
  candidate: "candidate",
  employer: "employer",
});
