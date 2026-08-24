const PAGE_SIZE = 12;

function createActionButton({ action, label, className, recordId }) {
  const button = document.createElement("button");
  button.className = className;
  button.type = "button";
  button.dataset.action = action;
  if (recordId !== undefined) {
    button.dataset.recordId = String(recordId);
  }
  button.setAttribute("aria-label", label);
  button.title = label;
  button.textContent = label;
  return button;
}

function getDisplayValue(record, column) {
  const value = column.render ? column.render(record) : record[column.key];
  return value === null || value === undefined || value === "" ? "—" : String(value);
}

export function createCrudView({ config, onAction = () => {} } = {}) {
  const element = document.createElement("section");
  const header = document.createElement("header");
  const headingGroup = document.createElement("div");
  const title = document.createElement("h1");
  const total = document.createElement("p");
  const createButton = createActionButton({
    action: "create",
    label: "Nuevo registro",
    className: "jc-btn jc-btn--primary",
  });
  const status = document.createElement("div");
  const content = document.createElement("div");
  const pagination = document.createElement("nav");
  let records = [];
  let filteredRecords = [];
  let currentPage = 1;

  element.className = "jc-crud-view";
  element.dataset.moduleKey = config.key;
  header.className = "jc-section-header";
  title.textContent = config.title;
  total.className = "jc-section-header__total";
  status.className = "jc-state";
  status.setAttribute("aria-live", "polite");
  content.className = "jc-records";
  pagination.className = "jc-pagination";
  pagination.setAttribute("aria-label", `Paginación de ${config.title}`);
  headingGroup.append(title, total);
  header.append(headingGroup, createButton);
  element.append(header, status, content, pagination);

  function setStatus(message = "", type = "") {
    status.className = "jc-state";
    if (type) {
      status.classList.add(`jc-state--${type}`);
    }
    status.textContent = message;
    status.hidden = !message;
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
    const details = document.createElement("dl");
    const actions = document.createElement("div");
    article.className = "jc-record-card";
    article.dataset.recordId = String(record.id);
    columns.forEach((column) => {
      const term = document.createElement("dt");
      const description = document.createElement("dd");
      term.textContent = column.label;
      description.textContent = getDisplayValue(record, column);
      details.append(term, description);
    });
    actions.className = "jc-record-card__actions";
    actions.append(
      createActionButton({
        action: "edit",
        label: "Editar",
        className: "jc-btn jc-btn--secondary",
        recordId: record.id,
      }),
      createActionButton({
        action: "delete",
        label: "Eliminar",
        className: "jc-btn jc-btn--danger jc-btn--icon",
        recordId: record.id,
      }),
    );
    article.append(details, actions);
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
        cell.textContent = getDisplayValue(record, column);
        row.append(cell);
      });
      const actionsCell = document.createElement("td");
      actionsCell.className = "jc-table-actions";
      actionsCell.append(
        createActionButton({
          action: "edit",
          label: "Editar",
          className: "jc-btn jc-btn--secondary",
          recordId: record.id,
        }),
        createActionButton({
          action: "delete",
          label: "Eliminar",
          className: "jc-btn jc-btn--danger jc-btn--icon",
          recordId: record.id,
        }),
      );
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
    total.textContent = `${filteredRecords.length} registros`;

    if (pageRecords.length === 0) {
      setStatus("No hay registros para mostrar.", "empty");
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
    filteredRecords = [...nextRecords];
    currentPage = 1;
    renderRecords();
  }

  function filter(query) {
    const normalizedQuery = String(query).trim().toLocaleLowerCase("es");
    const fields = config.searchableFields;
    filteredRecords = normalizedQuery
      ? records.filter((record) => fields.some((field) => String(record[field] ?? "").toLocaleLowerCase("es").includes(normalizedQuery)))
      : [...records];
    currentPage = 1;
    renderRecords();
  }

  function setLoading() {
    content.replaceChildren();
    pagination.hidden = true;
    setStatus("Cargando registros…", "loading");
  }

  function setError(message = "No se pudieron cargar los registros.") {
    content.replaceChildren();
    pagination.hidden = true;
    setStatus(message, "error");
    const retryButton = createActionButton({
      action: "retry",
      label: "Reintentar",
      className: "jc-btn jc-btn--secondary",
    });
    content.append(retryButton);
  }

  element.addEventListener("click", (event) => {
    const actionTarget = event.target.closest("[data-action]");
    if (!actionTarget || !element.contains(actionTarget)) {
      return;
    }
    const recordId = actionTarget.dataset.recordId;
    const record = records.find((item) => String(item.id) === String(recordId));
    onAction({ action: actionTarget.dataset.action, recordId, record });
  });

  setRecords([]);
  return Object.freeze({ element, setRecords, filter, setLoading, setError });
}

export default createCrudView;

