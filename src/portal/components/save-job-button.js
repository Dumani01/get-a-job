export function createSaveJobButton({ saved = false, onToggle = () => {} } = {}) {
  const button = document.createElement("button");
  button.className = "jc-portal-save-job-button";
  button.type = "button";
  button.setAttribute("aria-pressed", String(saved));
  button.setAttribute("aria-label", saved ? "Quitar oferta de guardados" : "Guardar oferta");
  button.title = saved ? "Quitar de guardados" : "Guardar oferta";
  button.textContent = saved ? "Guardado" : "Guardar";

  button.addEventListener("click", () => onToggle());

  return button;
}
