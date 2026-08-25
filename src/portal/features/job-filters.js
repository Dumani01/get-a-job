export function createJobFiltersStub() {
  const section = document.createElement("section");
  section.className = "jc-portal-job-filters";

  const heading = document.createElement("h2");
  heading.className = "jc-portal-job-filters-title";
  heading.textContent = "Filtros de empleo";

  const message = document.createElement("p");
  message.className = "jc-portal-job-filters-message";
  message.textContent = "Los filtros combinables se implementarán en la Fase 2.";

  section.append(heading, message);
  return section;
}
