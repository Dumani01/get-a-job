function toObject(formData) {
  return formData instanceof FormData ? Object.fromEntries(formData.entries()) : { ...formData };
}

function toPayload(formData) {
  const values = toObject(formData);

  return {
    body: String(values.body ?? "").trim(),
    postId: Number(values.postId),
    userId: Number(values.userId),
  };
}

export function fromApi(record) {
  return {
    ...record,
    body: String(record.body ?? ""),
    postId: Number(record.postId ?? 0),
    userId: Number(record.userId ?? record.user?.id ?? 0),
    likes: Number(record.likes ?? 0),
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
