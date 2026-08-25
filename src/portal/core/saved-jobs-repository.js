import { PORTAL_EVENTS, PORTAL_STORAGE_KEYS } from "../config/portal.config.js";

const listeners = new Set();

function clone(value) {
  return typeof structuredClone === "function"
    ? structuredClone(value)
    : JSON.parse(JSON.stringify(value));
}

function readEntries() {
  const rawValue = window.localStorage.getItem(PORTAL_STORAGE_KEYS.savedJobs);

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

function writeEntries(entries) {
  window.localStorage.setItem(PORTAL_STORAGE_KEYS.savedJobs, JSON.stringify(entries));
}

function notify(entries) {
  const snapshot = clone(entries);
  listeners.forEach((listener) => listener(clone(snapshot)));
  window.dispatchEvent(new CustomEvent(PORTAL_EVENTS.savedChange, { detail: { savedJobs: snapshot } }));
}

export const savedJobsRepository = Object.freeze({
  list(candidateId) {
    return clone(readEntries().filter((entry) => entry.candidateId === candidateId));
  },

  has(candidateId, jobId) {
    return readEntries().some((entry) => entry.candidateId === candidateId && entry.jobId === jobId);
  },

  toggle(candidateId, jobId) {
    const entries = readEntries();
    const index = entries.findIndex(
      (entry) => entry.candidateId === candidateId && entry.jobId === jobId,
    );

    let saved;

    if (index >= 0) {
      entries.splice(index, 1);
      saved = false;
    } else {
      entries.push({ candidateId, jobId });
      saved = true;
    }

    writeEntries(entries);
    notify(entries);

    return clone({ candidateId, jobId, saved });
  },

  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
});
