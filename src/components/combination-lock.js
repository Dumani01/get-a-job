const NUMERIC_LENGTH = 4;

export function createCombinationLock({ mode = "numeric" } = {}) {
  const element = document.createElement("div");
  const label = document.createElement("span");
  const controls = document.createElement("div");
  const toggleButton = document.createElement("button");
  let activeMode = mode === "alphanumeric" ? "alphanumeric" : "numeric";
  let password = "";
  let digits = Array(NUMERIC_LENGTH).fill(0);

  element.className = "jc-combination-lock";
  label.className = "jc-combination-lock__label";
  label.textContent = "Clave de acceso";
  controls.className = "jc-combination-lock__controls";
  toggleButton.className = "jc-btn jc-btn--secondary jc-combination-lock__toggle";
  toggleButton.type = "button";

  function emitChange() {
    element.dispatchEvent(
      new CustomEvent("lock-change", {
        bubbles: true,
        detail: { value: password },
      }),
    );
  }

  function updateDigit(index, difference) {
    digits[index] = (digits[index] + difference + 10) % 10;
    password = digits.join("");
    renderControls();
    emitChange();
  }

  function createDigitControl(value, index) {
    const group = document.createElement("div");
    const increaseButton = document.createElement("button");
    const digit = document.createElement("output");
    const decreaseButton = document.createElement("button");

    group.className = "jc-combination-lock__digit";
    increaseButton.type = "button";
    increaseButton.setAttribute("aria-label", `Aumentar dígito ${index + 1}`);
    increaseButton.title = `Aumentar dígito ${index + 1}`;
    increaseButton.textContent = "+";
    digit.setAttribute("aria-label", `Dígito ${index + 1}`);
    digit.textContent = String(value);
    decreaseButton.type = "button";
    decreaseButton.setAttribute("aria-label", `Disminuir dígito ${index + 1}`);
    decreaseButton.title = `Disminuir dígito ${index + 1}`;
    decreaseButton.textContent = "−";
    increaseButton.addEventListener("click", () => updateDigit(index, 1));
    decreaseButton.addEventListener("click", () => updateDigit(index, -1));
    group.append(increaseButton, digit, decreaseButton);
    return group;
  }

  function renderControls() {
    controls.replaceChildren();

    if (activeMode === "numeric") {
      digits.forEach((value, index) => controls.append(createDigitControl(value, index)));
      toggleButton.textContent = "Usar clave alfanumérica de prueba";
      return;
    }

    const input = document.createElement("input");
    input.className = "jc-input";
    input.type = "password";
    input.name = "password";
    input.autocomplete = "current-password";
    input.placeholder = "Escribí la clave de prueba";
    input.setAttribute("aria-label", "Clave alfanumérica");
    input.value = password;
    input.addEventListener("input", () => {
      password = input.value;
      emitChange();
    });
    controls.append(input);
    toggleButton.textContent = "Usar combinación numérica";
  }

  function setMode(nextMode) {
    activeMode = nextMode === "alphanumeric" ? "alphanumeric" : "numeric";
    password = activeMode === "numeric" ? digits.join("") : "";
    renderControls();
    emitChange();
  }

  function clear() {
    password = "";
    digits = Array(NUMERIC_LENGTH).fill(0);
    renderControls();
    emitChange();
  }

  toggleButton.addEventListener("click", () => {
    setMode(activeMode === "numeric" ? "alphanumeric" : "numeric");
  });
  element.append(label, controls, toggleButton);
  setMode(activeMode);

  return Object.freeze({ element, clear, setMode, getValue: () => password });
}

export default createCombinationLock;

