let toastRegion = null;
const activeTimers = new WeakMap();

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
  const text = document.createElement("p");
  const closeButton = document.createElement("button");

  element.className = `jc-toast jc-toast--${type}`;
  element.setAttribute("role", type === "danger" ? "alert" : "status");
  text.textContent = String(message);
  closeButton.className = "jc-btn jc-btn--icon";
  closeButton.type = "button";
  closeButton.setAttribute("aria-label", "Cerrar notificación");
  closeButton.title = "Cerrar notificación";
  closeButton.textContent = "×";
  closeButton.addEventListener("click", () => dismissToast(element));
  element.append(text, closeButton);
  region.append(element);

  const timer = window.setTimeout(() => dismissToast(element), duration);
  activeTimers.set(element, timer);
  return element;
}

export const toast = Object.freeze({ show: showToast, dismiss: dismissToast });

export default toast;

