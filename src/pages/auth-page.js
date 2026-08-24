import { createCombinationLock } from "../components/combination-lock.js";
import { APP_NAME, ROUTES } from "../config/app.config.js";
import { email, reasonableLength, required } from "../core/validators.js";

function createField({ name, label, type = "text", autocomplete, placeholder }) {
  const wrapper = document.createElement("div");
  const labelElement = document.createElement("label");
  const input = document.createElement("input");
  const error = document.createElement("small");

  wrapper.className = "jc-field";
  labelElement.htmlFor = `auth-${name}`;
  labelElement.textContent = `${label} *`;
  input.className = "jc-input";
  input.id = `auth-${name}`;
  input.name = name;
  input.type = type;
  input.required = true;
  input.autocomplete = autocomplete;
  input.placeholder = placeholder;
  input.setAttribute("aria-describedby", `auth-${name}-error`);
  error.className = "jc-field__error";
  error.id = `auth-${name}-error`;
  error.dataset.authError = name;
  wrapper.append(labelElement, input, error);
  return { wrapper, input, error };
}

function validateAuthValues(mode, values, password) {
  const errors = {};
  const setError = (name, ...messages) => {
    const message = messages.find(Boolean);
    if (message) {
      errors[name] = message;
    }
  };

  setError(
    "username",
    required(values.username, "Usuario"),
    reasonableLength(values.username, { label: "Usuario", min: 3, max: 60 }),
  );

  if (mode === "register") {
    setError(
      "firstName",
      required(values.firstName, "Nombre"),
      reasonableLength(values.firstName, { label: "Nombre", min: 2, max: 80 }),
    );
    setError(
      "lastName",
      required(values.lastName, "Apellidos"),
      reasonableLength(values.lastName, { label: "Apellidos", min: 2, max: 100 }),
    );
    setError("email", required(values.email, "Correo"), email(values.email, "Correo"));
  }

  setError("password", required(password, "Clave de acceso"));
  return errors;
}

