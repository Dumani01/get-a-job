import { createJobCard } from "../features/job-card.js";
import { createPortalEmptyState } from "../components/portal-empty-state.js";
import { jobsRepository } from "../core/jobs-repository.js";
import { savedJobsRepository } from "../core/saved-jobs-repository.js";
import { portalSession } from "../core/portal-session.js";

export function createSavedJobsPage() {
  const section = document.createElement("section");
  section.className = "jc-portal-page";

  const heading = document.createElement("h1");
  heading.className = "jc-portal-page-title";
  heading.textContent = "Empleos guardados";

    const message = document.createElement("p");
    message.className = "jc-portal-page-message";
    message.textContent = "Tus oportunidades guardadas permanecen disponibles en esta sesión local.";

    const grid = document.createElement("div");
    grid.className = "jc-portal-job-grid";
    const saved = savedJobsRepository.list(portalSession.get().id).map((entry) => jobsRepository.getById(entry.jobId)).filter(Boolean);
    if (saved.length === 0) grid.append(createPortalEmptyState({ title: "Aún no tienes ofertas guardadas", message: "Guarda una oferta desde el catálogo para verla aquí." }));
    saved.forEach((job) => grid.append(createJobCard(job)));

    section.append(heading, message, grid);
  return section;
}
