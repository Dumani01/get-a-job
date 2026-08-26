import { createApp } from "./app.js";
import { createAppLoader } from "./components/app-loader.js";
import { showToast } from "./components/toast.js";
import { getEntryRoute, getCurrentUser, hasSession, validateSession } from "./core/auth-service.js";
import { applyPreferences } from "./core/preferences.js";

const MINIMUM_LOADER_TIME = 1200;

function showStartupError(rootElement, error) {
  const message = document.createElement("p");
  message.className = "jc-state jc-state--error";
  message.setAttribute("role", "alert");
  message.textContent = `JobConnect no pudo iniciar: ${error.message}`;
  rootElement.replaceChildren(message);
}

function wait(milliseconds) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

async function start() {
  const rootElement = document.querySelector("#app");

  if (!rootElement) {
    throw new Error("No existe el contenedor #app.");
  }

  const loader = createAppLoader();
  const startTime = performance.now();
  loader.show(document.body);
  applyPreferences();

  try {
    if (hasSession()) {
      try {
        await validateSession();
      } catch {
        showToast("La sesión anterior venció. Inicia sesión nuevamente.", { type: "warning" });
      }
    }

    if (!hasSession() && !window.location.hash) {
      window.location.href = "/portal.html#/inicio";
      return;
    }

    if (window.location.hash === "#/login" && hasSession() && getEntryRoute(getCurrentUser()) === "portal") {
      window.location.href = "/portal.html#/inicio";
      return;
    }

    const app = createApp(rootElement);
    app.start();
    const elapsedTime = performance.now() - startTime;
    await wait(Math.max(0, MINIMUM_LOADER_TIME - elapsedTime));
    loader.hide();
  } catch (error) {
    loader.hide();
    showStartupError(rootElement, error);
    console.error(error);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => void start(), { once: true });
} else {
  void start();
}
