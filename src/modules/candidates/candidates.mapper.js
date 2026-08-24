function toObject(formData) {
  return formData instanceof FormData ? Object.fromEntries(formData.entries()) : { ...formData };
}

export function fromApi(record) {
  const candidate = { ...record };

  if (Object.hasOwn(record, "id")) {
    candidate.id = Number(record.id);
  }
  if (Object.hasOwn(record, "age")) {
    candidate.age = Number(record.age);
  }
  if (record.company || Object.hasOwn(record, "companyName")) {
    candidate.companyName = String(record.company?.name ?? record.companyName ?? "");
  }
  if (record.company || Object.hasOwn(record, "companyTitle")) {
    candidate.companyTitle = String(record.company?.title ?? record.companyTitle ?? "");
  }

  return candidate;
}

function toPayload(formData) {
  const values = toObject(formData);
  return {
    firstName: String(values.firstName ?? "").trim(),
    lastName: String(values.lastName ?? "").trim(),
    email: String(values.email ?? "").trim(),
    phone: String(values.phone ?? "").trim(),
    age: Number(values.age),
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
