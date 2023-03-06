import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { getUserByToken } from '../actions/UserActions';

//Default Werte des Context (werden unten im Provider dann gesetzt)
const AuthContext = React.createContext({
  isLoggedIn: false,
  onLogout: () => { },
  onLogin: async (authRequest, customConfig) => { },
  onSignUp: async (registerRequest, customConfig) => { },
  deleteJWTTokenFromStorage: () => { },
  setIsLoggedIn: () => { },
  isLoading: false,
  setIsLoading: () => { },
  verifyHandler: async (verifyRequest, customConfig) => { },
  userId: 0,
  setEmail: () => { },
  email: '',
  user: {},
  setUser: () => { }
});

export const AuthContextProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const [userId, setUserId] = useState(0);
  const [email, setEmail] = useState('');
  const [user, setUser] = useState({});

  const deleteJWTTokenFromStorage = () => {
    let token = localStorage.getItem('accessToken');
    if (token) {
      localStorage.removeItem('accessToken');
    }
  };

  const checkForJWTToken = async () => {    
    let token = localStorage.getItem('accessToken');
    let refreshToken = localStorage.getItem('refreshToken');
    if (token) {
      const user = await getUserByToken();
      setUserId(user.id);
      setEmail(user.email);
      setIsLoggedIn(true);      
      return true;
    } else if (refreshToken) {
      const user = await getUserByToken();
      setUserId(user.id);
      setEmail(user.email);
      setIsLoggedIn(true);
      return true;
    }
    setIsLoggedIn(false);
    return false;
  };

  // wird immer zuerst aufgerufen, als aller erstes
  useEffect(() => {
    const authenticate = async () => {
      await checkForJWTToken();
    }    
    authenticate().catch(console.error);
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsLoggedIn(false);
  };

  const loginHandler = async (authRequest, customConfig) => {
    const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/authenticate`, authRequest, customConfig);
    let resObj = response.data;
    localStorage.setItem('accessToken', resObj.token);
    localStorage.setItem('refreshToken', resObj.refreshToken);

    setUserId(resObj.userId);
    if (resObj.verified) {
      setIsLoggedIn(true);
    }

    return response;
  };

  const signUpHandler = async (registerRequest, customConfig) => {
    const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/register`, registerRequest, customConfig);
    localStorage.setItem('accessToken', response.data.token);
    localStorage.setItem('refreshToken', response.data.refreshToken);
  }

  const verifyHandler = async (verifyRequest, customConfig) => {
    const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/verify`, verifyRequest, customConfig);
    setUserId(response.data.userId);
    setIsLoggedIn(true);
  }

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
        setUser
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
