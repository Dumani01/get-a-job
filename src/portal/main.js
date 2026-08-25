import { createPortalApp } from "./app.js";

const portalRoot = document.querySelector("#portal-app");

if (!portalRoot) {
  throw new Error("No se encontró #portal-app.");
}

createPortalApp(portalRoot);
