import { jobsRepository } from "../core/jobs-repository.js";
import { createJobCard } from "../features/job-card.js";
import { createPortalEmptyState } from "../components/portal-empty-state.js";
import { createApplicationForm } from "../features/application-form.js";
import { portalSession } from "../core/portal-session.js";

function listBlock(title, values) {
  const wrapper = document.createElement("section");
  wrapper.className = "jc-portal-detail-block";
  const heading = document.createElement("h2");
  heading.textContent = title;
  const list = document.createElement("ul");
  values.forEach((value) => {
    const item = document.createElement("li");
    item.textContent = value;
    list.append(item);
  });
  wrapper.append(heading, list);
  return wrapper;
}

export function createJobDetailPage() {
  const section = document.createElement("section");
  section.className = "jc-portal-page jc-portal-job-detail-page";
  const jobId = new URLSearchParams(window.location.hash.split("?")[1] ?? "").get("id");
  const job = jobsRepository.getById(jobId);

  if (!job) {
    section.append(createPortalEmptyState({ title: "Oferta no encontrada", message: "La oferta solicitada ya no está disponible." }));
    return section;
  }

  const heading = document.createElement("h1");
  heading.className = "jc-portal-page-title";
  heading.textContent = job.title;

  const message = document.createElement("p");
  message.className = "jc-portal-page-message";
  message.textContent = `${job.company.name} · ${job.location.city}, ${job.location.province} · ${job.workMode}`;

  const salary = document.createElement("strong");
  salary.className = "jc-portal-detail-salary";
  salary.textContent = `Salario: ₡${job.salary.min.toLocaleString("es-CR")} - ₡${job.salary.max.toLocaleString("es-CR")}`;

  const description = document.createElement("p");
  description.className = "jc-portal-detail-description";
  description.textContent = job.description;

  const actions = document.createElement("div");
  actions.className = "jc-portal-home-actions";
  const applyLink = document.createElement("a");
  applyLink.className = "jc-portal-btn jc-portal-btn--primary";
  applyLink.href = portalSession.hasRole("candidate") ? "#application-form" : "#/login?redirect=%23%2Fempleo%3Fid%3D" + encodeURIComponent(job.id);
  applyLink.textContent = "Postularme";
  const backLink = document.createElement("a");
  backLink.className = "jc-portal-btn jc-portal-btn--secondary";
  backLink.href = "#/empleos";
  backLink.textContent = "Volver a empleos";
  actions.append(applyLink, backLink);

  const relatedHeading = document.createElement("h2");
  relatedHeading.className = "jc-portal-section-title";
  relatedHeading.textContent = "Ofertas relacionadas";
  const related = document.createElement("div");
  related.className = "jc-portal-job-grid";
  jobsRepository.list({ status: "active", category: job.category }).filter((item) => item.id !== job.id).slice(0, 2).forEach((item) => related.append(createJobCard(item)));

  const application = portalSession.hasRole("candidate") ? createApplicationForm({ job }) : null;
  if (application) application.id = "application-form";
  section.append(heading, message, salary, description, listBlock("Responsabilidades", job.responsibilities), listBlock("Requisitos", job.requirements), listBlock("Beneficios", job.benefits), actions, ...(application ? [application] : []), relatedHeading, related);
  return section;
}
