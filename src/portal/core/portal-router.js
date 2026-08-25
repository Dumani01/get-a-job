import { PORTAL_CONFIG, PORTAL_EVENTS } from "../config/portal.config.js";

function parseHash(hashValue) {
  const normalizedHash = hashValue || PORTAL_CONFIG.defaultRoute;
  const rawRoute = normalizedHash.startsWith("#") ? normalizedHash.slice(1) : normalizedHash;
  const [pathPart, queryPart = ""] = rawRoute.split("?");

  return {
    hash: normalizedHash,
    path: pathPart || "/inicio",
    query: new URLSearchParams(queryPart),
  };
}

function buildLoginRedirect(requestedHash) {
  const redirect = encodeURIComponent(requestedHash);
  return `#/login?redirect=${redirect}`;
}

export function createPortalRouter({ routes, session, onRoute }) {
  const routeMap = new Map(routes.map((route) => [route.path, route]));
  let started = false;

  function emitRouteChange(routeState) {
    window.dispatchEvent(
      new CustomEvent(PORTAL_EVENTS.routeChange, {
        detail: {
          path: routeState.path,
          hash: routeState.hash,
          page: routeState.route.page,
        },
      }),
    );
  }

  function navigate(hash, { replace = false } = {}) {
    if (replace) {
      window.location.replace(`${window.location.pathname}${window.location.search}${hash}`);
      return;
    }

    window.location.hash = hash;
  }

  function resolveCurrentRoute() {
    const parsed = parseHash(window.location.hash);
    const route = routeMap.get(parsed.path);

    if (!route) {
      navigate(PORTAL_CONFIG.defaultRoute, { replace: true });
      return;
    }

    const currentSession = session.get();

    if (route.roles.length > 0 && !currentSession) {
      navigate(buildLoginRedirect(parsed.hash), { replace: true });
      return;
    }

    if (route.roles.length > 0 && !route.roles.includes(currentSession.role)) {
      window.dispatchEvent(
        new CustomEvent(PORTAL_EVENTS.routeChange, {
          detail: {
            path: parsed.path,
            hash: parsed.hash,
            page: route.page,
            warning: "Tu cuenta no tiene permisos para acceder a esa sección.",
          },
        }),
      );
      navigate(PORTAL_CONFIG.defaultRoute, { replace: true });
      return;
    }

    const routeState = {
      ...parsed,
      route,
    };

    onRoute(routeState);
    emitRouteChange(routeState);
  }

  function start() {
    if (started) {
      return;
    }

    started = true;
    window.addEventListener("hashchange", resolveCurrentRoute);

    if (!window.location.hash) {
      navigate(PORTAL_CONFIG.defaultRoute, { replace: true });
      return;
    }

    resolveCurrentRoute();
  }

  function stop() {
    if (!started) {
      return;
    }

    started = false;
    window.removeEventListener("hashchange", resolveCurrentRoute);
  }

  return Object.freeze({
    start,
    stop,
    navigate,
    resolve: resolveCurrentRoute,
  });
}
