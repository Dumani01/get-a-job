function toObject(formData) {
  return formData instanceof FormData ? Object.fromEntries(formData.entries()) : { ...formData };
}

function normalizeTags(value) {
  if (Array.isArray(value)) {
    return value.map((tag) => String(tag).trim()).filter(Boolean);
  }

  return String(value ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function toPayload(formData) {
  const values = toObject(formData);

  return {
    title: String(values.title ?? "").trim(),
    body: String(values.body ?? "").trim(),
    userId: Number(values.userId),
    tags: normalizeTags(values.tags),
  };
}

export function fromApi(record) {
  return {
    ...record,
    title: String(record.title ?? ""),
    body: String(record.body ?? ""),
    userId: Number(record.userId ?? 0),
    tags: normalizeTags(record.tags),
    reactions: record.reactions ?? { likes: 0, dislikes: 0 },
  };
}

export function toCreatePayload(formData) {
  return toPayload(formData);
}

export function toReplacePayload(formData) {
  return toPayload(formData);
}

export function toUpdatePayload(formData) {
  return toPayload(formData);
}
