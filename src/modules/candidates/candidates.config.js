export default {
  key: "candidates",
  title: "Candidatos",
  singular: "Candidato",
  route: "#/candidatos",
  endpoint: "/users",
  createEndpoint: "/users/add",
  responseKey: "users",
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

