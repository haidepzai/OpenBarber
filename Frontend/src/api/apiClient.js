import axios from 'axios';
import { API_ENDPOINTS, TIMEOUTS } from '../config/constants';

const createApiClient = () => {
  const client = axios.create({
    timeout: TIMEOUTS.API_REQUEST,
  });

  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && originalRequest && !originalRequest._retry && originalRequest.url !== API_ENDPOINTS.AUTH_REFRESH) {
        originalRequest._retry = true;

        try {
          const accessToken = await refreshAccessToken();
          originalRequest.headers = {
            ...(originalRequest.headers || {}),
            Authorization: `Bearer ${accessToken}`,
          };
          return client(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.replace('/');
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return client;
};

const apiClient = createApiClient();
let refreshInFlight = null;

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
});

const refreshAccessToken = async () => {
  if (!refreshInFlight) {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('Missing refresh token');
    }

    refreshInFlight = axios
      .post(API_ENDPOINTS.AUTH_REFRESH, { refreshToken })
      .then((response) => {
        localStorage.setItem('accessToken', response.data.token);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        return response.data.token;
      })
      .finally(() => {
        refreshInFlight = null;
      });
  }

  return refreshInFlight;
};

// Reviews API
export const reviewsAPI = {
  getByEnterprise: (enterpriseId) => apiClient.get(API_ENDPOINTS.REVIEWS(enterpriseId)),
  create: (enterpriseId, data) => apiClient.post(API_ENDPOINTS.REVIEWS_CREATE(enterpriseId), data),
};

// Enterprises API
export const enterprisesAPI = {
  getByUser: () => apiClient.get(API_ENDPOINTS.ENTERPRISES_BY_USER, { headers: getAuthHeader() }),
  getById: (id) => apiClient.get(API_ENDPOINTS.ENTERPRISE_DETAIL(id), { headers: getAuthHeader() }),
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
  getByEnterprise: (enterpriseId) => apiClient.get(API_ENDPOINTS.APPOINTMENTS(enterpriseId), { headers: getAuthHeader() }),
  cancel: (id, code) => apiClient.post(API_ENDPOINTS.APPOINTMENTS_CANCEL(id, code), {}, { headers: getAuthHeader() }),
  confirm: (id, code) => apiClient.post(API_ENDPOINTS.APPOINTMENTS_CONFIRM(id, code), {}, { headers: getAuthHeader() }),
  create: (enterpriseId, data) => apiClient.post(API_ENDPOINTS.APPOINTMENTS_CREATE(enterpriseId), data, { headers: getAuthHeader() }),
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
