import axios from 'axios';
import { API_ENDPOINTS, TIMEOUTS } from '../config/constants';

const createApiClient = () => {
  const client = axios.create({
    timeout: TIMEOUTS.API_REQUEST,
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('accessToken');
        window.location.href = '/';
      }
      return Promise.reject(error);
    }
  );

  return client;
};

const apiClient = createApiClient();

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
});

// Reviews API
export const reviewsAPI = {
  getByEnterprise: (enterpriseId) => apiClient.get(API_ENDPOINTS.REVIEWS(enterpriseId)),
  create: (enterpriseId, data) => apiClient.post(API_ENDPOINTS.REVIEWS_CREATE(enterpriseId), data),
};

// Services API
export const servicesAPI = {
  getByEnterprise: (enterpriseId) => apiClient.get(API_ENDPOINTS.SERVICES(enterpriseId)),
  delete: (id) => apiClient.delete(API_ENDPOINTS.SERVICE_DELETE(id), { headers: getAuthHeader() }),
  create: (data) => apiClient.post(API_ENDPOINTS.SERVICE_CREATE, data, { headers: getAuthHeader() }),
  update: (id, data) => apiClient.put(API_ENDPOINTS.SERVICE_UPDATE(id), data, { headers: getAuthHeader() }),
};

// Appointments API
export const appointmentsAPI = {
  getByEnterprise: (enterpriseId) => apiClient.get(API_ENDPOINTS.APPOINTMENTS(enterpriseId)),
  cancel: (id, code) => apiClient.post(API_ENDPOINTS.APPOINTMENTS_CANCEL(id, code)),
  confirm: (id, code) => apiClient.post(API_ENDPOINTS.APPOINTMENTS_CONFIRM(id, code)),
  create: (enterpriseId, data) => apiClient.post(API_ENDPOINTS.APPOINTMENTS_CREATE(enterpriseId), data),
  update: (id, data) => apiClient.put(API_ENDPOINTS.APPOINTMENTS_BY_ID(id), data, { headers: getAuthHeader() }),
  patch: (id, data) => apiClient.patch(API_ENDPOINTS.APPOINTMENTS_BY_ID(id), data, { headers: getAuthHeader() }),
  delete: (id) => apiClient.delete(API_ENDPOINTS.APPOINTMENTS_BY_ID(id), { headers: getAuthHeader() }),
};

// Users API
export const usersAPI = {
  getById: (id) => apiClient.get(API_ENDPOINTS.USER_GET(id)),
  update: (id, data) => apiClient.put(API_ENDPOINTS.USER_UPDATE(id), data, { headers: getAuthHeader() }),
  getInfo: () => apiClient.get(API_ENDPOINTS.USER_INFO, { headers: getAuthHeader() }),
};

// Employees API
export const employeesAPI = {
  getByEnterprise: (enterpriseId) => apiClient.get(API_ENDPOINTS.EMPLOYEES_BY_ENTERPRISE(enterpriseId), { headers: getAuthHeader() }),
  create: (data, enterpriseId) => {
    const config = {
      method: 'POST',
      params: { enterpriseId },
      headers: getAuthHeader(),
    };
    return apiClient.post(API_ENDPOINTS.EMPLOYEE_CREATE, data, config);
  },
  update: (id, data) => apiClient.put(API_ENDPOINTS.EMPLOYEE_UPDATE(id), data, { headers: getAuthHeader() }),
  delete: (id) => apiClient.delete(API_ENDPOINTS.EMPLOYEE_DELETE(id), { headers: getAuthHeader() }),
};

export default apiClient;
