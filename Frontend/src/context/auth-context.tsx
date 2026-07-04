import axios from 'axios';
import React, { useEffect, useState, type ReactNode } from 'react';
import { usersAPI } from '../api/apiClient';
import { API_ENDPOINTS } from '../config/constants';
import type { AuthContextType, User } from '../types';
import { clearTokens, getRefreshToken, hasSession, setAccessToken, setRefreshToken } from './tokenStorage';

const defaultAuthContext: AuthContextType = {
  isLoggedIn: false,
  onLogout: () => undefined,
  onLogin: async () => undefined,
  onGoogleLogin: async (_idToken: string) => undefined,
  onSignUp: async () => undefined,
  deleteJWTTokenFromStorage: () => undefined,
  setIsLoggedIn: () => undefined,
  isLoading: false,
  setIsLoading: () => undefined,
  verifyHandler: async () => undefined,
  userId: 0,
  setEmail: () => undefined,
  email: '',
  user: {},
  setUser: () => undefined,
  role: null,
};

const AuthContext = React.createContext<AuthContextType>(defaultAuthContext);

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(0);
  const [email, setEmail] = useState('');
  const [user, setUser] = useState<Partial<User>>({});
  const [role, setRole] = useState<string | null>(null);

  const deleteJWTTokenFromStorage = () => {
    clearTokens();
  };

  const checkForJWTToken = async (): Promise<boolean> => {
    if (!hasSession()) {
      setIsLoggedIn(false);
      return false;
    }

    try {
      const refreshToken = getRefreshToken();
      const response = await axios.post(API_ENDPOINTS.AUTH_REFRESH, { refreshToken });
      setAccessToken(response.data.token);
      setRefreshToken(response.data.refreshToken);
      const currentUser = (await usersAPI.getInfo()).data as Partial<User>;
      setUserId(currentUser.id ?? 0);
      setEmail(currentUser.email ?? '');
      setRole(currentUser.role ?? null);
      setUser(currentUser);
      setIsLoggedIn(true);
      return true;
    } catch {
      clearTokens();
      setIsLoggedIn(false);
      return false;
    }
  };

  useEffect(() => {
    const authenticate = async () => {
      await checkForJWTToken();
    };

    authenticate().catch(console.error);
  }, []);

  const logoutHandler = () => {
    clearTokens();
    setIsLoggedIn(false);
    setRole(null);
  };

  const loginHandler = async (authRequest: unknown, customConfig?: unknown, rememberMe = false) => {
    const response = await axios.post(API_ENDPOINTS.AUTH_LOGIN, authRequest, customConfig);
    const resObj = response.data;
    setAccessToken(resObj.token);
    setRefreshToken(resObj.refreshToken, rememberMe);
    setUserId(resObj.userId ?? 0);

    if (resObj.verified) {
      setIsLoggedIn(true);
      try {
        const currentUser = (await usersAPI.getInfo()).data as Partial<User>;
        setEmail(currentUser.email ?? '');
        setRole(currentUser.role ?? null);
        setUser(currentUser);
      } catch {
        // non-critical – role will be set on next page load
      }
    }

    return response;
  };

  const googleLoginHandler = async (idToken: string) => {
    const response = await axios.post(API_ENDPOINTS.AUTH_GOOGLE, { idToken });
    const resObj = response.data;
    setAccessToken(resObj.token);
    setRefreshToken(resObj.refreshToken);
    setUserId(resObj.userId ?? 0);
    setIsLoggedIn(true);

    try {
      const currentUser = (await usersAPI.getInfo()).data as Partial<User>;
      setEmail(currentUser.email ?? '');
      setRole(currentUser.role ?? null);
      setUser(currentUser);
    } catch {
      // non-critical – role will be set on next page load
    }

    return response;
  };

  const signUpHandler = async (registerRequest: unknown, customConfig?: unknown) => {
    try {
      const response = await axios.post(API_ENDPOINTS.AUTH_REGISTER, registerRequest, customConfig);
      setAccessToken(response.data.token);
      setRefreshToken(response.data.refreshToken);
      return response;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Sign up failed');
    }
  };

  const verifyHandler = async (verifyRequest: unknown, customConfig?: unknown) => {
    const response = await axios.post(API_ENDPOINTS.AUTH_VERIFY, verifyRequest, customConfig);
    setUserId(response.data.userId ?? 0);
    setIsLoggedIn(true);
    return response;
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        onLogout: logoutHandler,
        onLogin: loginHandler,
        onGoogleLogin: googleLoginHandler,
        deleteJWTTokenFromStorage,
        setIsLoggedIn,
        onSignUp: signUpHandler,
        isLoading,
        setIsLoading,
        verifyHandler,
        userId,
        email,
        setEmail,
        user,
        setUser,
        role,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
