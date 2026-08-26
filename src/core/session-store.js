import { STORAGE_KEYS } from "../config/app.config.js";

const moduleRecords = new Map();
const listeners = new Set();

function readJson(key, fallback = null) {
  const value = localStorage.getItem(key);

  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value);
  } catch {
    localStorage.removeItem(key);
    return fallback;
  }
}

function writeJson(key, value) {
  if (value === null || value === undefined) {
    localStorage.removeItem(key);
    return;
  }

  localStorage.setItem(key, JSON.stringify(value));
}

function emit(type, detail = {}) {
  const change = Object.freeze({ type, ...detail });
  listeners.forEach((listener) => listener(change));
}

export function getAccessToken() {
  return localStorage.getItem(STORAGE_KEYS.accessToken);
}

export function setAccessToken(token) {
  if (token) {
    localStorage.setItem(STORAGE_KEYS.accessToken, token);
  } else {
    localStorage.removeItem(STORAGE_KEYS.accessToken);
  }
  emit("auth:token");
}

export function getRefreshToken() {
  return localStorage.getItem(STORAGE_KEYS.refreshToken);
}

export function setRefreshToken(token) {
  if (token) {
    localStorage.setItem(STORAGE_KEYS.refreshToken, token);
  } else {
    localStorage.removeItem(STORAGE_KEYS.refreshToken);
  }
}

export function getAuthUser() {
  return readJson(STORAGE_KEYS.authUser);
}

export function setAuthUser(user) {
  writeJson(STORAGE_KEYS.authUser, user);
  emit("auth:user", { user });
}

export function getUiState() {
  return readJson(STORAGE_KEYS.uiState, {});
}

export function setUiState(nextState) {
  const currentState = getUiState();
  const value = typeof nextState === "function" ? nextState(currentState) : nextState;
  writeJson(STORAGE_KEYS.uiState, { ...currentState, ...value });
  emit("ui:change", { state: getUiState() });
}

export function getModuleRecords(moduleKey) {
  return [...(moduleRecords.get(moduleKey) ?? [])];
}

export function setModuleRecords(moduleKey, records) {
  moduleRecords.set(moduleKey, [...records]);
  emit("records:change", { moduleKey, records: getModuleRecords(moduleKey) });
  return getModuleRecords(moduleKey);
}

export function addModuleRecord(moduleKey, record) {
  return setModuleRecords(moduleKey, [record, ...getModuleRecords(moduleKey)]);
}

export function updateModuleRecord(moduleKey, recordId, changes) {
  const records = getModuleRecords(moduleKey).map((record) =>
    String(record.id) === String(recordId) ? { ...record, ...changes } : record,
  );
  return setModuleRecords(moduleKey, records);
}

export function removeModuleRecord(moduleKey, recordId) {
  const records = getModuleRecords(moduleKey).filter((record) => String(record.id) !== String(recordId));
  return setModuleRecords(moduleKey, records);
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function clearSession() {
  [STORAGE_KEYS.accessToken, STORAGE_KEYS.refreshToken, STORAGE_KEYS.authUser, STORAGE_KEYS.uiState]
    .forEach((key) => localStorage.removeItem(key));
  moduleRecords.clear();
  emit("session:clear");
}

export default {
  getAccessToken,
  setAccessToken,
  getRefreshToken,
  setRefreshToken,
  getAuthUser,
  setAuthUser,
  getUiState,
  setUiState,
  getModuleRecords,
  setModuleRecords,
  addModuleRecord,
  updateModuleRecord,
  removeModuleRecord,
  subscribe,
  clearSession,
};

