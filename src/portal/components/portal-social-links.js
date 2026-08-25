const socialItems = Object.freeze([
  { label: "LinkedIn", href: "https://www.linkedin.com" },
  { label: "GitHub", href: "https://github.com" },
  { label: "Instagram", href: "https://www.instagram.com" },
]);

export function createPortalSocialLinks() {
  const list = document.createElement("ul");
  list.className = "jc-portal-social-links";
  list.setAttribute("aria-label", "Redes sociales de demostración");

  socialItems.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.className = "jc-portal-social-item";

    const link = document.createElement("a");
    link.className = "jc-portal-social-link";
    link.href = item.href;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.textContent = item.label;
    link.setAttribute("aria-label", `${item.label}, abrir en una nueva pestaña`);

    listItem.append(link);
    list.append(listItem);
  });

  return list;
}
