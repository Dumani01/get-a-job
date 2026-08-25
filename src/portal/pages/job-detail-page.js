export function createJobDetailPage() {
  const section = document.createElement("section");
  section.className = "jc-portal-page";

  const heading = document.createElement("h1");
  heading.className = "jc-portal-page-title";
  heading.textContent = "Detalle de empleo";

  const message = document.createElement("p");
  message.className = "jc-portal-page-message";
  message.textContent = "El detalle de la oferta se implementará en la Fase 2.";

  section.append(heading, message);
  return section;
}
