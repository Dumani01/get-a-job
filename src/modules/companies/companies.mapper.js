function toObject(formData) {
  return formData instanceof FormData ? Object.fromEntries(formData.entries()) : { ...formData };
}

export function fromApi(record) {
  return { ...record };
}

export function toCreatePayload(formData) {
  return toObject(formData);
}

export function toReplacePayload(formData) {
  return toObject(formData);
}

export function toUpdatePayload(formData) {
  return toObject(formData);
}

