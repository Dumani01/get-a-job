import { createApp } from "./app.js";

function showStartupError(rootElement, error) {
  const message = document.createElement("p");
  message.className = "jc-state jc-state--error";
  message.setAttribute("role", "alert");
  message.textContent = `JobConnect no pudo iniciar: ${error.message}`;
  rootElement.replaceChildren(message);
}

function start() {
  const rootElement = document.querySelector("#app");

  if (!rootElement) {
    throw new Error("No existe el contenedor #app.");
  }

  try {
    const app = createApp(rootElement);
    app.start();
  } catch (error) {
    showStartupError(rootElement, error);
    console.error(error);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start, { once: true });
} else {
  start();
}

