const SOCIAL_LINKS = Object.freeze([
  { label: "GitHub de JobConnect", text: "GH", href: "https://github.com/Dumani01/get-a-job" },
  { label: "LinkedIn", text: "in", href: "https://www.linkedin.com" },
]);

export function createSocialLinks() {
  const navigation = document.createElement("nav");
  navigation.className = "jc-social-links";
  navigation.setAttribute("aria-label", "Redes sociales");

  SOCIAL_LINKS.forEach(({ label, text, href }) => {
    const link = document.createElement("a");
    link.href = href;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.setAttribute("aria-label", label);
    link.title = label;
    link.textContent = text;
    navigation.append(link);
  });

  return navigation;
}

export default createSocialLinks;

