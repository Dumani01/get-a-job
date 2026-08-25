export function createPortalLoader(message = "Cargando JobConnect") {
  const container = document.createElement("div");
  container.className = "jc-portal-loader";
  container.setAttribute("role", "status");
  container.setAttribute("aria-live", "polite");

  const label = document.createElement("span");
  label.className = "jc-portal-loader-label";
  label.textContent = message;

  container.append(label);
  return container;
}
