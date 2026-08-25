import { createCombinationLock } from "../components/combination-lock.js";
import { APP_NAME, ROUTES } from "../config/app.config.js";
import { email, reasonableLength, required } from "../core/validators.js";

function createField({ name, label, type = "text", autocomplete, placeholder }) {
  const wrapper = document.createElement("div");
  const labelElement = document.createElement("label");
  const inputFrame = document.createElement("div");
  const input = document.createElement("input");
  const error = document.createElement("small");

  wrapper.className = "jc-field";
  labelElement.htmlFor = `auth-${name}`;
  labelElement.textContent = `${label} *`;
  inputFrame.className = "jc-auth-input-frame";
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
  inputFrame.append(input);
  wrapper.append(labelElement, inputFrame, error);
  return { wrapper, input, error };
}

function createArrowIcon() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  path.setAttribute("d", "M5 12h14m-6-6 6 6-6 6");
  svg.append(path);
  return svg;
}

function validateAuthValues(mode, values, password) {
  const errors = {};
  const setError = (name, ...messages) => {
    const message = messages.find(Boolean);
    if (message) errors[name] = message;
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
  const ambient = document.createElement("div");
  const stage = document.createElement("section");
  const brand = document.createElement("div");
  const logoFrame = document.createElement("span");
  const logo = document.createElement("img");
  const brandText = document.createElement("div");
  const name = document.createElement("strong");
  const brandCaption = document.createElement("small");
  const switchNavigation = document.createElement("nav");
  const loginLink = document.createElement("a");
  const switchTrack = document.createElement("span");
  const switchThumb = document.createElement("span");
  const registerLink = document.createElement("a");
  const cardFrame = document.createElement("div");
  const card = document.createElement("div");
  const cardFace = document.createElement("div");
  const cardHeader = document.createElement("header");
  const securityBadge = document.createElement("span");
  const title = document.createElement("h1");
  const description = document.createElement("p");
  const form = document.createElement("form");
  const fields = document.createElement("div");
  const usernameField = createField({
    name: "username",
    label: "Usuario",
    autocomplete: "username",
    placeholder: "Escribe tu usuario",
  });
  const firstNameField = createField({
    name: "firstName",
    label: "Nombre",
    autocomplete: "given-name",
    placeholder: "Escribe tu nombre",
  });
  const lastNameField = createField({
    name: "lastName",
    label: "Apellidos",
    autocomplete: "family-name",
    placeholder: "Escribe tus apellidos",
  });
  const emailField = createField({
    name: "email",
    label: "Correo",
    type: "email",
    autocomplete: "email",
    placeholder: "nombre@correo.com",
  });
  const lock = createCombinationLock({ mode: "numeric", allowAlphanumeric: mode === "login" });
  const passwordError = document.createElement("small");
  const generalError = document.createElement("p");
  const securityNote = document.createElement("p");
  const submitButton = document.createElement("button");
  const submitLabel = document.createElement("span");
  const submitArrow = document.createElement("span");
  let password = "";
  let navigationTimer = 0;

  page.className = "jc-auth-page";
  page.dataset.authMode = mode;
  page.id = "main-content";
  page.tabIndex = -1;
  ambient.className = "jc-auth-ambient";
  ambient.setAttribute("aria-hidden", "true");
  stage.className = "jc-auth-stage";
  brand.className = "jc-auth-brand";
  logoFrame.className = "jc-auth-brand__logo";
  logo.src = "/src/assets/jobconnect-logo.svg";
  logo.alt = "";
  logo.width = 42;
  logo.height = 42;
  brandText.className = "jc-auth-brand__text";
  name.textContent = APP_NAME;
  brandCaption.textContent = "Recruitment workspace";
  logoFrame.append(logo);
  brandText.append(name, brandCaption);
  brand.append(logoFrame, brandText);

  switchNavigation.className = "jc-auth-switch";
  switchNavigation.setAttribute("aria-label", "Acceso a JobConnect");
  loginLink.href = ROUTES.login;
  loginLink.textContent = "Iniciar sesión";
  loginLink.setAttribute("aria-current", mode === "login" ? "page" : "false");
  switchTrack.className = "jc-auth-switch__track";
  switchTrack.setAttribute("aria-hidden", "true");
  switchThumb.className = "jc-auth-switch__thumb";
  switchTrack.append(switchThumb);
  registerLink.href = ROUTES.register;
  registerLink.textContent = "Registrarse";
  registerLink.setAttribute("aria-current", mode === "register" ? "page" : "false");
  switchNavigation.append(loginLink, switchTrack, registerLink);

  cardFrame.className = "jc-auth-card-frame";
  card.className = `jc-auth-card jc-auth-card--${mode}`;
  cardFace.className = "jc-auth-card__face";
  cardHeader.className = "jc-auth-card__header";
  securityBadge.className = "jc-auth-card__security-badge";
  securityBadge.textContent = "SECURE ACCESS";
  title.textContent = mode === "register" ? "Crea tu perfil de reclutador" : "Bienvenido de nuevo";
  description.className = "jc-auth-card__description";
  description.textContent = mode === "register"
    ? "DummyJSON simulará el registro sin crear una cuenta permanente."
    : "Accede al centro de operaciones de JobConnect.";
  cardHeader.append(securityBadge, title, description);

  form.className = "jc-auth-form";
  form.noValidate = true;
  fields.className = "jc-auth-form__fields";
  passwordError.className = "jc-field__error jc-auth-password-error";
  passwordError.dataset.authError = "password";
  passwordError.id = "auth-password-error";
  lock.element.setAttribute("aria-describedby", passwordError.id);
  generalError.className = "jc-form-error jc-auth-form__error";
  generalError.setAttribute("role", "alert");
  generalError.tabIndex = -1;
  securityNote.className = "jc-auth-security";
  securityNote.textContent = mode === "register"
    ? "El registro es una simulación y no quedará persistido en el servidor."
    : "La clave solo se usa durante la solicitud y nunca se guarda.";
  submitButton.className = "jc-btn jc-btn--primary jc-auth-form__submit";
  submitButton.type = "submit";
  submitLabel.textContent = mode === "register" ? "Crear registro simulado" : "Iniciar sesión";
  submitArrow.className = "jc-auth-form__submit-arrow";
  submitArrow.setAttribute("aria-hidden", "true");
  submitArrow.append(createArrowIcon());
  submitButton.append(submitLabel, submitArrow);

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
    submitLabel.textContent = busy
      ? "Procesando..."
      : mode === "register" ? "Crear registro simulado" : "Iniciar sesión";
    allFields.forEach(({ input }) => {
      input.disabled = busy;
    });
  }

  function navigateWithFlip(event, targetRoute, direction) {
    if (window.location.hash === targetRoute) return;
    event.preventDefault();
    window.clearTimeout(navigationTimer);
    card.classList.add(direction);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    navigationTimer = window.setTimeout(() => {
      window.location.hash = targetRoute;
    }, reducedMotion ? 0 : 360);
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
      generalError.focus();
    } finally {
      password = "";
      lock.clear();
      setBusy(false);
    }
  }

  loginLink.addEventListener("click", (event) => navigateWithFlip(event, ROUTES.login, "is-flipping-right"));
  registerLink.addEventListener("click", (event) => navigateWithFlip(event, ROUTES.register, "is-flipping-left"));
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
  form.append(fields, lock.element, passwordError, securityNote, generalError, submitButton);
  cardFace.append(cardHeader, form);
  card.append(cardFace);
  cardFrame.append(card);
  stage.append(brand, switchNavigation, cardFrame);
  page.append(ambient, stage);
  return page;
}

export default createAuthPage;
