import apiClient from "./api-client.js";
import {
  addModuleRecord,
  getModuleRecords,
  removeModuleRecord,
  setModuleRecords,
  subscribe,
  updateModuleRecord,
} from "./session-store.js";

function assertMethod(config, operation) {
  const method = config.methods[operation];
  if (!method) {
    throw new Error(`${operation} no está habilitado para ${config.title}.`);
  }
  return method;
}

export function createCrudModule({ config, mapper }) {
  async function list() {
    try {
      const response = await apiClient.request(config.endpoint);
      const records = (response?.[config.responseKey] ?? []).map(mapper.fromApi);
      return setModuleRecords(config.key, records);
    } catch (error) {
      throw error;
    }
  }

  async function create(formData) {
    try {
      const response = await apiClient.request(config.createEndpoint, {
        method: assertMethod(config, "create"),
        body: mapper.toCreatePayload(formData),
      });
      const record = mapper.fromApi(response);
      addModuleRecord(config.key, record);
      return record;
    } catch (error) {
      throw error;
    }
  }

  async function replace(recordId, formData) {
    try {
      const response = await apiClient.request(`${config.endpoint}/${recordId}`, {
        method: assertMethod(config, "replace"),
        body: mapper.toReplacePayload(formData),
      });
      const record = mapper.fromApi(response);
      updateModuleRecord(config.key, recordId, record);
      return record;
    } catch (error) {
      throw error;
    }
  }

  async function update(recordId, formData) {
    try {
      const response = await apiClient.request(`${config.endpoint}/${recordId}`, {
        method: assertMethod(config, "update"),
        body: mapper.toUpdatePayload(formData),
      });
      const record = mapper.fromApi(response);
      updateModuleRecord(config.key, recordId, record);
      return record;
    } catch (error) {
      throw error;
    }
  }

  async function remove(recordId) {
    try {
      const response = await apiClient.request(`${config.endpoint}/${recordId}`, {
        method: assertMethod(config, "remove"),
      });
      removeModuleRecord(config.key, recordId);
      return response;
    } catch (error) {
      throw error;
    }
  }

  function getRecords() {
    return getModuleRecords(config.key);
  }

  function onChange(listener) {
    return subscribe((change) => {
      if (change.type === "records:change" && change.moduleKey === config.key) {
        listener(change.records);
      }
    });
  }

  return Object.freeze({ config, list, create, replace, update, remove, getRecords, onChange });
}

export default createCrudModule;

