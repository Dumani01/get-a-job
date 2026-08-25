import { PORTAL_STORAGE_KEYS } from "../config/portal.config.js";
import { portalSession } from "../core/portal-session.js";

export function createProfilePage() {
  const section = document.createElement("section");
  section.className = "jc-portal-page";

  const heading = document.createElement("h1");
  heading.className = "jc-portal-page-title";
  heading.textContent = "Perfil profesional";

    const message = document.createElement("p");
    message.className = "jc-portal-page-message";
    message.textContent = "Administra tu carta profesional dentro de esta demostración local.";

    const stored = JSON.parse(window.localStorage.getItem(PORTAL_STORAGE_KEYS.profile) ?? "null") ?? {};
    const form = document.createElement("form");
    form.className = "jc-portal-auth-form";
    [["Nombre", "name", stored.name ?? portalSession.get()?.name ?? ""], ["Titular", "headline", stored.headline ?? ""]].forEach(([labelText, name, value]) => {
      const label = document.createElement("label");
      label.textContent = labelText;
      const input = document.createElement("input");
      input.className = "jc-portal-auth-input";
      input.name = name;
      input.value = value;
      input.required = true;
      form.append(label, input);
    });
    const save = document.createElement("button");
    save.className = "jc-portal-btn jc-portal-btn--primary";
    save.type = "submit";
    save.textContent = "Guardar perfil";
    const feedback = document.createElement("p");
    feedback.className = "jc-portal-application-form-message";
    form.append(save, feedback);
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      window.localStorage.setItem(PORTAL_STORAGE_KEYS.profile, JSON.stringify(Object.fromEntries(new FormData(form))));
      feedback.textContent = "Perfil guardado localmente.";
    });

    section.append(heading, message, form);
  return section;
}
