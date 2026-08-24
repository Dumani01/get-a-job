function getFocusableElements(container) {
  return [...container.querySelectorAll("button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex='-1'])")];
}

export function createConfirmDialog() {
  const dialog = document.createElement("dialog");
  const panel = document.createElement("div");
  const title = document.createElement("h2");
  const message = document.createElement("p");
  const actions = document.createElement("div");
  const cancelButton = document.createElement("button");
  const confirmButton = document.createElement("button");
  let resolveConfirmation = null;
  let lastFocusedElement = null;

  dialog.className = "jc-modal jc-confirm-dialog";
  panel.className = "jc-modal__panel";
  title.id = "confirm-dialog-title";
  message.id = "confirm-dialog-message";
  actions.className = "jc-modal__actions";
  cancelButton.className = "jc-btn jc-btn--secondary";
  cancelButton.type = "button";
  cancelButton.dataset.action = "cancel";
  cancelButton.textContent = "Cancelar";
  confirmButton.className = "jc-btn jc-btn--danger";
  confirmButton.type = "button";
  confirmButton.dataset.action = "delete";
  confirmButton.textContent = "Eliminar";
  dialog.setAttribute("aria-labelledby", title.id);
  dialog.setAttribute("aria-describedby", message.id);

  function finish(result) {
    if (!dialog.open) {
      return;
    }
    dialog.close();
    resolveConfirmation?.(result);
    resolveConfirmation = null;
    lastFocusedElement?.focus();
  }

  function handleKeydown(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      finish(false);
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    const focusableElements = getFocusableElements(dialog);
    const first = focusableElements[0];
    const last = focusableElements.at(-1);

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  cancelButton.addEventListener("click", () => finish(false));
  confirmButton.addEventListener("click", () => finish(true));
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    finish(false);
  });
  dialog.addEventListener("keydown", handleKeydown);
  panel.append(title, message, actions);
  actions.append(cancelButton, confirmButton);
  dialog.append(panel);

  function open({
    title: nextTitle = "Confirmar eliminación",
    message: nextMessage = "Esta acción no se puede deshacer.",
  } = {}) {
    if (!dialog.isConnected) {
      document.body.append(dialog);
    }
    lastFocusedElement = document.activeElement;
    title.textContent = nextTitle;
    message.textContent = nextMessage;
    dialog.showModal();
    cancelButton.focus();
    return new Promise((resolve) => {
      resolveConfirmation = resolve;
    });
  }

  function destroy() {
    if (dialog.open) {
      finish(false);
    }
    dialog.remove();
  }

  return Object.freeze({ element: dialog, open, destroy });
}

export default createConfirmDialog;

