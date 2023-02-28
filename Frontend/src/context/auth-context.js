import axios from 'axios';
import React, { useEffect, useState } from 'react';

//Default Werte des Context (werden unten im Provider dann gesetzt)
const AuthContext = React.createContext({
  isLoggedIn: false,
  onLogout: () => {},
  onLogin: (email, password) => {},
});

export const AuthContextProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginVisible, setLoginVisible] = useState(false);
  const [signupVisible, setSignupVisible] = useState(false);

  const deleteJWTTokenFromStorage = () => {
    let token = localStorage.getItem('tokenJWT');
    if (token) {
      localStorage.removeItem('tokenJWT');
    }
  };

  const checkForJWTToken = () => {
    let token = localStorage.getItem('isLoggedIn');
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
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  const loginHandler = async (authRequest, customConfig) => {
    const response = await axios.post('http://localhost:8080/api/auth/authenticate', authRequest, customConfig);
    let resObj = response.data;
    localStorage.setItem('tokenJWT', JSON.stringify(resObj));
    let storedObj = JSON.parse(localStorage.getItem('tokenJWT'));
    console.log('Token from local storage:' + storedObj.token);

    localStorage.setItem('isLoggedIn', '1');
    setIsLoggedIn(true);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        onLogout: logoutHandler,
        onLogin: loginHandler,
        deleteJWTTokenFromStorage,
        checkForJWTToken,
        loginVisible,
        signupVisible,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
