import { APP_NAME, NAVIGATION_ITEMS } from "../config/app.config.js";
import { getUiState, setUiState } from "../core/session-store.js";
import { createSearchBar } from "./search-bar.js";
import { createSocialLinks } from "./social-links.js";

const NAVIGATION_ICONS = Object.freeze({
  "#/dashboard": "M4 13h6V4H4v9Zm0 7h6v-5H4v5Zm10 0h6v-9h-6v9Zm0-16v5h6V4h-6Z",
  "#/candidatos": "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m7-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm13 10v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  "#/vacantes": "M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m5 5v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8m-2-5h20v5H2V6Zm8 5v2h4v-2",
  "#/empresas": "M3 21h18M5 21V5l7-3v19m7 0V9l-7-3M8 9h1m-1 4h1m-1 4h1m6-5h1m-1 4h1",
  "#/postulaciones": "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Zm0 0v6h6M8 13h8m-8 4h8",
  "#/entrevistas": "M7 3v3m10-3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm3 8h3v3H8v-3Z",
  "#/tareas": "M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11",
});

function createLineIcon(pathData, className = "") {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  svg.className.baseVal = className;
  path.setAttribute("d", pathData);
  svg.append(path);
  return svg;
}

function createBrandButton() {
  const button = document.createElement("button");
  const logoFrame = document.createElement("span");
  const logo = document.createElement("img");
  const text = document.createElement("span");
  const label = document.createElement("strong");
  const caption = document.createElement("small");
  const chevron = document.createElement("span");

  button.className = "jc-sidebar__brand";
  button.type = "button";
  button.setAttribute("aria-label", "Expandir o contraer navegación");
  button.title = "Expandir o contraer navegación";
  logoFrame.className = "jc-sidebar__brand-logo";
  logo.src = "/src/assets/logo-circular.jpeg";
  logo.alt = "";
  logo.width = 36;
  logo.height = 36;
  text.className = "jc-sidebar__brand-text";
  label.textContent = APP_NAME;
  caption.textContent = "OVERWORLD / RECRUITER OS";
  chevron.className = "jc-sidebar__brand-chevron";
  chevron.setAttribute("aria-hidden", "true");
  chevron.textContent = "‹";
  logoFrame.append(logo);
  text.append(label, caption);
  button.append(logoFrame, text, chevron);
  return button;
}

function createNavigation(activeRoute) {
  const navigation = document.createElement("nav");
  const sectionLabel = document.createElement("p");
  const list = document.createElement("ul");

  navigation.className = "jc-sidebar__navigation";
  navigation.setAttribute("aria-label", "Navegación principal");
  sectionLabel.className = "jc-sidebar__section-label";
  sectionLabel.textContent = "QUEST LOG";
  navigation.append(sectionLabel);

  NAVIGATION_ITEMS.forEach((item) => {
    const listItem = document.createElement("li");
    const link = document.createElement("a");
    const icon = document.createElement("span");
    const label = document.createElement("span");
    const pathData = NAVIGATION_ICONS[item.route] ?? NAVIGATION_ICONS["#/dashboard"];

    link.href = item.route;
    link.dataset.route = item.route;
    link.className = "jc-sidebar__link";
    link.setAttribute("aria-current", item.route === activeRoute ? "page" : "false");
    icon.className = "jc-sidebar__link-icon";
    icon.append(createLineIcon(pathData));
    label.className = "jc-sidebar__link-label";
    label.textContent = item.label;
    link.append(icon, label);
    listItem.append(link);
    list.append(listItem);
  });
  navigation.append(list);
  return navigation;
}

function createLogoutButton(onLogout) {
  const button = document.createElement("button");
  const icon = createLineIcon("M10 17l5-5-5-5m5 5H3m11-9h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5", "jc-sidebar__logout-icon");
  const label = document.createElement("span");
  button.className = "jc-sidebar__logout";
  button.type = "button";
  label.textContent = "Cerrar sesión";
  button.append(icon, label);
  button.addEventListener("click", onLogout);
  return button;
}

