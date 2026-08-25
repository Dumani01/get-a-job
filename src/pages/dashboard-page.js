const MODULE_META = Object.freeze({
  candidates: {
    description: "Perfiles y datos de contacto del talento.",
    icon: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m7-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm13 10v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  },
  vacancies: {
    description: "Oportunidades y posiciones disponibles.",
    icon: "M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m5 5v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8m-2-5h20v5H2V6Z",
  },
  companies: {
    description: "Empresas, contactos y capacidad de contratación.",
    icon: "M3 21h18M5 21V5l7-3v19m7 0V9l-7-3M8 9h1m-1 4h1m-1 4h1m6-5h1m-1 4h1",
  },
  applications: {
    description: "Postulaciones y avance del proceso.",
    icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Zm0 0v6h6M8 13h8m-8 4h8",
  },
  interviews: {
    description: "Entrevistas, notas y seguimientos.",
    icon: "M7 3v3m10-3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z",
  },
  tasks: {
    description: "Pendientes diarios del equipo reclutador.",
    icon: "M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11",
  },
});

function createIcon(pathData) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  path.setAttribute("d", pathData);
  svg.append(path);
  return svg;
}

function createMetricCard({ label, value, detail, icon, emphasis = false }) {
  const card = document.createElement("article");
  const header = document.createElement("div");
  const iconFrame = document.createElement("span");
  const status = document.createElement("span");
  const cardValue = document.createElement("strong");
  const cardLabel = document.createElement("p");
  const cardDetail = document.createElement("small");

  card.className = `jc-card jc-card--metric${emphasis ? " is-emphasized" : ""}`;
  header.className = "jc-metric__header";
  iconFrame.className = "jc-metric__icon";
  iconFrame.append(createIcon(icon));
  status.className = "jc-metric__status";
  status.textContent = "LIVE";
  cardValue.className = "jc-metric__value";
  cardValue.textContent = String(value);
  cardLabel.className = "jc-metric__label";
  cardLabel.textContent = label;
  cardDetail.className = "jc-metric__detail";
  cardDetail.textContent = detail;
  header.append(iconFrame, status);
  card.append(header, cardValue, cardLabel, cardDetail);
  return card;
}

function getRecordSummary(record) {
  const fullName = [record.firstName, record.lastName].filter(Boolean).join(" ");
  return fullName || record.title || record.todo || record.body || `Registro ${record.id}`;
}

function createPipeline(candidates, vacancies, applications, interviews) {
  const panel = document.createElement("aside");
  const header = document.createElement("div");
  const title = document.createElement("strong");
  const status = document.createElement("span");
  const rows = document.createElement("div");
  const stages = [
    ["Talento", candidates],
    ["Vacantes", vacancies],
    ["Postulaciones", applications],
    ["Entrevistas", interviews],
  ];
  const maximum = Math.max(1, ...stages.map(([, value]) => value));

  panel.className = "jc-dashboard__pipeline";
  header.className = "jc-pipeline__header";
  title.textContent = "Pulso del proceso";
  status.className = "jc-pipeline__status";
  status.textContent = "Actualizado";
  rows.className = "jc-pipeline__rows";
  header.append(title, status);

  stages.forEach(([label, value]) => {
    const row = document.createElement("div");
    const rowHeader = document.createElement("div");
    const labelElement = document.createElement("span");
    const valueElement = document.createElement("strong");
    const track = document.createElement("span");
    const fill = document.createElement("span");
    row.className = "jc-pipeline__row";
    labelElement.textContent = label;
    valueElement.textContent = String(value);
    track.className = "jc-pipeline__track";
    fill.className = "jc-pipeline__fill";
    fill.style.setProperty("--jc-pipeline-value", `${Math.max(6, Math.round((value / maximum) * 100))}%`);
    rowHeader.append(labelElement, valueElement);
    track.append(fill);
    row.append(rowHeader, track);
    rows.append(row);
  });

  panel.append(header, rows);
  return panel;
}

