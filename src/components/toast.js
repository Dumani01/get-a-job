let toastRegion = null;
const activeTimers = new WeakMap();

const TOAST_DETAILS = Object.freeze({
  success: Object.freeze({
    kicker: "LOGRO DESBLOQUEADO",
    title: "Operacion completada",
    icon: "M20 6 9 17l-5-5",
  }),
  warning: Object.freeze({
    kicker: "ATENCION REQUERIDA",
    title: "Revisa este aviso",
    icon: "M12 9v4m0 4h.01M10.29 3.86 2.82 17a2 2 0 0 0 1.74 3h14.88a2 2 0 0 0 1.74-3L13.71 3.86a2 2 0 0 0-3.42 0Z",
  }),
  danger: Object.freeze({
    kicker: "ERROR DE SISTEMA",
    title: "No se pudo completar",
    icon: "m15 9-6 6m0-6 6 6M12 2l8.66 5v10L12 22l-8.66-5V7L12 2Z",
  }),
  info: Object.freeze({
    kicker: "NUEVA NOTIFICACION",
    title: "Actualizacion disponible",
    icon: "M12 16v-4m0-4h.01M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z",
  }),
});

function createToastIcon(pathData) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  path.setAttribute("d", pathData);
  svg.append(path);
  return svg;
}

export function createToastRegion() {
  if (toastRegion?.isConnected) {
    return toastRegion;
  }

  toastRegion = document.createElement("div");
  toastRegion.className = "jc-toast-region";
  toastRegion.setAttribute("aria-live", "polite");
  toastRegion.setAttribute("aria-atomic", "false");
  document.body.append(toastRegion);
  return toastRegion;
}

export function dismissToast(element) {
  const timer = activeTimers.get(element);
  if (timer) {
    window.clearTimeout(timer);
  }
  activeTimers.delete(element);
  element.remove();
}

export function showToast(message, { type = "info", duration = 4000 } = {}) {
  const region = createToastRegion();
  const element = document.createElement("div");
  const sticker = document.createElement("div");
  const body = document.createElement("div");
  const kicker = document.createElement("p");
  const title = document.createElement("h4");
  const text = document.createElement("p");
  const closeButton = document.createElement("button");
  const progress = document.createElement("div");
  const details = TOAST_DETAILS[type] ?? TOAST_DETAILS.info;
  const safeDuration = Number.isFinite(duration) ? Math.max(1, duration) : 4000;

  element.className = `jc-toast jc-toast--${type}`;
  element.setAttribute("role", type === "danger" ? "alert" : "status");
  element.style.setProperty("--jc-toast-duration", `${safeDuration}ms`);
  sticker.className = "jc-toast__sticker";
  sticker.setAttribute("aria-hidden", "true");
  sticker.append(createToastIcon(details.icon));
  body.className = "jc-toast__body";
  kicker.className = "jc-toast__kicker";
  kicker.textContent = details.kicker;
  title.className = "jc-toast__title";
  title.textContent = details.title;
  text.className = "jc-toast__copy";
  text.textContent = String(message);
  closeButton.className = "jc-toast__close";
  closeButton.type = "button";
  closeButton.setAttribute("aria-label", "Cerrar notificacion");
  closeButton.title = "Cerrar notificacion";
  closeButton.textContent = "×";
  closeButton.addEventListener("click", () => dismissToast(element));
  progress.className = "jc-toast__progress";
  progress.setAttribute("aria-hidden", "true");
  body.append(kicker, title, text);
  element.append(sticker, body, closeButton, progress);
  region.append(element);

  const timer = window.setTimeout(() => dismissToast(element), safeDuration);
  activeTimers.set(element, timer);
  return element;
}

export const toast = Object.freeze({ show: showToast, dismiss: dismissToast });

export default toast;
