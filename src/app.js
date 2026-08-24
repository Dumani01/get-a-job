import { createAppShell } from "./components/app-shell.js";
import { createConfirmDialog } from "./components/confirm-dialog.js";
import { createCrudView } from "./components/crud-view.js";
import { createFormModal } from "./components/form-modal.js";
import { showToast } from "./components/toast.js";
import { ROUTES } from "./config/app.config.js";
import { MODULES } from "./config/modules.config.js";
import { hasSession, login, logout, register } from "./core/auth-service.js";
import { createHashRouter } from "./core/router.js";
import applicationsModule from "./modules/applications/index.js";
import candidatesModule from "./modules/candidates/index.js";
import companiesModule from "./modules/companies/index.js";
import interviewsModule from "./modules/interviews/index.js";
import tasksModule from "./modules/tasks/index.js";
import vacanciesModule from "./modules/vacancies/index.js";
import { createAuthPage } from "./pages/auth-page.js";
import { createDashboardPage } from "./pages/dashboard-page.js";

const modules = Object.freeze([
  candidatesModule,
  vacanciesModule,
  companiesModule,
  applicationsModule,
  interviewsModule,
  tasksModule,
]);

const modulesByRoute = new Map(modules.map((module) => [module.config.route, module]));

function getErrorMessage(error, fallback) {
  if (error?.status === 401) {
    return "La sesión o las credenciales no son válidas.";
  }
  return error?.message || fallback;
}

function createLoadingState(message) {
  const element = document.createElement("section");
  element.className = "jc-state jc-state--loading jc-page-loading";
  element.setAttribute("role", "status");
  element.textContent = message;
  return element;
}

