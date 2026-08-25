export function createAuthPage({ mode = "login" } = {}) {
  const section = document.createElement("section");
  section.className = "jc-portal-page jc-portal-auth-page";

  const heading = document.createElement("h1");
  heading.className = "jc-portal-page-title";
  heading.textContent = mode === "register" ? "Crear cuenta" : "Ingresar";

  const message = document.createElement("p");
  message.className = "jc-portal-page-message";
  message.textContent = "La experiencia completa de acceso y registro se implementará en la Fase 3.";

  section.append(heading, message);
  return section;
}
