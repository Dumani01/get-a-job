import { createPortalFooter } from "./portal-footer.js";
import { createPortalHeader } from "./portal-header.js";

export function createPortalShell() {
  const shell = document.createElement("div");
  shell.className = "jc-portal-shell";

  const main = document.createElement("main");
  main.className = "jc-portal-main";
  main.id = "portal-main";
  main.tabIndex = -1;

  const statusRegion = document.createElement("div");
  statusRegion.className = "jc-portal-status-region";
  statusRegion.setAttribute("aria-live", "polite");
  statusRegion.setAttribute("aria-atomic", "true");

  shell.append(createPortalHeader(), main, createPortalFooter(), statusRegion);

  return {
    element: shell,
    main,
    statusRegion,
  };
}
