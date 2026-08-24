export default {
  key: "tasks",
  title: "Tareas del reclutador",
  singular: "Tarea",
  route: "#/tareas",
  endpoint: "/todos",
  createEndpoint: "/todos/add",
  responseKey: "todos",
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

