export default {
  key: "applications",
  title: "Postulaciones",
  singular: "Postulación",
  route: "#/postulaciones",
  endpoint: "/posts",
  createEndpoint: "/posts/add",
  responseKey: "posts",
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

