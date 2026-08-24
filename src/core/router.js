import { PRIVATE_ROUTES, ROUTES } from "../config/app.config.js";

function normalizeRoute(route) {
  if (!route || route === "#" || route === "#/") {
    return ROUTES.login;
  }

  return route.startsWith("#/") ? route : `#/${route.replace(/^#?\/?/, "")}`;
}

export function createHashRouter({ routes, canAccessPrivateRoute = () => false, onNotFound } = {}) {
  const routeMap = new Map(Object.entries(routes ?? {}));
  let currentCleanup = null;

  function navigate(route, { replace = false } = {}) {
    const destination = normalizeRoute(route);

    if (replace) {
      history.replaceState(null, "", destination);
      render();
      return;
    }

    window.location.hash = destination.slice(1);
  }

  async function render() {
    const route = normalizeRoute(window.location.hash);

    if (PRIVATE_ROUTES.includes(route) && !canAccessPrivateRoute()) {
      navigate(ROUTES.login, { replace: true });
      return;
    }

    const routeHandler = routeMap.get(route);

    if (!routeHandler) {
      if (typeof onNotFound === "function") {
        onNotFound(route);
      } else {
        navigate(canAccessPrivateRoute() ? ROUTES.dashboard : ROUTES.login, { replace: true });
      }
      return;
    }

    if (typeof currentCleanup === "function") {
      currentCleanup();
    }

    currentCleanup = (await routeHandler({ route, navigate })) ?? null;
  }

  function start() {
    window.addEventListener("hashchange", render);
    render();
    return stop;
  }

  function stop() {
    window.removeEventListener("hashchange", render);
    if (typeof currentCleanup === "function") {
      currentCleanup();
    }
    currentCleanup = null;
  }

  return Object.freeze({ start, stop, navigate, render });
}

export default createHashRouter;

