/**
 * Central configuration for the application.
 * All magic strings, URLs, timeouts, and constants go here.
 */

const BASE_URL = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080').replace(/\/api\/?$/, '').replace(/\/$/, '');
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API || '';
const GOOGLE_GEOCODE_URL = import.meta.env.VITE_GOOGLE_GEOCODE || '';

// API Endpoints
const API_ENDPOINTS = {
  // Auth
  AUTH_LOGIN: `${BASE_URL}/api/auth/authenticate`,
  AUTH_GOOGLE: `${BASE_URL}/api/auth/google`,
  AUTH_REGISTER: `${BASE_URL}/api/auth/register`,
  AUTH_VERIFY: `${BASE_URL}/api/auth/verify`,
  AUTH_REFRESH: `${BASE_URL}/api/auth/refresh`,
  AUTH_RESEND_VERIFICATION: `${BASE_URL}/api/auth/resend-verification`,
  AUTH_FORGOT_PASSWORD: `${BASE_URL}/api/auth/forgot-password`,
  AUTH_RESET_PASSWORD: `${BASE_URL}/api/auth/reset-password`,

  // Users
  USER_GET: (id) => `${BASE_URL}/api/users/${id}`,
  USER_UPDATE: (id) => `${BASE_URL}/api/users/${id}`,
  USER_INFO: `${BASE_URL}/api/users/info/`,
  USER_PHOTO: (id) => `${BASE_URL}/api/users/${id}/photo`,

  // Shops
  SHOPS: `${BASE_URL}/api/shops`,
  SHOPS_BY_EMAIL: `${BASE_URL}/api/shops/email`,
  SHOPS_BY_USER: `${BASE_URL}/api/shops/user`,
  SHOPS_RADIUS: `${BASE_URL}/api/shops/within-radius`,
  SHOP_DETAIL: (id) => `${BASE_URL}/api/shops/${id}`,
  SHOP_LOGO: (id) => `${BASE_URL}/api/shops/${id}/logo`,
  SHOP_PICTURES: (id) => `${BASE_URL}/api/shops/${id}/pictures`,
  SHOP_PICTURE_DELETE: (id, index) => `${BASE_URL}/api/shops/${id}/pictures/${index}`,
  SHOP_AVAILABLE_SLOTS: (id) => `${BASE_URL}/api/shops/${id}/available-slots`,
  SHOPS_CREATE: `${BASE_URL}/api/shops`,

  // Appointments
  APPOINTMENTS: (shopId) => `${BASE_URL}/api/appointments?shopId=${shopId}`,
  APPOINTMENTS_CREATE: (shopId) => `${BASE_URL}/api/appointments?shopId=${shopId}`,
  APPOINTMENTS_CANCEL: (id, code) => `${BASE_URL}/api/appointments/${id}?confirmationCode=${code}`,
  APPOINTMENTS_CONFIRM: (id, code) => `${BASE_URL}/api/appointments/${id}?confirmationCode=${code}`,
  APPOINTMENTS_MY: `${BASE_URL}/api/appointments/my`,
  APPOINTMENTS_BY_ID: (id) => `${BASE_URL}/api/appointments/${id}`,

  // Reviews
  REVIEWS: (shopId) => `${BASE_URL}/api/reviews?shopId=${shopId}`,
  REVIEWS_MY: `${BASE_URL}/api/reviews/my`,
  REVIEWS_CREATE_AUTH: (shopId) => `${BASE_URL}/api/reviews/auth?shopId=${shopId}`,
  REVIEW_UPDATE: (id) => `${BASE_URL}/api/reviews/${id}`,
  REVIEW_DELETE: (id) => `${BASE_URL}/api/reviews/${id}`,
  REVIEW_PHOTO: (id) => `${BASE_URL}/api/reviews/${id}/photo`,

  // Services
  SERVICES: (shopId) => `${BASE_URL}/api/services?shopId=${shopId}`,
  SERVICE_DELETE: (id) => `${BASE_URL}/api/services/${id}`,
  SERVICE_CREATE: `${BASE_URL}/api/services`,
  SERVICE_UPDATE: (id) => `${BASE_URL}/api/services/${id}`,

  // Employees
  EMPLOYEES: `${BASE_URL}/api/employees`,
  EMPLOYEES_BY_SHOP: (shopId) => `${BASE_URL}/api/employees?shopId=${shopId}`,
  EMPLOYEE_BY_ID: (id) => `${BASE_URL}/api/employees/${id}`,
  EMPLOYEE_CREATE: `${BASE_URL}/api/employees`,
  EMPLOYEE_UPDATE: (id) => `${BASE_URL}/api/employees/${id}`,
  EMPLOYEE_DELETE: (id) => `${BASE_URL}/api/employees/${id}`,
};

// Timeouts (in milliseconds)
const TIMEOUTS = {
  API_REQUEST: 10000,
  AUTO_LOGOUT: 15 * 60 * 1000,
};

// Error Messages
const ERROR_MESSAGES = {
  AUTH_INVALID_CREDENTIALS: 'Invalid email or password',
  AUTH_EMAIL_EXISTS: 'Email already in use',
  VALIDATION_EMAIL_INVALID: 'Please enter a valid email address',
  API_GENERIC_ERROR: 'An error occurred. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
};

// Success Messages
const SUCCESS_MESSAGES = {
  AUTH_LOGIN: 'Login successful',
  APPOINTMENT_BOOKED: 'Appointment booked successfully',
  APPOINTMENT_CONFIRMED: 'Appointment confirmed',
  CHANGES_SAVED: 'Changes saved successfully',
};

export { BASE_URL, GOOGLE_API_KEY, GOOGLE_GEOCODE_URL, API_ENDPOINTS, TIMEOUTS, ERROR_MESSAGES, SUCCESS_MESSAGES };
