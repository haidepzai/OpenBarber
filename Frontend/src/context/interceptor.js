import axios from 'axios';

const api = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}`,
});

// Function to get the access token from local storage
const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

// Function to set the access token in local storage
const setAccessToken = (accessToken) => {
  localStorage.setItem('accessToken', accessToken);
};

// Function to get the refresh token from local storage
const getRefreshToken = () => {
  return localStorage.getItem('refreshToken');
};

// Function to set the refresh token in local storage
const setRefreshToken = (refreshToken) => {
  localStorage.setItem('refreshToken', refreshToken);
};

// Add an interceptor to automatically add an access token to outgoing requests
api.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add an interceptor to automatically refresh the token on 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // If the request is unauthorized and we haven't already retried
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Get a new access token with the refresh token
        const refreshToken = getRefreshToken();
        const response = await axios.post('/auth/refresh', { refreshToken });
        const { accessToken } = response.data;

        // Update the access token in local storage
        setAccessToken(accessToken);

        // Retry the original request with the new access token
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (error) {
        // If refreshing the token fails, redirect to the login page
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.replace('/');
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

// Function to make an authenticated API request
const makeRequest = async (url, method = 'get', data = null) => {
  const response = await api({ url, method, data });
  return response.data;
};

export { makeRequest, setAccessToken, setRefreshToken };
