import { PORTAL_EVENTS, PORTAL_STORAGE_KEYS } from "../config/portal.config.js";
import { getCurrentUser } from "../../core/auth-service.js";

function clone(value) {
  if (value === null || value === undefined) {
    return value;
  }

  return typeof structuredClone === "function"
    ? structuredClone(value)
    : JSON.parse(JSON.stringify(value));
}

function readSession() {
  const rawValue = window.localStorage.getItem(PORTAL_STORAGE_KEYS.session);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue);
  } catch {
    window.localStorage.removeItem(PORTAL_STORAGE_KEYS.session);
    return null;
  }
}

function notify(session) {
  window.dispatchEvent(
    new CustomEvent(PORTAL_EVENTS.sessionChange, {
      detail: { session: clone(session) },
    }),
  );
}

export const portalSession = Object.freeze({
  get() {
    return clone(readSession() ?? getCurrentUser());
  },

  set(session) {
    const safeSession = clone(session);
    window.localStorage.setItem(PORTAL_STORAGE_KEYS.session, JSON.stringify(safeSession));
    notify(safeSession);
    return clone(safeSession);
  },

  clear() {
    window.localStorage.removeItem(PORTAL_STORAGE_KEYS.session);
    notify(null);
    return null;
  },

  hasRole(role) {
    return readSession()?.role === role;
  },
});
