const PAGE_SIZE = 12;

const ACTION_ICONS = Object.freeze({
  create: "M12 5v14m-7-7h14",
  edit: "M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4L16.5 3.5Z",
  retry: "M20 11a8.1 8.1 0 1 0 2 5m0-5v6h-6",
});

function createLineIcon(pathData, className = "") {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  svg.className.baseVal = className;
  path.setAttribute("d", pathData);
  svg.append(path);
  return svg;
}

function createTrashIcon() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  svg.setAttribute("viewBox", "0 0 448 512");
  svg.setAttribute("aria-hidden", "true");
  svg.classList.add("jc-delete-button__icon");
  path.setAttribute("d", "M135.2 17.7 128 32H32C14.3 32 0 46.3 0 64s14.3 32 32 32h384c17.7 0 32-14.3 32-32s-14.3-32-32-32h-96l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7ZM416 128H32l21.2 339c1.6 25.3 22.6 45 47.9 45h245.8c25.3 0 46.3-19.7 47.9-45L416 128Z");
  svg.append(path);
  return svg;
}

function createActionButton({ action, label, className, recordId, operation }) {
  const button = document.createElement("button");
  const text = document.createElement("span");
  button.className = className;
  button.type = "button";
  button.dataset.action = action;
  if (recordId !== undefined) button.dataset.recordId = String(recordId);
  if (operation) button.dataset.operation = operation;
  button.setAttribute("aria-label", label);
  button.title = label;
  text.textContent = label;

  if (action === "delete") {
    button.classList.add("jc-delete-button");
    text.className = "jc-delete-button__text";
    button.append(createTrashIcon(), text);
  } else if (ACTION_ICONS[action]) {
    text.className = "jc-action-button__text";
    button.append(createLineIcon(ACTION_ICONS[action], "jc-action-button__icon"), text);
  } else {
    button.append(text);
  }
  return button;
}

function getDisplayValue(record, column) {
  const value = column.render ? column.render(record) : record[column.key];
  return value === null || value === undefined || value === "" ? "-" : String(value);
}

function appendDisplayValue(container, record, column) {
  const rawValue = record[column.key];
  if (column.type === "image" && rawValue) {
    const image = document.createElement("img");
    image.className = "jc-record-avatar";
    image.src = String(rawValue);
    image.alt = `Foto de ${record.firstName ?? "candidato"} ${record.lastName ?? ""}`.trim();
    image.width = 44;
    image.height = 44;
    image.loading = "lazy";
    container.append(image);
    return;
  }

  if (typeof rawValue === "boolean" || column.key === "completed") {
    const check = document.createElement("span");
    const isChecked = rawValue === true || rawValue === "true";
    const label = isChecked ? "Completada" : "Pendiente";
    check.className = `jc-quest-check${isChecked ? " is-checked" : ""}`;
    check.setAttribute("role", "img");
    check.setAttribute("aria-label", `${column.label}: ${label}`);
    check.textContent = isChecked ? "✓" : "";
    container.append(check);
    return;
  }
  container.textContent = getDisplayValue(record, column);
}

function createRecordActions(config, recordId) {
  const actions = [];
  const defaultOperation = config.methods.replace ? "replace" : "update";
  if (defaultOperation && config.methods[defaultOperation]) {
    actions.push(createActionButton({
      action: "edit",
      label: "Editar",
      className: "jc-btn jc-btn--secondary jc-action-button",
      recordId,
      operation: defaultOperation,
    }));
  }
  if (config.methods.replace && config.methods.update) {
    actions.push(createActionButton({
      action: "edit",
      label: "Actualizar",
      className: "jc-btn jc-btn--secondary jc-action-button",
      recordId,
      operation: "update",
    }));
  }
  if (config.methods.remove) {
    actions.push(createActionButton({
      action: "delete",
      label: "Eliminar",
      className: "jc-btn jc-btn--danger jc-btn--icon",
      recordId,
    }));
  }
  return actions;
}

