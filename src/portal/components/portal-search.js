export function createPortalSearch({ value = "", onSubmit = () => {} } = {}) {
  const form = document.createElement("form");
  form.className = "jc-portal-search";
  form.setAttribute("role", "search");

  const label = document.createElement("label");
  label.className = "jc-portal-search-label";
  label.htmlFor = "jc-portal-search-input";
  label.textContent = "Buscar empleos";

  const input = document.createElement("input");
  input.className = "jc-portal-search-input";
  input.id = "jc-portal-search-input";
  input.name = "search";
  input.type = "search";
  input.value = value;
  input.placeholder = "Puesto, empresa, palabra clave o ubicación";

  const button = document.createElement("button");
  button.className = "jc-portal-search-button";
  button.type = "submit";
  button.textContent = "Buscar";

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    onSubmit(input.value.trim());
  });

  form.append(label, input, button);
  return form;
}
