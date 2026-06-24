import { createContext, useContext, useState, type ReactNode } from 'react';
import type { SignupContextType, SignupData, SignupState } from '../types';
import AuthContext from './auth-context';

const defaultSignupState: SignupState = {
  completedSteps: Array(5).fill(false),
  currentStep: 0,
};

const defaultSignupData: SignupData = {
  email: '',
  password: '',
  confirmPassword: '',
  verificationCode: '',
  accountType: null,
  shopName: '',
  shopOwner: '',
  shopPhoneNumber: '',
  shopStreet: null,
  shopStreetText: '',
};

const defaultSignupContext: SignupContextType = {
  activeStep: 0,
  setActiveStep: () => undefined,
  completedSteps: Array(5).fill(false),
  setCompletedSteps: () => undefined,
  close: () => undefined,
  data: defaultSignupData,
  setData: () => undefined,
  signupState: defaultSignupState,
  setSignupState: () => undefined,
  signupVisible: false,
  setSignupVisible: () => undefined,
  loginVisible: false,
  setLoginVisible: () => undefined,
};

export const SignupContext = createContext<SignupContextType>(defaultSignupContext);

interface SignupProviderProps {
  children: ReactNode;
}

export const SignupProvider = ({ children }: SignupProviderProps) => {
  const [signupState, setSignupState] = useState<SignupState>(defaultSignupState);
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>(signupState.completedSteps || Array(5).fill(false));
  const [data, setData] = useState<SignupData>(defaultSignupData);
  const [signupVisible, setSignupVisible] = useState(false);
  const [loginVisible, setLoginVisible] = useState(false);

  const authCtx = useContext(AuthContext);

  const handleClose = () => {
    authCtx.onLogout();
    setSignupVisible(false);
    setActiveStep(0);
    setCompletedSteps(Array(5).fill(false));
    setData(defaultSignupData);
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
        signupState,
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
