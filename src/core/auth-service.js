import apiClient from "./api-client.js";
import {
  clearSession,
  getAccessToken,
  setAccessToken,
  setAuthUser,
  setRefreshToken,
} from "./session-store.js";
import { STORAGE_KEYS } from "../config/app.config.js";
import { normalizeRole, ROLES } from "../config/roles.config.js";

const DEMO_PIN = "2026";
const DEMO_USERNAME = "emilys";
const DEMO_PASSWORD = "emilyspass";
const DEMO_ACCOUNTS = Object.freeze({
  candidato: { password: "Job2026", role: ROLES.client, firstName: "Candidato", lastName: "JobConnect" },
  emilys: { password: DEMO_PASSWORD, role: ROLES.client, firstName: "Emily", lastName: "Johnson" },
  empresa: { password: "Hire2026", role: ROLES.employer, firstName: "Empresa", lastName: "demostrativa" },
});

async function digest(value) {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function getLocalAccounts() {
  try {
    const accounts = JSON.parse(localStorage.getItem(STORAGE_KEYS.localAccounts) ?? "[]");
    return Array.isArray(accounts) ? accounts : [];
  } catch {
    localStorage.removeItem(STORAGE_KEYS.localAccounts);
    return [];
  }
}

function saveLocalAccount(account) {
  const accounts = getLocalAccounts().filter(({ username }) => username !== account.username);
  localStorage.setItem(STORAGE_KEYS.localAccounts, JSON.stringify([...accounts, account]));
}

function startLocalSession(account) {
  const user = toPublicUser(account);
  setAccessToken(`local-${crypto.randomUUID()}`);
  setRefreshToken(null);
  setAuthUser(user);
  return user;
}

function toPublicUser(user) {
  if (!user) {
    return null;
  }

  const { id, username, email, firstName, lastName, image, role } = user;
  return { id, username, email, firstName, lastName, image, role: normalizeRole(role) };
}

function assertAuthenticationResponse(response) {
  const accessToken = response?.accessToken ?? response?.token;

  if (!accessToken) {
    throw new Error("El servicio de autenticación no devolvió un token válido.");
  }

  return accessToken;
}

export async function login({ username, password = "", pin = "" }) {
  const normalizedUsername = String(username).trim();
  const demoAccount = DEMO_ACCOUNTS[normalizedUsername];
  if (demoAccount && (password === demoAccount.password || pin === demoAccount.password || (normalizedUsername === DEMO_USERNAME && pin === DEMO_PIN))) {
    return startLocalSession({ id: `demo-${normalizedUsername}`, username: normalizedUsername, role: demoAccount.role, firstName: demoAccount.firstName, lastName: demoAccount.lastName });
  }
  const localAccount = getLocalAccounts().find((account) => account.username === normalizedUsername);

  if (localAccount) {
    const credentialHash = await digest(pin || password);
    const expectedHash = pin ? localAccount.pinHash : localAccount.passwordHash;
    if (credentialHash !== expectedHash) {
      const error = new Error("El PIN o la contrasena no son validos.");
      error.status = 401;
      throw error;
    }
    return startLocalSession(localAccount);
  }

  if (pin) {
    if (normalizedUsername !== DEMO_USERNAME || pin !== DEMO_PIN) {
      const error = new Error("El PIN no es valido para este usuario.");
      error.status = 401;
      throw error;
    }
    password = DEMO_PASSWORD;
  }

  try {
    const response = await apiClient.request("/auth/login", {
      method: "POST",
      body: { username: normalizedUsername, password, expiresInMins: 30 },
    });

    setAccessToken(assertAuthenticationResponse(response));
    setRefreshToken(response.refreshToken ?? null);
    setAuthUser(toPublicUser(response));
    return toPublicUser(response);
  } finally {
    password = "";
  }
}

export async function register(payload) {
  try {
    const { pin, ...registration } = payload;
    const response = await apiClient.request("/users/add", {
      method: "POST",
      body: registration,
    });
    saveLocalAccount({
      ...toPublicUser({ ...response, ...registration }),
      role: normalizeRole(registration.role),
      username: String(registration.username).trim(),
      passwordHash: await digest(registration.password),
      pinHash: await digest(pin),
    });
    return response;
  } finally {
    if (payload && Object.hasOwn(payload, "password")) {
      payload.password = "";
    }
    if (payload && Object.hasOwn(payload, "pin")) {
      payload.pin = "";
    }
  }
}

export async function validateSession() {
  if (!getAccessToken()) {
    return null;
  }

  try {
    const user = await apiClient.request("/auth/me");
    const publicUser = toPublicUser(user);
    setAuthUser(publicUser);
    return publicUser;
  } catch (error) {
    clearSession();
    throw error;
  }
}

export function logout() {
  clearSession();
}

export function hasSession() {
  return Boolean(getAccessToken());
}

export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.authUser) ?? "null");
  } catch {
    return null;
  }
}

export function getEntryRoute(user = getCurrentUser()) {
  return !user || user.role === ROLES.client ? "portal" : "dashboard";
}

export default {
  login,
  register,
  validateSession,
  logout,
  hasSession,
};
