function toObject(formData) {
  return formData instanceof FormData ? Object.fromEntries(formData.entries()) : { ...formData };
}

export function fromApi(record) {
  const company = { ...record };
  const products = Array.isArray(record.products) ? record.products : null;

  if (Object.hasOwn(record, "id")) {
    company.id = Number(record.id);
  }
  if (Object.hasOwn(record, "userId")) {
    company.userId = Number(record.userId);
  }
  if (products) {
    company.products = products;
    company.vacancyId = Number(products[0]?.id ?? 0);
    company.quantity = Number(products[0]?.quantity ?? 0);
    company.totalProducts = Number(record.totalProducts ?? products.length);
    company.totalQuantity = Number(
      record.totalQuantity ?? products.reduce((total, product) => total + Number(product.quantity ?? 0), 0),
    );
  }
  if (Object.hasOwn(record, "total")) {
    company.total = Number(record.total);
  }

  return company;
}

function toPayload(formData) {
  const values = toObject(formData);
  return {
    userId: Number(values.userId),
    products: [
      {
        id: Number(values.vacancyId),
        quantity: Number(values.quantity),
      },
    ],
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
