import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import { Box, Stepper, Step, StepButton } from '@mui/material';
import SignUpStep from './components/SignUpStep';
import { SignupContext } from './Signup.context';
import EnterpriseCreateStep from './components/EnterpriseCreateStep';

const steps = ["Sign up", "Verify your E-Mail", "Sign up your enterprise", "Wait for Approval"]

const SignupModal = ({ onClose }) => {
  const portalElement = document.getElementById('overlays');

  const [activeStep, setActiveStep] = useState(0);
  const [finished, setFinished] = useState({
    0: false,
    1: false,
    2: false,
    3: false,
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
      finished,
      setFinished,
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
              width: 'min(1600px, 90%)',
              height: 'min(800px, 90%)',
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
                <Step key={label} completed={false}>
                  <StepButton
                    type="button"
                    onClick={() => {}}
                    disabled={false}
                  >
                    {label}
                  </StepButton>
                </Step>
              ))}
            </Stepper>
            <Box>
              {activeStep === 0 && <SignUpStep />}
              {activeStep === 1 && (
                <Box>Email Verification</Box>
              )}
              {activeStep === 2 && <EnterpriseCreateStep /> }
              {activeStep === 3 && (
                <Box>Wait for Approval</Box>
              )}
            </Box>
          </Box>
        </Box>,
        portalElement
      )}
    </SignupContext.Provider>
  );
};

export default SignupModal;
