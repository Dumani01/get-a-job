export function createHomePage() {
  const section = document.createElement("section");
  section.className = "jc-portal-page";

  const heading = document.createElement("h1");
  heading.className = "jc-portal-page-title";
  heading.textContent = "Inicio";

  const message = document.createElement("p");
  message.className = "jc-portal-page-message";
  message.textContent = "Fundación del portal público de JobConnect cargada correctamente.";

  section.append(heading, message);
  return section;
}
