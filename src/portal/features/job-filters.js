const filterOptions = Object.freeze({
  province: ["San José", "Heredia", "Alajuela", "Cartago", "Puntarenas", "Guanacaste", "Limón"],
  workMode: ["remote", "hybrid", "onsite"],
  category: ["Tecnología", "Soporte", "Administración", "Finanzas", "Logística", "Manufactura", "Servicio al cliente", "Pasantías"],
});

function createFilterGroup(key, label, options, selected, onChange) {
  const fieldset = document.createElement("fieldset");
  fieldset.className = "jc-portal-filter-group";

  const legend = document.createElement("legend");
  legend.textContent = label;
  fieldset.append(legend);

  options.forEach((option) => {
    const labelElement = document.createElement("label");
    labelElement.className = "jc-portal-filter-option";

    const input = document.createElement("input");
    input.className = "jc-portal-filter-checkbox";
    input.type = "radio";
    input.name = key;
    input.value = option;
    input.checked = selected === option;
    input.addEventListener("change", () => onChange(key, option));

    const text = document.createElement("span");
    text.textContent = option.replaceAll("-", " ");
    labelElement.append(input, text);
    fieldset.append(labelElement);
  });

  return fieldset;
}

export function createJobFilters({ filters = {}, onChange = () => {} } = {}) {
  const section = document.createElement("section");
  section.className = "jc-portal-job-filters";
  section.setAttribute("aria-labelledby", "jc-portal-job-filters-title");

  const heading = document.createElement("h2");
  heading.className = "jc-portal-job-filters-title";
  heading.textContent = "Filtros de empleo";
  heading.id = "jc-portal-job-filters-title";

  const clearButton = document.createElement("button");
  clearButton.className = "jc-portal-btn jc-portal-btn--secondary";
  clearButton.type = "button";
  clearButton.textContent = "Limpiar filtros";
  clearButton.addEventListener("click", () => onChange("clear"));

  const groups = document.createElement("div");
  groups.className = "jc-portal-filter-groups";
  groups.append(
    createFilterGroup("province", "Provincia", filterOptions.province, filters.province, onChange),
    createFilterGroup("workMode", "Modalidad", filterOptions.workMode, filters.workMode, onChange),
    createFilterGroup("category", "Categoría", filterOptions.category, filters.category, onChange),
  );

  section.append(heading, clearButton, groups);
  return section;
}
