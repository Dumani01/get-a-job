export function createDeleteJobButton({ onRequestDelete = () => {} } = {}) {
  const button = document.createElement("button");
  button.className = "jc-portal-delete-job-button";
  button.type = "button";
  button.setAttribute("aria-label", "Solicitar eliminación de la oferta");
  button.title = "Eliminar oferta";
  button.textContent = "Eliminar";
  button.addEventListener("click", () => onRequestDelete());
  return button;
}
