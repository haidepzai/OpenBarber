import axios from 'axios';
import React, { useEffect, useState } from 'react';

//Default Werte des Context (werden unten im Provider dann gesetzt)
const AuthContext = React.createContext({
  isLoggedIn: false,
  onLogout: () => {},
  onLogin: async (authRequest, customConfig) => {},
  onSignUp: async () => {},
  deleteJWTTokenFromStorage: () => {},
  setIsLoggedIn: () => {},
  isLoading: false,
  setIsLoading: () => {}
});

export const AuthContextProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);  
  const [isLoading, setIsLoading] = useState(false)

  const deleteJWTTokenFromStorage = () => {
    let token = localStorage.getItem('tokenJWT');
    if (token) {
      localStorage.removeItem('tokenJWT');
    }
  };

  const checkForJWTToken = () => {
    let token = localStorage.getItem('tokenJWT');
    if (token) {
      setIsLoggedIn(true);
      return true;
    }
    setIsLoggedIn(false);
    return false;
  };

  useEffect(() => {
    checkForJWTToken();
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem('tokenJWT');
    setIsLoggedIn(false);
  };

  const loginHandler = async (authRequest, customConfig) => {
    const response = await axios.post('http://localhost:8080/api/auth/authenticate', authRequest, customConfig);
    let resObj = response.data;
    localStorage.setItem('tokenJWT', JSON.stringify(resObj));

    setIsLoggedIn(true);
    return response;
  };

  const signUpHandler = async (registerRequest, customConfig) => {
    const response = await axios.post('http://localhost:8080/api/auth/register', registerRequest, customConfig);
    localStorage.setItem('tokenJWT', JSON.stringify(response.data));
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
        setIsLoading
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