export function createAppShell({ activeRoute, onSearch = () => {}, onLogout = () => {}, searchEnabled = true } = {}) {
  const element = document.createElement("div");
  const sidebar = document.createElement("aside");
  const brandButton = createBrandButton();
  const navigation = createNavigation(activeRoute);
  const sidebarFooter = document.createElement("footer");
  const socialLinks = createSocialLinks();
  const logoutButton = createLogoutButton(onLogout);
  const overlay = document.createElement("button");
  const workspace = document.createElement("div");
  const topbar = document.createElement("header");
  const topbarHeading = document.createElement("div");
  const menuButton = document.createElement("button");
  const breadcrumb = document.createElement("span");
  const pageTitle = document.createElement("p");
  const search = createSearchBar({ onSearch });
  const main = document.createElement("main");
  const initialUiState = getUiState();

  element.className = "jc-app-shell";
  sidebar.className = "jc-sidebar";
  sidebar.id = "jobconnect-sidebar";
  sidebar.setAttribute("aria-label", "Panel lateral de JobConnect");
  sidebar.classList.toggle("is-collapsed", Boolean(initialUiState.sidebarCollapsed));
  element.classList.toggle("is-sidebar-collapsed", Boolean(initialUiState.sidebarCollapsed));
  sidebarFooter.className = "jc-sidebar__footer";
  overlay.className = "jc-sidebar-overlay";
  overlay.type = "button";
  overlay.setAttribute("aria-label", "Cerrar navegación");
  overlay.title = "Cerrar navegación";
  workspace.className = "jc-workspace";
  topbar.className = "jc-topbar";
  topbarHeading.className = "jc-topbar__heading";
  menuButton.className = "jc-menu-button";
  menuButton.type = "button";
  menuButton.setAttribute("aria-controls", sidebar.id);
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Abrir navegación");
  menuButton.title = "Abrir navegación";
  menuButton.append(createLineIcon("M4 7h16M4 12h16M4 17h16"));
  breadcrumb.className = "jc-topbar__breadcrumb";
  breadcrumb.textContent = APP_NAME;
  pageTitle.className = "jc-topbar__title";
  pageTitle.textContent = NAVIGATION_ITEMS.find(({ route }) => route === activeRoute)?.label ?? APP_NAME;
  function createThemeToggleButton() {
    const button = document.createElement("button");
    button.className = "jc-theme-toggle";
    button.type = "button";

    const getTheme = () => document.documentElement.getAttribute("data-theme") || "light";

    const updateUI = () => {
      const isDark = getTheme() === "dark";
      const iconPath = isDark
        ? "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        : "M20.354 15.354A9 9 0 018.646 3.646a9 9 0 1011.708 11.708z";
      const icon = createLineIcon(iconPath, "jc-theme-toggle__icon");
      button.replaceChildren(icon);
      const label = isDark ? "Cambiar a Modo Claro (Pergamino)" : "Cambiar a Modo Oscuro (Noche 16-bit)";
      button.setAttribute("aria-label", label);
      button.title = label;
    };

    const initialTheme = localStorage.getItem("jobconnect-theme") || "light";
    document.documentElement.setAttribute("data-theme", initialTheme);
    updateUI();

    button.addEventListener("click", () => {
      const newTheme = getTheme() === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("jobconnect-theme", newTheme);
      updateUI();
    });

    return button;
  }

  main.id = "main-content";
  main.className = "jc-main-content";
  main.tabIndex = -1;

  function setCollapsed(collapsed) {
    sidebar.classList.toggle("is-collapsed", collapsed);
    element.classList.toggle("is-sidebar-collapsed", collapsed);
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
    if (event.target.closest("a")) closeMobileNavigation();
  });
  document.addEventListener("keydown", handleEscape);

  const themeToggle = createThemeToggleButton();

  sidebarFooter.append(socialLinks, logoutButton);
  sidebar.append(brandButton, navigation, sidebarFooter);
  topbarHeading.append(breadcrumb, pageTitle);
  topbar.append(menuButton, topbarHeading, search.element, themeToggle);
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
