import { jobsRepository } from "../core/jobs-repository.js";
import { portalSession } from "../core/portal-session.js";

export function createEmployerJobFormPage({ mode = "create" } = {}) {
  const section = document.createElement("section");
  section.className = "jc-portal-page jc-portal-employer-form-page";

  const heading = document.createElement("h1");
  heading.className = "jc-portal-page-title";
  heading.textContent = mode === "edit" ? "Editar oferta" : "Publicar oferta";

    const message = document.createElement("p");
    message.className = "jc-portal-page-message";
    message.textContent = "Completa los datos de una oferta demostrativa. Se guarda solo en este navegador.";

    const query = new URLSearchParams(window.location.hash.split("?")[1] ?? "");
    const existing = mode === "edit" ? jobsRepository.getById(query.get("id")) : null;
    const form = document.createElement("form");
    form.className = "jc-portal-auth-form";
    const fields = [
      ["Puesto", "title", existing?.title ?? ""],
      ["Empresa", "company", existing?.company?.name ?? portalSession.get()?.name ?? ""],
      ["Ciudad", "city", existing?.location?.city ?? ""],
      ["Provincia", "province", existing?.location?.province ?? "San José"],
      ["Salario mínimo", "salaryMin", existing?.salary?.min ?? ""],
      ["Salario máximo", "salaryMax", existing?.salary?.max ?? ""],
    ];
    fields.forEach(([labelText, name, value]) => {
      const label = document.createElement("label");
      label.textContent = labelText;
      const input = document.createElement("input");
      input.className = "jc-portal-auth-input";
      input.name = name;
      input.value = value;
      input.required = true;
      input.type = name.startsWith("salary") ? "number" : "text";
      form.append(label, input);
    });
    const description = document.createElement("textarea");
    description.className = "jc-portal-auth-input";
    description.name = "description";
    description.placeholder = "Descripción de la oferta";
    description.value = existing?.description ?? "";
    description.required = true;
    form.append(description);
    const submit = document.createElement("button");
    submit.className = "jc-portal-btn jc-portal-btn--primary";
    submit.type = "submit";
    submit.textContent = mode === "edit" ? "Guardar cambios" : "Publicar oferta";
    form.append(submit);
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(form));
      const changes = { title: data.title, description: data.description, company: { ...(existing?.company ?? {}), name: data.company }, location: { country: "Costa Rica", city: data.city, province: data.province }, salary: { min: Number(data.salaryMin), max: Number(data.salaryMax), currency: "CRC", period: "month", visible: true } };
      if (existing) jobsRepository.update(existing.id, changes);
      else jobsRepository.create({ id: `job-${Date.now()}`, slug: data.title.toLowerCase().replaceAll(" ", "-"), ...changes, workMode: "hybrid", contractType: "full-time", category: "Administración", experienceLevel: "mid", publishedAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 2592000000).toISOString(), responsibilities: ["Coordinar objetivos del puesto"], requirements: ["Comunicación efectiva"], skills: ["Organización", "Comunicación", "Gestión"], benefits: ["Capacitación"], featured: false, status: "active", applicantsCount: 0, createdBy: portalSession.get().id });
      window.location.hash = "#/empresa/ofertas";
    });

    section.append(heading, message, form);
  return section;
}
