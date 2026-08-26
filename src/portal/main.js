import { createPortalApp } from "./app.js";
import { applyPreferences } from "../core/preferences.js";

const portalRoot = document.querySelector("#portal-app");

if (!portalRoot) {
  throw new Error("No se encontró #portal-app.");
}

applyPreferences();
createPortalApp(portalRoot);
