export function createEmployerJobsPage() {
  const section = document.createElement("section");
  section.className = "jc-portal-page";

  const heading = document.createElement("h1");
  heading.className = "jc-portal-page-title";
  heading.textContent = "Ofertas de empresa";

  const message = document.createElement("p");
  message.className = "jc-portal-page-message";
  message.textContent = "La administración de vacantes se implementará en la Fase 4.";

  section.append(heading, message);
  return section;
}
