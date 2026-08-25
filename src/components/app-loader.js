import { APP_NAME } from "../config/app.config.js";

export function createAppLoader() {
  const element = document.createElement("div");
  const card = document.createElement("div");
  const border = document.createElement("span");
  const content = document.createElement("div");
  const loaderHead = document.createElement("div");
  const loaderLabel = document.createElement("strong");
  const loaderRegion = document.createElement("span");
  const lockup = document.createElement("div");
  const logo = document.createElement("img");
  const wordmark = document.createElement("strong");
  const submark = document.createElement("span");
  const bottomText = document.createElement("span");
  const segments = document.createElement("div");
  const status = document.createElement("span");
  let progressTimer = 0;

  element.className = "jc-loader";
  element.setAttribute("role", "status");
  element.setAttribute("aria-live", "polite");
  card.className = "jc-loader__card";
  border.className = "jc-loader__border";
  border.setAttribute("aria-hidden", "true");
  content.className = "jc-loader__content";
  loaderHead.className = "jc-loader__head";
  loaderLabel.className = "jc-loader__label";
  loaderLabel.textContent = "LOADING";
  loaderRegion.className = "jc-loader__region";
  loaderRegion.textContent = "REGION 02 / OVERWORLD";
  lockup.className = "jc-loader__lockup";
  logo.className = "jc-loader__logo";
  logo.src = "/src/assets/logo-horizontal.jpeg";
  logo.alt = "";
  logo.width = 260;
  logo.height = 75;
  wordmark.className = "jc-loader__wordmark";
  wordmark.textContent = APP_NAME;
  submark.className = "jc-loader__submark";
  submark.textContent = "RECRUITMENT WORKSPACE";
  bottomText.className = "jc-loader__bottom-text";
  bottomText.textContent = "talento que conecta";
  segments.className = "jc-loader__segments";
  for (let index = 0; index < 10; index += 1) {
    const segment = document.createElement("span");
    segment.className = "jc-loader__segment is-filled";
    segment.style.setProperty("--jc-segment-delay", `${index * 55}ms`);
    segments.append(segment);
  }
  status.className = "jc-visually-hidden";
  status.textContent = "Cargando JobConnect";

  wordmark.hidden = true;
  lockup.append(logo, wordmark);
  loaderHead.append(loaderLabel, loaderRegion);
  content.append(loaderHead, lockup, submark, segments);
  card.append(border, content, bottomText);
  element.append(card, status);

  function show(parent = document.body) {
    parent.append(element);
    window.requestAnimationFrame(() => card.classList.add("is-active"));
    progressTimer = window.setInterval(() => {
      const completed = [...segments.children].filter((segment) => segment.getAnimations().some((animation) => animation.playState === "finished")).length;
      if (completed >= segments.children.length) window.clearInterval(progressTimer);
    }, 120);
  }

  function hide() {
    window.clearInterval(progressTimer);
    element.classList.add("is-leaving");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(() => element.remove(), reducedMotion ? 0 : 320);
  }

  return Object.freeze({ element, show, hide });
}

export default createAppLoader;
