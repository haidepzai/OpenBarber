import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import { Box, Stepper, Step, StepButton, Stack, Typography, Button } from '@mui/material';
import SignUpStep from './components/SignUpStep';
import { SignupContext } from './Signup.context';
import EnterpriseCreateStep from './components/EnterpriseCreateStep';
import AwaitingApprovalStep from './components/AwaitingApprovalStep';
import EmailVerificationStep from './components/EmailVerificationStep';

const steps = ["Sign up", "Verify your E-Mail", "Sign up your enterprise", "Wait for Approval"]

const SignupModal = ({ onClose }) => {
  const portalElement = document.getElementById('overlays');

  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(
    Array(4).fill(false)
  );
  const [data, setData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    verificationCode: '',

    enterpriseName: '',
    firstShopName: '',
    shopPhone: '',
    shopDescription: '',
    shopEmail: '',
    shopHeaderUrl: '',
    shopWebsite: '',
    shopServices: [],
  });

  useEffect(() => {
    const cb = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };
    document.addEventListener('keydown', cb);
    return () => document.removeEventListener('keydown', cb);
  }, [onClose]);

  return (
    <SignupContext.Provider value={{
      activeStep,
      setActiveStep,
      completedSteps,
      setCompletedSteps,
      close: onClose,
      data, setData
    }}>
      {ReactDOM.createPortal(
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            height: '100vh',
            width: '100vw',
            backdropFilter: 'blur(5px)',
            backgroundColor: 'rgba(0,0,0,0.2)',
            zIndex: 50,
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <Box
            sx={{
              width: 'min(2000px, 90%)',
              height: 'min(1000px, 90%)',
              backgroundColor: 'background.default',
              borderRadius: 5,
              boxShadow: 10,
              padding: 5,
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Stepper nonLinear activeStep={activeStep}>
              {steps.map((label, index) => (
                <Step key={label} completed={completedSteps[index]}>
                  <StepButton
                    type="button"
                    onClick={() => setActiveStep(index)}
                    disabled={completedSteps.slice(0, index).some(e=>!e)}
                  >
                    {label}
                  </StepButton>
                </Step>
              ))}
            </Stepper>
            <Stack flexGrow="1">
              {activeStep === 0 && <SignUpStep />}
              {activeStep === 1 && <EmailVerificationStep />}
              {activeStep === 2 && <EnterpriseCreateStep /> }
              {activeStep === 3 && <AwaitingApprovalStep /> }
            </Stack>
          </Box>
        </Box>,
        portalElement
      )}
    </SignupContext.Provider>
  );
};

export default SignupModal;
