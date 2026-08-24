import { APP_NAME } from "../config/app.config.js";

export function createAppLoader() {
  const element = document.createElement("div");
  const logo = document.createElement("img");
  const name = document.createElement("strong");
  const status = document.createElement("span");

  element.className = "jc-loader";
  element.setAttribute("role", "status");
  element.setAttribute("aria-live", "polite");
  logo.src = "/src/assets/jobconnect-logo.svg";
  logo.alt = "";
  logo.width = 72;
  logo.height = 72;
  name.textContent = APP_NAME;
  status.className = "jc-visually-hidden";
  status.textContent = "Cargando JobConnect";
  element.append(logo, name, status);

  function show(parent = document.body) {
    parent.append(element);
  }

  function hide() {
    element.classList.add("is-leaving");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(() => element.remove(), reducedMotion ? 0 : 260);
  }

  return Object.freeze({ element, show, hide });
}

export default createAppLoader;

