import { PORTAL_ROLES, PORTAL_STORAGE_KEYS } from "../config/portal.config.js";
import { createCombinationLock } from "../components/combination-lock.js";
import { portalSession } from "../core/portal-session.js";

const demoAccounts = Object.freeze({
  candidato: { password: "Job2026", role: PORTAL_ROLES.candidate, name: "Candidato JobConnect" },
  emilys: { password: "emilyspass", role: PORTAL_ROLES.candidate, name: "Emily Johnson" },
  empresa: { password: "Hire2026", role: PORTAL_ROLES.employer, name: "Empresa demostrativa" },
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

  form.append(username.wrapper, lock, error, submit);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const account = demoAccounts[username.input.value.trim().toLowerCase()];
    const password = lock.querySelector("input")?.value ?? "";

    if (mode === "login" && (!account || account.password !== password)) {
      error.textContent = "Usuario o clave de demostración incorrectos.";
      error.hidden = false;
      return;
    }

    const selectedAccount = account ?? { role: PORTAL_ROLES.candidate, name: username.input.value.trim() };
    const session = portalSession.set({ id: `${selectedAccount.role}-${username.input.value.trim()}`, username: username.input.value.trim(), name: selectedAccount.name, role: selectedAccount.role });
    if (mode === "register") {
      window.localStorage.setItem(PORTAL_STORAGE_KEYS.profile, JSON.stringify({ username: session.username, name: session.name, headline: "Nuevo perfil profesional" }));
    }
    const redirect = new URLSearchParams(window.location.hash.split("?")[1] ?? "").get("redirect");
    window.location.hash = redirect ? decodeURIComponent(redirect) : session.role === PORTAL_ROLES.employer ? "#/empresa/ofertas" : "#/perfil";
  });

  section.append(heading, message, form, demo);
  return section;
}
