const SOCIAL_LINKS = Object.freeze([
  { label: "GitHub de JobConnect", href: "https://github.com/Dumani01/get-a-job", icon: "github" },
  { label: "LinkedIn", href: "https://www.linkedin.com", icon: "linkedin" },
  { label: "Instagram", href: "https://www.instagram.com", icon: "instagram" },
]);

const ICON_PATHS = Object.freeze({
  github: "M12 2C6.48 2 2 6.58 2 12.24c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.5v-1.94c-2.78.62-3.37-1.2-3.37-1.2-.45-1.19-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05.9 1.58 2.35 1.12 2.92.86.09-.66.35-1.12.64-1.38-2.22-.26-4.56-1.14-4.56-5.08 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.3.1-2.72 0 0 .84-.28 2.75 1.05A9.3 9.3 0 0 1 12 6.63a9.3 9.3 0 0 1 2.5.34c1.91-1.33 2.75-1.05 2.75-1.05.55 1.42.2 2.46.1 2.72.64.72 1.03 1.64 1.03 2.76 0 3.95-2.34 4.81-4.57 5.07.36.32.68.94.68 1.9v3.1c0 .28.18.61.69.5A10.25 10.25 0 0 0 22 12.24C22 6.58 17.52 2 12 2Z",
  linkedin: "M6.5 8.3H3.2V21h3.3V8.3ZM4.85 3A1.92 1.92 0 1 0 4.84 6.84 1.92 1.92 0 0 0 4.85 3ZM21 13.72c0-3.82-2.04-5.6-4.76-5.6-2.2 0-3.18 1.21-3.73 2.06V8.3H9.2V21h3.31v-6.3c0-1.66.31-3.27 2.37-3.27 2.03 0 2.06 1.9 2.06 3.38V21H21v-7.28Z",
  instagram: "M12 7.2A4.8 4.8 0 1 0 12 16.8 4.8 4.8 0 0 0 12 7.2Zm0 7.92A3.12 3.12 0 1 1 12 8.88a3.12 3.12 0 0 1 0 6.24ZM18.11 7a1.12 1.12 0 1 1-2.24 0 1.12 1.12 0 0 1 2.24 0ZM21.3 8.14c-.07-1.58-.44-2.98-1.6-4.13-1.15-1.16-2.55-1.53-4.13-1.6-1.63-.09-6.5-.09-8.14 0-1.57.07-2.97.44-4.13 1.59-1.16 1.16-1.53 2.56-1.6 4.14-.09 1.63-.09 6.5 0 8.14.07 1.58.44 2.98 1.6 4.13 1.16 1.16 2.56 1.53 4.13 1.6 1.64.09 6.51.09 8.14 0 1.58-.07 2.98-.44 4.13-1.6 1.16-1.15 1.53-2.55 1.6-4.13.09-1.64.09-6.51 0-8.14Zm-2 9.89a3.18 3.18 0 0 1-1.79 1.79c-1.24.49-4.19.38-5.51.38-1.32 0-4.28.11-5.51-.38a3.18 3.18 0 0 1-1.79-1.79c-.49-1.23-.38-4.19-.38-5.51 0-1.32-.11-4.27.38-5.51a3.18 3.18 0 0 1 1.79-1.79c1.23-.49 4.19-.38 5.51-.38 1.32 0 4.27-.11 5.51.38A3.18 3.18 0 0 1 19.3 7c.49 1.24.38 4.19.38 5.51 0 1.32.11 4.28-.38 5.51Z",
});

function createIcon(name) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  path.setAttribute("d", ICON_PATHS[name]);
  svg.append(path);
  return svg;
}

export function createSocialLinks() {
  const navigation = document.createElement("nav");
  const astronaut = document.createElement("img");
  const heading = document.createElement("strong");
  const subheading = document.createElement("span");
  const icons = document.createElement("div");

  navigation.className = "jc-social-links";
  navigation.setAttribute("aria-label", "Redes sociales de JobConnect");
  astronaut.className = "jc-social-links__astronaut";
  astronaut.src = "https://uiverse.io/build/_assets/astronaut-WTFWARES.png";
  astronaut.alt = "";
  astronaut.width = 126;
  astronaut.height = 126;
  astronaut.addEventListener("error", () => {
    astronaut.src = "/src/assets/jobconnect-logo.svg";
    astronaut.classList.add("is-fallback");
  }, { once: true });
  heading.className = "jc-social-links__heading";
  heading.textContent = "Estamos en redes";
  subheading.className = "jc-social-links__subheading";
  subheading.textContent = "Conecta con JobConnect";
  icons.className = "jc-social-links__icons";

  SOCIAL_LINKS.forEach(({ label, href, icon }) => {
    const link = document.createElement("a");
    link.href = href;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.className = `jc-social-links__link jc-social-links__link--${icon}`;
    link.setAttribute("aria-label", label);
    link.title = label;
    link.append(createIcon(icon));
    icons.append(link);
  });

  navigation.append(astronaut, heading, subheading, icons);
  return navigation;
}

export default createSocialLinks;
