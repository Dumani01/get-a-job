function toObject(formData) {
  return formData instanceof FormData
    ? Object.fromEntries(formData.entries())
    : { ...formData };
}

function normalizeTask(record) {
  return {
    ...record,
    id: Number(record.id),
    todo: String(record.todo ?? ""),
    completed: Boolean(record.completed),
    userId: Number(record.userId),
  };
}

function normalizePayload(formData) {
  const data = toObject(formData);

  return {
    todo: String(data.todo ?? "").trim(),
    completed: Boolean(data.completed),
    userId: Number(data.userId),
  };
}

export function fromApi(record) {
  return normalizeTask(record);
}

export function toCreatePayload(formData) {
  return normalizePayload(formData);
}

export function toReplacePayload(formData) {
  return normalizePayload(formData);
}

export function toUpdatePayload(formData) {
  return normalizePayload(formData);
}