function createSkeleton() {
  const skeleton = document.createElement("div");
  skeleton.className = "jc-skeleton-table";
  skeleton.setAttribute("aria-hidden", "true");
  for (let index = 0; index < 6; index += 1) {
    const row = document.createElement("span");
    row.className = "jc-skeleton-table__row";
    skeleton.append(row);
  }
  return skeleton;
}

export function createCrudView({ config, onAction = () => {} } = {}) {
  const element = document.createElement("section");
  const header = document.createElement("header");
  const headingGroup = document.createElement("div");
  const eyebrow = document.createElement("p");
  const title = document.createElement("h1");
  const total = document.createElement("p");
  const createButton = createActionButton({
    action: "create",
    label: "Nuevo registro",
    className: "jc-btn jc-btn--primary jc-action-button",
  });
  const status = document.createElement("div");
  const content = document.createElement("div");
  const pagination = document.createElement("nav");
  let records = [];
  let filteredRecords = [];
  let currentPage = 1;
  let activeQuery = "";

  element.className = "jc-crud-view";
  element.dataset.moduleKey = config.key;
  header.className = "jc-section-header";
  headingGroup.className = "jc-section-header__heading";
  eyebrow.className = "jc-section-header__eyebrow";
  eyebrow.textContent = "GESTIÓN DE DATOS";
  title.textContent = config.title;
  total.className = "jc-section-header__total";
  status.className = "jc-state";
  status.setAttribute("aria-live", "polite");
  content.className = "jc-records";
  pagination.className = "jc-pagination";
  pagination.setAttribute("aria-label", `Paginación de ${config.title}`);
  createButton.disabled = !config.methods.create || config.formFields.length === 0;
  headingGroup.append(eyebrow, title, total);
  header.append(headingGroup, createButton);
  element.append(header, status, content, pagination);

  function setStatus(message = "", type = "") {
    status.className = "jc-state";
    if (type) status.classList.add(`jc-state--${type}`);
    status.textContent = message;
    status.hidden = !message;
  }

  function applyFilter() {
    const normalizedQuery = activeQuery.toLocaleLowerCase("es");
    const fields = config.searchableFields;
    filteredRecords = normalizedQuery
      ? records.filter((record) => fields.some((field) =>
        String(record[field] ?? "").toLocaleLowerCase("es").includes(normalizedQuery)))
      : [...records];
  }

  function renderPagination(pageCount) {
    pagination.replaceChildren();
    pagination.hidden = pageCount <= 1;
    for (let page = 1; page <= pageCount; page += 1) {
      const button = document.createElement("button");
      button.className = "jc-btn jc-btn--secondary jc-btn--icon";
      button.type = "button";
      button.textContent = String(page);
      button.setAttribute("aria-label", `Ir a la página ${page}`);
      button.setAttribute("aria-current", page === currentPage ? "page" : "false");
      button.addEventListener("click", () => {
        currentPage = page;
        renderRecords();
      });
      pagination.append(button);
    }
  }

  function createRecordCard(record, columns) {
    const article = document.createElement("article");
    const cardTop = document.createElement("div");
    const recordId = document.createElement("span");
    const details = document.createElement("dl");
    const actions = document.createElement("div");
    article.className = "jc-record-card";
    article.classList.add(`jc-record-card--${config.key}`);
    article.dataset.recordId = String(record.id);
    cardTop.className = "jc-record-card__top";
    recordId.textContent = `REGISTRO #${record.id ?? "--"}`;
    const mission = document.createElement("span");
    mission.className = "jc-record-card__mission";
    mission.textContent = `QUEST / ${config.singular.toUpperCase()}`;
    cardTop.append(mission);
    cardTop.append(recordId);
    columns.forEach((column) => {
      const term = document.createElement("dt");
      const description = document.createElement("dd");
      term.textContent = column.label;
      appendDisplayValue(description, record, column);
      details.append(term, description);
    });
    actions.className = "jc-record-card__actions";
    actions.append(...createRecordActions(config, record.id));
    article.append(cardTop, details, actions);
    return article;
  }

  function createTable(pageRecords, columns) {
    const wrapper = document.createElement("div");
    const table = document.createElement("table");
    const caption = document.createElement("caption");
    const head = document.createElement("thead");
    const headRow = document.createElement("tr");
    const body = document.createElement("tbody");
    wrapper.className = "jc-table-wrapper";
    caption.className = "jc-visually-hidden";
    caption.textContent = `Registros de ${config.title}`;
    columns.forEach((column) => {
      const cell = document.createElement("th");
      cell.scope = "col";
      cell.textContent = column.label;
      headRow.append(cell);
    });
    const actionHeading = document.createElement("th");
    actionHeading.scope = "col";
    actionHeading.textContent = "Acciones";
    headRow.append(actionHeading);
    head.append(headRow);

    pageRecords.forEach((record) => {
      const row = document.createElement("tr");
      row.dataset.recordId = String(record.id);
      columns.forEach((column) => {
        const cell = document.createElement("td");
        appendDisplayValue(cell, record, column);
        row.append(cell);
      });
      const actionsCell = document.createElement("td");
      actionsCell.className = "jc-table-actions";
      actionsCell.append(...createRecordActions(config, record.id));
      row.append(actionsCell);
      body.append(row);
    });
    table.append(caption, head, body);
    wrapper.append(table);
    return wrapper;
  }

  function renderRecords() {
    content.replaceChildren();
    const columns = config.tableColumns.length > 0 ? config.tableColumns : [{ key: "id", label: "ID" }];
    const pageCount = Math.max(1, Math.ceil(filteredRecords.length / PAGE_SIZE));
    currentPage = Math.min(currentPage, pageCount);
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const pageRecords = filteredRecords.slice(startIndex, startIndex + PAGE_SIZE);
    total.textContent = `${filteredRecords.length} registros disponibles`;

    if (pageRecords.length === 0) {
      setStatus(activeQuery ? "No hay coincidencias para la búsqueda." : "No hay registros para mostrar.", "empty");
      pagination.hidden = true;
      return;
    }

    setStatus();
    content.append(createTable(pageRecords, columns));
    const cards = document.createElement("div");
    cards.className = "jc-record-grid";
    pageRecords.forEach((record) => cards.append(createRecordCard(record, columns)));
    content.append(cards);
    renderPagination(pageCount);
  }

  function setRecords(nextRecords) {
    records = [...nextRecords];
    applyFilter();
    renderRecords();
  }

  function filter(query) {
    activeQuery = String(query).trim();
    applyFilter();
    currentPage = 1;
    renderRecords();
  }

  function setLoading() {
    content.replaceChildren(createSkeleton());
    pagination.hidden = true;
    setStatus("Cargando registros...", "loading");
  }

  function setError(message = "No se pudieron cargar los registros.") {
    content.replaceChildren();
    pagination.hidden = true;
    setStatus(message, "error");
    const retryButton = createActionButton({
      action: "retry",
      label: "Reintentar",
      className: "jc-btn jc-btn--secondary jc-action-button",
    });
    content.append(retryButton);
  }

  function setRecordBusy(recordId, busy) {
    element.querySelectorAll(`[data-record-id="${CSS.escape(String(recordId))}"] [data-action]`).forEach((button) => {
      button.disabled = busy;
    });
  }

  element.addEventListener("click", (event) => {
    const actionTarget = event.target.closest("[data-action]");
    if (!actionTarget || !element.contains(actionTarget) || actionTarget.disabled) return;
    const recordId = actionTarget.dataset.recordId;
    const record = records.find((item) => String(item.id) === String(recordId));
    onAction({
      action: actionTarget.dataset.action,
      operation: actionTarget.dataset.operation,
      recordId,
      record,
    });
  });

  setRecords([]);
  return Object.freeze({ element, setRecords, filter, setLoading, setError, setRecordBusy });
}

export default createCrudView;
