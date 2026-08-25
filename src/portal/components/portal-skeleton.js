export function createPortalSkeleton({ label = "Cargando contenido" } = {}) {
  const skeleton = document.createElement("div");
  skeleton.className = "jc-portal-skeleton";
  skeleton.setAttribute("role", "status");
  skeleton.setAttribute("aria-label", label);

  const line = document.createElement("span");
  line.className = "jc-portal-skeleton-line";
  line.setAttribute("aria-hidden", "true");

  skeleton.append(line);
  return skeleton;
}
