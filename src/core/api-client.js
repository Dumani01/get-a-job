import { API_BASE_URL, DEFAULT_REQUEST_TIMEOUT } from "../config/api.config.js";
import { getAccessToken } from "./session-store.js";

export class ApiError extends Error {
  constructor(message, { status = 0, data = null } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

async function parseResponse(response) {
  const contentType = response.headers.get("content-type") ?? "";

  if (response.status === 204) {
    return null;
  }

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return text || null;
}

export async function request(path, options = {}) {
  const {
    method = "GET",
    body,
    headers = {},
    signal,
    timeout = DEFAULT_REQUEST_TIMEOUT,
  } = options;
  const accessToken = getAccessToken();
  const requestHeaders = new Headers(headers);
  const controller = new AbortController();
  const timeoutId = globalThis.setTimeout(() => controller.abort(), timeout);

  if (accessToken) {
    requestHeaders.set("Authorization", `Bearer ${accessToken}`);
  }

  if (body !== undefined && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  const abortRequest = () => controller.abort();
  signal?.addEventListener("abort", abortRequest, { once: true });

  try {
    const response = await fetch(new URL(path, API_BASE_URL), {
      method,
      headers: requestHeaders,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });
    const data = await parseResponse(response);

    if (!response.ok) {
      throw new ApiError(data?.message ?? `La solicitud falló con estado ${response.status}.`, {
        status: response.status,
        data,
      });
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    const message = error.name === "AbortError" ? "La solicitud tardó demasiado o fue cancelada." : "No fue posible conectar con el servicio.";
    throw new ApiError(message, { data: { cause: error.message } });
  } finally {
    globalThis.clearTimeout(timeoutId);
    signal?.removeEventListener("abort", abortRequest);
  }
}

export const apiClient = Object.freeze({ request });

export default apiClient;

