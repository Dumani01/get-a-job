export function createApplicationModal() {
  const dialog = document.createElement("dialog");
  dialog.className = "jc-portal-application-modal";

  const heading = document.createElement("h2");
  heading.className = "jc-portal-application-modal-title";
  heading.textContent = "Postulación";

  const message = document.createElement("p");
  message.className = "jc-portal-application-modal-message";
  message.textContent = "El formulario de postulación se habilitará en la Fase 3.";

  dialog.append(heading, message);
  return dialog;
}
