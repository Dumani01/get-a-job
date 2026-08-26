const NUMERIC_LENGTH = 4;
const DIGIT_COUNT = 10;

function normalizeDigit(value) {
  return (value + DIGIT_COUNT) % DIGIT_COUNT;
}

export function createCombinationLock({ mode = "numeric", allowAlphanumeric = true } = {}) {
  const element = document.createElement("div");
  const header = document.createElement("div");
  const label = document.createElement("span");
  const modeBadge = document.createElement("span");
  const controls = document.createElement("div");
  const hint = document.createElement("p");
  const toggleButton = document.createElement("button");
  let activeMode = mode === "alphanumeric" && allowAlphanumeric ? "alphanumeric" : "numeric";
  let password = "";
  let digits = Array(NUMERIC_LENGTH).fill(0);
  let wheelRenderers = [];

  element.className = "jc-combination-lock";
  element.setAttribute("role", "group");
  element.setAttribute("aria-labelledby", "jobconnect-lock-label");
  header.className = "jc-combination-lock__header";
  label.id = "jobconnect-lock-label";
  label.className = "jc-combination-lock__label";
  label.textContent = "PIN de acceso";
  modeBadge.className = "jc-combination-lock__mode";
  controls.className = "jc-combination-lock__controls";
  hint.className = "jc-combination-lock__hint";
  toggleButton.className = "jc-combination-lock__toggle";
  toggleButton.type = "button";
  header.append(label, modeBadge);

  function emitChange() {
    element.dispatchEvent(new CustomEvent("lock-change", {
      bubbles: true,
      detail: { value: password, mode: activeMode },
    }));
  }

  function updatePasswordFromDigits() {
    password = digits.join("");
    emitChange();
  }

  function setDigit(index, difference, direction = difference >= 0 ? "up" : "down") {
    digits[index] = normalizeDigit(digits[index] + difference);
    wheelRenderers[index]?.(direction);
    updatePasswordFromDigits();
  }

  function createWheel(index) {
    const group = document.createElement("div");
    const increaseButton = document.createElement("button");
    const viewport = document.createElement("button");
    const strip = document.createElement("span");
    const previous = document.createElement("span");
    const current = document.createElement("strong");
    const next = document.createElement("span");
    const decreaseButton = document.createElement("button");
    let animationTimer = 0;

    group.className = "jc-lock-wheel";
    increaseButton.className = "jc-lock-wheel__control";
    increaseButton.type = "button";
    increaseButton.setAttribute("aria-label", `Aumentar dígito ${index + 1}`);
    increaseButton.title = `Aumentar dígito ${index + 1}`;
    increaseButton.textContent = "+";
    viewport.className = "jc-lock-wheel__viewport";
    viewport.type = "button";
    viewport.setAttribute("role", "spinbutton");
    viewport.setAttribute("aria-label", `Dígito ${index + 1}`);
    viewport.setAttribute("aria-valuemin", "0");
    viewport.setAttribute("aria-valuemax", "9");
    strip.className = "jc-lock-wheel__strip";
    previous.className = "jc-lock-wheel__neighbor";
    current.className = "jc-lock-wheel__current";
    next.className = "jc-lock-wheel__neighbor";
    decreaseButton.className = "jc-lock-wheel__control";
    decreaseButton.type = "button";
    decreaseButton.setAttribute("aria-label", `Disminuir dígito ${index + 1}`);
    decreaseButton.title = `Disminuir dígito ${index + 1}`;
    decreaseButton.textContent = "-";

    function render(direction = "") {
      const value = digits[index];
      previous.textContent = String(normalizeDigit(value - 1));
      current.textContent = String(value);
      next.textContent = String(normalizeDigit(value + 1));
      viewport.setAttribute("aria-valuenow", String(value));
      viewport.setAttribute("aria-valuetext", `Dígito ${value}`);
      strip.classList.remove("is-turning-up", "is-turning-down");
      window.clearTimeout(animationTimer);
      if (direction) {
        void strip.offsetWidth;
        strip.classList.add(direction === "up" ? "is-turning-up" : "is-turning-down");
        animationTimer = window.setTimeout(() => {
          strip.classList.remove("is-turning-up", "is-turning-down");
        }, 180);
      }
    }

    increaseButton.addEventListener("click", () => setDigit(index, 1, "up"));
    decreaseButton.addEventListener("click", () => setDigit(index, -1, "down"));
    viewport.addEventListener("click", () => setDigit(index, 1, "up"));
    viewport.addEventListener("wheel", (event) => {
      event.preventDefault();
      setDigit(index, event.deltaY > 0 ? 1 : -1, event.deltaY > 0 ? "up" : "down");
    }, { passive: false });
    viewport.addEventListener("keydown", (event) => {
      if (event.key === "ArrowUp" || event.key === "ArrowRight") {
        event.preventDefault();
        setDigit(index, 1, "up");
      } else if (event.key === "ArrowDown" || event.key === "ArrowLeft") {
        event.preventDefault();
        setDigit(index, -1, "down");
      } else if (/^[0-9]$/.test(event.key)) {
        event.preventDefault();
        digits[index] = Number(event.key);
        render("up");
        updatePasswordFromDigits();
      }
    });

    strip.append(previous, current, next);
    viewport.append(strip);
    group.append(increaseButton, viewport, decreaseButton);
    render();
    wheelRenderers[index] = render;
    return group;
  }

  function renderControls() {
    controls.replaceChildren();
    wheelRenderers = [];
    element.dataset.mode = activeMode;
    modeBadge.textContent = activeMode === "numeric" ? "COMBINACION" : "TEXTO";

    if (activeMode === "numeric") {
      controls.className = "jc-combination-lock__controls";
      digits.forEach((_, index) => controls.append(createWheel(index)));
      label.textContent = "PIN de acceso";
      hint.textContent = "Elige los 4 digitos con los controles del candado.";
      toggleButton.textContent = "Usar contrasena normal";
      return;
    }

    controls.className = "jc-combination-lock__controls is-alphanumeric";
    const inputWrapper = document.createElement("label");
    const inputIcon = document.createElement("span");
    const input = document.createElement("input");
    inputWrapper.className = "jc-combination-lock__text-field";
    inputIcon.className = "jc-combination-lock__key-icon";
    inputIcon.setAttribute("aria-hidden", "true");
    inputIcon.textContent = "KEY";
    input.className = "jc-input jc-combination-lock__text-input";
    input.type = "password";
    input.name = "password";
    input.autocomplete = "current-password";
    input.placeholder = "Escribe la clave de prueba";
    input.setAttribute("aria-label", "Clave alfanumérica");
    input.setAttribute("aria-required", "true");
    input.value = password;
    input.addEventListener("input", () => {
      password = input.value;
      emitChange();
    });
    inputWrapper.append(inputIcon, input);
    controls.append(inputWrapper);
    label.textContent = "Contrasena normal";
    hint.textContent = "Tambien puedes iniciar sesion con tu contrasena normal.";
    toggleButton.textContent = "Usar PIN con el candado";
  }

  function setMode(nextMode) {
    const requestedMode = nextMode === "alphanumeric" && allowAlphanumeric ? "alphanumeric" : "numeric";
    activeMode = requestedMode;
    password = "";
    digits = Array(NUMERIC_LENGTH).fill(0);
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
    controls.querySelector("button, input")?.focus();
  });

  element.append(header, controls, hint);
  if (allowAlphanumeric) {
    element.append(toggleButton);
  }
  renderControls();

  return Object.freeze({ element, clear, setMode, getValue: () => password, getMode: () => activeMode });
}

export default createCombinationLock;
