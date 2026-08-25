import { createPortalEmptyState } from "../components/portal-empty-state.js";
import { jobsRepository } from "../core/jobs-repository.js";
import { portalSession } from "../core/portal-session.js";

export function createEmployerJobsPage() {
  const section = document.createElement("section");
  section.className = "jc-portal-page";

  const heading = document.createElement("h1");
  heading.className = "jc-portal-page-title";
  heading.textContent = "Ofertas de empresa";

    const message = document.createElement("p");
    message.className = "jc-portal-page-message";
    message.textContent = "Administra tus ofertas demostrativas y sus estados desde este panel local.";

    const actions = document.createElement("div");
    actions.className = "jc-portal-home-actions";
    const createLink = document.createElement("a");
    createLink.className = "jc-portal-btn jc-portal-btn--primary";
    createLink.href = "#/empresa/publicar";
    createLink.textContent = "Publicar oferta";
    actions.append(createLink);

    const grid = document.createElement("div");
    grid.className = "jc-portal-job-grid";
    const jobs = jobsRepository.list({ createdBy: portalSession.get().id });
    if (jobs.length === 0) grid.append(createPortalEmptyState({ title: "Aún no tienes ofertas", message: "Publica tu primera oferta demostrativa para verla aquí." }));
    jobs.forEach((job) => {
      const card = document.createElement("article");
      card.className = "jc-portal-job-card";
      const title = document.createElement("h2");
      title.className = "jc-portal-job-card-title";
      title.textContent = job.title;
      const status = document.createElement("p");
      status.className = "jc-portal-job-card-meta";
      status.textContent = `Estado: ${job.status} · Postulantes: ${job.applicantsCount}`;
      const edit = document.createElement("a");
      edit.className = "jc-portal-btn jc-portal-btn--secondary";
      edit.href = `#/empresa/editar?id=${encodeURIComponent(job.id)}`;
      edit.textContent = "Editar";
      const toggle = document.createElement("button");
      toggle.className = "jc-portal-btn jc-portal-btn--secondary";
      toggle.type = "button";
      toggle.textContent = job.status === "active" ? "Pausar" : "Reactivar";
      toggle.addEventListener("click", () => {
        jobsRepository.setStatus(job.id, job.status === "active" ? "paused" : "active");
        window.location.reload();
      });
      card.append(title, status, edit, toggle);
      grid.append(card);
    });

    section.append(heading, message, actions, grid);
  return section;
}
