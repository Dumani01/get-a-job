import { jobsRepository } from "../core/jobs-repository.js";
import { createJobCard } from "../features/job-card.js";

export function createHomePage() {
  const section = document.createElement("section");
  section.className = "jc-portal-page jc-portal-home-page";

  const heading = document.createElement("h1");
  heading.className = "jc-portal-page-title";
  heading.textContent = "Encuentra el trabajo que conecta con tu futuro";

  const message = document.createElement("p");
  message.className = "jc-portal-page-message";
  message.textContent = "Explora oportunidades demostrativas y descubre tu próximo paso profesional en Costa Rica.";

  const actions = document.createElement("div");
  actions.className = "jc-portal-home-actions";
  const exploreLink = document.createElement("a");
  exploreLink.className = "jc-portal-btn jc-portal-btn--primary";
  exploreLink.href = "#/empleos";
  exploreLink.textContent = "Explorar empleos";
  const employerLink = document.createElement("a");
  employerLink.className = "jc-portal-btn jc-portal-btn--secondary";
  employerLink.href = "#/empresa/ofertas";
  employerLink.textContent = "Soy empresa";
  actions.append(exploreLink, employerLink);

  const featuredHeading = document.createElement("h2");
  featuredHeading.className = "jc-portal-section-title";
  featuredHeading.textContent = "Ofertas destacadas";

  const featured = document.createElement("div");
  featured.className = "jc-portal-job-grid jc-portal-home-featured";
  jobsRepository.list({ status: "active", featured: true }).slice(0, 3).forEach((job) => featured.append(createJobCard(job)));

  section.append(heading, message, actions, featuredHeading, featured);
  return section;
}
