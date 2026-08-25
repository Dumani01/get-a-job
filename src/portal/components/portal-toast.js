export function createPortalToast({ message = "", type = "success" } = {}) {
  const toast = document.createElement("div");
  toast.className = `jc-portal-toast jc-portal-toast-${type}`;
  toast.setAttribute("role", type === "error" ? "alert" : "status");
  toast.setAttribute("aria-live", type === "error" ? "assertive" : "polite");
  toast.textContent = message;
  return toast;
}
