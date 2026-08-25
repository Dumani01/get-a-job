import { applicationsRepository } from "../core/applications-repository.js";
import { jobsRepository } from "../core/jobs-repository.js";
import { portalSession } from "../core/portal-session.js";

export function createEmployerApplicantsPage() {
  const section = document.createElement("section");
  section.className = "jc-portal-page";

  const heading = document.createElement("h1");
  heading.className = "jc-portal-page-title";
  heading.textContent = "Postulantes";

  const message = document.createElement("p");
  message.className = "jc-portal-page-message";
  message.textContent = "Revisa postulaciones y actualiza sus estados desde este panel local.";

  const list = document.createElement("div");
  list.className = "jc-portal-application-list";
  const jobs = jobsRepository.list({ createdBy: portalSession.get().id });
  const applications = jobs.flatMap((job) => applicationsRepository.listByJob(job.id).map((application) => ({ application, job })));
  if (applications.length === 0) list.append(document.createTextNode("Aún no hay postulaciones para tus ofertas."));
  applications.forEach(({ application, job }) => {
    const card = document.createElement("article");
    card.className = "jc-portal-job-card";
    const title = document.createElement("h2");
    title.className = "jc-portal-job-card-title";
    title.textContent = job.title;
    const candidate = document.createElement("p");
    candidate.className = "jc-portal-job-card-meta";
    candidate.textContent = `Candidato: ${application.candidateId}`;
    const status = document.createElement("select");
    status.className = "jc-portal-sort-select";
    status.setAttribute("aria-label", `Estado de ${application.candidateId}`);
    ["sent", "reviewing", "interview", "rejected", "hired"].forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      option.selected = value === application.status;
      status.append(option);
    });
    status.addEventListener("change", () => applicationsRepository.updateStatus(application.id, status.value));
    card.append(title, candidate, status);
    list.append(card);
  });

  section.append(heading, message, list);
  return section;
}
