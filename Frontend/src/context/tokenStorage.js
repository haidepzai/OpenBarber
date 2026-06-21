/**
 * In-memory token storage.
 *
 * accessToken is kept only in memory (never persisted) — protects against XSS.
 * refreshToken is kept in localStorage so users stay logged in after page reload.
 */

let _accessToken = null;

export const getAccessToken = () => _accessToken;

export const setAccessToken = (token) => {
  _accessToken = token;
};

export const getRefreshToken = () => localStorage.getItem('refreshToken');

export const setRefreshToken = (token) => {
  localStorage.setItem('refreshToken', token);
};

export const clearTokens = () => {
  _accessToken = null;
  localStorage.removeItem('refreshToken');
};

export const hasSession = () => !!localStorage.getItem('refreshToken');
