import { createSaveJobButton } from "../components/save-job-button.js";
import { portalSession } from "../core/portal-session.js";
import { savedJobsRepository } from "../core/saved-jobs-repository.js";

function formatSalary(salary) {
  if (!salary?.visible) {
    return "Salario no publicado";
  }

  const formatter = new Intl.NumberFormat("es-CR", { style: "currency", currency: "CRC", maximumFractionDigits: 0 });
  return `${formatter.format(salary.min)} - ${formatter.format(salary.max)}`;
}

function labelFor(value) {
  return String(value ?? "").replaceAll("-", " ");
}

export function createJobCard(job) {
  const article = document.createElement("article");
  article.className = "jc-portal-job-card";
  article.dataset.jobId = job.id;

  const eyebrow = document.createElement("span");
  eyebrow.className = "jc-portal-job-card-eyebrow";
  eyebrow.textContent = job.featured ? "Oferta destacada" : job.category;

  const heading = document.createElement("h3");
  heading.className = "jc-portal-job-card-title";
  heading.textContent = job.title;

  const company = document.createElement("p");
  company.className = "jc-portal-job-card-company";
  company.textContent = `${job.company?.name ?? "Empresa demostrativa"} · ${job.location?.city ?? "Costa Rica"}`;

  const meta = document.createElement("p");
  meta.className = "jc-portal-job-card-meta";
  meta.textContent = `${labelFor(job.workMode)} · ${labelFor(job.contractType)} · ${labelFor(job.experienceLevel)}`;

  const salary = document.createElement("strong");
  salary.className = "jc-portal-job-card-salary";
  salary.textContent = formatSalary(job.salary);

  const skills = document.createElement("ul");
  skills.className = "jc-portal-job-card-skills";
  skills.setAttribute("aria-label", "Habilidades requeridas");
  (job.skills ?? []).slice(0, 3).forEach((skill) => {
    const item = document.createElement("li");
    item.textContent = skill;
    skills.append(item);
  });

  const actions = document.createElement("div");
  actions.className = "jc-portal-job-card-actions";

  const detailLink = document.createElement("a");
  detailLink.className = "jc-portal-job-card-link jc-portal-btn jc-portal-btn--primary";
  detailLink.href = `#/empleo?id=${encodeURIComponent(job.id)}`;
  detailLink.textContent = "Ver oferta";

  const session = portalSession.get();
  const saveButton = createSaveJobButton({
    saved: session?.role === "candidate" && savedJobsRepository.has(session.id, job.id),
    onToggle() {
      const currentSession = portalSession.get();
      if (currentSession?.role !== "candidate") {
        window.location.hash = `#/login?redirect=${encodeURIComponent(`#/empleo?id=${job.id}`)}`;
        return;
      }
      const result = savedJobsRepository.toggle(currentSession.id, job.id);
      saveButton.setAttribute("aria-pressed", String(result.saved));
      saveButton.setAttribute("aria-label", result.saved ? "Quitar oferta de guardados" : "Guardar oferta");
      saveButton.title = result.saved ? "Quitar de guardados" : "Guardar oferta";
      saveButton.textContent = result.saved ? "Guardado" : "Guardar";
    },
  });

  actions.append(detailLink, saveButton);
  article.append(eyebrow, heading, company, meta, salary, skills, actions);

  return article;
}
