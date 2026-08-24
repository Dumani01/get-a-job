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
  searchableFields: [
    "todo",
    "completed",
    "userId",
  ],
  tableColumns: [
    {
      key: "todo",
      label: "Descripción de la tarea",
    },
    {
      key: "completed",
      label: "Completada",
      render: (record) => (record.completed ? "Sí" : "No"),
    },
    {
      key: "userId",
      label: "ID del reclutador",
    },
  ],
  formFields: [
    {
      name: "todo",
      label: "Descripción de la tarea",
      type: "textarea",
      required: true,
      minLength: 3,
      maxLength: 500,
      rows: 4,
      placeholder: "Describe la tarea del reclutador",
    },
    {
      name: "completed",
      label: "Completada",
      type: "checkbox",
    },
    {
      name: "userId",
      label: "ID del reclutador",
      type: "number",
      required: true,
      min: 1,
      placeholder: "Ej. 1",
    },
  ],
};
