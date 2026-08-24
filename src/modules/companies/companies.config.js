export default {
  key: "companies",
  title: "Empresas clientes",
  singular: "Empresa cliente",
  route: "#/empresas",
  endpoint: "/carts",
  createEndpoint: "/carts/add",
  responseKey: "carts",
  methods: {
    create: "POST",
    replace: "PUT",
    update: null,
    remove: "DELETE",
  },
  searchableFields: [],
  tableColumns: [],
  formFields: [],
};

