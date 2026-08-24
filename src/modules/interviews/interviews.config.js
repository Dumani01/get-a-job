export default {
  key: "interviews",
  title: "Entrevistas",
  singular: "Entrevista",
  route: "#/entrevistas",
  endpoint: "/comments",
  createEndpoint: "/comments/add",
  responseKey: "comments",
  methods: {
    create: "POST",
    replace: null,
    update: "PATCH",
    remove: "DELETE",
  },
  searchableFields: [],
  tableColumns: [],
  formFields: [],
};

