import { ROUTES } from "./config/app.config.js";
import { MODULES } from "./config/modules.config.js";
import { createAppShell } from "./components/app-shell.js";
import { createCrudView } from "./components/crud-view.js";
import { createHashRouter } from "./core/router.js";
import { hasSession, logout } from "./core/auth-service.js";
import applicationsModule from "./modules/applications/index.js";
import candidatesModule from "./modules/candidates/index.js";
import companiesModule from "./modules/companies/index.js";
import interviewsModule from "./modules/interviews/index.js";
import tasksModule from "./modules/tasks/index.js";
import vacanciesModule from "./modules/vacancies/index.js";
import { createAuthPage } from "./pages/auth-page.js";
import { createDashboardPage } from "./pages/dashboard-page.js";

const modulesByRoute = new Map([
  [candidatesModule.config.route, candidatesModule],
  [vacanciesModule.config.route, vacanciesModule],
  [companiesModule.config.route, companiesModule],
  [applicationsModule.config.route, applicationsModule],
  [interviewsModule.config.route, interviewsModule],
  [tasksModule.config.route, tasksModule],
]);

export function createApp(rootElement) {
  let router;

  function renderAuth(mode) {
    rootElement.replaceChildren(createAuthPage({ mode }));
    rootElement.querySelector("main")?.focus({ preventScroll: true });
  }

  function renderPrivate(route) {
    let activeCrudView = null;
    const shell = createAppShell({
      activeRoute: route,
      onSearch: (query) => activeCrudView?.filter(query),
      onLogout: () => {
        logout();
        router.navigate(ROUTES.login, { replace: true });
      },
    });

    if (route === ROUTES.dashboard) {
      shell.setContent(createDashboardPage());
    } else {
      const module = modulesByRoute.get(route);
      activeCrudView = createCrudView({ config: module.config });
      activeCrudView.setRecords(module.getRecords());
      shell.setContent(activeCrudView.element);
    }

    rootElement.replaceChildren(shell.element);
    return () => shell.destroy();
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

