import axios from 'axios';
import { API_ENDPOINTS, TIMEOUTS } from '../config/constants';
import { clearTokens, getAccessToken, getRefreshToken, setAccessToken, setRefreshToken } from '../context/tokenStorage';

type RequestHeaders = Record<string, string>;

interface AuthRequestConfig {
  headers?: RequestHeaders;
}

const createApiClient = () => {
  const client = axios.create({
    timeout: TIMEOUTS.API_REQUEST,
  });

  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && originalRequest && !originalRequest._retry && originalRequest.url !== API_ENDPOINTS.AUTH_REFRESH) {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
          const refreshedAccessToken = await refreshAccessToken();
          originalRequest.headers = {
            ...(originalRequest.headers || {}),
            Authorization: `Bearer ${refreshedAccessToken}`,
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
let refreshInFlight: Promise<string> | null = null;

const getAuthHeader = (): RequestHeaders => ({
  Authorization: `Bearer ${getAccessToken()}`,
});

const refreshAccessToken = async (): Promise<string> => {
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
        return response.data.token as string;
      })
      .finally(() => {
        refreshInFlight = null;
      });
  }

  return refreshInFlight;
};

export const reviewsAPI = {
  getByShop: (shopId: unknown) => apiClient.get(API_ENDPOINTS.REVIEWS(shopId)),
  getMy: () => apiClient.get(API_ENDPOINTS.REVIEWS_MY, { headers: getAuthHeader() }),
  create: (shopId: unknown, data: unknown) => apiClient.post(API_ENDPOINTS.REVIEWS_CREATE_AUTH(shopId), data, { headers: getAuthHeader() }),
  update: (id: unknown, data: unknown) => apiClient.put(API_ENDPOINTS.REVIEW_UPDATE(id), data, { headers: getAuthHeader() }),
  delete: (id: unknown) => apiClient.delete(API_ENDPOINTS.REVIEW_DELETE(id), { headers: getAuthHeader() }),
};

export const shopsAPI = {
  getByUser: () => apiClient.get(API_ENDPOINTS.SHOPS_BY_USER, { headers: getAuthHeader() }),
  getById: (id: unknown) => apiClient.get(API_ENDPOINTS.SHOP_DETAIL(id), { headers: getAuthHeader() }),
  uploadLogo: (id: unknown, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post(API_ENDPOINTS.SHOP_LOGO(id), formData, {
      headers: { ...getAuthHeader(), 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteLogo: (id: unknown) => apiClient.delete(API_ENDPOINTS.SHOP_LOGO(id), { headers: getAuthHeader() }),
  uploadPictures: (id: unknown, files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    return apiClient.post(API_ENDPOINTS.SHOP_PICTURES(id), formData, {
      headers: { ...getAuthHeader(), 'Content-Type': 'multipart/form-data' },
    });
  },
  deletePicture: (id: unknown, index: unknown) => apiClient.delete(API_ENDPOINTS.SHOP_PICTURE_DELETE(id, index), { headers: getAuthHeader() }),
  getAvailableSlots: (shopId: unknown, date: unknown, employeeId: unknown, serviceDuration: unknown) => {
    const params: Record<string, unknown> = { date, serviceDuration };
    if (employeeId) {
      params.employeeId = employeeId;
    }
    return apiClient.get(API_ENDPOINTS.SHOP_AVAILABLE_SLOTS(shopId), { params });
  },
};

export const servicesAPI = {
  getByShop: (shopId: unknown) => apiClient.get(API_ENDPOINTS.SERVICES(shopId)),
  delete: (id: unknown) => apiClient.delete(API_ENDPOINTS.SERVICE_DELETE(id), { headers: getAuthHeader() }),
  create: (data: unknown) => apiClient.post(API_ENDPOINTS.SERVICE_CREATE, data, { headers: getAuthHeader() }),
  update: (id: unknown, data: unknown) => apiClient.put(API_ENDPOINTS.SERVICE_UPDATE(id), data, { headers: getAuthHeader() }),
};

export const appointmentsAPI = {
  getByShop: (shopId: unknown) => apiClient.get(API_ENDPOINTS.APPOINTMENTS(shopId), { headers: getAuthHeader() }),
  getMy: () => apiClient.get(API_ENDPOINTS.APPOINTMENTS_MY, { headers: getAuthHeader() }),
  cancel: (id: unknown, code: unknown) => apiClient.delete(API_ENDPOINTS.APPOINTMENTS_CANCEL(id, code), { headers: getAuthHeader() }),
  confirm: (id: unknown, code: unknown) => apiClient.post(API_ENDPOINTS.APPOINTMENTS_CONFIRM(id, code), {}, { headers: getAuthHeader() }),
  create: (shopId: unknown, data: unknown, captchaToken: string | null = null) => {
    const token = getAccessToken();
    const config: AuthRequestConfig = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    if (captchaToken) {
      config.headers = { ...(config.headers || {}), 'X-Recaptcha-Token': captchaToken };
    }
    return apiClient.post(API_ENDPOINTS.APPOINTMENTS_CREATE(shopId), data, config);
  },
  update: (id: unknown, data: unknown) => apiClient.put(API_ENDPOINTS.APPOINTMENTS_BY_ID(id), data, { headers: getAuthHeader() }),
  patch: (id: unknown, data: unknown) => apiClient.patch(API_ENDPOINTS.APPOINTMENTS_BY_ID(id), data, { headers: getAuthHeader() }),
  delete: (id: unknown) => apiClient.delete(API_ENDPOINTS.APPOINTMENTS_BY_ID(id), { headers: getAuthHeader() }),
};

export const usersAPI = {
  getById: (id: unknown) => apiClient.get(API_ENDPOINTS.USER_GET(id), { headers: getAuthHeader() }),
  update: (id: unknown, data: unknown) => apiClient.put(API_ENDPOINTS.USER_UPDATE(id), data, { headers: getAuthHeader() }),
  getInfo: () => apiClient.get(API_ENDPOINTS.USER_INFO, { headers: getAuthHeader() }),
  uploadPhoto: (id: unknown, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post(API_ENDPOINTS.USER_PHOTO(id), formData, {
      headers: { ...getAuthHeader(), 'Content-Type': 'multipart/form-data' },
    });
  },
};

export const employeesAPI = {
  getByShop: (shopId: unknown) => apiClient.get(API_ENDPOINTS.EMPLOYEES_BY_SHOP(shopId), { headers: getAuthHeader() }),
  create: (data: unknown, shopId: unknown) => {
    const config = {
      method: 'POST',
      params: { shopId },
      headers: getAuthHeader(),
    };
    return apiClient.post(API_ENDPOINTS.EMPLOYEE_CREATE, data, config);
  },
  update: (id: unknown, data: unknown) => apiClient.put(API_ENDPOINTS.EMPLOYEE_UPDATE(id), data, { headers: getAuthHeader() }),
  delete: (id: unknown) => apiClient.delete(API_ENDPOINTS.EMPLOYEE_DELETE(id), { headers: getAuthHeader() }),
};

export default apiClient;
