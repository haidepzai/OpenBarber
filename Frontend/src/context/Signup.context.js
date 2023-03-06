import { createContext, useContext, useState } from 'react';
import AuthContext from './auth-context';

export const SignupContext = createContext();

export const SignupProvider = ({ children }) => {
  const [signupState, setSignupState] = useState({
    completedSteps: [false, false, false, false],
    currentStep: 0,
  });
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(signupState.completedSteps || Array(4).fill(false));
  const [data, setData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    verificationCode: '',

    enterpriseName: '',
    enterpriseOwner: '',
    enterprisePhoneNumber: '',
    enterpriseStreet: null,
  });
  const [signupVisible, setSignupVisible] = useState(false);
  const [loginVisible, setLoginVisible] = useState(false);

  const authCtx = useContext(AuthContext);

  const handleClose = () => {
    authCtx.onLogout(); //delete token if close sign up process
    setSignupVisible(false);
    document.body.style.overflow = '';
  };

  return (
    <SignupContext.Provider
      value={{
        activeStep,
        setActiveStep,
        completedSteps,
        setCompletedSteps,
        close: handleClose,
        data,
        setData,
        signupState: signupState,
        setSignupState,
        signupVisible,
        setSignupVisible,
        loginVisible,
        setLoginVisible,
      }}
    >
      {children}
    </SignupContext.Provider>
  );
};
