const sharedMethods = Object.freeze({
  create: "POST",
  replace: "PUT",
  update: "PATCH",
  remove: "DELETE",
});

const modules = Object.freeze([
  {
    key: "candidates",
    title: "Candidatos",
    singular: "Candidato",
    route: "#/candidatos",
    endpoint: "/users",
    createEndpoint: "/users/add",
    responseKey: "users",
    methods: { ...sharedMethods },
  },
  {
    key: "vacancies",
    title: "Vacantes",
    singular: "Vacante",
    route: "#/vacantes",
    endpoint: "/products",
    createEndpoint: "/products/add",
    responseKey: "products",
    methods: { ...sharedMethods },
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
]);

export const MODULES = modules;

export function getModuleConfig(moduleKey) {
  return modules.find(({ key }) => key === moduleKey) ?? null;
}

export function getModuleConfigByRoute(route) {
  return modules.find((moduleConfig) => moduleConfig.route === route) ?? null;
}

export default modules;

