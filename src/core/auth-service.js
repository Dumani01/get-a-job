import apiClient from "./api-client.js";
import {
  clearSession,
  getAccessToken,
  setAccessToken,
  setAuthUser,
  setRefreshToken,
} from "./session-store.js";

function toPublicUser(user) {
  if (!user) {
    return null;
  }

  const { id, username, email, firstName, lastName, image } = user;
  return { id, username, email, firstName, lastName, image };
}

function assertAuthenticationResponse(response) {
  const accessToken = response?.accessToken ?? response?.token;

  if (!accessToken) {
    throw new Error("El servicio de autenticación no devolvió un token válido.");
  }

  return accessToken;
}

export async function login({ username, password }) {
  try {
    const response = await apiClient.request("/auth/login", {
      method: "POST",
      body: { username, password, expiresInMins: 30 },
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
    return await apiClient.request("/users/add", {
      method: "POST",
      body: payload,
    });
  } finally {
    if (payload && Object.hasOwn(payload, "password")) {
      payload.password = "";
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

export default {
  login,
  register,
  validateSession,
  logout,
  hasSession,
};
