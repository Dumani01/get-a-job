import { PORTAL_CONFIG } from "../config/portal.config.js";
import { createPortalSocialLinks } from "../components/portal-social-links.js";

function createFooterLink(label, hash) {
  const link = document.createElement("a");
  link.className = "jc-portal-footer-link";
  link.href = hash;
  link.textContent = label;
  return link;
}

export function createPortalFooter() {
  const footer = document.createElement("footer");
  footer.className = "jc-portal-footer";

  const inner = document.createElement("div");
  inner.className = "jc-portal-footer-inner";

  const identity = document.createElement("div");
  identity.className = "jc-portal-footer-identity";

  const title = document.createElement("strong");
  title.className = "jc-portal-footer-title";
  title.textContent = PORTAL_CONFIG.appName;

  const notice = document.createElement("p");
  notice.className = "jc-portal-demo-notice";
  notice.textContent = PORTAL_CONFIG.demoNotice;

  identity.append(title, notice);

  const navigation = document.createElement("nav");
  navigation.className = "jc-portal-footer-nav";
  navigation.setAttribute("aria-label", "Navegación del pie");
  navigation.append(
    createFooterLink("Inicio", "#/inicio"),
    createFooterLink("Empleos", "#/empleos"),
    createFooterLink("Ingresar", "#/login"),
  );

  inner.append(identity, navigation, createPortalSocialLinks());
  footer.append(inner);

  return footer;
}
