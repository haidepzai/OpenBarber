import { servicesAPI } from '../api/apiClient';

export const deleteServiceById = async (id) => {
  return servicesAPI.delete(id);
};

export const createService = async (service, enterpriseId) => {
  return servicesAPI.create(service);
};

export const updateService = async (id, service) => {
  return servicesAPI.update(id, service);
};
