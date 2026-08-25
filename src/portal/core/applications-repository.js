import { PORTAL_EVENTS, PORTAL_STORAGE_KEYS } from "../config/portal.config.js";
import { validateApplication } from "./portal-validators.js";

const listeners = new Set();
const allowedStatuses = new Set(["sent", "reviewing", "interview", "rejected", "hired"]);

function clone(value) {
  return typeof structuredClone === "function"
    ? structuredClone(value)
    : JSON.parse(JSON.stringify(value));
}

function readApplications() {
  const rawValue = window.localStorage.getItem(PORTAL_STORAGE_KEYS.applications);

  if (!rawValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeApplications(applications) {
  window.localStorage.setItem(PORTAL_STORAGE_KEYS.applications, JSON.stringify(applications));
}

function notify(applications) {
  const snapshot = clone(applications);
  listeners.forEach((listener) => listener(clone(snapshot)));
  window.dispatchEvent(
    new CustomEvent(PORTAL_EVENTS.applicationsChange, {
      detail: { applications: snapshot },
    }),
  );
}

export const applicationsRepository = Object.freeze({
  listByCandidate(candidateId) {
    return clone(readApplications().filter((application) => application.candidateId === candidateId));
  },

  listByJob(jobId) {
    return clone(readApplications().filter((application) => application.jobId === jobId));
  },

  create(application) {
    const validation = validateApplication(application);

    if (!validation.valid) {
      throw new Error("La postulación contiene datos inválidos.");
    }

    const applications = readApplications();
    const duplicate = applications.some(
      (item) => item.candidateId === application.candidateId && item.jobId === application.jobId,
    );

    if (duplicate) {
      throw new Error("Ya existe una postulación de este candidato para la oferta.");
    }

    const createdApplication = clone(application);
    applications.push(createdApplication);
    writeApplications(applications);
    notify(applications);
    return clone(createdApplication);
  },

  updateStatus(applicationId, status) {
    if (!allowedStatuses.has(status)) {
      throw new Error("El estado de la postulación no es válido.");
    }

    const applications = readApplications();
    const index = applications.findIndex((application) => application.id === applicationId);

    if (index < 0) {
      throw new Error("No se encontró la postulación solicitada.");
    }

    applications[index] = {
      ...applications[index],
      status,
    };

    writeApplications(applications);
    notify(applications);
    return clone(applications[index]);
  },

  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
});
