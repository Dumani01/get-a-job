const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function required(value, label = "Este campo") {
  return String(value ?? "").trim() ? "" : `${label} es obligatorio.`;
}

export function email(value, label = "Correo") {
  if (!String(value ?? "").trim()) {
    return "";
  }
  return EMAIL_PATTERN.test(String(value).trim()) ? "" : `${label} no tiene un formato válido.`;
}

export function positiveNumber(value, label = "Este valor") {
  if (value === "" || value === null || value === undefined) {
    return "";
  }
  return Number.isFinite(Number(value)) && Number(value) > 0 ? "" : `${label} debe ser un número positivo.`;
}

export function numberRange(value, { label = "Este valor", min, max } = {}) {
  if (value === "" || value === null || value === undefined) {
    return "";
  }

  const number = Number(value);
  if (min !== undefined && number < Number(min)) {
    return `${label} debe ser mayor o igual que ${min}.`;
  }
  if (max !== undefined && number > Number(max)) {
    return `${label} debe ser menor o igual que ${max}.`;
  }
  return "";
}

export function reasonableLength(value, { label = "Este campo", min = 0, max = 500 } = {}) {
  const length = String(value ?? "").trim().length;
  if (length < min) {
    return `${label} debe contener al menos ${min} caracteres.`;
  }
  return length <= max ? "" : `${label} no puede superar ${max} caracteres.`;
}

export function validateField(field, value) {
  const errors = [];

  if (field.required) {
    errors.push(required(value, field.label));
  }
  if (field.type === "email") {
    errors.push(email(value, field.label));
  }
  if (field.type === "number" && value !== "") {
    errors.push(positiveNumber(value, field.label));
    errors.push(numberRange(value, {
      label: field.label,
      min: field.min,
      max: field.max,
    }));
  }
  if (field.minLength || field.maxLength) {
    errors.push(reasonableLength(value, {
      label: field.label,
      min: field.minLength ?? 0,
      max: field.maxLength ?? 500,
    }));
  }

  return errors.filter(Boolean);
}

export function validateForm(fields, values) {
  return fields.reduce((errors, field) => {
    const fieldErrors = validateField(field, values[field.name]);
    if (fieldErrors.length > 0) {
      errors[field.name] = fieldErrors;
    }
    return errors;
  }, {});
}

export default {
  required,
  email,
  positiveNumber,
  numberRange,
  reasonableLength,
  validateField,
  validateForm,
};