export function createApp(rootElement) {
  const loadedModuleKeys = new Set();
  let router;

  async function loadModule(module, { force = false } = {}) {
    if (!force && loadedModuleKeys.has(module.config.key)) {
      return module.getRecords();
    }

    const records = await module.list();
    loadedModuleKeys.add(module.config.key);
    return records;
  }

  function renderAuth(mode) {
    if (hasSession()) {
      window.queueMicrotask(() => router.navigate(ROUTES.dashboard, { replace: true }));
      return undefined;
    }

    const page = createAuthPage({
      mode,
      onLogin: async (credentials) => {
        try {
          const user = await login(credentials);
          showToast(`Sesión iniciada como ${user?.firstName ?? user?.username ?? "reclutador"}.`, {
            type: "success",
          });
          router.navigate(ROUTES.dashboard, { replace: true });
        } catch (error) {
          const message = getErrorMessage(error, "No fue posible iniciar sesión.");
          showToast(message, { type: "danger" });
          throw new Error(message);
        }
      },
      onRegister: async (payload) => {
        try {
          await register(payload);
          showToast("DummyJSON simuló el registro; la cuenta no queda persistida en el servidor.", {
            type: "warning",
            duration: 7000,
          });
          router.navigate(ROUTES.login, { replace: true });
        } catch (error) {
          const message = getErrorMessage(error, "No fue posible simular el registro.");
          showToast(message, { type: "danger" });
          throw new Error(message);
        }
      },
    });
    rootElement.replaceChildren(page);
    page.focus({ preventScroll: true });
    return undefined;
  }

  function renderDashboard(shell, isDisposed) {
    shell.setContent(createLoadingState("Cargando métricas del proceso de reclutamiento…"));

    void Promise.allSettled(modules.map((module) => loadModule(module))).then((results) => {
      if (isDisposed()) {
        return;
      }

      const failedRequests = results.filter(({ status }) => status === "rejected").length;
      shell.setContent(createDashboardPage({ modules }));
      if (failedRequests > 0) {
        showToast(`No se pudieron actualizar ${failedRequests} módulos. Se muestran los datos disponibles.`, {
          type: "warning",
        });
      }
    });
  }

  function renderCrudModule(shell, module, setActiveCrudView, registerCleanup, isDisposed) {
    const formModal = createFormModal();
    const confirmDialog = createConfirmDialog();
    let crudView;

    async function refresh({ force = false } = {}) {
      try {
        crudView.setLoading();
        const records = await loadModule(module, { force });
        if (!isDisposed()) {
          crudView.setRecords(records);
        }
      } catch (error) {
        if (!isDisposed()) {
          crudView.setError(getErrorMessage(error, `No se pudieron cargar ${module.config.title}.`));
        }
      }
    }

    function openForm({ record = {}, operation = "create" } = {}) {
      const isCreate = operation === "create";
      const actionLabel = isCreate
        ? `Nueva ${module.config.singular}`
        : operation === "update"
          ? `Actualizar parcialmente ${module.config.singular}`
          : `Editar ${module.config.singular}`;

      formModal.open({
        title: actionLabel,
        fields: module.config.formFields,
        values: record,
        onSubmit: async (values) => {
          try {
            if (isCreate) {
              await module.create(values);
            } else {
              await module[operation](record.id, values);
            }
            showToast(`${module.config.singular} ${isCreate ? "creado" : "actualizado"} correctamente.`, {
              type: "success",
            });
          } catch (error) {
            const message = getErrorMessage(error, `No se pudo guardar ${module.config.singular.toLocaleLowerCase("es")}.`);
            showToast(message, { type: "danger" });
            throw new Error(message);
          }
        },
      });
    }

    async function removeRecord(record) {
      const confirmed = await confirmDialog.open({
        title: `Eliminar ${module.config.singular.toLocaleLowerCase("es")}`,
        message: "DummyJSON simulará la eliminación y el registro desaparecerá durante esta sesión.",
      });
      if (!confirmed) {
        return;
      }

      try {
        crudView.setRecordBusy(record.id, true);
        await module.remove(record.id);
        showToast(`${module.config.singular} eliminado correctamente.`, { type: "success" });
      } catch (error) {
        const message = getErrorMessage(error, `No se pudo eliminar ${module.config.singular.toLocaleLowerCase("es")}.`);
        showToast(message, { type: "danger" });
      } finally {
        if (!isDisposed()) {
          crudView.setRecordBusy(record.id, false);
        }
      }
    }

    function handleAction({ action, operation, record }) {
      if (action === "retry") {
        void refresh({ force: true });
      } else if (action === "create") {
        openForm({ operation: "create" });
      } else if (action === "edit" && record) {
        openForm({ record, operation: operation || "update" });
      } else if (action === "delete" && record) {
        void removeRecord(record);
      }
    }

    crudView = createCrudView({ config: module.config, onAction: handleAction });
    const unsubscribe = module.onChange((records) => {
      if (!isDisposed()) {
        crudView.setRecords(records);
      }
    });
    setActiveCrudView(crudView);
    shell.setContent(crudView.element);
    registerCleanup(() => {
      unsubscribe();
      formModal.destroy();
      confirmDialog.destroy();
    });
    void refresh();
  }

  function renderPrivate(route) {
    let disposed = false;
    let activeCrudView = null;
    const cleanups = [];
    const shell = createAppShell({
      activeRoute: route,
      searchEnabled: route !== ROUTES.dashboard,
      onSearch: (query) => activeCrudView?.filter(query),
      onLogout: () => {
        loadedModuleKeys.clear();
        logout();
        showToast("La sesión se cerró correctamente.", { type: "success" });
        router.navigate(ROUTES.login, { replace: true });
      },
    });

    rootElement.replaceChildren(shell.element);

    if (route === ROUTES.dashboard) {
      renderDashboard(shell, () => disposed);
    } else {
      const module = modulesByRoute.get(route);
      if (!module) {
        window.queueMicrotask(() => router.navigate(ROUTES.dashboard, { replace: true }));
        return () => shell.destroy();
      }
      renderCrudModule(
        shell,
        module,
        (view) => {
          activeCrudView = view;
        },
        (cleanup) => cleanups.push(cleanup),
        () => disposed,
      );
    }

    return () => {
      disposed = true;
      cleanups.forEach((cleanup) => cleanup());
      shell.destroy();
    };
  }

  const routes = {
    [ROUTES.login]: () => renderAuth("login"),
    [ROUTES.register]: () => renderAuth("register"),
    [ROUTES.dashboard]: () => renderPrivate(ROUTES.dashboard),
  };

  MODULES.forEach((moduleConfig) => {
    routes[moduleConfig.route] = () => renderPrivate(moduleConfig.route);
  });

  router = createHashRouter({
    routes,
    canAccessPrivateRoute: hasSession,
  });

  return Object.freeze({
    start: router.start,
    stop: router.stop,
    navigate: router.navigate,
  });
}

export default createApp;