export function createDashboardPage({ modules = [] } = {}) {
  const page = document.createElement("section");
  const hero = document.createElement("header");
  const heroContent = document.createElement("div");
  const eyebrow = document.createElement("p");
  const title = document.createElement("h1");
  const description = document.createElement("p");
  const heroActions = document.createElement("div");
  const candidatesLink = document.createElement("a");
  const vacanciesLink = document.createElement("a");
  const metricsSection = document.createElement("section");
  const metricsHeader = document.createElement("div");
  const metricsTitle = document.createElement("h2");
  const metricsCaption = document.createElement("p");
  const metrics = document.createElement("div");
  const modulesSection = document.createElement("section");
  const modulesHeader = document.createElement("div");
  const modulesTitle = document.createElement("h2");
  const modulesCaption = document.createElement("p");
  const modulesGrid = document.createElement("div");
  const lowerGrid = document.createElement("div");
  const activitySection = document.createElement("section");
  const activityHeader = document.createElement("div");
  const activityTitle = document.createElement("h2");
  const activityBadge = document.createElement("span");
  const activityList = document.createElement("ul");
  const howSection = document.createElement("section");
  const howTitle = document.createElement("h2");
  const howCaption = document.createElement("p");
  const howGrid = document.createElement("ol");
  const moduleMap = new Map(modules.map((module) => [module.config.key, module]));
  const candidates = moduleMap.get("candidates")?.getRecords() ?? [];
  const vacancies = moduleMap.get("vacancies")?.getRecords() ?? [];
  const applications = moduleMap.get("applications")?.getRecords() ?? [];
  const interviews = moduleMap.get("interviews")?.getRecords() ?? [];
  const tasks = moduleMap.get("tasks")?.getRecords() ?? [];
  const pendingTasks = tasks.filter((task) => !task.completed).length;

  page.className = "jc-dashboard";
  hero.className = "jc-dashboard__hero";
  heroContent.className = "jc-dashboard__hero-content";
  eyebrow.className = "jc-dashboard__eyebrow";
  eyebrow.textContent = "CENTRO DE RECLUTAMIENTO";
  title.textContent = "Conecta talento con la oportunidad correcta";
  description.textContent = "Visualiza el proceso completo, prioriza tareas y toma decisiones desde un solo espacio de trabajo.";
  heroActions.className = "jc-dashboard__hero-actions";
  candidatesLink.className = "jc-btn jc-btn--primary";
  candidatesLink.href = "#/candidatos";
  candidatesLink.textContent = "Explorar candidatos";
  vacanciesLink.className = "jc-btn jc-btn--secondary";
  vacanciesLink.href = "#/vacantes";
  vacanciesLink.textContent = "Revisar vacantes";
  heroActions.append(candidatesLink, vacanciesLink);
  heroContent.append(eyebrow, title, description, heroActions);
  hero.append(heroContent, createPipeline(candidates.length, vacancies.length, applications.length, interviews.length));

  metricsSection.className = "jc-dashboard__section";
  metricsHeader.className = "jc-dashboard__section-header";
  metricsTitle.textContent = "Resumen operativo";
  metricsCaption.textContent = "Datos cargados en esta sesión";
  metricsHeader.append(metricsTitle, metricsCaption);
  metrics.className = "jc-dashboard__metrics";
  metrics.setAttribute("aria-label", "Métricas principales");
  metrics.append(
    createMetricCard({ label: "Candidatos", value: candidates.length, detail: "Perfiles disponibles", icon: MODULE_META.candidates.icon, emphasis: true }),
    createMetricCard({ label: "Vacantes", value: vacancies.length, detail: "Oportunidades activas", icon: MODULE_META.vacancies.icon }),
    createMetricCard({ label: "Postulaciones", value: applications.length, detail: "Procesos en seguimiento", icon: MODULE_META.applications.icon }),
    createMetricCard({ label: "Tareas pendientes", value: pendingTasks, detail: "Acciones por completar", icon: MODULE_META.tasks.icon }),
  );
  metricsSection.append(metricsHeader, metrics);

  modulesSection.className = "jc-dashboard__section";
  modulesHeader.className = "jc-dashboard__section-header";
  modulesTitle.textContent = "Módulos de trabajo";
  modulesCaption.textContent = "Accesos rapidos al proceso completo";
  modulesHeader.append(modulesTitle, modulesCaption);
  modulesGrid.className = "jc-dashboard__modules";
  modules.forEach((module, index) => {
    const meta = MODULE_META[module.config.key] ?? MODULE_META.candidates;
    const link = document.createElement("a");
    const top = document.createElement("div");
    const iconFrame = document.createElement("span");
    const sequence = document.createElement("span");
    const heading = document.createElement("h3");
    const body = document.createElement("p");
    const footer = document.createElement("div");
    const total = document.createElement("strong");
    const callToAction = document.createElement("span");
    const recordCount = module.getRecords().length;

    link.className = "jc-card jc-module-card";
    link.href = module.config.route;
    top.className = "jc-module-card__top";
    iconFrame.className = "jc-module-card__icon";
    iconFrame.append(createIcon(meta.icon));
    sequence.className = "jc-module-card__sequence";
    sequence.textContent = String(index + 1).padStart(2, "0");
    heading.textContent = module.config.title;
    body.textContent = meta.description;
    footer.className = "jc-module-card__footer";
    total.textContent = String(recordCount);
    total.setAttribute("aria-label", `${recordCount} registros`);
    callToAction.textContent = "Abrir módulo →";
    top.append(iconFrame, sequence);
    footer.append(total, callToAction);
    link.append(top, heading, body, footer);
    modulesGrid.append(link);
  });
  modulesSection.append(modulesHeader, modulesGrid);

  lowerGrid.className = "jc-dashboard__lower-grid";
  activitySection.className = "jc-card jc-dashboard__activity";
  activityHeader.className = "jc-dashboard__activity-header";
  activityTitle.textContent = "Actividad reciente";
  activityBadge.textContent = "ÚLTIMOS REGISTROS";
  activityList.className = "jc-activity-list";
  activityHeader.append(activityTitle, activityBadge);
  const recentRecords = modules.flatMap((module) =>
    module.getRecords().slice(0, 1).map((record) => ({ module, record })),
  ).slice(0, 6);

  if (recentRecords.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "jc-activity-list__empty";
    emptyItem.textContent = "Todavia no hay actividad para mostrar.";
    activityList.append(emptyItem);
  } else {
    recentRecords.forEach(({ module, record }) => {
      const item = document.createElement("li");
      const marker = document.createElement("span");
      const content = document.createElement("div");
      const summary = document.createElement("strong");
      const moduleName = document.createElement("small");
      const id = document.createElement("span");
      marker.className = "jc-activity-list__marker";
      marker.append(createIcon((MODULE_META[module.config.key] ?? MODULE_META.candidates).icon));
      summary.textContent = String(getRecordSummary(record));
      moduleName.textContent = module.config.title;
      id.className = "jc-activity-list__id";
      id.textContent = `#${record.id ?? "--"}`;
      content.append(summary, moduleName);
      item.append(marker, content, id);
      activityList.append(item);
    });
  }
  activitySection.append(activityHeader, activityList);

  howSection.className = "jc-card jc-dashboard__how";
  howTitle.textContent = "Cómo funciona";
  howCaption.textContent = "Un flujo claro para cada contratación.";
  howGrid.className = "jc-how-grid";
  [
    ["01", "Organiza", "Registra talento, empresas y oportunidades."],
    ["02", "Conecta", "Relaciona postulaciones con la vacante correcta."],
    ["03", "Da seguimiento", "Gestiona entrevistas y tareas hasta el cierre."],
  ].forEach(([number, headingText, bodyText]) => {
    const item = document.createElement("li");
    const numberElement = document.createElement("span");
    const content = document.createElement("div");
    const heading = document.createElement("h3");
    const body = document.createElement("p");
    numberElement.className = "jc-how-grid__number";
    numberElement.textContent = number;
    heading.textContent = headingText;
    body.textContent = bodyText;
    content.append(heading, body);
    item.append(numberElement, content);
    howGrid.append(item);
  });
  howSection.append(howTitle, howCaption, howGrid);
  lowerGrid.append(activitySection, howSection);

  page.append(hero, metricsSection, modulesSection, lowerGrid);
  return page;
}

export default createDashboardPage;
