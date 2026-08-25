export function createPortalConfirmDialog({
  title = "Confirmar acción",
  message = "¿Deseas continuar?",
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  onConfirm = () => {},
} = {}) {
  const dialog = document.createElement("dialog");
  dialog.className = "jc-portal-confirm-dialog";

  const heading = document.createElement("h2");
  heading.className = "jc-portal-confirm-dialog-title";
  heading.textContent = title;

  const description = document.createElement("p");
  description.className = "jc-portal-confirm-dialog-message";
  description.textContent = message;

  const actions = document.createElement("div");
  actions.className = "jc-portal-confirm-dialog-actions";

  const cancelButton = document.createElement("button");
  cancelButton.className = "jc-portal-confirm-dialog-cancel";
  cancelButton.type = "button";
  cancelButton.textContent = cancelLabel;

  const confirmButton = document.createElement("button");
  confirmButton.className = "jc-portal-confirm-dialog-confirm";
  confirmButton.type = "button";
  confirmButton.textContent = confirmLabel;

  cancelButton.addEventListener("click", () => dialog.close("cancel"));
  confirmButton.addEventListener("click", () => {
    onConfirm();
    dialog.close("confirm");
  });

  actions.append(cancelButton, confirmButton);
  dialog.append(heading, description, actions);

  return dialog;
}
