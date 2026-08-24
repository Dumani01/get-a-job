function toObject(formData) {
  return formData instanceof FormData ? Object.fromEntries(formData.entries()) : { ...formData };
}

function toPayload(formData) {
  const values = toObject(formData);

  return {
    title: String(values.title ?? "").trim(),
    description: String(values.description ?? "").trim(),
    category: String(values.category ?? "").trim(),
    price: Number(values.price),
    stock: Number(values.stock),
    brand: String(values.brand ?? "").trim(),
  };
}

export function fromApi(record) {
  return {
    ...record,
    title: String(record.title ?? ""),
    description: String(record.description ?? ""),
    category: String(record.category ?? ""),
    price: Number(record.price ?? 0),
    stock: Number(record.stock ?? 0),
    brand: String(record.brand ?? ""),
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
