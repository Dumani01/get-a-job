function createSearchIcon() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  const handle = document.createElementNS("http://www.w3.org/2000/svg", "path");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  circle.setAttribute("cx", "10.5");
  circle.setAttribute("cy", "10.5");
  circle.setAttribute("r", "6.5");
  handle.setAttribute("d", "m15.5 15.5 4.5 4.5");
  svg.append(circle, handle);
  return svg;
}

function createClearIcon() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  path.setAttribute("d", "m7 7 10 10M17 7 7 17");
  svg.append(path);
  return svg;
}

export function createSearchBar({ onSearch = () => {} } = {}) {
  const form = document.createElement("form");
  const label = document.createElement("label");
  const corner = document.createElement("span");
  const icon = document.createElement("span");
  const input = document.createElement("input");
  const status = document.createElement("span");
  const statusDot = document.createElement("span");
  const clearButton = document.createElement("button");

  form.className = "jc-search";
  form.setAttribute("role", "search");
  label.className = "jc-search__label";
  label.htmlFor = "jobconnect-search";
  label.textContent = "QUEST LOG /";
  corner.className = "jc-search__corner";
  corner.setAttribute("aria-hidden", "true");
  icon.className = "jc-search__icon";
  icon.append(createSearchIcon());
  input.className = "jc-search__input";
  input.id = "jobconnect-search";
  input.name = "search";
  input.type = "search";
  input.placeholder = "Buscar registros...";
  input.autocomplete = "off";
  status.className = "jc-search__status";
  statusDot.className = "jc-search__status-dot";
  status.append(statusDot, "ONLINE");
  clearButton.className = "jc-search__clear";
  clearButton.type = "button";
  clearButton.setAttribute("aria-label", "Limpiar búsqueda");
  clearButton.title = "Limpiar búsqueda";
  clearButton.append(createClearIcon());

  input.addEventListener("input", () => {
    form.classList.toggle("has-value", input.value.length > 0);
    onSearch(input.value.trim());
  });
  clearButton.addEventListener("click", () => {
    input.value = "";
    form.classList.remove("has-value");
    input.focus();
    onSearch("");
  });
  form.addEventListener("submit", (event) => event.preventDefault());
  form.append(label, corner, icon, input, status, clearButton);

  function setExpanded(expanded) {
    form.classList.toggle("is-expanded", expanded);
  }

  function setValue(value = "") {
    input.value = value;
    form.classList.toggle("has-value", input.value.length > 0);
  }

  function setDisabled(disabled) {
    input.disabled = disabled;
    clearButton.disabled = disabled;
    form.hidden = disabled;
  }

  return Object.freeze({ element: form, input, setExpanded, setValue, setDisabled });
}

export default createSearchBar;
