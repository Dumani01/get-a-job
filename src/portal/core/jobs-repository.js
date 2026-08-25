import { PORTAL_EVENTS, PORTAL_STORAGE_KEYS } from "../config/portal.config.js";
import { jobsSeed } from "../data/jobs.seed.js";

const listeners = new Set();

function clone(value) {
  return typeof structuredClone === "function"
    ? structuredClone(value)
    : JSON.parse(JSON.stringify(value));
}

function readJobs() {
  const rawValue = window.localStorage.getItem(PORTAL_STORAGE_KEYS.jobs);

  if (!rawValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeJobs(jobs) {
  window.localStorage.setItem(PORTAL_STORAGE_KEYS.jobs, JSON.stringify(jobs));
}

function notify(jobs) {
  const snapshot = clone(jobs);
  listeners.forEach((listener) => listener(clone(snapshot)));
  window.dispatchEvent(new CustomEvent(PORTAL_EVENTS.jobsChange, { detail: { jobs: snapshot } }));
}

function normalizeText(value) {
  return String(value ?? "").trim().toLocaleLowerCase("es-CR");
}

function matchesFilters(job, filters) {
  const search = normalizeText(filters.search);

  if (search) {
    const haystack = normalizeText([
      job.title,
      job.company?.name,
      job.location?.city,
      job.location?.province,
      job.category,
      ...(job.skills ?? []),
    ].join(" "));

    if (!haystack.includes(search)) {
      return false;
    }
  }

  const exactFilters = [
    ["province", job.location?.province],
    ["workMode", job.workMode],
    ["category", job.category],
    ["contractType", job.contractType],
    ["experienceLevel", job.experienceLevel],
    ["status", job.status],
    ["createdBy", job.createdBy],
  ];

  return exactFilters.every(([key, value]) => !filters[key] || filters[key] === value)
    && (filters.featured === undefined || filters.featured === job.featured);
}

export const jobsRepository = Object.freeze({
  seed() {
    const existingJobs = readJobs();

    if (existingJobs.length > 0) {
      return clone(existingJobs);
    }

    const seededJobs = clone(jobsSeed);
    writeJobs(seededJobs);
    notify(seededJobs);
    return clone(seededJobs);
  },

  list(filters = {}) {
    return clone(readJobs().filter((job) => matchesFilters(job, filters)));
  },

  getById(jobId) {
    return clone(readJobs().find((job) => job.id === jobId) ?? null);
  },

  create(job) {
    const jobs = readJobs();

    if (jobs.some((item) => item.id === job.id)) {
      throw new Error("Ya existe una oferta con ese identificador.");
    }

    const createdJob = clone(job);
    jobs.push(createdJob);
    writeJobs(jobs);
    notify(jobs);
    return clone(createdJob);
  },

  update(jobId, changes) {
    const jobs = readJobs();
    const index = jobs.findIndex((job) => job.id === jobId);

    if (index < 0) {
      throw new Error("No se encontró la oferta solicitada.");
    }

    jobs[index] = {
      ...jobs[index],
      ...clone(changes),
      id: jobs[index].id,
    };

    writeJobs(jobs);
    notify(jobs);
    return clone(jobs[index]);
  },

  remove(jobId) {
    const jobs = readJobs();
    const index = jobs.findIndex((job) => job.id === jobId);

    if (index < 0) {
      return null;
    }

    const [removedJob] = jobs.splice(index, 1);
    writeJobs(jobs);
    notify(jobs);
    return clone(removedJob);
  },

  setStatus(jobId, status) {
    return this.update(jobId, { status });
  },

  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
});
