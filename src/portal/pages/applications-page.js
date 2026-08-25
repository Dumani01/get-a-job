import { createPortalEmptyState } from "../components/portal-empty-state.js";
import { applicationsRepository } from "../core/applications-repository.js";
import { jobsRepository } from "../core/jobs-repository.js";
import { portalSession } from "../core/portal-session.js";

export function createApplicationsPage() {
  const section = document.createElement("section");
  section.className = "jc-portal-page";

  const heading = document.createElement("h1");
  heading.className = "jc-portal-page-title";
  heading.textContent = "Postulaciones";

    const message = document.createElement("p");
    message.className = "jc-portal-page-message";
    message.textContent = "Consulta el estado de tus postulaciones demostrativas.";

    const list = document.createElement("div");
    list.className = "jc-portal-application-list";
    const applications = applicationsRepository.listByCandidate(portalSession.get().id);
    if (applications.length === 0) list.append(createPortalEmptyState({ title: "No hay postulaciones", message: "Cuando envíes una postulación aparecerá aquí." }));
    applications.forEach((application) => {
      const card = document.createElement("article");
      card.className = "jc-portal-job-card";
      const title = document.createElement("h2");
      title.className = "jc-portal-job-card-title";
      title.textContent = jobsRepository.getById(application.jobId)?.title ?? "Oferta no disponible";
      const status = document.createElement("p");
      status.className = "jc-portal-job-card-meta";
      status.textContent = `Estado: ${application.status}`;
      card.append(title, status);
      list.append(card);
    });

    section.append(heading, message, list);
  return section;
}
