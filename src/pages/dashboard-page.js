import { MODULES } from "../config/modules.config.js";

export function createDashboardPage() {
  const page = document.createElement("section");
  const title = document.createElement("h1");
  const description = document.createElement("p");
  const grid = document.createElement("div");

  page.className = "jc-dashboard-placeholder";
  title.textContent = "Conecta talento con la oportunidad correcta";
  description.className = "jc-foundation-note";
  description.textContent = "Estructura provisional de la fundación. Las métricas, accesos rápidos y actividad reciente pertenecen a la Parte B de Jared.";
  grid.className = "jc-dashboard-placeholder__grid";

  MODULES.forEach((moduleConfig) => {
    const card = document.createElement("article");
    const heading = document.createElement("h2");
    const status = document.createElement("p");
    card.className = "jc-card";
    heading.textContent = moduleConfig.title;
    status.textContent = "Stub importable listo para el equipo.";
    card.append(heading, status);
    grid.append(card);
  });

  page.append(title, description, grid);
  return page;
}

export default createDashboardPage;

