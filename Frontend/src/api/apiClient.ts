import axios, { type AxiosRequestConfig } from 'axios';
import { API_ENDPOINTS, TIMEOUTS } from '../config/constants';
import { clearTokens, getAccessToken, getRefreshToken, setAccessToken, setRefreshToken } from '../context/tokenStorage';

type RequestHeaders = Record<string, string>;

type ShopFilter = {
  priceCategory?: number[];
  targetAudience?: string[];
  employeeCount?: [number, number];
  openingDays?: string[];
  openingTime?: string | null;
  closingTime?: string | null;
  paymentMethods?: string[];
  drinks?: string[];
  minRating?: number | null;
  availableDate?: string | null;
  availableFromTime?: string | null;
};

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

const getAuthHeader = (): RequestHeaders => {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

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

const normalizeTimeParam = (value?: string | null): string | null => {
  if (!value) {
    return null;
  }

  const separatorIndex = value.indexOf('T');
  if (separatorIndex >= 0 && value.length >= separatorIndex + 6) {
    return value.substring(separatorIndex + 1, separatorIndex + 6);
  }

  return value.length >= 5 ? value.substring(0, 5) : value;
};

const appendArrayParam = (
  params: URLSearchParams,
  key: string,
  values?: unknown[],
  mapValue: (value: unknown) => string = (value) => String(value)
) => {
  values?.forEach((value) => {
    if (value !== null && value !== undefined && value !== '') {
      params.append(key, mapValue(value));
    }
  });
};

const buildShopParams = (page: number, size: number, filter?: ShopFilter, extraParams: Record<string, unknown> = {}) => {
  const params = new URLSearchParams();

  Object.entries({ ...extraParams, page, size }).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      params.append(key, String(value));
    }
  });

  if (!filter) {
    return params;
  }

  appendArrayParam(params, 'priceCategory', filter.priceCategory);
  appendArrayParam(params, 'targetAudience', filter.targetAudience, (value) => (value === 'KIDS' ? 'CHILDREN' : String(value)));
  appendArrayParam(params, 'openingDays', filter.openingDays);
  appendArrayParam(params, 'paymentMethods', filter.paymentMethods);
  appendArrayParam(params, 'drinks', filter.drinks);

  const [employeeCountMin, employeeCountMax] = filter.employeeCount ?? [];
  if (typeof employeeCountMin === 'number' && employeeCountMin > 0) {
    params.append('employeeCountMin', String(employeeCountMin));
  }
  if (typeof employeeCountMax === 'number' && employeeCountMax < 20) {
    params.append('employeeCountMax', String(employeeCountMax));
  }

  const openingTime = normalizeTimeParam(filter.openingTime);
  if (openingTime) {
    params.append('openingTime', openingTime);
  }

  const closingTime = normalizeTimeParam(filter.closingTime);
  if (closingTime) {
    params.append('closingTime', closingTime);
  }

  if (filter.minRating != null && filter.minRating > 0) {
    params.append('minRating', String(filter.minRating));
  }

  if (filter.availableDate) {
    params.append('availableDate', filter.availableDate);
  }

  if (filter.availableFromTime) {
    params.append('availableFromTime', filter.availableFromTime);
  }

  return params;
};

export const reviewsAPI = {
  getByShop: (shopId: unknown) => apiClient.get(API_ENDPOINTS.REVIEWS(shopId)),
  getMy: () => apiClient.get(API_ENDPOINTS.REVIEWS_MY, { headers: getAuthHeader() }),
  create: (shopId: unknown, data: unknown) => apiClient.post(API_ENDPOINTS.REVIEWS_CREATE_AUTH(shopId), data, { headers: getAuthHeader() }),
  update: (id: unknown, data: unknown) => apiClient.put(API_ENDPOINTS.REVIEW_UPDATE(id), data, { headers: getAuthHeader() }),
  delete: (id: unknown) => apiClient.delete(API_ENDPOINTS.REVIEW_DELETE(id), { headers: getAuthHeader() }),
  uploadPhoto: (id: unknown, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post(API_ENDPOINTS.REVIEW_PHOTO(id), formData, {
      headers: { ...getAuthHeader(), 'Content-Type': 'multipart/form-data' },
    });
  },
  deletePhoto: (id: unknown) => apiClient.delete(API_ENDPOINTS.REVIEW_PHOTO(id), { headers: getAuthHeader() }),
};

export const shopsAPI = {
  getAll: (page = 0, size = 12, filter?: ShopFilter) => apiClient.get(API_ENDPOINTS.SHOPS, { params: buildShopParams(page, size, filter) }),
  getWithinRadius: (lat: unknown, lng: unknown, page = 0, size = 12, filter?: ShopFilter) =>
    apiClient.get(API_ENDPOINTS.SHOPS_RADIUS, { params: buildShopParams(page, size, filter, { lat, lng, radius: 5 }) }),
  getByEmail: (email: unknown) => apiClient.get(API_ENDPOINTS.SHOPS_BY_EMAIL, { params: { email } }),
  getByUser: () => apiClient.get(API_ENDPOINTS.SHOPS_BY_USER, { headers: getAuthHeader() }),
  getById: (id: unknown) => apiClient.get(API_ENDPOINTS.SHOP_DETAIL(id), { headers: getAuthHeader() }),
  create: (data: unknown, config?: AxiosRequestConfig) => apiClient.post(API_ENDPOINTS.SHOPS_CREATE, data, config),
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
