// src/modules/tasks/tasks.config.js
// Config del módulo "Tareas del reclutador" según el Contrato compartido e inmutable v1.0
// Endpoint base: /todos (DummyJSON). PUT no es requerido para este módulo (ver tabla 3.5 del contrato).

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
    replace: null, // PUT no requerido para Tareas según el contrato (tabla 3.5)
    update: "PATCH",
    remove: "DELETE",
  },
  searchableFields: ["todo"],
  tableColumns: [
    { key: "todo", label: "Descripción de la tarea" },
    { key: "completed", label: "Completada" },
    { key: "userId", label: "ID del reclutador" },
  ],
  formFields: [
    {
      name: "todo",
      label: "Descripción de la tarea",
      type: "text",
      required: true,
      maxLength: 200,
    },
    {
      name: "userId",
      label: "ID del reclutador",
      type: "number",
      required: true,
      min: 1,
    },
    {
      name: "completed",
      label: "Completada",
      type: "checkbox",
      required: false,
    },
  ],
};
