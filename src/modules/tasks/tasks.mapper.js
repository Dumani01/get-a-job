// src/modules/tasks/tasks.mapper.js
// Adapta los registros de DummyJSON (/todos) al dominio de JobConnect.
// Firmas exactas exigidas por el Contrato compartido e inmutable v1.0 (sección 3.4).

/**
 * Convierte un registro crudo de la API en el objeto de dominio usado por la UI.
 * @param {object} record - registro tal como lo devuelve /todos
 */
export function fromApi(record) {
  return {
    id: record.id,
    todo: record.todo ?? "",
    completed: Boolean(record.completed),
    userId: record.userId ?? null,
  };
}

/**
 * Payload para POST /todos/add
 * La API exige explícitamente: todo, completed, userId.
 */
export function toCreatePayload(formData) {
  return {
    todo: formData.todo,
    completed: Boolean(formData.completed),
    userId: Number(formData.userId),
  };
}

/**
 * PUT no es requerido para Tareas según el contrato (tabla 3.5).
 * Se conserva la función por consistencia de forma con el resto de módulos,
 * pero methods.replace está en null en tasks.config.js y no debería invocarse.
 */
export function toReplacePayload(formData) {
  return toCreatePayload(formData);
}

/**
 * Payload para PATCH /todos/:id
 * Solo incluye los campos presentes en formData (actualización parcial).
 */
export function toUpdatePayload(formData) {
  const payload = {};

  if (formData.todo !== undefined) {
    payload.todo = formData.todo;
  }
  if (formData.completed !== undefined) {
    payload.completed = Boolean(formData.completed);
  }
  if (formData.userId !== undefined) {
    payload.userId = Number(formData.userId);
  }

  return payload;
}
