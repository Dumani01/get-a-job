export function createSearchBar({ onSearch = () => {} } = {}) {
  const form = document.createElement("form");
  const label = document.createElement("label");
  const input = document.createElement("input");
  const clearButton = document.createElement("button");

  form.className = "jc-search";
  form.setAttribute("role", "search");
  label.className = "jc-visually-hidden";
  label.htmlFor = "jobconnect-search";
  label.textContent = "Buscar en el módulo activo";
  input.className = "jc-input";
  input.id = "jobconnect-search";
  input.name = "search";
  input.type = "search";
  input.placeholder = "Buscar en el módulo activo";
  input.autocomplete = "off";
  clearButton.className = "jc-btn jc-btn--secondary jc-btn--icon";
  clearButton.type = "button";
  clearButton.setAttribute("aria-label", "Limpiar búsqueda");
  clearButton.title = "Limpiar búsqueda";
  clearButton.textContent = "×";

  input.addEventListener("input", () => onSearch(input.value.trim()));
  clearButton.addEventListener("click", () => {
    input.value = "";
    input.focus();
    onSearch("");
  });
  form.addEventListener("submit", (event) => event.preventDefault());
  form.append(label, input, clearButton);

  function setExpanded(expanded) {
    form.classList.toggle("is-expanded", expanded);
  }

  function setValue(value = "") {
    input.value = value;
  }

  return Object.freeze({ element: form, input, setExpanded, setValue });
}

export default createSearchBar;

