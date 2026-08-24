import { APP_NAME, ROUTES } from "../config/app.config.js";

export function createAuthPage({ mode = "login" } = {}) {
  const page = document.createElement("main");
  const card = document.createElement("section");
  const brand = document.createElement("div");
  const logo = document.createElement("img");
  const name = document.createElement("strong");
  const title = document.createElement("h1");
  const tabs = document.createElement("nav");
  const loginLink = document.createElement("a");
  const registerLink = document.createElement("a");
  const note = document.createElement("div");
  const noteTitle = document.createElement("strong");
  const noteText = document.createElement("p");

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
  title.textContent = mode === "register" ? "Registrarse" : "Iniciar sesión";
  tabs.className = "jc-auth-tabs";
  tabs.setAttribute("aria-label", "Acceso a JobConnect");
  loginLink.href = ROUTES.login;
  loginLink.textContent = "Iniciar sesión";
  loginLink.setAttribute("aria-current", mode === "login" ? "page" : "false");
  registerLink.href = ROUTES.register;
  registerLink.textContent = "Registrarse";
  registerLink.setAttribute("aria-current", mode === "register" ? "page" : "false");
  note.className = "jc-foundation-note";
  noteTitle.textContent = "Fundación compartida lista";
  noteText.textContent = "La interfaz y la conexión real se activarán en la Parte B después de fusionar esta rama en main.";
  brand.append(logo, name);
  tabs.append(loginLink, registerLink);
  note.append(noteTitle, noteText);
  card.append(brand, title, tabs, note);
  page.append(card);
  return page;
}

export default createAuthPage;

