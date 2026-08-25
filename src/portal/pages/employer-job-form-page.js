export function createEmployerJobFormPage({ mode = "create" } = {}) {
  const section = document.createElement("section");
  section.className = "jc-portal-page jc-portal-employer-form-page";

  const heading = document.createElement("h1");
  heading.className = "jc-portal-page-title";
  heading.textContent = mode === "edit" ? "Editar oferta" : "Publicar oferta";

  const message = document.createElement("p");
  message.className = "jc-portal-page-message";
  message.textContent = "El formulario empresarial se implementará en la Fase 4.";

  section.append(heading, message);
  return section;
}
