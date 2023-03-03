import React, { Fragment, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom';

import { Box, Stepper, Step, StepButton, Stack } from '@mui/material';
import SignUpStep from './components/SignUpStep';
import EnterpriseCreateStep from './components/EnterpriseCreateStep';
import AwaitingApprovalStep from './components/AwaitingApprovalStep';
import EmailVerificationStep from './components/EmailVerificationStep';
import { SignupContext } from './Signup.context';

const steps = ['Sign up', 'Sign up your enterprise', 'Verify your E-Mail', 'Wait for Approval'];

const SignupModal = ({ onClose }) => {
  const portalElement = document.getElementById('overlays');  
  const signUpCtx = useContext(SignupContext);

  useEffect(() => {    
    document.body.style.overflow = 'hidden';
    const cb = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
        document.body.style.overflow = '';
      }
    };
    document.addEventListener('keydown', cb);
    return () => document.removeEventListener('keydown', cb);
  }, [onClose]);

  return (
    <Fragment>
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
              maxHeight: 'min(1000px, 90%)',
              backgroundColor: 'background.default',
              borderRadius: 5,
              boxShadow: 10,
              padding: 5,
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Stepper nonLinear activeStep={signUpCtx.activeStep}>
              {steps.map((label, index) => (
                <Step key={label} completed={signUpCtx.completedSteps[index]}>
                  <StepButton type="button" onClick={() => signUpCtx.setActiveStep(index)} disabled={true}>
                    {label}
                  </StepButton>
                </Step>
              ))}
            </Stepper>
            <Stack flexGrow="1">
              {signUpCtx.activeStep === 0 && <SignUpStep />}
              {signUpCtx.activeStep === 1 && <EnterpriseCreateStep />}
              {signUpCtx.activeStep === 2 && <EmailVerificationStep />}
              {signUpCtx.activeStep === 3 && <AwaitingApprovalStep />}
            </Stack>
          </Box>
        </Box>,
        portalElement
      )}
    </Fragment>

  );
};

export default SignupModal;
