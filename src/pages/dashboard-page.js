function createMetricCard(label, value, detail) {
  const card = document.createElement("article");
  const cardLabel = document.createElement("p");
  const cardValue = document.createElement("strong");
  const cardDetail = document.createElement("small");

  card.className = "jc-card jc-card--metric";
  cardLabel.className = "jc-metric__label";
  cardLabel.textContent = label;
  cardValue.className = "jc-metric__value";
  cardValue.textContent = String(value);
  cardDetail.className = "jc-metric__detail";
  cardDetail.textContent = detail;
  card.append(cardLabel, cardValue, cardDetail);
  return card;
}

function getRecordSummary(record) {
  return record.firstName
    || record.title
    || record.todo
    || record.body
    || `Registro ${record.id}`;
}

export function createDashboardPage({ modules = [] } = {}) {
  const page = document.createElement("section");
  const hero = document.createElement("header");
  const eyebrow = document.createElement("p");
  const title = document.createElement("h1");
  const description = document.createElement("p");
  const metrics = document.createElement("div");
  const modulesSection = document.createElement("section");
  const modulesTitle = document.createElement("h2");
  const modulesGrid = document.createElement("div");
  const activitySection = document.createElement("section");
  const activityTitle = document.createElement("h2");
  const activityList = document.createElement("ul");
  const howSection = document.createElement("section");
  const howTitle = document.createElement("h2");
  const howGrid = document.createElement("ol");
  const moduleMap = new Map(modules.map((module) => [module.config.key, module]));
  const candidates = moduleMap.get("candidates")?.getRecords() ?? [];
  const vacancies = moduleMap.get("vacancies")?.getRecords() ?? [];
  const applications = moduleMap.get("applications")?.getRecords() ?? [];
  const tasks = moduleMap.get("tasks")?.getRecords() ?? [];
  const pendingTasks = tasks.filter((task) => !task.completed).length;

  page.className = "jc-dashboard";
  hero.className = "jc-dashboard__hero";
  eyebrow.className = "jc-dashboard__eyebrow";
  eyebrow.textContent = "Panel administrativo para reclutadores";
  title.textContent = "Conecta talento con la oportunidad correcta";
  description.textContent = "Centralizá candidatos, vacantes y cada etapa del proceso de selección desde un mismo espacio.";
  metrics.className = "jc-dashboard__metrics";
  metrics.setAttribute("aria-label", "Métricas principales");
  metrics.append(
    createMetricCard("Candidatos", candidates.length, "Perfiles disponibles"),
    createMetricCard("Vacantes", vacancies.length, "Oportunidades registradas"),
    createMetricCard("Postulaciones", applications.length, "Procesos en seguimiento"),
    createMetricCard("Tareas pendientes", pendingTasks, "Acciones por completar"),
  );

  modulesSection.className = "jc-dashboard__section";
  modulesTitle.textContent = "Módulos de trabajo";
  modulesGrid.className = "jc-dashboard__modules";
  modules.forEach((module) => {
    const link = document.createElement("a");
    const heading = document.createElement("h3");
    const total = document.createElement("strong");
    const callToAction = document.createElement("span");
    const recordCount = module.getRecords().length;

    link.className = "jc-card jc-module-card";
    link.href = module.config.route;
    heading.textContent = module.config.title;
    total.textContent = String(recordCount);
    total.setAttribute("aria-label", `${recordCount} registros`);
    callToAction.textContent = "Abrir módulo →";
    link.append(heading, total, callToAction);
    modulesGrid.append(link);
  });
  modulesSection.append(modulesTitle, modulesGrid);

  activitySection.className = "jc-card jc-dashboard__activity";
  activityTitle.textContent = "Actividad reciente";
  activityList.className = "jc-activity-list";
  const recentRecords = modules.flatMap((module) =>
    module.getRecords().slice(0, 1).map((record) => ({ module: module.config.title, record })),
  ).slice(0, 6);

  if (recentRecords.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.textContent = "Todavía no hay actividad para mostrar.";
    activityList.append(emptyItem);
  } else {
    recentRecords.forEach(({ module, record }) => {
      const item = document.createElement("li");
      const marker = document.createElement("span");
      const content = document.createElement("div");
      const summary = document.createElement("strong");
      const moduleName = document.createElement("small");
      marker.className = "jc-activity-list__marker";
      marker.setAttribute("aria-hidden", "true");
      summary.textContent = String(getRecordSummary(record));
      moduleName.textContent = module;
      content.append(summary, moduleName);
      item.append(marker, content);
      activityList.append(item);
    });
  }
  activitySection.append(activityTitle, activityList);

  howSection.className = "jc-dashboard__section";
  howTitle.textContent = "Cómo funciona";
  howGrid.className = "jc-how-grid";
  [
    ["1", "Organizá", "Registrá candidatos, empresas y vacantes."],
    ["2", "Conectá", "Relacioná postulaciones con cada oportunidad."],
    ["3", "Dale seguimiento", "Gestioná entrevistas y tareas hasta cerrar el proceso."],
  ].forEach(([number, headingText, bodyText]) => {
    const item = document.createElement("li");
    const numberElement = document.createElement("span");
    const heading = document.createElement("h3");
    const body = document.createElement("p");
    item.className = "jc-card";
    numberElement.className = "jc-how-grid__number";
    numberElement.textContent = number;
    heading.textContent = headingText;
    body.textContent = bodyText;
    item.append(numberElement, heading, body);
    howGrid.append(item);
  });
  howSection.append(howTitle, howGrid);

  hero.append(eyebrow, title, description);
  page.append(hero, metrics, modulesSection, activitySection, howSection);
  return page;
}

export default createDashboardPage;
