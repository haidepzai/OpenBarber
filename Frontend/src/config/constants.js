/**
 * Central configuration for the application.
 * All magic strings, URLs, timeouts, and constants go here.
 */

const BASE_URL = (process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080').replace(/\/api\/?$/, '').replace(/\/$/, '');
const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API || '';
const GOOGLE_GEOCODE_URL = process.env.REACT_APP_GOOGLE_GEOCODE || '';

// API Endpoints
const API_ENDPOINTS = {
  // Auth
  AUTH_LOGIN: `${BASE_URL}/api/auth/authenticate`,
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

  // Enterprises
  ENTERPRISES: `${BASE_URL}/api/enterprises`,
  ENTERPRISES_BY_EMAIL: `${BASE_URL}/api/enterprises/email`,
  ENTERPRISES_BY_USER: `${BASE_URL}/api/enterprises/user`,
  ENTERPRISES_RADIUS: `${BASE_URL}/api/enterprises/within-radius`,
  ENTERPRISE_DETAIL: (id) => `${BASE_URL}/api/enterprises/${id}`,
  ENTERPRISE_LOGO: (id) => `${BASE_URL}/api/enterprises/${id}/logo`,
  ENTERPRISE_PICTURES: (id) => `${BASE_URL}/api/enterprises/${id}/pictures`,
  ENTERPRISE_PICTURE_DELETE: (id, index) => `${BASE_URL}/api/enterprises/${id}/pictures/${index}`,
  ENTERPRISES_CREATE: `${BASE_URL}/api/enterprises`,

  // Appointments
  APPOINTMENTS: (enterpriseId) => `${BASE_URL}/api/appointments?enterpriseId=${enterpriseId}`,
  APPOINTMENTS_CREATE: (enterpriseId) => `${BASE_URL}/api/appointments?enterpriseId=${enterpriseId}`,
  APPOINTMENTS_CANCEL: (id, code) => `${BASE_URL}/api/appointments/${id}?confirmationCode=${code}`,
  APPOINTMENTS_CONFIRM: (id, code) => `${BASE_URL}/api/appointments/${id}?confirmationCode=${code}`,
  APPOINTMENTS_BY_ID: (id) => `${BASE_URL}/api/appointments/${id}`,

  // Reviews
  REVIEWS: (enterpriseId) => `${BASE_URL}/api/reviews?enterpriseId=${enterpriseId}`,
  REVIEWS_CREATE: (enterpriseId) => `${BASE_URL}/api/reviews?enterpriseId=${enterpriseId}`,

  // Services
  SERVICES: (enterpriseId) => `${BASE_URL}/api/services?enterpriseId=${enterpriseId}`,
  SERVICE_DELETE: (id) => `${BASE_URL}/api/services/${id}`,
  SERVICE_CREATE: `${BASE_URL}/api/services`,
  SERVICE_UPDATE: (id) => `${BASE_URL}/api/services/${id}`,

  // Employees
  EMPLOYEES: `${BASE_URL}/api/employees`,
  EMPLOYEES_BY_ENTERPRISE: (enterpriseId) => `${BASE_URL}/api/employees?enterpriseId=${enterpriseId}`,
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

export {
  BASE_URL,
  GOOGLE_API_KEY,
  GOOGLE_GEOCODE_URL,
  API_ENDPOINTS,
  TIMEOUTS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
};
