export function createCombinationLock({ value = "", onChange = () => {} } = {}) {
  const field = document.createElement("div");
  field.className = "jc-portal-combination-lock";

  const label = document.createElement("label");
  label.className = "jc-portal-combination-lock-label";
  label.htmlFor = "jc-portal-combination-lock-input";
  label.textContent = "Clave";

  const input = document.createElement("input");
  input.className = "jc-portal-combination-lock-input";
  input.id = "jc-portal-combination-lock-input";
  input.type = "password";
  input.autocomplete = "current-password";
  input.value = value;

  input.addEventListener("input", () => {
    const detail = { value: input.value };
    onChange(detail.value);
    field.dispatchEvent(new CustomEvent("lock-change", { bubbles: true, detail }));
  });

  field.append(label, input);
  return field;
}
