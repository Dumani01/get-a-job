import { createSaveJobButton } from "../components/save-job-button.js";
import { portalSession } from "../core/portal-session.js";
import { savedJobsRepository } from "../core/saved-jobs-repository.js";

function formatSalary(salary) {
  if (!salary?.visible) return "Salario no publicado";
  const formatter = new Intl.NumberFormat("es-CR", { style: "currency", currency: "CRC", maximumFractionDigits: 0 });
  return `${formatter.format(salary.min)} - ${formatter.format(salary.max)}`;
}

function appendDataRow(details, label, value) {
  const term = document.createElement("dt");
  const description = document.createElement("dd");
  term.textContent = label;
  description.textContent = value || "-";
  details.append(term, description);
}

export function createJobCard(job) {
  const article = document.createElement("article");
  const details = document.createElement("dl");
  const actions = document.createElement("div");
  const detailLink = document.createElement("a");

  article.className = "jc-portal-job-card";
  article.dataset.jobId = job.id;
  details.className = "jc-portal-job-card__details";
  actions.className = "jc-portal-job-card-actions";
  detailLink.className = "jc-portal-job-card-link jc-portal-btn jc-portal-btn--secondary";
  detailLink.href = `#/empleo?id=${encodeURIComponent(job.id)}`;
  detailLink.textContent = "Ver oferta";

  appendDataRow(details, "Puesto", job.title);
  appendDataRow(details, "Descripcion", job.description);
  appendDataRow(details, "Area", job.category || job.workMode);
  appendDataRow(details, "Salario de referencia", formatSalary(job.salary));
  appendDataRow(details, "Plazas disponibles", String(job.openings ?? 1));
  appendDataRow(details, "Empresa", job.company?.name ?? "Empresa demostrativa");

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
  article.append(details, actions);
  return article;
}

export default createJobCard;
