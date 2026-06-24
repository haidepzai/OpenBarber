/**
 * In-memory token storage.
 *
 * accessToken is kept only in memory (never persisted) — protects against XSS.
 * refreshToken is stored in localStorage (rememberMe=true) or sessionStorage (rememberMe=false).
 *   - localStorage: persists across browser restarts
 *   - sessionStorage: survives page refreshes, but cleared when browser/tab is closed
 */

const REFRESH_KEY = 'refreshToken';

let accessToken: string | null = null;

export const getAccessToken = (): string | null => accessToken;

export const setAccessToken = (token: string | null): void => {
  accessToken = token;
};

export const getRefreshToken = (): string | null => localStorage.getItem(REFRESH_KEY) ?? sessionStorage.getItem(REFRESH_KEY);

export const setRefreshToken = (token: string, rememberMe = false): void => {
  if (rememberMe) {
    localStorage.setItem(REFRESH_KEY, token);
    sessionStorage.removeItem(REFRESH_KEY);
  } else {
    sessionStorage.setItem(REFRESH_KEY, token);
    localStorage.removeItem(REFRESH_KEY);
  }
};

export const clearTokens = (): void => {
  accessToken = null;
  localStorage.removeItem(REFRESH_KEY);
  sessionStorage.removeItem(REFRESH_KEY);
};

export const hasSession = (): boolean => Boolean(localStorage.getItem(REFRESH_KEY) || sessionStorage.getItem(REFRESH_KEY));
