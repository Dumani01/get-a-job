import { validateForm } from "../core/validators.js";

function getFocusableElements(container) {
  return [...container.querySelectorAll("button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])")];
}

function createFieldControl(field, value) {
  let control;

  if (field.type === "textarea") {
    control = document.createElement("textarea");
    control.rows = field.rows ?? 4;
  } else if (field.type === "select") {
    control = document.createElement("select");
    (field.options ?? []).forEach((option) => {
      const optionElement = document.createElement("option");
      const optionValue = typeof option === "object" ? option.value : option;
      optionElement.value = String(optionValue);
      optionElement.textContent = typeof option === "object" ? option.label : String(option);
      control.append(optionElement);
    });
  } else {
    control = document.createElement("input");
    control.type = field.type ?? "text";
  }

  control.className = field.type === "checkbox" ? "jc-input jc-input--checkbox" : "jc-input";
  control.id = `field-${field.name}`;
  control.name = field.name;
  control.required = Boolean(field.required);
  control.disabled = Boolean(field.readonly);

  if (field.placeholder) control.placeholder = field.placeholder;
  if (field.min !== undefined) control.min = String(field.min);
  if (field.max !== undefined) control.max = String(field.max);
  if (field.minLength !== undefined) control.minLength = field.minLength;
  if (field.maxLength !== undefined) control.maxLength = field.maxLength;

  if (control.type === "checkbox") {
    control.checked = Boolean(value);
  } else {
    control.value = value ?? "";
  }
  return control;
}

function createSaveIcon() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  path.setAttribute("d", "M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z");
  svg.append(path);
  return svg;
}

export function createFormModal() {
  const dialog = document.createElement("dialog");
  const panel = document.createElement("div");
  const header = document.createElement("header");
  const headingGroup = document.createElement("div");
  const eyebrow = document.createElement("span");
  const title = document.createElement("h2");
  const closeButton = document.createElement("button");
  const form = document.createElement("form");
  const fieldsContainer = document.createElement("div");
  const generalError = document.createElement("p");
  const actions = document.createElement("div");
  const cancelButton = document.createElement("button");
  const saveButton = document.createElement("button");
  const saveIcon = createSaveIcon();
  const saveLabel = document.createElement("span");
  let activeFields = [];
  let submitHandler = null;
  let lastFocusedElement = null;

  dialog.className = "jc-modal jc-form-modal";
  panel.className = "jc-modal__panel";
  header.className = "jc-modal__header";
  headingGroup.className = "jc-modal__heading";
  eyebrow.className = "jc-modal__eyebrow";
  eyebrow.textContent = "GESTIÓN DE REGISTRO";
  title.id = "form-modal-title";
  closeButton.className = "jc-modal__close";
  closeButton.type = "button";
  closeButton.setAttribute("aria-label", "Cerrar formulario");
  closeButton.title = "Cerrar formulario";
  closeButton.textContent = "x";
  form.noValidate = true;
  fieldsContainer.className = "jc-form-grid";
  generalError.className = "jc-form-error";
  generalError.setAttribute("role", "alert");
  actions.className = "jc-modal__actions";
  cancelButton.className = "jc-btn jc-btn--secondary";
  cancelButton.type = "button";
  cancelButton.dataset.action = "cancel";
  cancelButton.textContent = "Cancelar";
  saveButton.className = "jc-btn jc-btn--primary jc-save-button";
  saveButton.type = "submit";
  saveButton.dataset.action = "save";
  saveIcon.classList.add("jc-save-button__icon");
  saveLabel.className = "jc-save-button__label";
  saveLabel.textContent = "Guardar";
  saveButton.append(saveIcon, saveLabel);
  dialog.setAttribute("aria-labelledby", title.id);

  function setBusy(isBusy) {
    saveButton.disabled = isBusy;
    cancelButton.disabled = isBusy;
    closeButton.disabled = isBusy;
    saveButton.classList.toggle("is-loading", isBusy);
    saveLabel.textContent = isBusy ? "Guardando..." : "Guardar";
  }

  function close() {
    if (dialog.open) dialog.close();
    form.reset();
    generalError.textContent = "";
    submitHandler = null;
    lastFocusedElement?.focus();
  }

  function getValues() {
    return activeFields.reduce((values, field) => {
      const control = form.elements.namedItem(field.name);
      values[field.name] = control?.type === "checkbox" ? control.checked : control?.value ?? "";
      return values;
    }, {});
  }

  function showErrors(errors) {
    activeFields.forEach((field) => {
      const control = form.elements.namedItem(field.name);
      const errorElement = form.querySelector(`[data-field-error="${field.name}"]`);
      const message = errors[field.name]?.[0] ?? "";
      control?.setAttribute("aria-invalid", String(Boolean(message)));
      if (errorElement) errorElement.textContent = message;
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    generalError.textContent = "";
    const values = getValues();
    const errors = validateForm(activeFields, values);
    showErrors(errors);
    if (Object.keys(errors).length > 0) {
      form.querySelector("[aria-invalid='true']")?.focus();
      return;
    }

    try {
      setBusy(true);
      await submitHandler?.(values);
      close();
    } catch (error) {
      generalError.textContent = error.message || "No se pudo guardar el registro.";
    } finally {
      setBusy(false);
    }
  }

  function handleKeydown(event) {
    if (event.key === "Escape" && !saveButton.disabled) {
      event.preventDefault();
      close();
      return;
    }
    if (event.key !== "Tab") return;
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

  function renderFields(fields, values) {
    fieldsContainer.replaceChildren();
    fields.forEach((field) => {
      const wrapper = document.createElement("div");
      const label = document.createElement("label");
      const control = createFieldControl(field, values[field.name]);
      const error = document.createElement("small");
      wrapper.className = "jc-field";
      if (field.type === "textarea") wrapper.classList.add("jc-field--wide");
      label.htmlFor = control.id;
      label.textContent = field.required ? `${field.label} *` : field.label;
      error.className = "jc-field__error";
      error.dataset.fieldError = field.name;
      error.id = `${control.id}-error`;
      control.setAttribute("aria-describedby", error.id);
      control.addEventListener("input", () => {
        control.setAttribute("aria-invalid", "false");
        error.textContent = "";
        generalError.textContent = "";
      });
      wrapper.append(label, control, error);
      fieldsContainer.append(wrapper);
    });
  }

  function open({ title: nextTitle = "Nuevo registro", fields = [], values = {}, onSubmit } = {}) {
    if (!dialog.isConnected) document.body.append(dialog);
    lastFocusedElement = document.activeElement;
    activeFields = fields;
    submitHandler = onSubmit;
    title.textContent = nextTitle;
    renderFields(fields, values);
    dialog.showModal();
    getFocusableElements(dialog)[0]?.focus();
  }

  closeButton.addEventListener("click", close);
  cancelButton.addEventListener("click", close);
  form.addEventListener("submit", handleSubmit);
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    if (!saveButton.disabled) close();
  });
  dialog.addEventListener("keydown", handleKeydown);
  headingGroup.append(eyebrow, title);
  header.append(headingGroup, closeButton);
  actions.append(cancelButton, saveButton);
  form.append(fieldsContainer, generalError, actions);
  panel.append(header, form);
  dialog.append(panel);

  function destroy() {
    close();
    dialog.remove();
  }

  return Object.freeze({ element: dialog, open, close, setBusy, destroy });
}

export default createFormModal;
