import { APP_NAME, NAVIGATION_ITEMS } from "../config/app.config.js";
import { getUiState, setUiState } from "../core/session-store.js";
import { createSearchBar } from "./search-bar.js";
import { createSocialLinks } from "./social-links.js";

function createBrandButton() {
  const button = document.createElement("button");
  const logo = document.createElement("img");
  const label = document.createElement("span");

  button.className = "jc-sidebar__brand";
  button.type = "button";
  button.setAttribute("aria-label", "Expandir o contraer navegación");
  button.title = "Expandir o contraer navegación";
  logo.src = "/src/assets/jobconnect-logo.svg";
  logo.alt = "";
  logo.width = 42;
  logo.height = 42;
  label.textContent = APP_NAME;
  button.append(logo, label);
  return button;
}

function createNavigation(activeRoute) {
  const navigation = document.createElement("nav");
  const list = document.createElement("ul");

  navigation.className = "jc-sidebar__navigation";
  navigation.setAttribute("aria-label", "Navegación principal");
  NAVIGATION_ITEMS.forEach((item) => {
    const listItem = document.createElement("li");
    const link = document.createElement("a");
    const icon = document.createElement("span");
    const label = document.createElement("span");

    link.href = item.route;
    link.dataset.route = item.route;
    link.className = "jc-sidebar__link";
    link.setAttribute("aria-current", item.route === activeRoute ? "page" : "false");
    icon.className = "jc-sidebar__link-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = item.label.slice(0, 1);
    label.textContent = item.label;
    link.append(icon, label);
    listItem.append(link);
    list.append(listItem);
  });
  navigation.append(list);
  return navigation;
}

export function createAppShell({ activeRoute, onSearch = () => {}, onLogout = () => {}, searchEnabled = true } = {}) {
  const element = document.createElement("div");
  const sidebar = document.createElement("aside");
  const brandButton = createBrandButton();
  const navigation = createNavigation(activeRoute);
  const sidebarFooter = document.createElement("footer");
  const socialLinks = createSocialLinks();
  const logoutButton = document.createElement("button");
  const overlay = document.createElement("button");
  const workspace = document.createElement("div");
  const topbar = document.createElement("header");
  const menuButton = document.createElement("button");
  const pageTitle = document.createElement("p");
  const search = createSearchBar({ onSearch });
  const main = document.createElement("main");
  const initialUiState = getUiState();

  element.className = "jc-app-shell";
  sidebar.className = "jc-sidebar";
  sidebar.id = "jobconnect-sidebar";
  sidebar.classList.toggle("is-collapsed", Boolean(initialUiState.sidebarCollapsed));
  sidebarFooter.className = "jc-sidebar__footer";
  logoutButton.className = "jc-btn jc-btn--secondary jc-sidebar__logout";
  logoutButton.type = "button";
  logoutButton.textContent = "Cerrar sesión";
  overlay.className = "jc-sidebar-overlay";
  overlay.type = "button";
  overlay.setAttribute("aria-label", "Cerrar navegación");
  overlay.title = "Cerrar navegación";
  workspace.className = "jc-workspace";
  topbar.className = "jc-topbar";
  menuButton.className = "jc-btn jc-btn--secondary jc-btn--icon jc-menu-button";
  menuButton.type = "button";
  menuButton.setAttribute("aria-controls", sidebar.id);
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Abrir navegación");
  menuButton.title = "Abrir navegación";
  menuButton.textContent = "☰";
  pageTitle.className = "jc-topbar__title";
  pageTitle.textContent = NAVIGATION_ITEMS.find(({ route }) => route === activeRoute)?.label ?? APP_NAME;
  main.id = "main-content";
  main.className = "jc-main-content";
  main.tabIndex = -1;

  function setCollapsed(collapsed) {
    sidebar.classList.toggle("is-collapsed", collapsed);
    search.setExpanded(!collapsed);
    setUiState({ sidebarCollapsed: collapsed });
  }

  function closeMobileNavigation() {
    element.classList.remove("is-navigation-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Abrir navegación");
    menuButton.title = "Abrir navegación";
  }

  function openMobileNavigation() {
    element.classList.add("is-navigation-open");
    menuButton.setAttribute("aria-expanded", "true");
    menuButton.setAttribute("aria-label", "Cerrar navegación");
    menuButton.title = "Cerrar navegación";
    sidebar.querySelector("a")?.focus();
  }

  function handleEscape(event) {
    if (event.key === "Escape" && element.classList.contains("is-navigation-open")) {
      closeMobileNavigation();
      menuButton.focus();
    }
  }

  function setActiveRoute(route) {
    navigation.querySelectorAll("[data-route]").forEach((link) => {
      link.setAttribute("aria-current", link.dataset.route === route ? "page" : "false");
    });
    const item = NAVIGATION_ITEMS.find((navigationItem) => navigationItem.route === route);
    pageTitle.textContent = item?.label ?? APP_NAME;
    closeMobileNavigation();
  }

  function setContent(content) {
    main.replaceChildren(content);
    main.focus({ preventScroll: true });
  }

  function destroy() {
    document.removeEventListener("keydown", handleEscape);
    element.remove();
  }

  brandButton.addEventListener("click", () => setCollapsed(!sidebar.classList.contains("is-collapsed")));
  menuButton.addEventListener("click", () => {
    if (element.classList.contains("is-navigation-open")) {
      closeMobileNavigation();
    } else {
      openMobileNavigation();
    }
  });
  overlay.addEventListener("click", closeMobileNavigation);
  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      closeMobileNavigation();
    }
  });
  logoutButton.addEventListener("click", onLogout);
  document.addEventListener("keydown", handleEscape);

  sidebarFooter.append(socialLinks, logoutButton);
  sidebar.append(brandButton, navigation, sidebarFooter);
  topbar.append(menuButton, pageTitle, search.element);
  workspace.append(topbar, main);
  element.append(sidebar, overlay, workspace);
  search.setExpanded(!sidebar.classList.contains("is-collapsed"));
  search.setDisabled(!searchEnabled);

  return Object.freeze({
    element,
    main,
    search,
    setActiveRoute,
    setContent,
    setCollapsed,
    closeMobileNavigation,
    destroy,
  });
}

export default createAppShell;
