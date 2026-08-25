const allowedWorkModes = new Set(["remote", "hybrid", "onsite"]);
const allowedContractTypes = new Set(["full-time", "part-time", "temporary", "internship"]);
const allowedExperienceLevels = new Set(["entry", "junior", "mid", "senior"]);
const allowedJobStatuses = new Set(["active", "paused", "closed"]);
const allowedApplicationStatuses = new Set(["sent", "reviewing", "interview", "rejected", "hired"]);

function requiredText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function validDate(value) {
  return requiredText(value) && !Number.isNaN(Date.parse(value));
}

export function validateJob(job) {
  const errors = {};

  if (!requiredText(job?.title)) {
    errors.title = "El título es obligatorio.";
  }

  if (!requiredText(job?.company?.name)) {
    errors.company = "La empresa es obligatoria.";
  }

  if (!requiredText(job?.location?.province) || !requiredText(job?.location?.city)) {
    errors.location = "La ubicación es obligatoria.";
  }

  if (!requiredText(job?.description)) {
    errors.description = "La descripción es obligatoria.";
  }

  if (!Array.isArray(job?.responsibilities) || job.responsibilities.length === 0) {
    errors.responsibilities = "Agrega al menos una responsabilidad.";
  }

  if (!Array.isArray(job?.requirements) || job.requirements.length === 0) {
    errors.requirements = "Agrega al menos un requisito.";
  }

  if (!allowedWorkModes.has(job?.workMode)) {
    errors.workMode = "La modalidad no es válida.";
  }

  if (!allowedContractTypes.has(job?.contractType)) {
    errors.contractType = "El tipo de contrato no es válido.";
  }

  if (!allowedExperienceLevels.has(job?.experienceLevel)) {
    errors.experienceLevel = "El nivel de experiencia no es válido.";
  }

  if (!allowedJobStatuses.has(job?.status)) {
    errors.status = "El estado de la oferta no es válido.";
  }

  const minimumSalary = Number(job?.salary?.min);
  const maximumSalary = Number(job?.salary?.max);

  if (!Number.isFinite(minimumSalary) || minimumSalary < 0) {
    errors.salaryMin = "El salario mínimo no es válido.";
  }

  if (!Number.isFinite(maximumSalary) || maximumSalary < minimumSalary) {
    errors.salaryMax = "El salario máximo no puede ser menor que el mínimo.";
  }

  if (!validDate(job?.publishedAt)) {
    errors.publishedAt = "La fecha de publicación no es válida.";
  }

  if (!validDate(job?.expiresAt) || Date.parse(job.expiresAt) <= Date.parse(job.publishedAt)) {
    errors.expiresAt = "La fecha de expiración debe ser posterior a la publicación.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateApplication(application) {
  const errors = {};

  if (!requiredText(application?.jobId)) {
    errors.jobId = "La oferta es obligatoria.";
  }

  if (!requiredText(application?.candidateId)) {
    errors.candidateId = "El candidato es obligatorio.";
  }

  if (!requiredText(application?.employerId)) {
    errors.employerId = "La empresa es obligatoria.";
  }

  if (!allowedApplicationStatuses.has(application?.status)) {
    errors.status = "El estado de la postulación no es válido.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
