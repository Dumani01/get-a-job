export function createPortalEmptyState({
  title = "No encontramos resultados",
  message = "Ajusta los filtros e inténtalo nuevamente.",
} = {}) {
  const section = document.createElement("section");
  section.className = "jc-portal-empty-state";

  const heading = document.createElement("h2");
  heading.className = "jc-portal-empty-state-title";
  heading.textContent = title;

  const description = document.createElement("p");
  description.className = "jc-portal-empty-state-message";
  description.textContent = message;

  section.append(heading, description);
  return section;
}
