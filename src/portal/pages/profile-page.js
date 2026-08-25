export function createProfilePage() {
  const section = document.createElement("section");
  section.className = "jc-portal-page";

  const heading = document.createElement("h1");
  heading.className = "jc-portal-page-title";
  heading.textContent = "Perfil profesional";

  const message = document.createElement("p");
  message.className = "jc-portal-page-message";
  message.textContent = "El perfil del candidato se implementará en la Fase 3.";

  section.append(heading, message);
  return section;
}
