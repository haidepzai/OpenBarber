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

// Add a request interceptor
api.interceptors.request.use(
    async (config) => {
      const accessToken = getAccessToken();
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => {
      Promise.reject(error);
    }
  );

// Add a response interceptor
api.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      const refreshToken = getRefreshToken();
  
      if (
        error.response.status === 401 &&
        originalRequest.url === `${process.env.REACT_APP_API_BASE_URL}/api/auth/refresh`
      ) {
        // If the refresh token request fails, log out the user
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.reload();
        return Promise.reject(error);
      }
  
      if (
        error.response.status === 401 &&
        !originalRequest._retry &&
        refreshToken
      ) {
        originalRequest._retry = true;
        try {
          const response = await api.post(
            `${process.env.REACT_APP_API_BASE_URL}/auth/refresh`,
            {
              refreshToken,
            }
          );
          const { accessToken } = response.data;
          setAccessToken(accessToken);
          api.defaults.headers.common[
            'Authorization'
          ] = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (error) {
          // If the refresh token request fails, log out the user
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.reload();
          return Promise.reject(error);
        }
      }
  
      return Promise.reject(error);
    }
  );

const headers = {
    Authorization: `Bearer ${getAccessToken()}`,
  };

// Function to make an authenticated API request
const makeRequest = async (url, method = 'get', data = null, config = headers) => {
  const accessToken = getAccessToken();

  if (!accessToken) {
    // If there's no access token, redirect to home
    window.location.replace('/');
  }

  const response = await api({ url, method, data, headers });

  return response.data;
};

export { makeRequest, setAccessToken, setRefreshToken };