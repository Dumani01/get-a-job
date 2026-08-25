import { portalSession } from "../core/portal-session.js";

function createLink(label, hash) {
  const link = document.createElement("a");
  link.className = "jc-portal-nav-link";
  link.href = hash;
  link.textContent = label;
  return link;
}

export function createPortalHeader() {
  const header = document.createElement("header");
  header.className = "jc-portal-header";

  const inner = document.createElement("div");
  inner.className = "jc-portal-header-inner";

  const brand = document.createElement("a");
  brand.className = "jc-portal-brand";
  brand.href = "#/inicio";
  brand.setAttribute("aria-label", "JobConnect, ir al inicio");

  const logo = document.createElement("img");
  logo.className = "jc-portal-brand-logo";
  logo.src = "/src/assets/logo-circular.jpeg";
  logo.alt = "Logo JobConnect";
  logo.width = 40;
  logo.height = 40;

  const brandText = document.createElement("span");
  brandText.className = "jc-portal-brand-text";
  brandText.textContent = "JobConnect";

  brand.append(logo, brandText);

  const navigation = document.createElement("nav");
  navigation.className = "jc-portal-nav";
  navigation.setAttribute("aria-label", "Navegación principal");
  navigation.append(
    createLink("Inicio", "#/inicio"),
    createLink("Empleos", "#/empleos"),
    createLink("Guardados", "#/guardados"),
    createLink("Postulaciones", "#/postulaciones"),
  );

  const accountLink = createLink(portalSession.get() ? "Mi cuenta" : "Ingresar", portalSession.get() ? "#/perfil" : "#/login");
  accountLink.classList.add("jc-portal-account-link");

  inner.append(brand, navigation, accountLink);
  header.append(inner);

  return header;
}
