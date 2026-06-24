import axios from 'axios';
import { API_ENDPOINTS, TIMEOUTS } from '../config/constants';
import { clearTokens, getAccessToken, getRefreshToken, setAccessToken, setRefreshToken } from '../context/tokenStorage';

const createApiClient = () => {
  const client = axios.create({
    timeout: TIMEOUTS.API_REQUEST,
  });

  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && originalRequest && !originalRequest._retry && originalRequest.url !== API_ENDPOINTS.AUTH_REFRESH) {
        // Only retry with refresh token if we actually have one (logged-in user)
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
          const accessToken = await refreshAccessToken();
          originalRequest.headers = {
            ...(originalRequest.headers || {}),
            Authorization: `Bearer ${accessToken}`,
          };
          return client(originalRequest);
        } catch (refreshError) {
          clearTokens();
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
  Authorization: `Bearer ${getAccessToken()}`,
});

const refreshAccessToken = async () => {
  if (!refreshInFlight) {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      throw new Error('Missing refresh token');
    }

    refreshInFlight = axios
      .post(API_ENDPOINTS.AUTH_REFRESH, { refreshToken })
      .then((response) => {
        setAccessToken(response.data.token);
        setRefreshToken(response.data.refreshToken);
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
  getByShop: (shopId) => apiClient.get(API_ENDPOINTS.REVIEWS(shopId)),
  getMy: () => apiClient.get(API_ENDPOINTS.REVIEWS_MY, { headers: getAuthHeader() }),
  create: (shopId, data) => apiClient.post(API_ENDPOINTS.REVIEWS_CREATE_AUTH(shopId), data, { headers: getAuthHeader() }),
  update: (id, data) => apiClient.put(API_ENDPOINTS.REVIEW_UPDATE(id), data, { headers: getAuthHeader() }),
  delete: (id) => apiClient.delete(API_ENDPOINTS.REVIEW_DELETE(id), { headers: getAuthHeader() }),
};

// Shops API
export const shopsAPI = {
  getByUser: () => apiClient.get(API_ENDPOINTS.SHOPS_BY_USER, { headers: getAuthHeader() }),
  getById: (id) => apiClient.get(API_ENDPOINTS.SHOP_DETAIL(id), { headers: getAuthHeader() }),
  uploadLogo: (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post(API_ENDPOINTS.SHOP_LOGO(id), formData, {
      headers: { ...getAuthHeader(), 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteLogo: (id) => apiClient.delete(API_ENDPOINTS.SHOP_LOGO(id), { headers: getAuthHeader() }),
  uploadPictures: (id, files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    return apiClient.post(API_ENDPOINTS.SHOP_PICTURES(id), formData, {
      headers: { ...getAuthHeader(), 'Content-Type': 'multipart/form-data' },
    });
  },
  deletePicture: (id, index) => apiClient.delete(API_ENDPOINTS.SHOP_PICTURE_DELETE(id, index), { headers: getAuthHeader() }),
  getAvailableSlots: (shopId, date, employeeId, serviceDuration) => {
    const params = { date, serviceDuration };
    if (employeeId) params.employeeId = employeeId;
    return apiClient.get(API_ENDPOINTS.SHOP_AVAILABLE_SLOTS(shopId), { params });
  },
};

// Services API
export const servicesAPI = {
  getByShop: (shopId) => apiClient.get(API_ENDPOINTS.SERVICES(shopId)),
  delete: (id) => apiClient.delete(API_ENDPOINTS.SERVICE_DELETE(id), { headers: getAuthHeader() }),
  create: (data) => apiClient.post(API_ENDPOINTS.SERVICE_CREATE, data, { headers: getAuthHeader() }),
  update: (id, data) => apiClient.put(API_ENDPOINTS.SERVICE_UPDATE(id), data, { headers: getAuthHeader() }),
};

// Appointments API
export const appointmentsAPI = {
  getByShop: (shopId) => apiClient.get(API_ENDPOINTS.APPOINTMENTS(shopId), { headers: getAuthHeader() }),
  getMy: () => apiClient.get(API_ENDPOINTS.APPOINTMENTS_MY, { headers: getAuthHeader() }),
  cancel: (id, code) => apiClient.delete(API_ENDPOINTS.APPOINTMENTS_CANCEL(id, code), { headers: getAuthHeader() }),
  confirm: (id, code) => apiClient.post(API_ENDPOINTS.APPOINTMENTS_CONFIRM(id, code), {}, { headers: getAuthHeader() }),
  create: (shopId, data, captchaToken = null) => {
    const token = getAccessToken();
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    if (captchaToken) {
      config.headers = { ...(config.headers || {}), 'X-Recaptcha-Token': captchaToken };
    }
    return apiClient.post(API_ENDPOINTS.APPOINTMENTS_CREATE(shopId), data, config);
  },
  update: (id, data) => apiClient.put(API_ENDPOINTS.APPOINTMENTS_BY_ID(id), data, { headers: getAuthHeader() }),
  patch: (id, data) => apiClient.patch(API_ENDPOINTS.APPOINTMENTS_BY_ID(id), data, { headers: getAuthHeader() }),
  delete: (id) => apiClient.delete(API_ENDPOINTS.APPOINTMENTS_BY_ID(id), { headers: getAuthHeader() }),
};

// Users API
export const usersAPI = {
  getById: (id) => apiClient.get(API_ENDPOINTS.USER_GET(id), { headers: getAuthHeader() }),
  update: (id, data) => apiClient.put(API_ENDPOINTS.USER_UPDATE(id), data, { headers: getAuthHeader() }),
  getInfo: () => apiClient.get(API_ENDPOINTS.USER_INFO, { headers: getAuthHeader() }),
  uploadPhoto: (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post(API_ENDPOINTS.USER_PHOTO(id), formData, {
      headers: { ...getAuthHeader(), 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Employees API
export const employeesAPI = {
  getByShop: (shopId) => apiClient.get(API_ENDPOINTS.EMPLOYEES_BY_SHOP(shopId), { headers: getAuthHeader() }),
  create: (data, shopId) => {
    const config = {
      method: 'POST',
      params: { shopId },
      headers: getAuthHeader(),
    };
    return apiClient.post(API_ENDPOINTS.EMPLOYEE_CREATE, data, config);
  },
  update: (id, data) => apiClient.put(API_ENDPOINTS.EMPLOYEE_UPDATE(id), data, { headers: getAuthHeader() }),
  delete: (id) => apiClient.delete(API_ENDPOINTS.EMPLOYEE_DELETE(id), { headers: getAuthHeader() }),
};

export default apiClient;
