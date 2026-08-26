import { PORTAL_STORAGE_KEYS } from "../config/portal.config.js";
import { createCombinationLock } from "../components/combination-lock.js";
import { portalSession } from "../core/portal-session.js";
import { getEntryRoute, login, register } from "../../core/auth-service.js";
import { ROLE_META, ROLES } from "../../config/roles.config.js";

const demoAccounts = Object.freeze({
  candidato: { password: "Job2026", role: ROLES.client, name: "Candidato JobConnect" },
  emilys: { password: "emilyspass", role: ROLES.client, name: "Emily Johnson" },
  empresa: { password: "Hire2026", role: ROLES.employer, name: "Empresa demostrativa" },
});

function createField(labelText, name) {
  const wrapper = document.createElement("div");
  wrapper.className = "jc-portal-auth-field";
  const label = document.createElement("label");
  label.htmlFor = `jc-portal-auth-${name}`;
  label.textContent = labelText;
  const input = document.createElement("input");
  input.className = "jc-portal-auth-input";
  input.id = `jc-portal-auth-${name}`;
  input.name = name;
  input.type = "text";
  input.required = true;
  wrapper.append(label, input);
  return { wrapper, input };
}

export function createAuthPage({ mode = "login" } = {}) {
  const section = document.createElement("section");
  section.className = "jc-portal-page jc-portal-auth-page";

  const heading = document.createElement("h1");
  heading.className = "jc-portal-page-title";
  heading.textContent = mode === "register" ? "Crear cuenta" : "Ingresar";

  const message = document.createElement("p");
  message.className = "jc-portal-page-message";
  message.textContent = mode === "register" ? "Crea un perfil demostrativo para explorar el portal." : "Usa una cuenta de prueba para continuar.";

  const form = document.createElement("form");
  form.className = "jc-portal-auth-form";
  const username = createField(mode === "register" ? "Nombre de usuario" : "Usuario", "username");
  const lock = createCombinationLock();
  const roleField = mode === "register" ? createField("Rol", "role") : null;
  if (roleField) {
    roleField.input.type = "select";
    roleField.input.replaceWith(Object.assign(document.createElement("select"), { className: "jc-portal-auth-input", id: roleField.input.id, name: "role", required: true }));
    const select = roleField.wrapper.querySelector("select");
    Object.entries(ROLE_META).forEach(([value, meta]) => { const option = document.createElement("option"); option.value = value; option.textContent = meta.label; select.append(option); });
    roleField.input = select;
  }
  const error = document.createElement("p");
  error.className = "jc-portal-auth-error";
  error.setAttribute("role", "alert");
  error.hidden = true;
  const submit = document.createElement("button");
  submit.className = "jc-portal-btn jc-portal-btn--primary";
  submit.type = "submit";
  submit.textContent = mode === "register" ? "Crear cuenta" : "Ingresar";
  const demo = document.createElement("p");
  demo.className = "jc-portal-auth-demo";
  demo.textContent = "Candidato: candidato / Job2026 o emilys / emilyspass · Empresa: empresa / Hire2026";

  form.append(username.wrapper, ...(roleField ? [roleField.wrapper] : []), lock, error, submit);
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const account = demoAccounts[username.input.value.trim().toLowerCase()];
    const password = lock.querySelector("input")?.value ?? "";

    if (mode === "login") {
      try {
        const user = await login({ username: username.input.value.trim(), pin: password, password });
        portalSession.set(user);
        const isClient = getEntryRoute(user) === "portal";
        if (isClient) {
          const redirect = new URLSearchParams(window.location.hash.split("?")[1] ?? "").get("redirect");
          window.location.href = redirect ? decodeURIComponent(redirect) : "#/inicio";
        } else {
          window.location.href = "/index.html#/dashboard";
        }
        return;
      } catch {
        error.textContent = account ? "Usuario o clave de demostración incorrectos." : "Usuario o clave incorrectos.";
        error.hidden = false;
        return;
      }
    }

    if (mode === "register") {
      try {
        const selectedRole = roleField?.input.value ?? ROLES.client;
        const user = await register({ username: username.input.value.trim(), password, pin: password, role: selectedRole });
        const session = portalSession.set({ ...user, role: selectedRole, name: user.name || username.input.value.trim() });
        window.localStorage.setItem(PORTAL_STORAGE_KEYS.profile, JSON.stringify({ username: session.username, name: session.name || session.username, headline: "Nuevo perfil profesional" }));
        const isClient = selectedRole === ROLES.client;
        if (isClient) {
          window.location.hash = "#/inicio";
        } else {
          window.location.href = "/index.html#/dashboard";
        }
        return;
      } catch {
        error.textContent = "No fue posible crear la cuenta.";
        error.hidden = false;
        return;
      }
    }
  });

  section.append(heading, message, form, demo);
  return section;
}
