export default {
  key: "vacancies",
  title: "Vacantes",
  singular: "Vacante",
  route: "#/vacantes",
  endpoint: "/products",
  createEndpoint: "/products/add",
  responseKey: "products",
  methods: {
    create: "POST",
    replace: "PUT",
    update: "PATCH",
    remove: "DELETE",
  },
  searchableFields: [],
  tableColumns: [],
  formFields: [],
};