export function createAuthPage({ mode = "login", onLogin, onRegister } = {}) {
  const page = document.createElement("main");
  const card = document.createElement("section");
  const brand = document.createElement("div");
  const logo = document.createElement("img");
  const name = document.createElement("strong");
  const title = document.createElement("h1");
  const description = document.createElement("p");
  const tabs = document.createElement("nav");
  const loginLink = document.createElement("a");
  const registerLink = document.createElement("a");
  const form = document.createElement("form");
  const fields = document.createElement("div");
  const usernameField = createField({
    name: "username",
    label: "Usuario",
    autocomplete: "username",
    placeholder: "Escribí tu usuario",
  });
  const firstNameField = createField({
    name: "firstName",
    label: "Nombre",
    autocomplete: "given-name",
    placeholder: "Escribí tu nombre",
  });
  const lastNameField = createField({
    name: "lastName",
    label: "Apellidos",
    autocomplete: "family-name",
    placeholder: "Escribí tus apellidos",
  });
  const emailField = createField({
    name: "email",
    label: "Correo",
    type: "email",
    autocomplete: "email",
    placeholder: "nombre@correo.com",
  });
  const lock = createCombinationLock({ mode: "numeric" });
  const passwordError = document.createElement("small");
  const generalError = document.createElement("p");
  const securityNote = document.createElement("p");
  const submitButton = document.createElement("button");
  let password = "";

  page.className = "jc-auth-page";
  page.id = "main-content";
  page.tabIndex = -1;
  card.className = "jc-auth-card";
  brand.className = "jc-auth-card__brand";
  logo.src = "/src/assets/jobconnect-logo.svg";
  logo.alt = "";
  logo.width = 52;
  logo.height = 52;
  name.textContent = APP_NAME;
  title.textContent = mode === "register" ? "Creá tu perfil de reclutador" : "Bienvenido de nuevo";
  description.className = "jc-auth-card__description";
  description.textContent = mode === "register"
    ? "El registro se simula con DummyJSON y no crea una cuenta permanente."
    : "Ingresá al panel administrativo para conectar talento con oportunidades.";
  tabs.className = "jc-auth-tabs";
  tabs.setAttribute("aria-label", "Acceso a JobConnect");
  loginLink.href = ROUTES.login;
  loginLink.textContent = "Iniciar sesión";
  loginLink.setAttribute("aria-current", mode === "login" ? "page" : "false");
  registerLink.href = ROUTES.register;
  registerLink.textContent = "Registrarse";
  registerLink.setAttribute("aria-current", mode === "register" ? "page" : "false");
  form.className = "jc-auth-form";
  form.noValidate = true;
  fields.className = "jc-auth-form__fields";
  passwordError.className = "jc-field__error";
  passwordError.dataset.authError = "password";
  passwordError.id = "auth-password-error";
  lock.element.setAttribute("aria-describedby", passwordError.id);
  generalError.className = "jc-form-error jc-auth-form__error";
  generalError.setAttribute("role", "alert");
  securityNote.className = "jc-auth-security";
  securityNote.textContent = "Tu clave se utiliza solo para esta solicitud y no se guarda en el navegador.";
  submitButton.className = "jc-btn jc-btn--primary jc-auth-form__submit";
  submitButton.type = "submit";
  submitButton.textContent = mode === "register" ? "Crear registro simulado" : "Iniciar sesión";

  fields.append(usernameField.wrapper);
  if (mode === "register") {
    fields.prepend(firstNameField.wrapper, lastNameField.wrapper);
    fields.append(emailField.wrapper);
  }

  const allFields = mode === "register"
    ? [firstNameField, lastNameField, usernameField, emailField]
    : [usernameField];

  function clearErrors() {
    allFields.forEach(({ input, error }) => {
      input.setAttribute("aria-invalid", "false");
      error.textContent = "";
    });
    lock.element.setAttribute("aria-invalid", "false");
    passwordError.textContent = "";
    generalError.textContent = "";
  }

  function showErrors(errors) {
    allFields.forEach(({ input, error }) => {
      const message = errors[input.name] ?? "";
      input.setAttribute("aria-invalid", String(Boolean(message)));
      error.textContent = message;
    });
    const lockMessage = errors.password ?? "";
    lock.element.setAttribute("aria-invalid", String(Boolean(lockMessage)));
    passwordError.textContent = lockMessage;
  }

  function setBusy(busy) {
    submitButton.disabled = busy;
    submitButton.classList.toggle("is-loading", busy);
    submitButton.textContent = busy
      ? "Procesando…"
      : mode === "register" ? "Crear registro simulado" : "Iniciar sesión";
    allFields.forEach(({ input }) => {
      input.disabled = busy;
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    clearErrors();
    const values = Object.fromEntries(new FormData(form).entries());
    const errors = validateAuthValues(mode, values, password);
    showErrors(errors);

    if (Object.keys(errors).length > 0) {
      form.querySelector("[aria-invalid='true']")?.focus();
      return;
    }

    try {
      setBusy(true);
      if (mode === "register") {
        await onRegister?.({ ...values, password });
      } else {
        await onLogin?.({ username: String(values.username).trim(), password });
      }
    } catch (error) {
      generalError.textContent = error.message || "No fue posible completar la solicitud.";
      generalError.focus?.();
    } finally {
      password = "";
      lock.clear();
      setBusy(false);
    }
  }

  lock.element.addEventListener("lock-change", (event) => {
    password = event.detail.value;
    lock.element.setAttribute("aria-invalid", "false");
    passwordError.textContent = "";
    generalError.textContent = "";
  });
  allFields.forEach(({ input, error }) => {
    input.addEventListener("input", () => {
      input.setAttribute("aria-invalid", "false");
      error.textContent = "";
      generalError.textContent = "";
    });
  });
  form.addEventListener("submit", handleSubmit);
  brand.append(logo, name);
  tabs.append(loginLink, registerLink);
  form.append(fields, lock.element, passwordError, securityNote, generalError, submitButton);
  card.append(brand, title, description, tabs, form);
  page.append(card);
  return page;
}

export default createAuthPage;
