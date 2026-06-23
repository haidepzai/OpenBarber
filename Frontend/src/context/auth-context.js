import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { getUserByToken } from '../actions/UserActions';
import { API_ENDPOINTS } from '../config/constants';
import { clearTokens, getRefreshToken, hasSession, setAccessToken, setRefreshToken } from './tokenStorage';

//Default Werte des Context (werden unten im Provider dann gesetzt)
const AuthContext = React.createContext({
  isLoggedIn: false,
  onLogout: () => {},
  onLogin: async (authRequest, customConfig) => {},
  onSignUp: async (registerRequest, customConfig) => {},
  deleteJWTTokenFromStorage: () => {},
  setIsLoggedIn: () => {},
  isLoading: false,
  setIsLoading: () => {},
  verifyHandler: async (verifyRequest, customConfig) => {},
  userId: 0,
  setEmail: () => {},
  email: '',
  user: {},
  setUser: () => {},
  role: null,
});

export const AuthContextProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(0);
  const [email, setEmail] = useState('');
  const [user, setUser] = useState({});
  const [role, setRole] = useState(null);

  const deleteJWTTokenFromStorage = () => {
    clearTokens();
  };

  const checkForJWTToken = async () => {
    if (!hasSession()) {
      setIsLoggedIn(false);
      return false;
    }
    try {
      // Use refresh token to restore access token into memory after page reload
      const refreshToken = getRefreshToken();
      const response = await axios.post(API_ENDPOINTS.AUTH_REFRESH, { refreshToken });
      setAccessToken(response.data.token);
      setRefreshToken(response.data.refreshToken);
      const user = await getUserByToken();
      setUserId(user.id);
      setEmail(user.email);
      setRole(user.role);
      setIsLoggedIn(true);
      return true;
    } catch {
      clearTokens();
      setIsLoggedIn(false);
      return false;
    }
  };

  // wird immer zuerst aufgerufen, als aller erstes
  useEffect(() => {
    const authenticate = async () => {
      await checkForJWTToken();
    };
    //getRefreshToken().catch(console.error);
    authenticate().catch(console.error);
  }, []);

  const logoutHandler = () => {
    clearTokens();
    setIsLoggedIn(false);
    setRole(null);
  };

  const loginHandler = async (authRequest, customConfig, rememberMe = false) => {
    const response = await axios.post(API_ENDPOINTS.AUTH_LOGIN, authRequest, customConfig);
    const resObj = response.data;
    setAccessToken(resObj.token);
    setRefreshToken(resObj.refreshToken, rememberMe);

    setUserId(resObj.userId);
    if (resObj.verified) {
      setIsLoggedIn(true);
      // Fetch user info to get role after login
      try {
        const user = await getUserByToken();
        setEmail(user.email);
        setRole(user.role);
      } catch (e) {
        // non-critical – role will be set on next page load
      }
    }

    return response;
  };

  const signUpHandler = async (registerRequest, customConfig) => {
    try {
      const response = await axios.post(API_ENDPOINTS.AUTH_REGISTER, registerRequest, customConfig);
      setAccessToken(response.data.token);
      setRefreshToken(response.data.refreshToken);
      return response;
    } catch (error) {
      throw new Error(error);
    }
  };

  const verifyHandler = async (verifyRequest, customConfig) => {
    const response = await axios.post(API_ENDPOINTS.AUTH_VERIFY, verifyRequest, customConfig);
    setUserId(response.data.userId);
    setIsLoggedIn(true);
    return response;
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        onLogout: logoutHandler,
        onLogin: loginHandler,
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
      {props.children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
