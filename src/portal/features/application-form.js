export function createApplicationFormStub() {
  const section = document.createElement("section");
  section.className = "jc-portal-application-form";

  const heading = document.createElement("h2");
  heading.className = "jc-portal-application-form-title";
  heading.textContent = "Formulario de postulación";

  const message = document.createElement("p");
  message.className = "jc-portal-application-form-message";
  message.textContent = "La postulación se implementará en la Fase 3.";

  section.append(heading, message);
  return section;
}
