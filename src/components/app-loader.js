import { APP_NAME } from "../config/app.config.js";

export function createAppLoader() {
  const element = document.createElement("div");
  const card = document.createElement("div");
  const border = document.createElement("span");
  const content = document.createElement("div");
  const lockup = document.createElement("div");
  const logo = document.createElement("img");
  const wordmark = document.createElement("strong");
  const submark = document.createElement("span");
  const bottomText = document.createElement("span");
  const status = document.createElement("span");

  element.className = "jc-loader";
  element.setAttribute("role", "status");
  element.setAttribute("aria-live", "polite");
  card.className = "jc-loader__card";
  border.className = "jc-loader__border";
  border.setAttribute("aria-hidden", "true");
  content.className = "jc-loader__content";
  lockup.className = "jc-loader__lockup";
  logo.className = "jc-loader__logo";
  logo.src = "/src/assets/jobconnect-logo.svg";
  logo.alt = "";
  logo.width = 52;
  logo.height = 52;
  wordmark.className = "jc-loader__wordmark";
  wordmark.textContent = APP_NAME;
  submark.className = "jc-loader__submark";
  submark.textContent = "Recruitment workspace";
  bottomText.className = "jc-loader__bottom-text";
  bottomText.textContent = "talento que conecta";
  status.className = "jc-visually-hidden";
  status.textContent = "Cargando JobConnect";

  lockup.append(logo, wordmark);
  content.append(lockup, submark);
  card.append(border, content, bottomText);
  element.append(card, status);

  function show(parent = document.body) {
    parent.append(element);
    window.requestAnimationFrame(() => card.classList.add("is-active"));
  }

  function hide() {
    element.classList.add("is-leaving");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(() => element.remove(), reducedMotion ? 0 : 320);
  }

  return Object.freeze({ element, show, hide });
}

export default createAppLoader;
