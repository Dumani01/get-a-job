import { applicationsRepository } from "../core/applications-repository.js";
import { portalSession } from "../core/portal-session.js";

export function createApplicationForm({ job, onComplete = () => {} } = {}) {
  const section = document.createElement("section");
  section.className = "jc-portal-application-form";

  const heading = document.createElement("h2");
  heading.className = "jc-portal-application-form-title";
  heading.textContent = "Postulación demostrativa";

  const message = document.createElement("p");
  message.className = "jc-portal-application-form-message";
  message.textContent = "Tu CV se representa solo por su nombre; ningún archivo se almacena.";

  const form = document.createElement("form");
  form.className = "jc-portal-auth-form";
  const cvLabel = document.createElement("label");
  cvLabel.textContent = "Nombre del CV";
  const cvInput = document.createElement("input");
  cvInput.className = "jc-portal-auth-input";
  cvInput.name = "cvName";
  cvInput.required = true;
  const letterLabel = document.createElement("label");
  letterLabel.textContent = "Carta de presentación";
  const letter = document.createElement("textarea");
  letter.className = "jc-portal-auth-input";
  letter.name = "coverLetter";
  letter.rows = 5;
  const feedback = document.createElement("p");
  feedback.className = "jc-portal-auth-error";
  feedback.hidden = true;
  const submit = document.createElement("button");
  submit.className = "jc-portal-btn jc-portal-btn--primary";
  submit.type = "submit";
  submit.textContent = "Enviar postulación";

  form.append(cvLabel, cvInput, letterLabel, letter, feedback, submit);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const session = portalSession.get();
    try {
      const application = applicationsRepository.create({
        id: `application-${Date.now()}`,
        jobId: job.id,
        candidateId: session.id,
        employerId: job.createdBy,
        cvName: cvInput.value.trim(),
        coverLetter: letter.value.trim(),
        status: "sent",
        createdAt: new Date().toISOString(),
      });
      feedback.className = "jc-portal-application-form-message";
      feedback.textContent = `Postulación enviada para ${job.title}.`;
      feedback.hidden = false;
      submit.disabled = true;
      onComplete(application);
    } catch (error) {
      feedback.textContent = error.message;
      feedback.hidden = false;
    }
  });

  section.append(heading, message, form);
  return section;
}
