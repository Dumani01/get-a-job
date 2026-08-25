import { PORTAL_CONFIG } from "../config/portal.config.js";
import { createPortalEmptyState } from "../components/portal-empty-state.js";
import { createPortalSearch } from "../components/portal-search.js";
import { createJobCard } from "../features/job-card.js";
import { createJobFilters } from "../features/job-filters.js";
import { jobsRepository } from "../core/jobs-repository.js";

function getQuery() {
  return new URLSearchParams(window.location.hash.split("?")[1] ?? "");
}

function sortJobs(jobs, order) {
  return [...jobs].sort((first, second) => {
    if (order === "salary") {
      return (second.salary?.max ?? 0) - (first.salary?.max ?? 0);
    }

    if (order === "recent") {
      return new Date(second.publishedAt) - new Date(first.publishedAt);
    }

    return Number(second.featured) - Number(first.featured) || new Date(second.publishedAt) - new Date(first.publishedAt);
  });
}

function createPagination(currentPage, totalPages, onChange) {
  const navigation = document.createElement("nav");
  navigation.className = "jc-portal-pagination";
  navigation.setAttribute("aria-label", "Paginación de empleos");

  const createButton = (label, page, disabled = false) => {
    const button = document.createElement("button");
    button.className = `jc-portal-pagination-button${page === currentPage ? " jc-portal-pagination-button--active" : ""}`;
    button.type = "button";
    button.textContent = label;
    button.disabled = disabled;
    button.setAttribute("aria-label", `Página ${label}`);
    if (page === currentPage) button.setAttribute("aria-current", "page");
    button.addEventListener("click", () => onChange(page));
    return button;
  };

  navigation.append(createButton("Anterior", currentPage - 1, currentPage === 1));
  for (let page = 1; page <= totalPages; page += 1) {
    navigation.append(createButton(String(page), page, false));
  }
  navigation.append(createButton("Siguiente", currentPage + 1, currentPage === totalPages));
  return navigation;
}

export function createJobsPage() {
  const state = { filters: { status: "active" }, order: "relevance", page: 1 };
  const section = document.createElement("section");
  section.className = "jc-portal-page jc-portal-jobs-page";

  const heading = document.createElement("h1");
  heading.className = "jc-portal-page-title";
  heading.textContent = "Empleos";

  const intro = document.createElement("p");
  intro.className = "jc-portal-page-message";
  intro.textContent = "Explora oportunidades demostrativas en Costa Rica.";

  const query = getQuery();
  state.filters.search = query.get("search") ?? "";

  const search = createPortalSearch({
    value: state.filters.search,
    onSubmit(value) {
      state.filters.search = value;
      state.page = 1;
      renderResults();
    },
  });

  const order = document.createElement("select");
  order.className = "jc-portal-sort-select";
  order.setAttribute("aria-label", "Ordenar empleos");
  [["relevance", "Relevancia"], ["recent", "Más recientes"], ["salary", "Mayor salario"]].forEach(([value, label]) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    order.append(option);
  });
  order.addEventListener("change", () => { state.order = order.value; state.page = 1; renderResults(); });

  const content = document.createElement("div");
  content.className = "jc-portal-jobs-layout";
  const results = document.createElement("div");
  results.className = "jc-portal-jobs-results";
  const resultsHeader = document.createElement("div");
  resultsHeader.className = "jc-portal-results-header";
  const count = document.createElement("p");
  count.className = "jc-portal-results-count";
  resultsHeader.append(count, order);
  const cards = document.createElement("div");
  cards.className = "jc-portal-job-grid";
  const pagination = document.createElement("div");

  const renderResults = () => {
    const jobs = sortJobs(jobsRepository.list(state.filters), state.order);
    const totalPages = Math.max(1, Math.ceil(jobs.length / PORTAL_CONFIG.pageSize));
    state.page = Math.min(state.page, totalPages);
    const start = (state.page - 1) * PORTAL_CONFIG.pageSize;
    count.textContent = `${jobs.length} ofertas encontradas`;
    cards.replaceChildren(...jobs.slice(start, start + PORTAL_CONFIG.pageSize).map(createJobCard));
    if (jobs.length === 0) cards.append(createPortalEmptyState());
    pagination.replaceChildren(createPagination(state.page, totalPages, (page) => { state.page = page; renderResults(); }));
  };

  content.append(createJobFilters({ filters: state.filters, onChange(key, value) {
    if (key === "clear") state.filters = { status: "active" };
    else state.filters[key] = value;
    state.page = 1;
    renderResults();
  } }), results);
  results.append(resultsHeader, cards, pagination);
  section.append(heading, intro, search, content);
  renderResults();

  return section;
}
